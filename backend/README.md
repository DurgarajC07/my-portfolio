# Portfolio CMS Backend

A complete FastAPI backend for managing a portfolio website.

## Features

- **Authentication**: JWT-based authentication with secure password hashing
- **Content Management**: Full CRUD for all portfolio sections
- **Blog System**: Rich blog management with drafts, publishing, tags, and categories
- **SEO Tools**: Meta tags, sitemap generation, robots.txt, JSON-LD schema
- **Theme Customization**: Colors, fonts, logos, custom CSS
- **Resume Management**: Upload, version, and manage resumes
- **Database Backup**: Automated backup and restore functionality
- **Activity Logging**: Track all admin actions

## Installation

1. Install dependencies:

```bash
pip install -r requirements.txt
```

2. Copy `.env.example` to `.env` and update values:

```bash
cp .env.example .env
```

3. Initialize database:

```bash
python -m app.database
```

## Running the Server

```bash
# Development mode with auto-reload
uvicorn app.main:app --reload --port 8000

# Production mode
uvicorn app.main:app --host 0.0.0.0 --port 8000
```

The API will be available at:

- Main API: http://localhost:8000
- Documentation: http://localhost:8000/api/docs
- ReDoc: http://localhost:8000/api/redoc

## Default Credentials

- **Username**: admin
- **Password**: admin123

⚠️ **Important**: Change these credentials immediately in production!

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login and get token
- `GET /api/auth/me` - Get current user
- `POST /api/auth/change-password` - Change password

### Content

- Hero, About, Skills, Projects, Experience, Education, Testimonials, Services
- Each section has: GET, POST, PUT, DELETE endpoints

### Blog

- `GET /api/blog/` - Get all blogs (with filters)
- `GET /api/blog/{id}` - Get blog by ID
- `GET /api/blog/slug/{slug}` - Get blog by slug
- `POST /api/blog/` - Create blog
- `PUT /api/blog/{id}` - Update blog
- `DELETE /api/blog/{id}` - Delete blog

### SEO

- `GET /api/seo/pages` - Get all SEO pages
- `POST /api/seo/pages` - Create SEO page
- `GET /api/seo/sitemap.xml` - Generate sitemap
- `GET /api/seo/robots.txt` - Get robots.txt
- `GET /api/seo/score` - Calculate SEO score

### Theme

- `GET /api/theme/` - Get theme settings
- `PUT /api/theme/` - Update theme
- `GET /api/theme/fonts/google` - Get Google Fonts list

### Resume

- `GET /api/resume/` - Get all resumes
- `POST /api/resume/upload` - Upload resume
- `GET /api/resume/active` - Get active resume
- `PUT /api/resume/{id}/activate` - Set active resume

### Settings

- `GET /api/settings/` - Get site settings
- `PUT /api/settings/` - Update settings
- `POST /api/settings/backup` - Create backup
- `GET /api/settings/backups` - List backups
- `POST /api/settings/restore/{filename}` - Restore backup
- `GET /api/settings/stats` - Get statistics

## Database Structure

SQLite database with tables:

- users
- hero, about, skills, projects
- experience, education, certifications
- blogs, testimonials, services
- contact_messages
- seo_pages, theme_settings
- resumes, site_settings
- activity_logs

## Security Features

- Password hashing with SHA-256 and salt
- JWT token authentication
- Protected routes
- Activity logging
- CORS configuration

## Backup & Restore

Automatic database backup with versioning:

```bash
# Backups stored in: backups/
# Format: portfolio_backup_YYYYMMDD_HHMMSS.db
```

## Project Structure

```
backend/
├── app/
│   ├── main.py           # FastAPI application
│   ├── database.py       # Database setup
│   ├── schemas.py        # Pydantic models
│   ├── routers/          # API routes
│   │   ├── auth.py
│   │   ├── content.py
│   │   ├── blog.py
│   │   ├── seo.py
│   │   ├── theme.py
│   │   ├── resume.py
│   │   └── settings.py
│   └── utils/            # Utilities
│       ├── security.py
│       └── backup.py
├── uploads/              # Uploaded files
├── backups/              # Database backups
├── requirements.txt      # Dependencies
└── .env                  # Configuration
```

## Development

The API uses:

- **FastAPI**: Modern Python web framework
- **SQLite**: Lightweight database
- **JWT**: Secure authentication
- **Pydantic**: Data validation
- **Uvicorn**: ASGI server

## License

MIT License
