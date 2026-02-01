'use client';

import { MapPin } from 'lucide-react';

interface AboutProps {
  data: any;
  skills: any[];
}

export function About({ data, skills }: AboutProps) {
  if (!data) return null;

  const stats = data.stats ? JSON.parse(data.stats) : {};
  const skillsByCategory = skills.reduce((acc: any, skill: any) => {
    if (!acc[skill.category]) acc[skill.category] = [];
    acc[skill.category].push(skill);
    return acc;
  }, {});

  return (
    <section id="about" className="py-20 bg-card/50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left - Content */}
          <div className="space-y-8">
            <div>
              <h2 className="text-4xl font-bold text-foreground mb-4">{data.title}</h2>
              <p className="text-lg text-muted-foreground leading-relaxed whitespace-pre-wrap">
                {data.description}
              </p>
            </div>

            {/* Stats */}
            {Object.keys(stats).length > 0 && (
              <div className="grid grid-cols-3 gap-4">
                {Object.entries(stats).map(([key, value]: any, i) => (
                  <div key={i} className="bg-background border border-border rounded-lg p-4">
                    <p className="text-2xl font-bold text-accent">{value}</p>
                    <p className="text-sm text-muted-foreground capitalize">{key}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right - Info */}
          <div className="space-y-8">
            {/* Location */}
            {data.location && (
              <div className="bg-background border border-border rounded-lg p-4 flex items-center gap-3">
                <MapPin className="text-accent" size={20} />
                <div>
                  <p className="font-medium text-foreground text-sm">Based in</p>
                  <p className="text-sm text-muted-foreground">{data.location}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Skills Grid */}
        {skills.length > 0 && (
          <div className="mt-16">
            <h3 className="text-2xl font-bold text-foreground mb-8 text-center">Skills & Tools</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Object.entries(skillsByCategory).map(([category, categorySkills]: any, i) => (
                <div key={i} className="bg-background border border-border rounded-lg p-6">
                  <h4 className="font-semibold text-foreground mb-3">{category}</h4>
                  <div className="flex flex-wrap gap-2">
                    {categorySkills.map((skill: any, j: number) => (
                      <span
                        key={j}
                        className="px-3 py-1 bg-accent/10 text-accent rounded-full text-sm font-medium"
                      >
                        {skill.name}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
