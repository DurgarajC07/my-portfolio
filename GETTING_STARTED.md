# 🚀 Quick Start Guide

Follow these steps to get your portfolio website up and running in minutes!

---

## Prerequisites

Before you begin, make sure you have:

- ✅ **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- ✅ **pnpm** - Run: `npm install -g pnpm`
- ✅ **Python** (v3.8 or higher) - [Download](https://python.org/)
- ✅ **Git** - [Download](https://git-scm.com/)

---

## Step 1: Clone the Repository

```bash
git clone <your-repository-url>
cd my-portfolio
```

---

## Step 2: Setup Backend (5 minutes)

### 1. Navigate to backend folder

```bash
cd backend
```

### 2. Create and activate virtual environment

**Windows (PowerShell)**:

```powershell
python -m venv venv
.\venv\Scripts\activate
```

**Mac/Linux**:

```bash
python3 -m venv venv
source venv/bin/activate
```

### 3. Install Python dependencies

```bash
pip install -r requirements.txt
```

### 4. Setup environment variables

```bash
# Copy the example file
cp .env.example .env

# Edit .env and change SECRET_KEY (important for production!)
```

### 5. Initialize database

```bash
python -m app.database
```

You should see:

```
✅ Database initialized successfully!
✅ Default admin user created (username: admin, password: admin123)
✅ Sample data created!
```

### 6. Start the backend server

```bash
uvicorn app.main:app --reload --port 8000
```

✅ **Backend is now running!**

- API: http://localhost:8000
- Documentation: http://localhost:8000/api/docs

Keep this terminal open and running.

---

## Step 3: Setup Frontend (3 minutes)

### 1. Open a NEW terminal and navigate to frontend

```bash
cd frontend
```

### 2. Install dependencies

```bash
pnpm install
```

If you don't have pnpm:

```bash
npm install -g pnpm
pnpm install
```

### 3. Setup environment variables

```bash
# Copy the example file
cp .env.example .env.local

# The default values should work for local development
```

### 4. Start the development server

```bash
pnpm dev
```

✅ **Frontend is now running!**

- Website: http://localhost:3000
- Admin Panel: http://localhost:3000/admin

---

## Step 4: Login to Admin Panel

1. Open http://localhost:3000/admin in your browser
2. Login with default credentials:
   - **Username**: `admin`
   - **Password**: `admin123`

⚠️ **IMPORTANT**: Change these credentials immediately!

---

## Step 5: Customize Your Portfolio

Now you're ready to:

1. ✏️ Edit content sections
2. 🎨 Customize theme and colors
3. 📝 Write blog posts
4. 🖼️ Upload images
5. 📄 Upload your resume
6. ⚙️ Configure SEO settings

---

## 🎉 You're All Set!

Your portfolio is now running with:

- ✅ Backend API at port 8000
- ✅ Frontend at port 3000
- ✅ Admin panel ready to use
- ✅ Database initialized with sample data

---

## 🔧 Common Issues

### Backend won't start

```bash
# Make sure virtual environment is activated
# Windows:
.\venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate

# Reinstall dependencies
pip install -r requirements.txt
```

### Frontend won't start

```bash
# Clear cache and reinstall
rm -rf .next node_modules
pnpm install
pnpm dev
```

### Can't connect to API

- Make sure backend is running on port 8000
- Check `NEXT_PUBLIC_API_URL` in `frontend/.env.local`
- Verify no firewall blocking

### Database errors

```bash
# Delete and recreate database
cd backend
rm portfolio.db
python -m app.database
```

---

## 📚 Next Steps

1. **Change Admin Password**
   - Login → Settings → Change Password

2. **Add Your Content**
   - Navigate through admin sections
   - Update Hero, About, Projects, etc.

3. **Customize Theme**
   - Admin → Theme Manager
   - Choose colors and fonts

4. **Configure SEO**
   - Admin → SEO Manager
   - Set meta tags for all pages

5. **Create Backup**
   - Admin → Settings → Create Backup

6. **Deploy to Production**
   - See deployment guides in main README

---

## 🆘 Need Help?

- Check the main [README.md](README.md) for detailed documentation
- View API docs at http://localhost:8000/api/docs
- Review backend [README](backend/README.md) for API details

---

**Happy building! 🚀**
