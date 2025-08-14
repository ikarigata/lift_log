#!/bin/bash
# シンプルデプロイ用 GitHub Secrets セットアップスクリプト

set -e

echo "🚀 シンプルデプロイ用セットアップスクリプト"
echo "======================================"

# GitHub CLI の確認
if ! command -v gh &> /dev/null; then
    echo "❌ GitHub CLI (gh) がインストールされていません"
    echo "インストール方法: https://cli.github.com/"
    exit 1
fi

# 認証確認
if ! gh auth status &> /dev/null; then
    echo "❌ GitHub CLI の認証が必要です"
    echo "実行してください: gh auth login"
    exit 1
fi

echo "✅ GitHub CLI の確認完了"

# Terraformの出力値を取得
echo "📋 Terraformの出力値を取得中..."
cd terraform

if ! terraform output &> /dev/null; then
    echo "❌ Terraform出力が取得できません"
    echo "terraform apply を実行してインフラを構築してください"
    exit 1
fi

EC2_HOST=$(terraform output -raw public_ip 2>/dev/null || echo "")
if [ -z "$EC2_HOST" ]; then
    echo "❌ TerraformからパブリックIPが取得できませんでした"
    exit 1
fi

echo "🌐 EC2サーバー: $EC2_HOST"
cd ..

# SSH秘密鍵の確認
SSH_KEY_PATH="./lift-log-key"
if [ ! -f "$SSH_KEY_PATH" ]; then
    echo "❌ SSH秘密鍵が見つかりません: $SSH_KEY_PATH"
    echo "プロジェクトルートで以下のコマンドを実行して鍵を作成してください:"
    echo "ssh-keygen -t rsa -b 4096 -f ./lift-log-key -N \"\""
    exit 1
fi

# .envファイルの準備
ENV_FILE="aws-deploy/.env.aws"
if [ ! -f "$ENV_FILE" ]; then
    echo "📝 .envファイルを作成してください"
    cp aws-deploy/.env.aws.template "$ENV_FILE"
    echo ""
    echo "⚠️  重要: $ENV_FILE を編集して本番用の値を設定してください："
    echo "  - POSTGRES_PASSWORD (強固なパスワード)"
    echo "  - JWT_SECRET (長いランダム文字列)"
    echo "  - その他必要な設定"
    echo ""
    read -p "設定が完了したら Enter を押してください..."
fi

if [ ! -f "$ENV_FILE" ]; then
    echo "❌ $ENV_FILE が見つかりません"
    exit 1
fi

echo "✅ .envファイル確認完了: $ENV_FILE"

# GitHub Secretsの設定
echo ""
echo "🔐 GitHub Secretsを設定中..."

# SSH秘密鍵の設定
echo "Setting SSH_PRIVATE_KEY..."
gh secret set SSH_PRIVATE_KEY --body-file "$SSH_KEY_PATH"

# サーバー情報の設定
echo "Setting server info..."
gh secret set EC2_HOST --body "$EC2_HOST"
gh secret set EC2_USER --body "ec2-user"

# .envファイルの内容をBase64エンコードして設定
echo "Setting ENV_FILE_CONTENT..."
ENV_CONTENT=$(base64 -w 0 "$ENV_FILE")
gh secret set ENV_FILE_CONTENT --body "$ENV_CONTENT"

echo "✅ GitHub Secrets の設定完了"

# EC2サーバーの初期セットアップ確認
echo ""
echo "🔧 EC2サーバーの初期セットアップを確認中..."

ssh -i "$SSH_KEY_PATH" -o StrictHostKeyChecking=no "ec2-user@$EC2_HOST" << 'EOF'
# 必要なディレクトリの作成
sudo mkdir -p /opt/lift-log/app
sudo chown -R ec2-user:ec2-user /opt/lift-log

echo "✅ EC2サーバーの準備完了"
EOF

echo ""
echo "🎉 セットアップ完了！"
echo ""
echo "📝 使用方法:"
echo "1. mainブランチにプッシュ → 自動デプロイ実行"
echo "2. 手動デプロイ: ./scripts/simple-deploy.sh"
echo ""
echo "🔗 ワークフロー確認: https://github.com/$(gh repo view --json name,owner -q '.owner.login + "/" + .name')/actions"