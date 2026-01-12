# 🚀 Quick Start Guide

## Get Started in 3 Minutes

### 1. Start Development Server

The server is already running! Open your browser:

👉 **http://localhost:3000**

### 2. Try These Commands

Type in the terminal:

```bash
help              # See all commands
whoami            # About Durgaraj Chauhan
skills            # View technical skills
projects          # See portfolio projects
experience        # Work history
contact           # Get contact info
```

### 3. Explore Features

- **Command History:** Press ↑ or ↓ arrow keys
- **Auto-complete:** Start typing and press Tab
- **Clear Screen:** Type `clear` or `cls`
- **Detailed View:** Type `projects ai-callbot` to see a specific project

---

## Customize Your Portfolio

### Edit Your Information

Open `data/profile.json` and update:

```json
{
  "personal": {
    "name": "Your Name",
    "title": "Your Title",
    "email": "your@email.com",
    ...
  }
}
```

### Add Your Projects

```json
{
  "projects": [
    {
      "name": "Your Project",
      "technologies": ["React", "Node.js"],
      "description": "What you built"
    }
  ]
}
```

### Update Skills

```json
{
  "skills": {
    "backend": ["Python", "FastAPI", "Your Skills Here"]
  }
}
```

---

## Deploy to Production

### Option 1: Vercel (Easiest - 2 minutes)

1. Push to GitHub:

```bash
git init
git add .
git commit -m "Initial commit"
git push
```

2. Go to [vercel.com](https://vercel.com)
3. Click "New Project"
4. Import your repository
5. Click "Deploy" ✨

Done! Your portfolio is live.

### Option 2: Build Locally

```bash
npm run build
npm start
```

View at http://localhost:3000

---

## Key Files

| File                      | Purpose                 |
| ------------------------- | ----------------------- |
| `data/profile.json`       | Your portfolio data     |
| `app/page.tsx`            | Home page with metadata |
| `components/Terminal.tsx` | Terminal UI             |
| `lib/commands.tsx`        | All commands            |
| `lib/types.ts`            | Type definitions        |

---

## Available Commands

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm start        # Start production server
npm run lint     # Check code quality
```

---

## Need Help?

📖 Read the full documentation:

- `README.md` - Complete user guide
- `TECHNICAL_DOCS.md` - Architecture details
- `DEPLOYMENT.md` - Deployment guides
- `PROJECT_SUMMARY.md` - Project overview

---

## What Makes This Special?

✨ **Terminal Interface** - Interactive, not scrolling
🎯 **SEO Optimized** - Google-ready out of the box
🏗️ **Clean Architecture** - Command Pattern, SOLID principles
⚡ **Fast** - Next.js 14 with App Router
📱 **Responsive** - Works on all devices
🔧 **Extensible** - Easy to add features

---

## Next Steps

1. ✅ Try all commands in the terminal
2. ✅ Customize `data/profile.json` with your info
3. ✅ Test your changes: `npm run build`
4. ✅ Deploy to Vercel
5. ✅ Share your unique portfolio!

---

**Ready to impress recruiters? Your AI OS Portfolio is live! 🎉**

Questions? Check the documentation or open an issue on GitHub.
