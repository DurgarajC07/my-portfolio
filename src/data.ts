/* ---------- Factual source: Durgaraj Chauhan résumé ---------- */

export const META = {
  name: "DURGARAJ CHAUHAN",
  first: "DURGARAJ",
  last: "CHAUHAN",
  title: "AI ENGINEER × BACKEND DEVELOPER",
  statement: "Building intelligent systems that see, hear, reason, and act.",
  location: "Mumbai, Maharashtra 400030",
  email: "durgarajchauhan@gmail.com",
  phone: "+91 82688 74907",
  linkedin: "https://linkedin.com/in/durgaraj-chauhan",
  linkedinLabel: "linkedin.com/in/durgaraj-chauhan",
  github: "https://github.com/DurgarajC07",
  githubLabel: "github.com/DurgarajC07",
  portfolio: "https://durgarajchauhan.vercel.app",
  portfolioLabel: "durgarajchauhan.vercel.app",
};

export const NAV = [
  { id: "intro", n: "01", label: "INTRO", hint: "Capabilities lattice" },
  { id: "stack", n: "02", label: "STACK", hint: "Technology network" },
  { id: "experience", n: "03", label: "LOG", hint: "Career trajectory" },
  { id: "systems", n: "04", label: "SYSTEMS", hint: "Six live builds" },
  { id: "architecture", n: "05", label: "ARCH", hint: "Layered blueprint" },
  { id: "about", n: "06", label: "ABOUT", hint: "The operator" },
  { id: "contact", n: "07", label: "LINK", hint: "Open a channel" },
];

/* ---------- Intro: capability constellation ---------- */
export interface CapNode { n: string; d: string }
export const CAP_CHAINS: { id: string; label: string; desc: string; nodes: CapNode[] }[] = [
  {
    id: "language",
    label: "LANGUAGE",
    desc: "Intent to inference — reasoning systems on private infrastructure.",
    nodes: [
      { n: "LLMs", d: "Llama3, Mistral, Gemma 3, Qwen — deployed locally and in cloud." },
      { n: "RAG", d: "Hybrid retrieval: vector + graph grounding, citations by default." },
      { n: "Agents", d: "Orchestrated multi-agent frameworks — up to 16 agents in production." },
      { n: "Knowledge", d: "Neo4j graph structures + vector indexes for auditable recall." },
      { n: "Inference", d: "GPU-accelerated, cached, parallel — built for latency budgets." },
    ],
  },
  {
    id: "vision",
    label: "VISION",
    desc: "Machines that watch, understand and verify — in real time.",
    nodes: [
      { n: "Vision", d: "Computer vision as a production discipline, not a demo." },
      { n: "YOLO", d: "Real-time detection at 30+ FPS on live RTSP streams." },
      { n: "Video", d: "20+ concurrent streams, 10K+ hours indexed and searchable." },
      { n: "Recognition", d: "Face recognition, anti-spoofing, cross-camera re-identification." },
      { n: "Intelligence", d: "Scene understanding, OCR, deepfake and alert verification." },
    ],
  },
  {
    id: "voice",
    label: "VOICE",
    desc: "Telephony-scale conversational systems.",
    nodes: [
      { n: "Voice", d: "500+ concurrent calls in production telephony." },
      { n: "STT", d: "Sarvam speech-to-text across 10+ languages." },
      { n: "TTS", d: "ElevenLabs + Sarvam synthesis, streamed in chunks." },
      { n: "Streaming", d: "WebSocket audio pipelines tuned end-to-end." },
      { n: "Dialogue", d: "Multi-turn management — 95% conversation completion." },
    ],
  },
  {
    id: "backend",
    label: "BACKBONE",
    desc: "The engineering that makes intelligence survivable in production.",
    nodes: [
      { n: "Backend", d: "Python services designed for scale from day one." },
      { n: "FastAPI", d: "50K+ daily requests served at Reboot Technology." },
      { n: "WebSockets", d: "Async real-time delivery for voice and vision alerts." },
      { n: "Microservices", d: "Isolated, cached, Kafka-connected components." },
      { n: "Scale", d: "60% DB load reduction, 3× throughput, 25% cost cut." },
    ],
  },
];

