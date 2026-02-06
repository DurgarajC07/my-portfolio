'use client';

import { useEffect } from 'react';
import { api } from '@/lib/api';

export function DynamicTheme() {
  useEffect(() => {
    const loadTheme = async () => {
      try {
        const theme = await api.theme.get() as any;
        
        if (theme) {
          const root = document.documentElement;
          
          // Apply color variables
          if (theme.primary_color) {
            root.style.setProperty('--primary', theme.primary_color);
          }
          
          if (theme.secondary_color) {
            root.style.setProperty('--secondary', theme.secondary_color);
          }
          
          if (theme.accent_color) {
            root.style.setProperty('--accent', theme.accent_color);
          }
          
          // Apply dark mode
          if (theme.dark_mode !== undefined) {
            const isDark = Boolean(theme.dark_mode);
            if (isDark) {
              document.documentElement.classList.add('dark');
            } else {
              document.documentElement.classList.remove('dark');
            }
          }
          
          // Apply primary font (body text)
          if (theme.font_primary) {
            const fontName = theme.font_primary.replace(/\s+/g, '+');
            
            // Load Google Font if not already loaded
            if (!document.querySelector(`link[href*="${fontName}"]`)) {
              const link = document.createElement('link');
              link.rel = 'stylesheet';
              link.href = `https://fonts.googleapis.com/css2?family=${fontName}:wght@300;400;500;600;700&display=swap`;
              document.head.appendChild(link);
            }
            
            // Apply font to body
            document.body.style.fontFamily = `"${theme.font_primary}", sans-serif`;
          }
          
          // Apply secondary font (headings)
          if (theme.font_secondary) {
            const fontName = theme.font_secondary.replace(/\s+/g, '+');
            
            // Load Google Font if not already loaded
            if (!document.querySelector(`link[href*="${fontName}"]`)) {
              const link = document.createElement('link');
              link.rel = 'stylesheet';
              link.href = `https://fonts.googleapis.com/css2?family=${fontName}:wght@600;700;800;900&display=swap`;
              document.head.appendChild(link);
            }
            
            // Apply heading font
            const existingHeadingStyle = document.getElementById('custom-heading-font');
            if (existingHeadingStyle) {
              existingHeadingStyle.remove();
            }
            
            const headingStyle = document.createElement('style');
            headingStyle.id = 'custom-heading-font';
            headingStyle.textContent = `
              h1, h2, h3, h4, h5, h6 {
                font-family: "${theme.font_secondary}", sans-serif !important;
              }
            `;
            document.head.appendChild(headingStyle);
          }
          
          // Apply code font
          if (theme.font_code) {
            const fontName = theme.font_code.replace(/\s+/g, '+');
            
            // Load Google Font if not already loaded
            if (!document.querySelector(`link[href*="${fontName}"]`)) {
              const link = document.createElement('link');
              link.rel = 'stylesheet';
              link.href = `https://fonts.googleapis.com/css2?family=${fontName}:wght@400;500;600;700&display=swap`;
              document.head.appendChild(link);
            }
            
            // Apply code font
            const existingCodeStyle = document.getElementById('custom-code-font');
            if (existingCodeStyle) {
              existingCodeStyle.remove();
            }
            
            const codeStyle = document.createElement('style');
            codeStyle.id = 'custom-code-font';
            codeStyle.textContent = `
              code, pre, .font-mono {
                font-family: "${theme.font_code}", monospace !important;
              }
            `;
            document.head.appendChild(codeStyle);
          }
          
          // Apply custom CSS
          if (theme.custom_css) {
            const existingCustomCSS = document.getElementById('custom-theme-css');
            if (existingCustomCSS) {
              existingCustomCSS.remove();
            }
            
            const customStyle = document.createElement('style');
            customStyle.id = 'custom-theme-css';
            customStyle.textContent = theme.custom_css;
            document.head.appendChild(customStyle);
          }
          
          // Update favicon
          if (theme.favicon_url) {
            let favicon = document.querySelector('link[rel="icon"]') as HTMLLinkElement;
            if (!favicon) {
              favicon = document.createElement('link');
              favicon.rel = 'icon';
              document.head.appendChild(favicon);
            }
            favicon.href = theme.favicon_url;
          }
          
          // Update logo in navbar
          if (theme.logo_url) {
            const logos = document.querySelectorAll('[data-theme-logo]');
            logos.forEach(logo => {
              if (logo instanceof HTMLImageElement) {
                logo.src = theme.logo_url;
              }
            });
          }
        }
      } catch (error) {
        console.error('Failed to load theme settings:', error);
      }
    };

    loadTheme();
  }, []);

  return null;
}
