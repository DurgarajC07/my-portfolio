import { useCallback, useEffect, useRef, useState } from "react";
import Loader from "./components/Loader";
import Cursor from "./components/Cursor";
import Nav from "./components/Nav";
import Hero from "./components/Hero";
import Intro from "./components/Intro";
import Stack from "./components/Stack";
import Experience from "./components/Experience";
import Projects from "./components/Projects";
import Metrics from "./components/Metrics";
import Architecture from "./components/Architecture";
import Education from "./components/Education";
import About from "./components/About";
import Contact from "./components/Contact";
import { Toast } from "./ui";
import { initLenis, scrollToId, useReducedMotion } from "./hooks";
import { NAV } from "./data";
import { Search, ArrowUpRight } from "lucide-react";

/* ---------- command palette ---------- */
function Palette({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [q, setQ] = useState("");
  const [sel, setSel] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const items = NAV.filter((n) => n.label.toLowerCase().includes(q.toLowerCase()) || n.id.includes(q.toLowerCase()));

  useEffect(() => {
    if (open) {
      setQ(""); setSel(0);
      setTimeout(() => inputRef.current?.focus(), 40);
    }
  }, [open]);

  const go = (id: string) => { onClose(); setTimeout(() => scrollToId(id), 60); };

  if (!open) return null;
  return (
    <div role="dialog" aria-modal aria-label="Command palette"
      className="fixed inset-0 z-[140] flex items-start justify-center pt-[16vh] px-4 bg-void/70 backdrop-blur-sm"
      onClick={onClose}>
      <div className="w-full max-w-md border hairline bg-carbon shadow-2xl" onClick={(e) => e.stopPropagation()}
        style={{ animation: "boot-line 0.25s both" }}>
        <div className="flex items-center gap-3 border-b hairline px-4 py-3">
          <Search size={13} className="text-signal" />
          <input
            ref={inputRef}
            value={q}
            onChange={(e) => { setQ(e.target.value); setSel(0); }}
            onKeyDown={(e) => {
              if (e.key === "ArrowDown") { e.preventDefault(); setSel((s) => Math.min(items.length - 1, s + 1)); }
              if (e.key === "ArrowUp") { e.preventDefault(); setSel((s) => Math.max(0, s - 1)); }
              if (e.key === "Enter" && items[sel]) go(items[sel].id);
              if (e.key === "Escape") onClose();
            }}
            placeholder="JUMP TO SECTION…"
            className="flex-1 bg-transparent mono text-[11px] tracking-[0.24em] text-bone placeholder:text-mist/40 focus:outline-none"
          />
          <span className="mono text-[8px] tracking-[0.2em] text-mist/50 border hairline px-1.5 py-0.5">ESC</span>
        </div>
        <div className="py-1 max-h-64 overflow-auto">
          {items.map((n, i) => (
            <button
              key={n.id}
              onClick={() => go(n.id)}
              onMouseEnter={() => setSel(i)}
              aria-selected={sel === i}
              className="palette-item w-full flex items-center gap-4 px-4 py-2.5 text-left"
            >
              <span className="mono text-[9px] tracking-[0.2em] text-signal/70 w-6">{n.n}</span>
              <span className="mono text-[10px] tracking-[0.26em] text-bone/90">{n.label}</span>
              <span className="mono text-[8px] text-mist/50 ml-auto tracking-[0.14em]">{n.hint.toUpperCase()}</span>
              <ArrowUpRight size={11} className="text-mist/40" />
            </button>
          ))}
          {items.length === 0 && (
            <div className="px-4 py-6 mono text-[10px] tracking-[0.24em] text-mist/50 text-center">NO MATCHING SECTOR</div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ---------- data-stream divider ---------- */
function StreamDivider({ items }: { items: string[] }) {
  return (
    <div aria-hidden className="relative border-y hairline bg-carbon/40 overflow-hidden py-3">
      <div className="flex whitespace-nowrap" style={{ animation: "marquee-x 30s linear infinite" }}>
        {[0, 1].map((dup) => (
          <span key={dup} className="flex">
            {items.map((it) => (
              <span key={it + dup} className="mono text-[9px] tracking-[0.34em] text-mist/50 px-8 flex items-center gap-8 shrink-0">
                {it} <span className="text-signal/50">◆</span>
              </span>
            ))}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ---------- app ---------- */
export default function App() {
  const reduced = useReducedMotion();
  const [booted, setBooted] = useState(false);
  const [palette, setPalette] = useState(false);
  const [toast, setToast] = useState<{ msg: string; show: boolean }>({ msg: "", show: false });
  const toastTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => { initLenis(!reduced); }, [reduced]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPalette((p) => !p);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const showToast = useCallback((msg: string) => {
    clearTimeout(toastTimer.current);
    setToast({ msg, show: true });
    toastTimer.current = setTimeout(() => setToast((t) => ({ ...t, show: false })), 4200);
  }, []);

  return (
    <main className="relative bg-void text-bone min-h-screen">
      {!booted && <Loader reduced={reduced} onDone={() => setBooted(true)} />}
      <div className="noise-layer" aria-hidden />
      <Cursor />
      {booted && <Nav onPalette={() => setPalette(true)} />}
      <Palette open={palette} onClose={() => setPalette(false)} />
      <Toast msg={toast.msg} show={toast.show} />

      <Hero
        booted={booted}
        onSecret={() => showToast("curiosity.log → 'Good instinct. That is the entire job description.'")}
      />

      <StreamDivider items={["VISION 30+ FPS", "VOICE 500+ CALLS", "AGENTS ×16", "RAG · VECTOR+GRAPH", "INFERENCE <500MS", "MUMBAI → PRODUCTION"]} />
      <Intro />
      <Stack />
      <Experience />
      <StreamDivider items={["PROJECT 01 — AKRS", "PROJECT 02 — VIDEO INDEXER", "PROJECT 03 — VLM GATEWAY", "PROJECT 04 — VISION AI", "PROJECT 05 — VOICE AI", "PROJECT 06 — DOC INTELLIGENCE"]} />
      <Projects />
      <Metrics />
      <Architecture />
      <Education />
      <About />
      <Contact />

      {/* hint chip */}
      <div className="fixed left-5 bottom-5 z-[105] hidden lg:flex items-center gap-2 mono text-[8px] tracking-[0.26em] text-mist/40 pointer-events-none">
        <span className="border hairline px-1.5 py-0.5">CTRL K</span> COMMAND PALETTE
      </div>
    </main>
  );
}
