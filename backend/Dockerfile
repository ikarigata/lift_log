FROM openjdk:21-jdk-slim

WORKDIR /app

# Maven wrapperとpom.xmlをコピー
COPY mvnw .
COPY mvnw.cmd .
COPY .mvn .mvn
COPY pom.xml .

# ソースコードをコピー
COPY src src

# Maven wrapperの実行権限設定
RUN chmod +x ./mvnw

# jOOQコード生成を明示的に実行
RUN ./mvnw jooq-codegen:generate -Dflyway.skip=true

# アプリケーションをビルド
RUN ./mvnw compile package -DskipTests -Dflyway.skip=true

# JARファイルの場所を確認してコピー
RUN ls -la target/
RUN mv target/*.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]