import { useEffect, useState } from "react";
import { Console, useInView, useTicker, prand } from "../../ui";
import { Search, ScanFace, ScanText, FileSearch } from "lucide-react";

type Phase = "idle" | "scanning" | "found";

const MARKERS = [8, 17, 26, 38, 47, 55, 63, 72, 81, 90]; // % positions on timeline
const HIT = 55;

export default function VideoIndexerSim() {
  const { ref, inView } = useInView<HTMLDivElement>(0.3, false);
  const tick = useTicker(inView, 800);
  const [phase, setPhase] = useState<Phase>("idle");
  const [scan, setScan] = useState(0);

  useEffect(() => {
    if (phase !== "scanning") return;
    setScan(0);
    const id = setInterval(() => {
      setScan((s) => {
        if (s >= 100) {
          clearInterval(id);
          setPhase("found");
          return 100;
        }
        return s + 4;
      });
    }, 60);
    return () => clearInterval(id);
  }, [phase]);

  // moving detection boxes (positions re-target each tick; CSS transitions smooth them)
  const boxes = [0, 1, 2].map((i) => ({
    x: 6 + prand(tick * 7 + i * 13) * 68,
    y: 14 + prand(tick * 11 + i * 29) * 46,
    w: 14 + prand(i * 5 + 3) * 10,
    h: 22 + prand(i * 9 + 1) * 18,
  }));

  const playhead = phase === "found" ? HIT : (tick * 2.2) % 100;

  return (
    <div ref={ref}>
      <Console tag="FORENSIC VIDEO INTELLIGENCE" right={phase === "found" ? "MATCH — 94.2%" : "INDEXING LIVE"}>
        <div className="p-4 sm:p-6">
          <div className="relative border hairline bg-void/70 overflow-hidden" style={{ aspectRatio: "16 / 7" }}>
            {/* scene */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_110%,rgba(62,230,255,0.05),transparent_55%),linear-gradient(180deg,rgba(20,23,28,0.9),rgba(10,12,15,0.95))]" />
            <div className="absolute inset-x-0 bottom-0 h-1/3 opacity-30"
              style={{ background: "repeating-linear-gradient(90deg, transparent 0 46px, rgba(237,234,226,0.08) 46px 47px)" }} />
            {/* moving people boxes */}
            {boxes.map((b, i) => (
              <div
                key={i}
                className={`vbox ${phase === "found" && i === 1 ? "" : ""}`}
                style={{ left: `${b.x}%`, top: `${b.y}%`, width: `${b.w}%`, height: `${b.h}%` }}
              >
                <span className="vtag">{i === 0 ? `PERSON 0.9${(tick + i) % 9}` : i === 1 ? (phase === "found" ? "PERSON IDENTIFIED" : "FACE 0.95") : "RE-ID #114"}</span>
                {/* scanning corners */}
                <span className="absolute -inset-px border-t-2 border-signal/0" />
              </div>
            ))}
            {/* OCR tag */}
            <div className="absolute vbox" style={{ right: "8%", top: "12%", width: "20%", height: "14%" }}>
              <span className="vtag">OCR — "LOADING BAY 4"</span>
            </div>
            {/* found highlight */}
            {phase === "found" && (
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute left-[38%] top-[30%] w-[14%] h-[30%] border-2 border-signal glow-signal">
                  <span className="vtag !bg-signal">BLACK JACKET — MATCH 94%</span>
                </div>
              </div>
            )}
            <div className="absolute left-3 top-2.5 mono text-[8px] tracking-[0.25em] text-mist/70">CAM_07 // LOADING_BAY // 02:41:{String(tick % 60).padStart(2, "0")}</div>
            <div className="absolute right-3 top-2.5 mono text-[8px] tracking-[0.25em] text-signal/80">ANTI-SPOOF ✓ DEEPFAKE-SCAN ✓</div>
          </div>

          {/* timeline */}
          <div className="relative mt-4 h-10 border hairline bg-void/50">
            {MARKERS.map((m, i) => (
              <span
                key={i}
                className={`absolute top-1/2 -translate-y-1/2 w-px ${phase === "found" && m === HIT ? "h-7 bg-signal glow-signal" : "h-4 bg-mist/40"}`}
                style={{ left: `${m}%` }}
              />
            ))}
            <span className="absolute top-0 bottom-0 w-px bg-signal transition-[left] duration-500" style={{ left: `${playhead}%` }} />
            <span className="absolute right-2 top-1/2 -translate-y-1/2 mono text-[8px] tracking-[0.2em] text-mist/60">T+ 04:00:00</span>
            {phase === "found" && (
              <span className="absolute -top-5 mono text-[8px] tracking-[0.18em] text-signal" style={{ left: `${HIT}%`, transform: "translateX(-50%)" }}>
                02:41:17 — CITATION
              </span>
            )}
          </div>

          {/* NL search */}
          <div className="mt-4 flex items-stretch gap-2">
            <div className="flex items-center gap-2.5 flex-1 border hairline bg-carbon px-4 py-3">
              <Search size={13} className="text-mist shrink-0" />
              <span className="mono text-[10px] sm:text-[11px] tracking-[0.12em] text-fog/90 truncate">
                find person wearing black jacket
              </span>
            </div>
            <button
              onClick={() => setPhase("scanning")}
              disabled={phase === "scanning"}
              className="border hairline px-5 mono text-[9px] tracking-[0.3em] text-signal hover:bg-signal/10 hover:border-signal/50 transition-colors disabled:opacity-40"
            >
              {phase === "scanning" ? `${scan}%` : "RUN QUERY"}
            </button>
          </div>

          <div className="mt-3 flex items-center gap-4 mono text-[8px] tracking-[0.2em] text-mist/60 overflow-hidden">
            <span className="flex items-center gap-1.5 shrink-0"><ScanFace size={11} className="text-signal/70" /> FACES 1,204</span>
            <span className="flex items-center gap-1.5 shrink-0"><ScanText size={11} className="text-signal/70" /> OCR 342</span>
            <span className="flex items-center gap-1.5 shrink-0"><FileSearch size={11} className="text-signal/70" /> SCENES 96</span>
            <span className="shrink-0 hidden sm:block">RE-ID TRACKS 18</span>
            <span className="shrink-0 hidden md:block">STT SEGMENTS 412</span>
          </div>
        </div>
      </Console>
      <div className="flex flex-wrap gap-2 mt-4">
        {["Face Recognition", "Anti-Spoofing", "Person Re-ID", "Deepfake Detection", "OCR", "Speech-to-Text", "NL / Image RAG", "Timestamped Citations"].map((c) => (
          <span key={c} className="mono text-[9px] tracking-[0.18em] uppercase px-2.5 py-1 border hairline text-mist">{c}</span>
        ))}
      </div>
    </div>
  );
}
