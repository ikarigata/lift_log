# 基本設定
aws_region = "ap-northeast-1"
environment = "prod"
instance_type = "t3.micro"  # Free Tier対象
   
# ストレージ設定（コスト最適化）
root_volume_size = 20  # GB
data_volume_size = 20  # GB
   
# SSH設定
public_key = "ssh-rsa AAAAB3NzaC1yc..."  # ~/.ssh/lift-log-key.pub の内容
allowed_ssh_cidrs = ["217.178.163.96/32"]  # あなたのIPアドレス/32
