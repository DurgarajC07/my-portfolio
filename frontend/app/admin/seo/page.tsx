'use client';

import { AdminLayout } from '@/components/admin/layout';
import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Loader2, Save, Plus, Edit, Trash2, Search, FileCode } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function SEOManagerPage() {
  const { token } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const [pages, setPages] = useState<any[]>([]);
  const [robotsTxt, setRobotsTxt] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPage, setEditingPage] = useState<any>(null);

  const [formData, setFormData] = useState({
    page_name: '',
    meta_title: '',
    meta_description: '',
    meta_keywords: '',
    og_title: '',
    og_description: '',
    og_image: '',
    og_type: 'website',
    twitter_card: 'summary_large_image',
    twitter_title: '',
    twitter_description: '',
    twitter_image: '',
    canonical_url: '',
    schema_markup: '',
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [pagesRes, robotsRes] = await Promise.allSettled([
        api.seo.getPages(),
        api.seo.getRobotsTxt(),
      ]);

      if (pagesRes.status === 'fulfilled') setPages(pagesRes.value);
      if (robotsRes.status === 'fulfilled') setRobotsTxt(robotsRes.value);
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (page: any) => {
    setEditingPage(page);
    setFormData({ ...page });
    setIsDialogOpen(true);
  };

  const handleNew = () => {
    setEditingPage(null);
    setFormData({
      page_name: '',
      meta_title: '',
      meta_description: '',
      meta_keywords: '',
      og_title: '',
      og_description: '',
      og_image: '',
      og_type: 'website',
      twitter_card: 'summary_large_image',
      twitter_title: '',
      twitter_description: '',
      twitter_image: '',
      canonical_url: '',
      schema_markup: '',
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ type: '', text: '' });

    try {
      if (editingPage) {
        await api.seo.updatePage(editingPage.page_name, formData, token!);
        setMessage({ type: 'success', text: 'SEO page updated successfully!' });
      } else {
        await api.seo.createPage(formData, token!);
        setMessage({ type: 'success', text: 'SEO page created successfully!' });
      }
      setIsDialogOpen(false);
      fetchData();
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (pageName: string) => {
    if (!confirm('Are you sure you want to delete this SEO page?')) return;

    try {
      await api.seo.deletePage(pageName, token!);
      setMessage({ type: 'success', text: 'SEO page deleted!' });
      fetchData();
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message });
    }
  };

  const handleSaveRobotsTxt = async () => {
    setSaving(true);
    try {
      await api.seo.updateRobotsTxt(robotsTxt, token!);
      setMessage({ type: 'success', text: 'robots.txt updated successfully!' });
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
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">SEO Manager</h1>
            <p className="text-muted-foreground mt-1">Optimize your portfolio for search engines</p>
          </div>
        </div>

        {message.text && (
          <Alert variant={message.type === 'error' ? 'destructive' : 'default'}>
            <AlertDescription>{message.text}</AlertDescription>
          </Alert>
        )}

        <Tabs defaultValue="pages">
          <TabsList>
            <TabsTrigger value="pages">SEO Pages</TabsTrigger>
            <TabsTrigger value="robots">Robots.txt</TabsTrigger>
            <TabsTrigger value="sitemap">Sitemap</TabsTrigger>
          </TabsList>

          <TabsContent value="pages" className="space-y-4">
            <div className="flex justify-end">
              <Button onClick={handleNew}>
                <Plus className="h-4 w-4 mr-2" />
                Add SEO Page
              </Button>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {pages.length === 0 ? (
                <Card>
                  <CardContent className="py-12 text-center text-muted-foreground">
                    No SEO pages configured yet. Click "Add SEO Page" to create one.
                  </CardContent>
                </Card>
              ) : (
                pages.map((page) => (
                  <Card key={page.page_name}>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-foreground">
                            {page.page_name}
                          </h3>
                          <p className="text-sm text-accent mt-1">{page.meta_title}</p>
                          <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                            {page.meta_description}
                          </p>
                          {page.meta_keywords && (
                            <div className="flex flex-wrap gap-2 mt-3">
                              {page.meta_keywords.split(',').map((keyword: string, i: number) => (
                                <span
                                  key={i}
                                  className="text-xs px-2 py-1 bg-muted rounded"
                                >
                                  {keyword.trim()}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(page)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(page.page_name)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="robots">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileCode className="h-5 w-5" />
                  robots.txt Editor
                </CardTitle>
                <CardDescription>
                  Configure crawler access to your portfolio
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  value={robotsTxt}
                  onChange={(e) => setRobotsTxt(e.target.value)}
                  rows={15}
                  className="font-mono text-sm"
                  placeholder="User-agent: *\nDisallow: /admin\nAllow: /"
                />
                <Button onClick={handleSaveRobotsTxt} disabled={saving}>
                  {saving ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4 mr-2" />
                  )}
                  Save robots.txt
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="sitemap">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Search className="h-5 w-5" />
                  Sitemap
                </CardTitle>
                <CardDescription>
                  Your sitemap is automatically generated
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Your sitemap is available at:{' '}
                  <a
                    href="/api/seo/sitemap.xml"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-accent hover:underline"
                  >
                    /api/seo/sitemap.xml
                  </a>
                </p>
                <p className="text-sm text-muted-foreground">
                  Submit this URL to search engines like Google Search Console and Bing Webmaster Tools.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingPage ? 'Edit' : 'Add'} SEO Page
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label>Page Name *</Label>
                <Input
                  value={formData.page_name}
                  onChange={(e) => setFormData({ ...formData, page_name: e.target.value })}
                  placeholder="home, about, blog"
                  required
                  disabled={!!editingPage}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Meta Title *</Label>
                  <Input
                    value={formData.meta_title}
                    onChange={(e) => setFormData({ ...formData, meta_title: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label>Meta Keywords</Label>
                  <Input
                    value={formData.meta_keywords}
                    onChange={(e) => setFormData({ ...formData, meta_keywords: e.target.value })}
                    placeholder="keyword1, keyword2"
                  />
                </div>
              </div>

              <div>
                <Label>Meta Description *</Label>
                <Textarea
                  value={formData.meta_description}
                  onChange={(e) => setFormData({ ...formData, meta_description: e.target.value })}
                  rows={3}
                  required
                />
              </div>

              <div className="border-t pt-4">
                <h4 className="font-semibold mb-3">Open Graph (Facebook)</h4>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>OG Title</Label>
                      <Input
                        value={formData.og_title}
                        onChange={(e) => setFormData({ ...formData, og_title: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label>OG Type</Label>
                      <Input
                        value={formData.og_type}
                        onChange={(e) => setFormData({ ...formData, og_type: e.target.value })}
                        placeholder="website, article"
                      />
                    </div>
                  </div>
                  <div>
                    <Label>OG Description</Label>
                    <Textarea
                      value={formData.og_description}
                      onChange={(e) => setFormData({ ...formData, og_description: e.target.value })}
                      rows={2}
                    />
                  </div>
                  <div>
                    <Label>OG Image URL</Label>
                    <Input
                      value={formData.og_image}
                      onChange={(e) => setFormData({ ...formData, og_image: e.target.value })}
                      placeholder="https://example.com/og-image.jpg"
                    />
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-semibold mb-3">Twitter Card</h4>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Twitter Title</Label>
                      <Input
                        value={formData.twitter_title}
                        onChange={(e) => setFormData({ ...formData, twitter_title: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label>Twitter Card</Label>
                      <Input
                        value={formData.twitter_card}
                        onChange={(e) => setFormData({ ...formData, twitter_card: e.target.value })}
                        placeholder="summary_large_image"
                      />
                    </div>
                  </div>
                  <div>
                    <Label>Twitter Description</Label>
                    <Textarea
                      value={formData.twitter_description}
                      onChange={(e) => setFormData({ ...formData, twitter_description: e.target.value })}
                      rows={2}
                    />
                  </div>
                  <div>
                    <Label>Twitter Image URL</Label>
                    <Input
                      value={formData.twitter_image}
                      onChange={(e) => setFormData({ ...formData, twitter_image: e.target.value })}
                      placeholder="https://example.com/twitter-image.jpg"
                    />
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <div>
                  <Label>Canonical URL</Label>
                  <Input
                    value={formData.canonical_url}
                    onChange={(e) => setFormData({ ...formData, canonical_url: e.target.value })}
                    placeholder="https://example.com/page"
                  />
                </div>
              </div>

              <div>
                <Label>Schema Markup (JSON-LD)</Label>
                <Textarea
                  value={formData.schema_markup}
                  onChange={(e) => setFormData({ ...formData, schema_markup: e.target.value })}
                  rows={5}
                  className="font-mono text-sm"
                  placeholder='{"@context": "https://schema.org", ...}'
                />
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={saving}>
                  {saving ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4 mr-2" />
                  )}
                  Save
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}
