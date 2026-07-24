# Quick Deployment Guide 🚀

## 🎯 Fastest Way to Deploy (5 Minutes)

### **Step 1: Prepare Your Code**

```bash
# 1. Create environment file
cd frontend
echo "REACT_APP_API_URL=https://your-backend-url.com" > .env.production

# 2. Test build locally
npm run build
```

### **Step 2: Deploy to Vercel (Easiest)**

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
cd frontend
vercel --prod
```

**That's it!** Your frontend is live in ~2 minutes.

---

## 🔗 Quick Links by Platform

### **Vercel (Recommended)**
1. Visit: https://vercel.com
2. Import GitHub repo
3. Set Root Directory: `frontend`
4. Add env var: `REACT_APP_API_URL`
5. Deploy ✅

### **Netlify**
1. Visit: https://netlify.com
2. Drag & drop `frontend/build` folder
3. Done ✅

### **GitHub Pages**
```bash
cd frontend
npm install --save-dev gh-pages
# Add to package.json: "homepage": "https://username.github.io/repo"
npm run deploy
```

---

## ⚙️ Environment Variables Needed

```env
REACT_APP_API_URL=https://your-backend-api.com
```

That's the only variable you need! Add it to your deployment platform.

---

## 🔧 Backend CORS Update

Don't forget to update backend CORS:

```javascript
// backend/server.js
app.use(cors({
  origin: 'https://your-frontend-url.com',
  credentials: true
}));
```

---

## ✅ Quick Test Checklist

After deployment:
- [ ] Can you load the homepage?
- [ ] Can you login?
- [ ] Can you see menu items?
- [ ] Can you add to cart?
- [ ] Can you checkout?

---

## 🆘 Common Issues

**Blank page?**
→ Check browser console, verify API URL

**API not working?**
→ Update CORS on backend

**404 on refresh?**
→ Configure redirects (see full guide)

---

For detailed instructions, see [FRONTEND_DEPLOYMENT_GUIDE.md](./FRONTEND_DEPLOYMENT_GUIDE.md)
