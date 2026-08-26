import { useEffect, useState } from "react";

const LINES = [
  { t: "VISION", d: "READY" },
  { t: "VOICE", d: "READY" },
  { t: "LANGUAGE", d: "READY" },
  { t: "KNOWLEDGE", d: "READY" },
  { t: "SYSTEM", d: "ONLINE" },
];

export default function Loader({ onDone, reduced }: { onDone: () => void; reduced: boolean }) {
  const [progress, setProgress] = useState(0);
  const [exit, setExit] = useState(false);

  useEffect(() => {
    const total = reduced ? 900 : 2100;
    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / total);
      setProgress(p);
      if (p < 1) raf = requestAnimationFrame(tick);
      else {
        setExit(true);
        setTimeout(onDone, 650);
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [onDone, reduced]);

  const visibleLines = Math.floor(progress * (LINES.length + 0.99));

  return (
    <div
      aria-hidden
      className={`fixed inset-0 z-[150] bg-void flex items-center justify-center transition-transform duration-700 ease-[cubic-bezier(0.76,0,0.24,1)] ${
        exit ? "-translate-y-full" : ""
      }`}
    >
      <div className="w-[min(420px,84vw)]">
        <div className="mono text-[10px] tracking-[0.4em] text-mist mb-8 flex items-center gap-3">
          <span className="size-1.5 rounded-full bg-signal anim-pulse-dot" />
          INITIALIZING INTELLIGENCE
        </div>
        <div className="space-y-2.5">
          {LINES.map((l, i) => (
            <div
              key={l.t}
              className="flex items-baseline mono text-[11px] tracking-[0.2em]"
              style={{
                opacity: i < visibleLines ? 1 : 0.12,
                animation: i < visibleLines ? "boot-line 0.5s cubic-bezier(0.22,1,0.36,1) both" : "none",
              }}
            >
              <span className="text-fog w-28">{l.t}</span>
              <span className="flex-1 border-b border-dotted border-steel mx-3 -translate-y-1" />
              <span className={l.d === "ONLINE" ? "text-signal" : "text-mist"}>{l.d}</span>
            </div>
          ))}
        </div>
        <div className="mt-8 h-px bg-steel overflow-hidden">
          <div className="h-full bg-signal transition-[width] duration-100" style={{ width: `${progress * 100}%` }} />
        </div>
        <div className="mt-3 flex justify-between mono text-[9px] tracking-[0.3em] text-mist/60">
          <span>DCHAUHAN.SYS</span>
          <span>{Math.round(progress * 100).toString().padStart(3, "0")}%</span>
        </div>
      </div>
    </div>
  );
}
