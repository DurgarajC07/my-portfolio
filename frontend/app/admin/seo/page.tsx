'use client';

import { AdminLayout } from '@/components/admin/layout';
import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, Save, Search } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function SEOManagerPage() {
  const { token } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [seoPages, setSeoPages] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState('home');

  useEffect(() => {
    fetchSEOData();
  }, []);

  const fetchSEOData = async () => {
    try {
      const data = await api.seo.getPages() as any[];
      setSeoPages(data || []);
      
      // Set the first page as active if available
      if (data && data.length > 0) {
        setActiveTab(data[0].page_name);
      }
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (page: any) => {
    setSaving(true);
    setMessage({ type: '', text: '' });

    try {
      if (page.id) {
        await api.seo.updatePage(page.page_name, page, token!);
        setMessage({ type: 'success', text: `SEO for ${page.page_name} updated!` });
      } else {
        await api.seo.createPage(page, token!);
        setMessage({ type: 'success', text: `SEO for ${page.page_name} created!` });
      }
      await fetchSEOData();
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message });
    } finally {
      setSaving(false);
    }
  };

  const handleFieldChange = (pageName: string, field: string, value: string) => {
    setSeoPages(seoPages.map(page => 
      page.page_name === pageName ? { ...page, [field]: value } : page
    ));
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
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
            <Search size={32} />
            SEO Manager
          </h1>
          <p className="text-muted-foreground mt-1">Optimize your portfolio for search engines</p>
        </div>

        {message.text && (
          <Alert variant={message.type === 'error' ? 'destructive' : 'default'}>
            <AlertDescription>{message.text}</AlertDescription>
          </Alert>
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            {seoPages.map(page => (
              <TabsTrigger key={page.page_name} value={page.page_name} className="capitalize">
                {page.page_name}
              </TabsTrigger>
            ))}
          </TabsList>

          {seoPages.map(page => (
            <TabsContent key={page.page_name} value={page.page_name}>
              <form onSubmit={(e) => { e.preventDefault(); handleSave(page); }} className="space-y-4 bg-card border border-border rounded-lg p-6">
                <div className="space-y-2">
                  <Label htmlFor={`${page.page_name}_title`}>Meta Title *</Label>
                  <Input
                    id={`${page.page_name}_title`}
                    value={page.meta_title || ''}
                    onChange={(e) => handleFieldChange(page.page_name, 'meta_title', e.target.value)}
                    placeholder="Page Title | Your Portfolio"
                    required
                  />
                  <p className="text-xs text-muted-foreground">{page.meta_title?.length || 0}/60 characters</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`${page.page_name}_description`}>Meta Description *</Label>
                  <Textarea
                    id={`${page.page_name}_description`}
                    value={page.meta_description || ''}
                    onChange={(e) => handleFieldChange(page.page_name, 'meta_description', e.target.value)}
                    placeholder="A brief description of this page"
                    rows={3}
                    required
                  />
                  <p className="text-xs text-muted-foreground">{page.meta_description?.length || 0}/160 characters</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`${page.page_name}_keywords`}>Keywords (comma-separated)</Label>
                  <Input
                    id={`${page.page_name}_keywords`}
                    value={page.keywords || ''}
                    onChange={(e) => handleFieldChange(page.page_name, 'keywords', e.target.value)}
                    placeholder="portfolio, web developer, react, javascript"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`${page.page_name}_og_title`}>Open Graph Title</Label>
                  <Input
                    id={`${page.page_name}_og_title`}
                    value={page.og_title || ''}
                    onChange={(e) => handleFieldChange(page.page_name, 'og_title', e.target.value)}
                    placeholder="Title for social media shares"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`${page.page_name}_og_description`}>Open Graph Description</Label>
                  <Textarea
                    id={`${page.page_name}_og_description`}
                    value={page.og_description || ''}
                    onChange={(e) => handleFieldChange(page.page_name, 'og_description', e.target.value)}
                    placeholder="Description for social media shares"
                    rows={2}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`${page.page_name}_og_image`}>Open Graph Image URL</Label>
                  <Input
                    id={`${page.page_name}_og_image`}
                    value={page.og_image || ''}
                    onChange={(e) => handleFieldChange(page.page_name, 'og_image', e.target.value)}
                    placeholder="/og-image.jpg"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`${page.page_name}_canonical_url`}>Canonical URL</Label>
                  <Input
                    id={`${page.page_name}_canonical_url`}
                    value={page.canonical_url || ''}
                    onChange={(e) => handleFieldChange(page.page_name, 'canonical_url', e.target.value)}
                    placeholder="https://yourportfolio.com/page"
                  />
                </div>

                <Button type="submit" disabled={saving}>
                  {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                  Save SEO Settings
                </Button>
              </form>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </AdminLayout>
  );
}
