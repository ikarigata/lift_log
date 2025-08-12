# Outputs for Lift Log AWS deployment
# Provides essential information for application access and management

output "instance_id" {
  description = "ID of the EC2 instance"
  value       = aws_instance.lift_log_app.id
}

output "public_ip" {
  description = "Public IP address of the EC2 instance"
  value       = aws_instance.lift_log_app.public_ip
}

output "public_dns" {
  description = "Public DNS name of the EC2 instance"
  value       = aws_instance.lift_log_app.public_dns
}

output "private_ip" {
  description = "Private IP address of the EC2 instance"
  value       = aws_instance.lift_log_app.private_ip
}

output "availability_zone" {
  description = "Availability zone of the EC2 instance"
  value       = aws_instance.lift_log_app.availability_zone
}

output "security_group_id" {
  description = "ID of the security group"
  value       = aws_security_group.lift_log_sg.id
}

# Connection information
output "ssh_connection_command" {
  description = "SSH command to connect to the instance"
  value       = "ssh -i ~/.ssh/lift-log-key ec2-user@${aws_instance.lift_log_app.public_ip}"
}

output "application_url_http" {
  description = "HTTP URL to access the application"
  value       = "http://${aws_instance.lift_log_app.public_ip}"
}

output "application_url_https" {
  description = "HTTPS URL to access the application (after SSL setup)"
  value       = "https://${aws_instance.lift_log_app.public_ip}"
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
    1. Connect to the instance: ${aws_instance.lift_log_app.public_ip}
    2. SSH command: ssh -i ~/.ssh/lift-log-key ec2-user@${aws_instance.lift_log_app.public_ip}
    3. Check the deployment status: sudo systemctl status docker
    4. View application logs: docker-compose logs
    5. Access the application: http://${aws_instance.lift_log_app.public_ip}
    
    Note: It may take 5-10 minutes for the application to be fully operational after the instance starts.
  EOT
}