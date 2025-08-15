# Lift Log AWS デプロイガイド

> **対象者**: AWS初学者  
> **前提条件**: AWSアカウント作成済み  
> **構成**: 単一EC2インスタンス + Docker Compose（コスト最適化済み）

## 📋 目次

1. [事前準備](#事前準備)
2. [AWS CLI設定](#aws-cli設定)
3. [SSH鍵ペア作成](#ssh鍵ペア作成)
4. [Terraformでインフラ構築](#terraformでインフラ構築)
5. [アプリケーションデプロイ](#アプリケーションデプロイ)
6. [SSL証明書設定（オプション）](#ssl証明書設定オプション)
7. [運用・メンテナンス](#運用メンテナンス)
8. [トラブルシューティング](#トラブルシューティング)
9. [コスト最適化](#コスト最適化)

---

## 🛠️ 事前準備

### 必要なツール

1. **AWS CLI v2**
   ```bash
   # macOS
   brew install awscli
   
   # Linux
   curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
   unzip awscliv2.zip
   sudo ./aws/install
   
   # Windows
   # https://awscli.amazonaws.com/AWSCLIV2.msi をダウンロード
   ```

2. **Terraform**
   ```bash
   # macOS
   brew install terraform
   
   # Linux
   wget https://releases.hashicorp.com/terraform/1.6.0/terraform_1.6.0_linux_amd64.zip
   unzip terraform_1.6.0_linux_amd64.zip
   sudo mv terraform /usr/local/bin/
   
   # Windows
   # https://www.terraform.io/downloads からダウンロード
   ```

3. **Git, SSH, AWS CLI Session Manager Plugin**（一部要インストール）
   ```bash
   # Session Manager Plugin インストール
   # macOS
   brew install session-manager-plugin
   
   # Linux
   curl "https://s3.amazonaws.com/session-manager-downloads/plugin/latest/linux_64bit/session-manager-plugin.rpm" -o "session-manager-plugin.rpm"
   sudo yum install -y session-manager-plugin.rpm
   
   # Windows
   # https://docs.aws.amazon.com/systems-manager/latest/userguide/session-manager-working-with-install-plugin.html
   ```

### AWSアカウント設定

1. **IAMユーザー作成**
   - AWS Console → IAM → Users → Add user
   - User name: `terraform-user`
   - Access type: Programmatic access
   - Permissions: `PowerUserAccess` または以下の最小権限ポリシー

2. **最小権限ポリシー例**（セキュリティ重視の場合）
   ```json
   {
     "Version": "2012-10-17",
     "Statement": [
       {
         "Effect": "Allow",
         "Action": [
           "ec2:*",
           "iam:CreateRole",
           "iam:CreateInstanceProfile",
           "iam:AttachRolePolicy",
           "iam:PassRole",
           "iam:ListInstanceProfiles",
           "iam:GetRole"
         ],
         "Resource": "*"
       }
     ]
   }
   ```

---

## 🔐 AWS CLI設定

1. **認証情報設定**
   ```bash
   aws configure
   ```
   
   入力項目:
   - AWS Access Key ID: `AKIA...`（IAMユーザーのアクセスキー）
   - AWS Secret Access Key: `...`（IAMユーザーのシークレットキー）
   - Default region name: `ap-northeast-1`（東京リージョン）
   - Default output format: `json`

2. **設定確認**
   ```bash
   aws sts get-caller-identity
   ```

---

## 🔑 SSH鍵ペア作成

```bash
# SSH鍵ペア生成
ssh-keygen -t rsa -b 4096 -f ~/.ssh/lift-log-key -N ""

# 公開鍵の内容を確認（後でTerraformで使用）
cat ~/.ssh/lift-log-key.pub
```

---

## 🏗️ Terraformでインフラ構築

### 1. 設定ファイル準備

1. **プロジェクトディレクトリに移動**
   ```bash
   cd /path/to/lift_log
   ```

2. **terraform.tfvars ファイル作成**
   ```bash
   cd terraform
   nano terraform.tfvars
   ```
   
   **terraform.tfvars 内容:**
   ```hcl
   # 基本設定
   aws_region = "ap-northeast-1"
   environment = "prod"
   instance_type = "t3.micro"  # Free Tier対象
   
   # ストレージ設定（コスト最適化）
   root_volume_size = 20  # GB
   data_volume_size = 20  # GB
   
   # SSH設定
   public_key = "ssh-rsa AAAAB3NzaC1yc..."  # ~/.ssh/lift-log-key.pub の内容
   allowed_ssh_cidrs = ["YOUR_IP/32"]  # あなたのIPアドレス/32
   
   # オプション設定
   domain_name = null  # 独自ドメインを使用する場合は "your-domain.com"
   additional_tags = {
     Owner = "your-name"
     Purpose = "personal-fitness-app"
   }
   ```

3. **IPアドレス確認**
   ```bash
   curl ifconfig.me
   # 結果例: 203.0.113.1
   # terraform.tfvars の allowed_ssh_cidrs に "203.0.113.1/32" を設定
   ```

4. **セキュリティ関連の環境変数設定**
   ```bash
   # セキュリティ設定（必須）
   export TF_VAR_db_password="$(openssl rand -base64 24)"
   export TF_VAR_jwt_secret="$(openssl rand -hex 32)"
   ```

### 2. Terraform実行

1. **初期化**
   ```bash
   terraform init
   ```

2. **プラン確認**
   ```bash
   terraform plan
   ```

3. **適用**
   ```bash
   terraform apply
   ```
   
   確認プロンプトで `yes` を入力

4. **出力確認**
   ```bash
   terraform output
   ```
   
   出力例:
   ```
   instance_id = "i-0123456789abcdef0"
   public_ip = "54.249.123.456"
   ssm_connection_command = "aws ssm start-session --target i-0123456789abcdef0"
   ssh_connection_command = "ssh -i ~/.ssh/lift-log-key ec2-user@54.249.123.456 (deprecated)"
   application_url_http = "http://54.249.123.456"
   ```

---

## 🚀 アプリケーションデプロイ

### 1. EC2インスタンスに接続

```bash
# SSM接続（推奨方法）
# terraform outputで表示されたコマンドを使用
aws ssm start-session --target YOUR_INSTANCE_ID

# または、terraform outputから直接取得
aws ssm start-session --target $(terraform output -raw instance_id)

# 接続後、ec2-userに切り替え
sudo su - ec2-user

# 従来のSSH接続（非推奨、22番ポートがブロックされているため使用不可）
# ssh -i ~/.ssh/lift-log-key ec2-user@YOUR_PUBLIC_IP
```

### 2. セットアップ状況確認

```bash
# セットアップ完了確認
cat /opt/lift-log/deployment-status.txt

# Dockerサービス確認
sudo systemctl status docker
```

### 3. アプリケーションファイル配置

**方法1: Git経由でクローン（推奨）**
```bash
cd /opt/lift-log/app
git clone https://github.com/YOUR_USERNAME/lift_log.git
cd lift_log
```

**方法2: ローカルからアップロード**
```bash
# ローカルマシンで実行
scp -i ~/.ssh/lift-log-key -r /path/to/lift_log ec2-user@YOUR_PUBLIC_IP:/opt/lift-log/app/
```

### 4. 環境変数設定

```bash
cd /opt/lift-log/app/lift_log

# 環境変数ファイル作成
cp .env.example .env
nano .env
```

**重要な設定項目:**
```bash
# 必須変更項目（Terraformで生成された値を使用）
POSTGRES_PASSWORD=${TF_VAR_db_password}  # Terraformで生成されたパスワード
JWT_SECRET=${TF_VAR_jwt_secret}          # Terraformで生成されたJWTシークレット
DOMAIN_NAME=your-domain.com              # ドメインを使用する場合
SSL_EMAIL=your-email@example.com
```

**パスワード確認方法:**
```bash
# Terraform実行時に設定した値を確認
echo "DB Password: $TF_VAR_db_password"
echo "JWT Secret: $TF_VAR_jwt_secret"
```

### 5. ディレクトリ構造作成

```bash
# 必要なディレクトリを作成
sudo mkdir -p /opt/lift-log/{data/postgres,data/postgres-backups,logs/{nginx,backend},scripts}

# 権限設定
sudo chown -R ec2-user:ec2-user /opt/lift-log
```

### 6. アプリケーション起動

```bash
# データベースマイグレーション実行
docker-compose --profile migrate up flyway

# アプリケーション起動
docker-compose up -d

# ログ確認
docker-compose logs -f
```

### 7. 動作確認

```bash
# コンテナ状況確認
docker ps

# アプリケーションアクセステスト
curl http://localhost/api/actuator/health

# ブラウザでアクセス
# http://YOUR_PUBLIC_IP
```

---

## 🔒 SSL証明書設定（オプション）

### 前提条件
- 独自ドメインの取得
- ドメインのDNS設定でAレコードをEC2のパブリックIPに設定

### 1. Let's Encrypt証明書取得

```bash
# 注意: 現在の構成ではCertbot自動化は含まれていません
# 手動でのSSL証明書設定が必要です
# または別途Certbotを設定してください
```

### 2. SSL設定でNginx再起動

```bash
# SSL証明書を手動で配置後、コンテナ再起動
docker-compose restart frontend
```

### 3. 自動更新設定

```bash
# SSL証明書の自動更新が必要な場合は
# 別途Certbotの設定を行ってください
```

---

## 🔧 運用・メンテナンス

### 日常的な運用コマンド

```bash
# アプリケーション状況確認
docker ps
docker-compose logs --tail=50

# アプリケーション再起動
docker-compose restart

# システムリソース確認
htop
df -h
```

### バックアップ

```bash
# 手動バックアップ（例）
docker exec lift-log-db pg_dump -U postgres lift_log > backup_$(date +%Y%m%d).sql

# バックアップファイル確認
ls -la *.sql
```

### ログローテーション

自動設定済み（/etc/logrotate.d/lift-log）

### アプリケーション更新

```bash
# 新バージョンのコード取得
git pull origin main

# イメージ再ビルド
docker-compose build

# アプリケーション再起動
docker-compose up -d
```

---

## 🐛 トラブルシューティング

### 1. SSM接続できない

**症状**: `An error occurred (TargetNotConnected) when calling the StartSession operation`
```bash
# SSM Agent状態確認
aws ssm describe-instance-information --query "InstanceInformationList[?InstanceId=='YOUR_INSTANCE_ID']"

# インスタンスのIAMロール確認
aws ec2 describe-instances --instance-ids YOUR_INSTANCE_ID --query 'Reservations[*].Instances[*].IamInstanceProfile'

# Session Manager Plugin確認
session-manager-plugin

# AWS CLI設定確認
aws sts get-caller-identity
```

### 2. 従来のSSH接続エラー（参考）

**症状**: `Connection timed out`（22番ポートがブロックされているため）
```bash
# セキュリティグループでSSHポートが無効化されています
# SSM Session Managerを使用してください
```

### 2. アプリケーションが起動しない

**症状**: 500エラーまたはコンテナが停止する
```bash
# ログ確認
docker-compose logs backend
docker-compose logs db

# 一般的な原因と対処法
# - 環境変数設定ミス → .env を確認
# - ポート競合 → docker ps で確認
# - メモリ不足 → free -h で確認
```

### 3. データベース接続エラー

```bash
# データベースコンテナ確認
docker exec -it lift_log_db psql -U postgres -d lift_log

# マイグレーション再実行
docker-compose --profile migrate up flyway
```

### 4. Let's Encrypt証明書取得失敗

```bash
# ドメイン設定確認
nslookup your-domain.com

# ポート80アクセス確認
curl http://your-domain.com/.well-known/acme-challenge/test

# 手動取得試行
docker run --rm -v /opt/lift-log/nginx/ssl:/etc/letsencrypt certbot/certbot certonly --manual -d your-domain.com
```

---

## 💰 コスト最適化

### 月額費用概算（東京リージョン）

| リソース | 仕様 | 月額（USD） |
|----------|------|-------------|
| EC2 t3.micro | 1vCPU, 1GB RAM | 無料（Free Tier）または $8.5 |
| EBS (Root) | 20GB gp3 | $1.6 |
| EBS (Data) | 20GB gp3 | $1.6 |
| データ転送 | 15GB/月まで無料 | $0～ |
| **合計** | | **$3.2～$11.7/月** |

### コスト削減のヒント

1. **Free Tierの活用**
   - t3.micro インスタンス（12ヶ月間無料）
   - 30GB EBSストレージ（12ヶ月間無料）

2. **不要時の停止**
   ```bash
   # インスタンス停止（料金はEBSのみ）
   aws ec2 stop-instances --instance-ids i-xxxxxxxxx
   
   # インスタンス開始
   aws ec2 start-instances --instance-ids i-xxxxxxxxx
   ```

3. **スケジュール運用**
   ```bash
   # 深夜停止・朝方開始のcron設定例
   # 22:00 停止
   0 22 * * * aws ec2 stop-instances --instance-ids i-xxxxxxxxx
   # 8:00 開始  
   0 8 * * * aws ec2 start-instances --instance-ids i-xxxxxxxxx
   ```

4. **モニタリング**
   - AWS Cost Explorer で料金確認
   - CloudWatch で使用量監視

---

## 🔄 リソース削除

**注意**: 削除すると全データが失われます

```bash
# Terraformでリソース削除
cd terraform
terraform destroy

# 確認プロンプトで 'yes' を入力
```

---

## 📞 サポート

- **AWS公式サポート**: [AWS Support](https://aws.amazon.com/support/)
- **Terraformドキュメント**: [terraform.io](https://www.terraform.io/docs/)
- **Docker Composeドキュメント**: [docs.docker.com](https://docs.docker.com/compose/)

---

## 📝 チェックリスト

### デプロイ前
- [ ] AWSアカウント作成完了
- [ ] AWS CLI設定完了
- [ ] Session Manager Plugin インストール完了
- [ ] terraform.tfvars設定完了
- [ ] セキュリティ環境変数設定完了

### デプロイ後
- [ ] EC2インスタンス正常起動
- [ ] SSM接続確認
- [ ] アプリケーション起動確認
- [ ] HTTP/HTTPSアクセス確認
- [ ] データベース接続確認

### セキュリティ
- [ ] 強固なパスワード設定
- [ ] JWT秘密鍵更新
- [ ] SSM Session Manager アクセス（SSH無効化済み）
- [ ] SSL証明書設定（本番環境）

---

**🎉 おめでとうございます！Lift LogアプリケーションのAWSデプロイが完了しました！**
