import { useState } from "react";
import { CAP_CHAINS } from "../data";
import { Section, Reveal, Words, Console, useInView } from "../ui";
import { useCountUp, useReducedMotion } from "../hooks";

/* fixed layout for the constellation (percent coords) */
const CHAIN_LAYOUT: Record<string, [number, number][]> = {
  language: [[4, 30], [22, 62], [42, 22], [62, 58], [82, 30]],
  vision: [[10, 62], [34, 26], [50, 66], [70, 24], [88, 62]],
  voice: [[4, 44], [24, 20], [44, 60], [64, 26], [84, 50]],
  backend: [[8, 30], [26, 62], [46, 26], [66, 62], [86, 34]],
};

export default function Intro() {
  const [hovered, setHovered] = useState<{ chain: string; node: number } | null>(null);
  const reduced = useReducedMotion();
  const { ref, inView } = useInView<HTMLSpanElement>(0.4);
  const years = useCountUp(3, inView && !reduced, 900);
  const activeChain = CAP_CHAINS.find((c) => c.id === hovered?.chain);

  return (
    <Section id="intro" index="01" kicker="WHO IS BEHIND THE SYSTEM" meta="CAPABILITY LATTICE // ONLINE">
      {/* statement + giant number */}
      <div className="grid lg:grid-cols-12 gap-10 lg:gap-8 items-end mb-20 sm:mb-28">
        <div className="lg:col-span-4">
          <Reveal>
            <div className="ticks relative border hairline bg-carbon/60 p-6 sm:p-8">
              <span ref={ref} className="disp block font-semibold leading-none text-paper text-[clamp(5rem,12vw,9rem)]">
                {reduced ? 3 : years}
                <span className="text-signal">+</span>
              </span>
              <span className="mono mt-4 block text-[10px] tracking-[0.3em] text-mist leading-relaxed">
                YEARS BUILDING<br />PRODUCTION AI SYSTEMS
              </span>
              <span className="absolute top-4 right-4 mono text-[9px] tracking-[0.2em] text-signal/60">EST. 2023</span>
            </div>
          </Reveal>
        </div>
        <div className="lg:col-span-8">
          <h3 className="disp font-medium uppercase tracking-tight leading-[1.02] text-[clamp(1.6rem,3.6vw,3.2rem)] text-bone/95">
            <Words text="Not someone who uses AI tools —" />
            <br />
            <Words text="an engineer who builds intelligent systems." stagger={60} startDelay={300} className="text-signal" />
          </h3>
          <Reveal delay={350}>
            <p className="mt-6 max-w-xl text-mist font-light leading-relaxed text-sm sm:text-base">
              AI/Backend Engineer specializing in Voice AI, Vision AI, Generative AI, LLMs, RAG, agentic systems,
              computer vision and real-time inference — from system design to deployment, currently leading a team
              of engineers and interns at Easemyai.
            </p>
          </Reveal>
          <Reveal delay={450}>
            <div className="mt-6 flex flex-wrap gap-x-8 gap-y-2 mono text-[9px] tracking-[0.24em] text-mist/70">
              <span>⊙ SPEAKS — VOICE AI</span><span>⊙ SEES — VISION AI</span><span>⊙ REASONS — GENAI / AGENTS</span><span>⊙ SCALES — BACKEND</span>
            </div>
          </Reveal>
        </div>
      </div>

      {/* ---- capability constellation ---- */}
      <Reveal delay={100}>
        <div className="mono text-[9px] tracking-[0.34em] text-mist mb-4 flex items-center gap-3">
          <span className="size-1.5 rounded-full bg-signal anim-pulse-dot" />
          CAPABILITY CONSTELLATION — HOVER A NODE
        </div>
      </Reveal>

      <div className="grid lg:grid-cols-12 gap-6">
        <Reveal className="lg:col-span-8" delay={150}>
          <div className="hidden md:block space-y-4">
            {CAP_CHAINS.map((chain) => {
              const pts = CHAIN_LAYOUT[chain.id];
              const pathD = pts.map((p, i) => `${i ? "L" : "M"} ${p[0]} ${p[1]}`).join(" ");
              const dim = hovered && hovered.chain !== chain.id;
              return (
                <div
                  key={chain.id}
                  className={`relative border hairline bg-carbon/40 h-24 sm:h-28 transition-opacity duration-500 ${dim ? "opacity-25" : "opacity-100"}`}
                >
                  <span className="absolute left-3 top-2.5 mono text-[9px] tracking-[0.3em] text-mist/70">{chain.label}</span>
                  <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 w-full h-full">
                    <path
                      d={pathD} fill="none" vectorEffect="non-scaling-stroke"
                      stroke={hovered?.chain === chain.id ? "rgba(62,230,255,0.5)" : "rgba(237,234,226,0.12)"}
                      strokeWidth="1"
                      className={hovered?.chain === chain.id ? "flow-line" : ""}
                    />
                  </svg>
                  {chain.nodes.map((node, i) => {
                    const [x, y] = pts[i];
                    const active = hovered?.chain === chain.id && hovered.node === i;
                    return (
                      <button
                        key={node.n}
                        onMouseEnter={() => setHovered({ chain: chain.id, node: i })}
                        onFocus={() => setHovered({ chain: chain.id, node: i })}
                        onClick={() => setHovered({ chain: chain.id, node: i })}
                        aria-label={`${node.n} — ${node.d}`}
                        className="absolute -translate-x-1/2 -translate-y-1/2 group/n"
                        style={{ left: `${x}%`, top: `${y}%` }}
                      >
                        <span className={`block rounded-full border transition-all duration-300 ${
                          active ? "size-3.5 border-signal bg-signal/30 glow-signal" : "size-2 border-mist/60 bg-void group-hover/n:border-signal"
                        }`} />
                        <span className={`absolute left-1/2 -translate-x-1/2 top-4 mono text-[9px] tracking-[0.18em] whitespace-nowrap transition-colors duration-300 ${
                          active ? "text-signal" : "text-fog/80"
                        } ${i % 2 ? "top-auto bottom-4" : ""}`}>
                          {node.n}
                        </span>
                      </button>
                    );
                  })}
                </div>
              );
            })}
          </div>

          {/* mobile: compact chains */}
          <div className="md:hidden space-y-3">
            {CAP_CHAINS.map((chain) => (
              <button
                key={chain.id}
                onClick={() => setHovered({ chain: chain.id, node: 0 })}
                className={`w-full text-left border hairline bg-carbon/40 px-4 py-3 transition-opacity ${hovered && hovered.chain !== chain.id ? "opacity-40" : ""}`}
              >
                <span className="mono text-[9px] tracking-[0.3em] text-signal">{chain.label}</span>
                <span className="block mt-1.5 mono text-[10px] text-fog/80 leading-relaxed">
                  {chain.nodes.map((n) => n.n).join("  →  ")}
                </span>
              </button>
            ))}
          </div>
        </Reveal>

        {/* readout */}
        <Reveal className="lg:col-span-4" delay={250}>
          <Console tag="NODE READOUT" right={activeChain ? activeChain.label : "IDLE"} className="h-full min-h-56">
            <div className="p-5 sm:p-6">
              {activeChain && hovered ? (
                <>
                  <div className="disp text-2xl sm:text-3xl font-medium text-paper uppercase tracking-tight">
                    {activeChain.nodes[hovered.node].n}
                  </div>
                  <p className="mt-3 text-sm text-mist font-light leading-relaxed">{activeChain.nodes[hovered.node].d}</p>
                  <div className="mt-5 pt-4 border-t hairline mono text-[9px] tracking-[0.22em] text-fog/70 leading-loose">
                    {activeChain.nodes.map((n, i) => (
                      <span key={n.n} className={i === hovered.node ? "text-signal" : ""}>
                        {n.n}{i < activeChain.nodes.length - 1 ? " → " : ""}
                      </span>
                    ))}
                  </div>
                </>
              ) : (
                <div className="h-full flex flex-col justify-center mono text-[10px] tracking-[0.22em] text-mist/60 leading-loose">
                  <span>AWAITING SIGNAL…</span>
                  <span className="text-signal/60">PROBE ANY NODE TO INSPECT CAPABILITY</span>
                </div>
              )}
            </div>
          </Console>
        </Reveal>
      </div>
    </Section>
  );
}
