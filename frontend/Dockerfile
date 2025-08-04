# =============================================================================
# React フロントエンド用 マルチステージ Dockerfile
# Vite ビルドシステムとNginx配信に対応
# =============================================================================

# -----------------------------------------------------------------------------
# ステージ1: ビルド環境
# Node.js を使用してReactアプリケーションをビルド
# -----------------------------------------------------------------------------
FROM node:20-alpine AS builder

# 作業ディレクトリを設定
WORKDIR /app

# package.json と package-lock.json をコピー
# Dockerレイヤーキャッシュを最適化するため依存関係ファイルを先にコピー
COPY package*.json ./

# 依存関係をインストール
# npm ci を使用して本番環境向けの高速で信頼性の高いインストール
RUN npm ci

# アプリケーションソースコードをコピー
COPY . .

# 本番用にアプリケーションをビルド
# Vite が dist/ ディレクトリに最適化されたファイルを生成
# 環境変数 VITE_API_BASE_URL は設定せず、相対パスを使用
# （Nginxプロキシ経由でバックエンドにアクセス）
RUN npm run build

# ビルド結果を確認（デバッグ用）
RUN ls -la dist/

# -----------------------------------------------------------------------------
# ステージ2: 配信環境
# Nginx を使用してSPAの配信とAPIプロキシを提供
# -----------------------------------------------------------------------------
FROM nginx:alpine

# カスタムNginx設定ファイルをコピー
# SPAルーティングとAPIプロキシ設定を含む
COPY nginx.conf /etc/nginx/conf.d/default.conf

# ビルドステージから静的ファイルをコピー
COPY --from=builder /app/dist /usr/share/nginx/html

# Nginxプロセス用の非rootユーザーを作成
RUN addgroup -g 1001 -S nginx-user && \
    adduser -S -D -H -u 1001 -h /var/cache/nginx -s /sbin/nologin -G nginx-user -g nginx-user nginx-user

# 必要なディレクトリの権限を設定
RUN chown -R nginx-user:nginx-user /var/cache/nginx && \
    chown -R nginx-user:nginx-user /var/log/nginx && \
    chown -R nginx-user:nginx-user /etc/nginx/conf.d && \
    touch /var/run/nginx.pid && \
    chown -R nginx-user:nginx-user /var/run/nginx.pid

# 静的ファイルの権限を設定
RUN chown -R nginx-user:nginx-user /usr/share/nginx/html

# 非rootユーザーに切り替え
USER nginx-user

# HTTPポートを公開
EXPOSE 80

# ヘルスチェック設定
HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:80/ || exit 1

# Nginx をフォアグラウンドで実行
CMD ["nginx", "-g", "daemon off;"]
