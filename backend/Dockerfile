# ===================================================================
# 統合Dockerfile - Spring Boot + jOOQ完全自動生成
# ===================================================================
#
# 設計哲学:
# このDockerfileは、jOOQクラスの完全自動生成を実現する統合ビルドです。
# 複雑なマルチステージ構成を避け、単一ステージで確実にビルドを完了させます。
#
# 主要な設計原則:
# 1. シンプル性: 複雑な設定を避け、理解しやすい構造
# 2. 確実性: 環境に依存しない確実なビルドプロセス
# 3. 自動化: 手動ステップを完全に排除
# 4. 透明性: 各ステップの意図を明確に文書化
#
# 従来アプローチの問題点:
# - 複雑なマルチステージ構成による失敗リスク
# - sudo依存による環境固有の問題
# - PostgreSQL初期化の複雑性
#
# 新アプローチの利点:
# - 単一ステージによる簡潔性
# - システムサービス活用による安定性
# - Maven統合ビルドによる確実性
# ===================================================================

FROM maven:3.9-eclipse-temurin-21

WORKDIR /app

# PostgreSQLサーバーとクライアントをインストール
# 設計意図: jOOQ生成のために一時的なPostgreSQLが必要
RUN apt-get update && \
    apt-get install -y postgresql postgresql-contrib && \
    rm -rf /var/lib/apt/lists/*

# Mavenプロジェクトファイルをコピー
# 設計意図: 依存関係のキャッシュ効率を最大化
COPY pom.xml .
COPY .mvn/ .mvn/
COPY mvnw .
COPY mvnw.cmd .

# 依存関係を事前ダウンロード
RUN ./mvnw dependency:go-offline -B

# ソースコードをコピー
COPY src ./src

# PostgreSQL設定とjOOQ生成、アプリケーションビルドを統合実行
# 設計意図: 単一のRUNコマンドで全プロセスを完結
# 利点: レイヤー数削減、エラー処理の簡素化、デバッグの容易さ
RUN set -e && \
    echo "=== Starting integrated build process ===" && \
    \
    # PostgreSQLサービスを開始
    # 設計意図: パッケージインストール時に作成された既存クラスターを使用
    service postgresql start && \
    \
    # データベースとユーザーを作成（postgres権限で実行）
    su - postgres -c 'createdb lift_log' && \
    su - postgres -c "psql -c \"ALTER USER postgres PASSWORD 'postgres';\"" && \
    \
    # PostgreSQL接続設定を簡素化
    # 設計意図: ビルド時の簡単な接続のため認証を無効化
    # 正確なPostgreSQLバージョンディレクトリを特定して設定
    PG_VERSION=$(ls /etc/postgresql/) && \
    echo "local all all trust" > /etc/postgresql/$PG_VERSION/main/pg_hba.conf && \
    echo "host all all 127.0.0.1/32 trust" >> /etc/postgresql/$PG_VERSION/main/pg_hba.conf && \
    echo "host all all ::1/128 trust" >> /etc/postgresql/$PG_VERSION/main/pg_hba.conf && \
    \
    # PostgreSQLを再起動して設定を反映
    service postgresql restart && \
    \
    # 接続確認
    pg_isready -h localhost -p 5432 && \
    echo "PostgreSQL ready for jOOQ generation" && \
    \
    # 統合Mavenビルド: Flyway → jOOQ → コンパイル → パッケージング
    # 設計意図: 単一のMavenライフサイクルで全工程を実行
    # 利点: build-helper-maven-pluginが生成ソースを自動認識
    echo "Running integrated Maven build..." && \
    ./mvnw clean package -DskipTests \
        -Dspring.datasource.url=jdbc:postgresql://localhost:5432/lift_log \
        -Dspring.datasource.username=postgres \
        -Dspring.datasource.password=postgres && \
    \
    echo "Build completed successfully" && \
    \
    # PostgreSQLサービスを停止（クリーンアップ）
    service postgresql stop && \
    \
    # 生成されたJARファイルを確認
    ls -la target/*.jar

# ポート公開
EXPOSE 8080

# アプリケーション起動
# 設計意図: 実行時は外部データベースに接続
# Docker Compose環境では環境変数でデータベース接続情報を設定
ENTRYPOINT ["java", "-jar", "target/lift_log-0.0.1-SNAPSHOT.jar"]

# ===================================================================
# 使用方法とメンテナンス指針
# ===================================================================
#
# ビルド方法:
#   docker-compose build backend
#
# 設計上の重要な決定:
#   - 統合ビルド: jOOQ生成とアプリケーションビルドを単一プロセスで実行
#     理由: Maven build-helper-pluginとの完全統合
#   - システムサービス活用: PostgreSQLをsystemdサービスとして使用
#     理由: 複雑な手動初期化を回避
#   - 単一ステージ: マルチステージの複雑性を排除
#     理由: デバッグとメンテナンスの簡素化
#
# トラブルシューティング:
#   - PostgreSQL起動失敗: service postgresql status で状態確認
#   - jOOQ生成失敗: マイグレーションファイルのSQL構文確認
#   - Maven依存関係エラー: pom.xml変更後は --no-cache でビルド
#
# パフォーマンス最適化:
#   - 依存関係キャッシュ: pom.xml変更時のみ再ダウンロード
#   - 統合ビルド: 複数のMaven実行を単一ライフサイクルに統合
#   - レイヤー最適化: 変更頻度に応じたCOPY順序
# ===================================================================
