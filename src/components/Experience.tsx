import { EXPERIENCE } from "../data";
import { Words } from "../ui";
import { useScrollProgress } from "../hooks";
import { Users, Radar, Crown } from "lucide-react";

/* per-stage environment motif */
function Motif({ stage, active }: { stage: number; active: boolean }) {
  const base = "absolute inset-0 transition-opacity duration-700";
  if (stage === 0)
    return (
      <div aria-hidden className={`${base} ${active ? "opacity-100" : "opacity-0"}`}>
        <div className="absolute inset-0 grid-bg" />
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 size-56 border border-dashed border-signal/25 rounded-full anim-spin-slow" />
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 size-80 border border-bone/10 rounded-full anim-spin-rev" />
        <div className="absolute left-[18%] top-[22%] mono text-[9px] tracking-[0.25em] text-mist/60 anim-drift">REST / 50K+ REQ</div>
        <div className="absolute right-[14%] top-[64%] mono text-[9px] tracking-[0.25em] text-mist/60 anim-drift" style={{ animationDelay: "-3s" }}>REDIS —60% LOAD</div>
        <div className="absolute left-[24%] bottom-[16%] mono text-[9px] tracking-[0.25em] text-mist/60 anim-drift" style={{ animationDelay: "-6s" }}>RTSP × 20</div>
      </div>
    );
  if (stage === 1)
    return (
      <div aria-hidden className={`${base} ${active ? "opacity-100" : "opacity-0"}`}>
        <div className="absolute inset-0 grid-bg" />
        <div className="absolute inset-x-0 h-px bg-signal/40" style={{ animation: "scan-y 3.4s linear infinite" }} />
        <div className="absolute left-[10%] top-[30%] border border-signal/50 size-16 anim-float">
          <span className="vtag mono text-[8px] text-signal absolute -top-4 left-0">30+ FPS</span>
        </div>
        <div className="absolute right-[16%] top-[52%] border border-amber-400/50 w-24 h-14 anim-float" style={{ animationDelay: "-2s" }}>
          <span className="mono text-[8px] text-amber-300/90 absolute -top-4 left-0">ALERT &lt;500MS</span>
        </div>
        <div className="absolute left-[30%] bottom-[18%] flex items-end gap-1 h-10">
          {Array.from({ length: 18 }, (_, i) => (
            <span key={i} className="w-1 bg-signal/50" style={{ height: `${20 + Math.abs(Math.sin(i * 1.7)) * 80}%`, animation: `drift 2s ease-in-out ${i * -0.14}s infinite` }} />
          ))}
        </div>
      </div>
    );
  return (
    <div aria-hidden className={`${base} ${active ? "opacity-100" : "opacity-0"}`}>
      <div className="absolute inset-0 grid-bg" />
      {Array.from({ length: 9 }, (_, i) => {
        const a = (i / 9) * Math.PI * 2;
        return (
          <div key={i} className="absolute left-1/2 top-1/2" style={{ transform: `translate(${Math.cos(a) * 120}px, ${Math.sin(a) * 84}px)` }}>
            <span className="block size-2 rounded-full bg-signal/70 anim-pulse-dot" style={{ animationDelay: `${i * 0.24}s` }} />
          </div>
        );
      })}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 size-3 rounded-full bg-paper glow-signal" />
      <div className="absolute right-[12%] top-[20%] mono text-[9px] tracking-[0.25em] text-signal/70 anim-drift">16-AGENT ORCHESTRATION</div>
      <div className="absolute left-[12%] bottom-[22%] mono text-[9px] tracking-[0.25em] text-mist/60 anim-drift" style={{ animationDelay: "-4s" }}>QWEN × NEO4J × CHROMA</div>
    </div>
  );
}

const STAGE_ICONS = [Radar, Users, Crown];

