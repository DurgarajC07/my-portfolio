'use client';

import { AdminLayout } from '@/components/admin/layout';
import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Loader2, Save, Settings as SettingsIcon } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function SettingsPage() {
  const { token } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  
  const [formData, setFormData] = useState({
    id: 0,
    site_name: '',
    site_description: '',
    contact_email: '',
    contact_phone: '',
    social_links: '',
    footer_text: '',
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const data = await api.settings.get() as any;
      if (data) {
        setFormData({
          id: data.id || 0,
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ type: '', text: '' });

    try {
      await api.settings.update(formData, token!);
      setMessage({ type: 'success', text: 'Settings updated successfully!' });
      
      await fetchSettings();
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'Failed to save' });
    } finally {
      setSaving(false);
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
      <div className="space-y-6 max-w-4xl">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
            <SettingsIcon size={32} />
            Site Settings
          </h1>
          <p className="text-muted-foreground mt-1">Manage your portfolio global settings</p>
        </div>

        {message.text && (
          <Alert variant={message.type === 'error' ? 'destructive' : 'default'}>
            <AlertDescription>{message.text}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-6 bg-card border border-border rounded-lg p-6">
          <div className="space-y-2">
            <Label htmlFor="site_name">Site Name *</Label>
            <Input
              id="site_name"
              value={formData.site_name}
              onChange={(e) => setFormData({ ...formData, site_name: e.target.value })}
              placeholder="My Portfolio"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="site_description">Site Description</Label>
            <Textarea
              id="site_description"
              value={formData.site_description}
              onChange={(e) => setFormData({ ...formData, site_description: e.target.value })}
              placeholder="Brief description of your portfolio"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="contact_email">Contact Email *</Label>
              <Input
                id="contact_email"
                type="email"
                value={formData.contact_email}
                onChange={(e) => setFormData({ ...formData, contact_email: e.target.value })}
                placeholder="your@email.com"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="contact_phone">Contact Phone</Label>
              <Input
                id="contact_phone"
                value={formData.contact_phone}
                onChange={(e) => setFormData({ ...formData, contact_phone: e.target.value })}
                placeholder="+1 234 567 8900"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="social_links">Social Links (JSON)</Label>
            <Textarea
              id="social_links"
              value={formData.social_links}
              onChange={(e) => setFormData({ ...formData, social_links: e.target.value })}
              placeholder='{"github": "url", "linkedin": "url", "twitter": "url"}'
              rows={4}
              className="font-mono text-sm"
            />
            <p className="text-xs text-muted-foreground">
              Format: {`{"github": "https://github.com/username", "linkedin": "https://linkedin.com/in/username"}`}
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="footer_text">Footer Text</Label>
            <Input
              id="footer_text"
              value={formData.footer_text}
              onChange={(e) => setFormData({ ...formData, footer_text: e.target.value })}
              placeholder="© 2024 Your Name. All rights reserved."
            />
          </div>

          <Button type="submit" disabled={saving} className="w-full">
            {saving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Settings
              </>
            )}
          </Button>
        </form>
      </div>
    </AdminLayout>
  );
}
