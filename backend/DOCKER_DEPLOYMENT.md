# Docker Deployment Guide

## 🐳 Local Docker Testing

### 1. Build the Docker Image

```bash
cd backend
docker build -t portfolio-backend .
```

### 2. Run with Docker Compose (Recommended)

```bash
# Start the container
docker-compose up -d

# View logs
docker-compose logs -f

# Stop the container
docker-compose down
```

### 3. Run with Docker (Manual)

```bash
# Create network
docker network create portfolio-network

# Run container
docker run -d \
  --name portfolio-backend \
  --network portfolio-network \
  -p 8000:8000 \
  -e SECRET_KEY="your-secret-key" \
  -e CORS_ORIGINS="http://localhost:3000" \
  -e PORT=8000 \
  -e HOST=0.0.0.0 \
  -e WORKERS=1 \
  -e ENVIRONMENT=production \
  -v $(pwd)/uploads:/app/uploads \
  -v $(pwd)/backups:/app/backups \
  -v $(pwd)/portfolio.db:/app/portfolio.db \
  portfolio-backend

# View logs
docker logs -f portfolio-backend

# Stop container
docker stop portfolio-backend
docker rm portfolio-backend
```

### 4. Environment Variables

Create a `.env` file in the backend directory:

```env
SECRET_KEY=super-secret-key-change-in-production-12345678
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
REFRESH_TOKEN_EXPIRE_DAYS=7
DATABASE_URL=sqlite:///./portfolio.db
CORS_ORIGINS=http://localhost:3000,https://yourdomain.com
HOST=0.0.0.0
PORT=8000
WORKERS=1
ENVIRONMENT=production
DEBUG=false
```

### 5. Test the Container

```bash
# Health check
curl http://localhost:8000/health

# API docs
curl http://localhost:8000/api/docs

# Check logs
docker-compose logs -f backend
```

## 🚀 Render Deployment

### Step 1: Prepare Repository

1. Push your code to GitHub/GitLab:

```bash
git add .
git commit -m "Add Docker deployment"
git push origin main
```

### Step 2: Create Render Account

