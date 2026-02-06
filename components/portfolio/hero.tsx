'use client';

import { ArrowRight, Github, Linkedin, Twitter } from 'lucide-react';
import Link from 'next/link';

interface HeroProps {
  data: any;
}

export function Hero({ data }: HeroProps) {
  if (!data) return null;

  const socialLinks = data.social_links ? JSON.parse(data.social_links) : {};

  return (
    <section id="home" className="min-h-[calc(100vh-64px)] flex items-center justify-center pt-20">
      <div className="max-w-4xl mx-auto px-4 text-center space-y-8">
        {/* Badge */}
        <div className="inline-block px-4 py-2 bg-accent/10 text-accent rounded-full text-sm font-medium">
          Welcome to my portfolio
        </div>

        {/* Main Heading */}
        <div className="space-y-4">
          <h1 className="text-5xl md:text-7xl font-bold text-foreground text-balance">
            {data.title}
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto text-balance">
            {data.subtitle}
          </p>
          {data.description && (
            <p className="text-lg text-muted-foreground/80 max-w-3xl mx-auto text-balance pt-2">
              {data.description}
            </p>
          )}
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          <Link
            href={data.cta_link || "#projects"}
            className="px-8 py-3 bg-accent text-accent-foreground rounded-lg hover:bg-accent/90 transition-colors font-semibold flex items-center justify-center gap-2 group"
          >
            {data.cta_text || "View My Work"}
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            href="#contact"
            className="px-8 py-3 border border-border text-foreground rounded-lg hover:bg-muted transition-colors font-semibold"
          >
            Get In Touch
          </Link>
        </div>

        {/* Social Links */}
        <div className="flex items-center justify-center gap-6 pt-8">
          {socialLinks.github && (
            <Link
              href={socialLinks.github}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 bg-card border border-border rounded-full hover:bg-muted hover:text-accent transition-colors"
              title="GitHub"
            >
              <Github size={20} />
            </Link>
          )}
          {socialLinks.linkedin && (
            <Link
              href={socialLinks.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 bg-card border border-border rounded-full hover:bg-muted hover:text-accent transition-colors"
              title="LinkedIn"
            >
              <Linkedin size={20} />
            </Link>
          )}
          {socialLinks.twitter && (
            <Link
              href={socialLinks.twitter}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 bg-card border border-border rounded-full hover:bg-muted hover:text-accent transition-colors"
              title="Twitter"
            >
              <Twitter size={20} />
            </Link>
          )}
        </div>

        {/* Scroll Indicator */}
        <div className="pt-12 animate-bounce">
          <div className="w-6 h-10 border-2 border-accent rounded-full flex items-center justify-center mx-auto">
            <div className="w-1 h-2 bg-accent rounded-full" />
          </div>
        </div>
      </div>
    </section>
  );
}
