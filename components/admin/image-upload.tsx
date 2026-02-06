'use client';

import { useState, useRef, useEffect } from 'react';
import { Upload, X, Image as ImageIcon, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { api } from '@/lib/api';
import { useAuth } from '@/contexts/auth-context';

interface ImageUploadProps {
  label: string;
  value?: string;
  onChange: (url: string) => void;
  category?: string;
  required?: boolean;
  className?: string;
}

export function ImageUpload({
  label,
  value,
  onChange,
  category = 'images',
  required = false,
  className = '',
}: ImageUploadProps) {
  const { token } = useAuth();
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [preview, setPreview] = useState(value || '');
  const [useUrl, setUseUrl] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Update preview when value prop changes
  useEffect(() => {
    setPreview(value || '');
  }, [value]);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check if token exists
    if (!token) {
      setError('Not authenticated. Please log in again.');
      console.error('Upload failed: No authentication token found');
      return;
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];
    if (!allowedTypes.includes(file.type)) {
      setError('Invalid file type. Please upload an image (JPG, PNG, GIF, WebP, or SVG)');
      return;
    }

    // Validate file size (10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError('File too large. Maximum size is 10MB');
      return;
    }

    setError('');
    setUploading(true);

    console.log('Starting upload:', {
      filename: file.name,
      size: file.size,
      type: file.type,
      category: category,
      hasToken: !!token,
      tokenLength: token?.length
    });

    try {
      const result = await api.upload.uploadImage(file, category, token);
      
      console.log('Upload successful:', result);
      
      // Construct full URL
      const imageUrl = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}${result.url}`;
      
      setPreview(imageUrl);
      onChange(imageUrl);
    } catch (err: any) {
      console.error('Upload error:', err);
      setError(err.message || 'Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const handleUrlChange = (url: string) => {
    setPreview(url);
    onChange(url);
  };

  const handleRemove = () => {
    setPreview('');
    onChange('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const file = e.dataTransfer.files[0];
    if (!file) return;

    // Create a synthetic event to reuse handleFileSelect
    const input = fileInputRef.current;
    if (input) {
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(file);
      input.files = dataTransfer.files;
      handleFileSelect({ target: input } as any);
    }
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium">
          {label} {required && <span className="text-red-500">*</span>}
        </Label>
        <button
          type="button"
          onClick={() => setUseUrl(!useUrl)}
          className="text-xs text-accent hover:underline"
        >
          {useUrl ? 'Upload file' : 'Use URL'}
        </button>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {useUrl ? (
        <div className="space-y-2">
          <Input
            type="url"
            placeholder="https://example.com/image.jpg"
            value={preview}
            onChange={(e) => handleUrlChange(e.target.value)}
            required={required}
          />
          {preview && (
            <div className="relative w-full h-40 rounded border border-border overflow-hidden">
              <Image
                src={preview}
                alt="Preview"
                fill
                className="object-contain"
                onError={() => setError('Failed to load image from URL')}
              />
            </div>
          )}
        </div>
      ) : (
        <>
          {preview ? (
            <div className="space-y-2">
              <div className="relative w-full h-40 rounded border border-border overflow-hidden group">
                <Image
                  src={preview}
                  alt="Preview"
                  fill
                  className="object-contain"
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={handleRemove}
                  >
                    <X className="h-4 w-4 mr-2" />
                    Remove
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div
              className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-accent transition-colors cursor-pointer"
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
                required={required && !preview}
              />
              {uploading ? (
                <div className="flex flex-col items-center gap-2">
                  <Loader2 className="h-8 w-8 animate-spin text-accent" />
                  <p className="text-sm text-muted-foreground">Uploading...</p>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2">
                  <Upload className="h-8 w-8 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-xs text-muted-foreground">
                    PNG, JPG, GIF, WebP or SVG (max 10MB)
                  </p>
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
