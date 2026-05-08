import { LandmarkCard } from "./LandmarkCard";

/**
 * Simplified beach map with thick accessible route.
 * Uses absolute positioning over an SVG so paths align with cards.
 */
export function AccessibleMap() {
  return (
    <div className="relative h-full w-full overflow-hidden rounded-3xl border-2 border-border bg-card">
      {/* Beach + water backdrop */}
      <div className="absolute inset-0">
        <div className="absolute inset-x-0 top-0 h-1/3 bg-water" aria-hidden />
        <div className="absolute inset-x-0 bottom-0 h-2/3 bg-sand" aria-hidden />
      </div>

      {/* Compass */}
      <div className="absolute right-4 top-4 z-20 flex h-12 w-12 items-center justify-center rounded-full border-2 border-border bg-card text-xs font-bold shadow-sm">
        <span className="flex flex-col items-center leading-none">
          <span className="text-primary">N</span>
          <span className="mt-0.5 text-base">↑</span>
        </span>
      </div>

      {/* Beach label */}
      <div className="absolute left-1/2 top-6 z-10 -translate-x-1/2 text-sm font-semibold tracking-wide text-primary">
        🌊 Beach Area
      </div>

      {/* SVG route layer (uses % coordinates) */}
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        aria-hidden
      >
        {/* Accessible route: You are here -> Cabin -> Kiosk -> Shower */}
        <polyline
          points="14,82 38,82 38,55 62,55 78,38"
          fill="none"
          stroke="var(--route)"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
          style={{ strokeWidth: 8 } as React.CSSProperties}
        />
        {/* Stairs (dashed, not accessible) */}
        <polyline
          points="78,38 86,22"
          fill="none"
          stroke="var(--muted-foreground)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray="4 3"
          vectorEffect="non-scaling-stroke"
          style={{ strokeWidth: 4 } as React.CSSProperties}
        />
      </svg>

      {/* Landmarks (positioned by % to align with route nodes) */}
      <Anchor x="14%" y="82%">
        <div className="flex flex-col items-center gap-2">
          <div className="you-are-here-pulse rounded-full bg-primary px-3 py-1.5 text-xs font-bold text-primary-foreground shadow-md">
            📍 You are here
          </div>
          <LandmarkCard icon="🧑‍🦽" label="Changing Room" badge="♿ Accessible" size="sm" />
        </div>
      </Anchor>

      <Anchor x="38%" y="82%">
        <LandmarkCard icon="🛖" label="Turn here" size="sm" />
      </Anchor>

      <Anchor x="38%" y="40%">
        <LandmarkCard icon="🍹" label="Kiosk" badge="Rest area" size="sm" />
      </Anchor>

      <Anchor x="62%" y="55%">
        <LandmarkCard icon="🪑" label="Bench" size="sm" />
      </Anchor>

      <Anchor x="78%" y="38%">
        <LandmarkCard icon="🚿" label="Shower" badge="♿ Destination" tone="destination" size="sm" />
      </Anchor>

      <Anchor x="86%" y="20%">
        <LandmarkCard icon="🚻" label="WC" badge="♿ Accessible" size="sm" />
      </Anchor>

      <Anchor x="18%" y="32%">
        <LandmarkCard icon="🛟" label="Lifeguard" size="sm" />
      </Anchor>

      <Anchor x="62%" y="78%">
        <LandmarkCard icon="💧" label="Drinking water" size="sm" />
      </Anchor>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 z-10 rounded-2xl border-2 border-border bg-card/95 p-3 text-xs shadow-sm backdrop-blur">
        <div className="mb-1.5 font-semibold">Legend</div>
        <div className="flex items-center gap-2">
          <span className="inline-block h-1.5 w-8 rounded-full bg-route" />
          <span>Accessible path</span>
        </div>
        <div className="mt-1 flex items-center gap-2">
          <span
            className="inline-block h-0.5 w-8"
            style={{
              backgroundImage:
                "repeating-linear-gradient(to right, var(--muted-foreground) 0 4px, transparent 4px 8px)",
              height: 2,
            }}
          />
          <span>Stairs (limited access)</span>
        </div>
      </div>
    </div>
  );
}

function Anchor({
  x,
  y,
  children,
}: {
  x: string;
  y: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className="absolute z-10 -translate-x-1/2 -translate-y-1/2"
      style={{ left: x, top: y }}
    >
      {children}
    </div>
  );
}