/* ---------- Stack constellation ---------- */
export interface TechNode { id: string; cat: string; path?: string[] }
export const STACK: TechNode[] = [
  // AI / ML
  { id: "Llama3", cat: "AI/ML" }, { id: "Mistral", cat: "AI/ML", path: ["Mistral", "RAG", "ChromaDB", "FastAPI", "WebSockets"] },
  { id: "Gemma 3", cat: "AI/ML" }, { id: "Qwen", cat: "AI/ML", path: ["Qwen", "RAG", "ChromaDB", "Neo4j", "Agentic AI", "FastAPI"] },
  { id: "RAG", cat: "AI/ML", path: ["RAG", "Embeddings", "Semantic Search", "Vector DBs", "LLMs · grounded"] },
  { id: "Fine-tuning", cat: "AI/ML" }, { id: "LangChain", cat: "AI/ML" }, { id: "LangGraph", cat: "AI/ML" },
  { id: "LlamaIndex", cat: "AI/ML" }, { id: "Hugging Face", cat: "AI/ML" }, { id: "Transformers", cat: "AI/ML" },
  { id: "Embeddings", cat: "AI/ML" }, { id: "Semantic Search", cat: "AI/ML" }, { id: "CrewAI", cat: "AI/ML" },
  { id: "Multi-Agent", cat: "AI/ML" }, { id: "Agentic AI", cat: "AI/ML", path: ["Agentic AI", "LangGraph", "CrewAI", "Multi-Agent", "16-agent orchestration"] },
  // Vision
  { id: "YOLO", cat: "Vision", path: ["YOLO", "OpenCV", "RTSP", "Real-time Inference", "WebSockets"] },
  { id: "OpenCV", cat: "Vision" }, { id: "Face Recognition", cat: "Vision" }, { id: "Object Detection", cat: "Vision" },
  { id: "Video Analytics", cat: "Vision" }, { id: "Real-time Inference", cat: "Vision" }, { id: "RTSP", cat: "Vision" },
  // Speech
  { id: "Sarvam STT", cat: "Speech", path: ["Sarvam STT", "Audio Processing", "Mistral", "Sarvam TTS", "WebSockets"] },
  { id: "ElevenLabs", cat: "Speech" }, { id: "Sarvam TTS", cat: "Speech" }, { id: "Audio Processing", cat: "Speech" },
  // Backend
  { id: "Python", cat: "Backend" }, { id: "FastAPI", cat: "Backend", path: ["FastAPI", "Redis", "PostgreSQL", "Docker", "AWS"] },
  { id: "Django", cat: "Backend" }, { id: "Flask", cat: "Backend" }, { id: "REST APIs", cat: "Backend" },
  { id: "WebSockets", cat: "Backend" }, { id: "Microservices", cat: "Backend" },
  // Frontend
  { id: "React", cat: "Frontend" }, { id: "JavaScript", cat: "Frontend" }, { id: "HTML5", cat: "Frontend" },
  { id: "CSS3", cat: "Frontend" }, { id: "Tailwind", cat: "Frontend" }, { id: "Shadcn UI", cat: "Frontend" },
  // Data
  { id: "PostgreSQL", cat: "Data" }, { id: "MySQL", cat: "Data" }, { id: "SQLite", cat: "Data" },
  { id: "Redis", cat: "Data" }, { id: "ChromaDB", cat: "Data" }, { id: "Qdrant", cat: "Data" },
  { id: "Neo4j", cat: "Data" }, { id: "Vector DBs", cat: "Data" },
  // Cloud / DevOps
  { id: "AWS", cat: "Cloud" }, { id: "Azure", cat: "Cloud" }, { id: "S3", cat: "Cloud" }, { id: "EC2", cat: "Cloud" },
  { id: "Lambda", cat: "Cloud" }, { id: "Docker", cat: "Cloud" }, { id: "Git", cat: "Cloud" }, { id: "Kafka", cat: "Cloud", path: ["Kafka", "Microservices", "Qwen", "Verification Gateway"] },
];

