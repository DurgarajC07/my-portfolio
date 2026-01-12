# Architecture Diagrams

## System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                      USER BROWSER                            │
└─────────────────────┬───────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────┐
│                   NEXT.JS APP ROUTER                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Layout     │  │     Page     │  │   Sitemap    │      │
│  │  (Metadata)  │  │   (SSR)      │  │  (Dynamic)   │      │
│  └──────────────┘  └───────┬──────┘  └──────────────┘      │
└────────────────────────────┼─────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────┐
│                  DATA LAYER (JSON)                           │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              data/profile.json                        │   │
│  │  • Personal Info  • Skills    • Projects             │   │
│  │  • Experience     • Education • Logs                 │   │
│  └──────────────────────────────────────────────────────┘   │
└────────────────────────────┬────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────┐
│              TERMINAL COMPONENT (Client)                     │
│  ┌─────────────────────────────────────────────────────┐    │
│  │  State Management                                    │    │
│  │  • outputs[]  • input  • history[]  • suggestions    │    │
│  └─────────────────────────────────────────────────────┘    │
│  ┌─────────────────────────────────────────────────────┐    │
│  │  Event Handlers                                      │    │
│  │  • handleCommand()  • handleKeyDown()  • focus()     │    │
│  └─────────────────────────────────────────────────────┘    │
└────────────────────────────┬────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────┐
│              COMMAND PARSER (Singleton)                      │
│  ┌─────────────────────────────────────────────────────┐    │
│  │  parse(input, data) → TerminalOutput[]              │    │
│  │  • Parse command + args                              │    │
│  │  • Validate input                                    │    │
│  │  • Resolve aliases                                   │    │
│  │  • Execute command                                   │    │
│  └─────────────────────────────────────────────────────┘    │
└────────────────────────────┬────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────┐
│              COMMAND REGISTRY                                │
│  ┌────────┬────────┬────────┬────────┬────────┬────────┐   │
│  │  help  │whoami  │ skills │  exp   │projects│  logs  │   │
│  ├────────┼────────┼────────┼────────┼────────┼────────┤   │
│  │  edu   │contact │ about  │ clear  │  ...   │  ...   │   │
│  └────────┴────────┴────────┴────────┴────────┴────────┘   │
│  Each command: { name, description, usage, execute() }      │
└─────────────────────────────────────────────────────────────┘
```

## Command Execution Flow

```
User Types Command
       │
       ▼
┌──────────────────┐
│  Input Handler   │
│  • Validation    │
│  • History       │
│  • Autocomplete  │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ Command Parser   │
│  • Split args    │
│  • Find command  │
│  • Check aliases │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ Command Execute  │
│  • Access data   │
│  • Process logic │
│  • Generate JSX  │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│  Output Factory  │
│  • Create object │
│  • Set type      │
│  • Add timestamp │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ Terminal Display │
│  • Render output │
│  • Update state  │
│  • Scroll down   │
└──────────────────┘
```

## Data Structure

```
ProfileData
├── personal
│   ├── name
│   ├── title
│   ├── bio
│   └── contact info
├── skills
│   ├── ai_ml[]
│   ├── backend[]
│   ├── frontend[]
│   └── devops[]
├── experience[]
│   ├── company
│   ├── position
│   ├── responsibilities[]
│   ├── achievements[]
│   └── technologies[]
├── projects[]
│   ├── name
│   ├── description
│   ├── technologies[]
│   ├── features[]
│   ├── challenges[]
│   └── impact{}
├── education[]
│   ├── degree
│   ├── institution
│   └── highlights[]
└── logs[]
    ├── timestamp
    ├── level
    ├── service
    └── message
```

## Component Hierarchy

```
RootLayout
└── Home (page.tsx)
    └── Terminal
        ├── Header (window chrome)
        ├── Output Display
        │   ├── WelcomeMessage
        │   ├── CommandEcho
        │   ├── CommandOutput
        │   └── ErrorMessage
        ├── Suggestions
        │   └── SuggestionChip[]
        ├── Input
        │   ├── Prompt ($)
        │   ├── InputField
        │   └── Cursor
        └── Footer (system info)
```

## Command Pattern Implementation

```
┌──────────────────────────────────────────┐
│           Command Interface              │
│  {                                       │
│    name: string                          │
│    description: string                   │
│    usage: string                         │
│    aliases?: string[]                    │
│    execute: (args, data) => Output[]     │
│  }                                       │
└──────────────────┬───────────────────────┘
                   │ implements
                   │
        ┌──────────┴──────────┐
        │                     │
   ┌────▼────┐          ┌────▼────┐
   │ HelpCmd │          │ WhoAmICmd│
   │         │          │          │
   │execute()│          │execute() │
   └─────────┘          └──────────┘
        │                     │
        └──────────┬──────────┘
                   │
         ┌─────────▼──────────┐
         │   More Commands    │
         │  (skills, exp,     │
         │   projects, etc)   │
         └────────────────────┘
