from fastapi import APIRouter, HTTPException, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from typing import Optional
from datetime import timedelta
from app.schemas import UserLogin, UserRegister, Token, User
from app.database import get_db
from app.utils.security import hash_password, verify_password, create_access_token, decode_access_token
import sqlite3

router = APIRouter(prefix="/api/auth", tags=["Authentication"])
security = HTTPBearer()

def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)) -> dict:
    """Dependency to get current authenticated user"""
    token = credentials.credentials
    
    print(f"[AUTH] Received token: {token[:20]}..." if token else "[AUTH] No token received")
    
    payload = decode_access_token(token)
    
    if payload is None:
        print("[AUTH] Token decode failed - invalid token")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials"
        )
    
    username = payload.get("sub")
    if username is None:
        print("[AUTH] Token payload missing 'sub' field")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials"
        )
    
    print(f"[AUTH] Authentication successful for user: {username}")
    
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM users WHERE username = ?", (username,))
        user = cursor.fetchone()
        
        if user is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="User not found"
            )
        
        return dict(user)

@router.post("/register", response_model=User, status_code=status.HTTP_201_CREATED)
async def register(user_data: UserRegister):
    """Register a new user (admin only in production)"""
    with get_db() as conn:
        cursor = conn.cursor()
        
        # Check if username exists
        cursor.execute("SELECT id FROM users WHERE username = ?", (user_data.username,))
        if cursor.fetchone():
            raise HTTPException(status_code=400, detail="Username already exists")
        
        # Check if email exists
        cursor.execute("SELECT id FROM users WHERE email = ?", (user_data.email,))
        if cursor.fetchone():
            raise HTTPException(status_code=400, detail="Email already exists")
        
        # Create user
        password_hash = hash_password(user_data.password)
        cursor.execute("""
            INSERT INTO users (username, email, password_hash, role)
            VALUES (?, ?, ?, ?)
        """, (user_data.username, user_data.email, password_hash, "admin"))
        
        user_id = cursor.lastrowid
        conn.commit()
        
        # Get created user
        cursor.execute("SELECT * FROM users WHERE id = ?", (user_id,))
        user = cursor.fetchone()
        
        return dict(user)

@router.post("/login", response_model=Token)
async def login(credentials: UserLogin):
    """Login and get access token with user data"""
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM users WHERE username = ?", (credentials.username,))
        user = cursor.fetchone()
        
        if not user or not verify_password(credentials.password, user["password_hash"]):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect username or password"
            )
        
        # Create access token
        access_token = create_access_token(
            data={"sub": user["username"], "role": user["role"]},
            expires_delta=timedelta(minutes=30)
        )
        
        # Log activity
        cursor.execute("""
            INSERT INTO activity_logs (user_id, action, details)
            VALUES (?, ?, ?)
        """, (user["id"], "login", f"User {user['username']} logged in"))
        conn.commit()
        
        # Return token with user data
        user_data = {
            "id": user["id"],
            "username": user["username"],
            "email": user["email"],
            "role": user["role"]
        }
        
        return {
            "access_token": access_token, 
            "token_type": "bearer",
            "user": user_data
        }

@router.get("/me", response_model=User)
async def get_me(current_user: dict = Depends(get_current_user)):
    """Get current user information"""
    return current_user

@router.post("/change-password")
async def change_password(
    old_password: str,
    new_password: str,
    current_user: dict = Depends(get_current_user)
):
    """Change user password"""
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT password_hash FROM users WHERE id = ?", (current_user["id"],))
        user = cursor.fetchone()
        
        if not verify_password(old_password, user["password_hash"]):
            raise HTTPException(status_code=400, detail="Incorrect old password")
        
        # Update password
        new_hash = hash_password(new_password)
        cursor.execute("""
            UPDATE users SET password_hash = ?, updated_at = CURRENT_TIMESTAMP
            WHERE id = ?
        """, (new_hash, current_user["id"]))
        conn.commit()
        
        return {"message": "Password changed successfully"}
