import { useEffect, useRef, useState } from "react";
import { Plus, Minus, LocateFixed, RotateCw, ChevronUp, ChevronDown } from "lucide-react";
import { LandmarkCard } from "./LandmarkCard";
import { useNavigation } from "@/lib/navigation";

type Landmark = {
  id: string;
  x: number;
  y: number;
  icon: string;
  label: string;
  badge?: string;
  secondary?: boolean;
  tone?: "default" | "current" | "destination";
};

const LANDMARKS: Landmark[] = [
  { id: "cabin", x: 14, y: 82, icon: "🚪", label: "Changing Room", badge: "♿", tone: "current" },
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
  const [animDone, setAnimDone] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [legendOpen, setLegendOpen] = useState(true);

  useEffect(() => {
    if (pathRef.current) {
      const len = pathRef.current.getTotalLength();
      setPathLen(len);
      setAnimKey((k) => k + 1);
      setAnimDone(false);
    }
  }, [profile.id]);

  const visibleLandmarks = LANDMARKS.filter((l) => !profile.ui.simplified || !l.secondary);
  const labelSize = profile.ui.largeLabels ? "md" : "sm";
  const routeStroke = profile.ui.highContrast ? 12 : 8;

  const zoomIn = () => setZoom((z) => Math.min(2, +(z + 0.2).toFixed(2)));
  const zoomOut = () => setZoom((z) => Math.max(0.8, +(z - 0.2).toFixed(2)));
  const recenter = () => { setZoom(1); setRotation(0); };
  const rotate = () => setRotation((r) => (r + 90) % 360);

  return (
    <div
      className={`relative h-full w-full overflow-hidden rounded-3xl border-2 bg-card transition-colors ${
        profile.ui.highContrast ? "border-foreground" : "border-border"
      }`}
    >
      {/* Zoom/rotation wrapper */}
      <div
        className="absolute inset-0 transition-transform duration-300 ease-out"
        style={{ transform: `scale(${zoom}) rotate(${rotation}deg)`, transformOrigin: "center" }}
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

        {/* SVG layer */}
        <svg
          className="absolute inset-0 h-full w-full"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          aria-hidden
        >
          {/* Faint stairs path */}
          <polyline
            points="78,38 86,22"
            fill="none"
            stroke="var(--muted-foreground)"
            strokeLinecap="round"
            strokeDasharray="4 3"
            vectorEffect="non-scaling-stroke"
            style={{ strokeWidth: 4 }}
          />
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
          <polyline
            key={`route-${animKey}`}
            ref={pathRef}
            points={profile.route.points}
            fill="none"
            stroke="var(--route)"
            strokeLinecap="round"
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
            onAnimationEnd={() => setAnimDone(true)}
            style={{
              strokeWidth: routeStroke,
              strokeDasharray: animDone ? undefined : pathLen || undefined,
              strokeDashoffset: animDone ? undefined : pathLen || undefined,
              animation: !animDone && pathLen ? "route-draw 1.1s ease-out forwards" : undefined,
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
      </div>

      {/* Compass (counter-rotates with map) */}
      <div className="absolute right-3 top-3 z-20 flex h-10 w-10 items-center justify-center rounded-full border-2 border-border bg-card text-[10px] font-bold shadow-sm sm:right-4 sm:top-4 sm:h-12 sm:w-12 sm:text-xs">
        <span
          className="flex flex-col items-center leading-none transition-transform duration-300"
          style={{ transform: `rotate(${-rotation}deg)` }}
        >
          <span className="text-primary">N</span>
          <span className="mt-0.5 text-sm sm:text-base">↑</span>
        </span>
      </div>

      {/* Profile chip */}
      <div className="absolute left-3 top-3 z-20 flex max-w-[55%] items-center gap-1.5 rounded-full border-2 border-border bg-card/95 px-2.5 py-1 text-[11px] font-semibold shadow-sm backdrop-blur animate-fade-in sm:left-4 sm:top-4 sm:gap-2 sm:px-3 sm:py-1.5 sm:text-xs">
        <span aria-hidden>{profile.icon}</span>
        <span className="truncate">{profile.label} mode</span>
        {audioOn && <span aria-hidden title="Audio on">🔈</span>}
      </div>

      {/* Beach label */}
      <div className="absolute left-1/2 top-14 z-10 -translate-x-1/2 text-xs font-semibold tracking-wide text-primary sm:top-6 sm:text-sm">
        🌊 Beach Area
      </div>

      {/* Map controls */}
      <div className="absolute bottom-3 right-3 z-20 flex flex-col gap-1 rounded-2xl border-2 border-border bg-card/95 p-1 shadow-md backdrop-blur sm:bottom-4 sm:right-4 sm:gap-1.5 sm:p-1.5">
        <MapBtn label="Zoom in" onClick={zoomIn} disabled={zoom >= 2}><Plus size={14} /></MapBtn>
        <MapBtn label="Zoom out" onClick={zoomOut} disabled={zoom <= 0.8}><Minus size={14} /></MapBtn>
        <MapBtn label="Recenter on me" onClick={recenter}><LocateFixed size={14} /></MapBtn>
        <MapBtn label="Rotate map" onClick={rotate}><RotateCw size={14} /></MapBtn>
      </div>

      {/* Legend (collapsible, compact) */}
      <div className="absolute bottom-3 left-3 z-10 max-w-[55%] rounded-xl border-2 border-border bg-card/95 text-[11px] shadow-sm backdrop-blur sm:bottom-4 sm:left-4 sm:max-w-[60%] sm:rounded-2xl sm:text-xs">
        <button
          onClick={() => setLegendOpen((v) => !v)}
          className="flex w-full items-center justify-between gap-2 px-2.5 py-1.5 font-semibold sm:px-3 sm:py-2"
          aria-expanded={legendOpen}
        >
          <span className="flex items-center gap-2">
            <span className="inline-block h-1.5 w-5 rounded-full bg-route sm:w-6" />
            <span className="truncate">{profile.route.label}</span>
          </span>
          {legendOpen ? <ChevronDown size={12} /> : <ChevronUp size={12} />}
        </button>
        {legendOpen && (
          <div className="border-t border-border px-2.5 py-1.5 sm:px-3 sm:py-2">
            <div className="flex items-center gap-2">
              <span className="inline-block h-1.5 w-6 rounded-full bg-route sm:w-8" />
              <span>{profile.route.distanceM}m · {profile.route.minutes} min</span>
            </div>
            <div className="mt-1 flex items-center gap-2">
              <span
                className="inline-block w-6 sm:w-8"
                style={{
                  backgroundImage:
                    "repeating-linear-gradient(to right, var(--muted-foreground) 0 4px, transparent 4px 8px)",
                  height: 2,
                }}
              />
              <span>Stairs (limited access)</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function MapBtn({
  children,
  label,
  onClick,
  disabled,
}: {
  children: React.ReactNode;
  label: string;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      title={label}
      disabled={disabled}
      className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-background transition hover:border-primary hover:bg-primary/10 disabled:opacity-40 sm:h-9 sm:w-9 sm:rounded-xl"
    >
      {children}
    </button>
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
