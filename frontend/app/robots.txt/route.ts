import { NextRequest, NextResponse } from 'next/server';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic';
export const revalidate = 3600; // Revalidate every hour

export async function GET(request: NextRequest) {
  try {
    // Fetch robots.txt from backend
    const response = await fetch(`${API_URL}/robots.txt`, {
      next: { revalidate: 3600 }, // Cache for 1 hour
    });

    if (!response.ok) {
      const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://example.com';
      const defaultRobots = `User-agent: *
Allow: /

Sitemap: ${siteUrl}/sitemap.xml`;
      
      return new NextResponse(defaultRobots, {
        status: 200,
        headers: {
          'Content-Type': 'text/plain',
          'Cache-Control': 'public, max-age=3600, s-maxage=3600',
        },
      });
    }

    const text = await response.text();

    return new NextResponse(text, {
      status: 200,
      headers: {
        'Content-Type': 'text/plain',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600',
      },
    });
  } catch (error) {
    console.error('Error fetching robots.txt:', error);
    
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://example.com';
    const defaultRobots = `User-agent: *
Allow: /

Sitemap: ${siteUrl}/sitemap.xml`;
    
    return new NextResponse(defaultRobots, {
      status: 200,
      headers: {
        'Content-Type': 'text/plain',
      },
    });
  }
}
