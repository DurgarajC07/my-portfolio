import { ABOUT_WORDS } from "../data";
import { Section, Reveal, Words, useInView } from "../ui";
import { Users, Compass, Boxes, Rocket } from "lucide-react";

const ROLES = [
  { icon: Compass, t: "RESEARCH & PLANNING", d: "Evaluating models, architectures and trade-offs before a line of code is written." },
  { icon: Boxes, t: "SYSTEM DESIGN", d: "Drawing the blueprint — agents, pipelines, data stores, failure modes." },
  { icon: Users, t: "TEAM LEADERSHIP", d: "Managing engineers and interns at Easemyai — reviews, mentoring, unblocking." },
  { icon: Rocket, t: "DEPLOYMENT & BEYOND", d: "Owning what ships: GPUs, queues, monitoring, iteration." },
];

export default function About() {
  const { ref, inView } = useInView<HTMLDivElement>(0.2);

  return (
    <Section id="about" index="06" kicker="THE OPERATOR" meta="HUMAN LAYER OF THE SYSTEM">
      <h2 className="disp font-medium uppercase leading-[0.98] tracking-tight text-[clamp(2.4rem,7vw,6.4rem)] text-paper max-w-5xl">
        <Words text="I BUILD SYSTEMS" />
        <br />
        <Words text="THAT THINK." className="text-gradient-cool" startDelay={350} />
      </h2>

      <div className="grid lg:grid-cols-12 gap-10 mt-14 sm:mt-20">
        <Reveal className="lg:col-span-5">
          <p className="text-mist font-light leading-relaxed text-sm sm:text-base">
            AI/Backend Engineer with 3+ years designing production-grade Voice AI, Vision AI, GenAI, RAG,
            agentic AI and real-time inference systems. At Easemyai I don't just write the code — I manage
            the team and the interns who ship it, carrying each system from research and planning through
            system design to deployment.
          </p>
          <div className="mt-8 space-y-px">
            {ROLES.map((r, i) => (
              <div key={r.t} className="group flex gap-4 border hairline bg-carbon/40 px-5 py-4 transition-colors duration-300 hover:bg-signal/5">
                <r.icon size={16} strokeWidth={1.25} className="text-signal mt-0.5 shrink-0" />
                <div>
                  <div className="mono text-[10px] tracking-[0.26em] text-bone">{r.t}</div>
                  <div className="mt-1 text-[13px] text-mist font-light leading-relaxed">{r.d}</div>
                </div>
                <span className="mono ml-auto text-[9px] text-mist/40 group-hover:text-signal transition-colors">{String(i + 1).padStart(2, "0")}</span>
              </div>
            ))}
          </div>
        </Reveal>

        {/* the six dimensions */}
        <div className="lg:col-span-7" ref={ref}>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-px bg-steel/40 border hairline">
            {ABOUT_WORDS.map((w, i) => (
              <div
                key={w.w}
                className="group relative bg-void px-5 py-10 sm:py-14 overflow-hidden transition-colors duration-500 hover:bg-carbon"
              >
                <span
                  className={`disp block font-semibold uppercase text-[clamp(1.6rem,3.4vw,2.8rem)] tracking-tight text-paper transition-all duration-700 ${
                    inView ? "opacity-100 translate-y-0 blur-0" : "opacity-0 translate-y-6 blur-sm"
                  } group-hover:text-signal`}
                  style={{ transitionDelay: `${i * 110}ms` }}
                >
                  {w.w}
                </span>
                <span className="mono mt-3 block text-[8px] sm:text-[9px] tracking-[0.18em] text-mist/60 leading-relaxed max-w-[90%]">
                  {w.d.toUpperCase()}
                </span>
                <span aria-hidden className="absolute left-0 bottom-0 h-px w-0 bg-signal transition-all duration-500 group-hover:w-full" />
              </div>
            ))}
          </div>
          <Reveal delay={300}>
            <p className="mt-4 mono text-[9px] tracking-[0.24em] text-mist/50 text-right">
              SIX DIMENSIONS OF THE SAME DISCIPLINE — APPLIED INTELLIGENCE
            </p>
          </Reveal>
        </div>
      </div>
    </Section>
  );
}
