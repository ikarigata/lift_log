# =============================================================================
# Spring Boot バックエンド用 マルチステージ Dockerfile
# FlywayマイグレーションとjOOQコード生成に対応
# =============================================================================

# -----------------------------------------------------------------------------
# ステージ1: ビルド環境
# Maven を使用してアプリケーションをビルド
# FlywayマイグレーションとjOOQコード生成を実行するためDB接続が必要
# -----------------------------------------------------------------------------
FROM maven:3.9-eclipse-temurin-21 AS builder

# 作業ディレクトリを設定
WORKDIR /app

# ビルド引数を定義（docker-compose.ymlから渡される）
ARG DB_URL
ARG DB_USER
ARG DB_PASSWORD

# 環境変数として設定（Mavenプラグインが参照）
ENV SPRING_DATASOURCE_URL=${DB_URL}
ENV SPRING_DATASOURCE_USERNAME=${DB_USER}
ENV SPRING_DATASOURCE_PASSWORD=${DB_PASSWORD}

# Dockerレイヤーキャッシュを最適化するため、依存関係ファイルを先にコピー
COPY pom.xml .
COPY .mvn/ .mvn/
COPY mvnw .
COPY mvnw.cmd .

# Maven Wrapperに実行権限を付与
RUN chmod +x mvnw

# 依存関係のダウンロード（キャッシュ効率化）
RUN ./mvnw dependency:go-offline -B

# アプリケーションソースコードをコピー
COPY src ./src

# データベース接続の待機スクリプトを追加
RUN apt-get update && apt-get install -y postgresql-client && rm -rf /var/lib/apt/lists/*

# データベース接続を待機してからビルド実行
# 1. PostgreSQLの接続確認
# 2. Flyway マイグレーション実行（generate-sourcesフェーズ）
# 3. jOOQ コード生成実行（generate-sourcesフェーズ）
# 4. アプリケーションビルド
RUN echo "#!/bin/bash" > wait-for-db.sh && \
    echo "until pg_isready -h \$(echo \$SPRING_DATASOURCE_URL | sed 's/.*\/\/\([^:]*\).*/\1/') -p 5432; do" >> wait-for-db.sh && \
    echo "  echo 'データベース接続を待機中...'" >> wait-for-db.sh && \
    echo "  sleep 2" >> wait-for-db.sh && \
    echo "done" >> wait-for-db.sh && \
    echo "echo 'データベース接続確認完了 - ビルド開始'" >> wait-for-db.sh && \
    chmod +x wait-for-db.sh

# アプリケーションをビルド
# - テストをスキップしてビルド時間を短縮
# - Flyway マイグレーションが自動実行される
# - jOOQ コード生成が自動実行される
RUN ./mvnw clean package -DskipTests -B

# -----------------------------------------------------------------------------
# ステージ2: 実行環境
# 軽量なJREイメージを使用して最終的なコンテナサイズを最小化
# -----------------------------------------------------------------------------
FROM eclipse-temurin:21-jre-jammy

# 作業ディレクトリを設定
WORKDIR /app

# 非rootユーザーを作成（セキュリティ向上）
RUN groupadd -r spring && useradd -r -g spring spring

# ビルドステージから実行可能JARファイルをコピー
COPY --from=builder /app/target/*.jar app.jar

# ファイルの所有者を変更
RUN chown spring:spring app.jar

# 非rootユーザーに切り替え
USER spring

# アプリケーションが使用するポートを公開
EXPOSE 8080

# ヘルスチェック設定
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
  CMD curl -f http://localhost:8080/actuator/health || exit 1

# アプリケーション実行コマンド
# JVMオプションでメモリ使用量を最適化
ENTRYPOINT ["java", \
    "-XX:+UseContainerSupport", \
    "-XX:MaxRAMPercentage=75.0", \
    "-Djava.security.egd=file:/dev/./urandom", \
    "-jar", \
    "app.jar"]