export const STACK_EDGES: [string, string][] = [
  ["Qwen", "RAG"], ["Mistral", "RAG"], ["Llama3", "RAG"], ["Gemma 3", "Transformers"],
  ["RAG", "ChromaDB"], ["RAG", "Qdrant"], ["RAG", "Vector DBs"], ["RAG", "Semantic Search"],
  ["Embeddings", "Semantic Search"], ["Transformers", "Hugging Face"], ["Hugging Face", "Embeddings"],
  ["LangChain", "LangGraph"], ["LangGraph", "Agentic AI"], ["CrewAI", "Multi-Agent"],
  ["Multi-Agent", "Agentic AI"], ["LlamaIndex", "RAG"], ["Fine-tuning", "Hugging Face"],
  ["YOLO", "OpenCV"], ["YOLO", "Object Detection"], ["YOLO", "Real-time Inference"],
  ["OpenCV", "Video Analytics"], ["RTSP", "Real-time Inference"], ["Face Recognition", "Video Analytics"],
  ["Sarvam STT", "Audio Processing"], ["Sarvam TTS", "Audio Processing"], ["ElevenLabs", "Sarvam TTS"],
  ["Python", "FastAPI"], ["FastAPI", "Django"], ["FastAPI", "REST APIs"], ["FastAPI", "WebSockets"],
  ["FastAPI", "Microservices"], ["WebSockets", "Real-time Inference"], ["WebSockets", "Sarvam STT"],
  ["FastAPI", "Redis"], ["FastAPI", "PostgreSQL"], ["FastAPI", "Kafka"], ["Microservices", "Kafka"],
  ["Microservices", "Docker"], ["Docker", "AWS"], ["Docker", "Azure"], ["AWS", "S3"], ["AWS", "EC2"],
  ["AWS", "Lambda"], ["Git", "Docker"], ["Kafka", "Redis"],
  ["React", "JavaScript"], ["React", "Tailwind"], ["React", "Shadcn UI"], ["Tailwind", "CSS3"],
  ["JavaScript", "HTML5"], ["React", "FastAPI"],
  ["Neo4j", "RAG"], ["Neo4j", "Agentic AI"], ["ChromaDB", "Embeddings"], ["Qdrant", "Embeddings"],
  ["PostgreSQL", "MySQL"], ["MySQL", "SQLite"], ["Redis", "PostgreSQL"],
];

export const STACK_CATS = ["AI/ML", "Vision", "Speech", "Backend", "Frontend", "Data", "Cloud"] as const;

/* ---------- Experience ---------- */
export const EXPERIENCE = [
  {
    year: "2023",
    stage: "STAGE I",
    role: "JR. WEB DEVELOPER",
    company: "Reboot Technology Pvt Ltd",
    period: "JUN 2023 — JAN 2025",
    env: "WEB APIS × CLOUD INFRASTRUCTURE × FIRST VISION SYSTEMS",
    points: [
      "Computer-vision services — face recognition + YOLO object detection across 20+ concurrent RTSP streams with frame-skipping and multi-threaded inference.",
      "Azure Video Indexer integration: faces, objects, OCR and scene metadata for 10K+ hours of searchable video.",
      "FastAPI backends serving 50K+ daily requests; Redis caching cut database load by 60%.",
      "Shipped QR attendance with facial verification, a screen-recording Chrome extension, OAuth2.0, Stripe, Twilio and DocuSign integrations.",
    ],
  },
  {
    year: "2025",
    stage: "STAGE II",
    role: "SR. SOFTWARE ENGINEER",
    company: "Anvex AI Technologies Pvt Ltd",
    period: "JAN 2025 — MAR 2026",
    env: "REAL-TIME VISION × TELEPHONY-SCALE VOICE AI",
    points: [
      "Real-time Vision AI — YOLO + OpenCV at 30+ FPS with <500ms inference latency for industrial safety monitoring.",
      "Production Voice AI handling 500+ concurrent telephony calls — FastAPI, WebSockets, 95% conversation completion.",
      "Mistral + RAG over ChromaDB for context-aware responses — hallucination reduced 40%.",
      "Multilingual Sarvam STT/TTS across 10+ languages at <1.5s end-to-end voice latency; document intelligence at 92% accuracy over 1000+ forms.",
    ],
  },
  {
    year: "2026",
    stage: "STAGE III",
    role: "AI ENGINEER · TEAM LEAD",
    company: "Easemyai Pvt Ltd",
    period: "MAR 2026 — PRESENT",
    env: "AGENTIC AI × MULTIMODAL INTELLIGENCE × TEAM LEADERSHIP",
    points: [
      "Leads a team of engineers and interns — owning research, planning, system design and deployment end-to-end, not just the code.",
      "Architected AKRS: local LLMs (Ollama / Qwen2.5-Coder), hybrid RAG (ChromaDB + Neo4j), 16-agent orchestration with citation-backed, auditable responses.",
      "Built the self-hosted Video Indexer Platform — OCR, STT, face recognition with anti-spoofing, person Re-ID, deepfake detection, NL/image RAG search with timestamped citations.",
      "VLM Verification Gateway: Qwen3-VL as judge across 11 vision use cases — Kafka routing, runtime model hot-swapping, fail-open verification.",
    ],
  },
];

