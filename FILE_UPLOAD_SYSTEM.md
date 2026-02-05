# File Upload System Implementation

## Overview

Complete file upload system implemented for images and resumes with secure backend storage and frontend UI components.

## Backend Implementation

### 1. Upload Router (`backend/app/routers/upload.py`)

New dedicated upload router with comprehensive features:

**Features:**

- Image upload with validation (JPG, PNG, GIF, WebP, SVG)
- File size limit: 10MB
- Unique filename generation with timestamp and UUID
- Category-based organization
- Bulk upload support (max 10 files)
- Image deletion with security checks
- List uploaded images by category

**Endpoints:**

- `POST /api/upload/image` - Upload single image
- `POST /api/upload/images/bulk` - Upload multiple images
- `DELETE /api/upload/image` - Delete uploaded image
- `GET /api/upload/images` - List images by category

**Upload Categories:**

- `images` - General images
- `projects` - Project screenshots
- `about` - About section images
- `hero` - Hero section images
- `testimonials` - Testimonial photos
- `skills` - Skill icons/images
- `education` - Education images
- `services` - Service icons/images

**Security Features:**

- JWT authentication required
- File type validation
- File size validation
- Path traversal protection
- Files stored in categorized folders

**Storage Structure:**

```
backend/
  uploads/
    images/
    projects/
    about/
    hero/
    testimonials/
    skills/
    education/
    services/
    resumes/
    assets/
```

### 2. Resume Upload (Already Existed)

- `POST /api/resume/upload` - Upload resume (PDF, DOC, DOCX)
- Automatic version management
- File stored in `uploads/resumes/`

### 3. Static File Serving

Configured in `backend/app/main.py`:

```python
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")
```

All uploaded files accessible at: `http://localhost:8000/uploads/{category}/{filename}`

## Frontend Implementation

### 1. API Client (`frontend/lib/api.ts`)

**New uploadApi methods:**

```typescript
uploadApi.uploadImage(file, category, token);
uploadApi.uploadMultipleImages(files, category, token);
uploadApi.deleteImage(filepath, token);
uploadApi.listImages(category, token);
uploadApi.uploadResume(file, token);
```

### 2. ImageUpload Component (`frontend/components/admin/image-upload.tsx`)

**Reusable component for image uploads with:**

- Drag and drop support
- Click to upload
- Image preview
- Upload progress indicator
- Error handling
- Toggle between file upload and URL input
- Remove uploaded image
- Category-based storage
- Responsive design

**Props:**

```typescript
interface ImageUploadProps {
  label: string;
  value?: string;
  onChange: (url: string) => void;
  category?: string;
  required?: boolean;
  className?: string;
}
```

**Usage Example:**

```tsx
<ImageUpload
  label="Project Image"
  value={formData.image_url}
  onChange={(url) => setFormData({ ...formData, image_url: url })}
  category="projects"
  required
/>
```

### 3. Admin Forms Updated

**Content Manager (`frontend/app/admin/content/page.tsx`):**

- ✅ About section - image upload
- ✅ Projects section - image upload
- ✅ Testimonials section - image upload

**Blog Manager (`frontend/app/admin/blog/page.tsx`):**

- ✅ Featured image upload added
- Form now includes `image_url` field

**Resume Manager (`frontend/app/admin/resume/page.tsx`):**

- ✅ Already had file upload working
- PDF upload with version management

## Features

### Upload Flow

1. User selects file via drag-drop or click
2. Client-side validation (type, size)
3. File uploaded to backend with JWT token
4. Backend validates and saves to category folder
5. Returns secure URL path
6. Frontend displays preview
7. URL saved to database when form submitted

### Security Measures

1. **Authentication**: All upload endpoints require JWT token
2. **File Type Validation**: Only allowed image types accepted
3. **File Size Limits**: 10MB for images, 5MB for resumes
4. **Unique Filenames**: Timestamp + UUID prevents collisions
5. **Path Security**: Delete endpoint validates upload directory
6. **CORS Protection**: Configured origins only

### User Experience

1. **Drag & Drop**: Intuitive file selection
2. **Preview**: Immediate visual feedback
3. **Progress**: Upload status indicators
4. **Error Handling**: Clear error messages
5. **Flexibility**: Can still use URL if preferred
6. **Remove**: Easy image removal

## API Endpoints Summary

### Upload Routes

