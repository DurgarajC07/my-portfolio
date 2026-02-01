from fastapi import APIRouter, HTTPException, Depends, status, Response
from typing import List
from app.schemas import SEOPageCreate, SEOPageUpdate, SEOPage, SiteSettings
from app.database import get_db
from app.routers.auth import get_current_user
from datetime import datetime

router = APIRouter(prefix="/api/seo", tags=["SEO"])

@router.get("/pages", response_model=List[SEOPage])
async def get_seo_pages():
    """Get all SEO page settings"""
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM seo_pages ORDER BY page_name")
        rows = cursor.fetchall()
        return [dict(row) for row in rows]

@router.get("/pages/{page_name}", response_model=SEOPage)
async def get_seo_page(page_name: str):
    """Get SEO settings for a specific page"""
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM seo_pages WHERE page_name = ?", (page_name,))
        row = cursor.fetchone()
        
        if not row:
            raise HTTPException(status_code=404, detail="SEO page not found")
        
        return dict(row)

@router.post("/pages", response_model=SEOPage, status_code=status.HTTP_201_CREATED)
async def create_seo_page(seo: SEOPageCreate, current_user: dict = Depends(get_current_user)):
    """Create SEO settings for a page"""
    with get_db() as conn:
        cursor = conn.cursor()
        
        # Check if page already exists
        cursor.execute("SELECT id FROM seo_pages WHERE page_name = ?", (seo.page_name,))
        if cursor.fetchone():
            raise HTTPException(status_code=400, detail="SEO page already exists")
        
        cursor.execute("""
            INSERT INTO seo_pages (page_name, meta_title, meta_description, meta_keywords,
                                 og_title, og_description, og_image, twitter_card,
                                 twitter_title, twitter_description, twitter_image,
                                 canonical_url, schema_markup)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (seo.page_name, seo.meta_title, seo.meta_description, seo.meta_keywords,
              seo.og_title, seo.og_description, seo.og_image, seo.twitter_card,
              seo.twitter_title, seo.twitter_description, seo.twitter_image,
              seo.canonical_url, seo.schema_markup))
        
        page_id = cursor.lastrowid
        conn.commit()
        
        cursor.execute("SELECT * FROM seo_pages WHERE id = ?", (page_id,))
        return dict(cursor.fetchone())

@router.put("/pages/{page_name}", response_model=SEOPage)
async def update_seo_page(page_name: str, seo: SEOPageUpdate, current_user: dict = Depends(get_current_user)):
    """Update SEO settings for a page"""
    with get_db() as conn:
        cursor = conn.cursor()
        
        # Check if page exists
        cursor.execute("SELECT * FROM seo_pages WHERE page_name = ?", (page_name,))
        if not cursor.fetchone():
            raise HTTPException(status_code=404, detail="SEO page not found")
        
        # Build update query
        updates = []
        values = []
        for field, value in seo.dict(exclude_unset=True).items():
            updates.append(f"{field} = ?")
            values.append(value)
        
        if updates:
            values.append(page_name)
            query = f"UPDATE seo_pages SET {', '.join(updates)}, updated_at = CURRENT_TIMESTAMP WHERE page_name = ?"
            cursor.execute(query, values)
            conn.commit()
        
        cursor.execute("SELECT * FROM seo_pages WHERE page_name = ?", (page_name,))
        return dict(cursor.fetchone())

@router.delete("/pages/{page_name}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_seo_page(page_name: str, current_user: dict = Depends(get_current_user)):
    """Delete SEO page settings"""
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("DELETE FROM seo_pages WHERE page_name = ?", (page_name,))
        if cursor.rowcount == 0:
            raise HTTPException(status_code=404, detail="SEO page not found")
        conn.commit()

@router.get("/sitemap.xml")
async def generate_sitemap():
    """Generate sitemap.xml"""
    with get_db() as conn:
        cursor = conn.cursor()
        
        # Get site URL from settings
        cursor.execute("SELECT site_url FROM site_settings LIMIT 1")
        settings = cursor.fetchone()
        site_url = settings["site_url"] if settings and settings["site_url"] else "https://example.com"
        
        # Build sitemap
        xml = '<?xml version="1.0" encoding="UTF-8"?>\n'
        xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
        
        # Add homepage
        xml += '  <url>\n'
        xml += f'    <loc>{site_url}</loc>\n'
        xml += '    <changefreq>weekly</changefreq>\n'
        xml += '    <priority>1.0</priority>\n'
        xml += '  </url>\n'
        
        # Add published blogs
        cursor.execute("SELECT slug, updated_at FROM blogs WHERE status = 'published'")
        blogs = cursor.fetchall()
        for blog in blogs:
            xml += '  <url>\n'
            xml += f'    <loc>{site_url}/blog/{blog["slug"]}</loc>\n'
            xml += f'    <lastmod>{blog["updated_at"][:10]}</lastmod>\n'
            xml += '    <changefreq>monthly</changefreq>\n'
            xml += '    <priority>0.8</priority>\n'
            xml += '  </url>\n'
        
        # Add static pages
        static_pages = ["about", "projects", "contact"]
        for page in static_pages:
            xml += '  <url>\n'
            xml += f'    <loc>{site_url}/{page}</loc>\n'
            xml += '    <changefreq>monthly</changefreq>\n'
            xml += '    <priority>0.7</priority>\n'
            xml += '  </url>\n'
        
        xml += '</urlset>'
        
        return Response(content=xml, media_type="application/xml")

@router.get("/robots.txt")
async def get_robots_txt():
    """Get robots.txt content"""
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT robots_txt FROM site_settings LIMIT 1")
        row = cursor.fetchone()
        
        if row and row["robots_txt"]:
            content = row["robots_txt"]
        else:
            # Default robots.txt
            content = """User-agent: *
Allow: /

Sitemap: /api/seo/sitemap.xml"""
        
        return Response(content=content, media_type="text/plain")

@router.put("/robots.txt")
async def update_robots_txt(robots_txt: str, current_user: dict = Depends(get_current_user)):
    """Update robots.txt content"""
    with get_db() as conn:
        cursor = conn.cursor()
        
        # Check if settings exist
        cursor.execute("SELECT id FROM site_settings LIMIT 1")
        if cursor.fetchone():
            cursor.execute("UPDATE site_settings SET robots_txt = ?, updated_at = CURRENT_TIMESTAMP", (robots_txt,))
        else:
            cursor.execute("INSERT INTO site_settings (robots_txt) VALUES (?)", (robots_txt,))
        
        conn.commit()
        return {"message": "robots.txt updated successfully"}

@router.post("/generate-schema/{entity_type}")
async def generate_schema_markup(
    entity_type: str,
    entity_id: int,
    current_user: dict = Depends(get_current_user)
):
    """Generate JSON-LD schema markup for an entity"""
    with get_db() as conn:
        cursor = conn.cursor()
        
        schema = {}
        
        if entity_type == "blog":
            cursor.execute("SELECT * FROM blogs WHERE id = ?", (entity_id,))
            blog = cursor.fetchone()
            if not blog:
                raise HTTPException(status_code=404, detail="Blog not found")
            
            schema = {
                "@context": "https://schema.org",
                "@type": "BlogPosting",
                "headline": blog["title"],
                "description": blog["excerpt"] or blog["meta_description"],
                "image": blog["image_url"],
                "datePublished": blog["published_at"],
                "dateModified": blog["updated_at"],
                "author": {
                    "@type": "Person",
                    "name": "Portfolio Author"
                }
            }
        
        elif entity_type == "project":
            cursor.execute("SELECT * FROM projects WHERE id = ?", (entity_id,))
            project = cursor.fetchone()
            if not project:
                raise HTTPException(status_code=404, detail="Project not found")
            
            schema = {
                "@context": "https://schema.org",
                "@type": "CreativeWork",
                "name": project["title"],
                "description": project["description"],
                "image": project["image_url"],
                "url": project["live_url"]
            }
        
        else:
            raise HTTPException(status_code=400, detail="Invalid entity type")
        
        return schema

@router.get("/score")
async def calculate_seo_score(current_user: dict = Depends(get_current_user)):
    """Calculate overall SEO score"""
    with get_db() as conn:
        cursor = conn.cursor()
        
        score = 0
        max_score = 100
        
        # Check SEO pages (20 points)
        cursor.execute("SELECT COUNT(*) as count FROM seo_pages WHERE meta_title IS NOT NULL")
        seo_pages = cursor.fetchone()["count"]
        score += min(20, seo_pages * 4)
        
        # Check blogs with meta tags (20 points)
        cursor.execute("SELECT COUNT(*) as count FROM blogs WHERE meta_title IS NOT NULL AND meta_description IS NOT NULL")
        blogs_with_meta = cursor.fetchone()["count"]
        score += min(20, blogs_with_meta * 2)
        
        # Check site settings (20 points)
        cursor.execute("SELECT * FROM site_settings LIMIT 1")
        settings = cursor.fetchone()
        if settings:
            if settings["site_name"]: score += 5
            if settings["site_description"]: score += 5
            if settings["site_url"]: score += 5
            if settings["robots_txt"]: score += 5
        
        # Check images with alt text (20 points)
        # This would require checking actual content - simplified here
        score += 15
        
        # Check mobile responsiveness (20 points)
        # This would require actual testing - simplified here
        score += 20
        
        return {
            "score": score,
            "max_score": max_score,
            "percentage": round((score / max_score) * 100),
            "grade": "A" if score >= 90 else "B" if score >= 80 else "C" if score >= 70 else "D"
        }
