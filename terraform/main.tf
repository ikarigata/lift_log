# main.tf - 主要なリソースを定義するファイル

# --- TerraformとAWSプロバイダーの設定 ---

# Terraform自体の設定ブロックです。
terraform {
  # この設定では、AWSと通信するための「AWSプロバイダー」が必要であることを宣言しています。
  required_providers {
    aws = {
      source  = "hashicorp/aws" # 公式のAWSプロバイダーを指定
      version = "~> 5.0"        # バージョン5系の最新版を使うように指定
    }
  }
}

# AWSプロバイダーの具体的な設定です。
provider "aws" {
  # どのAWSリージョンにリソースを作成するかを指定します。
  # `var.aws_region` は、variables.tfで定義された変数を参照しています。
  region = var.aws_region
}

# --- ネットワーク関連のリソース ---

# EC2インスタンスの仮想ファイアウォールとなる「セキュリティグループ」を定義します。
resource "aws_security_group" "app_sg" {
  name        = "app-server-sg"
  description = "HTTPとSSHのインバウンド通信を許可する"

  # インバウンド（外部からインスタンスへ）の通信ルールを定義します。
  # これは、Webサイトへのアクセス（HTTP）を許可するルールです。
  ingress {
    from_port   = 80 # ポート80番（HTTP）
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"] # どのIPアドレスからのアクセスも許可する
  }

  # これは、サーバー管理用のSSH接続を許可するルールです。
  ingress {
    from_port   = 22 # ポート22番（SSH）
    to_port     = 22
    protocol    = "tcp"
    # `var.ssh_access_cidr` を参照し、特定のIPアドレスからのみ許可するようにします。
    # 注意: セキュリティのため、この値は必ず自分のIPアドレスに限定してください。
    cidr_blocks = [var.ssh_access_cidr]
  }

  # アウトバウンド（インスタンスから外部へ）の通信ルールを定義します。
  # 通常、外部への通信はすべて許可することが多いです。
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1" # すべてのプロトコル
    cidr_blocks = ["0.0.0.0/0"]
  }

  # リソースにタグを付けて管理しやすくします。
  tags = {
    Name = "AppServerSecurityGroup"
  }
}

# --- コンピューティングリソース ---

# アプリケーションをデプロイするEC2インスタンスを定義します。
resource "aws_instance" "app_server" {
  # インスタンスのOSイメージ（AMI）を指定します。
  # `var.ami_id` を参照しています。AMIはリージョンごとにIDが異なるので注意が必要です。
  ami           = var.ami_id

  # インスタンスのスペック（サイズ）を指定します。
  # `var.instance_type` を参照しています。't2.micro'は無料利用枠の対象です。
  instance_type = var.instance_type

  # このインスタンスに、上で定義したセキュリティグループを適用します。
  vpc_security_group_ids = [aws_security_group.app_sg.id]

  # インスタンスが初めて起動する時に一度だけ実行されるスクリプト（ユーザーデータ）を指定します。
  # `file()`関数で、同じディレクトリにある`install.sh`ファイルを読み込んでいます。
  # このスクリプトが、Dockerのインストールやアプリケーションのデプロイを自動で行います。
  user_data = file("${path.module}/install.sh")

  tags = {
    Name = "AppServerInstance"
  }
}
