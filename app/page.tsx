import { Metadata } from 'next';
import { promises as fs } from 'fs';
import path from 'path';
import Terminal from '@/components/Terminal';
import { ProfileData } from '@/lib/types';

export const metadata: Metadata = {
  title: 'Durgaraj Chauhan - Senior Software Engineer & Full-Stack AI Engineer',
  description:
    'Senior Software Engineer and Full-Stack AI Engineer specializing in production-ready AI systems, RAG pipelines, agentic AI, and modern full-stack development. 2.5+ years of experience building intelligent, scalable solutions.',
  keywords: [
    'AI Engineer',
    'Full-Stack Developer',
    'RAG Systems',
    'LLM',
    'Agentic AI',
    'Machine Learning',
    'Python',
    'FastAPI',
    'React',
    'Next.js',
    'Software Engineer',
  ],
  authors: [{ name: 'Durgaraj Chauhan' }],
  creator: 'Durgaraj Chauhan',
  publisher: 'Durgaraj Chauhan',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://durgaraj-portfolio.vercel.app',
    title: 'Durgaraj Chauhan - AI OS Portfolio',
    description:
      'Interactive AI-powered portfolio showcasing expertise in AI/ML engineering, full-stack development, and production-grade systems.',
    siteName: 'Durgaraj Chauhan Portfolio',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Durgaraj Chauhan - Senior Software Engineer & Full-Stack AI Engineer',
    description:
      'Building intelligent, scalable AI solutions. Specialized in RAG, LLMs, and agentic AI.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

async function getProfileData(): Promise<ProfileData> {
  const filePath = path.join(process.cwd(), 'data', 'profile.json');
  const jsonData = await fs.readFile(filePath, 'utf8');
  return JSON.parse(jsonData);
}

export default async function Home() {
  const data = await getProfileData();

  return <Terminal data={data} />;
}
