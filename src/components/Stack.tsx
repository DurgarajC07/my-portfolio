import { useMemo, useState } from "react";
import { STACK, STACK_EDGES, STACK_CATS } from "../data";
import { Section, Reveal, Console, Chip } from "../ui";

interface N { id: string; cat: string; x: number; y: number; path?: string[] }

const VB = 1000, C = VB / 2;

export default function Stack() {
  const [hovered, setHovered] = useState<string | null>(null);
  const [cat, setCat] = useState<string | null>(null);

  const { nodes, edges, byId } = useMemo(() => {
    // allocate arcs by category size
    const gap = 0.09; // radians between category arcs
    const total = STACK.length;
    let angle = -Math.PI / 2;
    const nodes: N[] = [];
    STACK_CATS.forEach((c) => {
      const items = STACK.filter((t) => t.cat === c);
      const arc = (items.length / total) * (Math.PI * 2 - gap * STACK_CATS.length);
      const start = angle + gap / 2;
      items.forEach((t, i) => {
        const a = items.length === 1 ? start + arc / 2 : start + (i / (items.length - 1)) * arc;
        const rad = 285 + ((i * 53) % 3) * 62 + ((i * 31) % 2) * 24;
        nodes.push({ id: t.id, cat: t.cat, path: t.path, x: C + Math.cos(a) * rad, y: C + Math.sin(a) * rad });
      });
      angle += arc + gap;
    });
    const byId = new Map(nodes.map((n) => [n.id, n]));
    const edges = STACK_EDGES
      .map(([a, b]) => ({ a: byId.get(a)!, b: byId.get(b)! }))
      .filter((e) => e.a && e.b);
    return { nodes, edges, byId };
  }, []);

  const neighborsOf = useMemo(() => {
    const map = new Map<string, Set<string>>();
    edges.forEach((e) => {
      if (!map.has(e.a.id)) map.set(e.a.id, new Set());
      if (!map.has(e.b.id)) map.set(e.b.id, new Set());
      map.get(e.a.id)!.add(e.b.id);
      map.get(e.b.id)!.add(e.a.id);
    });
    return map;
  }, [edges]);

  const hoveredNode = hovered ? byId.get(hovered) : undefined;
  const neighborSet = hovered ? neighborsOf.get(hovered) : undefined;

  const nodeState = (n: N): "on" | "dim" | "hot" => {
    if (hovered) {
      if (n.id === hovered) return "hot";
      if (neighborSet?.has(n.id)) return "on";
      return "dim";
    }
    if (cat) return n.cat === cat ? "on" : "dim";
    return "on";
  };
  const edgeState = (a: string, b: string): "on" | "dim" | "hot" => {
    if (hovered) {
      if (a === hovered || b === hovered) return "hot";
      return "dim";
    }
    if (cat) {
      const na = byId.get(a)!, nb = byId.get(b)!;
      return na.cat === cat && nb.cat === cat ? "on" : "dim";
    }
    return "on";
  };

  return (
    <Section
      id="stack" index="02" kicker="THE INTELLIGENCE STACK" meta="57 TECHNOLOGIES // RELATIONAL"
      title={<span>A LIVING <span className="text-signal">TECHNOLOGY</span> NETWORK</span>}
    >
      <Reveal>
        <div className="flex flex-wrap items-center gap-2 mb-8">
          <button onClick={() => setCat(null)} aria-pressed={cat === null}>
            <Chip active={cat === null}>ALL SYSTEMS</Chip>
          </button>
          {STACK_CATS.map((c) => (
            <button key={c} onClick={() => setCat(cat === c ? null : c)} aria-pressed={cat === c}>
              <Chip active={cat === c}>{c}</Chip>
            </button>
          ))}
          <span className="mono text-[9px] tracking-[0.24em] text-mist/50 ml-auto hidden md:block">HOVER NODES TO TRACE RELATIONSHIPS</span>
        </div>
      </Reveal>

      <div className="grid lg:grid-cols-12 gap-6 items-stretch">
        <Reveal className="lg:col-span-8" delay={120}>
          <div className="ticks relative border hairline bg-carbon/40 overflow-hidden">
            <div className="absolute inset-0 grid-bg opacity-60" />
            <svg viewBox={`0 0 ${VB} ${VB}`} className="relative w-full h-auto">
              {/* infrastructure rings */}
              {[200, 285, 347, 409, 460].map((r, i) => (
                <circle key={r} cx={C} cy={C} r={r} fill="none" stroke="rgba(237,234,226,0.05)" strokeDasharray={i % 2 ? "2 10" : "none"} />
              ))}

              {/* edges */}
              {edges.map((e, i) => {
                const s = edgeState(e.a.id, e.b.id);
                return (
                  <line
                    key={i} x1={e.a.x} y1={e.a.y} x2={e.b.x} y2={e.b.y}
                    stroke={s === "hot" ? "rgba(62,230,255,0.75)" : "rgba(160,175,190,0.16)"}
                    strokeWidth={s === "hot" ? 1.4 : 0.7}
                    className={`transition-opacity duration-300 ${s === "hot" ? "flow-line" : ""} ${s === "dim" ? "opacity-[0.05]" : s === "hot" ? "opacity-100" : "opacity-60"}`}
                  />
                );
              })}

              {/* nodes */}
              {nodes.map((n) => {
                const s = nodeState(n);
                const hot = s === "hot";
                return (
                  <g
                    key={n.id}
                    transform={`translate(${n.x},${n.y})`}
                    className={`transition-opacity duration-300 ${s === "dim" ? "opacity-[0.14]" : "opacity-100"}`}
                    onMouseEnter={() => setHovered(n.id)}
                    onMouseLeave={() => setHovered(null)}
                    style={{ cursor: "pointer" }}
                    role="button"
                    aria-label={`${n.id} — ${n.cat}`}
                    tabIndex={0}
                    onFocus={() => setHovered(n.id)}
                    onBlur={() => setHovered(null)}
                  >
                    <circle r={14} fill="transparent" />
                    <circle r={hot ? 5 : 2.6} fill={hot ? "#3ee6ff" : "#aab2c0"} className="transition-all duration-300" />
                    {hot && <circle r={12} fill="none" stroke="rgba(62,230,255,0.5)" />}
                    <text
                      y={-12} textAnchor="middle"
                      className="mono uppercase"
                      fontSize={hot ? 13 : 10.5}
                      letterSpacing="0.12em"
                      fill={hot ? "#3ee6ff" : "#aab2c0"}
                      style={{ transition: "all .3s" }}
                    >
                      {n.id}
                    </text>
                  </g>
                );
              })}

              {/* hub */}
              <g transform={`translate(${C},${C})`}>
                <circle r={54} fill="rgba(7,8,10,0.7)" stroke="rgba(62,230,255,0.25)" />
                <circle r={54} fill="none" stroke="rgba(62,230,255,0.4)" strokeDasharray="2 8" className="anim-spin-slow origin-center" />
                <text textAnchor="middle" y={-4} className="mono" fontSize="11" letterSpacing="0.3em" fill="#edeae2">SYSTEM</text>
                <text textAnchor="middle" y={12} className="mono" fontSize="11" letterSpacing="0.3em" fill="#3ee6ff">CORE</text>
              </g>
            </svg>
          </div>
        </Reveal>

        {/* readout */}
        <Reveal className="lg:col-span-4" delay={220}>
          <Console tag="RELATIONSHIP TRACE" right={hovered ? hoveredNode!.cat.toUpperCase() : "STANDBY"} className="h-full min-h-64">
            <div className="p-5 sm:p-6">
              {hoveredNode ? (
                <>
                  <div className="disp text-2xl sm:text-3xl font-medium uppercase tracking-tight text-paper">{hoveredNode.id}</div>
                  <div className="mono mt-1 text-[9px] tracking-[0.3em] text-signal/80">{hoveredNode.cat.toUpperCase()} LAYER</div>
                  <div className="mt-5 mono text-[10px] tracking-[0.14em] leading-[2.1] text-fog">
                    {(hoveredNode.path ?? [hoveredNode.id, ...Array.from(neighborSet ?? []).slice(0, 4)]).map((p, i, arr) => (
                      <span key={i}>
                        <span className={i === 0 ? "text-signal" : ""}>{p}</span>
                        {i < arr.length - 1 && <span className="text-mist/40"> →</span>}
                        {i < arr.length - 1 && <br />}
                      </span>
                    ))}
                  </div>
                  <div className="mt-5 pt-4 border-t hairline mono text-[9px] tracking-[0.2em] text-mist/60">
                    {neighborSet ? neighborSet.size : 0} DIRECT LINK{neighborSet && neighborSet.size === 1 ? "" : "S"} — ARCHITECTURE, NOT A LIST
                  </div>
                </>
              ) : (
                <div className="h-full flex flex-col justify-center mono text-[10px] tracking-[0.22em] text-mist/60 leading-loose">
                  <span>RELATIONSHIP ENGINE IDLE…</span>
                  <span className="text-signal/60">SELECT A NODE TO TRACE HOW TECHNOLOGIES CONNECT INTO SYSTEMS</span>
                </div>
              )}
            </div>
          </Console>
        </Reveal>
      </div>
    </Section>
  );
}
