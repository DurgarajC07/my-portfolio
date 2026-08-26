import { Console, useInView, useTicker } from "../../ui";
import { FileText } from "lucide-react";

const FIELDS = [
  { k: "INVOICE_NO", v: '"INV-2026-04871"', row: 14 },
  { k: "VENDOR", v: '"Anvex Components Pvt Ltd"', row: 26 },
  { k: "DATE", v: '"2026-03-14"', row: 38 },
  { k: "GSTIN", v: '"27AAECA4021F1Z5"', row: 52 },
  { k: "TOTAL", v: '"₹ 4,82,300.00"', row: 68 },
  { k: "CONFIDENCE", v: "0.92", row: 82 },
];

export default function DocScanSim() {
  const { ref, inView } = useInView<HTMLDivElement>(0.3, false);
  const tick = useTicker(inView, 1100);
  const extracted = (tick % (FIELDS.length + 2));
  const processed = 1000 + Math.floor(tick / 3);

  return (
    <div ref={ref}>
      <Console tag="DOCUMENT INTELLIGENCE PIPELINE" right={`${processed} FORMS PROCESSED`}>
        <div className="p-4 sm:p-6">
          <div className="grid md:grid-cols-[1.1fr_1fr] gap-4">
            {/* document */}
            <div className="relative border hairline bg-void/60 p-5 overflow-hidden min-h-64">
              <div className="flex items-center gap-2 mb-4">
                <FileText size={13} className="text-mist" />
                <span className="mono text-[9px] tracking-[0.25em] text-mist">FORM_04871.PDF</span>
                <span className="mono text-[8px] tracking-[0.2em] text-signal/70 ml-auto">GEMINI VISION</span>
              </div>
              {/* text rows */}
              {Array.from({ length: 10 }, (_, r) => {
                const y = 12 + r * 7.4;
                const hit = FIELDS.find((f) => Math.abs(f.row - y) < 4 && extracted > FIELDS.indexOf(f));
                return (
                  <div key={r} className="flex gap-2 items-center mb-[9px]">
                    <span className={`h-1.5 rounded-full transition-all duration-500 ${hit ? "bg-signal/80 w-16" : "bg-steel w-10"}`} />
                    <span className={`h-1.5 rounded-full transition-all duration-500 ${hit ? "bg-signal/50" : "bg-steel/80"}`} style={{ width: `${38 + ((r * 37) % 34)}%` }} />
                  </div>
                );
              })}
              {/* scan sweep */}
              <div className="absolute inset-x-0 h-10 pointer-events-none" style={{ animation: "scan-y 2.8s linear infinite" }}>
                <div className="absolute inset-x-0 top-1/2 h-px bg-signal/70" />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-signal/10 to-transparent" />
              </div>
              <div className="absolute bottom-3 right-4 mono text-[8px] tracking-[0.2em] text-mist/60">92% EXTRACTION ACCURACY</div>
            </div>

            {/* extracted JSON */}
            <div className="border hairline bg-carbon p-5 mono text-[10px] sm:text-[11px] leading-loose overflow-hidden">
              <div className="text-mist/60 text-[9px] tracking-[0.25em] mb-3">STRUCTURED OUTPUT — BATCH SYNCED TO VOICE AUTOMATION</div>
              <span className="text-mist">{"{"}</span>
              {FIELDS.map((f, i) => (
                <div key={f.k} className={`pl-4 transition-all duration-500 ${extracted > i ? "opacity-100" : "opacity-15"}`}>
                  <span className="text-signal/90">"{f.k}"</span>
                  <span className="text-mist">: </span>
                  <span className="text-bone/90">{f.v}</span>
                  <span className="text-mist">,</span>
                  {extracted === i + 1 && <span className="ml-2 inline-block w-1.5 h-3.5 bg-signal align-middle" style={{ animation: "blink 1s steps(2) infinite" }} />}
                </div>
              ))}
              <span className="text-mist">{"}"}</span>
              <div className="mt-4 pt-3 border-t hairline flex justify-between text-[8px] tracking-[0.2em] text-mist/60">
                <span>PDF / DOCX / IMAGE → VISION MODEL</span>
                <span className="text-signal/80">ACC 0.92</span>
              </div>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-5 gap-px bg-steel/40 border hairline">
            {["PDF / DOCX / IMG", "VISION MODEL", "EXTRACTION", "STRUCTURED DATA", "VOICE AUTOMATION"].map((s, i) => (
              <div key={s} className={`bg-carbon px-2 py-2.5 text-center ${i === tick % 5 ? "bg-signal/10" : ""}`}>
                <span className={`mono text-[7px] sm:text-[8px] tracking-[0.16em] ${i === tick % 5 ? "text-signal" : "text-mist/70"}`}>{s}</span>
              </div>
            ))}
          </div>
        </div>
      </Console>
      <div className="flex flex-wrap gap-2 mt-4">
        {["Gemini Vision API", "1000+ Forms", "92% Accuracy", "Batch Voice Automation", "3× Throughput", "25% Cloud Cost Reduction"].map((c) => (
          <span key={c} className="mono text-[9px] tracking-[0.18em] uppercase px-2.5 py-1 border hairline text-mist">{c}</span>
        ))}
      </div>
    </div>
  );
}
