FROM node:18-alpine

WORKDIR /app

# パッケージファイルをコピー
COPY package*.json ./

# 依存関係をインストール
RUN npm ci

# ソースコードをコピー
COPY . .

# ビルド時引数を定義（.envファイルからの値がデフォルト）
ARG VITE_API_BASE_URL=http://localhost:8080
ARG VITE_USE_MSW=false

# 環境変数として設定
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
ENV VITE_USE_MSW=$VITE_USE_MSW

# アプリケーションをビルド
RUN npm run build

# Nginxステージ
FROM nginx:alpine

# ビルド結果をNginxにコピー
COPY --from=0 /app/dist /usr/share/nginx/html

# Nginxの設定ファイル
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]