# Terraform configuration for Vol Log application deployment on AWS
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
resource "aws_security_group" "vol_log_sg" {
  name_prefix = "vol-log-sg-"
  description = "Security group for Vol Log application"
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
    Name        = "vol-log-security-group"
    Environment = var.environment
    Project     = "vol-log"
  }
}

# IAMロール: EC2インスタンス用
resource "aws_iam_role" "ec2_role" {
  name = "vol-log-ec2-role"

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
    Name        = "vol-log-ec2-role"
    Environment = var.environment
    Project     = "vol-log"
  }
}

# IAMポリシーアタッチメント: SSM管理用
resource "aws_iam_role_policy_attachment" "ssm_managed_instance_core" {
  role       = aws_iam_role.ec2_role.name
  policy_arn = "arn:aws:iam::aws:policy/AmazonSSMManagedInstanceCore"
}

# IAMインスタンスプロファイル
resource "aws_iam_instance_profile" "ec2_profile" {
  name = "vol-log-ec2-profile"
  role = aws_iam_role.ec2_role.name
}

# EC2キーペア
resource "aws_key_pair" "vol_log_key" {
  key_name   = "vol-log-key"
  public_key = var.public_key

  tags = {
    Name        = "vol-log-key-pair"
    Environment = var.environment
    Project     = "vol-log"
  }
}

# EC2インスタンス: Lift Log アプリケーション
resource "aws_instance" "vol_log_app" {
  ami                    = data.aws_ami.amazon_linux.id
  instance_type          = var.instance_type
  key_name              = aws_key_pair.vol_log_key.key_name
  vpc_security_group_ids = [aws_security_group.vol_log_sg.id]
  subnet_id             = data.aws_subnets.default.ids[0]
  iam_instance_profile  = aws_iam_instance_profile.ec2_profile.name

  # EBSボリューム設定（コスト最適化）
  root_block_device {
    volume_type = "gp3"
    volume_size = var.root_volume_size
    encrypted   = true
    
    tags = {
      Name        = "vol-log-root-volume"
      Environment = var.environment
      Project     = "vol-log"
    }
  }

  # 追加EBSボリューム（Dockerデータ用）
  ebs_block_device {
    device_name = "/dev/sdf"
    volume_type = "gp3"
    volume_size = var.data_volume_size
    encrypted   = true
    
    tags = {
      Name        = "vol-log-data-volume"
      Environment = var.environment
      Project     = "vol-log"
    }
  }

  # EC2初期化スクリプト
  user_data = file("${path.module}/user-data.sh")

  tags = {
    Name        = "vol-log-application"
    Environment = var.environment
    Project     = "vol-log"
    Purpose     = "Docker host for Vol Log application"
  }

  # インスタンス作成時の依存関係
  depends_on = [
    aws_security_group.vol_log_sg,
    aws_key_pair.vol_log_key
  ]
}

# Elastic IP
resource "aws_eip" "vol_log_eip" {
  instance = aws_instance.vol_log_app.id
  domain   = "vpc"
  
  tags = {
    Name        = "vol-log-eip"
    Environment = var.environment
    Project     = "vol-log"
  }
}

# Route 53 Hosted Zone (use existing zone created during domain registration)
data "aws_route53_zone" "main" {
  count = var.domain_name != null ? 1 : 0
  name  = var.domain_name
}

# Route 53 A Record for root domain
resource "aws_route53_record" "root" {
  count   = var.domain_name != null ? 1 : 0
  zone_id = data.aws_route53_zone.main[0].zone_id
  name    = var.domain_name
  type    = "A"
  ttl     = 300
  records = [aws_eip.vol_log_eip.public_ip]
}

# Route 53 A Record for www subdomain
resource "aws_route53_record" "www" {
  count   = var.domain_name != null ? 1 : 0
  zone_id = data.aws_route53_zone.main[0].zone_id
  name    = "www.${var.domain_name}"
  type    = "A"
  ttl     = 300
  records = [aws_eip.vol_log_eip.public_ip]
}