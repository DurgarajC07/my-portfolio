'use client';

import { Check } from 'lucide-react';

interface ServicesProps {
  data: any[];
}

export function Services({ data }: ServicesProps) {
  if (!data || data.length === 0) return null;

  const visibleServices = data.filter((service) => service.visible);

  if (visibleServices.length === 0) return null;

  return (
    <section id="services" className="py-20 bg-muted/30">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Services
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            What I can do for you
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {visibleServices.map((service) => {
            let features: string[] = [];
            try {
              features = typeof service.features === 'string' 
                ? JSON.parse(service.features) 
                : Array.isArray(service.features) 
                ? service.features 
                : [];
            } catch (e) {
              features = [];
            }

            return (
              <div
                key={service.id}
                className="bg-card border border-border rounded-lg p-6 hover:shadow-lg transition-shadow hover:-translate-y-1"
              >
                <div className="flex items-center gap-4 mb-4">
                  {service.icon && (
                    <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center shrink-0">
                      {service.icon.startsWith('http') ? (
                        <img src={service.icon} alt={service.title} className="w-8 h-8 object-contain" />
                      ) : (
                        <span className="text-2xl">{service.icon}</span>
                      )}
                    </div>
                  )}
                  <h3 className="text-xl font-bold text-foreground">{service.title}</h3>
                </div>

                <p className="text-muted-foreground mb-6">{service.description}</p>

                {features.length > 0 && (
                  <ul className="space-y-2">
                    {features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm">
                        <Check className="h-5 w-5 text-accent shrink-0 mt-0.5" />
                        <span className="text-muted-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
