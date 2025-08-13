# Lift Log AWS シンプルデプロイガイド

> **対象者**: AWS初学者〜中級者  
> **前提条件**: AWSアカウント作成済み  
> **構成**: 単一EC2インスタンス + GitHub Actions自動デプロイ（シンプル・コスト最適化済み）

## 📋 目次

1. [事前準備](#事前準備)
2. [インフラ構築](#インフラ構築)
3. [GitHub Actions自動デプロイ設定](#github-actions自動デプロイ設定)
4. [手動デプロイ方法](#手動デプロイ方法)
5. [運用・メンテナンス](#運用メンテナンス)
6. [トラブルシューティング](#トラブルシューティング)
7. [コスト最適化](#コスト最適化)

---

## 🛠️ 事前準備

### 必要なツール

1. **AWS CLI v2**
   ```bash
   # macOS
   brew install awscli
   
   # Linux
   curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
   unzip awscliv2.zip && sudo ./aws/install
   
   # Windows: https://awscli.amazonaws.com/AWSCLIV2.msi
   ```

2. **Terraform**
   ```bash
   # macOS
   brew install terraform
   
   # Linux
   wget https://releases.hashicorp.com/terraform/1.6.0/terraform_1.6.0_linux_amd64.zip
   unzip terraform_1.6.0_linux_amd64.zip && sudo mv terraform /usr/local/bin/
   
   # Windows: https://www.terraform.io/downloads
   ```

3. **GitHub CLI**
   ```bash
   # macOS
   brew install gh
   
   # Linux
   curl -fsSL https://cli.github.com/packages/githubcli-archive-keyring.gpg | sudo dd of=/usr/share/keyrings/githubcli-archive-keyring.gpg
   echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/githubcli-archive-keyring.gpg] https://cli.github.com/packages stable main" | sudo tee /etc/apt/sources.list.d/github-cli.list > /dev/null
   sudo apt update && sudo apt install gh
   
   # Windows: https://cli.github.com/
   ```

### AWSアカウント設定

1. **IAMユーザー作成**
   - AWS Console → IAM → Users → Create user
   - User name: `terraform-user`
   - Permissions: `PowerUserAccess`（最小権限の場合は下記ポリシー）

2. **AWS CLI認証情報設定**
   ```bash
   aws configure
   # Access Key ID: AKIA... (IAMユーザーのキー)
   # Secret Access Key: ... (IAMユーザーのシークレット)
   # Region: ap-northeast-1 (東京)
   # Output: json
   
   # 設定確認
   aws sts get-caller-identity
   ```

### SSH鍵ペア作成

```bash
# プロジェクトディレクトリに移動
cd lift_log

# SSH鍵ペア生成（プロジェクト直下に配置）
ssh-keygen -t rsa -b 4096 -f ./lift-log-key -N ""

# 公開鍵の内容を確認（Terraform設定で使用）
cat ./lift-log-key.pub
```

**注意**: SSH鍵ファイルは機密情報のため、`.gitignore`で除外されています。

---

## 🏗️ インフラ構築

### 1. Terraform設定

1. **プロジェクトディレクトリに移動**
   ```bash
   cd lift_log/terraform
   ```

2. **terraform.tfvars ファイル作成**
   ```bash
   nano terraform.tfvars
   ```
   
   ```hcl
   # 基本設定
   aws_region = "ap-northeast-1"
   environment = "prod"
   instance_type = "t3.micro"  # Free Tier対象
   
   # ストレージ設定
   root_volume_size = 20  # GB
   data_volume_size = 20  # GB
   
   # SSH設定
   public_key = "ssh-rsa AAAAB3NzaC1yc..."  # ./lift-log-key.pub の内容
   allowed_ssh_cidrs = ["YOUR_IP/32"]  # 現在のIPアドレス/32
   ```

3. **現在のIPアドレス確認・設定**
   ```bash
   curl ifconfig.me  # 結果をallowed_ssh_cidrsに設定
   ```

### 2. インフラ構築実行

```bash
# Terraform初期化
terraform init

# 構築プラン確認
terraform plan

# インフラ構築実行
terraform apply
# 確認プロンプトで 'yes' 入力

# 構築結果確認
terraform output
```

**出力例:**
```
instance_id = "i-0123456789abcdef0"
public_ip = "54.249.123.456"
ssh_connection_command = "ssh -i ./lift-log-key ec2-user@54.249.123.456"
```

---

## 🚀 GitHub Actions自動デプロイ設定

### 1. 環境変数ファイル準備

```bash
# ローカルでの環境変数ファイル作成
cd lift_log
cp aws-deploy/.env.aws.template aws-deploy/.env.aws
nano aws-deploy/.env.aws
```

**必須設定項目:**
```bash
# 強固なパスワード・シークレット生成と設定
POSTGRES_PASSWORD=<openssl rand -base64 24で生成>
JWT_SECRET=<openssl rand -hex 32で生成>
```

**📋 .env.awsファイルの特徴:**
- **最小構成**: ローカル用.envと同じ基本設定のみ
- **API統一**: `VITE_API_BASE_URL=/api/v1` （開発環境と統一）
- **AWS対応**: `DB_HOST=db` (Docker環境用)

### 2. GitHub設定

```bash
# GitHub CLI認証
gh auth login

# GitHub Actions自動設定スクリプト実行
./scripts/setup-simple-deploy.sh
```

このスクリプトが自動で設定する内容:
- SSH秘密鍵 → GitHub Secrets
- EC2サーバー情報 → GitHub Secrets  
- .envファイル内容 → GitHub Secrets（暗号化）
- EC2サーバーの初期ディレクトリ作成

### 3. 自動デプロイの開始

```bash
# mainブランチにプッシュ → 自動デプロイ実行
git add .
git commit -m "Setup deployment configuration"
git push origin main
```

### 4. デプロイ状況確認

```bash
# GitHub Actions実行状況確認
gh run list

# リアルタイムでログ確認
gh run watch

# Webで確認
# https://github.com/YOUR_USERNAME/lift_log/actions
```

### 5. アプリケーション動作確認

デプロイ完了後:
```bash
# ヘルスチェック
curl http://YOUR_EC2_IP/api/actuator/health

# ブラウザでアクセス
# http://YOUR_EC2_IP
```

---

## 🔧 手動デプロイ方法

緊急時や初回デプロイ時に使用する手動デプロイ方法:

### 1. 手動デプロイスクリプト実行

```bash
# プロジェクトルートで実行
./scripts/simple-deploy.sh
```

このスクリプトの処理内容:
1. SSH鍵・.envファイル・サーバー情報の確認
2. .envファイルをサーバーにコピー
3. プロジェクト全体をサーバーに同期（rsync）
4. サーバー上でDocker Compose再起動
5. ヘルスチェック実行

### 2. 手動操作（詳細制御が必要な場合）

```bash
# サーバーに接続
ssh -i ./lift-log-key ec2-user@YOUR_EC2_IP

# アプリケーションディレクトリに移動
cd /opt/lift-log/app

# アプリケーション停止
docker-compose -f aws-deploy/docker-compose.aws.yml down

# アプリケーション起動
docker-compose -f aws-deploy/docker-compose.aws.yml up -d --build

# ログ確認
docker-compose -f aws-deploy/docker-compose.aws.yml logs -f
```

### 3. ヘルスチェック

```bash
# ヘルスエンドポイント確認
curl -f http://localhost/api/actuator/health

# コンテナ状況確認
docker-compose -f aws-deploy/docker-compose.aws.yml ps
```

---

## 🔧 運用・メンテナンス

### 日常的な運用

#### 自動デプロイ（推奨）
```bash
# 開発完了後、mainブランチにプッシュするだけ
git push origin main  # → GitHub Actionsが自動デプロイ実行
```

#### アプリケーション状況確認
```bash
# GitHub Actions履歴確認
gh run list

# サーバー状況確認
ssh -i ./lift-log-key ec2-user@YOUR_EC2_IP << 'EOF'
  # コンテナ状況
  docker ps
  
  # リソース使用量
  htop
  df -h
  
  # アプリケーションログ
  cd /opt/lift-log/app
  docker-compose -f aws-deploy/docker-compose.aws.yml logs --tail=50
EOF
```

### 設定変更

#### 環境変数変更
```bash
# 方法1: ローカルで.envファイル更新後、自動デプロイ
nano aws-deploy/.env.aws
./scripts/setup-simple-deploy.sh  # GitHub Secretsを再設定
git push origin main  # 自動デプロイで反映

# 方法2: サーバー上で直接変更（即座に反映）
ssh -i ./lift-log-key ec2-user@YOUR_EC2_IP
nano /opt/lift-log/app/.env
cd /opt/lift-log/app
docker-compose -f aws-deploy/docker-compose.aws.yml restart
```

### バックアップ（オプション）

```bash
# サーバー上でデータベースバックアップ
ssh -i ./lift-log-key ec2-user@YOUR_EC2_IP
cd /opt/lift-log/app
docker-compose -f aws-deploy/docker-compose.aws.yml --profile backup up backup
```

### メンテナンス作業

#### 定期クリーンアップ
```bash
# 月1回程度の実行推奨
ssh -i ./lift-log-key ec2-user@YOUR_EC2_IP << 'EOF'
  # 不要なDockerイメージ・コンテナの削除
  docker system prune -f
  
  # ログファイルのローテーション確認
  sudo logrotate -f /etc/logrotate.conf
EOF
```

#### アプリケーション再起動
```bash
# 緊急時の手動再起動
ssh -i ./lift-log-key ec2-user@YOUR_EC2_IP \
  'cd /opt/lift-log/app && docker-compose -f aws-deploy/docker-compose.aws.yml restart'
```

---

## 🐛 トラブルシューティング

### 1. GitHub Actions デプロイ失敗

#### SSH接続エラー
```bash
# 原因: IPアドレス変更によるアクセス拒否
# 対処: 現在のIPを確認してTerraform設定更新
curl ifconfig.me
cd terraform
terraform apply -var="allowed_ssh_cidrs=[\"新しいIP/32\"]"
```

#### .env設定エラー
```bash
# 原因: .envファイルの設定不備
# 対処: GitHub Secretsを再設定
nano aws-deploy/.env.aws  # 設定修正
./scripts/setup-simple-deploy.sh  # Secrets再設定
```

### 2. アプリケーション起動エラー

```bash
# サーバーでログ確認
ssh -i ./lift-log-key ec2-user@YOUR_EC2_IP
cd /opt/lift-log/app

# コンテナ状況確認
docker-compose -f aws-deploy/docker-compose.aws.yml ps

# 詳細ログ確認
docker-compose -f aws-deploy/docker-compose.aws.yml logs backend
docker-compose -f aws-deploy/docker-compose.aws.yml logs db
```

**よくある原因:**
- 環境変数設定ミス（.env確認）
- ポート競合（`docker ps`で確認）
- メモリ不足（`free -h`で確認）
- データベース接続エラー

### 3. ヘルスチェック失敗

```bash
# サーバー上で直接確認
ssh -i ./lift-log-key ec2-user@YOUR_EC2_IP
curl -v http://localhost/api/actuator/health

# Nginxログ確認
docker-compose -f aws-deploy/docker-compose.aws.yml logs frontend

# バックエンドログ確認
docker-compose -f aws-deploy/docker-compose.aws.yml logs backend
```

### 4. データベース問題

```bash
# データベースコンテナに接続
docker exec -it lift-log-db psql -U postgres -d lift_log

# マイグレーション実行（初回・更新時）
docker-compose -f aws-deploy/docker-compose.aws.yml --profile migrate up flyway
```

### 5. 緊急時の対応

#### アプリケーション全体再起動
```bash
ssh -i ./lift-log-key ec2-user@YOUR_EC2_IP << 'EOF'
cd /opt/lift-log/app
docker-compose -f aws-deploy/docker-compose.aws.yml down
docker-compose -f aws-deploy/docker-compose.aws.yml up -d
EOF
```

#### 手動デプロイで復旧
```bash
# 自動デプロイが失敗した場合の手動実行
./scripts/simple-deploy.sh
```

### ログ確認コマンド集

```bash
# GitHub Actions実行履歴
gh run list
gh run view --log WORKFLOW_ID

# サーバーログ
ssh -i ./lift-log-key ec2-user@YOUR_EC2_IP \
  'cd /opt/lift-log/app && docker-compose -f aws-deploy/docker-compose.aws.yml logs -f --tail=100'
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
   # Terraformからインスタンス情報取得
   cd terraform
   INSTANCE_ID=$(terraform output -raw instance_id)
   
   # インスタンス停止（料金はEBSのみ）
   aws ec2 stop-instances --instance-ids $INSTANCE_ID
   
   # インスタンス開始
   aws ec2 start-instances --instance-ids $INSTANCE_ID
   ```

3. **モニタリング**
   - AWS Cost Explorer で料金確認
   - CloudWatch で使用量監視

### リソース削除

**注意**: 削除すると全データが失われます

```bash
# Terraformでリソース完全削除
cd terraform
terraform destroy
# 確認プロンプトで 'yes' を入力
```

---

## 📁 EC2内のディレクトリ構成

### 完全なディレクトリ構成

デプロイ完了後のEC2インスタンス内は以下の構成となります：

```
/opt/lift-log/
├── app/                           # メインアプリケーション（GitHub/rsyncで同期）
│   ├── .env                      # 環境設定ファイル（aws-deploy/.env.awsの内容）
│   ├── docker-compose.yml        # 実行時の名前（aws-deploy/docker-compose.aws.yml）
│   ├── backend/                  # バックエンドアプリケーション
│   │   ├── src/
│   │   ├── pom.xml
│   │   ├── Dockerfile
│   │   └── ...
│   ├── frontend/                 # フロントエンドアプリケーション
│   │   ├── src/
│   │   ├── package.json
│   │   ├── Dockerfile
│   │   └── ...
│   ├── terraform/                # Terraform設定（参考用）
│   └── scripts/                  # デプロイスクリプト
│
├── data/                         # 永続化データ（EBSマウント: /opt/lift-log/data）
│   ├── postgres/                 # PostgreSQLデータ（Docker volume bind）
│   │   ├── base/
│   │   ├── global/
│   │   ├── pg_*
│   │   └── ...
│   └── postgres-backups/         # データベースバックアップファイル
│       ├── backup_20250101_120000.sql.gz
│       ├── backup_20250102_120000.sql.gz
│       └── ...
│
├── logs/                         # ログファイル（本番運用で使用）
│   ├── backend/                  # バックエンドアプリケーションログ
│   │   ├── spring.log
│   │   └── error.log
│   └── nginx/                    # Nginxログ
│       ├── lift-log-access.log
│       ├── lift-log-error.log
│       └── nginx.log
│
├── nginx/                        # Nginx本番設定
│   ├── nginx.conf                # 本番用nginx設定（aws-deploy/nginx.aws.conf）
│   ├── ssl/                      # SSL証明書（Let's Encrypt）
│   │   ├── live/
│   │   │   ├── cert.pem
│   │   │   ├── privkey.pem
│   │   │   └── fullchain.pem
│   │   └── dhparam.pem          # Diffie-Hellman parameters
│   └── webroot/                  # Let's Encrypt認証用
│       └── .well-known/
│
└── scripts/                      # 運用スクリプト（オプション）
    ├── backup.sh                 # データベースバックアップ
    ├── restore.sh                # データベース復元
    └── health-check.sh           # ヘルスチェック
```

### ローカル開発環境とEC2本番環境の対応関係

#### ディレクトリ構造の対応表

| ローカル開発環境 | EC2本番環境 | 用途・変換ルール |
|------------------|-------------|------------------|
| `/home/user/lift_log/` | `/opt/lift-log/app/` | **プロジェクトルート** |
| `.env` | `.env` | aws-deploy/.env.awsの内容で上書き |
| `docker-compose.yml` | `docker-compose.yml` | aws-deploy/docker-compose.aws.ymlを使用 |
| `backend/` | `backend/` | 同一構造で同期 |
| `frontend/` | `frontend/` | 同一構造で同期 |
| `terraform/` | `terraform/` | 参考用として同期（実行はローカル） |
| `aws-deploy/` | `aws-deploy/` | 設定ファイル群として同期 |
| `scripts/` | `scripts/` | デプロイ・運用スクリプトとして同期 |

#### 重要な設定ファイル変換

```bash
# ローカル開発環境
.env                                    # ローカル用設定
docker-compose.yml                     # 開発用構成
aws-deploy/.env.aws.template           # AWS設定テンプレート
aws-deploy/docker-compose.aws.yml      # AWS本番用構成

# ↓ デプロイ時の変換

# EC2本番環境
.env                                    # ← aws-deploy/.env.aws の内容
docker-compose.yml                     # ← aws-deploy/docker-compose.aws.yml を使用
aws-deploy/.env.aws.template           # そのまま
aws-deploy/docker-compose.aws.yml      # そのまま
```

#### 作業ディレクトリの概念

**ローカル開発環境での作業:**
```bash
cd /home/user/lift_log                 # プロジェクトルート移動
docker-compose up -d                   # 開発用構成で起動
```

**EC2本番環境での同等作業:**
```bash
cd /opt/lift-log/app                   # プロジェクトルート移動
docker-compose up -d                   # 本番用構成で起動
```

### 各ディレクトリの詳細説明

#### `/opt/lift-log/app/` - メインアプリケーション
**用途**: GitHub Actionsやrsyncでデプロイされるアプリケーションコード
- **更新方法**: `git push`による自動デプロイ、または手動rsync
- **権限**: `ec2-user:ec2-user`
- **重要ファイル**:
  - `.env`: 環境設定（DB接続情報、JWT秘密鍵等）
  - `docker-compose.yml`: 実際は`aws-deploy/docker-compose.aws.yml`のコピー

#### `/opt/lift-log/data/` - 永続化データ
**用途**: アプリケーション停止・再デプロイ後も保持されるデータ
- **マウント**: Terraform作成の20GB EBS (`/dev/sdf` → `/opt/lift-log/data`)
- **バックアップ**: 自動日次バックアップ（`backup`プロファイル実行）
- **postgres/**: PostgreSQLの実データ（Docker volumeバインド）
- **postgres-backups/**: pg_dumpによる論理バックアップ

#### `/opt/lift-log/logs/` - ログファイル
**用途**: アプリケーション・ミドルウェアのログ保存
- **ローテーション**: Docker compose設定で10MB×3ファイル
- **モニタリング**: CloudWatch Logs連携（オプション）
- **アクセス**: `tail -f /opt/lift-log/logs/backend/spring.log`

#### `/opt/lift-log/nginx/` - Nginx本番設定
**用途**: プロダクション向けnginx設定とSSL証明書
- **ssl/**: Let's Encryptによる自動SSL証明書管理
- **nginx.conf**: レート制限・セキュリティヘッダー・gzip等の本番設定
- **webroot/**: SSL証明書更新用の認証ファイル配置

### デプロイ時のファイル配置プロセス

#### GitHub Actions自動デプロイ
```bash
1. GitHub Secrets → /opt/lift-log/app/.env 配置
2. git clone → /opt/lift-log/app/ 全体更新
3. docker-compose.yml → aws-deploy/docker-compose.aws.yml 使用
4. docker-compose up -d --build → サービス再起動
```

#### 手動デプロイ（scripts/simple-deploy.sh）
```bash
1. SCP: aws-deploy/.env.aws → /opt/lift-log/app/.env
2. rsync: プロジェクト全体 → /opt/lift-log/app/
   - 除外: .git, node_modules, target, *.log
3. SSH実行: docker-compose down && up -d --build
4. ヘルスチェック: curl http://localhost/api/actuator/health
```

### 永続化されるデータと一時データ

#### ✅ 永続化データ（再デプロイ後も保持）
- `/opt/lift-log/data/postgres/` - データベース実データ
- `/opt/lift-log/data/postgres-backups/` - バックアップファイル
- `/opt/lift-log/nginx/ssl/` - SSL証明書
- `/opt/lift-log/logs/` - ログファイル（設定により）

#### ❌ 一時データ（再デプロイで削除・再作成）
- `/opt/lift-log/app/` - アプリケーションコード（全て）
- Dockerコンテナ・イメージ - `docker-compose up -d --build`で再作成
- `/tmp/`, `/var/run/` - 一時ファイル

### 運用時のポイント

#### ローカル開発 vs EC2本番での作業比較

**コンテナ操作:**
```bash
# ローカル開発環境
docker-compose up -d                   # 開発用起動
docker-compose logs -f backend        # バックエンドログ確認
docker-compose exec backend bash      # バックエンドコンテナ接続

# EC2本番環境（同等の作業）
cd /opt/lift-log/app
docker-compose up -d                   # 本番用起動（aws-deploy/docker-compose.aws.yml使用）
docker-compose logs -f backend        # バックエンドログ確認
docker-compose exec backend bash      # バックエンドコンテナ接続
```

**設定ファイル編集:**
```bash
# ローカル開発環境
nano .env                              # 開発用環境変数編集
nano docker-compose.yml               # 開発用構成編集

# EC2本番環境（同等の作業）
cd /opt/lift-log/app
nano .env                              # 本番用環境変数編集（aws-deploy/.env.awsの内容）
# NOTE: docker-compose.ymlはaws-deploy/docker-compose.aws.ymlが使用される
nano aws-deploy/docker-compose.aws.yml # 本番用構成編集
```

**デバッグ・トラブルシューティング:**
```bash
# ローカル開発環境
docker-compose ps                      # コンテナ状況確認
docker system df                       # Docker使用量確認
docker-compose down && docker-compose up -d  # 完全再起動

# EC2本番環境（同等の作業）
cd /opt/lift-log/app
docker-compose ps                      # コンテナ状況確認
docker system df                       # Docker使用量確認
docker-compose down && docker-compose up -d  # 完全再起動
```

**よく使用するディレクトリ移動:**
```bash
# EC2本番環境でのナビゲーション
cd /opt/lift-log/app                   # プロジェクトルート（最重要）
cd /opt/lift-log/data/postgres         # データベースファイル確認
cd /opt/lift-log/logs                  # ログファイル確認
cd /opt/lift-log/nginx                 # Nginx設定確認

# 重要: EC2では常に /opt/lift-log/app から作業を開始する
```

#### データベース管理
```bash
# データベースバックアップ実行
cd /opt/lift-log/app
docker-compose --profile backup up backup

# 手動SQL実行
docker exec -it lift-log-db psql -U postgres -d lift_log

# マイグレーション実行
docker-compose --profile migrate up flyway
```

#### ログ確認
```bash
# リアルタイムログ確認
docker-compose logs -f backend

# 静的ログファイル確認
tail -f /opt/lift-log/logs/nginx/lift-log-access.log
```

#### SSL証明書更新
```bash
# Let's Encrypt証明書更新
docker-compose --profile ssl up certbot

# Nginx設定再読み込み
docker-compose exec frontend nginx -s reload
```

---

## 📝 デプロイチェックリスト

### 初回セットアップ
- [ ] AWS CLI設定完了（`aws configure`）
- [ ] SSH鍵ペア作成完了（`./lift-log-key`）
- [ ] terraform.tfvars設定完了
- [ ] Terraformでインフラ構築完了（`terraform apply`）
- [ ] .env.awsファイル設定完了（パスワード・JWT秘密鍵生成）
- [ ] GitHub CLI認証完了（`gh auth login`）
- [ ] GitHub Secrets設定完了（`./scripts/setup-simple-deploy.sh`）

### デプロイ後確認
- [ ] GitHub Actions実行成功（`gh run list`）
- [ ] EC2インスタンス正常起動
- [ ] SSH接続確認（`ssh -i ./lift-log-key ec2-user@EC2_IP`）
- [ ] プロジェクトルート確認（`cd /opt/lift-log/app && pwd`）
- [ ] 設定ファイル確認（`.env`が`aws-deploy/.env.aws`の内容か）
- [ ] アプリケーション起動確認（コンテナ状況）
- [ ] ヘルスチェック成功（`curl http://EC2_IP/api/actuator/health`）
- [ ] ブラウザアクセス確認（`http://EC2_IP`）
- [ ] ディレクトリ構成確認（`ls -la /opt/lift-log/`で app/, data/, logs/, nginx/存在）

### セキュリティ確認
- [ ] 強固なパスワード設定（POSTGRES_PASSWORD）
- [ ] 安全なJWT秘密鍵設定（JWT_SECRET）
- [ ] SSH接続IPアドレス制限設定
- [ ] GitHub Secretsでの機密情報管理

---

## 🚀 クイックスタートサマリー

最速でデプロイを完了する手順:

```bash
# 1. インフラ構築
cd terraform && terraform init && terraform apply

# 2. 環境設定
cd .. && cp aws-deploy/.env.aws.template aws-deploy/.env.aws
# .env.awsファイルを編集（パスワード・JWT秘密鍵設定）

# 3. GitHub設定
gh auth login
./scripts/setup-simple-deploy.sh

# 4. 自動デプロイ開始
git push origin main

# 5. 動作確認
curl http://$(cd terraform && terraform output -raw public_ip)/api/actuator/health
```

**🎉 これでLift LogのAWSデプロイが完了です！**

継続的な開発では`git push origin main`するだけで自動デプロイされます。