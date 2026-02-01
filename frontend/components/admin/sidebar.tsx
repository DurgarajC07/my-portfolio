'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  FileText,
  Settings,
  PaletteIcon,
  Search,
  Layers,
  BookOpen,
  GripVertical,
  Lock,
  LogOut,
  Menu,
  X,
} from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/auth-context';

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/admin' },
  { icon: Layers, label: 'Content Manager', href: '/admin/content' },
  { icon: BookOpen, label: 'Blog Editor', href: '/admin/blog' },
  { icon: Search, label: 'SEO Manager', href: '/admin/seo' },
  { icon: PaletteIcon, label: 'Theme Manager', href: '/admin/theme' },
  { icon: FileText, label: 'Resume Manager', href: '/admin/resume' },
  { icon: Settings, label: 'Settings', href: '/admin/settings' },
];

export function Sidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const { logout, user } = useAuth();

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed top-4 left-4 z-40 lg:hidden p-2 hover:bg-muted rounded-md"
      >
        {open ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed top-0 left-0 h-screen bg-sidebar text-sidebar-foreground border-r border-sidebar-border transition-transform duration-300 z-30',
          'w-64 lg:translate-x-0',
          open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        <div className="p-6 border-b border-sidebar-border">
          <h1 className="text-2xl font-bold text-sidebar-primary">Portfolio CMS</h1>
          <p className="text-sm text-sidebar-foreground/60 mt-1">Admin Panel</p>
        </div>

        <nav className="p-4 space-y-1 overflow-y-auto h-[calc(100vh-140px)]">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={cn(
                  'flex items-center gap-3 px-4 py-2.5 rounded-md transition-colors duration-200',
                  isActive
                    ? 'bg-sidebar-accent text-sidebar-accent-foreground font-medium'
                    : 'text-sidebar-foreground hover:bg-sidebar-accent/10'
                )}
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-sidebar-border space-y-2">
          {user && (
            <div className="px-4 py-2 text-sm text-sidebar-foreground/60">
              Logged in as <strong>{user.username}</strong>
            </div>
          )}
          <button 
            onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-2 text-red-500 hover:bg-red-500/10 rounded-md transition-colors"
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {open && (
        <div
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}
    </>
  );
}
