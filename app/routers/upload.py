from fastapi import APIRouter, HTTPException, Depends, UploadFile, File, status
from typing import List
import os
import shutil
from datetime import datetime
import uuid
from pathlib import Path
from app.routers.auth import get_current_user

router = APIRouter(prefix="/api/upload", tags=["Upload"])

# Upload directories
UPLOAD_DIRS = {
    "images": "uploads/images",
    "projects": "uploads/projects",
    "about": "uploads/about",
    "hero": "uploads/hero",
    "testimonials": "uploads/testimonials",
    "skills": "uploads/skills",
    "education": "uploads/education",
    "services": "uploads/services",
    "assets": "uploads/assets",
    "blog": "uploads/blog",
}

# Create all upload directories
for directory in UPLOAD_DIRS.values():
    os.makedirs(directory, exist_ok=True)

# Allowed file extensions
ALLOWED_IMAGE_EXTENSIONS = {".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg"}
MAX_FILE_SIZE = 10 * 1024 * 1024  # 10MB

def validate_image_file(file: UploadFile):
    """Validate uploaded image file"""
    # Check file extension
    ext = Path(file.filename).suffix.lower()
    if ext not in ALLOWED_IMAGE_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid file type. Allowed types: {', '.join(ALLOWED_IMAGE_EXTENSIONS)}"
        )
    
    # Check file size (read first chunk to estimate)
    file.file.seek(0, 2)  # Seek to end
    file_size = file.file.tell()
    file.file.seek(0)  # Reset to beginning
    
    if file_size > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=400,
            detail=f"File too large. Maximum size is {MAX_FILE_SIZE // (1024*1024)}MB"
        )
    
    return True

def generate_unique_filename(original_filename: str) -> str:
    """Generate unique filename with timestamp and UUID"""
    ext = Path(original_filename).suffix.lower()
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    unique_id = str(uuid.uuid4())[:8]
    return f"{timestamp}_{unique_id}{ext}"

@router.post("/image")
async def upload_image(
    file: UploadFile = File(...),
    category: str = "images",
    current_user: dict = Depends(get_current_user)
):
    """
    Upload an image file
    
    Args:
        file: The image file to upload
        category: Upload category (images, projects, about, hero, testimonials, skills, education, services, assets, blog)
        current_user: Authenticated user
    
    Returns:
        Dictionary with upload details including URL
    """
    print(f"[UPLOAD] Upload request from user: {current_user.get('username')}")
    print(f"[UPLOAD] File: {file.filename}, Category: {category}")
    
    # Validate file
    validate_image_file(file)
    
    # Get upload directory
    upload_dir = UPLOAD_DIRS.get(category, UPLOAD_DIRS["images"])
    os.makedirs(upload_dir, exist_ok=True)
    
    # Generate unique filename
    filename = generate_unique_filename(file.filename)
    filepath = os.path.join(upload_dir, filename)
    
    # Save file
    try:
        with open(filepath, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to save file: {str(e)}"
        )
    finally:
        file.file.close()
    
    # Get file size
    file_size = os.path.getsize(filepath)
    
    # Generate URL path
    url_path = f"/{filepath.replace(os.sep, '/')}"
    
    return {
        "success": True,
        "message": "Image uploaded successfully",
        "filename": filename,
        "original_filename": file.filename,
        "url": url_path,
        "size": file_size,
        "category": category,
        "uploaded_at": datetime.now().isoformat()
    }

@router.post("/images/bulk")
async def upload_multiple_images(
    files: List[UploadFile] = File(...),
    category: str = "images",
    current_user: dict = Depends(get_current_user)
):
    """
    Upload multiple image files
    
    Args:
        files: List of image files to upload
        category: Upload category
        current_user: Authenticated user
    
    Returns:
        List of upload results
    """
    if len(files) > 10:
        raise HTTPException(
            status_code=400,
            detail="Maximum 10 files can be uploaded at once"
        )
    
    results = []
    errors = []
    
    for file in files:
        try:
            # Validate file
            validate_image_file(file)
            
            # Get upload directory
            upload_dir = UPLOAD_DIRS.get(category, UPLOAD_DIRS["images"])
            
            # Generate unique filename
            filename = generate_unique_filename(file.filename)
            filepath = os.path.join(upload_dir, filename)
            
            # Save file
            with open(filepath, "wb") as buffer:
                shutil.copyfileobj(file.file, buffer)
            
            # Get file size
            file_size = os.path.getsize(filepath)
            
            # Generate URL path
            url_path = f"/{filepath.replace(os.sep, '/')}"
            
            results.append({
                "success": True,
                "filename": filename,
                "original_filename": file.filename,
                "url": url_path,
                "size": file_size
            })
        except Exception as e:
            errors.append({
                "filename": file.filename,
                "error": str(e)
            })
        finally:
            file.file.close()
    
    return {
        "success": len(errors) == 0,
        "uploaded": len(results),
        "failed": len(errors),
        "results": results,
        "errors": errors
    }

@router.delete("/image")
async def delete_image(
    filepath: str,
    current_user: dict = Depends(get_current_user)
):
    """
    Delete an uploaded image
    
    Args:
        filepath: The file path (URL) to delete
        current_user: Authenticated user
    
    Returns:
        Success message
    """
    # Remove leading slash and convert to system path
    if filepath.startswith('/'):
        filepath = filepath[1:]
    
    filepath = filepath.replace('/', os.sep)
    
    # Security check: ensure file is in uploads directory
    abs_path = os.path.abspath(filepath)
    uploads_path = os.path.abspath("uploads")
    
    if not abs_path.startswith(uploads_path):
        raise HTTPException(
            status_code=403,
            detail="Access denied"
        )
    
    # Check if file exists
    if not os.path.exists(filepath):
        raise HTTPException(
            status_code=404,
            detail="File not found"
        )
    
    # Delete file
    try:
        os.remove(filepath)
        return {
            "success": True,
            "message": "Image deleted successfully"
        }
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to delete file: {str(e)}"
        )

@router.get("/images")
async def list_images(
    category: str = "images",
    current_user: dict = Depends(get_current_user)
):
    """
    List all uploaded images in a category
    
    Args:
        category: Upload category
        current_user: Authenticated user
    
    Returns:
        List of image metadata
    """
    upload_dir = UPLOAD_DIRS.get(category, UPLOAD_DIRS["images"])
    
    if not os.path.exists(upload_dir):
        return []
    
    images = []
    for filename in os.listdir(upload_dir):
        filepath = os.path.join(upload_dir, filename)
        if os.path.isfile(filepath):
            ext = Path(filename).suffix.lower()
            if ext in ALLOWED_IMAGE_EXTENSIONS:
                file_size = os.path.getsize(filepath)
                url_path = f"/{filepath.replace(os.sep, '/')}"
                
                images.append({
                    "filename": filename,
                    "url": url_path,
                    "size": file_size,
                    "category": category,
                    "uploaded_at": datetime.fromtimestamp(
                        os.path.getmtime(filepath)
                    ).isoformat()
                })
    
    # Sort by upload time (newest first)
    images.sort(key=lambda x: x["uploaded_at"], reverse=True)
    
    return images
