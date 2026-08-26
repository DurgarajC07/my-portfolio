import { useEffect, useRef } from "react";
import { META } from "../data";
import { scrollToId, useReducedMotion } from "../hooks";
import { ChevronDown, MousePointer2 } from "lucide-react";

/* =========================================================
   Neural field canvas — field dust + lattice + interactive core
   ========================================================= */
interface P { x: number; y: number; vx: number; vy: number; r: number }
interface LNode { ax: number; ay: number; ph: number; sp: number; ring: number }

function NeuralField({ reduced, booted }: { reduced: boolean; booted: boolean }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const mouse = useRef({ x: -999, y: -999 });

  useEffect(() => {
    const canvas = ref.current!;
    const ctx = canvas.getContext("2d")!;
    let w = 0, h = 0, dpr = 1, raf = 0, running = true;
    let field: P[] = [];
    let lattice: LNode[] = [];
    let neighbors: [number, number][] = [];
    const t0 = performance.now();

    const build = () => {
      const rect = canvas.parentElement!.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 1.75);
      w = rect.width; h = rect.height;
      canvas.width = w * dpr; canvas.height = h * dpr;
      canvas.style.width = `${w}px`; canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const nField = Math.min(650, Math.floor((w * h) / 2400));
      field = Array.from({ length: nField }, () => ({
        x: Math.random() * w, y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.16, vy: (Math.random() - 0.5) * 0.16,
        r: Math.random() * 1.1 + 0.3,
      }));

      // lattice: rings of nodes around center
      lattice = [];
      const rings = Math.max(4, Math.min(7, Math.floor(w / 220)));
      for (let ring = 1; ring <= rings; ring++) {
        const rad = ring * Math.min(w, h) * 0.085 + 40;
        const count = 6 + ring * 4;
        for (let i = 0; i < count; i++) {
          const a = (i / count) * Math.PI * 2 + ring * 0.42;
          lattice.push({
            ax: Math.cos(a) * rad * (0.9 + Math.random() * 0.25),
            ay: Math.sin(a) * rad * (0.72 + Math.random() * 0.25),
            ph: Math.random() * Math.PI * 2,
            sp: 0.2 + Math.random() * 0.5,
            ring,
          });
        }
      }
      neighbors = [];
      for (let i = 0; i < lattice.length; i++) {
        for (let j = i + 1; j < lattice.length; j++) {
          const dx = lattice[i].ax - lattice[j].ax;
          const dy = lattice[i].ay - lattice[j].ay;
          const d2 = dx * dx + dy * dy;
          const maxD = Math.min(w, h) * 0.16;
          if (d2 < maxD * maxD && Math.abs(lattice[i].ring - lattice[j].ring) <= 1) neighbors.push([i, j]);
        }
      }
    };

    const nodePos = (n: LNode, t: number, cx: number, cy: number) => ({
      x: cx + n.ax + Math.sin(t * n.sp + n.ph) * 7,
      y: cy + n.ay + Math.cos(t * n.sp * 0.8 + n.ph) * 7,
    });

    const frame = (now: number) => {
      if (!running) return;
      const t = (now - t0) / 1000;
      const cx = w / 2, cy = h * 0.46;
      const m = mouse.current;
      const dMouse = Math.hypot(m.x - cx, m.y - cy);
      const energy = Math.max(0, 1 - dMouse / (Math.min(w, h) * 0.55));

      ctx.clearRect(0, 0, w, h);

      // ambient core glow
      const gr = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.min(w, h) * (0.34 + energy * 0.1));
      gr.addColorStop(0, `rgba(62,230,255,${0.05 + energy * 0.07})`);
      gr.addColorStop(0.55, "rgba(62,230,255,0.014)");
      gr.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = gr;
      ctx.fillRect(0, 0, w, h);

      // field dust
      for (const p of field) {
        p.x += p.vx; p.y += p.vy;
        const dx = p.x - m.x, dy = p.y - m.y;
        const md = Math.hypot(dx, dy);
        if (md < 130 && md > 0.01) { p.x += (dx / md) * 0.7; p.y += (dy / md) * 0.7; }
        if (p.x < -4) p.x = w + 4; if (p.x > w + 4) p.x = -4;
        if (p.y < -4) p.y = h + 4; if (p.y > h + 4) p.y = -4;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(180,195,210,${0.12 + p.r * 0.1})`;
        ctx.fill();
      }

      // lattice connections
      for (const [i, j] of neighbors) {
        const a = nodePos(lattice[i], t, cx, cy);
        const b = nodePos(lattice[j], t, cx, cy);
        const midX = (a.x + b.x) / 2, midY = (a.y + b.y) / 2;
        const md = Math.hypot(midX - m.x, midY - m.y);
        const lit = Math.max(0, 1 - md / 240) * 0.35;
        const energized = energy * (1 - Math.abs(lattice[i].ring - 2) * 0.18);
        ctx.beginPath();
        ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y);
        ctx.strokeStyle = `rgba(62,230,255,${0.03 + lit + energized * 0.13})`;
        ctx.lineWidth = 0.6;
        ctx.stroke();
      }

      // lattice nodes
      for (const n of lattice) {
        const p = nodePos(n, t, cx, cy);
        const md = Math.hypot(p.x - m.x, p.y - m.y);
        const lit = Math.max(0, 1 - md / 200);
        ctx.beginPath();
        ctx.arc(p.x, p.y, 1.1 + lit * 1.6, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(62,230,255,${0.16 + lit * 0.6 + energy * 0.15})`;
        ctx.fill();
      }

      // data lines from core to nearest nodes when active
      if (energy > 0.06) {
        ctx.save();
        ctx.setLineDash([3, 9]);
        ctx.lineDashOffset = -t * 60;
        const sorted = lattice
          .map((n, i) => ({ i, d: Math.abs(Math.hypot(n.ax, n.ay) - 120) }))
          .sort((a, b) => a.d - b.d)
          .slice(0, 7);
        for (const s of sorted) {
          const p = nodePos(lattice[s.i], t, cx, cy);
          ctx.beginPath();
          ctx.moveTo(cx, cy); ctx.lineTo(p.x, p.y);
          ctx.strokeStyle = `rgba(62,230,255,${energy * 0.30})`;
          ctx.lineWidth = 0.7;
          ctx.stroke();
        }
        ctx.restore();
      }

      // ---- AI CORE ----
      const coreR = 34 * (1 + Math.sin(t * 1.6) * 0.035 + energy * 0.22);
      ctx.save();
      ctx.translate(cx, cy);
      // outer dashed rings
      for (let k = 0; k < 3; k++) {
        ctx.save();
        ctx.rotate((t * (0.12 + k * 0.07)) * (k % 2 ? -1 : 1));
        ctx.beginPath();
        const rad = coreR + 26 + k * 17;
        ctx.setLineDash([2 + k, 12 + k * 5]);
        ctx.arc(0, 0, rad, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(62,230,255,${0.10 + energy * 0.30 - k * 0.028})`;
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.restore();
      }
      // ring satellites
      for (let k = 0; k < 4; k++) {
        const a = t * 0.35 * (k % 2 ? -1 : 1) + (k * Math.PI) / 2;
        const rad = coreR + 26 + (k % 3) * 17;
        ctx.beginPath();
        ctx.arc(Math.cos(a) * rad, Math.sin(a) * rad, 1.6 + energy * 1.4, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(62,230,255,${0.5 + energy * 0.5})`;
        ctx.fill();
      }
      // processor diamond
      ctx.save();
      ctx.rotate(Math.PI / 4 + t * 0.06);
      ctx.strokeStyle = `rgba(237,234,226,${0.5 + energy * 0.5})`;
      ctx.lineWidth = 1;
      ctx.strokeRect(-coreR * 0.62, -coreR * 0.62, coreR * 1.24, coreR * 1.24);
      ctx.rotate(-t * 0.14);
      ctx.strokeStyle = `rgba(62,230,255,${0.4 + energy * 0.6})`;
      ctx.strokeRect(-coreR * 0.34, -coreR * 0.34, coreR * 0.68, coreR * 0.68);
      ctx.restore();
      // nucleus
      const nr = 3.5 + Math.sin(t * 3) * 0.8 + energy * 4;
      const ng = ctx.createRadialGradient(0, 0, 0, 0, 0, nr * 4);
      ng.addColorStop(0, `rgba(240,255,255,${0.9})`);
      ng.addColorStop(0.4, `rgba(62,230,255,${0.5 + energy * 0.3})`);
      ng.addColorStop(1, "rgba(62,230,255,0)");
      ctx.beginPath();
      ctx.arc(0, 0, nr * 4, 0, Math.PI * 2);
      ctx.fillStyle = ng;
      ctx.fill();
      ctx.restore();

      if (!reduced) raf = requestAnimationFrame(frame);
    };

    const onMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };

    build();
    if (reduced) frame(performance.now());
    else raf = requestAnimationFrame(frame);

    const io = new IntersectionObserver(([e]) => {
      running = e.isIntersecting && booted;
      if (running && !reduced) { cancelAnimationFrame(raf); raf = requestAnimationFrame(frame); }
    });
    io.observe(canvas);

    window.addEventListener("resize", build);
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      running = false;
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener("resize", build);
      window.removeEventListener("pointermove", onMove);
    };
  }, [reduced, booted]);

  return <canvas ref={ref} aria-hidden className="absolute inset-0" />;
}

