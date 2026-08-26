import { useEffect, useRef, useState } from "react";
import { Console, useInView, useTicker } from "../../ui";
import { PhoneCall } from "lucide-react";

const PIPE = ["USER VOICE", "STT · SARVAM", "LLM · MISTRAL", "DIALOGUE MGR", "TTS · STREAM", "RESPONSE"];

export default function VoiceWaveSim() {
  const { ref, inView } = useInView<HTMLDivElement>(0.3, false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const hover = useRef(0);
  const reduced = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const tick = useTicker(inView, 1400);
  const [calls, setCalls] = useState(512);

  useEffect(() => { setCalls(500 + (tick * 7) % 40); }, [tick]);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    let raf = 0, w = 0, h = 0, dpr = 1;
    const build = () => {
      const r = canvas.parentElement!.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 1.75);
      w = r.width; h = r.height;
      canvas.width = w * dpr; canvas.height = h * dpr;
      canvas.style.width = `${w}px`; canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    const draw = (now: number) => {
      const t = now / 1000;
      hover.current *= 0.96;
      ctx.clearRect(0, 0, w, h);
      const mid = h / 2;
      for (let layer = 0; layer < 3; layer++) {
        const amp = (14 + layer * 10) * (1 + hover.current);
        ctx.beginPath();
        for (let x = 0; x <= w; x += 3) {
          const env = Math.sin((x / w) * Math.PI); // taper edges
          const y = mid
            + Math.sin(x * 0.02 + t * (2.1 + layer * 0.4)) * amp * env
            + Math.sin(x * 0.055 - t * 3.2) * amp * 0.4 * env
            + Math.sin(x * 0.011 + t * 1.1) * amp * 0.5 * env;
          x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        }
        ctx.strokeStyle = layer === 0 ? "rgba(62,230,255,0.75)" : layer === 1 ? "rgba(62,230,255,0.3)" : "rgba(237,234,226,0.14)";
        ctx.lineWidth = layer === 0 ? 1.4 : 1;
        ctx.stroke();
      }
      // center particles
      for (let i = 0; i < 26; i++) {
        const x = (i / 26) * w;
        const y = mid + Math.sin(x * 0.02 + t * 2.4) * 22 * Math.sin((x / w) * Math.PI);
        ctx.beginPath();
        ctx.arc(x, y + Math.sin(t * 3 + i) * 5, 1, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(62,230,255,0.35)";
        ctx.fill();
      }
      if (!reduced && inView) raf = requestAnimationFrame(draw);
    };
    build();
    if (reduced) draw(performance.now());
    else if (inView) raf = requestAnimationFrame(draw);
    window.addEventListener("resize", build);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", build); };
  }, [inView, reduced]);

  return (
    <div ref={ref}>
      <Console tag="TELEPHONY VOICE AI // LIVE CHANNELS" right={`${calls} ACTIVE CALLS`}>
        <div className="p-4 sm:p-6">
          <div
            className="relative h-40 sm:h-48 border hairline bg-void/60 overflow-hidden"
            onMouseEnter={() => { hover.current = 1.4; }}
            onTouchStart={() => { hover.current = 1.4; }}
            data-hover
          >
            <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
            <div className="absolute left-3 top-3 flex items-center gap-2 mono text-[8px] tracking-[0.25em] text-mist/70">
              <PhoneCall size={11} className="text-signal" /> MULTI-TURN DIALOGUE · 10+ LANGUAGES
            </div>
            <div className="absolute right-3 top-3 mono text-[8px] tracking-[0.25em] text-signal/80">HOVER TO EXCITE SIGNAL</div>
          </div>

          {/* pipeline */}
          <div className="mt-4 grid grid-cols-3 md:grid-cols-6 gap-px bg-steel/40 border hairline">
            {PIPE.map((p, i) => (
              <div key={p} className={`relative bg-carbon px-2 py-3 text-center ${i === tick % PIPE.length ? "bg-signal/10" : ""}`}>
                <span className={`mono block text-[7px] sm:text-[8px] tracking-[0.16em] ${i === tick % PIPE.length ? "text-signal" : "text-mist/70"}`}>{p}</span>
                <span className={`absolute left-0 bottom-0 h-px bg-signal transition-all duration-500 ${i <= tick % PIPE.length ? "w-full opacity-60" : "w-0"}`} />
              </div>
            ))}
          </div>

          <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-px bg-steel/40 border hairline">
            {[
              ["500+", "CONCURRENT CALLS"], ["95%", "CONVERSATION COMPLETION"], ["10+", "LANGUAGES"], ["<1.5s", "VOICE RESPONSE LATENCY"],
            ].map(([v, l]) => (
              <div key={l} className="bg-carbon px-4 py-4 text-center">
                <div className="disp text-xl sm:text-2xl font-semibold text-paper">{v}</div>
                <div className="mono text-[7px] sm:text-[8px] tracking-[0.18em] text-mist/70 mt-1">{l}</div>
              </div>
            ))}
          </div>
        </div>
      </Console>
      <div className="flex flex-wrap gap-2 mt-4">
        {["FastAPI", "WebSockets", "Async Processing", "Sarvam STT/TTS", "Mistral + RAG", "ChromaDB", "40% Hallucination Reduction"].map((c) => (
          <span key={c} className="mono text-[9px] tracking-[0.18em] uppercase px-2.5 py-1 border hairline text-mist">{c}</span>
        ))}
      </div>
    </div>
  );
}
