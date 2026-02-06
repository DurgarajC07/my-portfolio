import sqlite3
from contextlib import contextmanager
from typing import Generator
import os

DATABASE_NAME = "portfolio.db"

@contextmanager
def get_db() -> Generator[sqlite3.Connection, None, None]:
    """Context manager for database connections"""
    conn = sqlite3.connect(DATABASE_NAME, check_same_thread=False)
    conn.row_factory = sqlite3.Row
    try:
        yield conn
        conn.commit()
    except Exception as e:
        conn.rollback()
        raise e
    finally:
        conn.close()

def init_db():
    """Initialize all database tables"""
    with get_db() as conn:
        cursor = conn.cursor()
        
        # Users table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT UNIQUE NOT NULL,
                email TEXT UNIQUE NOT NULL,
                password_hash TEXT NOT NULL,
                role TEXT DEFAULT 'admin',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)
        
        # Hero section
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS hero (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title TEXT NOT NULL,
                subtitle TEXT,
                description TEXT,
                cta_text TEXT,
                cta_link TEXT,
                background_type TEXT DEFAULT 'gradient',
                background_value TEXT,
                social_links TEXT,
                visible INTEGER DEFAULT 1,
                order_index INTEGER DEFAULT 0,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)
        
        # About section
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS about (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title TEXT NOT NULL,
                description TEXT,
                image_url TEXT,
                location TEXT,
                stats TEXT,
                visible INTEGER DEFAULT 1,
                order_index INTEGER DEFAULT 1,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)
        
        # Skills
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS skills (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                category TEXT NOT NULL,
                name TEXT NOT NULL,
                level INTEGER DEFAULT 0,
                icon TEXT,
                order_index INTEGER DEFAULT 0,
                visible INTEGER DEFAULT 1,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)
        
        # Projects
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS projects (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title TEXT NOT NULL,
                description TEXT,
                long_description TEXT,
                image_url TEXT,
                tags TEXT,
                github_url TEXT,
                live_url TEXT,
                featured INTEGER DEFAULT 0,
                visible INTEGER DEFAULT 1,
                order_index INTEGER DEFAULT 0,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)
        
        # Experience
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS experience (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title TEXT NOT NULL,
                company TEXT NOT NULL,
                location TEXT,
                start_date TEXT,
                end_date TEXT,
                current INTEGER DEFAULT 0,
                description TEXT,
                technologies TEXT,
                visible INTEGER DEFAULT 1,
                order_index INTEGER DEFAULT 0,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)
        
        # Education
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS education (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                degree TEXT NOT NULL,
                institution TEXT NOT NULL,
                location TEXT,
                start_date TEXT,
                end_date TEXT,
                description TEXT,
                grade TEXT,
                visible INTEGER DEFAULT 1,
                order_index INTEGER DEFAULT 0,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)
        
        # Certifications
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS certifications (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                issuer TEXT NOT NULL,
                issue_date TEXT,
                expiry_date TEXT,
                credential_id TEXT,
                credential_url TEXT,
                visible INTEGER DEFAULT 1,
                order_index INTEGER DEFAULT 0,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)
        
        # Blogs
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS blogs (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title TEXT NOT NULL,
                slug TEXT UNIQUE NOT NULL,
                content TEXT,
                excerpt TEXT,
                image_url TEXT,
                category TEXT,
                tags TEXT,
                meta_title TEXT,
                meta_description TEXT,
                meta_keywords TEXT,
                status TEXT DEFAULT 'draft',
                featured INTEGER DEFAULT 0,
                views INTEGER DEFAULT 0,
                published_at TIMESTAMP,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)
        
        # Testimonials
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS testimonials (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                role TEXT,
                company TEXT,
                content TEXT NOT NULL,
                image_url TEXT,
                rating INTEGER DEFAULT 5,
                visible INTEGER DEFAULT 1,
                order_index INTEGER DEFAULT 0,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)
        
        # Services
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS services (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title TEXT NOT NULL,
                description TEXT,
                icon TEXT,
                features TEXT,
                visible INTEGER DEFAULT 1,
                order_index INTEGER DEFAULT 0,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)
        
        # Contact messages
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS contact_messages (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                email TEXT NOT NULL,
                subject TEXT,
                message TEXT NOT NULL,
                status TEXT DEFAULT 'unread',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)
        
        # SEO pages
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS seo_pages (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                page_name TEXT UNIQUE NOT NULL,
                meta_title TEXT,
                meta_description TEXT,
                meta_keywords TEXT,
                og_title TEXT,
                og_description TEXT,
                og_image TEXT,
                twitter_card TEXT DEFAULT 'summary_large_image',
                twitter_title TEXT,
                twitter_description TEXT,
                twitter_image TEXT,
                canonical_url TEXT,
                schema_markup TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)
        
        # Theme settings
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS theme_settings (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                primary_color TEXT DEFAULT '#3b82f6',
                secondary_color TEXT DEFAULT '#8b5cf6',
                accent_color TEXT DEFAULT '#10b981',
                font_primary TEXT DEFAULT 'Inter',
                font_secondary TEXT DEFAULT 'Poppins',
                font_code TEXT DEFAULT 'Fira Code',
                dark_mode INTEGER DEFAULT 1,
                custom_css TEXT,
                logo_url TEXT,
                favicon_url TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)
        
        # Resumes
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS resumes (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                file_name TEXT NOT NULL,
                file_path TEXT NOT NULL,
                file_size INTEGER,
                version INTEGER DEFAULT 1,
                is_active INTEGER DEFAULT 0,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)
        
        # Site settings
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS site_settings (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                site_name TEXT DEFAULT 'My Portfolio',
                site_description TEXT,
                site_url TEXT,
                contact_email TEXT,
                smtp_host TEXT,
                smtp_port INTEGER,
                smtp_username TEXT,
                smtp_password TEXT,
                robots_txt TEXT,
                google_analytics TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)
        
        # Activity logs
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS activity_logs (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER,
                action TEXT NOT NULL,
                entity_type TEXT,
                entity_id INTEGER,
                details TEXT,
                ip_address TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id)
            )
        """)
        
        # Create indexes
        cursor.execute("CREATE INDEX IF NOT EXISTS idx_blogs_slug ON blogs(slug)")
        cursor.execute("CREATE INDEX IF NOT EXISTS idx_blogs_status ON blogs(status)")
        cursor.execute("CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)")
        
        conn.commit()
        print("✅ Database initialized successfully!")

def create_default_admin():
    """Create default admin user if not exists"""
    from app.utils.security import hash_password
    
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT id FROM users WHERE username = ?", ("admin",))
        if not cursor.fetchone():
            password_hash = hash_password("admin123")
            cursor.execute("""
                INSERT INTO users (username, email, password_hash, role)
                VALUES (?, ?, ?, ?)
            """, ("admin", "admin@portfolio.com", password_hash, "admin"))
            conn.commit()
            print("✅ Default admin user created (username: admin, password: admin123)")

def create_sample_data():
    """Create sample data for testing"""
    with get_db() as conn:
        cursor = conn.cursor()
        
        # Check if data already exists
        cursor.execute("SELECT COUNT(*) FROM hero")
        if cursor.fetchone()[0] > 0:
            return
        
        # Sample hero
        cursor.execute("""
            INSERT INTO hero (title, subtitle, description, cta_text, cta_link, visible)
            VALUES (?, ?, ?, ?, ?, ?)
        """, (
            "Full Stack Developer",
            "Building beautiful digital experiences",
            "I craft modern web applications with cutting-edge technologies",
            "View My Work",
            "#projects",
            1
        ))
        
        # Sample theme
        cursor.execute("""
            INSERT INTO theme_settings (primary_color, secondary_color, accent_color)
            VALUES (?, ?, ?)
        """, ("#3b82f6", "#8b5cf6", "#10b981"))
        
        # Sample SEO
        cursor.execute("""
            INSERT INTO seo_pages (page_name, meta_title, meta_description)
            VALUES (?, ?, ?)
        """, ("home", "Portfolio - Full Stack Developer", "Welcome to my portfolio showcasing my work and skills"))
        
        # Sample site settings
        cursor.execute("""
            INSERT INTO site_settings (site_name, site_description, contact_email)
            VALUES (?, ?, ?)
        """, ("My Portfolio", "Personal portfolio website", "contact@example.com"))
        
        conn.commit()
        print("✅ Sample data created!")

if __name__ == "__main__":
    init_db()
    create_default_admin()
    create_sample_data()