/* =========================================================
   Hero section
   ========================================================= */
export default function Hero({ booted, onSecret }: { booted: boolean; onSecret: () => void }) {
  const reduced = useReducedMotion();
  const contentRef = useRef<HTMLDivElement>(null);
  const clicks = useRef<{ n: number; t: number }>({ n: 0, t: 0 });

  // scroll fade
  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const p = Math.min(1, window.scrollY / window.innerHeight);
        if (contentRef.current) {
          contentRef.current.style.opacity = `${1 - p * 1.5}`;
          contentRef.current.style.transform = `translateY(${p * 90}px) scale(${1 - p * 0.06})`;
        }
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => { window.removeEventListener("scroll", onScroll); cancelAnimationFrame(raf); };
  }, []);

  const onSectionClick = (e: React.MouseEvent<HTMLElement>) => {
    const el = e.currentTarget.getBoundingClientRect();
    const dx = e.clientX - (el.left + el.width / 2);
    const dy = e.clientY - (el.top + el.height * 0.46);
    if (Math.hypot(dx, dy) < 150) {
      const now = performance.now();
      clicks.current = now - clicks.current.t < 900 ? { n: clicks.current.n + 1, t: now } : { n: 1, t: now };
      if (clicks.current.n >= 3) { clicks.current = { n: 0, t: 0 }; onSecret(); }
      else scrollToId("intro");
    }
  };

  return (
    <section id="hero" aria-label="Introduction" onClick={onSectionClick} className="relative h-[100svh] overflow-hidden select-none">
      <div className="absolute inset-0 grid-bg" />
      {booted && <NeuralField reduced={reduced} booted={booted} />}

      <div ref={contentRef} className={`relative z-10 h-full flex flex-col items-center justify-center text-center px-6 pointer-events-none ${booted ? "on" : ""}`}>
        <p className="word-mask mb-6">
          <span style={{ ["--d" as string]: "250ms" }} className="mono text-[9px] sm:text-[11px] tracking-[0.5em] text-signal/90">
            SYS://PORTFOLIO — v3.2.1
          </span>
        </p>
        <h1 className="disp font-semibold uppercase tracking-[-0.02em] leading-[0.92] text-paper text-[clamp(2.6rem,10vw,8.6rem)]">
          <span className="word-mask block"><span style={{ ["--d" as string]: "420ms" }}>{META.first}</span></span>
          <span className="word-mask block"><span style={{ ["--d" as string]: "560ms" }} className="text-gradient-cool">{META.last}</span></span>
        </h1>
        <p className="word-mask mt-7">
          <span style={{ ["--d" as string]: "760ms" }} className="mono text-[10px] sm:text-xs tracking-[0.34em] text-fog">
            AI ENGINEER <span className="text-signal mx-1">×</span> BACKEND DEVELOPER
          </span>
        </p>
        <p className="word-mask mt-4 max-w-md">
          <span style={{ ["--d" as string]: "900ms" }} className="text-sm sm:text-base text-mist font-light">
            {META.statement}
          </span>
        </p>
      </div>

      {/* bottom HUD */}
      <div className={`absolute z-20 inset-x-0 bottom-0 px-5 sm:px-10 pb-6 sm:pb-8 transition-opacity duration-1000 ${booted ? "opacity-100" : "opacity-0"}`}>
        <div className="flex items-end justify-between gap-4">
          <div className="mono text-[8px] sm:text-[9px] tracking-[0.3em] text-mist/60 hidden sm:block leading-relaxed">
            NODE — LAT 19.0760 / LON 72.8777<br />MUMBAI × IST
          </div>
          <button
            onClick={(e) => { e.stopPropagation(); scrollToId("intro"); }}
            data-cursor="initialize experience"
            className="group pointer-events-auto mx-auto sm:mx-0 flex flex-col items-center gap-3"
            aria-label="Initialize experience — scroll to introduction"
          >
            <span className="relative flex items-center gap-2.5 border hairline px-6 py-3 mono text-[9px] sm:text-[10px] tracking-[0.4em] text-fog group-hover:text-signal group-hover:border-signal/60 transition-colors duration-500">
              <MousePointer2 size={11} strokeWidth={1.5} className="text-signal" />
              INITIALIZE EXPERIENCE
              <span className="absolute inset-0 border border-signal/0 group-hover:border-signal/25 scale-105 transition-all duration-500" />
            </span>
            <span className="flex items-center gap-2 mono text-[8px] tracking-[0.3em] text-mist/50">
              <ChevronDown size={10} className="animate-bounce" /> MOVE TO EXPLORE
            </span>
          </button>
          <div className="mono text-[8px] sm:text-[9px] tracking-[0.3em] text-mist/60 hidden sm:block text-right leading-relaxed">
            CORE — <span className="text-signal">ACTIVE</span><br />CLICK CORE TO ENTER
          </div>
        </div>
      </div>

      {/* vignette */}
      <div aria-hidden className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(7,8,10,0.75)_100%)]" />
    </section>
  );
}
