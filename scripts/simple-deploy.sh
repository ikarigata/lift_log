#!/bin/bash
# 手動でのシンプルデプロイスクリプト

set -e

echo "🚀 シンプルデプロイスクリプト"
echo "=========================="

# 前提条件チェック
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

# SSH鍵の確認
SSH_KEY="./lift-log-key"
if [ ! -f "$SSH_KEY" ]; then
    echo "❌ SSH鍵が見つかりません: $SSH_KEY"
    echo "プロジェクトルートで以下のコマンドを実行して鍵を作成してください:"
    echo "ssh-keygen -t rsa -b 4096 -f ./lift-log-key -N \"\""
    exit 1
fi

# .envファイルの確認
ENV_FILE="$PROJECT_ROOT/aws-deploy/.env.aws"
if [ ! -f "$ENV_FILE" ]; then
    echo "❌ .envファイルが見つかりません: $ENV_FILE"
    echo "aws-deploy/.env.aws.template をコピーして設定してください"
    exit 1
fi

# Terraformからサーバー情報取得
echo "📋 Terraformからサーバー情報を取得中..."
cd "$PROJECT_ROOT/terraform"

if ! terraform output &> /dev/null; then
    echo "❌ Terraform出力が取得できません"
    exit 1
fi

EC2_HOST=$(terraform output -raw public_ip 2>/dev/null || echo "")
if [ -z "$EC2_HOST" ]; then
    echo "❌ サーバーIPが取得できませんでした"
    exit 1
fi

EC2_USER="ec2-user"
echo "🌐 サーバー: $EC2_USER@$EC2_HOST"

cd "$PROJECT_ROOT"

# 確認プロンプト
echo ""
echo "⚠️  以下にデプロイを実行します:"
echo "   サーバー: $EC2_HOST"
echo "   .envファイル: $ENV_FILE"
echo ""
read -p "デプロイを実行しますか？ (y/N): " -r
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "デプロイをキャンセルしました"
    exit 0
fi

# .envファイルをサーバーに配置
echo ""
echo "📤 .envファイルをサーバーにコピー中..."
scp -i "$SSH_KEY" -o StrictHostKeyChecking=no "$ENV_FILE" "$EC2_USER@$EC2_HOST":/opt/lift-log/app/.env

# プロジェクトをサーバーに同期
echo "📤 プロジェクトをサーバーに同期中..."
rsync -avz --delete \
    --exclude='.git' \
    --exclude='node_modules' \
    --exclude='target' \
    --exclude='*.log' \
    -e "ssh -i $SSH_KEY -o StrictHostKeyChecking=no" \
    "$PROJECT_ROOT/" "$EC2_USER@$EC2_HOST":/opt/lift-log/app/

# サーバーでデプロイ実行
echo ""
echo "🚀 サーバーでデプロイを実行中..."
ssh -i "$SSH_KEY" -o StrictHostKeyChecking=no "$EC2_USER@$EC2_HOST" << 'EOF'
set -e

cd /opt/lift-log/app

echo "🛑 既存サービスを停止中..."
docker-compose -f aws-deploy/docker-compose.aws.yml down 2>/dev/null || true

echo "🏗️  アプリケーションをビルド・起動中..."
docker-compose -f aws-deploy/docker-compose.aws.yml up -d --build

echo "⏳ サービス起動を待機中..."
sleep 30

echo "🔍 ヘルスチェック実行中..."
for i in {1..10}; do
    if curl -f http://localhost/api/actuator/health >/dev/null 2>&1; then
        echo "✅ デプロイ成功！アプリケーションが正常に動作しています"
        break
    elif [ $i -eq 10 ]; then
        echo "❌ ヘルスチェックに失敗しました"
        echo "📊 コンテナ状況:"
        docker-compose -f aws-deploy/docker-compose.aws.yml ps
        echo "📝 ログを確認してください:"
        echo "docker-compose -f aws-deploy/docker-compose.aws.yml logs"
    else
        echo "⏳ 待機中... ($i/10)"
        sleep 15
    fi
done

echo ""
echo "📊 最終的なコンテナ状況:"
docker-compose -f aws-deploy/docker-compose.aws.yml ps

echo ""
echo "🧹 古いイメージのクリーンアップ..."
docker image prune -f >/dev/null 2>&1 || true
EOF

echo ""
echo "🎉 デプロイ完了！"
echo ""
echo "🔗 アクセスURL: http://$EC2_HOST"
echo "🔧 サーバー接続: ssh -i $SSH_KEY $EC2_USER@$EC2_HOST"
echo ""
echo "📝 ログ確認:"
echo "ssh -i $SSH_KEY $EC2_USER@$EC2_HOST 'cd /opt/lift-log/app && docker-compose -f aws-deploy/docker-compose.aws.yml logs -f'"