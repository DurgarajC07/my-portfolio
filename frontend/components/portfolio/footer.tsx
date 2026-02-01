'use client';

import { Github, Linkedin, Twitter, Mail } from 'lucide-react';
import Link from 'next/link';

interface FooterProps {
  settings: any;
}

export function Footer({ settings }: FooterProps) {
  const currentYear = new Date().getFullYear();
  const siteName = settings?.site_name || 'Portfolio';
  const contactEmail = settings?.contact_email || '';

  return (
    <footer className="bg-card border-t border-border">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Brand */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-foreground">{siteName}</h3>
            <p className="text-sm text-muted-foreground">
              {settings?.site_description || 'Building amazing digital experiences'}
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">Quick Links</h3>
            <nav className="flex flex-col space-y-2">
              <Link href="#home" className="text-sm text-muted-foreground hover:text-accent transition-colors">
                Home
              </Link>
              <Link href="#about" className="text-sm text-muted-foreground hover:text-accent transition-colors">
                About
              </Link>
              <Link href="#projects" className="text-sm text-muted-foreground hover:text-accent transition-colors">
                Projects
              </Link>
              <Link href="#blog" className="text-sm text-muted-foreground hover:text-accent transition-colors">
                Blog
              </Link>
              <Link href="#contact" className="text-sm text-muted-foreground hover:text-accent transition-colors">
                Contact
              </Link>
            </nav>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">Get In Touch</h3>
            {contactEmail && (
              <Link
                href={`mailto:${contactEmail}`}
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-accent transition-colors"
              >
                <Mail size={16} />
                {contactEmail}
              </Link>
            )}
            <div className="flex gap-4 pt-2">
              <Link
                href="https://github.com/DurgarajC07"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-background border border-border rounded-lg hover:bg-muted hover:text-accent transition-colors"
              >
                <Github size={18} />
              </Link>
              <Link
                href="https://www.linkedin.com/in/durgaraj-chauhan/"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-background border border-border rounded-lg hover:bg-muted hover:text-accent transition-colors"
              >
                <Linkedin size={18} />
              </Link>
              <Link
                href="https://twitter.com/Durgaraj07"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-background border border-border rounded-lg hover:bg-muted hover:text-accent transition-colors"
              >
                <Twitter size={18} />
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-8 border-t border-border text-center">
          <p className="text-sm text-muted-foreground">
            © {currentYear} {siteName}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