export default function Experience() {
  const { ref, progress } = useScrollProgress<HTMLDivElement>();
  const stageF = progress * EXPERIENCE.length;
  const stage = Math.min(EXPERIENCE.length - 1, Math.floor(stageF));

  return (
    <section id="experience" aria-label="Experience" ref={ref} className="relative" style={{ height: `${EXPERIENCE.length * 130 + 60}vh` }}>
      <div className="sticky top-0 h-screen overflow-hidden flex flex-col px-5 sm:px-10 lg:px-[7vw] py-14 sm:py-24">
        <header className="mb-4 sm:mb-10">
          <div className="flex items-center gap-4 mb-4 sm:mb-5">
            <span className="mono text-[10px] tracking-[0.34em] text-signal">03</span>
            <span className="h-px flex-1 bg-gradient-to-r from-signal/40 to-transparent" />
            <span className="kicker">EXECUTION LOG — SCROLL TO TRAVEL</span>
          </div>
          <h2 className="disp font-medium uppercase leading-[0.95] tracking-tight text-[clamp(1.7rem,5.4vw,4.6rem)] text-paper">
            <Words text="THREE VERSIONS OF" /> <Words text="THE ENGINEER" className="text-signal" startDelay={250} />
          </h2>
        </header>

        {/* environments */}
        <div className="absolute inset-0 -z-0">
          {[0, 1, 2].map((s) => <Motif key={s} stage={s} active={stage === s} />)}
          <div className="absolute inset-0 bg-gradient-to-b from-void via-transparent to-void" />
        </div>

        <div className="relative flex-1 grid lg:grid-cols-12 gap-8 items-center min-h-0">
          {/* rail */}
          <div className="hidden lg:flex lg:col-span-2 flex-col gap-0 relative">
            <span className="absolute left-[5px] top-2 bottom-2 w-px bg-steel" />
            <span
              className="absolute left-[5px] top-2 w-px bg-signal transition-[height] duration-200"
              style={{ height: `calc(${(progress * 100).toFixed(1)}% - 8px)` }}
            />
            {EXPERIENCE.map((e, i) => {
              const Icon = STAGE_ICONS[i];
              const on = stage === i;
              return (
                <div key={e.year} className={`relative pl-10 py-8 transition-opacity duration-500 ${on ? "opacity-100" : "opacity-35"}`}>
                  <span className={`absolute left-0 top-1/2 -translate-y-1/2 size-[11px] rounded-full border transition-colors duration-500 ${on ? "bg-signal border-signal glow-signal" : "bg-void border-steel"}`} />
                  <div className="mono text-[10px] tracking-[0.3em] text-mist">{e.stage}</div>
                  <div className={`disp text-3xl font-semibold mt-1 transition-colors duration-500 ${on ? "text-paper" : "text-mist/60"}`}>{e.year}</div>
                  <Icon size={14} strokeWidth={1.5} className={`mt-2 ${on ? "text-signal" : "text-mist/40"}`} />
                </div>
              );
            })}
          </div>

          {/* content stack */}
          <div className="lg:col-span-10 relative">
            {EXPERIENCE.map((e, i) => {
              const on = stage === i;
              return (
                <article
                  key={e.year}
                  aria-hidden={!on}
                  className={`${i === 0 ? "relative" : "absolute inset-0"} flex flex-col justify-center transition-all duration-700 ${
                    on ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 translate-y-8 pointer-events-none"
                  }`}
                >
                  <div className="flex items-baseline gap-4 flex-wrap">
                    <span className="disp font-semibold leading-none text-[clamp(2.9rem,9vw,8rem)] text-paper/95">{e.year}</span>
                    <span className="mono text-[9px] sm:text-[10px] tracking-[0.3em] text-signal">{e.period}</span>
                  </div>
                  <h3 className="disp mt-3 sm:mt-4 text-xl sm:text-4xl font-medium uppercase tracking-tight text-bone">
                    {e.role}
                  </h3>
                  <div className="mono mt-2 text-[10px] sm:text-sm tracking-[0.24em] text-mist">{e.company.toUpperCase()} — MUMBAI</div>
                  <div className="mono mt-1.5 text-[8px] sm:text-[10px] tracking-[0.3em] text-signal/70">{e.env}</div>
                  <ul className="mt-4 sm:mt-7 max-w-3xl space-y-2 sm:space-y-3">
                    {e.points.map((p, j) => (
                      <li key={j} className="flex gap-3 text-[12.5px] sm:text-[15px] text-fog/90 font-light leading-snug sm:leading-relaxed">
                        <span className="mono text-signal/70 text-[10px] mt-1 sm:mt-1.5 shrink-0">{String(j + 1).padStart(2, "0")}</span>
                        {p}
                      </li>
                    ))}
                  </ul>
                  {/* intra-stage progress */}
                  <div className="mt-5 sm:mt-8 h-px w-full max-w-3xl bg-steel/70 overflow-hidden">
                    <div
                      className="h-full bg-signal/70 transition-[width] duration-150"
                      style={{ width: `${Math.min(1, Math.max(0, stageF - i)) * 100}%` }}
                    />
                  </div>
                </article>
              );
            })}
          </div>
        </div>

        {/* bottom ticker */}
        <div className="relative flex justify-between mono text-[9px] tracking-[0.3em] text-mist/50 pt-4 border-t hairline">
          <span>DOCKET {String(stage + 1).padStart(2, "0")} / 03</span>
          <span className="hidden sm:block">{EXPERIENCE[stage].stage} — {EXPERIENCE[stage].env}</span>
          <span>{Math.round(progress * 100)}%</span>
        </div>
      </div>
    </section>
  );
}
