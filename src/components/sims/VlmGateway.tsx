import { Console, useInView, useTicker, prand } from "../../ui";

const LANES = ["HELMET-VIOLATION", "INTRUSION", "FIRE-SMOKE", "FORKLIFT-ZONE", "PPE-CHECK", "TAILGATING"];

function AlertPacket({ lane, delay }: { lane: string; delay: number }) {
  return (
    <div className="absolute top-0 h-full" style={{ animation: `track-alert 5.2s linear ${delay}s infinite` }}>
      <div className="relative">
        <span
          className="st-a mono text-[8px] tracking-[0.16em] px-2 py-1 border border-amber-400/70 bg-amber-400/10 text-amber-300 whitespace-nowrap"
          style={{ animationDelay: `${delay}s` }}
        >
          AI ALERT · {lane}
        </span>
        <span
          className="st-b absolute left-0 top-0 mono text-[8px] tracking-[0.16em] px-2 py-1 border border-signal/80 bg-signal/10 text-signal whitespace-nowrap"
          style={{ animationDelay: `${delay}s` }}
        >
          VERIFIED — QWEN3-VL
        </span>
      </div>
    </div>
  );
}

export default function VlmGatewaySim() {
  const { ref, inView } = useInView<HTMLDivElement>(0.3, false);
  const tick = useTicker(inView, 1500);
  const evaluated = 1280 + tick * 3;
  const verified = Math.floor(evaluated * (0.86 + prand(tick) * 0.05));

  return (
    <div ref={ref}>
      <style>{`
        .st-a { animation: st-a-f 5.2s linear infinite; }
        .st-b { opacity: 0; animation: st-b-f 5.2s linear infinite; }
        @keyframes st-a-f { 0%, 68% { opacity: 1 } 73%, 100% { opacity: 0 } }
        @keyframes st-b-f { 0%, 68% { opacity: 0 } 73%, 100% { opacity: 1 } }
      `}</style>
      <Console tag="VLM VERIFICATION GATEWAY // QWEN3-VL AS JUDGE" right="FAIL-OPEN · HOT-SWAP READY">
        <div className="p-4 sm:p-6">
          <div className="grid grid-cols-[1fr_auto_1fr] gap-3 sm:gap-6 items-stretch">
            {/* source column */}
            <div className="space-y-2">
              {LANES.map((l, i) => (
                <div key={l} className="relative h-7 overflow-hidden border hairline bg-void/50">
                  <AlertPacket lane={l} delay={i * 0.86} />
                </div>
              ))}
              <div className="mono text-[8px] tracking-[0.22em] text-mist/60 pt-1">← CV ALERTS ×11 USE CASES VIA KAFKA</div>
            </div>

            {/* gateway node */}
            <div className="relative flex flex-col items-center justify-center px-2 sm:px-6">
              <div className="relative size-24 sm:size-28">
                <span className="absolute inset-0 rounded-full border border-signal/30" style={{ animation: "radio-ring 2.6s ease-out infinite" }} />
                <span className="absolute inset-0 rounded-full border border-signal/30" style={{ animation: "radio-ring 2.6s ease-out 1.3s infinite" }} />
                <div className="absolute inset-0 rounded-full border border-signal/50 bg-carbon flex flex-col items-center justify-center text-center">
                  <span className="mono text-[8px] tracking-[0.24em] text-signal">VLM</span>
                  <span className="disp text-sm sm:text-base font-semibold text-paper">JUDGE</span>
                  <span className="mono text-[7px] tracking-[0.18em] text-mist mt-0.5">QWEN3-VL</span>
                </div>
              </div>
              <div className="mt-3 mono text-[8px] tracking-[0.2em] text-mist/70 text-center leading-relaxed">
                CONTEXT + FRAME<br />= DECISION
              </div>
            </div>

            {/* output column */}
            <div className="flex flex-col justify-center gap-3">
              <div className="border hairline bg-void/50 p-3 sm:p-4">
                <div className="mono text-[8px] tracking-[0.22em] text-mist mb-1">EVALUATED</div>
                <div className="disp text-xl sm:text-2xl font-semibold text-paper">{evaluated.toLocaleString()}</div>
              </div>
              <div className="border border-signal/40 bg-signal/5 p-3 sm:p-4">
                <div className="mono text-[8px] tracking-[0.22em] text-signal/80 mb-1">VERIFIED TRUE</div>
                <div className="disp text-xl sm:text-2xl font-semibold text-signal">{verified.toLocaleString()}</div>
              </div>
              <div className="border hairline bg-void/50 p-3 sm:p-4">
                <div className="mono text-[8px] tracking-[0.22em] text-mist mb-1">FALSE ALARMS KILLED</div>
                <div className="disp text-xl sm:text-2xl font-semibold text-fog">{(evaluated - verified).toLocaleString()}</div>
              </div>
            </div>
          </div>

          <div className="mt-5 pt-4 border-t hairline flex flex-wrap gap-x-6 gap-y-1.5 mono text-[8px] tracking-[0.2em] text-mist/70">
            <span>KAFKA ROUTING — TRANSPARENT</span>
            <span>RUNTIME MODEL HOT-SWAP</span>
            <span>FAIL-OPEN VERIFICATION</span>
            <span>AUDIT → MONGODB</span>
          </div>
        </div>
      </Console>
      <div className="flex flex-wrap gap-2 mt-4">
        {["Qwen3-VL", "11 CV Use Cases", "Kafka", "Model Hot-Swapping", "Fail-Open", "Configurable Workflows", "Audit Persistence"].map((c) => (
          <span key={c} className="mono text-[9px] tracking-[0.18em] uppercase px-2.5 py-1 border hairline text-mist">{c}</span>
        ))}
      </div>
    </div>
  );
}
