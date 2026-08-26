import { useState } from "react";
import { ARCH } from "../data";
import { Section, Reveal } from "../ui";

export default function Architecture() {
  const [active, setActive] = useState<number | null>(null);

  return (
    <Section
      id="architecture" index="05" kicker="SYSTEM ARCHITECTURE" meta="HOVER A LAYER — TRACE THE FLOW"
      title={<span>THE FULL <span className="text-signal">BLUEPRINT</span></span>}
    >
      <div className="grid lg:grid-cols-12 gap-6 items-stretch">
        <Reveal className="lg:col-span-8" delay={100}>
          <div className="relative ticks border hairline bg-carbon/50">
            {/* vertical packet rail */}
            <div aria-hidden className="absolute left-6 sm:left-9 top-0 bottom-0 w-px bg-steel/70" />
            {active !== null && (
              <span
                aria-hidden
                className="absolute left-6 sm:left-9 -translate-x-1/2 size-2 rounded-full bg-signal glow-signal"
                style={{ animation: `arch-drop 1.6s cubic-bezier(0.4,0,0.6,1) infinite`, top: "4%" }}
              />
            )}
            <style>{`@keyframes arch-drop { 0% { top: 2%; opacity: 0 } 12% { opacity: 1 } 88% { opacity: 1 } 100% { top: 96%; opacity: 0 } }`}</style>

            {ARCH.map((layer, i) => {
              const on = active === i;
              return (
                <button
                  key={layer.id}
                  onMouseEnter={() => setActive(i)}
                  onMouseLeave={() => setActive(null)}
                  onFocus={() => setActive(i)}
                  onBlur={() => setActive(null)}
                  onClick={() => setActive(i)}
                  aria-label={`${layer.id} layer — ${layer.note}`}
                  className={`relative w-full text-left flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-8 pl-16 sm:pl-24 pr-6 py-7 sm:py-8 border-b hairline last:border-b-0 transition-colors duration-500 ${
                    on ? "bg-signal/[0.06]" : active !== null ? "opacity-50" : ""
                  }`}
                >
                  <span className={`absolute left-6 sm:left-9 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border transition-all duration-500 ${
                    on ? "size-3 border-signal bg-signal/40 glow-signal" : "size-2 border-mist/50 bg-void"
                  }`} />
                  <div className="sm:w-52 shrink-0">
                    <div className="mono text-[8px] tracking-[0.3em] text-mist/50 mb-1">LAYER {String(i + 1).padStart(2, "0")}</div>
                    <div className={`disp text-lg sm:text-2xl font-semibold tracking-tight uppercase transition-colors duration-300 ${on ? "text-signal" : "text-paper"}`}>
                      {layer.id}
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {layer.items.map((it) => (
                      <span key={it} className={`mono text-[9px] tracking-[0.16em] uppercase px-2.5 py-1 border transition-colors duration-300 ${
                        on ? "border-signal/50 text-bone" : "hairline border text-mist"
                      }`}>
                        {it}
                      </span>
                    ))}
                  </div>
                  <span className={`mono text-[9px] tracking-[0.16em] ml-auto hidden xl:block max-w-44 text-right leading-relaxed transition-opacity duration-500 ${on ? "opacity-100 text-signal/80" : "opacity-0"}`}>
                    {layer.note.toUpperCase()}
                  </span>
                </button>
              );
            })}
          </div>
        </Reveal>

        <Reveal className="lg:col-span-4" delay={200}>
          <div className="h-full flex flex-col gap-4">
            <div className="flex-1 border hairline bg-carbon/50 p-6 flex flex-col justify-center">
              <div className="mono text-[9px] tracking-[0.3em] text-signal mb-3">DESIGN RULE</div>
              <p className="text-base sm:text-lg text-bone/90 font-light leading-relaxed">
                Every layer is replaceable. Hot-swap the model, switch the vector store, reroute the queue —
                the system doesn't blink.
              </p>
            </div>
            <div className="border hairline bg-carbon/50 p-6">
              <div className="mono text-[9px] tracking-[0.3em] text-signal mb-3">REQUEST PATH</div>
              <div className="mono text-[10px] tracking-[0.14em] text-mist leading-loose">
                CLIENT → FASTAPI → AUTH → {active !== null ? (
                  <span className="text-signal">{ARCH[active].id} → </span>
                ) : null}
                INTELLIGENCE → DATA → RESPONSE
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
