# Deployment Guide - AI OS Portfolio

## Quick Deploy to Vercel (Recommended)

### Prerequisites

- GitHub account
- Vercel account (free tier available)

### Steps

1. **Push to GitHub**

```bash
git init
git add .
git commit -m "Initial commit: AI OS Portfolio"
git branch -M main
git remote add origin <your-github-repo-url>
git push -u origin main
```

2. **Deploy on Vercel**

- Visit [vercel.com](https://vercel.com)
- Click "New Project"
- Import your GitHub repository
- Vercel auto-detects Next.js settings
- Click "Deploy"

3. **Configure Domain (Optional)**

- Go to Project Settings > Domains
- Add your custom domain
- Update DNS records as instructed

4. **Update URLs**

- Edit `app/page.tsx` - Update `openGraph.url`
- Edit `app/sitemap.ts` - Update `baseUrl`
- Edit `app/robots.ts` - Update sitemap URL
- Commit and push changes

### Automatic Deployments

- Every push to `main` triggers automatic deployment
- Preview deployments for pull requests
- Instant rollback to previous deployments

---

## Deploy to Netlify

### Steps

1. **Build Settings**

```
Build command: npm run build
Publish directory: .next
```

2. **Environment Variables** (if needed)

```
NEXT_PUBLIC_SITE_URL=https://yoursite.netlify.app
```

3. **Netlify.toml Configuration**

```toml
[build]
  command = "npm run build"
  publish = ".next"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

---

## Deploy to AWS (EC2 + PM2)

### Prerequisites

- AWS account
- EC2 instance (Ubuntu 22.04 recommended)
- Domain name (optional)

### Steps

1. **SSH into EC2**

```bash
ssh -i your-key.pem ubuntu@your-ec2-ip
```

2. **Install Node.js**

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
```

3. **Install PM2**

```bash
sudo npm install -g pm2
```

4. **Clone Repository**

```bash
git clone <your-repo-url>
cd my-portfolio
npm install
```

5. **Build Application**

```bash
npm run build
```

6. **Start with PM2**

```bash
pm2 start npm --name "portfolio" -- start
pm2 save
pm2 startup
```

7. **Configure Nginx**

```bash
sudo apt install nginx
sudo nano /etc/nginx/sites-available/portfolio
```

Nginx configuration:

```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable site:

```bash
sudo ln -s /etc/nginx/sites-available/portfolio /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

8. **SSL Certificate (Let's Encrypt)**

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com
```

---

## Deploy with Docker

### Dockerfile

Create `Dockerfile`:

```dockerfile
FROM node:20-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine AS runner

WORKDIR /app
ENV NODE_ENV production

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000
CMD ["node", "server.js"]
```

### Docker Compose

Create `docker-compose.yml`:

```yaml
version: "3.8"

services:
  portfolio:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
    restart: unless-stopped
```

### Build and Run

```bash
docker-compose up -d
```

---

## Deploy to Cloudflare Pages

### Steps

1. **Install Wrangler**

```bash
npm install -g wrangler
```

2. **Login to Cloudflare**

```bash
wrangler login
```

3. **Configure Build**

```bash
wrangler pages project create my-portfolio
```

4. **Deploy**

```bash
npm run build
wrangler pages publish .next
```

---

## Environment Variables

### Production Variables

Create `.env.production`:

```env
NEXT_PUBLIC_SITE_URL=https://yoursite.com
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX  # Optional: Google Analytics
```

### Local Development

Create `.env.local`:

```env
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

---

## Post-Deployment Checklist

### SEO Verification

- [ ] Verify sitemap at `/sitemap.xml`
- [ ] Check robots.txt at `/robots.txt`
- [ ] Test Open Graph tags (use [OpenGraph.xyz](https://www.opengraph.xyz/))
- [ ] Verify Twitter Card preview
- [ ] Submit sitemap to Google Search Console
- [ ] Submit sitemap to Bing Webmaster Tools

### Performance Check

- [ ] Run Lighthouse audit
- [ ] Check Core Web Vitals
- [ ] Test mobile responsiveness
- [ ] Verify load times (<3s)
- [ ] Test on different browsers

### Functionality Test

- [ ] Test all terminal commands
- [ ] Verify command history works
- [ ] Test autocomplete
- [ ] Check responsive design
- [ ] Test on mobile devices

### Monitoring Setup

- [ ] Set up error tracking (Sentry)
- [ ] Enable analytics (Google Analytics, Plausible)
- [ ] Configure uptime monitoring
- [ ] Set up performance monitoring

---

## Continuous Deployment

### GitHub Actions

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Vercel

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: "20"

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build

      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
```

---

## Troubleshooting

### Build Fails

```bash
# Clear cache
rm -rf .next node_modules
npm install
npm run build
```

### Port Already in Use

```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9
```

### PM2 Not Restarting

```bash
pm2 delete portfolio
pm2 start npm --name "portfolio" -- start
```

### SSL Certificate Issues

```bash
sudo certbot renew --dry-run
sudo certbot renew
```

---

## Rollback Strategy

### Vercel

1. Go to project dashboard
2. Click "Deployments"
3. Find previous working deployment
4. Click "..." > "Promote to Production"

### PM2

```bash
git checkout <previous-commit>
npm run build
pm2 restart portfolio
```

### Docker

```bash
docker-compose down
git checkout <previous-commit>
docker-compose up -d --build
```

---

## Scaling Considerations

### CDN Configuration

- Enable CDN for static assets
- Cache `.next/static` files
- Set appropriate cache headers

### Database (Future)

- Move from JSON to database
- Use Prisma or similar ORM
- Consider Supabase or PlanetScale

### API Routes (Future)

- Add API routes for dynamic features
- Rate limiting
- Authentication if needed

---

## Maintenance

### Regular Updates

```bash
# Update dependencies
npm update
npm audit fix

# Test
npm run build
npm run dev

# Deploy
git add .
git commit -m "Update dependencies"
git push
```

### Monitoring

- Check Vercel analytics
- Monitor error rates
- Review performance metrics
- Update content regularly

---

## Support & Resources

- [Next.js Deployment Docs](https://nextjs.org/docs/deployment)
- [Vercel Documentation](https://vercel.com/docs)
- [PM2 Documentation](https://pm2.keymetrics.io/docs/)
- [Docker Documentation](https://docs.docker.com/)

---

**Need Help?** Open an issue on GitHub or contact the maintainer.
