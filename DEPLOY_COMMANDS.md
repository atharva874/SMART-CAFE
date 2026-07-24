# Deployment Commands Cheat Sheet 📋

Quick reference for deploying your cafe ordering system.

---

## 🎯 Pre-Deployment Setup

### **1. Install Required Tools**

```bash
# Vercel CLI
npm install -g vercel

# Netlify CLI
npm install -g netlify-cli

# AWS CLI
# Download from: https://aws.amazon.com/cli/

# Heroku CLI
# Download from: https://devcenter.heroku.com/articles/heroku-cli
```

### **2. Create Environment File**

```bash
cd frontend

# Create production environment file
cat > .env.production << EOF
REACT_APP_API_URL=https://your-backend-api.com
REACT_APP_SOCKET_URL=https://your-backend-api.com
REACT_APP_ENV=production
EOF
```

### **3. Test Build Locally**

```bash
cd frontend

# Install dependencies
npm install

# Create production build
npm run build

# Test the build locally
npx serve -s build -p 3000
```

Visit http://localhost:3000 to verify everything works.

---

## 🚀 Vercel Deployment

### **Quick Deploy (Easiest)**

```bash
cd frontend

# Login to Vercel
vercel login

# Deploy to preview
vercel

# Deploy to production
vercel --prod
```

### **With Custom Configuration**

```bash
# Deploy with environment variables
vercel --prod \
  -e REACT_APP_API_URL=https://api.yourcafe.com \
  -e REACT_APP_SOCKET_URL=https://api.yourcafe.com

# Deploy specific branch
vercel --prod --scope your-team
```

### **Link to Existing Project**

```bash
cd frontend

# Link to existing Vercel project
vercel link

# Deploy
vercel --prod
```

### **Custom Domain**

```bash
# Add custom domain
vercel domains add yourcafe.com

# Remove domain
vercel domains rm yourcafe.com
```

---

## 🌐 Netlify Deployment

### **Quick Deploy**

```bash
cd frontend

# Login to Netlify
netlify login

# Initialize new site
netlify init

# Deploy to production
netlify deploy --prod --dir=build
```

### **Continuous Deployment Setup**

```bash
# Link to git repository
netlify link

# Set build settings
netlify build:config

# Deploy
netlify deploy --prod
```

### **Environment Variables**

```bash
# Set environment variable
netlify env:set REACT_APP_API_URL https://api.yourcafe.com

# List all environment variables
netlify env:list

# Import from .env file
netlify env:import .env.production
```

### **Custom Domain**

```bash
# Add custom domain
netlify domains:add yourcafe.com

# Create DNS record
netlify dns:create yourcafe.com A 104.198.14.52
```

---

## 📦 GitHub Pages Deployment

### **Setup**

```bash
cd frontend

# Install gh-pages
npm install --save-dev gh-pages

# Add scripts to package.json
npm pkg set homepage="https://username.github.io/cafe-ordering-system"
npm pkg set scripts.predeploy="npm run build"
npm pkg set scripts.deploy="gh-pages -d build"
```

### **Deploy**

```bash
# Deploy to GitHub Pages
npm run deploy
```

### **Custom Domain**

```bash
# Create CNAME file
echo "yourcafe.com" > public/CNAME

# Rebuild and deploy
npm run deploy
```

---

## ☁️ AWS S3 + CloudFront Deployment

### **Setup S3 Bucket**

```bash
# Configure AWS CLI
aws configure

# Create S3 bucket
aws s3 mb s3://cafe-ordering-system --region us-east-1

# Enable static website hosting
aws s3 website s3://cafe-ordering-system \
  --index-document index.html \
  --error-document index.html
```

### **Deploy to S3**

```bash
cd frontend

# Build the project
npm run build

# Sync to S3
aws s3 sync build/ s3://cafe-ordering-system \
  --delete \
  --cache-control max-age=31536000,public

# Update index.html with no-cache
aws s3 cp build/index.html s3://cafe-ordering-system/index.html \
  --cache-control no-cache,no-store,must-revalidate \
  --metadata-directive REPLACE
```

### **Make Bucket Public**

