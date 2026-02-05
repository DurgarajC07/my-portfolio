# Quick Reference: Image Upload System

## Fixed Issues ✅

### 1. Resume Upload Error - FIXED

- Updated to use `api.upload.uploadResume()`
- Works correctly now

### 2. Content Manager Image Upload - FIXED

- About section ✅
- Projects section ✅
- Testimonials section ✅
- Preview updates correctly when editing

### 3. Theme Manager - FIXED

- Logo upload added ✅
- Favicon upload added ✅
- Uses ImageUpload component

### 4. SEO Manager - FIXED

- OG Image upload added ✅
- Twitter Image upload added ✅
- Uses ImageUpload component

### 5. Backend Categories - FIXED

- Added "assets" category for logo/favicon/SEO
- Added "blog" category for blog images
- All directories auto-created on startup

## How to Use

### Uploading Images in Admin Panel

1. **Navigate to any section** with images (Content, Blog, Theme, SEO)
2. **Click the upload area** or **drag & drop** an image
3. **Wait for upload** - you'll see a preview immediately
4. **Save the form** - the image URL is automatically saved

### Toggle Between Upload and URL

Each ImageUpload component has a **"Use URL"** toggle:

- Click it to switch between file upload and URL input
- Useful for external images (CDN, etc.)
- Both methods work seamlessly

### Supported Image Formats

- JPG/JPEG
- PNG
- GIF
- WebP
- SVG

**Max Size:** 10MB per image

## Quick Test

### Test All Upload Features

```bash
1. Admin → Content → About → Edit → Upload image
2. Admin → Content → Projects → Add New → Upload image
3. Admin → Blog → New Post → Upload featured image
4. Admin → Theme → Upload logo and favicon
5. Admin → SEO → Edit page → Upload OG/Twitter images
6. Admin → Resume → Upload PDF
```

All should work with:

- ✅ Drag and drop
- ✅ Click to select
- ✅ Instant preview
- ✅ Progress indicator

## Upload Locations

Images stored in:

```
backend/uploads/
  ├── about/         # About images
  ├── projects/      # Project images
  ├── testimonials/  # Testimonial photos
  ├── blog/          # Blog featured images
  ├── assets/        # Logo, favicon, SEO images
  └── resumes/       # Resume files
```

## Troubleshooting Quick Fixes

### Image won't upload?

1. Check file size (max 10MB)
2. Check file type (JPG, PNG, GIF, WebP, SVG only)
3. Ensure you're logged in (JWT token valid)

### Preview not showing?

- Component now auto-updates when value changes
- Refresh the page and try again

### Image not on frontend?

- Save the form after uploading
- Check the image URL is saved in database
- Verify backend is serving /uploads/ directory

## API Endpoints Reference

```
# Upload
POST /api/upload/image?category=projects
DELETE /api/upload/image?filepath=/uploads/...
GET /api/upload/images?category=projects

# Resume
POST /api/resume/upload
GET /api/resume/

# Static Files
GET /uploads/{category}/{filename}
```

## Summary

**Everything works now!** 🎉

- ✅ All admin forms have file upload
- ✅ Resume upload working
- ✅ Theme manager has logo/favicon upload
- ✅ SEO manager has social image upload
- ✅ Preview updates correctly
- ✅ All categories configured
- ✅ Drag & drop everywhere
- ✅ No more manual URL entry needed!