```

## SEO Architecture

```
┌─────────────────────────────────────┐
│          page.tsx                   │
│  ┌──────────────────────────────┐   │
│  │   metadata (Metadata)        │   │
│  │   • title                    │   │
│  │   • description              │   │
│  │   • keywords                 │   │
│  │   • openGraph                │   │
│  │   • twitter                  │   │
│  │   • robots                   │   │
│  └──────────────────────────────┘   │
└─────────────────────────────────────┘
              │
              ├─────────────────────┐
              │                     │
    ┌─────────▼──────┐    ┌────────▼─────┐
    │  sitemap.ts    │    │  robots.ts   │
    │  (Dynamic)     │    │  (Static)    │
    │                │    │              │
    │  • Homepage    │    │  • Allow all │
    │  • Projects    │    │  • Sitemap   │
    └────────────────┘    └──────────────┘
```

## State Management Flow

```
Terminal Component State
┌─────────────────────────────────────┐
│  outputs: TerminalOutput[]          │
│  input: string                      │
│  commandHistory: string[]           │
│  historyIndex: number               │
│  suggestions: string[]              │
└─────────────────┬───────────────────┘
                  │
        ┌─────────┴──────────┐
        │                    │
    ┌───▼───┐          ┌─────▼─────┐
    │ Input │          │  Display  │
    │Change │          │  Outputs  │
    └───┬───┘          └─────▲─────┘
        │                    │
        │    ┌───────────┐   │
        └────▶  Command  ├───┘
             │ Execution │
             └───────────┘
```

## Deployment Architecture

```
┌──────────────────────────────────────────┐
│          Developer Machine               │
│  ┌────────────────────────────────┐     │
│  │    git push origin main        │     │
│  └────────────┬───────────────────┘     │
└───────────────┼──────────────────────────┘
                │
                ▼
┌──────────────────────────────────────────┐
│           GitHub Repository              │
│  ┌────────────────────────────────┐     │
│  │     Webhook triggers deploy    │     │
│  └────────────┬───────────────────┘     │
└───────────────┼──────────────────────────┘
                │
                ▼
┌──────────────────────────────────────────┐
│            Vercel Platform               │
│  ┌────────────────────────────────┐     │
│  │  1. Clone repository           │     │
│  │  2. npm install                │     │
│  │  3. npm run build              │     │
│  │  4. Deploy to CDN              │     │
│  └────────────┬───────────────────┘     │
└───────────────┼──────────────────────────┘
                │
                ▼
┌──────────────────────────────────────────┐
│           Production URL                 │
│     https://your-portfolio.vercel.app    │
└──────────────────────────────────────────┘
```

## Extension Points

```
Current Architecture
┌────────────────────────────────┐
│  JSON → Parser → Commands      │
└────────────────────────────────┘

Future: Add AI Agent
┌────────────────────────────────┐
│  JSON → Parser → Commands      │
│             ↓                  │
│        AI Command              │
│             ↓                  │
│    FastAPI Backend             │
│             ↓                  │
│    RAG System (Vector DB)      │
│             ↓                  │
│        LLM Response            │
└────────────────────────────────┘

Future: Add CMS
┌────────────────────────────────┐
│  CMS API → Parser → Commands   │
│  (Contentful, Sanity, etc)     │
└────────────────────────────────┘

Future: Add Authentication
┌────────────────────────────────┐
│  Auth → Protected Commands     │
│  (NextAuth, Clerk, etc)        │
└────────────────────────────────┘
```

## Performance Optimization

```
Build Time
┌────────────────────────────────┐
│  Static Generation             │
│  • Pre-render homepage         │
│  • Generate sitemap            │
│  • Optimize assets             │
│  Result: Fast First Load       │
└────────────────────────────────┘

Runtime
┌────────────────────────────────┐
│  Client-Side Hydration         │
│  • Interactive terminal        │
│  • Command execution           │
│  • State management            │
│  Result: Smooth UX             │
└────────────────────────────────┘

CDN
┌────────────────────────────────┐
│  Edge Distribution             │
│  • Cache static assets         │
│  • Global availability         │
│  • Low latency                 │
│  Result: Fast Worldwide        │
└────────────────────────────────┘
```

---

These diagrams visualize the complete architecture, data flow, and design patterns used in the AI OS Portfolio system.