/* ---------- Metrics ---------- */
export const METRICS = [
  { v: 50, suffix: "K+", label: "DAILY API REQUESTS", how: "FastAPI + Redis caching — Reboot Technology" },
  { v: 30, suffix: "+ FPS", label: "REAL-TIME VISION", how: "YOLO + OpenCV on live RTSP — Anvex AI" },
  { v: 500, suffix: "+", label: "CONCURRENT CALLS", how: "Async telephony Voice AI — Anvex AI" },
  { v: 10, suffix: "K+ HRS", label: "VIDEO INTELLIGENCE", how: "Azure Video Indexer pipeline — Reboot" },
  { v: 1000, suffix: "+", label: "FORMS PROCESSED", how: "Gemini Vision extraction at 92% accuracy" },
  { v: 3, suffix: "×", label: "THROUGHPUT GAIN", how: "Batching, caching, async scheduling" },
  { v: 60, suffix: "%", label: "DB LOAD REDUCED", how: "Redis cache layer over hot queries" },
  { v: 25, suffix: "%", label: "CLOUD COST CUT", how: "Resource-efficient inference utilization" },
  { v: 40, suffix: "%", label: "HALLUCINATION DROP", how: "RAG grounding in domain conversations" },
];

/* ---------- Architecture layers ---------- */
export const ARCH = [
  { id: "APPLICATION", items: ["React", "FastAPI", "WebSockets"], note: "Interfaces and real-time transports." },
  { id: "INTELLIGENCE", items: ["LLMs", "VLMs", "RAG", "Agents"], note: "Reasoning cores — local and cloud." },
  { id: "AI PIPELINES", items: ["Vision", "Voice", "Video", "Documents"], note: "Modality-specific inference paths." },
  { id: "DATA", items: ["PostgreSQL", "Redis", "ChromaDB", "Qdrant", "Neo4j"], note: "Relational, cache, vector and graph." },
  { id: "INFRASTRUCTURE", items: ["Docker", "AWS", "Azure", "Kafka"], note: "Deployment and event backbones." },
];

/* ---------- Education / certs ---------- */
export const EDUCATION = [
  { degree: "BACHELOR OF ENGINEERING", school: "Saraswati College of Engineering, Kharghar", score: "78.34%", years: "2020 — 2023" },
  { degree: "DIPLOMA IN COMPUTER ENGINEERING", school: "Saraswati Institute of Technology", score: "90.91%", years: "2017 — 2020" },
];

export const CERTS = ["Python Programming", "Docker Containerization", "MVC Architecture", "PSD to HTML"];

export const ABOUT_WORDS = [
  { w: "SEE", d: "vision systems — detection, recognition, verification" },
  { w: "HEAR", d: "voice systems — STT, TTS, streaming dialogue" },
  { w: "REASON", d: "language systems — LLMs, RAG, agents" },
  { w: "SEARCH", d: "knowledge systems — vector + graph retrieval" },
  { w: "ACT", d: "agentic systems — orchestration, automation" },
  { w: "SCALE", d: "engineering systems — caching, queues, GPUs" },
];
