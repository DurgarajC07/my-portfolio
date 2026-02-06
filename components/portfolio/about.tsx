'use client';

import { MapPin } from 'lucide-react';

interface AboutProps {
  data: any;
}

export function About({ data }: AboutProps) {
  if (!data) return null;

  const stats = data.stats ? JSON.parse(data.stats) : {};

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
            {/* Image */}
            {data.image_url && (
              <div className="relative h-64 rounded-lg overflow-hidden">
                <img
                  src={data.image_url}
                  alt={data.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

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
      </div>
    </section>
  );
}
