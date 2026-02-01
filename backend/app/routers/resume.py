from fastapi import APIRouter, HTTPException, Depends, UploadFile, File, status
from fastapi.responses import FileResponse
from typing import List
import os
import shutil
from datetime import datetime
from app.database import get_db
from app.routers.auth import get_current_user

router = APIRouter(prefix="/api/resume", tags=["Resume"])

UPLOAD_DIR = "uploads/resumes"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@router.get("/")
async def get_resumes():
    """Get all resumes"""
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM resumes ORDER BY created_at DESC")
        rows = cursor.fetchall()
        return [dict(row) for row in rows]

@router.get("/active")
async def get_active_resume():
    """Get currently active resume"""
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM resumes WHERE is_active = 1 LIMIT 1")
        row = cursor.fetchone()
        
        if not row:
            raise HTTPException(status_code=404, detail="No active resume found")
        
        return dict(row)

@router.post("/upload", status_code=status.HTTP_201_CREATED)
async def upload_resume(
    file: UploadFile = File(...),
    current_user: dict = Depends(get_current_user)
):
    """Upload a new resume"""
    # Validate file type
    if not file.filename.endswith(('.pdf', '.doc', '.docx')):
        raise HTTPException(status_code=400, detail="Only PDF, DOC, and DOCX files are allowed")
    
    # Generate unique filename
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    ext = os.path.splitext(file.filename)[1]
    filename = f"resume_{timestamp}{ext}"
    filepath = os.path.join(UPLOAD_DIR, filename)
    
    # Save file
    with open(filepath, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    file_size = os.path.getsize(filepath)
    
    # Save to database
    with get_db() as conn:
        cursor = conn.cursor()
        
        # Get next version number
        cursor.execute("SELECT COALESCE(MAX(version), 0) + 1 as next_version FROM resumes")
        version = cursor.fetchone()["next_version"]
        
        cursor.execute("""
            INSERT INTO resumes (file_name, file_path, file_size, version, is_active)
            VALUES (?, ?, ?, ?, ?)
        """, (filename, filepath, file_size, version, 0))
        
        resume_id = cursor.lastrowid
        conn.commit()
        
        cursor.execute("SELECT * FROM resumes WHERE id = ?", (resume_id,))
        return dict(cursor.fetchone())

@router.put("/{resume_id}/activate")
async def activate_resume(resume_id: int, current_user: dict = Depends(get_current_user)):
    """Set a resume as active"""
    with get_db() as conn:
        cursor = conn.cursor()
        
        # Check if resume exists
        cursor.execute("SELECT * FROM resumes WHERE id = ?", (resume_id,))
        if not cursor.fetchone():
            raise HTTPException(status_code=404, detail="Resume not found")
        
        # Deactivate all resumes
        cursor.execute("UPDATE resumes SET is_active = 0")
        
        # Activate selected resume
        cursor.execute("UPDATE resumes SET is_active = 1 WHERE id = ?", (resume_id,))
        conn.commit()
        
        return {"message": "Resume activated successfully"}

@router.delete("/{resume_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_resume(resume_id: int, current_user: dict = Depends(get_current_user)):
    """Delete a resume"""
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM resumes WHERE id = ?", (resume_id,))
        resume = cursor.fetchone()
        
        if not resume:
            raise HTTPException(status_code=404, detail="Resume not found")
        
        # Delete file
        if os.path.exists(resume["file_path"]):
            os.remove(resume["file_path"])
        
        # Delete from database
        cursor.execute("DELETE FROM resumes WHERE id = ?", (resume_id,))
        conn.commit()

@router.get("/{resume_id}/download")
async def download_resume(resume_id: int):
    """Download a resume file"""
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM resumes WHERE id = ?", (resume_id,))
        resume = cursor.fetchone()
        
        if not resume:
            raise HTTPException(status_code=404, detail="Resume not found")
        
        if not os.path.exists(resume["file_path"]):
            raise HTTPException(status_code=404, detail="Resume file not found")
        
        return FileResponse(
            path=resume["file_path"],
            filename=resume["file_name"],
            media_type="application/octet-stream"
        )

@router.get("/download/active")
async def download_active_resume():
    """Download the currently active resume"""
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM resumes WHERE is_active = 1 LIMIT 1")
        resume = cursor.fetchone()
        
        if not resume:
            raise HTTPException(status_code=404, detail="No active resume found")
        
        if not os.path.exists(resume["file_path"]):
            raise HTTPException(status_code=404, detail="Resume file not found")
        
        return FileResponse(
            path=resume["file_path"],
            filename=resume["file_name"],
            media_type="application/octet-stream"
        )
