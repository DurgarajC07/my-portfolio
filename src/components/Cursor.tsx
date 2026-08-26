import { useEffect, useRef, useState } from "react";

type CursorMode = "default" | "explore" | "link";

export default function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [mode, setMode] = useState<CursorMode>("default");
  const [label, setLabel] = useState("");
  const [fine, setFine] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(pointer: fine)");
    setFine(mq.matches);
    if (!mq.matches) return;
    document.documentElement.classList.add("cursor-none-root");

    let mx = -100, my = -100, rx = -100, ry = -100;
    let raf = 0;

    const onMove = (e: MouseEvent) => { mx = e.clientX; my = e.clientY; };
    const loop = () => {
      rx += (mx - rx) * 0.16;
      ry += (my - ry) * 0.16;
      if (dotRef.current) dotRef.current.style.transform = `translate(${mx}px, ${my}px)`;
      if (ringRef.current) ringRef.current.style.transform = `translate(${rx}px, ${ry}px)`;
      raf = requestAnimationFrame(loop);
    };

    const onOver = (e: MouseEvent) => {
      const t = e.target as HTMLElement;
      const explore = t.closest<HTMLElement>("[data-cursor]");
      if (explore) {
        setMode("explore");
        setLabel(explore.dataset.cursor === "explore" ? "EXPLORE SYSTEM" : (explore.dataset.cursor || "").toUpperCase());
        return;
      }
      if (t.closest("a, button, [role='button'], input, [data-hover]")) { setMode("link"); return; }
      setMode("default");
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mouseover", onOver, { passive: true });
    raf = requestAnimationFrame(loop);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", onOver);
      cancelAnimationFrame(raf);
      document.documentElement.classList.remove("cursor-none-root");
    };
  }, []);

  if (!fine) return null;

  return (
    <>
      {/* precision dot */}
      <div ref={dotRef} className="fixed top-0 left-0 z-[200] pointer-events-none mix-blend-difference">
        <div className="-translate-x-1/2 -translate-y-1/2 size-1.5 rounded-full bg-white" />
      </div>
      {/* trailing target ring */}
      <div ref={ringRef} className="fixed top-0 left-0 z-[199] pointer-events-none">
        <div
          className={`-translate-x-1/2 -translate-y-1/2 flex items-center justify-center rounded-full border transition-all duration-300 ease-out ${
            mode === "explore"
              ? "size-24 border-signal/70 bg-signal/5 backdrop-blur-[2px]"
              : mode === "link"
              ? "size-10 border-bone/60"
              : "size-7 border-bone/25"
          }`}
        >
          {mode === "explore" && (
            <span className="mono text-[8px] tracking-[0.22em] text-signal text-center leading-relaxed px-2">
              {label || "EXPLORE SYSTEM"}
            </span>
          )}
          {mode === "link" && <span className="font-mono text-[11px] text-bone -translate-y-px">↗</span>}
        </div>
      </div>
    </>
  );
}
