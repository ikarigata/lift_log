# シンプルデプロイスクリプト

このディレクトリには、Lift LogアプリケーションのAWSへのシンプルなデプロイスクリプトが含まれています。

## 📁 ファイル構成

```
scripts/
├── setup-simple-deploy.sh    # GitHub Secrets初期設定
├── simple-deploy.sh          # 手動デプロイスクリプト  
└── README.md                 # このファイル
```

## 🚀 初回セットアップ手順

### 1. Terraformでインフラ構築
```bash
cd terraform
terraform init
terraform plan
terraform apply
```

### 2. .envファイルの準備
```bash
# テンプレートから本番用設定ファイルを作成
cp aws-deploy/.env.aws.template aws-deploy/.env.aws

# 重要な値を設定
nano aws-deploy/.env.aws
```

**必須設定項目:**
```bash
# 強固なパスワード生成
POSTGRES_PASSWORD=$(openssl rand -base64 24)

# JWT秘密鍵生成  
JWT_SECRET=$(openssl rand -hex 32)
```

### 3. GitHub Secrets設定
```bash
# GitHub CLI認証（初回のみ）
gh auth login

# Secretsの自動設定
./scripts/setup-simple-deploy.sh
```

## 🔄 使用方法

### 自動デプロイ（推奨）
```bash
# mainブランチにプッシュ → 自動デプロイ実行
git push origin main
```

### 手動デプロイ
```bash
# 手動でデプロイ実行
./scripts/simple-deploy.sh
```

## 📋 デプロイの流れ

1. **テスト実行** - バックエンド・フロントエンドの軽量テスト
2. **.env配置** - サーバーに環境変数ファイルをコピー
3. **コード同期** - プロジェクト全体をサーバーに同期
4. **アプリ再起動** - Docker Composeで再ビルド・再起動
5. **ヘルスチェック** - アプリケーションの動作確認

## 🔐 必要な設定

### GitHub Secrets
自動設定される項目:
- `SSH_PRIVATE_KEY` - SSH秘密鍵
- `EC2_HOST` - サーバーのIPアドレス  
- `EC2_USER` - SSHユーザー名 (ec2-user)
- `ENV_FILE_CONTENT` - .envファイルの内容（Base64エンコード済み）

### AWS設定
- SSH鍵ペア (`./lift-log-key`) - プロジェクト直下に配置
- セキュリティグループでSSH許可
- EC2インスタンス稼働中

## 🐛 トラブルシューティング

### よくある問題

#### 1. SSH接続エラー
```bash
# IPアドレス制限を確認・更新
curl ifconfig.me
cd terraform
terraform apply -var="allowed_ssh_cidrs=[\"新しいIP/32\"]"
```

#### 2. .envファイル設定不備
```bash
# サーバー上で直接編集
ssh -i ~/.ssh/lift-log-key ec2-user@EC2_HOST
nano /opt/lift-log/app/.env
```

#### 3. アプリケーション起動エラー  
```bash
# サーバー上でログ確認
ssh -i ~/.ssh/lift-log-key ec2-user@EC2_HOST
cd /opt/lift-log/app
docker-compose -f aws-deploy/docker-compose.aws.yml logs
```

### ログ確認コマンド
```bash
# GitHub Actions実行履歴
gh run list

# サーバー上のリアルタイムログ
ssh -i ~/.ssh/lift-log-key ec2-user@EC2_HOST \
  'cd /opt/lift-log/app && docker-compose -f aws-deploy/docker-compose.aws.yml logs -f'
```

## 📊 メンテナンス

### 定期的なタスク
```bash
# サーバーリソース確認
ssh -i ~/.ssh/lift-log-key ec2-user@EC2_HOST "htop; df -h"

# Dockerクリーンアップ
ssh -i ~/.ssh/lift-log-key ec2-user@EC2_HOST "docker system prune -f"
```

## 🎯 このアプローチの利点

- **シンプル**: 複雑なContainer Registryなし
- **高速**: rsyncによる差分同期
- **直感的**: .envファイル直接管理
- **柔軟**: サーバー上で即座に設定変更可能
- **コスト効率**: 追加サービス不要

## 🔗 参考コマンド

```bash
# 手動デプロイ
./scripts/simple-deploy.sh

# サーバー接続
ssh -i ./lift-log-key ec2-user@$(cd terraform && terraform output -raw public_ip)

# アプリケーション再起動
ssh -i ./lift-log-key ec2-user@EC2_HOST \
  'cd /opt/lift-log/app && docker-compose -f aws-deploy/docker-compose.aws.yml restart'
```