'use client';

import { GraduationCap, MapPin, Calendar, Award } from 'lucide-react';

interface EducationProps {
  data: any[];
}

export function Education({ data }: EducationProps) {
  if (!data || data.length === 0) return null;

  const visibleEducation = data.filter((edu) => edu.visible);

  if (visibleEducation.length === 0) return null;

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
  };

  return (
    <section id="education" className="py-20 bg-muted/30">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Education
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            My academic background and qualifications
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {visibleEducation.map((edu) => (
            <div
              key={edu.id}
              className="bg-card border border-border rounded-lg p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center">
                  <GraduationCap className="h-6 w-6 text-accent" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-foreground">{edu.degree}</h3>
                  {edu.field && (
                    <p className="text-accent font-semibold mt-1">{edu.field}</p>
                  )}
                  <p className="text-lg text-foreground mt-2">{edu.institution}</p>
                  {edu.description && (
                    <p className="text-muted-foreground mt-3 text-sm">
                      {edu.description}
                    </p>
                  )}
                  <div className="flex flex-wrap items-center gap-4 mt-4 text-sm text-muted-foreground">
                    {edu.start_date && (
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {formatDate(edu.start_date)} - {formatDate(edu.end_date) || 'Present'}
                      </span>
                    )}
                    {edu.location && (
                      <span className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {edu.location}
                      </span>
                    )}
                    {edu.grade && (
                      <span className="flex items-center gap-1">
                        <Award className="h-4 w-4" />
                        {edu.grade}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
