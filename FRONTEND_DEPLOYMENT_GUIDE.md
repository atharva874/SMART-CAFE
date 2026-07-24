# Frontend Deployment Guide - Cafe Ordering System

This guide covers deploying the React frontend to various platforms.

---

## 📋 Table of Contents

1. [Pre-Deployment Checklist](#pre-deployment-checklist)
2. [Deployment Options](#deployment-options)
   - [Vercel (Recommended)](#1-vercel-recommended)
   - [Netlify](#2-netlify)
   - [GitHub Pages](#3-github-pages)
   - [AWS S3 + CloudFront](#4-aws-s3--cloudfront)
   - [Traditional Hosting (cPanel/VPS)](#5-traditional-hosting-cpanelvps)
3. [Environment Configuration](#environment-configuration)
4. [Post-Deployment Steps](#post-deployment-steps)
5. [Troubleshooting](#troubleshooting)

---

## 🔍 Pre-Deployment Checklist

### **1. Update API Base URL**

Create a `.env` file in the `frontend` directory:

```env
# For Production
REACT_APP_API_URL=https://your-backend-api.com

# For Local Testing
# REACT_APP_API_URL=http://localhost:5000
```

### **2. Update API Calls**

Create `frontend/src/config/api.js`:

```javascript
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  withCredentials: true
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
```

Then update all API calls to use this:
```javascript
// Instead of: axios.get('/api/foods')
// Use: api.get('/foods')
import api from '../config/api';
```

### **3. Update Socket.IO Configuration**

Update `frontend/src/context/SocketContext.js`:

```javascript
import io from 'socket.io-client';

const SOCKET_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const socket = io(SOCKET_URL, {
  withCredentials: true,
  transports: ['websocket', 'polling']
});
```

### **4. Build the Project**

Test the production build locally:

```bash
cd frontend
npm run build
```

This creates an optimized production build in the `build` folder.

### **5. Test Production Build Locally**

```bash
# Install serve globally
npm install -g serve

# Serve the build folder
serve -s build -p 3000
```

Visit http://localhost:3000 to test the production build.

---

## 🚀 Deployment Options

## 1. Vercel (Recommended)

**Best for:** Quick deployment, automatic SSL, great for React apps

### **A. Deploy via Vercel CLI**

```bash
# Install Vercel CLI
npm install -g vercel

# Navigate to frontend directory
cd frontend

# Login to Vercel
vercel login

# Deploy
vercel

# For production deployment
vercel --prod
```

### **B. Deploy via Vercel Dashboard**

1. Go to [vercel.com](https://vercel.com)
2. Sign up/Login with GitHub
3. Click **"Add New Project"**
4. Import your GitHub repository
5. Configure:
   - **Framework Preset:** Create React App
   - **Root Directory:** `frontend`
   - **Build Command:** `npm run build`
   - **Output Directory:** `build`
6. Add Environment Variables:
   ```
   REACT_APP_API_URL=https://your-backend-api.com
   ```
7. Click **"Deploy"**

### **Vercel Configuration File**

Create `frontend/vercel.json`:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "build"
      }
    }
  ],
  "routes": [
    {
      "src": "/static/(.*)",
      "dest": "/static/$1"
    },
    {
      "src": "/favicon.ico",
      "dest": "/favicon.ico"
    },
    {
      "src": "/manifest.json",
      "dest": "/manifest.json"
    },
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ]
}
```

---

## 2. Netlify

**Best for:** Easy deployment, form handling, serverless functions

### **A. Deploy via Netlify CLI**

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Navigate to frontend directory
cd frontend

# Build the project
npm run build

# Deploy
netlify deploy

# For production
netlify deploy --prod
```

### **B. Deploy via Netlify Dashboard**

1. Go to [netlify.com](https://netlify.com)
2. Sign up/Login
3. Click **"Add new site"** → **"Import an existing project"**
4. Connect to Git (GitHub/GitLab/Bitbucket)
5. Configure:
   - **Base directory:** `frontend`
   - **Build command:** `npm run build`
   - **Publish directory:** `frontend/build`
6. Add Environment Variables:
   ```
   REACT_APP_API_URL=https://your-backend-api.com
   ```
7. Click **"Deploy site"**

### **Netlify Configuration File**

Create `frontend/netlify.toml`:

```toml
[build]
  base = "frontend"
  command = "npm run build"
  publish = "build"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[build.environment]
  NODE_VERSION = "18"
```

### **Custom Domain Setup**

1. Go to **Site settings** → **Domain management**
2. Click **"Add custom domain"**
3. Follow DNS configuration instructions

---

## 3. GitHub Pages

**Best for:** Free hosting for open-source projects

### **Setup**

1. Install gh-pages package:
```bash
cd frontend
npm install --save-dev gh-pages
```

2. Update `frontend/package.json`:
```json
{
  "homepage": "https://yourusername.github.io/cafe-ordering-system",
  "scripts": {
    "predeploy": "npm run build",
    "deploy": "gh-pages -d build"
  }
}
```

3. Deploy:
```bash
npm run deploy
```

4. Enable GitHub Pages:
   - Go to repository **Settings** → **Pages**
   - Source: `gh-pages` branch
   - Click **Save**

### **Custom Domain with GitHub Pages**

Create `frontend/public/CNAME`:
```
yourdomain.com
```

Configure DNS:
```
A Record: 185.199.108.153
A Record: 185.199.109.153
A Record: 185.199.110.153
A Record: 185.199.111.153
CNAME: yourusername.github.io
```

---

## 4. AWS S3 + CloudFront

**Best for:** Scalable hosting with CDN, full AWS integration

### **Step 1: Create S3 Bucket**

```bash
# Install AWS CLI
# https://aws.amazon.com/cli/

# Configure AWS credentials
aws configure

# Create bucket
aws s3 mb s3://your-cafe-app --region us-east-1

# Enable static website hosting
aws s3 website s3://your-cafe-app --index-document index.html --error-document index.html
```

### **Step 2: Build and Upload**

```bash
cd frontend

# Build
npm run build

# Upload to S3
aws s3 sync build/ s3://your-cafe-app --delete

# Set public read permissions
aws s3api put-bucket-policy --bucket your-cafe-app --policy file://bucket-policy.json
```

Create `bucket-policy.json`:
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::your-cafe-app/*"
    }
  ]
}
```

### **Step 3: Setup CloudFront CDN**

1. Go to AWS CloudFront console
2. Create distribution
3. Origin Domain: Select your S3 bucket
4. Viewer Protocol Policy: Redirect HTTP to HTTPS
5. Default Root Object: `index.html`
6. Error Pages: Add custom error response
   - HTTP Error Code: 403, 404
   - Response Page Path: `/index.html`
   - HTTP Response Code: 200

### **Deployment Script**

Create `frontend/deploy-aws.sh`:
```bash
#!/bin/bash

# Build the project
npm run build

# Sync to S3
aws s3 sync build/ s3://your-cafe-app --delete --cache-control max-age=31536000

# Update index.html with no-cache
aws s3 cp build/index.html s3://your-cafe-app/index.html --cache-control no-cache

# Invalidate CloudFront cache
aws cloudfront create-invalidation --distribution-id YOUR_DISTRIBUTION_ID --paths "/*"

echo "Deployment complete!"
```

Make it executable:
```bash
chmod +x deploy-aws.sh
```

---

## 5. Traditional Hosting (cPanel/VPS)

**Best for:** Shared hosting, existing infrastructure

### **A. cPanel Deployment**

1. **Build the project:**
```bash
cd frontend
npm run build
```

2. **Compress the build folder:**
```bash
zip -r build.zip build/
```

3. **Upload via cPanel:**
   - Login to cPanel
   - Go to File Manager
   - Navigate to `public_html` (or your domain folder)
   - Upload `build.zip`
   - Extract the archive
   - Move contents from `build/` to `public_html/`

4. **Configure .htaccess:**

Create `public_html/.htaccess`:
```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteCond %{REQUEST_FILENAME} !-l
  RewriteRule . /index.html [L]
</IfModule>

# Enable GZIP compression
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/plain text/xml text/css text/javascript application/javascript
</IfModule>

# Browser caching
<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType image/jpg "access plus 1 year"
  ExpiresByType image/jpeg "access plus 1 year"
  ExpiresByType image/gif "access plus 1 year"
  ExpiresByType image/png "access plus 1 year"
  ExpiresByType text/css "access plus 1 month"
  ExpiresByType application/javascript "access plus 1 month"
</IfModule>
```

### **B. VPS/Linux Server Deployment**

1. **Setup Nginx:**

```bash
# Install Nginx
sudo apt update
sudo apt install nginx

# Create site configuration
sudo nano /etc/nginx/sites-available/cafe-app
```

Add configuration:
```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    root /var/www/cafe-app;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache static assets
    location ~* \.(jpg|jpeg|png|gif|ico|css|js)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
}
```

Enable site:
```bash
sudo ln -s /etc/nginx/sites-available/cafe-app /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

2. **Deploy the build:**

```bash
# On your local machine, build and copy
cd frontend
npm run build
scp -r build/* user@your-server:/var/www/cafe-app/
```

3. **Setup SSL with Let's Encrypt:**

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

### **Automated Deployment Script**

Create `frontend/deploy-vps.sh`:
```bash
#!/bin/bash

SERVER_USER="your-user"
SERVER_IP="your-server-ip"
SERVER_PATH="/var/www/cafe-app"

echo "Building project..."
npm run build

echo "Uploading to server..."
rsync -avz --delete build/ $SERVER_USER@$SERVER_IP:$SERVER_PATH/

echo "Deployment complete!"
```

---

## 🔧 Environment Configuration

### **Development (.env.development)**
```env
REACT_APP_API_URL=http://localhost:5000
REACT_APP_SOCKET_URL=http://localhost:5000
REACT_APP_ENV=development
```

### **Production (.env.production)**
```env
REACT_APP_API_URL=https://api.yourcafe.com
REACT_APP_SOCKET_URL=https://api.yourcafe.com
REACT_APP_ENV=production
```

### **Using Environment Variables**

Update all API calls throughout your app:

```javascript
// src/config/constants.js
export const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
export const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || 'http://localhost:5000';

// Usage
import { API_URL } from './config/constants';
```

---

## ✅ Post-Deployment Steps

### **1. Update CORS on Backend**

Update `backend/server.js`:
```javascript
app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://yourcafe.com',
    'https://www.yourcafe.com'
  ],
  credentials: true
}));
```

### **2. Configure Socket.IO CORS**

```javascript
const io = socketIo(server, {
  cors: {
    origin: [
      'http://localhost:3000',
      'https://yourcafe.com',
      'https://www.yourcafe.com'
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
  }
});
```

### **3. Test Critical Flows**

- ✅ User registration and login
- ✅ Menu browsing
- ✅ Cart operations
- ✅ Checkout and order placement
- ✅ Real-time order updates
- ✅ Admin login and dashboard
- ✅ Order management
- ✅ Menu management

### **4. Setup Monitoring**

**Google Analytics:**
```html
<!-- public/index.html -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

**Error Tracking (Sentry):**
```bash
npm install @sentry/react
```

```javascript
// src/index.js
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "YOUR_SENTRY_DSN",
  environment: process.env.REACT_APP_ENV,
});
```

### **5. Performance Optimization**

Add to `package.json`:
```json
{
  "scripts": {
    "build": "GENERATE_SOURCEMAP=false react-scripts build",
    "analyze": "source-map-explorer 'build/static/js/*.js'"
  }
}
```

---

## 🔍 Troubleshooting

### **Issue: Blank Page After Deployment**

**Solution:**
1. Check browser console for errors
2. Verify `homepage` in package.json matches your URL
3. Check `.htaccess` or Nginx configuration for routing
4. Ensure all assets are loaded with correct paths

### **Issue: API Calls Failing**

**Solution:**
1. Check CORS configuration on backend
2. Verify `REACT_APP_API_URL` is set correctly
3. Check browser network tab for request URLs
4. Ensure backend is deployed and accessible

### **Issue: 404 on Page Refresh**

**Solution:**
- Add redirect rules (see platform-specific sections above)
- Configure server to always serve `index.html`

### **Issue: Environment Variables Not Working**

**Solution:**
1. Ensure variables start with `REACT_APP_`
2. Rebuild the project after changing `.env`
3. Restart development server
4. Check if `.env` is in `.gitignore`

### **Issue: Socket.IO Not Connecting**

**Solution:**
1. Check SOCKET_URL matches backend URL
2. Verify Socket.IO CORS configuration
3. Enable both `websocket` and `polling` transports
4. Check firewall/security group settings

---

## 📊 Deployment Comparison

| Platform | Difficulty | Cost | Best For | Build Time |
|----------|-----------|------|----------|------------|
| **Vercel** | ⭐ Easy | Free/Paid | React apps, quick deployment | ~2 min |
| **Netlify** | ⭐ Easy | Free/Paid | Static sites, forms | ~2 min |
| **GitHub Pages** | ⭐⭐ Medium | Free | Open source projects | ~3 min |
| **AWS S3** | ⭐⭐⭐ Advanced | Pay-as-go | Scalable production | ~10 min |
| **cPanel** | ⭐⭐ Medium | Varies | Existing hosting | ~5 min |
| **VPS** | ⭐⭐⭐ Advanced | $5-50/mo | Full control | ~15 min |

---

## 🎯 Recommended Approach

### **For Quick Testing/MVP:**
→ **Vercel** - Easiest, free tier, automatic deployments

### **For Production (Small-Medium):**
→ **Netlify** or **Vercel** - Reliable, great DX, automatic SSL

### **For Production (Enterprise):**
→ **AWS S3 + CloudFront** - Scalable, global CDN, full control

### **For Existing Infrastructure:**
→ **VPS with Nginx** - Full control, existing setup

---

## 📝 Final Checklist

Before going live:

- [ ] Environment variables configured
- [ ] API endpoints updated
- [ ] CORS configured on backend
- [ ] SSL certificate installed
- [ ] Custom domain configured
- [ ] Error tracking setup (Sentry)
- [ ] Analytics setup (Google Analytics)
- [ ] All features tested on production
- [ ] Mobile responsiveness verified
- [ ] Performance optimized
- [ ] SEO meta tags added
- [ ] Backup strategy in place

---

## 🆘 Need Help?

- **Vercel Docs:** https://vercel.com/docs
- **Netlify Docs:** https://docs.netlify.com
- **React Deployment:** https://create-react-app.dev/docs/deployment/
- **AWS S3 Static Hosting:** https://docs.aws.amazon.com/AmazonS3/latest/userguide/WebsiteHosting.html

---

**Happy Deploying! 🚀**
