'use client';

import { AdminLayout } from '@/components/admin/layout';
import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Save, RefreshCw, Palette } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ImageUpload } from '@/components/admin/image-upload';

export default function ThemeManagerPage() {
  const { token } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [googleFonts, setGoogleFonts] = useState<string[]>([]);

  const [themeData, setThemeData] = useState<any>({
    primary_color: '#3b82f6',
    secondary_color: '#8b5cf6',
    accent_color: '#10b981',
    font_primary: 'Inter',
    font_secondary: 'Inter',
    font_code: 'JetBrains Mono',
    dark_mode: true,
    custom_css: '',
    logo_url: '',
    favicon_url: '',
  });

  useEffect(() => {
    fetchData();
    fetchGoogleFonts();
  }, []);

  const fetchData = async () => {
    try {
      const theme = await api.theme.get();
      setThemeData(theme);
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message });
    } finally {
      setLoading(false);
    }
  };

  const fetchGoogleFonts = async () => {
    try {
      const response = await api.theme.getGoogleFonts();
      setGoogleFonts(response.fonts || []);
    } catch (error) {
      console.error('Failed to fetch Google Fonts:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ type: '', text: '' });

    try {
      await api.theme.update(themeData, token!);
      setMessage({ type: 'success', text: 'Theme settings saved successfully!' });
      fetchData();
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message });
    } finally {
      setSaving(false);
    }
  };

  const handleReset = async () => {
    if (!confirm('Are you sure you want to reset to default theme?')) return;

    try {
      setSaving(true);
      await api.theme.reset(token!);
      setMessage({ type: 'success', text: 'Theme reset to default!' });
      fetchData();
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message });
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
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Theme Manager</h1>
            <p className="text-muted-foreground mt-1">Customize your portfolio appearance</p>
          </div>
          <div className="flex gap-2">
            <Button type="button" variant="outline" onClick={handleReset} disabled={saving}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Reset to Default
            </Button>
            <Button type="submit" disabled={saving}>
              {saving ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              Save Changes
            </Button>
          </div>
        </div>

        {message.text && (
          <Alert variant={message.type === 'error' ? 'destructive' : 'default'}>
            <AlertDescription>{message.text}</AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Colors */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                Colors
              </CardTitle>
              <CardDescription>Configure your brand colors</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Primary Color</Label>
                <div className="flex gap-2 mt-1">
                  <Input
                    type="color"
                    value={themeData.primary_color || '#3b82f6'}
                    onChange={(e) => setThemeData({ ...themeData, primary_color: e.target.value })}
                    className="w-20 h-10 cursor-pointer"
                  />
                  <Input
                    type="text"
                    value={themeData.primary_color || '#3b82f6'}
                    onChange={(e) => setThemeData({ ...themeData, primary_color: e.target.value })}
                    className="flex-1"
                  />
                </div>
              </div>

              <div>
                <Label>Secondary Color</Label>
                <div className="flex gap-2 mt-1">
                  <Input
                    type="color"
                    value={themeData.secondary_color || '#8b5cf6'}
                    onChange={(e) => setThemeData({ ...themeData, secondary_color: e.target.value })}
                    className="w-20 h-10 cursor-pointer"
                  />
                  <Input
                    type="text"
                    value={themeData.secondary_color || '#8b5cf6'}
                    onChange={(e) => setThemeData({ ...themeData, secondary_color: e.target.value })}
                    className="flex-1"
                  />
                </div>
              </div>

              <div>
                <Label>Accent Color</Label>
                <div className="flex gap-2 mt-1">
                  <Input
                    type="color"
                    value={themeData.accent_color || '#10b981'}
                    onChange={(e) => setThemeData({ ...themeData, accent_color: e.target.value })}
                    className="w-20 h-10 cursor-pointer"
                  />
                  <Input
                    type="text"
                    value={themeData.accent_color || '#10b981'}
                    onChange={(e) => setThemeData({ ...themeData, accent_color: e.target.value })}
                    className="flex-1"
                  />
                </div>
              </div>

              <div className="pt-4">
                <div className="flex items-center gap-2">
                  <Switch
                    checked={themeData.dark_mode ?? true}
                    onCheckedChange={(checked) => setThemeData({ ...themeData, dark_mode: checked })}
                  />
                  <Label>Enable Dark Mode</Label>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Fonts */}
          <Card>
            <CardHeader>
              <CardTitle>Typography</CardTitle>
              <CardDescription>Select fonts for your portfolio</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Primary Font</Label>
                <Select
                  value={themeData.font_primary || 'Inter'}
                  onValueChange={(value) => setThemeData({ ...themeData, font_primary: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {googleFonts.map((font) => (
                      <SelectItem key={font} value={font}>
                        {font}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Secondary Font</Label>
                <Select
                  value={themeData.font_secondary || 'Inter'}
                  onValueChange={(value) => setThemeData({ ...themeData, font_secondary: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {googleFonts.map((font) => (
                      <SelectItem key={font} value={font}>
                        {font}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Code Font</Label>
                <Select
                  value={themeData.font_code || 'JetBrains Mono'}
                  onValueChange={(value) => setThemeData({ ...themeData, font_code: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="JetBrains Mono">JetBrains Mono</SelectItem>
                    <SelectItem value="Fira Code">Fira Code</SelectItem>
                    <SelectItem value="Source Code Pro">Source Code Pro</SelectItem>
                    <SelectItem value="Monaco">Monaco</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Branding */}
          <Card>
            <CardHeader>
              <CardTitle>Branding</CardTitle>
              <CardDescription>Logo and favicon URLs</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ImageUpload
                label="Logo"
                value={themeData.logo_url || ''}
                onChange={(url) => setThemeData({ ...themeData, logo_url: url })}
                category="assets"
              />

              <ImageUpload
                label="Favicon"
                value={themeData.favicon_url || ''}
                onChange={(url) => setThemeData({ ...themeData, favicon_url: url })}
                category="assets"
              />
            </CardContent>
          </Card>

          {/* Custom CSS */}
          <Card>
            <CardHeader>
              <CardTitle>Custom CSS</CardTitle>
              <CardDescription>Add custom styles (Advanced)</CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                value={themeData.custom_css || ''}
                onChange={(e) => setThemeData({ ...themeData, custom_css: e.target.value })}
                placeholder=".custom-class { color: red; }"
                rows={10}
                className="font-mono text-sm"
              />
            </CardContent>
          </Card>
        </div>

        {/* Color Preview */}
        <Card>
          <CardHeader>
            <CardTitle>Preview</CardTitle>
            <CardDescription>See how your colors look</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <div
                  className="h-20 rounded-lg flex items-center justify-center text-white font-semibold"
                  style={{ backgroundColor: themeData.primary_color }}
                >
                  Primary
                </div>
                <p className="text-sm text-center text-muted-foreground">{themeData.primary_color}</p>
              </div>
              <div className="space-y-2">
                <div
                  className="h-20 rounded-lg flex items-center justify-center text-white font-semibold"
                  style={{ backgroundColor: themeData.secondary_color }}
                >
                  Secondary
                </div>
                <p className="text-sm text-center text-muted-foreground">{themeData.secondary_color}</p>
              </div>
              <div className="space-y-2">
                <div
                  className="h-20 rounded-lg flex items-center justify-center text-white font-semibold"
                  style={{ backgroundColor: themeData.accent_color }}
                >
                  Accent
                </div>
                <p className="text-sm text-center text-muted-foreground">{themeData.accent_color}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </form>
    </AdminLayout>
  );
}
