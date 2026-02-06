import { Navbar } from '@/components/portfolio/navbar';
import { Hero } from '@/components/portfolio/hero';
import { About } from '@/components/portfolio/about';
import { Skills } from '@/components/portfolio/skills';
import { Projects } from '@/components/portfolio/projects';
import { Experience } from '@/components/portfolio/experience';
import { Education } from '@/components/portfolio/education';
import { Testimonials } from '@/components/portfolio/testimonials';
import { Services } from '@/components/portfolio/services';
import { Blog } from '@/components/portfolio/blog';
import { Contact } from '@/components/portfolio/contact';
import { Footer } from '@/components/portfolio/footer';
import { api } from '@/lib/api';

export const dynamic = 'force-dynamic';

async function getData() {
  try {
    // Fetch data with individual error handling
    const [hero, about, skills, projects, experience, education, testimonials, services, blogs, settings] = 
      await Promise.allSettled([
        api.hero.getAll(),
        api.about.getAll(),
        api.skills.getAll(),
        api.projects.getAll(),
        api.experience.getAll(),
        api.education.getAll(),
        api.testimonials.getAll(),
        api.services.getAll(),
        api.blog.getAll(),
        api.settings.get(),
      ]);

    return {
      hero: hero.status === 'fulfilled' ? hero.value[0] || null : null,
      about: about.status === 'fulfilled' ? about.value[0] || null : null,
      skills: skills.status === 'fulfilled' ? skills.value || [] : [],
      projects: projects.status === 'fulfilled' ? projects.value || [] : [],
      experience: experience.status === 'fulfilled' ? experience.value || [] : [],
      education: education.status === 'fulfilled' ? education.value || [] : [],
      testimonials: testimonials.status === 'fulfilled' ? testimonials.value || [] : [],
      services: services.status === 'fulfilled' ? services.value || [] : [],
      blogs: blogs.status === 'fulfilled' ? blogs.value || [] : [],
      settings: settings.status === 'fulfilled' ? settings.value || {} : {},
    };
  } catch (error) {
    console.error('Error fetching data:', error);
    return {
      hero: null,
      about: null,
      skills: [],
      projects: [],
      experience: [],
      education: [],
      testimonials: [],
      services: [],
      blogs: [],
      settings: {},
    };
  }
}

export default async function Home() {
  const data = await getData();

  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        <Hero data={data.hero} />
        <About data={data.about} />
        <Skills data={data.skills} />
        <Projects data={data.projects} />
        <Experience data={data.experience} />
        <Education data={data.education} />
        <Services data={data.services} />
        <Testimonials data={data.testimonials} />
        <Blog data={data.blogs} />
        <Contact />
      </main>
      <Footer settings={data.settings} />
    </>
  );
}
