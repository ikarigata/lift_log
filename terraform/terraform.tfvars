# 基本設定
aws_region = "ap-northeast-1"
environment = "prod"
instance_type = "t3.micro"  # Free Tier対象
   
# ストレージ設定（コスト最適化）
root_volume_size = 30  # GB (AMI要件により最小30GB)
data_volume_size = 20  # GB
   
# SSH設定
public_key = "ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAACAQDPyFpkPuuhU/3xDIW1vmcaGDaHCKMVARwlvAoCLyQG9XN6qqf69uSgrjySBPQJi7Y1qsaBDBtrpRcSoSsDzqkszS9uwlgD/FNnRPSR/x7YnVmPSX441iKqyrXZqVKHq1eM5npoI3AcdMOA37o3LWc3X1ItEmbwH22MJgQe8TLCVjPDJutrS/Sg3J3EXOUpIHZ6PmpKbWXIw+CjAycvlLbg6DZ4W5WwsSAibybD5b5aGaiuE9FVfSKZRPccDcDotv2e5/cqtNQJRdjk+RDHuNQsva5NIr//ApFtI8G9cMvlTo4oXRTXcxdWssieTF+o/T0YFcXd/rC7+p7F2aH56H36VJ3p56w+qokCm+66+n4seH3bdK6KOfWv3376ab6DNoErHoWq/8WER0Db93AQfNvasZvsWz8dZcO1gCVfUH57eYOD7+dWge7nGOCK7uf9Z3IojkNBax1WBhguoVm77IDXfzAzBJv6MkTLFWUeIHBVt3jjWdrNGCWlq6b9PjHiXp+w25Vf3aHvj7bsokgJdgXH+DRduWumccZo4gP8TQv4OwlrA+zHyaoSyHLwVSuFzqeDnTC8DCnxLTJ+ehpi3a5Pj8iVGbNQ5QbP6Ayfzgo7kn5QTNHxmGyW1MDnjDHquLKLL1Ud34vn61Fbnx8Hh9kC9Bskjd6Sjp9LcEOe39RQSw== ikarigata@LAPTOP-TKUFSG3R"  # ~/.ssh/lift-log-key.pub の内容
allowed_ssh_cidrs = ["202.165.164.1/32"]  # あなたのIPアドレス/32

# Sensitive variables (loaded from environment variables)
# Set these in terraform/.env file:
# - TF_VAR_db_password=your_secure_password
# - TF_VAR_jwt_secret=your_jwt_secret_key
