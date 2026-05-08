import { useEffect, useRef, useState } from "react";
import { LandmarkCard } from "./LandmarkCard";
import { useNavigation } from "@/lib/navigation";

type Landmark = {
  id: string;
  x: number;
  y: number;
  icon: string;
  label: string;
  badge?: string;
  /** Hide when simplified UI is on */
  secondary?: boolean;
  tone?: "default" | "current" | "destination";
};

const LANDMARKS: Landmark[] = [
  { id: "cabin", x: 14, y: 82, icon: "🧑‍🦽", label: "Changing Room", badge: "♿", tone: "current" },
  { id: "kiosk", x: 38, y: 40, icon: "🍹", label: "Kiosk", badge: "Rest area" },
  { id: "bench", x: 62, y: 72, icon: "🪑", label: "Bench", secondary: true },
  { id: "shower", x: 78, y: 38, icon: "🚿", label: "Shower", badge: "Destination", tone: "destination" },
  { id: "wc", x: 88, y: 22, icon: "🚻", label: "WC", badge: "♿", secondary: true },
  { id: "lifeguard", x: 18, y: 32, icon: "🛟", label: "Lifeguard", secondary: true },
  { id: "water", x: 62, y: 80, icon: "💧", label: "Water", secondary: true },
];

export function AccessibleMap() {
  const { profile, audioOn } = useNavigation();
  const pathRef = useRef<SVGPolylineElement>(null);
  const [pathLen, setPathLen] = useState(0);
  const [animKey, setAnimKey] = useState(0);

  // Re-animate route on profile change
  useEffect(() => {
    if (pathRef.current) {
      const len = pathRef.current.getTotalLength();
      setPathLen(len);
      setAnimKey((k) => k + 1);
    }
  }, [profile.id]);

  const visibleLandmarks = LANDMARKS.filter((l) => !profile.ui.simplified || !l.secondary);
  const labelSize = profile.ui.largeLabels ? "md" : "sm";
  const routeStroke = profile.ui.highContrast ? 12 : 8;

  return (
    <div
      className={`relative h-full w-full overflow-hidden rounded-3xl border-2 bg-card transition-colors ${
        profile.ui.highContrast ? "border-foreground" : "border-border"
      }`}
    >
      {/* Backdrop */}
      <div className="absolute inset-0">
        <div
          className={`absolute inset-x-0 top-0 h-1/3 transition-colors ${
            profile.ui.highContrast ? "bg-foreground/10" : "bg-water"
          }`}
          aria-hidden
        />
        <div
          className={`absolute inset-x-0 bottom-0 h-2/3 transition-colors ${
            profile.ui.highContrast ? "bg-background" : "bg-sand"
          }`}
          aria-hidden
        />
      </div>

      {/* Compass */}
      <div className="absolute right-4 top-4 z-20 flex h-12 w-12 items-center justify-center rounded-full border-2 border-border bg-card text-xs font-bold shadow-sm">
        <span className="flex flex-col items-center leading-none">
          <span className="text-primary">N</span>
          <span className="mt-0.5 text-base">↑</span>
        </span>
      </div>

      {/* Profile chip */}
      <div className="absolute left-4 top-4 z-20 flex items-center gap-2 rounded-full border-2 border-border bg-card/95 px-3 py-1.5 text-xs font-semibold shadow-sm backdrop-blur animate-fade-in">
        <span aria-hidden>{profile.icon}</span>
        <span>{profile.label} mode</span>
        {audioOn && <span aria-hidden title="Audio on">🔈</span>}
      </div>

      {/* Beach label */}
      <div className="absolute left-1/2 top-6 z-10 -translate-x-1/2 text-sm font-semibold tracking-wide text-primary">
        🌊 Beach Area
      </div>

      {/* SVG layer */}
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        aria-hidden
      >
        {/* Faint stairs path always visible */}
        <polyline
          points="78,38 86,22"
          fill="none"
          stroke="var(--muted-foreground)"
          strokeLinecap="round"
          strokeDasharray="4 3"
          vectorEffect="non-scaling-stroke"
          style={{ strokeWidth: 4 }}
        />
        {/* Route halo (high contrast) */}
        {profile.ui.highContrast && (
          <polyline
            key={`halo-${animKey}`}
            points={profile.route.points}
            fill="none"
            stroke="var(--background)"
            strokeLinecap="round"
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
            style={{ strokeWidth: routeStroke + 8 }}
          />
        )}
        {/* Active animated route */}
        <polyline
          key={`route-${animKey}`}
          ref={pathRef}
          points={profile.route.points}
          fill="none"
          stroke="var(--route)"
          strokeLinecap="round"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
          style={{
            strokeWidth: routeStroke,
            strokeDasharray: pathLen || undefined,
            strokeDashoffset: pathLen || undefined,
            animation: pathLen ? "route-draw 1.1s ease-out forwards" : undefined,
          }}
        />
      </svg>

      {/* Landmarks */}
      {visibleLandmarks.map((l) => (
        <Anchor key={l.id} x={`${l.x}%`} y={`${l.y}%`}>
          {l.id === "cabin" ? (
            <div className="flex flex-col items-center gap-2 animate-fade-in">
              <div className="you-are-here-pulse rounded-full bg-primary px-3 py-1.5 text-xs font-bold text-primary-foreground shadow-md">
                📍 You are here
              </div>
              <LandmarkCard icon={l.icon} label={l.label} badge="♿ Accessible" size={labelSize} />
            </div>
          ) : (
            <div className="hover-scale animate-fade-in">
              <LandmarkCard
                icon={l.icon}
                label={l.label}
                badge={l.badge}
                tone={l.tone}
                size={labelSize}
              />
            </div>
          )}
        </Anchor>
      ))}

      {/* Legend */}
      <div className="absolute bottom-4 left-4 z-10 rounded-2xl border-2 border-border bg-card/95 p-3 text-xs shadow-sm backdrop-blur">
        <div className="mb-1.5 font-semibold">{profile.route.label}</div>
        <div className="flex items-center gap-2">
          <span className="inline-block h-1.5 w-8 rounded-full bg-route" />
          <span>{profile.route.distanceM}m · {profile.route.minutes} min</span>
        </div>
        <div className="mt-1 flex items-center gap-2">
          <span
            className="inline-block w-8"
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

function Anchor({ x, y, children }: { x: string; y: string; children: React.ReactNode }) {
  return (
    <div
      className="absolute z-10 -translate-x-1/2 -translate-y-1/2 transition-all duration-500"
      style={{ left: x, top: y }}
    >
      {children}
    </div>
  );
}
