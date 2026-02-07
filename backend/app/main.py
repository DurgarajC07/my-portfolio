from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import JSONResponse, Response
import os
from app.database import init_db, create_default_admin, create_sample_data
from app.routers import auth, content, blog, seo, theme, resume, settings, upload

# Initialize database on startup
if not os.path.exists("portfolio.db"):
    init_db()
    create_default_admin()
    create_sample_data()

# Create FastAPI app
app = FastAPI(
    title="Portfolio CMS API",
    description="Complete CMS backend for portfolio website",
    version="1.0.0",
    docs_url="/api/docs",
    redoc_url="/api/redoc"
)

# CORS configuration
origins = os.getenv("CORS_ORIGINS", "https://durgarajchauhan.vercel.app,http://localhost:3000,http://127.0.0.1:3000").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount static files
os.makedirs("uploads", exist_ok=True)
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

# Include routers
app.include_router(auth.router)
app.include_router(content.router)
app.include_router(blog.router)
app.include_router(seo.router)
app.include_router(theme.router)
app.include_router(resume.router)
app.include_router(settings.router)
app.include_router(upload.router)

# Root endpoint
@app.get("/")
async def root():
    return {
        "message": "Portfolio CMS API",
        "version": "1.0.0",
        "docs": "/api/docs",
        "status": "running"
    }

# Health check
@app.get("/health")
async def health_check():
    return {"status": "healthy"}

# Sitemap and robots.txt at root level for SEO
@app.get("/sitemap.xml")
async def root_sitemap():
    """Serve sitemap.xml at root level"""
    return await seo.get_sitemap()

@app.get("/robots.txt")
async def root_robots():
    """Serve robots.txt at root level"""
    return await seo.get_robots_txt()

# Global exception handler
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    return JSONResponse(
        status_code=500,
        content={"detail": f"Internal server error: {str(exc)}"}
    )

# Startup event
@app.on_event("startup")
async def startup_event():
    # Ensure admin user exists
    try:
        create_default_admin()
    except Exception:
        pass  # Admin already exists or will be created
    
    print("🚀 Portfolio CMS API started successfully!")
    print("📚 API Documentation: http://localhost:8000/api/docs")
    print("🔐 Default admin credentials:")
    print("   Username: admin")
    print("   Password: admin123")

# Shutdown event
@app.on_event("shutdown")
async def shutdown_event():
    print("👋 Portfolio CMS API shutting down...")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
