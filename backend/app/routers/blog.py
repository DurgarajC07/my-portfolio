from fastapi import APIRouter, HTTPException, Depends, status, Query
from typing import List, Optional
from app.schemas import BlogCreate, BlogUpdate, Blog
from app.database import get_db
from app.routers.auth import get_current_user
from datetime import datetime

router = APIRouter(prefix="/api/blog", tags=["Blog"])

@router.get("/", response_model=List[Blog])
async def get_blogs(
    status: Optional[str] = Query(None, description="Filter by status: draft, published"),
    category: Optional[str] = Query(None, description="Filter by category"),
    featured: Optional[bool] = Query(None, description="Filter featured blogs"),
    limit: Optional[int] = Query(None, description="Limit number of results")
):
    """Get all blogs with optional filters"""
    with get_db() as conn:
        cursor = conn.cursor()
        
        query = "SELECT * FROM blogs WHERE 1=1"
        params = []
        
        if status:
            query += " AND status = ?"
            params.append(status)
        
        if category:
            query += " AND category = ?"
            params.append(category)
        
        if featured is not None:
            query += " AND featured = ?"
            params.append(1 if featured else 0)
        
        query += " ORDER BY created_at DESC"
        
        if limit:
            query += " LIMIT ?"
            params.append(limit)
        
        cursor.execute(query, params)
        rows = cursor.fetchall()
        return [dict(row) for row in rows]

@router.get("/{blog_id}", response_model=Blog)
async def get_blog(blog_id: int):
    """Get blog by ID"""
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM blogs WHERE id = ?", (blog_id,))
        row = cursor.fetchone()
        
        if not row:
            raise HTTPException(status_code=404, detail="Blog not found")
        
        # Increment views
        cursor.execute("UPDATE blogs SET views = views + 1 WHERE id = ?", (blog_id,))
        conn.commit()
        
        return dict(row)

@router.get("/slug/{slug}", response_model=Blog)
async def get_blog_by_slug(slug: str):
    """Get blog by slug"""
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM blogs WHERE slug = ?", (slug,))
        row = cursor.fetchone()
        
        if not row:
            raise HTTPException(status_code=404, detail="Blog not found")
        
        # Increment views
        cursor.execute("UPDATE blogs SET views = views + 1 WHERE slug = ?", (slug,))
        conn.commit()
        
        return dict(row)

@router.post("/", response_model=Blog, status_code=status.HTTP_201_CREATED)
async def create_blog(blog: BlogCreate, current_user: dict = Depends(get_current_user)):
    """Create new blog post"""
    with get_db() as conn:
        cursor = conn.cursor()
        
        # Check if slug exists
        cursor.execute("SELECT id FROM blogs WHERE slug = ?", (blog.slug,))
        if cursor.fetchone():
            raise HTTPException(status_code=400, detail="Slug already exists")
        
        # Set published_at if status is published
        published_at = datetime.utcnow().isoformat() if blog.status == "published" else None
        
        cursor.execute("""
            INSERT INTO blogs (title, slug, content, excerpt, image_url, category, tags,
                             meta_title, meta_description, meta_keywords, status, featured, published_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (blog.title, blog.slug, blog.content, blog.excerpt, blog.image_url, blog.category,
              blog.tags, blog.meta_title, blog.meta_description, blog.meta_keywords, blog.status,
              blog.featured, published_at))
        
        blog_id = cursor.lastrowid
        conn.commit()
        
        cursor.execute("SELECT * FROM blogs WHERE id = ?", (blog_id,))
        return dict(cursor.fetchone())

@router.put("/{blog_id}", response_model=Blog)
async def update_blog(blog_id: int, blog: BlogUpdate, current_user: dict = Depends(get_current_user)):
    """Update blog post"""
    with get_db() as conn:
        cursor = conn.cursor()
        
        # Get existing blog
        cursor.execute("SELECT * FROM blogs WHERE id = ?", (blog_id,))
        existing = cursor.fetchone()
        if not existing:
            raise HTTPException(status_code=404, detail="Blog not found")
        
        # Check if slug is being changed and if it already exists
        update_data = blog.dict(exclude_unset=True)
        if "slug" in update_data and update_data["slug"] != existing["slug"]:
            cursor.execute("SELECT id FROM blogs WHERE slug = ? AND id != ?", 
                         (update_data["slug"], blog_id))
            if cursor.fetchone():
                raise HTTPException(status_code=400, detail="Slug already exists")
        
        # Update published_at if status changes to published
        if "status" in update_data and update_data["status"] == "published" and existing["status"] != "published":
            update_data["published_at"] = datetime.utcnow().isoformat()
        
        # Build update query
        updates = []
        values = []
        for field, value in update_data.items():
            updates.append(f"{field} = ?")
            values.append(value)
        
        if updates:
            values.append(blog_id)
            query = f"UPDATE blogs SET {', '.join(updates)}, updated_at = CURRENT_TIMESTAMP WHERE id = ?"
            cursor.execute(query, values)
            conn.commit()
        
        cursor.execute("SELECT * FROM blogs WHERE id = ?", (blog_id,))
        return dict(cursor.fetchone())

@router.delete("/{blog_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_blog(blog_id: int, current_user: dict = Depends(get_current_user)):
    """Delete blog post"""
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("DELETE FROM blogs WHERE id = ?", (blog_id,))
        if cursor.rowcount == 0:
            raise HTTPException(status_code=404, detail="Blog not found")
        conn.commit()

@router.get("/categories/list")
async def get_categories():
    """Get all blog categories"""
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT DISTINCT category FROM blogs WHERE category IS NOT NULL AND category != ''")
        rows = cursor.fetchall()
        return [row["category"] for row in rows]

@router.get("/tags/list")
async def get_tags():
    """Get all blog tags"""
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT tags FROM blogs WHERE tags IS NOT NULL AND tags != ''")
        rows = cursor.fetchall()
        
        # Extract unique tags
        all_tags = set()
        for row in rows:
            if row["tags"]:
                tags = [tag.strip() for tag in row["tags"].split(",")]
                all_tags.update(tags)
        
        return sorted(list(all_tags))
