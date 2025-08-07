# variables.tf - 設定値を変更しやすくするための変数定義ファイル

# AWSリージョンを指定する変数
variable "aws_region" {
  description = "リソースをデプロイするAWSリージョン"
  type        = string
  default     = "ap-northeast-1" # デフォルトは東京リージョン
}

# SSHアクセスを許可するIPアドレス範囲を指定する変数
variable "ssh_access_cidr" {
  description = "EC2インスタンスへのSSH接続を許可するCIDRブロック。自分のIPアドレスに設定することを強く推奨します。"
  type        = string
  # 警告: デフォルトでは全てのIPアドレスからSSH接続を許可しています。
  # 本番環境で利用する場合は、必ず自分のIPアドレス（例: "123.45.67.89/32"）に変更してください。
  default     = "0.0.0.0/0"
}

# EC2インスタンスのタイプを指定する変数
variable "instance_type" {
  description = "EC2インスタンスのタイプ"
  type        = string
  default     = "t2.micro" # デフォルトは無料利用枠の対象であるt2.micro
}

# EC2インスタンスのAMI IDを指定する変数
variable "ami_id" {
  description = "EC2インスタンスに使用するAMIのID。デフォルトは東京リージョンのUbuntu 22.04 LTSです。"
  type        = string
  # 注意: このAMI IDは 'ap-northeast-1' (東京リージョン) 専用です。
  # 別のリージョンを使う場合は、そのリージョン用のUbuntu 22.04のAMI IDを調べて設定し直す必要があります。
  default     = "ami-0c55b159cbfafe1f0"
}
