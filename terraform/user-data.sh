#!/bin/bash

# EC2 User Data Script for Vol Log Application
# This script runs automatically when the EC2 instance starts
# Compatible with Amazon Linux 2023

set -e  # Exit on any error

# Log file for debugging
LOGFILE="/var/log/vol-log-setup.log"
exec > >(tee -a $LOGFILE)
exec 2>&1

echo "$(date): Starting Vol Log application setup..."

# Update system packages
echo "$(date): Updating system packages..."
dnf update -y

# Install required packages
echo "$(date): Installing required packages..."
dnf install -y git docker htop

# Start and enable Docker service
echo "$(date): Starting Docker service..."
systemctl start docker
systemctl enable docker

# Add ec2-user to docker group
echo "$(date): Adding ec2-user to docker group..."
usermod -a -G docker ec2-user

# Install Docker Compose
echo "$(date): Installing Docker Compose..."
curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose
ln -sf /usr/local/bin/docker-compose /usr/bin/docker-compose

# Mount additional EBS volume for Docker data
echo "$(date): Setting up additional EBS volume..."
DATA_DEVICE="/dev/nvme1n1"  # Device name for additional EBS volume
DATA_MOUNT="/opt/vol-log"

# Check if the device exists
if [ -b "$DATA_DEVICE" ]; then
    echo "$(date): Found additional EBS volume at $DATA_DEVICE"
    
    # Check if the device is already formatted
    if ! blkid $DATA_DEVICE; then
        echo "$(date): Formatting EBS volume..."
        mkfs.ext4 $DATA_DEVICE
    fi
    
    # Create mount point and mount
    mkdir -p $DATA_MOUNT
    mount $DATA_DEVICE $DATA_MOUNT
    
    # Add to fstab for persistent mounting
    UUID=$(blkid -s UUID -o value $DATA_DEVICE)
    echo "UUID=$UUID $DATA_MOUNT ext4 defaults,nofail 0 2" >> /etc/fstab
    
    # Set permissions
    chown -R ec2-user:ec2-user $DATA_MOUNT
    chmod 755 $DATA_MOUNT
    
    echo "$(date): EBS volume mounted at $DATA_MOUNT"
else
    echo "$(date): Additional EBS volume not found, using root volume"
    DATA_MOUNT="/opt/vol-log"
    mkdir -p $DATA_MOUNT
    chown -R ec2-user:ec2-user $DATA_MOUNT
fi

# Setup application directory
APP_DIR="$DATA_MOUNT/app"
mkdir -p $APP_DIR
cd $APP_DIR

# Clone application repository (placeholder - user will need to update this)
echo "$(date): Setting up application files..."

# Create directory structure for manual deployment
mkdir -p vol_log/{aws-deploy,terraform}

# Setup SSL certificate directory
echo "$(date): Setting up SSL certificates..."
SSL_DIR="$DATA_MOUNT/ssl"
mkdir -p $SSL_DIR/{certs,private}