```bash
# Create bucket policy file
cat > bucket-policy.json << EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::cafe-ordering-system/*"
    }
  ]
}
EOF

# Apply bucket policy
aws s3api put-bucket-policy \
  --bucket cafe-ordering-system \
  --policy file://bucket-policy.json
```

### **Setup CloudFront**

```bash
# Create CloudFront distribution
aws cloudfront create-distribution \
  --origin-domain-name cafe-ordering-system.s3.amazonaws.com \
  --default-root-object index.html

# Get distribution ID
aws cloudfront list-distributions \
  --query 'DistributionList.Items[0].Id' \
  --output text

# Invalidate cache after deployment
aws cloudfront create-invalidation \
  --distribution-id YOUR_DISTRIBUTION_ID \
  --paths "/*"
```

### **Automated Deploy Script**

```bash
# Create deploy script
cat > deploy-aws.sh << 'EOF'
#!/bin/bash

echo "Building project..."
npm run build

echo "Uploading to S3..."
aws s3 sync build/ s3://cafe-ordering-system --delete

echo "Invalidating CloudFront cache..."
aws cloudfront create-invalidation \
  --distribution-id YOUR_DISTRIBUTION_ID \
  --paths "/*"

echo "✅ Deployment complete!"
EOF

# Make executable
chmod +x deploy-aws.sh

# Run deployment
./deploy-aws.sh
```

---

## 🖥️ VPS/Server Deployment (Nginx)

### **Setup Server**

```bash
# SSH into server
ssh user@your-server-ip

# Update system
sudo apt update && sudo apt upgrade -y

# Install Nginx
sudo apt install nginx -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Create deployment directory
sudo mkdir -p /var/www/cafe-app
sudo chown -R $USER:$USER /var/www/cafe-app
```

### **Configure Nginx**

```bash
# Create Nginx configuration
sudo nano /etc/nginx/sites-available/cafe-app

# Add this configuration:
cat << 'EOF' | sudo tee /etc/nginx/sites-available/cafe-app
server {
    listen 80;
    server_name yourcafe.com www.yourcafe.com;
    root /var/www/cafe-app;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location ~* \.(jpg|jpeg|png|gif|ico|css|js)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
}
EOF

# Enable site
sudo ln -s /etc/nginx/sites-available/cafe-app /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### **Deploy Files**

```bash
# On your local machine
cd frontend
npm run build

