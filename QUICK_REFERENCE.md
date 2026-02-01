# 🎯 Quick Reference Guide

## 🚀 Start Servers

### Backend

```powershell
cd backend
.\venv\Scripts\activate
uvicorn app.main:app --reload --port 8000
```

### Frontend

```powershell
cd frontend
pnpm dev
```

---

## 🔗 Important URLs

- **Website**: http://localhost:3000
- **Admin Panel**: http://localhost:3000/admin
- **API**: http://localhost:8000
- **API Docs**: http://localhost:8000/api/docs

---

## 🔐 Default Login

- **Username**: `admin`
- **Password**: `admin123`

⚠️ Change this immediately!

---

## 📁 Quick File Reference

### Backend

- **Main App**: `backend/app/main.py`
- **Database**: `backend/app/database.py`
- **Routes**: `backend/app/routers/`
- **Config**: `backend/.env`

### Frontend

- **Homepage**: `frontend/app/page.tsx`
- **Admin**: `frontend/app/admin/`
- **API Client**: `frontend/lib/api.ts`
- **Config**: `frontend/.env.local`

---

## 🛠️ Common Commands

### Backend

```bash
# Start server
uvicorn app.main:app --reload

# Initialize database
python -m app.database

# Create backup
# Use admin panel or API: POST /api/settings/backup

# Install new package
pip install package-name
pip freeze > requirements.txt
```

### Frontend

```bash
# Start dev server
pnpm dev

# Build for production
pnpm build

# Install new package
pnpm add package-name
```

---

## 🔧 Environment Variables

### Backend (.env)

```env
SECRET_KEY=your-secret-key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
CORS_ORIGINS=http://localhost:3000
```

### Frontend (.env.local)

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

---

## 📊 API Quick Reference

### Authentication

```bash
# Login
POST /api/auth/login
Body: {"username": "admin", "password": "admin123"}

# Get current user
GET /api/auth/me
Headers: Authorization: Bearer <token>
```

### Content

```bash
# Get all projects
GET /api/projects

# Create project
POST /api/projects
Headers: Authorization: Bearer <token>
Body: {...project data...}

# Update project
PUT /api/projects/{id}
Headers: Authorization: Bearer <token>
Body: {...updated data...}
```

### Blog

```bash
# Get published blogs
GET /api/blog/?status=published

# Get blog by slug
GET /api/blog/slug/{slug}

# Create blog post
POST /api/blog/
Headers: Authorization: Bearer <token>
Body: {...blog data...}
```

---

## 🎨 Admin Panel Quick Guide

### Dashboard

- View stats
- Quick actions
- Recent activity

### Content Sections

- Hero, About, Skills, Projects
- Experience, Education
- Blog, Testimonials, Services

### Each Section

- ➕ Add new
- ✏️ Edit existing
- 🗑️ Delete
- 👁️ Toggle visibility
- 🔢 Reorder items

### Blog

- Write posts
- Manage categories/tags
- Draft/Publish
- SEO meta tags

### SEO Manager

- Page meta tags
- OpenGraph settings
- Sitemap generation
- robots.txt

### Theme Manager

- Choose colors
- Select fonts
- Upload logo/favicon
- Custom CSS

### Settings

- Site configuration
- Backup/Restore
- Activity logs
- Export data

---

## 🐛 Quick Troubleshooting

### Backend won't start

```bash
# Activate venv
cd backend
.\venv\Scripts\activate

# Reinstall
pip install -r requirements.txt
```

### Frontend won't start

```bash
# Clear and reinstall
cd frontend
rmdir /s .next node_modules
pnpm install
```

### Can't login

- Check backend is running
- Check CORS settings
- Clear browser cache
- Check .env files

### Database issues

```bash
# Reset database
cd backend
del portfolio.db
python -m app.database
```

---

## 📝 Content Management Workflow

1. **Login** to admin panel
2. **Navigate** to desired section
3. **Add/Edit** content
4. **Toggle visibility** to show/hide
5. **Reorder** if needed
6. **Save changes**
7. **View** on public site

---

## 🚀 Deployment Checklist

- [ ] Change admin password
- [ ] Update SECRET_KEY
- [ ] Add your content
- [ ] Configure SEO
- [ ] Upload resume
- [ ] Test all features
- [ ] Create backup
- [ ] Deploy backend
- [ ] Deploy frontend
- [ ] Configure domain
- [ ] Test production

---

## 📚 More Help

- Full README: `README.md`
- Setup Guide: `GETTING_STARTED.md`
- Deployment: `DEPLOYMENT.md`
- Summary: `PROJECT_SUMMARY.md`
- API Docs: http://localhost:8000/api/docs

---

## 💡 Pro Tips

1. **Backup regularly** using admin panel
2. **Test locally** before deploying
3. **Use strong passwords** in production
4. **Monitor activity logs** for security
5. **Keep dependencies updated**
6. **Use custom domain** for better SEO
7. **Enable HTTPS** in production
8. **Optimize images** before upload
9. **Write good meta descriptions**
10. **Check SEO score regularly**

---

## ⚡ Quick Setup (First Time)

**Windows**:

```powershell
.\setup.bat
```

**Mac/Linux**:

```bash
chmod +x setup.sh
./setup.sh
```

---

## 🎯 Daily Workflow

1. Start backend: `cd backend && .\venv\Scripts\activate && uvicorn app.main:app --reload`
2. Start frontend: `cd frontend && pnpm dev`
3. Make changes in admin panel
4. View changes on website
5. Commit to git
6. Auto-deploy (if configured)

---

**Keep this file handy for quick reference! 📌**
