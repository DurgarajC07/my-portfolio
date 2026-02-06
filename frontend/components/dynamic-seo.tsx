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
        }
      } catch (error) {
        console.error('Failed to load SEO settings:', error);
      }
    };

    loadSEO();
  }, [pathname]);

  return null;
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
