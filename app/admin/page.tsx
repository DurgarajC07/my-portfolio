'use client';

import { AdminLayout } from '@/components/admin/layout';
import { StatsCard } from '@/components/admin/stats-card';
import { VisitorsChart } from '@/components/admin/visitors-chart';
import { Users, FileText, Eye, Zap, Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { api } from '@/lib/api';

export default function DashboardPage() {
  const { token } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalProjects: 0,
    totalBlogs: 0,
    totalSkills: 0,
    totalExperience: 0,
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [projects, blogs, skills, experience] = await Promise.allSettled([
        api.projects.getAll(),
        api.blog.getAll(),
        api.skills.getAll(),
        api.experience.getAll(),
      ]);

      setStats({
        totalProjects: projects.status === 'fulfilled' ? projects.value.length : 0,
        totalBlogs: blogs.status === 'fulfilled' ? blogs.value.length : 0,
        totalSkills: skills.status === 'fulfilled' ? skills.value.length : 0,
        totalExperience: experience.status === 'fulfilled' ? experience.value.length : 0,
      });
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-accent" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Welcome back! Here's your portfolio performance.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            label="Total Projects"
            value={stats.totalProjects.toString()}
            change={0}
            icon={Users}
            color="blue"
          />
          <StatsCard
            label="Total Blog Posts"
            value={stats.totalBlogs.toString()}
            change={0}
            icon={FileText}
            color="purple"
          />
          <StatsCard
            label="Total Skills"
            value={stats.totalSkills.toString()}
            change={0}
            icon={Eye}
            color="green"
          />
          <StatsCard
            label="Experience Entries"
            value={stats.totalExperience.toString()}
            change={0}
            icon={Zap}
            color="orange"
          />
        </div>

        {/* Charts and Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <VisitorsChart />
          </div>

          {/* Quick Actions */}
          <div className="bg-card border border-border rounded-lg p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <button className="w-full px-4 py-2 bg-accent text-accent-foreground rounded-md hover:bg-accent/90 transition-colors font-medium text-sm">
                + New Blog Post
              </button>
              <button className="w-full px-4 py-2 border border-border text-foreground rounded-md hover:bg-muted transition-colors font-medium text-sm">
                + New Project
              </button>
              <button className="w-full px-4 py-2 border border-border text-foreground rounded-md hover:bg-muted transition-colors font-medium text-sm">
                Edit Hero Section
              </button>
              <button className="w-full px-4 py-2 border border-border text-foreground rounded-md hover:bg-muted transition-colors font-medium text-sm">
                Manage SEO
              </button>
            </div>
          </div>
        </div>

        {/* Recent Updates */}
        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Recent Updates</h3>
          <div className="space-y-3">
            {[
              { title: 'Portfolio Updated', time: '2 hours ago' },
              { title: 'New Blog Post Published', time: '5 hours ago' },
              { title: 'SEO Score Improved', time: 'Yesterday' },
              { title: 'New Visitor Message', time: '2 days ago' },
            ].map((update, i) => (
              <div key={i} className="flex items-start justify-between pb-3 border-b border-border last:border-0">
                <div>
                  <p className="font-medium text-foreground text-sm">{update.title}</p>
                  <p className="text-xs text-muted-foreground">{update.time}</p>
                </div>
                <div className="w-2 h-2 bg-accent rounded-full mt-2" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
