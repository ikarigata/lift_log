# --- ビルドステージ ---
# Java 21とMaven 3.9を含む公式のEclipse Temurinイメージをベースにします。
# 'AS build' でこのステージに 'build' という名前を付け、後で参照できるようにします。
FROM maven:3.9-eclipse-temurin-21 AS build

# アプリケーションの作業ディレクトリを作成します。
WORKDIR /app

# pom.xmlファイルを先にコピーします。
# これにより、依存関係が変更されない限り、Mavenはキャッシュされたレイヤーを使用できるため、ビルドが高速化します。
COPY pom.xml .

# 依存関係をダウンロードします。'go-offline'は、後続のビルドステップをオフラインで実行できるようにします。
RUN mvn dependency:go-offline

# アプリケーションのソースコードをコピーします。
COPY src ./src

# Mavenを使ってアプリケーションをパッケージ化します。
# '-DskipTests'フラグは、テストを実行せずに時間を節約します。
# Spring Boot Maven Pluginが実行可能なJARファイルを生成します。
RUN mvn package -DskipTests

# --- 実行ステージ ---
# Java 21のJRE（Java Runtime Environment）のみを含む、より軽量なAlpineベースのイメージを使用します。
# これにより、最終的なイメージサイズが大幅に削減されます。
FROM eclipse-temurin:21-jre-alpine

# アプリケーションの作業ディレクトリを作成します。
WORKDIR /app

# ビルドステージ('build')で生成されたJARファイルを、実行ステージの/appディレクトリにコピーします。
# 'app.jar'という一貫した名前に変更することで、CMD命令を簡素化します。
COPY --from=build /app/target/*.jar app.jar

# コンテナがリッスンするポートを8080に設定します。
# これは、Spring Bootアプリケーションのデフォルトポートです。
EXPOSE 8080

# コンテナ起動時に実行されるコマンドを指定します。
# 'java -jar app.jar'でSpring Bootアプリケーションを起動します。
CMD ["java", "-jar", "app.jar"]
