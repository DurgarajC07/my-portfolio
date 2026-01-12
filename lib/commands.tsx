// Command Pattern Implementation for Terminal
import { Command, ProfileData, TerminalOutput } from './types';

// Utility function to create output
const createOutput = (
  content: string | React.ReactNode,
  type: 'output' | 'error' | 'system' = 'output'
): TerminalOutput => ({
  id: `output-${Date.now()}-${Math.random()}`,
  type,
  content,
  timestamp: new Date(),
});

// Command Registry - Extensible design for adding new commands
export const commands: Record<string, Command> = {
  help: {
    name: 'help',
    description: 'Display available commands',
    usage: 'help [command]',
    execute: (args: string[]) => {
      if (args.length > 0) {
        const cmd = commands[args[0]];
        if (cmd) {
          return [
            createOutput(
              <div className="space-y-2">
                <div className="text-cyan-400 font-bold">{cmd.name}</div>
                <div className="text-gray-300">{cmd.description}</div>
                <div className="text-gray-500">Usage: {cmd.usage}</div>
                {cmd.aliases && (
                  <div className="text-gray-500">
                    Aliases: {cmd.aliases.join(', ')}
                  </div>
                )}
              </div>
            ),
          ];
        }
        return [createOutput(`Command '${args[0]}' not found`, 'error')];
      }

      return [
        createOutput(
          <div className="space-y-4">
            <div className="text-cyan-400 font-bold text-xl">
              AI OS Portfolio - Available Commands
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.values(commands).map((cmd) => (
                <div key={cmd.name} className="space-y-1">
                  <div className="text-green-400 font-mono">{cmd.name}</div>
                  <div className="text-gray-400 text-sm">{cmd.description}</div>
                </div>
              ))}
            </div>
            <div className="text-gray-500 text-sm mt-4">
              Type 'help [command]' for detailed information about a specific command
            </div>
          </div>
        ),
      ];
    },
  },

  whoami: {
    name: 'whoami',
    description: 'Display information about me',
    usage: 'whoami',
    execute: (args: string[], data: ProfileData) => {
      const { personal } = data;
      return [
        createOutput(
          <div className="space-y-4">
            <div className="text-2xl font-bold text-cyan-400">{personal.name}</div>
            <div className="text-xl text-green-400">{personal.title}</div>
            <div className="text-gray-300 max-w-3xl">{personal.bio}</div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <span className="text-gray-500">Location:</span>{' '}
                <span className="text-gray-300">{personal.location}</span>
              </div>
              <div>
                <span className="text-gray-500">Experience:</span>{' '}
                <span className="text-gray-300">{personal.experience}</span>
              </div>
            </div>
            <div className="border-t border-gray-700 pt-4">
              <div className="text-yellow-400 font-bold mb-2">Current Focus:</div>
              <ul className="list-disc list-inside space-y-1 text-gray-300">
                {data.currentFocus.map((focus, idx) => (
                  <li key={idx}>{focus}</li>
                ))}
              </ul>
            </div>
          </div>
        ),
      ];
    },
  },

  skills: {
    name: 'skills',
    description: 'Display technical skills',
    usage: 'skills [category]',
    aliases: ['tech', 'stack'],
    execute: (args: string[], data: ProfileData) => {
      const { skills } = data;

      if (args.length > 0) {
        const category = args[0].toLowerCase().replace('-', '_');
        const categoryMap: Record<string, keyof typeof skills> = {
          ai: 'ai_ml',
          ml: 'ai_ml',
          ai_ml: 'ai_ml',
          backend: 'backend',
          frontend: 'frontend',
          devops: 'devops',
        };

        const key = categoryMap[category];
        if (key && skills[key]) {
          return [
            createOutput(
              <div className="space-y-3">
                <div className="text-cyan-400 font-bold text-xl capitalize">
                  {key.replace('_', '/')} Skills
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {skills[key].map((skill, idx) => (
                    <div
                      key={idx}
                      className="bg-gray-800 px-3 py-2 rounded text-green-400 text-sm"
                    >
                      • {skill}
                    </div>
                  ))}
                </div>
              </div>
            ),
          ];
        }
        return [
          createOutput(
            `Category '${args[0]}' not found. Available: ai, backend, frontend, devops`,
            'error'
          ),
        ];
      }

      return [
        createOutput(
          <div className="space-y-6">
            <div className="text-cyan-400 font-bold text-2xl">Technical Skills</div>
            {Object.entries(skills).map(([category, items]) => (
              <div key={category} className="space-y-3">
                <div className="text-yellow-400 font-bold capitalize">
                  {category.replace('_', '/')}
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {items.map((skill: string, idx: number) => (
                    <div
                      key={idx}
                      className="bg-gray-800 px-3 py-2 rounded text-green-400 text-sm"
                    >
                      • {skill}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ),
      ];
    },
  },

  experience: {
    name: 'experience',
    description: 'Display work experience',
    usage: 'experience [company]',
    aliases: ['work', 'exp'],
    execute: (args: string[], data: ProfileData) => {
      const { experience } = data;

      if (args.length > 0) {
        const query = args.join(' ').toLowerCase();
        const exp = experience.find((e) =>
          e.company.toLowerCase().includes(query)
        );

        if (exp) {
          return [
            createOutput(
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="text-2xl font-bold text-cyan-400">{exp.position}</div>
                  <div className="text-xl text-green-400">{exp.company}</div>
                  <div className="text-gray-500">
                    {exp.period} • {exp.location}
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="text-yellow-400 font-bold">Responsibilities:</div>
                  <ul className="list-disc list-inside space-y-1 text-gray-300">
                    {exp.responsibilities.map((resp, idx) => (
                      <li key={idx}>{resp}</li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-3">
                  <div className="text-yellow-400 font-bold">Key Achievements:</div>
                  <ul className="list-disc list-inside space-y-1 text-green-400">
                    {exp.achievements.map((ach, idx) => (
                      <li key={idx}>{ach}</li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-2">
                  <div className="text-yellow-400 font-bold">Technologies:</div>
                  <div className="flex flex-wrap gap-2">
                    {exp.technologies.map((tech, idx) => (
                      <span
                        key={idx}
                        className="bg-gray-800 px-3 py-1 rounded text-cyan-400 text-sm"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ),
          ];
        }

        return [createOutput(`Experience at '${args.join(' ')}' not found`, 'error')];
      }

      return [
        createOutput(
          <div className="space-y-6">
            <div className="text-cyan-400 font-bold text-2xl">Work Experience</div>
            {experience.map((exp) => (
              <div key={exp.id} className="border-l-4 border-green-400 pl-4 space-y-2">
                <div className="text-xl font-bold text-green-400">{exp.position}</div>
                <div className="text-lg text-cyan-400">{exp.company}</div>
                <div className="text-gray-500">{exp.period} • {exp.location}</div>
                <div className="text-gray-400 text-sm">
                  Key: {exp.achievements[0]}
                </div>
                <div className="text-gray-500 text-sm">
                  Type 'experience {exp.company}' for details
                </div>
              </div>
            ))}
          </div>
        ),
      ];
    },
  },

  projects: {
    name: 'projects',
    description: 'Display portfolio projects',
    usage: 'projects [project-name]',
    aliases: ['work', 'portfolio'],
    execute: (args: string[], data: ProfileData) => {
      const { projects } = data;

      if (args.length > 0) {
        const query = args.join(' ').toLowerCase();
        const project = projects.find(
          (p) =>
            p.name.toLowerCase().includes(query) ||
            p.slug.toLowerCase().includes(query)
        );

        if (project) {
          return [
            createOutput(
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="text-2xl font-bold text-cyan-400">{project.name}</div>
                  <div className="text-lg text-green-400">{project.tagline}</div>
                  <div className="text-gray-400">{project.description}</div>
                </div>

                <div className="space-y-2">
                  <div className="text-yellow-400 font-bold">Technologies:</div>
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.map((tech, idx) => (
                      <span
                        key={idx}
                        className="bg-gray-800 px-3 py-1 rounded text-cyan-400 text-sm"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="text-yellow-400 font-bold">Key Features:</div>
                  <ul className="list-disc list-inside space-y-1 text-gray-300">
                    {project.features.map((feature, idx) => (
                      <li key={idx}>{feature}</li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-2">
                  <div className="text-yellow-400 font-bold">Challenges Solved:</div>
                  <ul className="list-disc list-inside space-y-1 text-gray-300">
                    {project.challenges.map((challenge, idx) => (
                      <li key={idx}>{challenge}</li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-2 bg-gray-800 p-4 rounded">
                  <div className="text-green-400 font-bold">Impact:</div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    {Object.entries(project.impact).map(([key, value]) => (
                      <div key={key}>
                        <span className="text-gray-500 capitalize">
                          {key.replace('_', ' ')}:
                        </span>{' '}
                        <span className="text-green-400">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ),
          ];
        }

        return [createOutput(`Project '${args.join(' ')}' not found`, 'error')];
      }

      return [
        createOutput(
          <div className="space-y-6">
            <div className="text-cyan-400 font-bold text-2xl">Portfolio Projects</div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {projects.map((project) => (
                <div
                  key={project.id}
                  className="border border-gray-700 p-4 rounded-lg hover:border-cyan-400 transition-colors space-y-3"
                >
                  <div className="text-lg font-bold text-green-400">
                    {project.name}
                  </div>
                  <div className="text-sm text-gray-400">{project.tagline}</div>
                  <div className="flex flex-wrap gap-1">
                    {project.technologies.slice(0, 4).map((tech, idx) => (
                      <span
                        key={idx}
                        className="text-xs bg-gray-800 px-2 py-1 rounded text-cyan-400"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                  <div className="text-gray-500 text-xs">
                    Type 'projects {project.slug}' for details
                  </div>
                </div>
              ))}
            </div>
          </div>
        ),
      ];
    },
  },

  education: {
    name: 'education',
    description: 'Display educational background',
    usage: 'education',
    aliases: ['edu', 'degree'],
    execute: (args: string[], data: ProfileData) => {
      const { education } = data;

      return [
        createOutput(
          <div className="space-y-6">
            <div className="text-cyan-400 font-bold text-2xl">Education</div>
            {education.map((edu) => (
              <div key={edu.id} className="border-l-4 border-green-400 pl-4 space-y-3">
                <div className="text-xl font-bold text-green-400">{edu.degree}</div>
                <div className="text-lg text-cyan-400">{edu.field}</div>
                <div className="text-gray-300">{edu.institution}</div>
                <div className="text-gray-500">
                  {edu.period} • {edu.location} • {edu.grade}
                </div>
                <div className="space-y-2">
                  <div className="text-yellow-400 font-bold text-sm">Highlights:</div>
                  <ul className="list-disc list-inside space-y-1 text-gray-300 text-sm">
                    {edu.highlights.map((highlight, idx) => (
                      <li key={idx}>{highlight}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        ),
      ];
    },
  },

  logs: {
    name: 'logs',
    description: 'Display career timeline as system logs',
    usage: 'logs [level]',
    aliases: ['timeline', 'history'],
    execute: (args: string[], data: ProfileData) => {
      let { logs } = data;

      if (args.length > 0) {
        const level = args[0].toUpperCase();
        logs = logs.filter((log) => log.level === level);
        if (logs.length === 0) {
          return [createOutput(`No logs found for level '${level}'`, 'error')];
        }
      }

      const levelColors: Record<string, string> = {
        INFO: 'text-blue-400',
        SUCCESS: 'text-green-400',
        WARN: 'text-yellow-400',
        ERROR: 'text-red-400',
      };

      return [
        createOutput(
          <div className="space-y-4">
            <div className="text-cyan-400 font-bold text-2xl">Career Timeline</div>
            <div className="space-y-2 font-mono text-sm">
              {logs.map((log, idx) => (
                <div key={idx} className="flex gap-3">
                  <span className="text-gray-500">
                    {new Date(log.timestamp).toISOString().replace('T', ' ').slice(0, 19)}
                  </span>
                  <span className={`font-bold ${levelColors[log.level]} w-16`}>
                    [{log.level}]
                  </span>
                  <span className="text-cyan-400">{log.service}</span>
                  <span className="text-gray-300">{log.message}</span>
                </div>
              ))}
            </div>
            <div className="text-gray-500 text-xs">
              Filter by level: logs [INFO|SUCCESS|WARN|ERROR]
            </div>
          </div>
        ),
      ];
    },
  },

  contact: {
    name: 'contact',
    description: 'Display contact information',
    usage: 'contact',
    aliases: ['reach', 'connect'],
    execute: (args: string[], data: ProfileData) => {
      const { personal } = data;

      return [
        createOutput(
          <div className="space-y-6">
            <div className="text-cyan-400 font-bold text-2xl">Contact Information</div>
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="text-green-400 font-bold">Email</div>
                <a
                  href={`mailto:${personal.email}`}
                  className="text-cyan-400 hover:underline"
                >
                  {personal.email}
                </a>
              </div>
              <div className="space-y-2">
                <div className="text-green-400 font-bold">GitHub</div>
                <a
                  href={personal.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-cyan-400 hover:underline"
                >
                  {personal.github}
                </a>
              </div>
              <div className="space-y-2">
                <div className="text-green-400 font-bold">LinkedIn</div>
                <a
                  href={personal.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-cyan-400 hover:underline"
                >
                  {personal.linkedin}
                </a>
              </div>
            </div>
            <div className="bg-gray-800 p-4 rounded">
              <div className="text-yellow-400 font-bold mb-2">Let's Connect!</div>
              <div className="text-gray-300">
                I'm always open to discussing AI engineering, full-stack development,
                and innovative projects. Feel free to reach out!
              </div>
            </div>
          </div>
        ),
      ];
    },
  },

  clear: {
    name: 'clear',
    description: 'Clear terminal screen',
    usage: 'clear',
    aliases: ['cls'],
    execute: () => {
      return [createOutput('__CLEAR__', 'system')];
    },
  },

  about: {
    name: 'about',
    description: 'About this portfolio',
    usage: 'about',
    execute: () => {
      return [
        createOutput(
          <div className="space-y-4">
            <div className="text-cyan-400 font-bold text-2xl">AI OS Portfolio</div>
            <div className="text-gray-300 space-y-3">
              <p>
                This portfolio is designed as a Linux-inspired operating system,
                showcasing AI engineering skills through an interactive terminal interface.
              </p>
              <p>
                Built with Next.js, TypeScript, and modern web technologies, it
                demonstrates clean architecture, design patterns, and production-grade
                development practices.
              </p>
              <div className="bg-gray-800 p-4 rounded space-y-2">
                <div className="text-yellow-400 font-bold">Architecture Highlights:</div>
                <ul className="list-disc list-inside space-y-1">
                  <li>Command Pattern for extensible terminal commands</li>
                  <li>Clean Architecture with separation of concerns</li>
                  <li>Type-safe TypeScript implementation</li>
                  <li>SEO optimized with dynamic sitemap</li>
                  <li>Responsive and accessible design</li>
                </ul>
              </div>
            </div>
          </div>
        ),
      ];
    },
  },
};

// Command Parser with validation
export class CommandParser {
  private static instance: CommandParser;

  private constructor() {}

  static getInstance(): CommandParser {
    if (!CommandParser.instance) {
      CommandParser.instance = new CommandParser();
    }
    return CommandParser.instance;
  }

  parse(input: string, data: ProfileData): TerminalOutput[] {
    const trimmed = input.trim();

    if (!trimmed) {
      return [];
    }

    // Parse command and arguments
    const parts = trimmed.split(/\s+/);
    const commandName = parts[0].toLowerCase();
    const args = parts.slice(1);

    // Find command (including aliases)
    let command = commands[commandName];

    if (!command) {
      // Check aliases
      for (const cmd of Object.values(commands)) {
        if (cmd.aliases?.includes(commandName)) {
          command = cmd;
          break;
        }
      }
    }

    if (!command) {
      return [
        createOutput(
          `Command '${commandName}' not found. Type 'help' for available commands.`,
          'error'
        ),
      ];
    }

    try {
      return command.execute(args, data);
    } catch (error) {
      return [
        createOutput(
          `Error executing command '${commandName}': ${
            error instanceof Error ? error.message : 'Unknown error'
          }`,
          'error'
        ),
      ];
    }
  }

  getAutocompleteSuggestions(input: string): string[] {
    const trimmed = input.trim().toLowerCase();

    if (!trimmed) {
      return Object.keys(commands);
    }

    const suggestions: string[] = [];

    // Match command names
    for (const [name, cmd] of Object.entries(commands)) {
      if (name.startsWith(trimmed)) {
        suggestions.push(name);
      }
      // Match aliases
      if (cmd.aliases) {
        for (const alias of cmd.aliases) {
          if (alias.startsWith(trimmed)) {
            suggestions.push(alias);
          }
        }
      }
    }

    return suggestions;
  }
}
