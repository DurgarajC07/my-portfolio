# 🚀 Deployment Guide

This guide will help you deploy your portfolio to production.

---

## 📋 Pre-Deployment Checklist

Before deploying, make sure to:

- [ ] Change default admin password
- [ ] Update SECRET_KEY in backend .env
- [ ] Add your actual content
- [ ] Upload your resume
- [ ] Configure SEO settings
- [ ] Test all functionality locally
- [ ] Create a database backup
- [ ] Update CORS_ORIGINS for your domain

---

## 🔧 Backend Deployment

### Option 1: Railway (Recommended - Free Tier Available)

1. **Create Railway Account**
   - Go to [railway.app](https://railway.app)
   - Sign up with GitHub

2. **Create New Project**
   - Click "New Project"
   - Choose "Deploy from GitHub repo"
   - Select your repository
   - Choose `backend` folder as root

3. **Configure Environment Variables**

   ```
   SECRET_KEY=<generate-a-strong-random-key>
   ALGORITHM=HS256
   ACCESS_TOKEN_EXPIRE_MINUTES=30
   CORS_ORIGINS=https://your-frontend-domain.com
   ```

4. **Configure Build Settings**
   - **Build Command**: `pip install -r requirements.txt && python -m app.database`
   - **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`

5. **Deploy**
   - Click "Deploy"
   - Railway will give you a URL like: `https://your-app.railway.app`

---

### Option 2: Render

1. **Create Render Account**
   - Go to [render.com](https://render.com)
   - Sign up with GitHub

2. **Create New Web Service**
   - Click "New +" → "Web Service"
   - Connect your repository
   - Choose `backend` folder as root

3. **Configure**
   - **Name**: portfolio-backend
   - **Environment**: Python 3
   - **Build Command**: `pip install -r requirements.txt && python -m app.database`
   - **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`

4. **Add Environment Variables**
   - Same as Railway above

5. **Deploy**
   - Click "Create Web Service"

---

### Option 3: DigitalOcean App Platform

1. **Create DigitalOcean Account**
   - Go to [digitalocean.com](https://digitalocean.com)

2. **Create App**
   - Go to "Apps" → "Create App"
   - Connect GitHub repository
   - Select `backend` folder

3. **Configure**
   - **Type**: Web Service
   - **Build Command**: `pip install -r requirements.txt && python -m app.database`
   - **Run Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`

4. **Add Environment Variables**
   - Add all variables from .env

5. **Deploy**

---

## 🎨 Frontend Deployment

### Option 1: Vercel (Recommended - Free Tier)

1. **Install Vercel CLI** (optional)

   ```bash
   npm install -g vercel
   ```

2. **Deploy via GitHub** (easier)
   - Go to [vercel.com](https://vercel.com)
   - Click "Import Project"
   - Connect GitHub repository
   - Select `frontend` folder as root

3. **Configure**
   - **Framework**: Next.js
   - **Build Command**: `pnpm build`
   - **Output Directory**: `.next`

4. **Environment Variables**

   ```
   NEXT_PUBLIC_API_URL=https://your-backend.railway.app
   NEXT_PUBLIC_SITE_URL=https://your-domain.vercel.app
   ```

5. **Deploy**
   - Click "Deploy"
   - Vercel will give you a URL

---

### Option 2: Netlify

1. **Create Netlify Account**
   - Go to [netlify.com](https://netlify.com)
   - Sign up with GitHub

2. **Add New Site**
   - Click "Add new site" → "Import existing project"
   - Connect GitHub repository
   - Select `frontend` folder

3. **Configure Build Settings**
   - **Base directory**: `frontend`
   - **Build command**: `pnpm build`
   - **Publish directory**: `.next`

4. **Environment Variables**
   - Add NEXT_PUBLIC_API_URL and NEXT_PUBLIC_SITE_URL

5. **Deploy**

---

### Option 3: Cloudflare Pages

1. **Create Cloudflare Account**
   - Go to [cloudflare.com](https://cloudflare.com)

2. **Create Pages Project**
   - Go to Pages → "Create a project"
   - Connect GitHub repository

3. **Configure**
   - **Production branch**: main
   - **Framework preset**: Next.js
   - **Build command**: `pnpm build`

4. **Environment Variables**
   - Add your API URL and site URL

5. **Deploy**

---

## 🔒 Security Considerations

### Backend

1. **Change SECRET_KEY**

   ```bash
   # Generate a strong key
   python -c "import secrets; print(secrets.token_hex(32))"
   ```

2. **Update CORS Origins**

   ```env
   CORS_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
   ```

3. **Enable HTTPS**
   - Most platforms handle this automatically
   - Make sure to use HTTPS URLs

4. **Secure Database**
   - For SQLite: Keep backups regularly
   - For production: Consider PostgreSQL
   - Restrict file access

### Frontend

1. **Environment Variables**
   - Never commit .env files
   - Use platform-specific secret management

2. **API Keys**
   - Store sensitive keys in backend only
   - Use NEXT*PUBLIC* only for public values

---

## 🗄️ Database Considerations

### SQLite (Current Setup)

**Pros**:

- ✅ Zero configuration
- ✅ Portable (single file)
- ✅ Fast for small-medium sites
- ✅ Perfect for portfolios

**Cons**:

- ❌ Not ideal for high traffic
- ❌ Single file can be a bottleneck

**Recommendation**: SQLite is perfect for portfolios! Keep regular backups.

### Upgrading to PostgreSQL (Optional)

If you need more scalability:

1. **Create PostgreSQL Database**
   - Railway/Render/DigitalOcean provide managed PostgreSQL

2. **Update Backend**

   ```bash
   pip install psycopg2-binary
   ```

3. **Update database.py**
   - Replace SQLite connection with PostgreSQL
   - Update connection string in .env

---

## 📊 Monitoring & Maintenance

### Backend Monitoring

1. **Check Logs**
   - Most platforms provide log viewing
   - Monitor for errors

2. **Database Backups**
   - Use admin panel to create backups
   - Download and store safely
   - Schedule regular backups

### Frontend Monitoring

1. **Analytics**
   - Add Google Analytics
   - Use Vercel Analytics (if on Vercel)

2. **Performance**
   - Monitor Core Web Vitals
   - Check Lighthouse scores

---

## 🔄 Continuous Deployment

### Automatic Deployments

Most platforms support automatic deployments:

1. **Push to GitHub**

   ```bash
   git add .
   git commit -m "Update content"
   git push origin main
   ```

2. **Auto Deploy**
   - Backend: Railway/Render auto-deploys
   - Frontend: Vercel/Netlify auto-deploys

### Deployment Workflow

```
Local Development → Git Push → Auto Build → Auto Deploy → Live
```

---

## 🌐 Custom Domain

### Frontend Custom Domain

**Vercel**:

1. Go to Project Settings → Domains
2. Add your domain
3. Update DNS records as instructed

**Netlify**:

1. Go to Domain Settings
2. Add custom domain
3. Configure DNS

### Backend Custom Domain

**Railway**:

1. Go to Settings → Domains
2. Add custom domain
3. Update DNS with CNAME

---

## 🎯 Post-Deployment

After successful deployment:

1. ✅ Test all functionality
2. ✅ Verify API connectivity
3. ✅ Check admin panel access
4. ✅ Test contact form
5. ✅ Verify SEO meta tags
6. ✅ Check mobile responsiveness
7. ✅ Test dark/light mode
8. ✅ Create initial backup
9. ✅ Set up monitoring
10. ✅ Share your portfolio! 🎉

---

## 💰 Cost Estimates

### Free Tier (Recommended for Start)

- **Backend**: Railway/Render Free Tier
- **Frontend**: Vercel/Netlify Free Tier
- **Total**: $0/month

### Paid Tier (For Growth)

- **Backend**: Railway Pro ($5-20/month)
- **Frontend**: Vercel Pro ($20/month)
- **Domain**: $10-15/year
- **Total**: ~$30-45/month

---

## 🆘 Troubleshooting

### Build Fails

**Backend**:

```bash
# Check requirements.txt
# Ensure Python version matches
# Check logs for missing dependencies
```

**Frontend**:

```bash
# Verify pnpm-lock.yaml is committed
# Check Node version
# Verify environment variables
```

### API Connection Issues

1. **Check CORS settings**
   - Backend .env has correct CORS_ORIGINS
   - Includes frontend domain

2. **Verify URLs**
   - Frontend .env has correct API URL
   - No trailing slashes

3. **Check HTTPS**
   - Both frontend and backend should use HTTPS
   - Mixed content (HTTP/HTTPS) causes issues

### Database Issues

1. **SQLite locked**
   - Check for multiple backend instances
   - Restart the service

2. **Data not persisting**
   - Check volume persistence settings
   - Verify write permissions

---

## 📚 Additional Resources

- [Railway Docs](https://docs.railway.app)
- [Vercel Docs](https://vercel.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [FastAPI Deployment](https://fastapi.tiangolo.com/deployment/)

---

## ✅ Deployment Checklist

- [ ] Backend deployed and accessible
- [ ] Frontend deployed and accessible
- [ ] Custom domain configured (optional)
- [ ] SSL/HTTPS enabled
- [ ] Environment variables set correctly
- [ ] Admin panel accessible
- [ ] API endpoints working
- [ ] Contact form sending messages
- [ ] SEO meta tags rendering
- [ ] Database backup system working
- [ ] Monitoring enabled
- [ ] Admin password changed

---

**Congratulations on deploying your portfolio! 🎉**

Need help? Check the main README or create an issue on GitHub.
