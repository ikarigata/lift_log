#!/bin/bash

# SSL Certificate Setup Script for Vol Log
# このスクリプトは AWS Parameter Store から SSL証明書と秘密鍵を取得し、
# docker-compose.yml のボリュームマウント設定に合わせて配置します

set -e  # エラー時に停止

echo "==================================="
echo "Vol Log SSL Certificate Setup"
echo "==================================="

# 現在のディレクトリが docker-compose.yml のある場所かチェック
if [ ! -f "docker-compose.yml" ]; then
    echo "❌ Error: docker-compose.yml が見つかりません"
    echo "   このスクリプトは docker-compose.yml があるディレクトリで実行してください"
    echo "   例: cd /opt/vol-log/app/vol_log && ./setup-ssl-certificates.sh"
    exit 1
fi

echo "✅ docker-compose.yml を確認しました"

# AWS Region を取得
echo "🔍 AWS Region を取得中..."
if command -v curl &> /dev/null; then
    AWS_REGION=$(curl -s http://169.254.169.254/latest/meta-data/placement/availability-zone 2>/dev/null | sed 's/.$//' || echo "")
fi

if [ -z "$AWS_REGION" ]; then
    # EC2 metadata が取得できない場合は環境変数またはデフォルトを使用
    AWS_REGION=${AWS_DEFAULT_REGION:-ap-northeast-1}
    echo "⚠️  Warning: EC2 metadata から region を取得できませんでした。デフォルト region を使用: $AWS_REGION"
fi

echo "📍 AWS Region: $AWS_REGION"

# SSL ディレクトリ作成（docker-compose.yml のマウント設定に合わせる）
echo "📁 SSL ディレクトリを作成中..."
mkdir -p ssl/certs ssl/private

# Parameter Store から SSL証明書を取得
echo "📜 SSL証明書を Parameter Store から取得中..."
if aws ssm get-parameter \
    --name "/vol-log/ssl/certificate" \
    --with-decryption \
    --region "$AWS_REGION" \
    --query 'Parameter.Value' \
    --output text > ssl/certs/cert.pem 2>/dev/null; then
    
    echo "✅ SSL証明書を取得しました: ssl/certs/cert.pem"
    chmod 644 ssl/certs/cert.pem
    
    # 証明書の内容確認（最初と最後の行のみ表示）
    echo "📋 証明書内容確認:"
    head -1 ssl/certs/cert.pem
    echo "   ... (省略) ..."
    tail -1 ssl/certs/cert.pem
else
    echo "❌ Error: SSL証明書の取得に失敗しました"
    echo "   Parameter Store に '/vol-log/ssl/certificate' が登録されているか確認してください"
    echo "   登録方法: SSL_SETUP_COMMANDS.md を参照"
    exit 1
fi

# Parameter Store から秘密鍵を取得
echo "🔐 SSL秘密鍵を Parameter Store から取得中..."
if aws ssm get-parameter \
    --name "/vol-log/ssl/private-key" \
    --with-decryption \
    --region "$AWS_REGION" \
    --query 'Parameter.Value' \
    --output text > ssl/private/key.pem 2>/dev/null; then
    
    echo "✅ SSL秘密鍵を取得しました: ssl/private/key.pem"
    chmod 600 ssl/private/key.pem
    
    # 秘密鍵の内容確認（最初の行のみ表示、セキュリティのため内容は表示しない）
    echo "📋 秘密鍵内容確認:"
    head -1 ssl/private/key.pem
    echo "   ... (セキュリティのため省略) ..."
else
    echo "❌ Error: SSL秘密鍵の取得に失敗しました"
    echo "   Parameter Store に '/vol-log/ssl/private-key' が登録されているか確認してください"
    echo "   登録方法: SSL_SETUP_COMMANDS.md を参照"
    exit 1
fi

# ファイル権限確認
echo "🔒 ファイル権限を確認中..."
echo "   証明書: $(ls -la ssl/certs/cert.pem | awk '{print $1 " " $3 ":" $4}')"
echo "   秘密鍵: $(ls -la ssl/private/key.pem | awk '{print $1 " " $3 ":" $4}')"

# docker-compose.yml のボリューム設定確認
echo "🐳 docker-compose.yml のボリューム設定確認..."
if grep -q "./ssl/certs:/etc/ssl/certs:ro" docker-compose.yml && grep -q "./ssl/private:/etc/ssl/private:ro" docker-compose.yml; then
    echo "✅ ボリュームマウント設定が正しく構成されています"
else
    echo "⚠️  Warning: docker-compose.yml のボリューム設定を確認してください"
fi

echo ""
echo "==================================="
echo "🎉 SSL証明書のセットアップが完了しました！"
echo "==================================="
echo ""
echo "📁 配置されたファイル:"
echo "   - ssl/certs/cert.pem (644)"
echo "   - ssl/private/key.pem (600)"
echo ""
echo "🚀 次のステップ:"
echo "   1. 本番用nginx設定を使用:"
echo "      export NGINX_CONF=./frontend/nginx.prod.conf"
echo "   2. アプリケーションを起動:"
echo "      docker-compose up -d"
echo "   3. HTTPS アクセス確認:"
echo "      https://vollog.net"
echo ""
echo "🔍 ログ確認:"
echo "   docker-compose logs frontend"
echo ""