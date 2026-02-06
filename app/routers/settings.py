from fastapi import APIRouter, HTTPException, Depends, status, UploadFile, File
from fastapi.responses import FileResponse
from typing import List
from app.schemas import SiteSettings
from app.database import get_db
from app.routers.auth import get_current_user
from app.utils.backup import backup_database, restore_database, list_backups
import os

router = APIRouter(prefix="/api/settings", tags=["Settings"])

@router.get("/", response_model=SiteSettings)
async def get_settings():
    """Get site settings"""
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM site_settings LIMIT 1")
        row = cursor.fetchone()
        
        if not row:
            # Create default settings
            cursor.execute("""
                INSERT INTO site_settings (site_name, site_description, contact_email)
                VALUES (?, ?, ?)
            """, ("My Portfolio", "Personal portfolio website", "contact@example.com"))
            conn.commit()
            
            cursor.execute("SELECT * FROM site_settings LIMIT 1")
            row = cursor.fetchone()
        
        return dict(row)

@router.put("/", response_model=SiteSettings)
async def update_settings(settings: SiteSettings, current_user: dict = Depends(get_current_user)):
    """Update site settings"""
    with get_db() as conn:
        cursor = conn.cursor()
        
        # Check if settings exist
        cursor.execute("SELECT id FROM site_settings LIMIT 1")
        existing = cursor.fetchone()
        
        if existing:
            # Update existing
            cursor.execute("""
                UPDATE site_settings 
                SET site_name = ?, site_description = ?, site_url = ?, contact_email = ?,
                    smtp_host = ?, smtp_port = ?, smtp_username = ?, smtp_password = ?,
                    robots_txt = ?, google_analytics = ?, updated_at = CURRENT_TIMESTAMP
                WHERE id = ?
            """, (settings.site_name, settings.site_description, settings.site_url, settings.contact_email,
                  settings.smtp_host, settings.smtp_port, settings.smtp_username, settings.smtp_password,
                  settings.robots_txt, settings.google_analytics, existing["id"]))
        else:
            # Create new
            cursor.execute("""
                INSERT INTO site_settings 
                (site_name, site_description, site_url, contact_email, smtp_host, smtp_port,
                 smtp_username, smtp_password, robots_txt, google_analytics)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (settings.site_name, settings.site_description, settings.site_url, settings.contact_email,
                  settings.smtp_host, settings.smtp_port, settings.smtp_username, settings.smtp_password,
                  settings.robots_txt, settings.google_analytics))
        
        conn.commit()
        
        cursor.execute("SELECT * FROM site_settings LIMIT 1")
        return dict(cursor.fetchone())

@router.post("/backup")
async def create_backup(current_user: dict = Depends(get_current_user)):
    """Create a database backup"""
    try:
        backup_path = backup_database()
        return {
            "message": "Backup created successfully",
            "backup_path": backup_path,
            "filename": os.path.basename(backup_path)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Backup failed: {str(e)}")

@router.get("/backups")
async def get_backups(current_user: dict = Depends(get_current_user)):
    """List all available backups"""
    backups = list_backups()
    return {"backups": backups}

@router.post("/restore/{backup_filename}")
async def restore_backup(backup_filename: str, current_user: dict = Depends(get_current_user)):
    """Restore database from a backup"""
    backup_path = os.path.join("backups", backup_filename)
    
    if not os.path.exists(backup_path):
        raise HTTPException(status_code=404, detail="Backup file not found")
    
    try:
        success = restore_database(backup_path)
        if success:
            return {"message": "Database restored successfully"}
        else:
            raise HTTPException(status_code=500, detail="Restore failed")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Restore failed: {str(e)}")

@router.get("/backup/{backup_filename}/download")
async def download_backup(backup_filename: str, current_user: dict = Depends(get_current_user)):
    """Download a backup file"""
    backup_path = os.path.join("backups", backup_filename)
    
    if not os.path.exists(backup_path):
        raise HTTPException(status_code=404, detail="Backup file not found")
    
    return FileResponse(
        path=backup_path,
        filename=backup_filename,
        media_type="application/octet-stream"
    )

@router.delete("/backup/{backup_filename}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_backup(backup_filename: str, current_user: dict = Depends(get_current_user)):
    """Delete a backup file"""
    backup_path = os.path.join("backups", backup_filename)
    
    if not os.path.exists(backup_path):
        raise HTTPException(status_code=404, detail="Backup file not found")
    
    os.remove(backup_path)

@router.post("/upload-asset")
async def upload_asset(
    file: UploadFile = File(...),
    current_user: dict = Depends(get_current_user)
):
    """Upload an asset (logo, favicon, images)"""
    # Create uploads directory
    os.makedirs("uploads/assets", exist_ok=True)
    
    # Save file
    filename = file.filename
    filepath = os.path.join("uploads/assets", filename)
    
    with open(filepath, "wb") as buffer:
        import shutil
        shutil.copyfileobj(file.file, buffer)
    
    return {
        "message": "File uploaded successfully",
        "filename": filename,
        "url": f"/uploads/assets/{filename}"
    }

@router.get("/activity-logs")
async def get_activity_logs(
    limit: int = 50,
    current_user: dict = Depends(get_current_user)
):
    """Get activity logs"""
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("""
            SELECT al.*, u.username 
            FROM activity_logs al
            LEFT JOIN users u ON al.user_id = u.id
            ORDER BY al.created_at DESC
            LIMIT ?
        """, (limit,))
        rows = cursor.fetchall()
        return [dict(row) for row in rows]

@router.post("/export-data")
async def export_data(current_user: dict = Depends(get_current_user)):
    """Export all data as JSON"""
    import json
    
    with get_db() as conn:
        cursor = conn.cursor()
        
        data = {}
        
        # Export all tables
        tables = [
            "hero", "about", "skills", "projects", "experience", "education",
            "certifications", "blogs", "testimonials", "services", "seo_pages",
            "theme_settings", "site_settings"
        ]
        
        for table in tables:
            cursor.execute(f"SELECT * FROM {table}")
            rows = cursor.fetchall()
            data[table] = [dict(row) for row in rows]
        
        # Save to file
        export_dir = "exports"
        os.makedirs(export_dir, exist_ok=True)
        
        from datetime import datetime
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        filename = f"data_export_{timestamp}.json"
        filepath = os.path.join(export_dir, filename)
        
        with open(filepath, "w") as f:
            json.dump(data, f, indent=2, default=str)
        
        return {
            "message": "Data exported successfully",
            "filename": filename,
            "filepath": filepath
        }

@router.get("/stats")
async def get_stats(current_user: dict = Depends(get_current_user)):
    """Get dashboard statistics"""
    with get_db() as conn:
        cursor = conn.cursor()
        
        stats = {}
        
        # Count projects
        cursor.execute("SELECT COUNT(*) as count FROM projects WHERE visible = 1")
        stats["projects"] = cursor.fetchone()["count"]
        
        # Count published blogs
        cursor.execute("SELECT COUNT(*) as count FROM blogs WHERE status = 'published'")
        stats["blogs"] = cursor.fetchone()["count"]
        
        # Total blog views
        cursor.execute("SELECT SUM(views) as total FROM blogs")
        stats["blog_views"] = cursor.fetchone()["total"] or 0
        
        # Count skills
        cursor.execute("SELECT COUNT(*) as count FROM skills WHERE visible = 1")
        stats["skills"] = cursor.fetchone()["count"]
        
        # Count experience
        cursor.execute("SELECT COUNT(*) as count FROM experience WHERE visible = 1")
        stats["experience"] = cursor.fetchone()["count"]
        
        # Count education
        cursor.execute("SELECT COUNT(*) as count FROM education WHERE visible = 1")
        stats["education"] = cursor.fetchone()["count"]
        
        # Count testimonials
        cursor.execute("SELECT COUNT(*) as count FROM testimonials WHERE visible = 1")
        stats["testimonials"] = cursor.fetchone()["count"]
        
        # Count unread messages
        cursor.execute("SELECT COUNT(*) as count FROM contact_messages WHERE status = 'unread'")
        stats["unread_messages"] = cursor.fetchone()["count"]
        
        return stats
