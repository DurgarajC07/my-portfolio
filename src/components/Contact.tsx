import { useState } from "react";
import { META } from "../data";
import { Reveal, Words } from "../ui";
import { magnetic, magneticReset, scrollToId } from "../hooks";
import { Mail, Phone, Globe, MapPin, Radio, Copy, Check } from "lucide-react";

type BrandIconProps = { size?: number; strokeWidth?: number; className?: string };

function GithubIcon({ size = 15, className = "" }: BrandIconProps) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
      <path d="M9 18c-4.51 2-5-2-7-2" />
    </svg>
  );
}
function LinkedinIcon({ size = 15, className = "" }: BrandIconProps) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect width="4" height="12" x="2" y="9" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

const STEPS = ["HANDSHAKE", "AUTH KEY EXCHANGE", "ENCRYPTING CHANNEL", "CHANNEL OPEN"];

export default function Contact() {
  const [stage, setStage] = useState(-1); // -1 idle, 0..3 opening, 4 open
  const [copied, setCopied] = useState(false);

  const open = () => {
    if (stage >= 0) return;
    setStage(0);
    STEPS.forEach((_, i) => setTimeout(() => setStage(i + 1), 420 * (i + 1)));
  };

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(META.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch { /* clipboard unavailable */ }
  };

  const open_ = stage >= STEPS.length;

  const links = [
    { icon: Mail, label: "EMAIL", value: META.email, href: `mailto:${META.email}`, action: copyEmail, actionIcon: copied ? Check : Copy },
    { icon: Phone, label: "PHONE", value: META.phone, href: `tel:${META.phone.replace(/\s/g, "")}` },
    { icon: LinkedinIcon, label: "LINKEDIN", value: META.linkedinLabel, href: META.linkedin },
    { icon: GithubIcon, label: "GITHUB", value: META.githubLabel, href: META.github },
    { icon: Globe, label: "PORTFOLIO", value: META.portfolioLabel, href: META.portfolio },
  ];

  return (
    <>
      <section id="contact" aria-label="Contact" className="relative px-5 sm:px-10 lg:px-[7vw] py-32 sm:py-44 overflow-hidden">
        <div aria-hidden className="absolute inset-0 grid-bg" />
        <div aria-hidden className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 size-[540px] rounded-full bg-signal/[0.04] blur-3xl" />

        <header className="relative mb-16">
          <div className="flex items-center gap-4 mb-6">
            <span className="mono text-[10px] tracking-[0.34em] text-signal">07</span>
            <span className="h-px flex-1 bg-gradient-to-r from-signal/40 to-transparent" />
            <span className="kicker">OPEN A CHANNEL</span>
          </div>
          <h2 className="disp font-medium uppercase leading-[0.95] tracking-tight text-[clamp(2.4rem,7.5vw,6.8rem)] text-paper">
            <Words text="LET'S BUILD" />
            <br />
            <Words text="SOMETHING" startDelay={200} /> <Words text="INTELLIGENT." className="text-gradient-cool" startDelay={420} />
          </h2>
          <Reveal delay={500}>
            <p className="mt-6 flex items-center gap-2 mono text-[10px] tracking-[0.3em] text-mist">
              <MapPin size={12} className="text-signal" /> {META.location.toUpperCase()}
            </p>
          </Reveal>
        </header>

        <Reveal delay={200} className="relative max-w-3xl">
          <div className={`ticks relative border hairline bg-carbon/70 backdrop-blur-sm transition-colors duration-700 ${open_ ? "border-signal/40" : ""}`}>
            {/* channel head */}
            <div className="flex items-center justify-between border-b hairline px-5 py-3">
              <div className="flex items-center gap-2.5">
                <Radio size={12} className={open_ ? "text-signal" : "text-mist"} />
                <span className="mono text-[9px] tracking-[0.3em] text-mist">COMMS // UPLINK-01</span>
              </div>
              <span className={`mono text-[9px] tracking-[0.3em] ${open_ ? "text-signal" : "text-mist/50"}`}>
                {open_ ? "● SECURE" : "○ STANDBY"}
              </span>
            </div>

            <div className="p-6 sm:p-10">
              {stage < 0 && (
                <div className="flex flex-col items-start gap-6">
                  <p className="text-mist font-light text-sm sm:text-base max-w-md leading-relaxed">
                    One channel. Engineer-to-engineer. No forms that vanish into the void —
                    direct coordinates below.
                  </p>
                  <button
                    onClick={open}
                    data-cursor="establish uplink"
                    onMouseMove={(e) => magnetic(e, 0.3)}
                    onMouseLeave={magneticReset}
                    className="btn-magnet group relative border border-signal/50 px-10 py-4 mono text-[10px] tracking-[0.44em] text-signal overflow-hidden"
                  >
                    <span className="relative z-10">OPEN CHANNEL</span>
                    <span className="absolute inset-0 bg-signal/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                  </button>
                </div>
              )}

              {stage >= 0 && !open_ && (
                <div className="space-y-3 py-2" aria-live="polite">
                  {STEPS.slice(0, stage + 1).map((s, i) => (
                    <div key={s} className="flex items-baseline mono text-[10px] sm:text-[11px] tracking-[0.24em]" style={{ animation: "boot-line 0.4s cubic-bezier(0.22,1,0.36,1) both" }}>
                      <span className="text-fog w-44 sm:w-56 truncate">{s}</span>
                      <span className="flex-1 border-b border-dotted border-steel mx-3 -translate-y-1" />
                      <span className={i === STEPS.length - 1 ? "text-signal" : "text-mist"}>
                        {i < stage || i === STEPS.length - 1 ? "OK" : "…"}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {open_ && (
                <div aria-live="polite">
                  <div className="mono text-[9px] tracking-[0.3em] text-signal mb-6" style={{ animation: "boot-line 0.4s both" }}>
                    CHANNEL OPEN — DIRECT LINES
                  </div>
                  <div className="space-y-px">
                    {links.map((l, i) => (
                      <a
                        key={l.label}
                        href={l.href}
                        target={l.href.startsWith("http") ? "_blank" : undefined}
                        rel="noreferrer"
                        data-cursor="transmit"
                        className="group flex items-center gap-4 border hairline bg-void/40 px-4 sm:px-6 py-4 transition-colors duration-300 hover:bg-signal/5 hover:border-signal/40"
                        style={{ animation: `boot-line 0.5s ${i * 90}ms both` }}
                      >
                        <l.icon size={15} strokeWidth={1.5} className="text-signal shrink-0" />
                        <span className="mono text-[9px] tracking-[0.3em] text-mist w-24 shrink-0">{l.label}</span>
                        <span className="text-sm sm:text-base text-bone/90 font-light truncate">{l.value}</span>
                        {l.action ? (
                          <button
                            onClick={(e) => { e.preventDefault(); l.action!(); }}
                            aria-label="Copy email address"
                            className="ml-auto text-mist hover:text-signal transition-colors shrink-0"
                          >
                            <l.actionIcon size={14} strokeWidth={1.5} />
                          </button>
                        ) : (
                          <span className="ml-auto mono text-mist/40 group-hover:text-signal group-hover:translate-x-1 group-hover:-translate-y-1 transition-all shrink-0">↗</span>
                        )}
                      </a>
                    ))}
                  </div>
                  <div className="mt-4 mono text-[8px] tracking-[0.26em] text-mist/50" style={{ animation: "boot-line 0.5s 0.6s both" }}>
                    RESPONSE LATENCY — TYPICALLY UNDER 24 HOURS
                  </div>
                </div>
              )}
            </div>
          </div>
        </Reveal>
      </section>

      {/* footer */}
      <footer className="border-t hairline px-5 sm:px-10 lg:px-[7vw] py-8 mb-16 lg:mb-0">
        <div className="flex flex-col sm:flex-row justify-between gap-4 mono text-[8px] sm:text-[9px] tracking-[0.26em] text-mist/60">
          <span>© 2026 DURGARAJ CHAUHAN — MUMBAI NODE</span>
          <span className="hidden md:block">DESIGNED & ENGINEERED FROM FIRST PRINCIPLES</span>
          <button onClick={() => scrollToId("hero")} className="text-left sm:text-right text-mist/60 hover:text-signal transition-colors">
            REBOOT SYSTEM ↑
          </button>
        </div>
      </footer>
    </>
  );
}
