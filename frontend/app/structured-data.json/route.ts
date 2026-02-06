import { NextRequest, NextResponse } from 'next/server';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic';
export const revalidate = 3600; // Revalidate every hour

// Generate structured data for blog posts
async function generateBlogStructuredData() {
  try {
    const response = await fetch(`${API_URL}/api/blog?status=published`, {
      next: { revalidate: 3600 }, // Cache for 1 hour
    });

    if (!response.ok) {
      return null;
    }

    const blogs = await response.json();
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://example.com';

    const structuredData = {
      '@context': 'https://schema.org',
      '@graph': blogs.map((blog: any) => ({
        '@type': 'BlogPosting',
        headline: blog.title,
        description: blog.excerpt || blog.meta_description,
        url: `${siteUrl}/blog/${blog.slug}`,
        datePublished: blog.published_at || blog.created_at,
        dateModified: blog.updated_at,
        author: {
          '@type': 'Person',
          name: 'Portfolio Author',
        },
        publisher: {
          '@type': 'Organization',
          name: 'Portfolio',
          logo: {
            '@type': 'ImageObject',
            url: `${siteUrl}/logo.png`,
          },
        },
        image: blog.image_url || `${siteUrl}/og-image.png`,
        mainEntityOfPage: {
          '@type': 'WebPage',
          '@id': `${siteUrl}/blog/${blog.slug}`,
        },
      })),
    };

    return structuredData;
  } catch (error) {
    console.error('Error generating structured data:', error);
    return null;
  }
}

export async function GET(request: NextRequest) {
  const structuredData = await generateBlogStructuredData();

  if (!structuredData) {
    return new NextResponse(JSON.stringify({}), {
      status: 200,
      headers: {
        'Content-Type': 'application/ld+json',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600',
      },
    });
  }

  return new NextResponse(JSON.stringify(structuredData), {
    status: 200,
    headers: {
      'Content-Type': 'application/ld+json',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}
