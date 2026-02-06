'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { api } from '@/lib/api';

export function DynamicSEO() {
  const pathname = usePathname();

  useEffect(() => {
    // Fetch and apply SEO settings for current page
    const loadSEO = async () => {
      try {
        const pages = await api.seo.getPages() as any[];
        
        // Find SEO for current page
        let pageName = 'home';
        if (pathname === '/') pageName = 'home';
        else if (pathname.startsWith('/blog')) pageName = 'blog';
        else if (pathname.startsWith('/projects')) pageName = 'projects';
        else if (pathname.startsWith('/about')) pageName = 'about';
        
        const seoPage = pages.find((p: any) => p.page_name === pageName);
        
        if (seoPage) {
          // Update title
          document.title = seoPage.meta_title || 'Portfolio';
          
          // Update meta description
          updateMetaTag('name', 'description', seoPage.meta_description);
          updateMetaTag('name', 'keywords', seoPage.meta_keywords);
          
          // OpenGraph tags
          updateMetaTag('property', 'og:title', seoPage.og_title || seoPage.meta_title);
          updateMetaTag('property', 'og:description', seoPage.og_description || seoPage.meta_description);
          updateMetaTag('property', 'og:image', seoPage.og_image);
          updateMetaTag('property', 'og:url', window.location.href);
          updateMetaTag('property', 'og:type', 'website');
          
          // Twitter Card tags
          updateMetaTag('name', 'twitter:card', 'summary_large_image');
          updateMetaTag('name', 'twitter:title', seoPage.twitter_title || seoPage.og_title || seoPage.meta_title);
          updateMetaTag('name', 'twitter:description', seoPage.twitter_description || seoPage.og_description || seoPage.meta_description);
          updateMetaTag('name', 'twitter:image', seoPage.twitter_image || seoPage.og_image);
          
          // Canonical URL
          updateLinkTag('canonical', seoPage.canonical_url || window.location.href);
          
          // Add structured data for schema markup
          if (seoPage.schema_markup) {
            injectStructuredData('page-schema', seoPage.schema_markup);
          }
        }
        
        // Load blog post structured data if on a blog page
        if (pathname.startsWith('/blog/') && pathname !== '/blog') {
          await loadBlogStructuredData(pathname);
        }
        
      } catch (error) {
        console.error('Failed to load SEO settings:', error);
      }
    };

    loadSEO();
  }, [pathname]);

  return null;
}

async function loadBlogStructuredData(pathname: string) {
  try {
    const slug = pathname.split('/blog/')[1];
    const post = await api.blog.getBySlug(slug) as any;
    
    if (post) {
      const siteUrl = window.location.origin;
      
      const structuredData = {
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        headline: post.title,
        description: post.excerpt || post.meta_description,
        image: post.image_url || `${siteUrl}/og-image.png`,
        datePublished: post.published_at || post.created_at,
        dateModified: post.updated_at,
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
        mainEntityOfPage: {
          '@type': 'WebPage',
          '@id': window.location.href,
        },
      };
      
      injectStructuredData('blog-post-schema', JSON.stringify(structuredData));
      
      // Update page title and meta for blog post
      document.title = post.meta_title || post.title || 'Blog Post';
      updateMetaTag('name', 'description', post.meta_description || post.excerpt);
      updateMetaTag('name', 'keywords', post.meta_keywords || post.tags);
      updateMetaTag('property', 'og:title', post.title);
      updateMetaTag('property', 'og:description', post.excerpt || post.meta_description);
      updateMetaTag('property', 'og:image', post.image_url);
      updateMetaTag('property', 'og:type', 'article');
      updateMetaTag('name', 'twitter:card', 'summary_large_image');
      updateMetaTag('name', 'twitter:title', post.title);
      updateMetaTag('name', 'twitter:description', post.excerpt || post.meta_description);
      updateMetaTag('name', 'twitter:image', post.image_url);
    }
  } catch (error) {
    console.error('Failed to load blog structured data:', error);
  }
}

function injectStructuredData(id: string, jsonData: string) {
  // Remove existing script with this ID
  const existing = document.getElementById(id);
  if (existing) {
    existing.remove();
  }
  
  // Create new script tag
  const script = document.createElement('script');
  script.id = id;
  script.type = 'application/ld+json';
  
  try {
    // Validate JSON
    const data = typeof jsonData === 'string' ? JSON.parse(jsonData) : jsonData;
    script.textContent = JSON.stringify(data);
    document.head.appendChild(script);
  } catch (error) {
    console.error('Invalid JSON for structured data:', error);
  }
}

function updateMetaTag(attribute: string, name: string, content: string | null | undefined) {
  if (!content) return;
  
  let element = document.querySelector(`meta[${attribute}="${name}"]`);
  
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attribute, name);
    document.head.appendChild(element);
  }
  
  element.setAttribute('content', content);
}

function updateLinkTag(rel: string, href: string) {
  if (!href) return;
  
  let element = document.querySelector(`link[rel="${rel}"]`);
  
  if (!element) {
    element = document.createElement('link');
    element.setAttribute('rel', rel);
    document.head.appendChild(element);
  }
  
  element.setAttribute('href', href);
}