# Copy to server
scp -r build/* user@your-server-ip:/var/www/cafe-app/

# Or use rsync (better for updates)
rsync -avz --delete build/ user@your-server-ip:/var/www/cafe-app/
```

### **Setup SSL with Let's Encrypt**

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx -y

# Get SSL certificate
sudo certbot --nginx -d yourcafe.com -d www.yourcafe.com

# Auto-renewal (already setup by certbot)
# Test renewal
sudo certbot renew --dry-run
```

### **Automated Deploy Script**

```bash
# Create local deploy script
cat > deploy-vps.sh << 'EOF'
#!/bin/bash

SERVER_USER="your-user"
SERVER_IP="your-server-ip"
SERVER_PATH="/var/www/cafe-app"

echo "🔨 Building project..."
npm run build

echo "📦 Uploading to server..."
rsync -avz --delete build/ $SERVER_USER@$SERVER_IP:$SERVER_PATH/

echo "✅ Deployment complete!"
echo "Visit: https://yourcafe.com"
EOF

chmod +x deploy-vps.sh

# Deploy
./deploy-vps.sh
```

---

## 🐳 Docker Deployment

### **Create Dockerfile**

```bash
cd frontend

cat > Dockerfile << 'EOF'
# Build stage
FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
EOF
```

### **Create Nginx Config**

```bash
cat > nginx.conf << 'EOF'
server {
    listen 80;
    server_name _;
    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location ~* \.(jpg|jpeg|png|gif|ico|css|js)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
EOF
```

### **Build and Run**

```bash
# Build Docker image
docker build -t cafe-frontend .

# Run container
docker run -d -p 80:80 --name cafe-app cafe-frontend

# Stop container
docker stop cafe-app

# Remove container
docker rm cafe-app
```

### **Docker Compose**

```bash
cat > docker-compose.yml << 'EOF'
version: '3.8'

services:
  frontend:
    build: ./frontend
    ports:
      - "80:80"
    environment:
      - REACT_APP_API_URL=https://api.yourcafe.com
    restart: unless-stopped
EOF

# Start services
docker-compose up -d

# Stop services
docker-compose down
```

---

## 🔄 Update/Redeploy Commands

### **Vercel**

```bash
# Redeploy current production
vercel --prod

# Redeploy specific deployment
vercel alias <deployment-url> yourcafe.com
```

### **Netlify**

```bash
# Redeploy
netlify deploy --prod --dir=build

# Rollback to previous deploy
netlify rollback
```

### **AWS S3**

```bash
# Quick redeploy
npm run build && aws s3 sync build/ s3://cafe-ordering-system --delete
aws cloudfront create-invalidation --distribution-id YOUR_ID --paths "/*"
```

### **VPS**

```bash
# Redeploy
./deploy-vps.sh
```

---

## 🔍 Verify Deployment

### **Check if Site is Live**

```bash
# Check HTTP response
curl -I https://yourcafe.com

# Check SSL certificate
curl -vI https://yourcafe.com 2>&1 | grep -i ssl

# Test API connection
curl https://yourcafe.com/api/health
```

### **Performance Testing**

```bash
# Lighthouse (requires Chrome)
lighthouse https://yourcafe.com --output html --output-path ./report.html

# Load testing
ab -n 1000 -c 10 https://yourcafe.com/

# Security scan
npm install -g @lhci/cli
lhci autorun --url=https://yourcafe.com
```

---

## 🧹 Cleanup Commands

### **Vercel**

```bash
# List all deployments
vercel list

# Remove deployment
vercel remove <deployment-url>

# Remove all inactive deployments
vercel rm --safe --yes
```

### **Netlify**

```bash
# List sites
netlify sites:list

# Delete site
netlify sites:delete <site-id>
```

### **AWS S3**

```bash
# Empty bucket
aws s3 rm s3://cafe-ordering-system --recursive

# Delete bucket
aws s3 rb s3://cafe-ordering-system

# Delete CloudFront distribution
aws cloudfront delete-distribution \
  --id YOUR_DISTRIBUTION_ID \
  --if-match ETAG
```

---

## 🆘 Troubleshooting Commands

### **Check Build Issues**

```bash
# Verbose build
npm run build -- --verbose

# Check for unused dependencies
npm prune

# Clear cache and rebuild
rm -rf node_modules package-lock.json
npm install
npm run build
```

### **Check Deployment Status**

```bash
# Vercel
vercel inspect <deployment-url>

# Netlify
netlify status

# AWS S3
aws s3 ls s3://cafe-ordering-system --recursive --human-readable
```

### **View Logs**

```bash
# Vercel logs
vercel logs <deployment-url>

# Netlify logs
netlify logs

# Docker logs
docker logs cafe-app -f
```

---

## 📝 Quick Reference

| Task | Command |
|------|---------|
| **Deploy to Vercel** | `vercel --prod` |
| **Deploy to Netlify** | `netlify deploy --prod --dir=build` |
| **Deploy to GitHub Pages** | `npm run deploy` |
| **Deploy to AWS S3** | `aws s3 sync build/ s3://bucket --delete` |
| **Deploy to VPS** | `rsync -avz build/ user@server:/path/` |
| **Check site** | `curl -I https://yoursite.com` |
| **View logs** | `vercel logs` or `netlify logs` |

---

## 🎯 Common Workflows

### **Update and Deploy**

```bash
# Pull latest changes
git pull origin main

# Install any new dependencies
npm install

# Build and deploy
npm run build
vercel --prod
```

### **Hotfix Deployment**

```bash
# Fix the issue
# Commit changes
git add .
git commit -m "hotfix: fix critical bug"
git push origin main

# Quick deploy
vercel --prod
```

### **Rollback**

```bash
# Vercel
vercel rollback

# Or deploy specific commit
git checkout <commit-hash>
vercel --prod
git checkout main
```

---

For detailed explanations, see [FRONTEND_DEPLOYMENT_GUIDE.md](./FRONTEND_DEPLOYMENT_GUIDE.md)