1. Go to [Render.com](https://render.com)
2. Sign up or log in
3. Connect your GitHub/GitLab account

### Step 3: Create Web Service

1. Click "New +" → "Web Service"
2. Connect your repository
3. Configure:
   - **Name**: portfolio-backend
   - **Region**: Choose closest to your users
   - **Branch**: main
   - **Root Directory**: backend (if monorepo)
   - **Environment**: Docker
   - **Instance Type**: Free or Starter ($7/month)

### Step 4: Environment Variables

Add these in Render Dashboard → Environment:

```
SECRET_KEY=your-production-secret-key-minimum-32-characters
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
REFRESH_TOKEN_EXPIRE_DAYS=7
DATABASE_URL=sqlite:///./portfolio.db
CORS_ORIGINS=https://yourfrontend.vercel.app,https://yourdomain.com
HOST=0.0.0.0
PORT=8000
WORKERS=2
ENVIRONMENT=production
DEBUG=false
```

**Important**:

- Generate a strong SECRET_KEY: `openssl rand -hex 32`
- Add ALL your frontend URLs to CORS_ORIGINS
- Set PORT=8000 (Render uses this)

### Step 5: Deploy

1. Click "Create Web Service"
2. Render will automatically:
   - Build Docker image
   - Deploy container
   - Provide a URL: `https://your-app.onrender.com`

### Step 6: Persistent Storage (Optional)

For uploads and database persistence:

1. Go to Render Dashboard
2. Click on your service
3. Go to "Disks" tab
4. Add disk:
   - **Name**: uploads
   - **Mount Path**: /app/uploads
   - **Size**: 1GB (free)

5. Add another disk:
   - **Name**: database
   - **Mount Path**: /app
   - **Size**: 1GB

### Step 7: Custom Domain (Optional)

1. Go to "Settings" → "Custom Domains"
2. Add your domain
3. Update DNS:
   - Add CNAME: `api.yourdomain.com` → `your-app.onrender.com`

### Step 8: Verify Deployment

```bash
# Health check
curl https://your-app.onrender.com/health

# API documentation
https://your-app.onrender.com/api/docs

# Sitemap
https://your-app.onrender.com/sitemap.xml

# Robots
https://your-app.onrender.com/robots.txt
```

## 🔒 Production Checklist

### Security

- [ ] Change SECRET_KEY to strong random value
- [ ] Update CORS_ORIGINS with production URLs only
- [ ] Set DEBUG=false
- [ ] Set ENVIRONMENT=production
- [ ] Use HTTPS for all URLs
- [ ] Review and limit file upload sizes

### Performance

- [ ] Set WORKERS=2 or more (based on instance)
- [ ] Enable gzip compression
- [ ] Configure caching headers
- [ ] Optimize database queries
- [ ] Monitor memory usage

### Monitoring

- [ ] Set up health check monitoring
- [ ] Configure log aggregation
- [ ] Set up error tracking (Sentry)
- [ ] Monitor API response times
- [ ] Set up uptime monitoring (UptimeRobot)

### Backup

- [ ] Set up automated database backups
- [ ] Configure upload folder backups
- [ ] Test restore procedures
- [ ] Document backup schedule

### Database

- [ ] Consider PostgreSQL for production (better than SQLite)
- [ ] Set up migrations system
- [ ] Configure database backups
- [ ] Monitor database size

## 📊 Monitoring & Logs

### View Logs in Render

1. Go to your service dashboard
2. Click "Logs" tab
3. Real-time logs appear here

### Health Check Endpoint

```bash
curl https://your-app.onrender.com/health
# Response: {"status":"healthy"}
```

### Common Issues

#### Container not starting

- Check environment variables
- Review logs for errors
- Verify Dockerfile builds locally

#### 502 Bad Gateway

- Container may be starting (wait 30s)
- Check PORT environment variable
- Verify health check endpoint

#### CORS Errors

- Add frontend URL to CORS_ORIGINS
- Check for trailing slashes
- Verify HTTPS vs HTTP

#### Database not persisting

- Add persistent disk in Render
- Mount to /app directory
- Verify write permissions

## 🔄 Updates & Redeployment

### Automatic Deployment

Render auto-deploys on git push:

```bash
git add .
git commit -m "Update feature"
git push origin main
# Render automatically rebuilds and deploys
```

### Manual Deployment

1. Go to Render Dashboard
2. Click "Manual Deploy"
3. Select branch
4. Click "Deploy"

### Rollback

1. Go to "Events" tab
2. Find previous successful deploy
3. Click "Rollback to this version"

## 🐛 Debugging

### Local Docker Debugging

```bash
# Shell into container
docker exec -it portfolio-backend bash

# Check Python environment
docker exec portfolio-backend python --version

# Check running processes
docker exec portfolio-backend ps aux

# View environment variables
docker exec portfolio-backend env

# Test health endpoint
docker exec portfolio-backend curl http://localhost:8000/health
```

### Render Debugging

1. Check build logs for errors
2. Check deploy logs
3. Use Render Shell (paid plans):
   - Click "Shell" tab
   - Run commands directly

## 💰 Costs

### Render Pricing

- **Free Tier**:
  - 750 hours/month
  - Spins down after 15 min inactivity
  - 512MB RAM
  - Shared CPU

- **Starter ($7/month)**:
  - Always on
  - 512MB RAM
  - Shared CPU

- **Standard ($25/month)**:
  - 2GB RAM
  - Dedicated CPU

### Optimization Tips

- Use Free tier for testing
- Upgrade to Starter for production
- Consider PostgreSQL add-on ($7/month)
- Use CDN for static files

## 🎯 Performance Tips

1. **Use PostgreSQL**: Better than SQLite for production
2. **Enable Workers**: Set WORKERS=2 or more
3. **Add Redis**: For caching (optional)
4. **Use CDN**: For uploads and static files
5. **Optimize Images**: Compress before upload
6. **Database Indexing**: Add indexes to frequently queried fields
7. **Connection Pooling**: Configure if using PostgreSQL

## 📚 Additional Resources

- [Render Documentation](https://render.com/docs)
- [Docker Documentation](https://docs.docker.com)
- [FastAPI Deployment](https://fastapi.tiangolo.com/deployment/)
- [Uvicorn Configuration](https://www.uvicorn.org/settings/)

---

**Need Help?** Check Render's support docs or the FastAPI community forums!
