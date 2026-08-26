import { useEffect, useState } from "react";
import { NAV } from "../data";
import { scrollToId } from "../hooks";
import { Terminal } from "lucide-react";

export default function Nav({ onPalette }: { onPalette: () => void }) {
  const [active, setActive] = useState("intro");
  const [hovered, setHovered] = useState<string | null>(null);

  useEffect(() => {
    const sections = NAV.map((n) => document.getElementById(n.id)).filter(Boolean) as HTMLElement[];
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: "-40% 0px -50% 0px" }
    );
    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, []);

  return (
    <>
      {/* desktop rail */}
      <nav aria-label="Section navigation" className="fixed right-6 top-1/2 -translate-y-1/2 z-[110] hidden lg:flex flex-col items-end gap-1">
        {NAV.map((n) => (
          <div key={n.id} className="relative flex items-center"
            onMouseEnter={() => setHovered(n.id)} onMouseLeave={() => setHovered(null)}>
            {/* hover preview card */}
            <div
              aria-hidden
              className={`absolute right-[calc(100%+18px)] top-1/2 -translate-y-1/2 w-44 border hairline bg-carbon/95 backdrop-blur-md p-3 transition-all duration-300 origin-right ${
                hovered === n.id ? "opacity-100 scale-100" : "opacity-0 scale-90 pointer-events-none"
              }`}
            >
              <div className="mono text-[9px] tracking-[0.3em] text-signal mb-1.5">{n.n} — {n.label}</div>
              <div className="text-[11px] text-fog leading-snug">{n.hint}</div>
              <div className="mt-2.5 h-8 grid-bg border hairline relative overflow-hidden">
                <span className="absolute inset-0 bg-gradient-to-tr from-transparent via-signal/5 to-signal/10" />
                <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 size-1.5 rounded-full bg-signal" />
              </div>
            </div>
            <button
              onClick={() => scrollToId(n.id)}
              aria-label={`Go to ${n.label}`}
              className="group flex items-center gap-3 py-2"
            >
              <span className={`mono text-[9px] tracking-[0.24em] transition-all duration-300 ${
                active === n.id ? "text-signal" : "text-mist/40 group-hover:text-mist"
              }`}>
                {n.label}
              </span>
              <span className={`h-px transition-all duration-500 ${
                active === n.id ? "w-9 bg-signal" : "w-4 bg-mist/30 group-hover:bg-mist/70"
              }`} />
            </button>
          </div>
        ))}
        <button
          onClick={onPalette}
          aria-label="Open command palette (Ctrl+K)"
          className="mt-3 p-2 border hairline text-mist hover:text-signal hover:border-signal/50 transition-colors"
        >
          <Terminal size={12} strokeWidth={1.5} />
        </button>
      </nav>

      {/* mobile compact */}
      <nav aria-label="Section navigation compact" className="lg:hidden fixed bottom-4 left-1/2 -translate-x-1/2 z-[110] flex items-center gap-1 border hairline bg-carbon/90 backdrop-blur-md rounded-full px-2 py-1.5">
        {NAV.map((n) => (
          <button
            key={n.id}
            onClick={() => scrollToId(n.id)}
            aria-label={n.label}
            className={`px-2.5 py-1 rounded-full mono text-[8px] tracking-[0.2em] transition-colors ${
              active === n.id ? "bg-signal/15 text-signal" : "text-mist"
            }`}
          >
            {n.n}
          </button>
        ))}
      </nav>
    </>
  );
}