# Get AWS region from metadata
AWS_REGION=$(curl -s http://169.254.169.254/latest/meta-data/placement/availability-zone | sed 's/.$//')

# Retrieve SSL certificate from Parameter Store
echo "$(date): Retrieving SSL certificate from Parameter Store..."
if aws ssm get-parameter --name "/vol-log/ssl/certificate" --with-decryption --region $AWS_REGION --query 'Parameter.Value' --output text > $SSL_DIR/certs/cert.pem 2>/dev/null; then
    echo "$(date): SSL certificate retrieved successfully"
    chmod 644 $SSL_DIR/certs/cert.pem
else
    echo "$(date): Warning: SSL certificate not found in Parameter Store. Skipping SSL setup."
fi

# Retrieve SSL private key from Parameter Store  
echo "$(date): Retrieving SSL private key from Parameter Store..."
if aws ssm get-parameter --name "/vol-log/ssl/private-key" --with-decryption --region $AWS_REGION --query 'Parameter.Value' --output text > $SSL_DIR/private/key.pem 2>/dev/null; then
    echo "$(date): SSL private key retrieved successfully"
    chmod 600 $SSL_DIR/private/key.pem
else
    echo "$(date): Warning: SSL private key not found in Parameter Store. Skipping SSL setup."
fi

chown -R ec2-user:ec2-user $APP_DIR $SSL_DIR

# Create systemd service for auto-start
echo "$(date): Creating systemd service..."
cat > /etc/systemd/system/vol-log.service << 'EOF'
[Unit]
Description=Vol Log Application
Requires=docker.service
After=docker.service

[Service]
Type=oneshot
RemainAfterExit=yes
WorkingDirectory=/opt/vol-log/app/vol_log
Environment=NGINX_CONF=./frontend/nginx.prod.conf
ExecStart=/usr/bin/docker-compose up -d
ExecStop=/usr/bin/docker-compose down
TimeoutStartSec=0
User=ec2-user
Group=ec2-user

[Install]
WantedBy=multi-user.target
EOF

# Enable the service (but don't start yet, as app files are not ready)
systemctl daemon-reload

# Install CloudWatch agent (optional, for monitoring)
echo "$(date): Installing CloudWatch agent..."
dnf install -y amazon-cloudwatch-agent

# Configure automatic security updates
echo "$(date): Configuring automatic security updates..."
dnf install -y dnf-automatic
systemctl enable --now dnf-automatic-install.timer

# Create deployment status file
echo "$(date): Creating deployment status file..."
cat > /opt/vol-log/deployment-status.txt << EOF
Vol Log EC2 Instance Setup Complete
=====================================
Timestamp: $(date)
Instance ID: $(curl -s http://169.254.169.254/latest/meta-data/instance-id)
Public IP: $(curl -s http://169.254.169.254/latest/meta-data/public-ipv4)
Private IP: $(curl -s http://169.254.169.254/latest/meta-data/local-ipv4)

Setup Status:
✓ System packages updated
✓ Docker installed and configured
✓ Docker Compose installed
✓ Additional EBS volume mounted (if available)
✓ Application directory created
✓ SSL certificates retrieved from Parameter Store
✓ Systemd service configured

Next Steps:
1. Upload application files to /opt/vol-log/app/vol_log/
2. Configure environment variables
3. Start the application: sudo systemctl start vol-log

SSL Configuration:
- Certificate: /opt/vol-log/ssl/certs/cert.pem
- Private Key: /opt/vol-log/ssl/private/key.pem
- Nginx Config: Production mode with Cloudflare IP restrictions

Manual Commands:
- Check Docker status: sudo systemctl status docker
- View this log: tail -f /var/log/vol-log-setup.log
- Access app directory: cd /opt/vol-log/app
EOF

chown ec2-user:ec2-user /opt/vol-log/deployment-status.txt

# Set up log rotation for application logs
echo "$(date): Setting up log rotation..."
cat > /etc/logrotate.d/vol-log << 'EOF'
/opt/vol-log/app/vol_log/logs/*.log {
    daily
    missingok
    rotate 7
    compress
    delaycompress
    copytruncate
    notifempty
}
EOF

# Final setup
echo "$(date): Final setup steps..."

# Update file permissions
chown -R ec2-user:ec2-user /opt/vol-log

# Install convenience tools
dnf install -y tree nano vim wget curl unzip

# Create welcome message
cat > /etc/motd << 'EOF'
====================================
  Vol Log Application Server
====================================

Application Status:
- Check status: sudo systemctl status vol-log
- View logs: tail -f /var/log/vol-log-setup.log
- App directory: /opt/vol-log/app/

Useful Commands:
- docker ps                 # View running containers
- docker-compose logs       # View application logs
- htop                      # System monitoring

For support, check deployment-status.txt:
cat /opt/vol-log/deployment-status.txt
====================================
EOF

echo "$(date): Vol Log application setup completed successfully!"
echo "$(date): Instance is ready for application deployment."

# Signal that setup is complete
touch /opt/vol-log/setup-complete

# Send completion notification to CloudWatch (optional)
if command -v aws &> /dev/null; then
    aws logs create-log-group --log-group-name "/vol-log/setup" --region $(curl -s http://169.254.169.254/latest/meta-data/placement/availability-zone | sed 's/.$//')
    aws logs put-log-events --log-group-name "/vol-log/setup" --log-stream-name "$(date +%Y%m%d)" --log-events timestamp=$(date +%s)000,message="EC2 setup completed successfully"
fi