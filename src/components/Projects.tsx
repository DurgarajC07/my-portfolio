import { ReactNode } from "react";
import { Section, Reveal } from "../ui";
import AkrsSim from "./sims/Akrs";
import VideoIndexerSim from "./sims/VideoIndexer";
import VlmGatewaySim from "./sims/VlmGateway";
import VisionLabSim from "./sims/VisionLab";
import VoiceWaveSim from "./sims/VoiceWave";
import DocScanSim from "./sims/DocScan";

interface P {
  n: string; id: string; title: string; sub: string; org: string;
  desc: string; sim: ReactNode;
}

const PROJECTS: P[] = [
  {
    n: "01", id: "AKRS", title: "AGENTIC KNOWLEDGE RECOVERY SYSTEM",
    sub: "16 agents. Hybrid RAG. Auditable intelligence.",
    org: "EASEMYAI · 2026",
    desc: "A code-intelligence platform where a 16-agent orchestra — running fully on local LLMs — answers engineering questions with evidence, citations and zero data egress.",
    sim: <AkrsSim />,
  },
  {
    n: "02", id: "VDP", title: "VIDEO INDEXER PLATFORM",
    sub: "Forensic, self-hosted, multimodal video intelligence.",
    org: "EASEMYAI · 2026",
    desc: "Ask 'find the person in the black jacket' — the system searches faces, OCR, speech, scenes and re-identification tracks, then answers with timestamped citations.",
    sim: <VideoIndexerSim />,
  },
  {
    n: "03", id: "VVG", title: "VLM VERIFICATION GATEWAY",
    sub: "A vision-language model that judges other AIs.",
    org: "EASEMYAI · 2026",
    desc: "Eleven computer-vision use cases stream alerts through Kafka into a Qwen3-VL judge — fail-open, hot-swappable, every decision audited to persistence.",
    sim: <VlmGatewaySim />,
  },
  {
    n: "04", id: "RTV", title: "REAL-TIME VISION AI",
    sub: "Industrial safety at 30+ frames per second.",
    org: "ANVEX AI · 2025",
    desc: "YOLO + OpenCV pipelines watching live RTSP streams with sub-500ms inference, firing socket-delivered alerts before incidents become accidents.",
    sim: <VisionLabSim />,
  },
  {
    n: "05", id: "VAI", title: "VOICE AI PLATFORM",
    sub: "500+ conversations happening at once.",
    org: "ANVEX AI · 2025",
    desc: "Telephony-scale voice agents — FastAPI, WebSockets, multilingual STT/TTS in 10+ languages, closing conversations at a 95% completion rate.",
    sim: <VoiceWaveSim />,
  },
  {
    n: "06", id: "DOC", title: "DOCUMENT INTELLIGENCE",
    sub: "Paper in, structured truth out.",
    org: "ANVEX AI · 2025",
    desc: "PDFs, DOCX and images flow through a vision pipeline that extracted 1000+ forms at 92% accuracy and fed them straight into batch voice automation.",
    sim: <DocScanSim />,
  },
];

function ProjectBlock({ p }: { p: P }) {
  return (
    <article className="grid lg:grid-cols-12 gap-8 lg:gap-10 items-start py-16 sm:py-24 border-t hairline first:border-t-0" aria-label={p.title}>
      <div className="lg:col-span-4 lg:sticky lg:top-28">
        <Reveal>
          <div className="mono text-[10px] tracking-[0.3em] text-signal mb-4">
            PROJECT {p.n} <span className="text-mist/50">/ {p.id}</span>
          </div>
          <h3 className="disp text-2xl sm:text-3xl xl:text-[2.1rem] font-medium uppercase leading-[1.05] tracking-tight text-paper">
            {p.title}
          </h3>
          <p className="mono mt-3 text-[10px] sm:text-[11px] tracking-[0.2em] text-signal/80 leading-relaxed">{p.sub.toUpperCase()}</p>
          <p className="mt-5 text-sm sm:text-[15px] text-mist font-light leading-relaxed">{p.desc}</p>
          <div className="mt-6 flex items-center gap-3 mono text-[9px] tracking-[0.28em] text-mist/60">
            <span className="size-1 rounded-full bg-signal/70" />{p.org}
          </div>
        </Reveal>
      </div>
      <div className="lg:col-span-8">
        <Reveal delay={120} className="lg:hover:-translate-y-1 transition-transform duration-700" >
          <div data-cursor="explore">{p.sim}</div>
        </Reveal>
      </div>
    </article>
  );
}

export default function Projects() {
  return (
    <Section
      id="systems" index="04" kicker="SYSTEMS I BUILT" meta="LIVE SIMULATIONS // NOT SCREENSHOTS"
      title={<span>SIX SYSTEMS,<br />RUNNING <span className="text-signal">IN THIS PAGE</span></span>}
      className="!pb-16 sm:!pb-24"
    >
      <Reveal>
        <p className="max-w-2xl text-mist font-light text-sm sm:text-base leading-relaxed -mt-6 mb-4">
          Each build below is rendered as a working miniature of the real architecture — probe the stages,
          run the query, watch the gateway decide.
        </p>
      </Reveal>
      <div>
        {PROJECTS.map((p) => <ProjectBlock key={p.id} p={p} />)}
      </div>
    </Section>
  );
}
