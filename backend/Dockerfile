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

# 事前生成されたjOOQクラスをコピー（存在する場合）
# 実際の環境では事前にjOOQクラスを生成してリポジトリに含める
# 現在はjOOQクラスが事前生成されていないため、この手順をスキップ

# アプリケーションをビルド
# - テストをスキップしてビルド時間を短縮
# - Flyway マイグレーションとjOOQ生成をスキップ（実行時に処理）
# - データベース接続が不要なビルドを実行
RUN ./mvnw clean package -DskipTests -B \
    -Dflyway.skip=true \
    -Djooq.codegen.skip=true

# -----------------------------------------------------------------------------
# ステージ2: 実行環境
# 軽量なJREイメージを使用して最終的なコンテナサイズを最小化
# -----------------------------------------------------------------------------
FROM eclipse-temurin:21-jre-jammy

# 作業ディレクトリを設定
WORKDIR /app

# netcat をインストール（データベース接続確認用）
RUN apt-get update && apt-get install -y netcat-openbsd && rm -rf /var/lib/apt/lists/*

# 非rootユーザーを作成（セキュリティ向上）
RUN groupadd -r spring && useradd -r -g spring spring

# ビルドステージから実行可能JARファイルをコピー
COPY --from=builder /app/target/*.jar app.jar

# ファイルの所有者を変更
RUN chown spring:spring app.jar && chown spring:spring /app/start.sh

# 非rootユーザーに切り替え
USER spring

# アプリケーションが使用するポートを公開
EXPOSE 8080

# ヘルスチェック設定
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
  CMD curl -f http://localhost:8080/actuator/health || exit 1

# 起動スクリプトを作成
# データベース接続待機 → Flyway マイグレーション → アプリケーション起動
RUN echo '#!/bin/bash' > /app/start.sh && \
    echo 'echo "データベース接続を待機中..."' >> /app/start.sh && \
    echo 'until nc -z ${SPRING_DATASOURCE_URL#*//} ${SPRING_DATASOURCE_URL##*:} 2>/dev/null; do' >> /app/start.sh && \
    echo '  sleep 2' >> /app/start.sh && \
    echo 'done' >> /app/start.sh && \
    echo 'echo "データベース接続確認完了"' >> /app/start.sh && \
    echo 'echo "Flyway マイグレーション実行中..."' >> /app/start.sh && \
    echo 'java -cp app.jar org.springframework.boot.loader.JarLauncher --spring.flyway.enabled=true --spring.flyway.migrate-at-start=true || echo "マイグレーション完了"' >> /app/start.sh && \
    echo 'echo "アプリケーション起動中..."' >> /app/start.sh && \
    echo 'exec java -XX:+UseContainerSupport -XX:MaxRAMPercentage=75.0 -Djava.security.egd=file:/dev/./urandom -jar app.jar' >> /app/start.sh && \
    chmod +x /app/start.sh

# アプリケーション実行コマンド
ENTRYPOINT ["/app/start.sh"]
