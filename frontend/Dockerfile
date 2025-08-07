# --- ビルドステージ ---
# Node.js 20の軽量なAlpineイメージをベースにします。
# 'AS build' でこのステージに 'build' という名前を付け、後で参照できるようにします。
FROM node:20-alpine AS build

# アプリケーションの作業ディレクトリを作成します。
WORKDIR /app

# package.jsonとpackage-lock.jsonを先にコピーします。
# これにより、依存関係が変更されない限り、npmはキャッシュされたレイヤーを使用できるため、ビルドが高速化します。
COPY package*.json ./

# package.jsonに基づいてNode.jsの依存関係をインストールします。
RUN npm install

# アプリケーションのソースコードと設定ファイルをすべてコピーします。
COPY . .

# package.jsonの 'build' スクリプトを実行して、本番用にReactアプリケーションをビルドします。
# 通常、これにより 'dist' ディレクトリに静的ファイルが生成されます。
RUN npm run build

# --- 実行ステージ ---
# 軽量な公式Nginxイメージをベースにします。
# これにより、最終的なイメージサイズが小さく保たれます。
FROM nginx:stable-alpine

# ビルドステージ('build')で生成された静的アセットを、Nginxがデフォルトで静的コンテンツを配信するディレクトリにコピーします。
COPY --from=build /app/dist /usr/share/nginx/html

# カスタムNginx設定ファイルを、コンテナのデフォルト設定ファイルとしてコピーします。
# この設定ファイルには、APIリクエストをバックエンドにプロキシするルールなどが含まれます。
COPY nginx.conf /etc/nginx/conf.d/default.conf

# コンテナがリッスンするポートを80に設定します。これはHTTPの標準ポートです。
EXPOSE 80

# コンテナ起動時に実行されるコマンドを指定します。
# 'nginx -g "daemon off;"' でNginxサーバーをフォアグラウンドで起動します。
# これにより、Dockerコンテナが正常に実行し続けることができます。
CMD ["nginx", "-g", "daemon off;"]
