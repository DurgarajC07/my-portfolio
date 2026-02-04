'use client';

import { Briefcase, MapPin, Calendar } from 'lucide-react';

interface ExperienceProps {
  data: any[];
}

export function Experience({ data }: ExperienceProps) {
  if (!data || data.length === 0) return null;

  const visibleExperience = data.filter((exp) => exp.visible);

  if (visibleExperience.length === 0) return null;

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
  };

  return (
    <section id="experience" className="py-20">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Work Experience
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            My professional journey and career highlights
          </p>
        </div>

        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-border hidden md:block" />

          <div className="space-y-8">
            {visibleExperience.map((exp) => (
              <div key={exp.id} className="relative pl-0 md:pl-20">
                {/* Timeline dot */}
                <div className="absolute left-6 top-6 w-4 h-4 rounded-full bg-accent border-4 border-background hidden md:block" />

                <div className="bg-card border border-border rounded-lg p-6 hover:shadow-lg transition-shadow">
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-foreground">{exp.position}</h3>
                      <p className="text-lg text-accent font-semibold mt-1">
                        <Briefcase className="inline h-4 w-4 mr-2" />
                        {exp.company}
                      </p>
                      {exp.description && (
                        <p className="text-muted-foreground mt-3 whitespace-pre-line">
                          {exp.description}
                        </p>
                      )}
                      {exp.location && (
                        <p className="text-sm text-muted-foreground mt-3">
                          <MapPin className="inline h-4 w-4 mr-1" />
                          {exp.location}
                        </p>
                      )}
                    </div>
                    <div className="text-sm text-muted-foreground md:text-right">
                      <p className="flex items-center md:justify-end gap-1">
                        <Calendar className="h-4 w-4" />
                        {formatDate(exp.start_date)} - {exp.current ? 'Present' : formatDate(exp.end_date)}
                      </p>
                      {exp.current && (
                        <span className="inline-block mt-2 px-3 py-1 bg-accent/10 text-accent rounded-full text-xs font-medium">
                          Current
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
