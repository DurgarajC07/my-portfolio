// Type definitions for the portfolio system

export interface Personal {
  name: string;
  title: string;
  location: string;
  experience: string;
  email: string;
  github: string;
  linkedin: string;
  bio: string;
  tagline: string;
}

export interface Skills {
  ai_ml: string[];
  backend: string[];
  frontend: string[];
  devops: string[];
}

export interface Experience {
  id: string;
  company: string;
  position: string;
  location: string;
  duration: string;
  period: string;
  type: string;
  responsibilities: string[];
  achievements: string[];
  technologies: string[];
}

export interface ProjectImpact {
  metric?: string;
  scale?: string;
  uptime?: string;
  accuracy?: string;
  adoption?: string;
  users?: string;
  performance?: string;
  retrieval?: string;
}

export interface Project {
  id: string;
  name: string;
  slug: string;
  category: string;
  tagline: string;
  description: string;
  technologies: string[];
  features: string[];
  challenges: string[];
  impact: ProjectImpact;
  github: string | null;
  demo: string | null;
}

export interface Education {
  id: string;
  degree: string;
  field: string;
  institution: string;
  location: string;
  period: string;
  grade: string;
  highlights: string[];
}

export interface Log {
  timestamp: string;
  level: 'INFO' | 'SUCCESS' | 'WARN' | 'ERROR';
  service: string;
  message: string;
}

export interface ProfileData {
  personal: Personal;
  skills: Skills;
  experience: Experience[];
  projects: Project[];
  education: Education[];
  logs: Log[];
  currentFocus: string[];
  values: string[];
}

export interface TerminalOutput {
  id: string;
  type: 'command' | 'output' | 'error' | 'system';
  content: string | React.ReactNode;
  timestamp: Date;
}

export interface Command {
  name: string;
  description: string;
  usage: string;
  aliases?: string[];
  execute: (args: string[], data: ProfileData) => TerminalOutput[];
}
