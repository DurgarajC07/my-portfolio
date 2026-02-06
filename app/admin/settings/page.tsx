'use client';

import { AdminLayout } from '@/components/admin/layout';
import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, Save, Download, Upload, Database, Activity, FileJson } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function SettingsPage() {
  const { token } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  
  const [formData, setFormData] = useState({
    site_name: '',
    site_description: '',
    contact_email: '',
    contact_phone: '',
    social_links: '{}',
    footer_text: '',
  });

  const [backups, setBackups] = useState<any[]>([]);
  const [activityLogs, setActivityLogs] = useState<any[]>([]);
  const [stats, setStats] = useState<any>({});

  useEffect(() => {
    fetchSettings();
  }, []);

  useEffect(() => {
    if (token) {
      fetchBackups();
      fetchActivityLogs();
      fetchStats();
    }
  }, [token]);

  const fetchSettings = async () => {
    try {
      const data = await api.settings.get() as any;
      if (data) {
        setFormData({
          site_name: data.site_name || '',
          site_description: data.site_description || '',
          contact_email: data.contact_email || '',
          contact_phone: data.contact_phone || '',
          social_links: typeof data.social_links === 'string' 
            ? data.social_links 
            : JSON.stringify(data.social_links, null, 2),
          footer_text: data.footer_text || '',
        });
      }
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message });
    } finally {
      setLoading(false);
    }
  };

  const fetchBackups = async () => {
    try {
      const data = await api.settings.getBackups(token!);
      setBackups(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to fetch backups:', error);
    }
  };

  const fetchActivityLogs = async () => {
    try {
      const data = await api.settings.getActivityLogs(token!, 50);
      setActivityLogs(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to fetch activity logs:', error);
    }
  };

  const fetchStats = async () => {
    try {
      const data = await api.settings.getStats(token!);
      setStats(data || {});
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ type: '', text: '' });

    try {
      await api.settings.update(formData, token!);
      setMessage({ type: 'success', text: 'Settings saved successfully!' });
      fetchSettings();
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message });
    } finally {
      setSaving(false);
    }
  };

  const handleBackup = async () => {
    try {
      setSaving(true);
      await api.settings.backup(token!);
      setMessage({ type: 'success', text: 'Backup created successfully!' });
      fetchBackups();
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message });
    } finally {
      setSaving(false);
    }
  };

  const handleRestore = async (filename: string) => {
    if (!confirm(`Are you sure you want to restore from ${filename}? Current data will be replaced.`)) {
      return;
    }

    try {
      setSaving(true);
      await api.settings.restore(filename, token!);
      setMessage({ type: 'success', text: 'Database restored successfully!' });
      fetchSettings();
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message });
    } finally {
      setSaving(false);
    }
  };

  const handleExport = async () => {
    try {
      const data = await api.settings.exportData(token!);
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `portfolio-export-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      setMessage({ type: 'success', text: 'Data exported successfully!' });
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
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
        <div>
          <h1 className="text-3xl font-bold text-foreground">Settings</h1>
          <p className="text-muted-foreground mt-1">
            Manage your portfolio settings and data
          </p>
        </div>

        {message.text && (
          <Alert variant={message.type === 'error' ? 'destructive' : 'default'}>
            <AlertDescription>{message.text}</AlertDescription>
          </Alert>
        )}

        <Tabs defaultValue="general">
          <TabsList>
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="backup">Backup & Restore</TabsTrigger>
            <TabsTrigger value="activity">Activity Logs</TabsTrigger>
            <TabsTrigger value="stats">Statistics</TabsTrigger>
          </TabsList>

          <TabsContent value="general">
            <form onSubmit={handleSubmit} className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>General Settings</CardTitle>
                  <CardDescription>
                    Configure your portfolio site information
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Site Name *</Label>
                    <Input
                      value={formData.site_name}
                      onChange={(e) => setFormData({ ...formData, site_name: e.target.value })}
                      required
                    />
                  </div>

                  <div>
                    <Label>Site Description</Label>
                    <Textarea
                      value={formData.site_description}
                      onChange={(e) => setFormData({ ...formData, site_description: e.target.value })}
                      rows={3}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Contact Email</Label>
                      <Input
                        type="email"
                        value={formData.contact_email}
                        onChange={(e) => setFormData({ ...formData, contact_email: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label>Contact Phone</Label>
                      <Input
                        type="tel"
                        value={formData.contact_phone}
                        onChange={(e) => setFormData({ ...formData, contact_phone: e.target.value })}
                      />
                    </div>
                  </div>

                  <div>
                    <Label>Social Links (JSON)</Label>
                    <Textarea
                      value={formData.social_links}
                      onChange={(e) => setFormData({ ...formData, social_links: e.target.value })}
                      rows={6}
                      className="font-mono text-sm"
                      placeholder='{\n  "github": "https://github.com/username",\n  "linkedin": "https://linkedin.com/in/username"\n}'
                    />
                  </div>

                  <div>
                    <Label>Footer Text</Label>
                    <Input
                      value={formData.footer_text}
                      onChange={(e) => setFormData({ ...formData, footer_text: e.target.value })}
                      placeholder="© 2024 Your Name. All rights reserved."
                    />
                  </div>
                </CardContent>
              </Card>

              <div className="flex justify-end">
                <Button type="submit" disabled={saving}>
                  {saving ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4 mr-2" />
                  )}
                  Save Settings
                </Button>
              </div>
            </form>
          </TabsContent>

          <TabsContent value="backup">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Database className="h-5 w-5" />
                    Database Backup
                  </CardTitle>
                  <CardDescription>
                    Create and restore database backups
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-2">
                    <Button onClick={handleBackup} disabled={saving}>
                      <Database className="h-4 w-4 mr-2" />
                      Create Backup
                    </Button>
                    <Button onClick={handleExport} variant="outline">
                      <FileJson className="h-4 w-4 mr-2" />
                      Export Data
                    </Button>
                  </div>

                  <div className="border-t pt-4">
                    <h4 className="font-semibold mb-3">Available Backups</h4>
                    {backups.length === 0 ? (
                      <p className="text-muted-foreground text-sm">No backups available</p>
                    ) : (
                      <div className="space-y-2">
                        {backups.map((backup, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between p-3 border rounded-lg"
                          >
                            <div>
                              <p className="font-medium">{backup.filename || backup}</p>
                              {backup.created_at && (
                                <p className="text-sm text-muted-foreground">
                                  {formatDate(backup.created_at)}
                                </p>
                              )}
                            </div>
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleRestore(backup.filename || backup)}
                              >
                                <Upload className="h-4 w-4 mr-1" />
                                Restore
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="activity">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Activity Logs
                </CardTitle>
                <CardDescription>
                  Recent actions performed on your portfolio
                </CardDescription>
              </CardHeader>
              <CardContent>
                {activityLogs.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">
                    No activity logs available
                  </p>
                ) : (
                  <div className="space-y-2">
                    {activityLogs.map((log) => (
                      <div
                        key={log.id}
                        className="flex items-start justify-between p-3 border rounded-lg"
                      >
                        <div className="flex-1">
                          <p className="font-medium">{log.action}</p>
                          <p className="text-sm text-muted-foreground mt-1">
                            {log.description}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {formatDate(log.created_at)}
                          </p>
                        </div>
                        {log.user && (
                          <span className="text-xs px-2 py-1 bg-muted rounded">
                            {log.user}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="stats">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>Total Projects</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">{stats.total_projects || 0}</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>Total Blog Posts</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">{stats.total_blogs || 0}</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>Total Skills</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">{stats.total_skills || 0}</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>Contact Messages</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">{stats.total_messages || 0}</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
}
