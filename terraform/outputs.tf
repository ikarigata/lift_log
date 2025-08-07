# outputs.tf - `terraform apply` 実行後に表示される出力値を定義するファイル

# EC2インスタンスのパブリックIPアドレスを出力します。
output "instance_public_ip" {
  description = "EC2インスタンスのパブリックIPアドレス"
  # `aws_instance.app_server` はmain.tfで定義したEC2インスタンスのリソースを指します。
  # `.public_ip` で、そのインスタンスのパブリックIPアドレスを取得できます。
  value       = aws_instance.app_server.public_ip
}

# EC2インスタンスのパブリックDNS名を出力します。
output "instance_public_dns" {
  description = "EC2インスタンスのパブリックDNS名"
  value       = aws_instance.app_server.public_dns
}
