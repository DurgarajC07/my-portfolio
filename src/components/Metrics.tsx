import { METRICS } from "../data";
import { Section, Reveal, useInView } from "../ui";
import { useCountUp, useReducedMotion } from "../hooks";

function MetricCell({ m, i, active, reduced }: { m: (typeof METRICS)[number]; i: number; active: boolean; reduced: boolean }) {
  const v = useCountUp(m.v, active && !reduced, 1500 + i * 120);
  return (
    <div className="group relative bg-void px-5 sm:px-7 py-8 sm:py-10 overflow-hidden transition-colors duration-500 hover:bg-carbon">
      <div className="mono text-[8px] tracking-[0.3em] text-mist/50 mb-4 flex justify-between">
        <span>MTX.{String(i + 1).padStart(2, "0")}</span>
        <span className="opacity-0 group-hover:opacity-100 transition-opacity text-signal/70">VERIFIED</span>
      </div>
      <div className="disp font-semibold text-paper leading-none text-[clamp(2.4rem,5vw,4.2rem)] tracking-tight">
        <span style={{ animation: active ? `flicker-digit ${2.4 + (i % 4) * 0.3}s linear ${i * 0.2}s infinite` : "none" }}>
          {(reduced ? m.v : v).toLocaleString()}
        </span>
        <span className="text-signal text-[0.55em] align-top ml-0.5">{m.suffix}</span>
      </div>
      <div className="mono mt-3 text-[9px] sm:text-[10px] tracking-[0.26em] text-fog/90">{m.label}</div>
      {/* hover provenance */}
      <div className="absolute inset-x-0 bottom-0 translate-y-full group-hover:translate-y-0 transition-transform duration-500 bg-carbon/95 border-t hairline px-5 sm:px-7 py-2.5">
        <span className="mono text-[8px] tracking-[0.18em] text-signal/80">{m.how.toUpperCase()}</span>
      </div>
      <span className="absolute left-0 top-0 w-px h-full bg-gradient-to-b from-signal/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    </div>
  );
}

export default function Metrics() {
  const { ref, inView } = useInView<HTMLDivElement>(0.25);
  const reduced = useReducedMotion();
  return (
    <Section
      id="metrics" index="04·B" kicker="ENGINEERING METRICS — BUILT FOR SCALE" meta="COMPUTED FROM PRODUCTION LOGS"
      title={<span>NUMBERS THAT <span className="text-signal">SURVIVED</span> PRODUCTION</span>}
    >
      <Reveal>
        <div ref={ref} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-px bg-steel/40 border hairline">
          {METRICS.map((m, i) => (
            <MetricCell key={m.label} m={m} i={i} active={inView} reduced={reduced} />
          ))}
        </div>
      </Reveal>
      <Reveal delay={150}>
        <p className="mt-6 mono text-[9px] tracking-[0.24em] text-mist/50 text-right">
          HOVER A METRIC TO SEE HOW IT WAS EARNED — NO VANITY STATISTICS
        </p>
      </Reveal>
    </Section>
  );
}
