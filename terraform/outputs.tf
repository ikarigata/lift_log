# Outputs for Vol Log AWS deployment
# Provides essential information for application access and management

output "instance_id" {
  description = "ID of the EC2 instance"
  value       = aws_instance.vol_log_app.id
}

output "public_ip" {
  description = "Elastic IP address of the EC2 instance"
  value       = aws_eip.vol_log_eip.public_ip
}

output "public_dns" {
  description = "Public DNS name of the EC2 instance"
  value       = aws_instance.vol_log_app.public_dns
}

output "private_ip" {
  description = "Private IP address of the EC2 instance"
  value       = aws_instance.vol_log_app.private_ip
}

output "availability_zone" {
  description = "Availability zone of the EC2 instance"
  value       = aws_instance.vol_log_app.availability_zone
}

output "security_group_id" {
  description = "ID of the security group"
  value       = aws_security_group.vol_log_sg.id
}

# Connection information
output "ssm_connection_command" {
  description = "SSM command to connect to the instance"
  value       = "aws ssm start-session --target ${aws_instance.vol_log_app.id}"
}

output "ssh_connection_command" {
  description = "SSH command to connect to the instance (deprecated, use SSM instead)"
  value       = "ssh -i ~/.ssh/vol-log-key ec2-user@${aws_eip.vol_log_eip.public_ip}"
}

output "application_url_http" {
  description = "HTTP URL to access the application"
  value       = "http://${aws_eip.vol_log_eip.public_ip}"
}

output "application_url_https" {
  description = "HTTPS URL to access the application (after SSL setup)"
  value       = "https://${aws_eip.vol_log_eip.public_ip}"
}

# Domain-based URLs (if domain is configured)
output "domain_url_http" {
  description = "HTTP URL using domain name (if configured)"
  value       = var.domain_name != null ? "http://${var.domain_name}" : "Domain not configured"
}

output "domain_url_https" {
  description = "HTTPS URL using domain name (if configured)"
  value       = var.domain_name != null ? "https://${var.domain_name}" : "Domain not configured"
}

# Route 53 Information
output "hosted_zone_id" {
  description = "Route 53 hosted zone ID (if domain is configured)"
  value       = var.domain_name != null ? data.aws_route53_zone.main[0].zone_id : null
}

output "name_servers" {
  description = "Route 53 name servers (if domain is configured)"
  value       = var.domain_name != null ? data.aws_route53_zone.main[0].name_servers : []
}

output "domain_setup_instructions" {
  description = "Instructions for domain setup"
  value = var.domain_name != null ? "Domain Setup Instructions for ${var.domain_name}:\n\nSince you registered the domain with AWS Route 53, DNS configuration is automatic!\n\n1. Domain: ${var.domain_name} ✓ (registered with AWS)\n2. DNS: Automatically configured ✓\n3. Access your application at:\n   - http://${var.domain_name}\n   - http://www.${var.domain_name}\n\nNote: DNS propagation may take a few minutes to complete." : "No domain configured"
}

# Deployment information
output "deployment_info" {
  description = "Summary of deployment configuration"
  value = {
    instance_type     = var.instance_type
    aws_region       = var.aws_region
    environment      = var.environment
    root_volume_size = var.root_volume_size
    data_volume_size = var.data_volume_size
  }
}

# Next steps information
output "next_steps" {
  description = "Next steps after Terraform deployment"
  value = <<-EOT
    1. Connect to the instance: ${aws_eip.vol_log_eip.public_ip}
    2. SSM command (recommended): aws ssm start-session --target ${aws_instance.vol_log_app.id}
    3. Check the deployment status: sudo systemctl status docker
    4. View application logs: docker-compose logs
    5. Access the application: http://${aws_eip.vol_log_eip.public_ip}
    
    Note: SSM Session Manager is now used instead of SSH for secure access.
    It may take 5-10 minutes for the application to be fully operational after the instance starts.
  EOT
}