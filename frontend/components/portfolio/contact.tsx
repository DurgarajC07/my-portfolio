'use client';

import React from "react"

import { Mail, Linkedin, Github, Twitter, Send } from 'lucide-react';
import { useState } from 'react';

export function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { api } = await import('@/lib/api');
      await api.contact.submit({
        name: formData.name,
        email: formData.email,
        subject: 'Contact Form Submission',
        message: formData.message
      });
      setSubmitted(true);
      setTimeout(() => {
        setFormData({ name: '', email: '', message: '' });
        setSubmitted(false);
      }, 3000);
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  return (
    <section id="contact" className="py-20">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-foreground mb-4">Let's Work Together</h2>
          <p className="text-lg text-muted-foreground">
            Have a project in mind? I'd love to hear about it. Send me a message and I'll get back to you as soon as possible.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="bg-card border border-border rounded-lg p-8">
            <h3 className="text-2xl font-semibold text-foreground mb-6">Send me a message</h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 bg-input border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                  placeholder="Your name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 bg-input border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                  placeholder="your@email.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Message
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  className="w-full px-4 py-2 bg-input border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                  placeholder="Your message here..."
                />
              </div>

              <button
                type="submit"
                disabled={submitted}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-accent text-accent-foreground rounded-lg hover:bg-accent/90 disabled:opacity-50 transition-all font-semibold group"
              >
                <Send size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                {submitted ? 'Message Sent!' : 'Send Message'}
              </button>

              {submitted && (
                <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-lg text-green-600 dark:text-green-400 text-sm">
                  Thank you! I'll get back to you soon.
                </div>
              )}
            </form>
          </div>

          {/* Contact Info */}
          <div className="space-y-8">
            {/* Email */}
            <div className="bg-card border border-border rounded-lg p-6 hover:border-accent/50 transition-colors">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-accent/10 rounded-lg">
                  <Mail className="text-accent" size={24} />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Email</h3>
                  <p className="text-muted-foreground text-sm mb-3">hello@example.com</p>
                  <p className="text-xs text-muted-foreground">I typically respond within 24 hours</p>
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div className="space-y-3">
              <h3 className="font-semibold text-foreground">Connect with me</h3>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { icon: Github, label: 'GitHub', url: '#' },
                  { icon: Linkedin, label: 'LinkedIn', url: '#' },
                  { icon: Twitter, label: 'Twitter', url: '#' },
                  { icon: Mail, label: 'Email', url: '#' },
                ].map((social, i) => {
                  const Icon = social.icon;
                  return (
                    <a
                      key={i}
                      href={social.url}
                      className="flex items-center gap-2 p-3 bg-card border border-border rounded-lg hover:bg-muted hover:text-accent transition-colors font-medium text-sm"
                    >
                      <Icon size={18} />
                      {social.label}
                    </a>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
