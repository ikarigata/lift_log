# ステージ1: Mavenでアプリケーションをビルド
FROM maven:3.9-eclipse-temurin-21 AS builder

WORKDIR /app

# Dockerキャッシュを活用するため、最初にpom.xmlとMaven Wrapperをコピー
COPY pom.xml .
COPY .mvn/ .mvn/
COPY mvnw .
COPY mvnw.cmd .

# アプリケーションのソースコードをコピー
COPY src ./src

# jOOQの生成されたクラスをコピー（事前に生成済み）
COPY target/generated-sources/ target/generated-sources/

# アプリケーションをビルド（jOOQクラスが既に存在すると仮定）
RUN ./mvnw package -DskipTests -Dflyway.skip=true -Djooq.codegen.skip=true

# ステージ2: 最終的なより小さなイメージを作成
FROM eclipse-temurin:21-jre-jammy

WORKDIR /app

# ビルダーステージから実行可能なjarファイルをコピー
COPY --from=builder /app/target/*.jar app.jar

# アプリが実行されるポートを公開
EXPOSE 8080

# アプリケーションを実行するコマンド
# Spring Bootアプリは実行時に埋め込みのapplication.ymlを使用するが、
# データソースURLはdocker-composeの環境変数によって上書きされる
ENTRYPOINT ["java", "-jar", "app.jar"]
