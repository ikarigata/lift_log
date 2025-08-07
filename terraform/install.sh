#!/bin/bash
# This script is executed by the user_data of the EC2 instance.

# Exit immediately if a command exits with a non-zero status.
set -e

# Update the package list and install necessary packages
# ca-certificates and curl are needed for Docker's official GPG key
# gnupg is for managing GPG keys
# lsb-release is for identifying the distribution
sudo apt-get update
sudo apt-get install -y ca-certificates curl gnupg lsb-release git

# Add Docker's official GPG key
sudo mkdir -p /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg

# Set up the Docker repository
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# Install Docker Engine
sudo apt-get update
sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin

# Install Docker Compose
# Note: This installs Docker Compose V2. The command is 'docker compose' (with a space).
sudo apt-get install -y docker-compose-plugin

# Add the 'ubuntu' user to the 'docker' group to run docker commands without sudo
sudo usermod -aG docker ubuntu

# --- Application Deployment ---

# PLEASE REPLACE THIS WITH YOUR REPOSITORY URL
# If your repository is private, you will need to set up a deploy key or other authentication method.
export GIT_REPO_URL="https://github.com/your-username/your-repo.git"

# Clone the repository
git clone $GIT_REPO_URL /home/ubuntu/app

# Navigate to the app directory
cd /home/ubuntu/app

# Start the application using Docker Compose
# The '-d' flag runs the containers in detached mode (in the background).
# The command is 'docker compose' because we installed the plugin version.
docker compose up -d
