# Nginx API 403エラー調査結果と解決策

## 問題の概要

### 症状
- **静的ファイル（フロントエンド）**: 正常アクセス可能
- **API（POST /api/v1/users）**: 403エラー発生
- **両方ともCloudflare経由で同じクライアント証明書使用**

### 発生環境
- Cloudflareオリジンプル認証有効（ssl_verify_client on）
- Nginx + Spring Boot構成
- Docker環境

## 調査結果

### 重要な発見

#### 1. Real IP設定の問題
```bash
# 現在の設定（nginx.prod.conf）
set_real_ip_from 173.245.48.0/20;
real_ip_header CF-Connecting-IP;
```
- `set_real_ip_from`がDockerの`/etc/nginx/conf.d/`形式では**無効**
- Real IP設定が機能していない

#### 2. SSL証明書認証の失敗
- CloudflareのIPが正しく処理されない
- クライアント証明書認証でAPIアクセスが拒否される

#### 3. APIリクエストがバックエンドに未到達
```bash
# Spring Bootログ確認結果
=== Recent backend logs ===
# → 新規登録APIのログが存在しない
```

#### 4. 403エラーの発生源
```bash
# Nginxアクセスログ
103.5.140.138 - - [17/Aug/2025:09:50:42 +0000] "POST /api/v1/users HTTP/2.0" 403 20
```
- レスポンスサイズ20バイト → **Nginxが返している**
- Spring Bootではない

## 根本原因

**Dockerの標準Nginxイメージでは、`/etc/nginx/conf.d/*.conf`ファイルは`http`ブロック内の`server`ブロックとして読み込まれるため、`set_real_ip_from`ディレクティブが無効になる**

## 解決策

### nginx設定を完全形式に変更

#### 現在の構造（問題あり）
```nginx
# /etc/nginx/conf.d/default.conf として配置
set_real_ip_from 173.245.48.0/20;  # ← 無効
server {
    # サーバー設定
}
```

#### 修正後の構造（解決策）
```nginx
# メインnginx.confとして配置
worker_processes auto;

events {
    worker_connections 1024;
}

http {
    include /etc/nginx/mime.types;
    default_type application/octet-stream;
    
    # Real IP設定（httpブロック内で有効）
    set_real_ip_from 173.245.48.0/20;
    set_real_ip_from 103.21.244.0/22;
    set_real_ip_from 103.22.200.0/22;
    set_real_ip_from 103.31.4.0/22;
    set_real_ip_from 141.101.64.0/18;
    set_real_ip_from 108.162.192.0/18;
    set_real_ip_from 190.93.240.0/20;
    set_real_ip_from 188.114.96.0/20;
    set_real_ip_from 197.234.240.0/22;
    set_real_ip_from 198.41.128.0/17;
    set_real_ip_from 162.158.0.0/15;
    set_real_ip_from 104.16.0.0/13;
    set_real_ip_from 104.24.0.0/14;
    set_real_ip_from 172.64.0.0/13;
    set_real_ip_from 131.0.72.0/22;
    
    # Cloudflare IPv6 IP範囲
    set_real_ip_from 2400:cb00::/32;
    set_real_ip_from 2606:4700::/32;
    set_real_ip_from 2803:f800::/32;
    set_real_ip_from 2405:b500::/32;
    set_real_ip_from 2405:8100::/32;
    set_real_ip_from 2a06:98c0::/29;
    set_real_ip_from 2c0f:f248::/32;
    
    real_ip_header CF-Connecting-IP;
    real_ip_recursive on;
    
    # HTTP → HTTPS リダイレクト
    server {
        listen 80;
        server_name _;
        return 301 https://$host$request_uri;
    }
    
    # HTTPS サーバーブロック
    server {
        listen 443 ssl http2;
        server_name _;
        
        root /usr/share/nginx/html;
        index index.html;
        
        # SSL証明書設定
        ssl_certificate /etc/ssl/certs/cert.pem;
        ssl_certificate_key /etc/ssl/private/key.pem;
        
        # Cloudflare Origin Pull認証
        ssl_client_certificate /etc/ssl/certs/cloudflare-origin-pull-ca.pem;
        ssl_verify_client on;
        ssl_verify_depth 1;
        
        ssl_protocols TLSv1.2 TLSv1.3;
        
        # API プロキシ設定
        location /api/ {
            proxy_pass http://backend:8080;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }
        
        # SPA ルーティング対応
        location / {
            try_files $uri $uri/ /index.html;
        }
        
        # キャッシュ設定
        location = /index.html {
            add_header Cache-Control "no-cache, must-revalidate";
        }
        
        location ~* \.(?:css|js|mjs|png|jpg|jpeg|gif|ico|svg|webp|avif|woff2?|ttf|eot)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
    }
}
```

## 実装手順

### 1. nginx.prod.confを完全形式に修正
- 上記の完全なnginx.conf形式に変更
- worker_processes, events, httpブロックを追加
- Real IP設定をhttpブロック内に移動

### 2. Docker設定変更（必要な場合）
```yaml
# docker-compose.yml
services:
  frontend:
    volumes:
      - ./frontend/nginx.prod.conf:/etc/nginx/nginx.conf:ro  # メイン設定として
```

### 3. テスト手順
1. frontendコンテナ再起動
2. 静的ファイルアクセステスト
3. APIアクセステスト（新規登録）
4. Spring Bootログでリクエスト到達確認

## 期待される効果

- ✅ Real IP設定が正常に動作
- ✅ CloudflareのIP範囲が正しく処理される
- ✅ SSL証明書認証が静的ファイル・API両方で成功
- ✅ API 403エラーの解消
- ✅ APIリクエストがSpring Bootに正常到達

## 補足情報

### 調査で確認済みの事項
- ✅ Cloudflareオリジンプル証明書は正常に配置済み
- ✅ ssl_verify_client on設定は必須（セキュリティ維持）
- ✅ Spring Bootのロジック自体に問題なし
- ✅ Real IP設定のCloudflare IP範囲は最新

### トラブルシューティング
もし修正後も問題が続く場合：
1. Nginxエラーログで設定構文エラーを確認
2. Real IPが正しく取得されているかアクセスログで確認
3. Spring Bootログでリクエスト到達を確認

---

**作成日**: 2025-08-17  
**ステータス**: 解決策策定完了、実装待ち