```
POST   /api/upload/image                - Upload single image
POST   /api/upload/images/bulk          - Upload multiple images
DELETE /api/upload/image?filepath=...   - Delete image
GET    /api/upload/images?category=...  - List images
```

### Resume Routes (Existing)

```
GET    /api/resume/                     - Get all resumes
GET    /api/resume/active               - Get active resume
POST   /api/resume/upload               - Upload resume
PUT    /api/resume/{id}/activate        - Activate resume
DELETE /api/resume/{id}                 - Delete resume
GET    /api/resume/{id}/download        - Download resume
```

### Static Files

```
GET    /uploads/{category}/{filename}   - Access uploaded files
```

## Configuration

### Backend Requirements

- FastAPI
- python-multipart (for file uploads)
- Existing dependencies

### Frontend Requirements

- Next.js 14+
- Existing UI components (Button, Input, Label, Alert)
- lucide-react icons

### Environment Variables

No new environment variables required. Uses existing:

- `NEXT_PUBLIC_API_URL` - API base URL (default: http://localhost:8000)

## Testing

### Test Image Upload

1. Go to Admin → Content Manager
2. Select any section with images (About, Projects, Testimonials)
3. Click "Add New" or "Edit"
4. Click upload area or drag image
5. Verify preview appears
6. Save form
7. Verify image displays on frontend

### Test Resume Upload

1. Go to Admin → Resume Manager
2. Select PDF file
3. Click "Upload Resume"
4. Verify resume in list
5. Activate resume
6. Test download button

### Test Blog Image

1. Go to Admin → Blog
2. Create/Edit post
3. Upload featured image
4. Save post
5. Verify image in blog list

## File Size Recommendations

### Images

- Projects: 1200x800px, < 500KB
- About: 800x800px, < 300KB
- Testimonials: 200x200px, < 100KB
- Hero: 1920x1080px, < 1MB

### Resumes

- PDF format recommended
- Keep under 2MB
- Single page or multi-page supported

## Troubleshooting

### Upload Fails

1. Check JWT token is valid
2. Verify file type is allowed
3. Check file size under limit
4. Ensure uploads directory exists
5. Check backend logs for errors

### Image Not Displaying

1. Verify file was uploaded (check uploads folder)
2. Check URL path is correct
3. Ensure static files mounted in main.py
4. Check CORS settings
5. Verify file permissions

### Resume Upload Issues

1. Only PDF, DOC, DOCX allowed
2. Check file size under 5MB
3. Ensure resumes directory exists
4. Verify authentication token

## Future Enhancements

### Possible Improvements

1. Image optimization (resize, compress)
2. Cloud storage integration (S3, Cloudinary)
3. Image cropping/editing
4. Video upload support
5. Multiple file selection for projects
6. Gallery view of uploaded images
7. Automatic thumbnail generation
8. CDN integration
9. Image alt text management
10. Bulk delete operations

## Migration Notes

### For Existing Data

Existing URL-based images will continue to work. Users can:

1. Keep using external URLs via "Use URL" toggle
2. Upload new files to replace URLs
3. Mix both approaches as needed

### Database Changes

No schema changes required. The `image_url` fields now accept:

- Full external URLs (https://...)
- Relative paths (/uploads/...)
- Backend-generated paths are automatically full URLs

## Deployment Checklist

### Backend

- [ ] Ensure uploads directory writable
- [ ] Configure file size limits in production
- [ ] Set up backup for uploads directory
- [ ] Configure CDN if using cloud storage
- [ ] Set appropriate CORS origins
- [ ] Verify SSL for secure uploads

### Frontend

- [ ] Update NEXT_PUBLIC_API_URL for production
- [ ] Test upload with production API
- [ ] Verify image loading on production
- [ ] Check mobile responsiveness
- [ ] Test all upload components

### Infrastructure

- [ ] Backup uploads directory regularly
- [ ] Monitor disk space usage
- [ ] Set up log rotation
- [ ] Configure rate limiting
- [ ] Implement virus scanning (optional)
- [ ] Set up CDN for image delivery

## Summary

✅ **Complete file upload system implemented**
✅ **All admin forms updated with image upload**
✅ **Resume upload already working**
✅ **Secure backend storage with validation**
✅ **User-friendly drag-drop interface**
✅ **Category-based organization**
✅ **Error handling and progress feedback**
✅ **Backwards compatible with URL input**

The system is production-ready and provides a professional file upload experience for all content management needs.
