'use client';

import { AdminLayout } from '@/components/admin/layout';
import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Save, Plus, Edit, Trash2, GripVertical } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function ContentManagerPage() {
  const { token } = useAuth();
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [activeTab, setActiveTab] = useState('hero');

  // Data states
  const [heroData, setHeroData] = useState<any[]>([]);
  const [aboutData, setAboutData] = useState<any[]>([]);
  const [skillsData, setSkillsData] = useState<any[]>([]);
  const [projectsData, setProjectsData] = useState<any[]>([]);
  const [experienceData, setExperienceData] = useState<any[]>([]);
  const [educationData, setEducationData] = useState<any[]>([]);
  const [testimonialsData, setTestimonialsData] = useState<any[]>([]);
  const [servicesData, setServicesData] = useState<any[]>([]);

  // Dialog states
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentSection, setCurrentSection] = useState('');
  const [editingItem, setEditingItem] = useState<any>(null);
  const [formData, setFormData] = useState<any>({});

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const [hero, about, skills, projects, experience, education, testimonials, services] =
        await Promise.allSettled([
          api.hero.getAll(),
          api.about.getAll(),
          api.skills.getAll(),
          api.projects.getAll(),
          api.experience.getAll(),
          api.education.getAll(),
          api.testimonials.getAll(),
          api.services.getAll(),
        ]);

      setHeroData(hero.status === 'fulfilled' ? (hero.value as any[]) : []);
      setAboutData(about.status === 'fulfilled' ? (about.value as any[]) : []);
      setSkillsData(skills.status === 'fulfilled' ? (skills.value as any[]) : []);
      setProjectsData(projects.status === 'fulfilled' ? (projects.value as any[]) : []);
      setExperienceData(experience.status === 'fulfilled' ? (experience.value as any[]) : []);
      setEducationData(education.status === 'fulfilled' ? (education.value as any[]) : []);
      setTestimonialsData(testimonials.status === 'fulfilled' ? (testimonials.value as any[]) : []);
      setServicesData(services.status === 'fulfilled' ? (services.value as any[]) : []);
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (section: string, item: any) => {
    setCurrentSection(section);
    setEditingItem(item);
    setFormData({ ...item });
    setIsDialogOpen(true);
  };

  const handleNew = (section: string) => {
    setCurrentSection(section);
    setEditingItem(null);
    setFormData(getDefaultFormData(section));
    setIsDialogOpen(true);
  };

  const getDefaultFormData = (section: string) => {
    const defaults: any = {
      hero: {
        title: '',
        subtitle: '',
        description: '',
        cta_text: 'View My Work',
        cta_link: '#projects',
        background_type: 'color',
        background_value: '#000000',
        social_links: '{}',
        visible: true,
        order_index: 0,
      },
      about: {
        title: 'About Me',
        description: '',
        image_url: '',
        location: '',
        stats: '{}',
        visible: true,
        order_index: 0,
      },
      skills: {
        category: 'Frontend',
        name: '',
        level: 80,
        icon: '',
        visible: true,
        order_index: 0,
      },
      projects: {
        title: '',
        description: '',
        long_description: '',
        image_url: '',
        tags: '',
        github_url: '',
        live_url: '',
        featured: false,
        visible: true,
        order_index: 0,
      },
      experience: {
        company: '',
        title: '',
        description: '',
        technologies: '',
        start_date: '',
        end_date: '',
        location: '',
        current: false,
        visible: true,
        order_index: 0,
      },
      education: {
        institution: '',
        degree: '',
        description: '',
        start_date: '',
        end_date: '',
        location: '',
        grade: '',
        visible: true,
        order_index: 0,
      },
      testimonials: {
        name: '',
        role: '',
        company: '',
        content: '',
        image_url: '',
        rating: 5,
        visible: true,
        order_index: 0,
      },
      services: {
        title: '',
        description: '',
        icon: '',
        features: '[]',
        visible: true,
        order_index: 0,
      },
    };
    return defaults[section] || {};
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });

    try {
      const apiMap: any = {
        hero: api.hero,
        about: api.about,
        skills: api.skills,
        projects: api.projects,
        experience: api.experience,
        education: api.education,
        testimonials: api.testimonials,
        services: api.services,
      };

      const apiEndpoint = apiMap[currentSection];

      if (editingItem) {
        await apiEndpoint.update(editingItem.id, formData, token!);
        setMessage({ type: 'success', text: 'Updated successfully!' });
      } else {
        await apiEndpoint.create(formData, token!);
        setMessage({ type: 'success', text: 'Created successfully!' });
      }

      setIsDialogOpen(false);
      fetchAllData();
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message });
    }
  };

  const handleDelete = async (section: string, id: number) => {
    if (!confirm('Are you sure you want to delete this item?')) return;

    try {
      const apiMap: any = {
        hero: api.hero,
        about: api.about,
        skills: api.skills,
        projects: api.projects,
        experience: api.experience,
        education: api.education,
        testimonials: api.testimonials,
        services: api.services,
      };

      await apiMap[section].delete(id, token!);
      setMessage({ type: 'success', text: 'Deleted successfully!' });
      fetchAllData();
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message });
    }
  };

  const renderFormFields = () => {
    const fields: any = {
      hero: (
        <>
          <div className="space-y-2">
            <Label className="text-sm font-medium">Title *</Label>
            <Input
              value={formData.title || ''}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-medium">Subtitle</Label>
            <Input
              value={formData.subtitle || ''}
              onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-medium">Description</Label>
            <Textarea
              value={formData.description || ''}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium">CTA Text</Label>
              <Input
                value={formData.cta_text || ''}
                onChange={(e) => setFormData({ ...formData, cta_text: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium">CTA Link</Label>
              <Input
                value={formData.cta_link || ''}
                onChange={(e) => setFormData({ ...formData, cta_link: e.target.value })}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-medium">Social Links (JSON)</Label>
            <Textarea
              value={formData.social_links || '{}'}
              onChange={(e) => setFormData({ ...formData, social_links: e.target.value })}
              placeholder='{"github": "url", "linkedin": "url"}'
              rows={3}
            />
          </div>
          <div className="flex items-center gap-2 pt-2">
            <Switch
              checked={formData.visible ?? true}
              onCheckedChange={(checked) => setFormData({ ...formData, visible: checked })}
            />
            <Label className="text-sm font-medium">Visible</Label>
          </div>
        </>
      ),
      about: (
        <>
          <div className="space-y-2">
            <Label className="text-sm font-medium">Title</Label>
            <Input
              value={formData.title || ''}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-medium">Description *</Label>
            <Textarea
              value={formData.description || ''}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={6}
              required
            />
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-medium">Image URL</Label>
            <Input
              value={formData.image_url || ''}
              onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-medium">Location</Label>
            <Input
              value={formData.location || ''}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-medium">Stats (JSON)</Label>
            <Textarea
              value={formData.stats || '{}'}
              onChange={(e) => setFormData({ ...formData, stats: e.target.value })}
              placeholder='{"experience": "5+ Years", "projects": "50+"}'
              rows={3}
            />
          </div>
          <div className="flex items-center gap-2 pt-2">
            <Switch
              checked={formData.visible ?? true}
              onCheckedChange={(checked) => setFormData({ ...formData, visible: checked })}
            />
            <Label className="text-sm font-medium">Visible</Label>
          </div>
        </>
      ),
      skills: (
        <>
          <div className="space-y-2">
            <Label className="text-sm font-medium">Category *</Label>
            <Input
              value={formData.category || ''}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              placeholder="Frontend, Backend, Tools"
              required
            />
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-medium">Name *</Label>
            <Input
              value={formData.name || ''}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-medium">Level (0-100)</Label>
            <Input
              type="number"
              min="0"
              max="100"
              value={formData.level || 80}
              onChange={(e) => setFormData({ ...formData, level: parseInt(e.target.value) })}
            />
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-medium">Icon</Label>
            <Input
              value={formData.icon || ''}
              onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
              placeholder="Icon name or URL"
            />
          </div>
          <div className="flex items-center gap-2 pt-2">
            <Switch
              checked={formData.visible ?? true}
              onCheckedChange={(checked) => setFormData({ ...formData, visible: checked })}
            />
            <Label className="text-sm font-medium">Visible</Label>
          </div>
        </>
      ),
      projects: (
        <>
          <div className="space-y-2">
            <Label className="text-sm font-medium">Title *</Label>
            <Input
              value={formData.title || ''}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-medium">Description *</Label>
            <Textarea
              value={formData.description || ''}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              required
            />
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-medium">Long Description</Label>
            <Textarea
              value={formData.long_description || ''}
              onChange={(e) => setFormData({ ...formData, long_description: e.target.value })}
              rows={4}
            />
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-medium">Image URL</Label>
            <Input
              value={formData.image_url || ''}
              onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-medium">Tags (comma-separated)</Label>
            <Input
              value={formData.tags || ''}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              placeholder="React, Node.js, MongoDB"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium">GitHub URL</Label>
              <Input
                value={formData.github_url || ''}
                onChange={(e) => setFormData({ ...formData, github_url: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium">Live URL</Label>
              <Input
                value={formData.live_url || ''}
                onChange={(e) => setFormData({ ...formData, live_url: e.target.value })}
              />
            </div>
          </div>
          <div className="flex items-center gap-4 pt-2">
            <div className="flex items-center gap-2">
              <Switch
                checked={formData.featured ?? false}
                onCheckedChange={(checked) => setFormData({ ...formData, featured: checked })}
              />
              <Label className="text-sm font-medium">Featured</Label>
            </div>
            <div className="flex items-center gap-2">
              <Switch
                checked={formData.visible ?? true}
                onCheckedChange={(checked) => setFormData({ ...formData, visible: checked })}
              />
              <Label className="text-sm font-medium">Visible</Label>
            </div>
          </div>
        </>
      ),
      experience: (
        <>
          <div className="space-y-2">
            <Label className="text-sm font-medium">Company *</Label>
            <Input
              value={formData.company || ''}
              onChange={(e) => setFormData({ ...formData, company: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-medium">Title *</Label>
            <Input
              value={formData.title || ''}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-medium">Description</Label>
            <Textarea
              value={formData.description || ''}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
            />
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-medium">Technologies (comma-separated)</Label>
            <Input
              value={formData.technologies || ''}
              onChange={(e) => setFormData({ ...formData, technologies: e.target.value })}
              placeholder="React, Node.js, TypeScript"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium">Start Date</Label>
              <Input
                type="date"
                value={formData.start_date?.split('T')[0] || ''}
                onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium">End Date</Label>
              <Input
                type="date"
                value={formData.end_date?.split('T')[0] || ''}
                onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                disabled={formData.current}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-medium">Location</Label>
            <Input
              value={formData.location || ''}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            />
          </div>
          <div className="flex items-center gap-4 pt-2">
            <div className="flex items-center gap-2">
              <Switch
                checked={formData.current ?? false}
                onCheckedChange={(checked) => setFormData({ ...formData, current: checked })}
              />
              <Label className="text-sm font-medium">Current Position</Label>
            </div>
            <div className="flex items-center gap-2">
              <Switch
                checked={formData.visible ?? true}
                onCheckedChange={(checked) => setFormData({ ...formData, visible: checked })}
              />
              <Label className="text-sm font-medium">Visible</Label>
            </div>
          </div>
        </>
      ),
      education: (
        <>
          <div className="space-y-2">
            <Label className="text-sm font-medium">Institution *</Label>
            <Input
              value={formData.institution || ''}
              onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-medium">Degree *</Label>
            <Input
              value={formData.degree || ''}
              onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-medium">Description</Label>
            <Textarea
              value={formData.description || ''}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium">Start Date</Label>
              <Input
                type="date"
                value={formData.start_date?.split('T')[0] || ''}
                onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium">End Date</Label>
              <Input
                type="date"
                value={formData.end_date?.split('T')[0] || ''}
                onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium">Location</Label>
              <Input
                value={formData.location || ''}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium">Grade/GPA</Label>
              <Input
                value={formData.grade || ''}
                onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
              />
            </div>
          </div>
          <div className="flex items-center gap-2 pt-2">
            <Switch
              checked={formData.visible ?? true}
              onCheckedChange={(checked) => setFormData({ ...formData, visible: checked })}
            />
            <Label className="text-sm font-medium">Visible</Label>
          </div>
        </>
      ),
      testimonials: (
        <>
          <div className="space-y-2">
            <Label className="text-sm font-medium">Name *</Label>
            <Input
              value={formData.name || ''}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-medium">Role *</Label>
            <Input
              value={formData.role || ''}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-medium">Company</Label>
            <Input
              value={formData.company || ''}
              onChange={(e) => setFormData({ ...formData, company: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-medium">Content *</Label>
            <Textarea
              value={formData.content || ''}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              rows={4}
              required
            />
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-medium">Image URL</Label>
            <Input
              value={formData.image_url || ''}
              onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-medium">Rating (1-5)</Label>
            <Input
              type="number"
              min="1"
              max="5"
              value={formData.rating || 5}
              onChange={(e) => setFormData({ ...formData, rating: parseInt(e.target.value) })}
            />
          </div>
          <div className="flex items-center gap-2 pt-2">
            <Switch
              checked={formData.visible ?? true}
              onCheckedChange={(checked) => setFormData({ ...formData, visible: checked })}
            />
            <Label className="text-sm font-medium">Visible</Label>
          </div>
        </>
      ),
      services: (
        <>
          <div className="space-y-2">
            <Label className="text-sm font-medium">Title *</Label>
            <Input
              value={formData.title || ''}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-medium">Description *</Label>
            <Textarea
              value={formData.description || ''}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              required
            />
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-medium">Icon</Label>
            <Input
              value={formData.icon || ''}
              onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
              placeholder="Icon name or URL"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-medium">Features (JSON Array)</Label>
            <Textarea
              value={formData.features || '[]'}
              onChange={(e) => setFormData({ ...formData, features: e.target.value })}
              placeholder='["Feature 1", "Feature 2", "Feature 3"]'
              rows={4}
            />
          </div>
          <div className="flex items-center gap-2 pt-2">
            <Switch
              checked={formData.visible ?? true}
              onCheckedChange={(checked) => setFormData({ ...formData, visible: checked })}
            />
            <Label className="text-sm font-medium">Visible</Label>
          </div>
        </>
      ),
    };

    return fields[currentSection] || null;
  };

  const renderSection = (section: string, data: any[], title: string) => (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>{title}</CardTitle>
            <CardDescription>Manage your {title.toLowerCase()} content</CardDescription>
          </div>
          <Button onClick={() => handleNew(section)}>
            <Plus className="h-4 w-4 mr-2" />
            Add New
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {data.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              No {title.toLowerCase()} yet. Click "Add New" to create one.
            </p>
          ) : (
            data.map((item) => (
              <Card key={item.id}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-semibold">
                        {item.title || item.name || item.company || item.institution}
                      </h4>
                      <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                        {item.subtitle || item.description || item.content || item.role}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        {item.visible !== undefined && (
                          <span
                            className={`text-xs px-2 py-1 rounded ${
                              item.visible ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                            }`}
                          >
                            {item.visible ? 'Visible' : 'Hidden'}
                          </span>
                        )}
                        {item.featured && (
                          <span className="text-xs px-2 py-1 rounded bg-yellow-100 text-yellow-700">
                            Featured
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleEdit(section, item)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(section, item.id)}
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
      </CardContent>
    </Card>
  );

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
          <h1 className="text-3xl font-bold text-foreground">Content Manager</h1>
          <p className="text-muted-foreground mt-1">Manage all your portfolio content in one place</p>
        </div>

        {message.text && (
          <Alert variant={message.type === 'error' ? 'destructive' : 'default'}>
            <AlertDescription>{message.text}</AlertDescription>
          </Alert>
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4 lg:grid-cols-8">
            <TabsTrigger value="hero">Hero</TabsTrigger>
            <TabsTrigger value="about">About</TabsTrigger>
            <TabsTrigger value="skills">Skills</TabsTrigger>
            <TabsTrigger value="projects">Projects</TabsTrigger>
            <TabsTrigger value="experience">Experience</TabsTrigger>
            <TabsTrigger value="education">Education</TabsTrigger>
            <TabsTrigger value="testimonials">Testimonials</TabsTrigger>
            <TabsTrigger value="services">Services</TabsTrigger>
          </TabsList>

          <TabsContent value="hero">{renderSection('hero', heroData, 'Hero Section')}</TabsContent>
          <TabsContent value="about">{renderSection('about', aboutData, 'About Section')}</TabsContent>
          <TabsContent value="skills">{renderSection('skills', skillsData, 'Skills')}</TabsContent>
          <TabsContent value="projects">{renderSection('projects', projectsData, 'Projects')}</TabsContent>
          <TabsContent value="experience">{renderSection('experience', experienceData, 'Experience')}</TabsContent>
          <TabsContent value="education">{renderSection('education', educationData, 'Education')}</TabsContent>
          <TabsContent value="testimonials">{renderSection('testimonials', testimonialsData, 'Testimonials')}</TabsContent>
          <TabsContent value="services">{renderSection('services', servicesData, 'Services')}</TabsContent>
        </Tabs>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingItem ? 'Edit' : 'Add'} {currentSection.charAt(0).toUpperCase() + currentSection.slice(1)}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-6 pt-4">
              {renderFormFields()}
              <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  <Save className="h-4 w-4 mr-2" />
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
