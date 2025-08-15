# Terraform configuration for Lift Log application deployment on AWS
# Cost-optimized configuration for personal use

terraform {
  required_version = ">= 1.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

# Configure the AWS Provider
provider "aws" {
  region = var.aws_region
}

# データソース: 利用可能なAZを取得
data "aws_availability_zones" "available" {
  state = "available"
}

# データソース: 最新のAmazon Linux 2023 AMIを取得
data "aws_ami" "amazon_linux" {
  most_recent = true
  owners      = ["amazon"]

  filter {
    name   = "name"
    values = ["al2023-ami-*-x86_64"]
  }

  filter {
    name   = "virtualization-type"
    values = ["hvm"]
  }
}

# データソース: デフォルトVPCを取得（コスト削減のため既存VPCを使用）
data "aws_vpc" "default" {
  default = true
}

# データソース: デフォルトVPCのサブネットを取得
data "aws_subnets" "default" {
  filter {
    name   = "vpc-id"
    values = [data.aws_vpc.default.id]
  }
}

# セキュリティグループ: Lift Log アプリケーション用
resource "aws_security_group" "lift_log_sg" {
  name_prefix = "lift-log-sg-"
  description = "Security group for Lift Log application"
  vpc_id      = data.aws_vpc.default.id

  # HTTP アクセス
  ingress {
    description = "HTTP"
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # HTTPS アクセス
  ingress {
    description = "HTTPS"
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # SSH アクセス（SSM使用のため削除済み）
  # ingress {
  #   description = "SSH"
  #   from_port   = 22
  #   to_port     = 22
  #   protocol    = "tcp"
  #   cidr_blocks = var.allowed_ssh_cidrs
  # }

  # アウトバウンド通信（すべて許可）
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name        = "lift-log-security-group"
    Environment = var.environment
    Project     = "lift-log"
  }
}

# IAMロール: EC2インスタンス用
resource "aws_iam_role" "ec2_role" {
  name = "lift-log-ec2-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "ec2.amazonaws.com"
        }
      }
    ]
  })

  tags = {
    Name        = "lift-log-ec2-role"
    Environment = var.environment
    Project     = "lift-log"
  }
}

# IAMポリシーアタッチメント: SSM管理用
resource "aws_iam_role_policy_attachment" "ssm_managed_instance_core" {
  role       = aws_iam_role.ec2_role.name
  policy_arn = "arn:aws:iam::aws:policy/AmazonSSMManagedInstanceCore"
}

# IAMインスタンスプロファイル
resource "aws_iam_instance_profile" "ec2_profile" {
  name = "lift-log-ec2-profile"
  role = aws_iam_role.ec2_role.name
}

# EC2キーペア
resource "aws_key_pair" "lift_log_key" {
  key_name   = "lift-log-key"
  public_key = var.public_key

  tags = {
    Name        = "lift-log-key-pair"
    Environment = var.environment
    Project     = "lift-log"
  }
}

# EC2インスタンス: Lift Log アプリケーション
resource "aws_instance" "lift_log_app" {
  ami                    = data.aws_ami.amazon_linux.id
  instance_type          = var.instance_type
  key_name              = aws_key_pair.lift_log_key.key_name
  vpc_security_group_ids = [aws_security_group.lift_log_sg.id]
  subnet_id             = data.aws_subnets.default.ids[0]
  iam_instance_profile  = aws_iam_instance_profile.ec2_profile.name

  # EBSボリューム設定（コスト最適化）
  root_block_device {
    volume_type = "gp3"
    volume_size = var.root_volume_size
    encrypted   = true
    
    tags = {
      Name        = "lift-log-root-volume"
      Environment = var.environment
      Project     = "lift-log"
    }
  }

  # 追加EBSボリューム（Dockerデータ用）
  ebs_block_device {
    device_name = "/dev/sdf"
    volume_type = "gp3"
    volume_size = var.data_volume_size
    encrypted   = true
    
    tags = {
      Name        = "lift-log-data-volume"
      Environment = var.environment
      Project     = "lift-log"
    }
  }

  # EC2初期化スクリプト
  user_data = file("${path.module}/user-data.sh")

  tags = {
    Name        = "lift-log-application"
    Environment = var.environment
    Project     = "lift-log"
    Purpose     = "Docker host for Lift Log application"
  }

  # インスタンス作成時の依存関係
  depends_on = [
    aws_security_group.lift_log_sg,
    aws_key_pair.lift_log_key
  ]
}

# Elastic IP（オプション、コスト削減のためコメントアウト）
# resource "aws_eip" "lift_log_eip" {
#   instance = aws_instance.lift_log_app.id
#   domain   = "vpc"
#   
#   tags = {
#     Name        = "lift-log-eip"
#     Environment = var.environment
#     Project     = "lift-log"
#   }
# }