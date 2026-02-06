# 🐳 Docker Quick Start

## Local Testing (Choose One Method)

### Method 1: Docker Compose (Easiest)
```bash
cd backend
docker-compose up -d
```

### Method 2: Automated Test Script
```powershell
# Windows PowerShell
.\test-docker.ps1
```

```bash
# Linux/Mac
chmod +x test-docker.sh
./test-docker.sh
```

### Method 3: Manual Docker Build
```bash
cd backend
docker build -t portfolio-backend .
docker run -d -p 8000:8000 --name portfolio-backend portfolio-backend
```

## Access Points
- API: http://localhost:8000
- Docs: http://localhost:8000/api/docs
- Health: http://localhost:8000/health
- Sitemap: http://localhost:8000/sitemap.xml

## Environment Variables
Configure in `.env` file:
```env
SECRET_KEY=your-secret-key
CORS_ORIGINS=http://localhost:3000
PORT=8000
HOST=0.0.0.0
WORKERS=1
ENVIRONMENT=production
```

## 🚀 Render Deployment

### Quick Deploy (Blueprint)
1. Push to GitHub
2. Connect to Render
3. Use `render.yaml` (auto-configured)

### Manual Deploy
1. Go to [Render Dashboard](https://dashboard.render.com)
2. New → Web Service
3. Connect repository
4. Select "Docker" environment
5. Set environment variables
6. Deploy!

**Full guide**: See [DOCKER_DEPLOYMENT.md](backend/DOCKER_DEPLOYMENT.md)

## Commands Reference

```bash
# Build
docker build -t portfolio-backend ./backend

# Run
docker run -d -p 8000:8000 --name portfolio-backend portfolio-backend

# Logs
docker logs -f portfolio-backend

# Stop
docker stop portfolio-backend

# Remove
docker rm portfolio-backend

# Docker Compose
docker-compose up -d        # Start
docker-compose down         # Stop
docker-compose logs -f      # Logs
docker-compose restart      # Restart
```

## Troubleshooting

**Container won't start?**
- Check logs: `docker logs portfolio-backend`
- Verify port 8000 is free: `netstat -ano | findstr :8000`

**Can't connect?**
- Wait 30 seconds for startup
- Check health: `curl http://localhost:8000/health`

**CORS errors?**
- Add frontend URL to CORS_ORIGINS in .env

## Production Checklist
- [ ] Change SECRET_KEY (use: `openssl rand -hex 32`)
- [ ] Update CORS_ORIGINS with production URLs
- [ ] Set DEBUG=false
- [ ] Set ENVIRONMENT=production
- [ ] Configure persistent storage (Render Disks)
- [ ] Set up monitoring
- [ ] Enable HTTPS

---

**Need help?** Check [DOCKER_DEPLOYMENT.md](backend/DOCKER_DEPLOYMENT.md) for detailed guide.
