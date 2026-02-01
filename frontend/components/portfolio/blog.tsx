'use client';

import { ArrowRight, Calendar, Tag } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

interface BlogProps {
  data: any[];
}

export function Blog({ data }: BlogProps) {
  if (!data || data.length === 0) return null;

  const publishedBlogs = data.filter((blog: any) => blog.status === 'published').slice(0, 3);

  return (
    <section id="blog" className="py-20 bg-card/50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-foreground mb-4">Latest Articles</h2>
          <p className="text-muted-foreground text-lg">
            Thoughts on technology, development, and AI
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {publishedBlogs.map((blog: any) => (
            <article
              key={blog.id}
              className="bg-background border border-border rounded-lg overflow-hidden hover:shadow-lg transition-shadow group"
            >
              {/* Blog Image */}
              <div className="relative h-48 bg-muted overflow-hidden">
                {blog.image_url ? (
                  <Image
                    src={blog.image_url}
                    alt={blog.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-muted-foreground">
                    <span>No Image</span>
                  </div>
                )}
                {blog.category && (
                  <div className="absolute top-2 left-2 px-2 py-1 bg-accent text-accent-foreground text-xs rounded">
                    {blog.category}
                  </div>
                )}
              </div>

              {/* Blog Content */}
              <div className="p-6 space-y-4">
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar size={14} />
                    {new Date(blog.published_at).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </div>
                  <div className="flex items-center gap-1">
                    <Tag size={14} />
                    {blog.views || 0} views
                  </div>
                </div>

                <h3 className="text-xl font-semibold text-foreground line-clamp-2">
                  {blog.title}
                </h3>
                
                <p className="text-muted-foreground text-sm line-clamp-3">
                  {blog.excerpt}
                </p>

                {/* Tags */}
                {blog.tags && (
                  <div className="flex flex-wrap gap-2">
                    {blog.tags.split(',').slice(0, 3).map((tag: string, i: number) => (
                      <span
                        key={i}
                        className="px-2 py-1 bg-muted text-muted-foreground rounded text-xs"
                      >
                        #{tag.trim()}
                      </span>
                    ))}
                  </div>
                )}

                <Link
                  href={`/blog/${blog.slug}`}
                  className="inline-flex items-center gap-2 text-accent hover:text-accent/80 transition-colors text-sm font-medium group"
                >
                  Read More
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </article>
          ))}
        </div>

        {data.length > 3 && (
          <div className="text-center mt-12">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-accent-foreground rounded-lg hover:bg-accent/90 transition-colors font-medium"
            >
              View All Articles
              <ArrowRight size={18} />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
