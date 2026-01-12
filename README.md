# AI OS Portfolio

An interactive, terminal-based portfolio showcasing AI engineering and full-stack development expertise through a unique Linux-inspired interface.

## 🚀 Features

- **Terminal Interface** - Command-driven navigation mimicking a Linux terminal
- **Clean Architecture** - Implements Command Pattern and SOLID principles
- **Dynamic Data** - Portfolio content loaded from JSON files
- **SEO Optimized** - Full metadata, Open Graph, and dynamic sitemap
- **Type-Safe** - Built with TypeScript for robust development
- **Responsive Design** - Works seamlessly on all devices

## 🛠️ Tech Stack

- **Framework:** Next.js 14+ (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Architecture:** Clean Architecture, Command Pattern
- **Data:** JSON-based dynamic content

## 📂 Project Structure

```
my-portfolio/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Root layout with SEO
│   ├── page.tsx           # Home page with Terminal
│   ├── sitemap.ts         # Dynamic sitemap
│   └── robots.ts          # Robots.txt configuration
├── components/            # React components
│   └── Terminal.tsx       # Terminal UI component
├── lib/                   # Core logic
│   ├── types.ts          # TypeScript type definitions
│   └── commands.tsx      # Command Parser & Command implementations
├── data/                  # Dynamic data
│   └── profile.json      # Portfolio data
└── public/               # Static assets
```

## 💻 Available Commands

Type these commands in the terminal interface:

- `help` - Display all available commands
- `whoami` - About me and current focus
- `skills [category]` - Display technical skills (ai, backend, frontend, devops)
- `experience [company]` - Work experience details
- `projects [name]` - Portfolio projects
- `education` - Educational background
- `logs [level]` - Career timeline as system logs
- `contact` - Contact information
- `about` - About this portfolio
- `clear` - Clear terminal screen

## 🏗️ Architecture Highlights

### Command Pattern

Extensible command system where each command implements the `Command` interface:

```typescript
interface Command {
  name: string;
  description: string;
  usage: string;
  aliases?: string[];
  execute: (args: string[], data: ProfileData) => TerminalOutput[];
}
```

### Clean Architecture

- **Separation of Concerns** - UI, business logic, and data are decoupled
- **Type Safety** - Comprehensive TypeScript interfaces
- **Extensibility** - Easy to add new commands or modify existing ones
- **Testability** - Pure functions and dependency injection

### Design Patterns Used

1. **Singleton** - CommandParser instance
2. **Command Pattern** - Terminal command system
3. **Factory Pattern** - Output creation
4. **Observer Pattern** - React state management

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd my-portfolio
```

2. Install dependencies:

```bash
npm install
```

3. Run the development server:

```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Build for Production

```bash
npm run build
npm start
```

## 📊 Data Structure

Portfolio content is stored in `data/profile.json`:

```json
{
  "personal": { ... },
  "skills": { ... },
  "experience": [ ... ],
  "projects": [ ... ],
  "education": [ ... ],
  "logs": [ ... ]
}
```

To customize the portfolio, simply update the JSON file with your own data.

## 🎨 Customization

### Adding New Commands

1. Add command definition in `lib/commands.tsx`:

```typescript
myCommand: {
  name: 'mycommand',
  description: 'Description',
  usage: 'mycommand [args]',
  execute: (args, data) => {
    // Implementation
    return [createOutput('Result')];
  }
}
```

2. The command is automatically available in the terminal!

### Styling

- Global styles: `app/globals.css`
- Component styles: Tailwind CSS classes in components
- Theme colors: Modify CSS variables in `globals.css`

## 🔍 SEO Features

- ✅ Dynamic metadata with Next.js Metadata API
- ✅ Open Graph tags for social sharing
- ✅ Twitter Card support
- ✅ Structured data markup
- ✅ Dynamic sitemap generation
- ✅ Robots.txt configuration
- ✅ Semantic HTML structure

## 📈 Performance

- Server-side rendering with Next.js
- Static generation where possible
- Optimized bundle size
- Fast terminal rendering

## 🚢 Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import project in Vercel
3. Deploy automatically

### Other Platforms

Build the production bundle:

```bash
npm run build
```

Then deploy the `.next` folder with a Node.js environment.

## 🎯 Interview-Ready Explanation

**Why I Built This:**
To demonstrate AI engineering expertise through an interactive, memorable experience rather than a static portfolio.

**Architecture:**
Uses Clean Architecture with the Command Pattern for terminal commands, making it extensible and maintainable. Each command is a self-contained module implementing a common interface.

**AI/Engineering Focus:**
The terminal metaphor shows systems thinking. The architecture demonstrates design patterns, SOLID principles, and production-grade code organization.

**Scaling Considerations:**

- Commands are lazy-loaded
- Data can be moved to a CMS or API
- Terminal history can be persisted
- Analytics can track command usage

## 📝 License

MIT License - feel free to use this as inspiration for your own portfolio!

## 👤 Author

**Durgaraj Chauhan**

- Senior Software Engineer & Full-Stack AI Engineer
- Specializing in RAG systems, LLMs, and production AI applications

---

Built with ❤️ using Next.js, TypeScript, and Clean Architecture principles
