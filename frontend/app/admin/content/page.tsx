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
import { Loader2, Save, User, Briefcase, GraduationCap, Award } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function ContentManagerPage() {
  const { token } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [activeTab, setActiveTab] = useState('hero');

  // Form states for different sections
  const [heroData, setHeroData] = useState<any>({});
  const [aboutData, setAboutData] = useState<any>({});
  const [projects, setProjects] = useState<any[]>([]);
  const [experiences, setExperiences] = useState<any[]>([]);
  const [education, setEducation] = useState<any[]>([]);

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      const [heroRes, aboutRes, projectsRes, expRes, eduRes] = await Promise.allSettled([
        api.hero.getAll(),
        api.about.getAll(),
        api.projects.getAll(),
        api.experience.getAll(),
        api.education.getAll(),
      ]);

      if (heroRes.status === 'fulfilled' && (heroRes.value as any[])[0]) {
        setHeroData((heroRes.value as any[])[0]);
      }
      if (aboutRes.status === 'fulfilled' && (aboutRes.value as any[])[0]) {
        setAboutData((aboutRes.value as any[])[0]);
      }
      if (projectsRes.status === 'fulfilled') {
        setProjects((projectsRes.value as any[]) || []);
      }
      if (expRes.status === 'fulfilled') {
        setExperiences((expRes.value as any[]) || []);
      }
      if (eduRes.status === 'fulfilled') {
        setEducation((eduRes.value as any[]) || []);
      }
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message });
    } finally {
      setLoading(false);
    }
  };

  const saveHero = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (heroData.id) {
        await api.hero.update(heroData.id, heroData, token!);
      } else {
        await api.hero.create(heroData, token!);
      }
      setMessage({ type: 'success', text: 'Hero section saved!' });
      await fetchAllData();
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message });
    } finally {
      setSaving(false);
    }
  };

  const saveAbout = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (aboutData.id) {
        await api.about.update(aboutData.id, aboutData, token!);
      } else {
        await api.about.create(aboutData, token!);
      }
      setMessage({ type: 'success', text: 'About section saved!' });
      await fetchAllData();
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
        <div>
          <h1 className="text-3xl font-bold text-foreground">Content Manager</h1>
          <p className="text-muted-foreground mt-1">Manage all your portfolio content</p>
        </div>

        {message.text && (
          <Alert variant={message.type === 'error' ? 'destructive' : 'default'}>
            <AlertDescription>{message.text}</AlertDescription>
          </Alert>
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="hero">Hero</TabsTrigger>
            <TabsTrigger value="about">About</TabsTrigger>
            <TabsTrigger value="projects">Projects ({projects.length})</TabsTrigger>
            <TabsTrigger value="experience">Experience ({experiences.length})</TabsTrigger>
            <TabsTrigger value="education">Education ({education.length})</TabsTrigger>
          </TabsList>

          {/* Hero Section */}
          <TabsContent value="hero">
            <form onSubmit={saveHero} className="space-y-4 bg-card border border-border rounded-lg p-6">
              <div className="space-y-2">
                <Label htmlFor="hero_title">Title *</Label>
                <Input
                  id="hero_title"
                  value={heroData.title || ''}
                  onChange={(e) => setHeroData({ ...heroData, title: e.target.value })}
                  placeholder="Your Name"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="hero_subtitle">Subtitle *</Label>
                <Input
                  id="hero_subtitle"
                  value={heroData.subtitle || ''}
                  onChange={(e) => setHeroData({ ...heroData, subtitle: e.target.value })}
                  placeholder="Your Professional Title"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="hero_description">Description</Label>
                <Textarea
                  id="hero_description"
                  value={heroData.description || ''}
                  onChange={(e) => setHeroData({ ...heroData, description: e.target.value })}
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="cta_text">CTA Text</Label>
                  <Input
                    id="cta_text"
                    value={heroData.cta_text || ''}
                    onChange={(e) => setHeroData({ ...heroData, cta_text: e.target.value })}
                    placeholder="View My Work"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cta_link">CTA Link</Label>
                  <Input
                    id="cta_link"
                    value={heroData.cta_link || ''}
                    onChange={(e) => setHeroData({ ...heroData, cta_link: e.target.value })}
                    placeholder="#projects"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="social_links">Social Links (JSON)</Label>
                <Textarea
                  id="social_links"
                  value={typeof heroData.social_links === 'string' ? heroData.social_links : JSON.stringify(heroData.social_links || {}, null, 2)}
                  onChange={(e) => setHeroData({ ...heroData, social_links: e.target.value })}
                  rows={3}
                  className="font-mono text-sm"
                />
              </div>

              <Button type="submit" disabled={saving}>
                {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                Save Hero Section
              </Button>
            </form>
          </TabsContent>

          {/* About Section */}
          <TabsContent value="about">
            <form onSubmit={saveAbout} className="space-y-4 bg-card border border-border rounded-lg p-6">
              <div className="space-y-2">
                <Label htmlFor="about_title">Title *</Label>
                <Input
                  id="about_title"
                  value={aboutData.title || ''}
                  onChange={(e) => setAboutData({ ...aboutData, title: e.target.value })}
                  placeholder="About Me"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="about_description">Description *</Label>
                <Textarea
                  id="about_description"
                  value={aboutData.description || ''}
                  onChange={(e) => setAboutData({ ...aboutData, description: e.target.value })}
                  rows={6}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={aboutData.location || ''}
                  onChange={(e) => setAboutData({ ...aboutData, location: e.target.value })}
                  placeholder="City, Country"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="stats">Stats (JSON)</Label>
                <Textarea
                  id="stats"
                  value={typeof aboutData.stats === 'string' ? aboutData.stats : JSON.stringify(aboutData.stats || {}, null, 2)}
                  onChange={(e) => setAboutData({ ...aboutData, stats: e.target.value })}
                  rows={3}
                  className="font-mono text-sm"
                  placeholder='{"years": "5+", "projects": "50+", "clients": "20+"}'
                />
              </div>

              <Button type="submit" disabled={saving}>
                {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                Save About Section
              </Button>
            </form>
          </TabsContent>

          {/* Projects List */}
          <TabsContent value="projects">
            <div className="space-y-4">
              {projects.map((project) => (
                <div key={project.id} className="bg-card border border-border rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold">{project.title}</h3>
                      <p className="text-sm text-muted-foreground mt-1">{project.description}</p>
                      <div className="flex gap-2 mt-2">
                        {project.featured && (
                          <span className="px-2 py-1 bg-accent/20 text-accent text-xs rounded">Featured</span>
                        )}
                        {!project.visible && (
                          <span className="px-2 py-1 bg-red-500/20 text-red-500 text-xs rounded">Hidden</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              <p className="text-sm text-muted-foreground text-center py-4">
                To add or edit projects, use the dedicated project editor in the menu
              </p>
            </div>
          </TabsContent>

          {/* Experience List */}
          <TabsContent value="experience">
            <div className="space-y-4">
              {experiences.map((exp) => (
                <div key={exp.id} className="bg-card border border-border rounded-lg p-4">
                  <div className="flex gap-3">
                    <Briefcase className="text-accent mt-1" size={20} />
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold">{exp.position}</h3>
                      <p className="text-sm text-accent">{exp.company}</p>
                      <p className="text-sm text-muted-foreground">{exp.start_date} - {exp.end_date || 'Present'}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          {/* Education List */}
          <TabsContent value="education">
            <div className="space-y-4">
              {education.map((edu) => (
                <div key={edu.id} className="bg-card border border-border rounded-lg p-4">
                  <div className="flex gap-3">
                    <GraduationCap className="text-accent mt-1" size={20} />
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold">{edu.degree}</h3>
                      <p className="text-sm text-accent">{edu.institution}</p>
                      <p className="text-sm text-muted-foreground">{edu.start_date} - {edu.end_date}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
}
