from fastapi import APIRouter, HTTPException, Depends, status
from app.schemas import ThemeSettings
from app.database import get_db
from app.routers.auth import get_current_user

router = APIRouter(prefix="/api/theme", tags=["Theme"])

@router.get("/", response_model=ThemeSettings)
async def get_theme():
    """Get current theme settings"""
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM theme_settings LIMIT 1")
        row = cursor.fetchone()
        
        if not row:
            # Create default theme
            cursor.execute("""
                INSERT INTO theme_settings (primary_color, secondary_color, accent_color)
                VALUES (?, ?, ?)
            """, ("#3b82f6", "#8b5cf6", "#10b981"))
            conn.commit()
            
            cursor.execute("SELECT * FROM theme_settings LIMIT 1")
            row = cursor.fetchone()
        
        return dict(row)

@router.put("/", response_model=ThemeSettings)
async def update_theme(theme: ThemeSettings, current_user: dict = Depends(get_current_user)):
    """Update theme settings"""
    with get_db() as conn:
        cursor = conn.cursor()
        
        # Check if theme exists
        cursor.execute("SELECT id FROM theme_settings LIMIT 1")
        existing = cursor.fetchone()
        
        if existing:
            # Update existing
            cursor.execute("""
                UPDATE theme_settings 
                SET primary_color = ?, secondary_color = ?, accent_color = ?,
                    font_primary = ?, font_secondary = ?, font_code = ?,
                    dark_mode = ?, custom_css = ?, logo_url = ?, favicon_url = ?,
                    updated_at = CURRENT_TIMESTAMP
                WHERE id = ?
            """, (theme.primary_color, theme.secondary_color, theme.accent_color,
                  theme.font_primary, theme.font_secondary, theme.font_code,
                  theme.dark_mode, theme.custom_css, theme.logo_url, theme.favicon_url,
                  existing["id"]))
        else:
            # Create new
            cursor.execute("""
                INSERT INTO theme_settings 
                (primary_color, secondary_color, accent_color, font_primary, font_secondary,
                 font_code, dark_mode, custom_css, logo_url, favicon_url)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (theme.primary_color, theme.secondary_color, theme.accent_color,
                  theme.font_primary, theme.font_secondary, theme.font_code,
                  theme.dark_mode, theme.custom_css, theme.logo_url, theme.favicon_url))
        
        conn.commit()
        
        cursor.execute("SELECT * FROM theme_settings LIMIT 1")
        return dict(cursor.fetchone())

@router.get("/fonts/google")
async def get_google_fonts():
    """Get list of popular Google Fonts"""
    popular_fonts = [
        "Inter", "Roboto", "Open Sans", "Lato", "Montserrat",
        "Poppins", "Raleway", "Nunito", "Playfair Display", "Merriweather",
        "PT Sans", "Source Sans Pro", "Ubuntu", "Fira Sans", "Oswald"
    ]
    return {"fonts": popular_fonts}

@router.post("/reset")
async def reset_theme(current_user: dict = Depends(get_current_user)):
    """Reset theme to default"""
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("DELETE FROM theme_settings")
        cursor.execute("""
            INSERT INTO theme_settings (primary_color, secondary_color, accent_color)
            VALUES (?, ?, ?)
        """, ("#3b82f6", "#8b5cf6", "#10b981"))
        conn.commit()
        
        return {"message": "Theme reset to default"}
