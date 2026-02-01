'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

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
        <Link href="/" className="text-xl font-bold text-accent">
          Portfolio
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
            href="/login"
            className="px-4 py-2 text-foreground hover:bg-muted rounded-lg transition-colors font-medium text-sm"
          >
            Login
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
