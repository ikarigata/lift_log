# ステージ1: Reactアプリケーションをビルド
FROM node:20-alpine AS builder

WORKDIR /app

# Dockerキャッシュを活用するため、最初にpackage.jsonとpackage-lock.jsonをコピー
COPY package*.json ./

# 依存関係をインストール
RUN npm install

# アプリケーションのソースコードの残りをコピー
COPY . .

# 本番用にアプリケーションをビルド
# VITE_API_BASE_URLは設定されず、相対パスにフォールバックする
RUN npm run build

# ステージ2: Nginxでアプリケーションを提供
FROM nginx:alpine

# カスタムNginx設定をコピー
COPY nginx.conf /etc/nginx/conf.d/default.conf

# ビルダーステージからビルドされた静的ファイルをコピー
COPY --from=builder /app/dist /usr/share/nginx/html

# ポート80を公開
EXPOSE 80

# Nginxを開始
CMD ["nginx", "-g", "daemon off;"]
