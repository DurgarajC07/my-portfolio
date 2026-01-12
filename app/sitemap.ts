import { MetadataRoute } from 'next';
import { promises as fs } from 'fs';
import path from 'path';
import { ProfileData } from '@/lib/types';

async function getProfileData(): Promise<ProfileData> {
  const filePath = path.join(process.cwd(), 'data', 'profile.json');
  const jsonData = await fs.readFile(filePath, 'utf8');
  return JSON.parse(jsonData);
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const data = await getProfileData();
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://durgaraj-portfolio.vercel.app';

  // Static routes
  const routes = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 1,
    },
  ];

  // Dynamic project routes
  const projectRoutes = data.projects.map((project) => ({
    url: `${baseUrl}/projects/${project.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));

  return [...routes, ...projectRoutes];
}
