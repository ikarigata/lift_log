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

# データベース接続用のビルド引数を定義
# これらはビルド時にdocker-compose.ymlから渡される
ARG DB_URL=jdbc:postgresql://db:5432/lift_log
ARG DB_USER=postgres
ARG DB_PASS=postgres

# Mavenに直接データベースプロパティを渡してアプリケーションをビルド
# これにより、ビルドプロセス中にapplication.ymlで定義されたプロパティが上書きされる
# FlywayおよびjOOQプラグインはこれらのプロパティを使用する
RUN ./mvnw package -DskipTests \
    -Dspring.datasource.url=${DB_URL} \
    -Dspring.datasource.username=${DB_USER} \
    -Dspring.datasource.password=${DB_PASS}

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
