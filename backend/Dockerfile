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

# jOOQクラスはビルド時に自動生成されるため、事前コピーは不要

# アプリケーションをビルド
# jOOQとFlywayはビルド時にスキップし、実行時に処理
# これによりビルド時のデータベース接続依存を回避
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

# 起動スクリプトを作成
# データベース接続待機 → アプリケーション起動
RUN echo '#!/bin/bash' > /app/start.sh && \
    echo 'set -e' >> /app/start.sh && \
    echo 'echo "データベース接続を待機中..."' >> /app/start.sh && \
    echo 'DB_HOST=$(echo $SPRING_DATASOURCE_URL | sed "s|jdbc:postgresql://||" | sed "s|/.*||" | sed "s|:.*||")' >> /app/start.sh && \
    echo 'DB_PORT=$(echo $SPRING_DATASOURCE_URL | sed "s|.*:||" | sed "s|/.*||")' >> /app/start.sh && \
    echo 'until nc -z $DB_HOST $DB_PORT; do' >> /app/start.sh && \
    echo '  echo "データベース接続待機中... ($DB_HOST:$DB_PORT)"' >> /app/start.sh && \
    echo '  sleep 2' >> /app/start.sh && \
    echo 'done' >> /app/start.sh && \
    echo 'echo "データベース接続確認完了"' >> /app/start.sh && \
    echo 'echo "アプリケーション起動中..."' >> /app/start.sh && \
    echo 'exec java -XX:+UseContainerSupport -XX:MaxRAMPercentage=75.0 -Djava.security.egd=file:/dev/./urandom -jar app.jar' >> /app/start.sh && \
    chmod +x /app/start.sh

# ファイルの所有者を変更
RUN chown spring:spring app.jar && chown spring:spring /app/start.sh

# 非rootユーザーに切り替え
USER spring

# アプリケーションが使用するポートを公開
EXPOSE 8080

# ヘルスチェック設定
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
  CMD curl -f http://localhost:8080/actuator/health || exit 1

# アプリケーション実行コマンド
# 起動スクリプトでデータベース接続確認後にアプリケーション開始
ENTRYPOINT ["/app/start.sh"]
