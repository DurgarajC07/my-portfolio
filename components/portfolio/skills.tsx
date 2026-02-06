'use client';

import { 
  Code, Database, Server, Globe, Layers, Terminal,
  Cpu, Box, Package, Settings, Wrench,
  Smartphone, Monitor, Layout, Palette, FileCode, GitBranch
} from 'lucide-react';

interface SkillsProps {
  data: any[];
}

// Icon mapping
const iconMap: { [key: string]: any } = {
  'Code': Code,
  'Database': Database,
  'Server': Server,
  'Globe': Globe,
  'Layers': Layers,
  'Terminal': Terminal,
  'Cpu': Cpu,
  'Box': Box,
  'Package': Package,
  'Settings': Settings,
  'Wrench': Wrench,
  'Smartphone': Smartphone,
  'Monitor': Monitor,
  'Layout': Layout,
  'Palette': Palette,
  'FileCode': FileCode,
  'GitBranch': GitBranch,
};

export function Skills({ data }: SkillsProps) {
  if (!data || data.length === 0) return null;

  // Group skills by category
  const skillsByCategory = data.reduce((acc: any, skill) => {
    if (!skill.visible) return acc;
    const category = skill.category || 'Other';
    if (!acc[category]) acc[category] = [];
    acc[category].push(skill);
    return acc;
  }, {});

  return (
    <section id="skills" className="py-20 bg-muted/30">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Skills & Expertise
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Technologies and tools I work with
          </p>
        </div>

        <div className="space-y-8">
          {Object.entries(skillsByCategory).map(([category, skills]: [string, any]) => (
            <div key={category}>
              <h3 className="text-xl font-semibold mb-4 text-foreground">{category}</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {skills.map((skill: any) => (
                  <div
                    key={skill.id}
                    className="bg-card border border-border rounded-lg p-4 hover:shadow-lg transition-shadow"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      {skill.icon && (
                        <div className="w-8 h-8 flex items-center justify-center text-accent">
                          {skill.icon.startsWith('http') ? (
                            <img src={skill.icon} alt={skill.name} className="w-full h-full object-contain" />
                          ) : (() => {
                            const IconComponent = iconMap[skill.icon] || Code;
                            return <IconComponent className="w-6 h-6" />;
                          })()}
                        </div>
                      )}
                      <h4 className="font-medium text-foreground">{skill.name}</h4>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className="bg-accent h-2 rounded-full transition-all"
                        style={{ width: `${skill.level || 80}%` }}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1 text-right">
                      {skill.level || 80}%
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
