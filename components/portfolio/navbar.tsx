'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { api } from '@/lib/api';

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [logo, setLogo] = useState<string | null>(null);
  const [siteName, setSiteName] = useState('Portfolio');

  useEffect(() => {
    // Load theme settings for logo
    const loadTheme = async () => {
      try {
        const theme = await api.theme.get() as any;
        if (theme?.logo_url) {
          setLogo(theme.logo_url);
        }
        
        // Load site settings for name
        const settings = await api.settings.get() as any;
        if (settings?.site_name) {
          setSiteName(settings.site_name);
        }
      } catch (error) {
        console.error('Failed to load navbar settings:', error);
      }
    };
    
    loadTheme();
  }, []);

  const navItems = [
    { label: 'Home', href: '#home' },
    { label: 'About', href: '#about' },
    { label: 'Projects', href: '#projects' },
    { label: 'Blog', href: '#blog' },
    { label: 'Contact', href: '#contact' },
  ];

  return (
    <nav className="fixed top-0 w-full bg-background/95 backdrop-blur-sm border-b border-border z-40">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          {logo ? (
            <Image 
              src={logo} 
              alt={siteName}
              width={32}
              height={32}
              className="object-contain"
              data-theme-logo
            />
          ) : null}
          <span className="text-xl font-bold text-accent">
            {siteName}
          </span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8">
          {navItems.map(item => (
            <Link
              key={item.href}
              href={item.href}
              className="text-foreground hover:text-accent transition-colors font-medium text-sm"
            >
              {item.label}
            </Link>
          ))}
        </div>

        {/* CTA Button */}
        <div className="hidden md:flex gap-3">
          <Link
            href="/admin/login"
            className="px-4 py-2 text-foreground hover:bg-muted rounded-lg transition-colors font-medium text-sm"
          >
            Admin
          </Link>
          <Link
            href="#contact"
            className="px-4 py-2 bg-accent text-accent-foreground rounded-lg hover:bg-accent/90 transition-colors font-medium text-sm"
          >
            Get In Touch
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden p-2 hover:bg-muted rounded-lg transition-colors"
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-border bg-card">
          <div className="px-4 py-4 space-y-3">
            {navItems.map(item => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className="block px-4 py-2 text-foreground hover:bg-muted rounded-lg transition-colors"
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="#contact"
              className="block px-4 py-2 bg-accent text-accent-foreground rounded-lg hover:bg-accent/90 transition-colors text-center font-medium"
            >
              Get In Touch
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
