import React from "react"
import { Sidebar } from './sidebar';
import { Topbar } from './topbar';
import { AuthGuard } from './auth-guard';

export function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <div className="min-h-screen bg-background dark:bg-background">
        <Sidebar />
        <Topbar />
        <main className="lg:ml-64 mt-16 p-4 md:p-6">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </AuthGuard>
  );
}
