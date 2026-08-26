import { Console, useInView, useTicker, prand } from "../../ui";

const CAMS = [
  { id: "CAM_01", zone: "ASSEMBLY LINE", objs: ["PERSON", "FORKLIFT", "PPE-CHECK"] },
  { id: "CAM_02", zone: "LOADING BAY", objs: ["PERSON", "PALLET", "HELMET"] },
  { id: "CAM_03", zone: "PERIMETER", objs: ["PERSON", "VEHICLE", "INTRUSION"] },
];

function Cam({ id, zone, objs, tick, index }: { id: string; zone: string; objs: string[]; tick: number; index: number }) {
  const fps = 29 + Math.floor(prand(tick * 3 + index) * 3);
  return (
    <div className="relative border hairline bg-void/70 overflow-hidden" style={{ aspectRatio: "16/9" }}>
      {/* scene shading */}
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(18,21,26,0.4),rgba(9,11,14,0.9))]" />
      <div className="absolute left-0 right-0 top-1/2 h-px bg-bone/5" />
      <div className="absolute left-0 right-0 top-3/4 h-px bg-bone/5" />
      <div className="absolute inset-y-0 left-1/3 w-px bg-bone/[0.04]" />
      <div className="absolute inset-y-0 left-2/3 w-px bg-bone/[0.04]" />

      {objs.map((o, i) => {
        const isAlert = (tick + i + index) % 7 === 0 && i === 0;
        const x = 8 + prand(tick * (5 + i) + index * 17 + i * 31) * 62;
        const y = 18 + prand(tick * (3 + i) + index * 23 + i * 47) * 40;
        const w = 12 + prand(i * 11 + 4) * 12;
        const h = 24 + prand(i * 7 + 2) * 26;
        return (
          <div key={o} className={`vbox ${isAlert ? "alert" : ""}`} style={{ left: `${x}%`, top: `${y}%`, width: `${w}%`, height: `${h}%` }}>
            <span className="vtag">{isAlert ? `NO-PPE 0.9${(tick + 3) % 9}` : `${o} 0.9${(tick + i * 2) % 9}`}</span>
          </div>
        );
      })}

      <div className="absolute left-2 top-2 mono text-[8px] tracking-[0.2em] text-mist/80">{id} // {zone}</div>
      <div className="absolute right-2 top-2 mono text-[8px] tracking-[0.2em] text-signal/90">{fps} FPS</div>
      <div className="absolute left-2 bottom-2 mono text-[8px] tracking-[0.2em] text-mist/50">RTSP · LIVE · INFERENCE {(320 + Math.floor(prand(tick + index) * 140))}MS</div>
    </div>
  );
}

const ALERT_FEED = ["NO-PPE DETECTED — CAM_01", "FORKLIFT IN PEDESTRIAN ZONE — CAM_02", "INTRUSION AFTER HOURS — CAM_03", "HELMET COMPLIANCE RESTORED — CAM_01"];

export default function VisionLabSim() {
  const { ref, inView } = useInView<HTMLDivElement>(0.3, false);
  const tick = useTicker(inView, 900);

  return (
    <div ref={ref}>
      <Console tag="INDUSTRIAL VISION CONTROL ROOM" right="30+ FPS · <500MS INFERENCE">
        <div className="p-4 sm:p-6">
          <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-3">
            {CAMS.map((c, i) => <Cam key={c.id} {...c} tick={tick} index={i} />)}
          </div>

          <div className="mt-4 grid grid-cols-3 gap-px bg-steel/40 border hairline">
            {[
              ["30+", "FPS THROUGHPUT"], ["<500", "MS INFERENCE"], ["20+", "RTSP STREAMS"],
            ].map(([v, l]) => (
              <div key={l} className="bg-carbon px-3 py-3 text-center">
                <div className="disp text-lg sm:text-2xl font-semibold text-paper">{v}<span className="text-signal text-xs align-top">{l === "MS INFERENCE" ? "MS" : ""}</span></div>
                <div className="mono text-[7px] sm:text-[8px] tracking-[0.2em] text-mist/70 mt-0.5">{l}</div>
              </div>
            ))}
          </div>

          {/* alert ticker */}
          <div className="mt-3 border hairline bg-void/50 overflow-hidden">
            <div className="flex whitespace-nowrap py-2" style={{ animation: "marquee-x 18s linear infinite" }}>
              {[0, 1].map((dup) => (
                <span key={dup} className="flex">
                  {ALERT_FEED.map((a) => (
                    <span key={a + dup} className="mono text-[8px] tracking-[0.18em] text-amber-300/80 px-6 shrink-0">
                      ▸ {a}
                    </span>
                  ))}
                </span>
              ))}
            </div>
          </div>
        </div>
      </Console>
      <div className="flex flex-wrap gap-2 mt-4">
        {["YOLO", "OpenCV", "RTSP Streams", "Socket Alerts", "Industrial Safety", "Real-time Inference"].map((c) => (
          <span key={c} className="mono text-[9px] tracking-[0.18em] uppercase px-2.5 py-1 border hairline text-mist">{c}</span>
        ))}
      </div>
    </div>
  );
}
