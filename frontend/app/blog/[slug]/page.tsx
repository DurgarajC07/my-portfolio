'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { api } from '@/lib/api';
import { Loader2, Calendar, User, Tag, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function BlogDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (slug) {
      fetchPost();
    }
  }, [slug]);

  const fetchPost = async () => {
    try {
      const data = await api.blog.getBySlug(slug);
      setPost(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load blog post');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-accent" />
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Post Not Found</h1>
          <p className="text-muted-foreground mb-6">{error || 'The blog post you are looking for does not exist.'}</p>
          <Link href="/" className="text-accent hover:underline">
            ← Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header with back button */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 text-foreground hover:text-accent transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            Back to Home
          </Link>
        </div>
      </header>

      <article className="container mx-auto px-4 py-12 max-w-4xl">
        {/* Featured Image */}
        {post.image_url && (
          <div className="relative w-full h-96 rounded-2xl overflow-hidden mb-8">
            <Image
              src={post.image_url}
              alt={post.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}

        {/* Meta information */}
        <div className="mb-8">
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-4">
            <span className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              {new Date(post.published_at || post.created_at).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </span>
            
            {post.category && (
              <span className="px-3 py-1 bg-accent/10 text-accent rounded-full text-xs font-medium">
                {post.category}
              </span>
            )}

            {post.views > 0 && (
              <span>
                {post.views} {post.views === 1 ? 'view' : 'views'}
              </span>
            )}
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4 leading-tight">
            {post.title}
          </h1>

          {/* Excerpt */}
          {post.excerpt && (
            <p className="text-lg text-muted-foreground mb-6">
              {post.excerpt}
            </p>
          )}

          {/* Tags */}
          {post.tags && (
            <div className="flex flex-wrap gap-2">
              {post.tags.split(',').map((tag: string, index: number) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-muted text-foreground rounded-full text-sm"
                >
                  <Tag className="h-3 w-3" />
                  {tag.trim()}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Content */}
        <div 
          className="blog-content prose prose-lg max-w-none"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* Footer */}
        <div className="mt-12 pt-8 border-t border-border">
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 text-accent hover:underline font-medium"
          >
            <ArrowLeft className="h-4 w-4" />
            Read more articles
          </Link>
        </div>
      </article>
    </div>
  );
}
