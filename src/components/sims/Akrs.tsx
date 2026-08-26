import { useState } from "react";
import { Console, useInView, useTicker } from "../../ui";

const STAGES = [
  { n: "USER QUERY", d: "Natural-language engineering question enters the system." },
  { n: "INTENT DETECTION", d: "Intent classifier routes the query to the right agent cohort." },
  { n: "AGENT ORCHESTRATION", d: "16 specialized agents fan out — searchers, readers, verifiers, critics." },
  { n: "LOCAL LLM", d: "Ollama / Qwen2.5-Coder reasons fully on-premises. No data leaves." },
  { n: "CHROMA + NEO4J", d: "Hybrid retrieval — vector similarity joined with code knowledge graph." },
  { n: "EVIDENCE", d: "Every claim bound to retrieved, timestamped source evidence." },
  { n: "CITATION", d: "Responses carry file-level citations back to the source." },
  { n: "AUDITABLE RESPONSE", d: "Fully traceable answer. Nothing unverifiable ships." },
];

export default function AkrsSim() {
  const { ref, inView } = useInView<HTMLDivElement>(0.3, false);
  const tick = useTicker(inView, 1400);
  const [sel, setSel] = useState<number | null>(null);
  const auto = tick % STAGES.length;
  const active = sel ?? auto;

  return (
    <div ref={ref}>
      <Console tag="AKRS // AGENTIC KNOWLEDGE RECOVERY" right="16-AGENT ORCHESTRATION">
        <div className="p-4 sm:p-6">
          {/* pipeline: horizontal on xl, grid otherwise */}
          <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-8 gap-px bg-steel/40">
            {STAGES.map((s, i) => {
              const on = i === active;
              const past = i < active;
              return (
                <button
                  key={s.n}
                  onMouseEnter={() => setSel(i)}
                  onMouseLeave={() => setSel(null)}
                  onFocus={() => setSel(i)}
                  onBlur={() => setSel(null)}
                  aria-label={`${s.n} — ${s.d}`}
                  className={`relative bg-carbon px-3 py-5 text-left transition-colors duration-500 group ${
                    on ? "bg-signal/10" : past ? "" : ""
                  }`}
                >
                  <span className={`mono block text-[8px] tracking-[0.2em] mb-2 ${on ? "text-signal" : "text-mist/50"}`}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className={`disp block text-[10px] sm:text-[11px] font-medium tracking-wide uppercase leading-snug ${
                    on ? "text-paper" : "text-fog/80"
                  }`}>
                    {s.n}
                  </span>
                  <span className={`absolute left-0 bottom-0 h-px bg-signal transition-all duration-700 ${on || past ? "w-full" : "w-0"} ${on ? "" : "opacity-40"}`} />
                  {on && <span className="absolute right-2 top-2 size-1.5 rounded-full bg-signal anim-pulse-dot" />}
                </button>
              );
            })}
          </div>

          {/* data packets */}
          <div className="relative h-8 mt-1 overflow-hidden" aria-hidden>
            <div className="absolute inset-x-0 top-1/2 h-px bg-steel/60" />
            {[...Array(3)].map((_, k) => (
              <span
                key={k}
                className="absolute top-1/2 -translate-y-1/2 size-1.5 rounded-full bg-signal"
                style={{ animation: `packet-track 4.2s cubic-bezier(0.4,0,0.6,1) ${k * 1.4}s infinite` }}
              />
            ))}
            <style>{`@keyframes packet-track { 0% { left: -2%; opacity: 0 } 8% { opacity: 1 } 92% { opacity: 1 } 100% { left: 102%; opacity: 0 } }`}</style>
          </div>

          {/* readout + stats */}
          <div className="mt-4 grid sm:grid-cols-2 gap-4">
            <div className="border hairline bg-void/50 p-4 min-h-24">
              <div className="mono text-[9px] tracking-[0.3em] text-signal mb-1.5">STAGE {String(active + 1).padStart(2, "0")} — {STAGES[active].n}</div>
              <p className="text-[13px] text-mist font-light leading-relaxed">{STAGES[active].d}</p>
            </div>
            <div className="grid grid-cols-2 gap-px bg-steel/40">
              {[
                ["16", "AGENTS"], ["HYBRID", "RAG · VECTOR+GRAPH"], ["100%", "CITED RESPONSES"], ["0", "DATA EGRESS"],
              ].map(([v, l]) => (
                <div key={l} className="bg-carbon px-4 py-3 flex flex-col justify-center">
                  <span className="disp text-xl sm:text-2xl font-semibold text-paper">{v}</span>
                  <span className="mono text-[8px] tracking-[0.22em] text-mist/70 mt-0.5">{l}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Console>
      <div className="flex flex-wrap gap-2 mt-4">
        {["Ollama", "Qwen2.5-Coder", "ChromaDB", "Neo4j", "Hybrid RAG", "Citation-Backed", "Local LLMs", "Auditable"].map((c) => (
          <span key={c} className="mono text-[9px] tracking-[0.18em] uppercase px-2.5 py-1 border hairline text-mist">{c}</span>
        ))}
      </div>
    </div>
  );
}
