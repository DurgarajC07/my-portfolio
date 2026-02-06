'use client';

import { Bell, User, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

export function Topbar() {
  const [profileOpen, setProfileOpen] = useState(false);

  return (
    <header className="fixed top-0 right-0 left-0 lg:left-64 h-16 bg-background border-b border-border z-20 flex items-center justify-between px-6">
      {/* Breadcrumbs placeholder */}
      <div className="hidden md:flex items-center gap-2 text-sm">
        <span className="text-muted-foreground">Dashboard</span>
        <span className="text-muted-foreground">/</span>
        <span className="text-foreground font-medium">Overview</span>
      </div>

      {/* Right side actions */}
      <div className="flex items-center gap-4 ml-auto">
        {/* Notifications */}
        <button className="relative p-2 hover:bg-muted rounded-lg transition-colors">
          <Bell size={20} />
          <span className="absolute top-1 right-1 w-2 h-2 bg-accent rounded-full" />
        </button>

        {/* Profile menu */}
        <div className="relative">
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center gap-3 px-3 py-2 hover:bg-muted rounded-lg transition-colors"
          >
            <div className="w-8 h-8 bg-gradient-to-br from-accent to-accent/60 rounded-full flex items-center justify-center">
              <User size={16} className="text-foreground" />
            </div>
            <span className="hidden sm:inline text-sm font-medium">Admin User</span>
            <ChevronDown size={16} className={cn('transition-transform', profileOpen && 'rotate-180')} />
          </button>

          {/* Dropdown */}
          {profileOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-card border border-border rounded-lg shadow-lg overflow-hidden">
              <div className="p-3 border-b border-border">
                <p className="text-sm font-medium">admin@portfolio.com</p>
              </div>
              <button className="w-full text-left px-4 py-2 hover:bg-muted transition-colors text-sm">
                Profile Settings
              </button>
              <button className="w-full text-left px-4 py-2 hover:bg-muted transition-colors text-sm border-t border-border text-red-500">
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
