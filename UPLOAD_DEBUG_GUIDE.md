# Image Upload Debugging Guide

## Current Issue

Getting 401 Unauthorized error when trying to upload images in admin panel, even though user is logged in.

## What We've Added for Debugging

### Frontend Logging

1. **ImageUpload Component** (`frontend/components/admin/image-upload.tsx`)
   - Logs when upload starts with file details
   - Logs token availability
   - Logs upload success/failure

2. **Upload API** (`frontend/lib/api.ts`)
   - Logs the API call with token info
   - Logs response status
   - Logs any errors

### Backend Logging

1. **Auth Module** (`backend/app/routers/auth.py`)
   - Logs when token is received
   - Logs if token decode fails
   - Logs successful authentication with username

2. **Upload Endpoint** (`backend/app/routers/upload.py`)
   - Logs upload requests with user info
   - Logs file details and category

## How to Debug

### Step 1: Check Browser Console

1. Open browser DevTools (F12)
2. Go to Console tab
3. Try uploading an image
4. Look for these logs:
   ```
   Starting upload: {filename, size, type, category, hasToken, tokenLength}
   uploadImage called: {fileName, category, hasToken, tokenPrefix}
   Upload response: {status, statusText, ok}
   ```

### Step 2: Check Backend Terminal

Look for these logs in the backend terminal:

```
[AUTH] Received token: eyJ...
[AUTH] Authentication successful for user: admin
[UPLOAD] Upload request from user: admin
[UPLOAD] File: image.jpg, Category: about
```

## Common Issues & Solutions

### Issue 1: No Token in Frontend

**Symptoms:**

- Console shows `hasToken: false` or `tokenLength: undefined`

**Solution:**

1. Check if user is actually logged in
2. Open DevTools → Application → Local Storage
3. Check for `auth_token` and `auth_user`
4. If missing, log out and log in again

### Issue 2: Token Not Sent to Backend

**Symptoms:**

- Frontend logs show `hasToken: true`
- Backend logs show `[AUTH] No token received`

**Solution:**

- Check network tab in DevTools
- Look at the request headers
- Ensure Authorization header is present: `Bearer <token>`

### Issue 3: Invalid Token

**Symptoms:**

- Backend logs show `[AUTH] Token decode failed`

**Solution:**

1. Token might be expired (30 minutes default)
2. Log out and log in again
3. Check if SECRET_KEY matches between sessions

### Issue 4: Wrong Token Format

**Symptoms:**

- Token doesn't start with expected JWT format

**Solution:**

- JWT tokens should have 3 parts separated by dots (xxx.yyy.zzz)
- Check auth_token in localStorage

## Testing Checklist

### Test Authentication Flow

1. [ ] Log out completely
2. [ ] Clear browser cache and localStorage
3. [ ] Log in with admin credentials
4. [ ] Check Console - should NOT show "Not authenticated"
5. [ ] Check localStorage for `auth_token`

### Test Image Upload

1. [ ] Go to Admin → Content → About
2. [ ] Click Edit
3. [ ] Try to upload image
4. [ ] Check Console logs (should show upload process)
5. [ ] Check Backend logs (should show auth + upload logs)
6. [ ] If successful, image preview should appear

### Test Public Image Access

1. [ ] Open browser incognito/private window
2. [ ] Go to http://localhost:8000/uploads/about/[filename]
3. [ ] Image should load WITHOUT requiring login
4. [ ] Public routes (/) should display images

## Quick Fixes

### Fix 1: Token Not Persisting

**File:** `frontend/contexts/auth-context.tsx`
Check if token is properly saved after login:

```typescript
localStorage.setItem("auth_token", access_token);
```

### Fix 2: Token Not Retrieved

**File:** `frontend/components/admin/image-upload.tsx`
Check if useAuth is returning token:

```typescript
const { token } = useAuth();
console.log("Token from useAuth:", token ? "Present" : "Missing");
```

### Fix 3: CORS Issues

**File:** `backend/app/main.py`
Ensure CORS is configured:

```python
allow_origins=["http://localhost:3000"],
allow_credentials=True,
```

## Expected Console Output (Success)

### Frontend Console:

```
Starting upload: {
  filename: "image.jpg",
  size: 123456,
  type: "image/jpeg",
  category: "about",
  hasToken: true,
  tokenLength: 200
}

uploadImage called: {
  fileName: "image.jpg",
  category: "about",
  hasToken: true,
  tokenPrefix: "eyJhbGciOiJIUzI1NiIs..."
}

Upload response: {
  status: 200,
  statusText: "OK",
  ok: true
}

Upload result: {
  success: true,
  url: "/uploads/about/20260205_123456_abc12345.jpg",
  ...
}

Upload successful: {...}
```

### Backend Terminal:

```
[AUTH] Received token: eyJhbGciOiJIUzI1NiIs...
[AUTH] Authentication successful for user: admin
[UPLOAD] Upload request from user: admin
[UPLOAD] File: image.jpg, Category: about
INFO:     127.0.0.1:54321 - "POST /api/upload/image?category=about HTTP/1.1" 200 OK
```

## Next Steps

1. **Restart Backend** - Ensure latest code is running:

   ```bash
   cd backend
   .venv\Scripts\python.exe -m uvicorn app.main:app --reload
   ```

2. **Clear Frontend Cache** - Hard refresh browser (Ctrl+Shift+R)

3. **Test Upload** - Try uploading an image and check both consoles

4. **Share Logs** - If still failing, share:
   - Browser console logs
   - Backend terminal logs
   - Network tab request/response

## Understanding the Flow

```
User Action: Click upload / Select file
    ↓
ImageUpload Component: Validate file, get token from useAuth
    ↓
api.upload.uploadImage(): Create FormData, add Auth header
    ↓
HTTP Request: POST /api/upload/image?category=about
    Headers: {Authorization: "Bearer <token>"}
    Body: FormData with file
    ↓
Backend: FastAPI receives request
    ↓
get_current_user(): Extract token from Authorization header
    ↓
decode_access_token(): Verify JWT signature & expiry
    ↓
upload_image(): Process file upload
    ↓
Save file: uploads/about/20260205_123456_abc12345.jpg
    ↓
Response: {success: true, url: "/uploads/...", ...}
    ↓
ImageUpload: Update preview, call onChange with full URL
    ↓
Form: Save URL to database on submit
```

## Public Image Access (No Auth Required)

Images are served via static files:

- Backend: `app.mount("/uploads", StaticFiles(directory="uploads"))`
- Anyone can view: `http://localhost:8000/uploads/about/image.jpg`
- No authentication required for GET requests
- Only upload/delete require authentication

This ensures:

- ✅ Public users can see images on the portfolio
- ✅ Only authenticated admins can upload/delete
- ✅ Images are directly served by FastAPI's static file handler
