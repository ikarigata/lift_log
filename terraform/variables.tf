# Variables for Vol Log AWS deployment
# Cost-optimized configuration for personal use

variable "aws_region" {
  description = "AWS region for deployment"
  type        = string
  default     = "ap-northeast-1" # Tokyo region (lowest latency for Japan)
}

variable "environment" {
  description = "Environment name (e.g., dev, staging, prod)"
  type        = string
  default     = "prod"
}

variable "instance_type" {
  description = "EC2 instance type (cost-optimized)"
  type        = string
  default     = "t3.micro" # Free Tier eligible
  
  validation {
    condition = contains([
      "t3.micro", "t3.small", "t3.medium", 
      "t2.micro", "t2.small", "t2.medium"
    ], var.instance_type)
    error_message = "Instance type must be a cost-effective option."
  }
}

variable "root_volume_size" {
  description = "Size of the root EBS volume in GB"
  type        = number
  default     = 20 # Minimum size for cost optimization
  
  validation {
    condition     = var.root_volume_size >= 8 && var.root_volume_size <= 100
    error_message = "Root volume size must be between 8 and 100 GB."
  }
}

variable "data_volume_size" {
  description = "Size of the additional data EBS volume in GB (for Docker volumes)"
  type        = number
  default     = 20 # For PostgreSQL data and Docker images
  
  validation {
    condition     = var.data_volume_size >= 10 && var.data_volume_size <= 100
    error_message = "Data volume size must be between 10 and 100 GB."
  }
}

variable "public_key" {
  description = "Public SSH key for EC2 access"
  type        = string
  
  validation {
    condition     = can(regex("^ssh-(rsa|dss|ed25519|ecdsa)", var.public_key))
    error_message = "Public key must be a valid SSH public key."
  }
}

variable "allowed_ssh_cidrs" {
  description = "CIDR blocks allowed for SSH access"
  type        = list(string)
  default     = ["0.0.0.0/0"] # CAUTION: Open to all IPs (consider restricting to your IP)
  
  validation {
    condition     = length(var.allowed_ssh_cidrs) > 0
    error_message = "At least one CIDR block must be specified for SSH access."
  }
}

variable "domain_name" {
  description = "Domain name for the application (optional)"
  type        = string
  default     = "vollog.net"
}

# Tags
variable "additional_tags" {
  description = "Additional tags to apply to all resources"
  type        = map(string)
  default     = {}
}