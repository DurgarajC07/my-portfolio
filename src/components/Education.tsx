import { EDUCATION, CERTS } from "../data";
import { Section, Reveal } from "../ui";
import { GraduationCap, BadgeCheck, Globe } from "lucide-react";

export default function Education() {
  return (
    <Section id="education" index="05·B" kicker="ENGINEERING FOUNDATION" meta="ACADEMIC RECORD"
      title={<span>FOUNDATION <span className="text-signal">BLUEPRINTS</span></span>}
    >
      <div className="grid lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 space-y-px">
          {EDUCATION.map((e, i) => (
            <Reveal key={e.degree} delay={i * 120}>
              <div className="group relative border hairline bg-carbon/50 p-6 sm:p-10 overflow-hidden">
                {/* architectural draft marks */}
                <span aria-hidden className="absolute right-6 top-6 size-16 sm:size-24 border border-dashed border-signal/20 rounded-full transition-transform duration-700 group-hover:rotate-90" />
                <span aria-hidden className="absolute right-12 top-12 size-4 sm:size-8 border border-signal/30 transition-transform duration-700 group-hover:rotate-45" />
                <div className="flex items-start gap-4">
                  <GraduationCap size={18} strokeWidth={1.25} className="text-signal mt-1.5 shrink-0" />
                  <div>
                    <h3 className="disp text-xl sm:text-3xl font-medium uppercase tracking-tight text-paper leading-tight">{e.degree}</h3>
                    <p className="mono mt-3 text-[10px] sm:text-xs tracking-[0.2em] text-mist">{e.school.toUpperCase()}</p>
                    <div className="mt-5 flex flex-wrap gap-x-8 gap-y-2 mono text-[10px] tracking-[0.28em]">
                      <span className="text-signal">SCORE — {e.score}</span>
                      <span className="text-mist/70">{e.years}</span>
                    </div>
                  </div>
                </div>
                <div className="mt-6 h-px w-full bg-steel/60 relative overflow-hidden">
                  <span className="absolute left-0 top-0 h-full bg-signal/60 transition-all duration-1000" style={{ width: e.score }} />
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal className="lg:col-span-4" delay={200}>
          <div className="h-full border hairline bg-carbon/50 p-6 sm:p-8 flex flex-col">
            <div className="mono text-[9px] tracking-[0.3em] text-signal mb-6">CERTIFICATIONS & COMMUNITY</div>
            <ul className="space-y-4">
              {CERTS.map((c) => (
                <li key={c} className="flex items-center gap-3 text-sm text-fog/90 font-light">
                  <BadgeCheck size={13} strokeWidth={1.5} className="text-signal/70 shrink-0" />
                  {c}
                </li>
              ))}
              <li className="flex items-center gap-3 text-sm text-fog/90 font-light">
                <Globe size={13} strokeWidth={1.5} className="text-signal/70 shrink-0" />
                Active contributor — AI/ML communities & open source
              </li>
            </ul>
            <div className="mt-auto pt-8 mono text-[8px] tracking-[0.3em] text-mist/50">
              VERIFIED CREDENTIALS · NO INFLATED CLAIMS
            </div>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
