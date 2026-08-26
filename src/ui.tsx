import { ReactNode, useEffect, useRef, useState } from "react";
import { useInView } from "./hooks";

/* ---------- reveal wrapper ---------- */
export function Reveal({
  children, delay = 0, className = "",
}: { children: ReactNode; delay?: number; className?: string }) {
  const { ref, inView } = useInView<HTMLDivElement>(0.12);
  return (
    <div
      ref={ref}
      className={`reveal ${inView ? "on" : ""} ${className}`}
      style={{ ["--d" as string]: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

/* ---------- word-by-word masked reveal for headings ---------- */
export function Words({ text, className = "", stagger = 70, startDelay = 0 }: {
  text: string; className?: string; stagger?: number; startDelay?: number;
}) {
  const { ref, inView } = useInView<HTMLSpanElement>(0.3);
  const words = text.split(" ");
  return (
    <span ref={ref} className={`${inView ? "on" : ""} ${className}`} aria-label={text}>
      {words.map((w, i) => (
        <span key={i} aria-hidden className="word-mask mr-[0.24em] last:mr-0">
          <span style={{ ["--d" as string]: `${startDelay + i * stagger}ms` }}>{w}</span>
        </span>
      ))}
    </span>
  );
}

/* ---------- section shell ---------- */
export function Section({
  id, index, kicker, title, meta, children, className = "",
}: {
  id: string; index: string; kicker: string; title?: ReactNode; meta?: string;
  children: ReactNode; className?: string;
}) {
  return (
    <section id={id} aria-label={kicker} className={`relative px-5 sm:px-10 lg:px-[7vw] py-28 sm:py-36 ${className}`}>
      <header className="mb-14 sm:mb-20">
        <Reveal>
          <div className="flex items-center gap-4 mb-6">
            <span className="mono text-[10px] tracking-[0.34em] text-signal">{index}</span>
            <span className="h-px flex-1 bg-gradient-to-r from-signal/40 to-transparent" />
            <span className="kicker">{kicker}</span>
            {meta && <span className="mono hidden md:block text-[10px] tracking-[0.2em] text-mist/50">{meta}</span>}
          </div>
        </Reveal>
        {title && (
          <h2 className="disp font-medium uppercase leading-[0.95] tracking-tight text-[clamp(2.2rem,6vw,5.5rem)] text-paper">
            {title}
          </h2>
        )}
      </header>
      {children}
    </section>
  );
}

/* ---------- chip ---------- */
export function Chip({ children, active = false }: { children: ReactNode; active?: boolean }) {
  return (
    <span className={`mono text-[10px] tracking-[0.18em] uppercase px-3 py-1.5 border transition-colors duration-300 ${
      active ? "border-signal/60 text-signal bg-signal/5" : "hairline border text-mist hover:text-bone hover:border-bone/30"
    }`}>
      {children}
    </span>
  );
}

/* ---------- console frame for simulations ---------- */
export function Console({ tag, right, children, className = "" }: {
  tag: string; right?: string; children: ReactNode; className?: string;
}) {
  return (
    <div className={`ticks relative overflow-hidden border hairline bg-carbon/80 backdrop-blur-sm ${className}`}>
      <div className="flex items-center justify-between border-b hairline px-4 py-2.5">
        <div className="flex items-center gap-2.5">
          <span className="size-1.5 rounded-full bg-signal anim-pulse-dot" />
          <span className="mono text-[9px] sm:text-[10px] tracking-[0.28em] text-mist">{tag}</span>
        </div>
        {right && <span className="mono text-[9px] sm:text-[10px] tracking-[0.2em] text-signal/80">{right}</span>}
      </div>
      {children}
    </div>
  );
}

/* ---------- SVG flow line with animated dash ---------- */
export function FlowPath({ d, className = "", hot = false }: { d: string; className?: string; hot?: boolean }) {
  return (
    <path
      d={d}
      fill="none"
      stroke={hot ? "rgba(62,230,255,0.65)" : "rgba(237,234,226,0.14)"}
      strokeWidth={hot ? 1.2 : 1}
      className={`${hot ? "flow-line" : ""} ${className}`}
    />
  );
}

/* ---------- toast for easter eggs ---------- */
export function Toast({ msg, show }: { msg: string; show: boolean }) {
  return (
    <div
      role="status"
      className={`fixed left-5 bottom-5 z-[120] border hairline bg-carbon/95 px-4 py-3 mono text-[10px] tracking-[0.14em] text-signal transition-all duration-500 ${
        show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
      }`}
    >
      <span className="text-mist mr-2">SYS://</span>{msg}
    </div>
  );
}

/* ---------- in-view auto ticker (returns tick counter) ---------- */
export function useTicker(active: boolean, ms = 1200) {
  const [tick, setTick] = useState(0);
  useEffect(() => {
    if (!active) return;
    const id = setInterval(() => setTick((t) => t + 1), ms);
    return () => clearInterval(id);
  }, [active, ms]);
  return tick;
}

/* ---------- deterministic pseudo-random ---------- */
export function prand(seed: number) {
  const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
}

export { useInView, useRef, useState, useEffect };
