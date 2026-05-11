import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Volume2, VolumeX, Play, Square, Navigation, X } from "lucide-react";
import { useSpeech } from "@/hooks/useSpeech";
import { useNavigation } from "@/lib/navigation";

type NavState = "preview" | "active" | "arrived";


function buildSpoken(step: { title: string; detail: string; upcoming?: string }, i: number, total: number) {
  return `Step ${i + 1} of ${total}. ${step.title}. ${step.detail}${step.upcoming ? " " + step.upcoming : " You have arrived."}`;
}

export function GuidancePanel() {
  const { profile, audioOn, setAudioOn } = useNavigation();
  const steps = profile.route.steps;
  const [active, setActive] = useState(0);
  const [navState, setNavState] = useState<NavState>("preview");
  const { supported, speaking, speak, stop } = useSpeech();

  // Reset on profile change
  useEffect(() => {
    setActive(0);
    setNavState("preview");
  }, [profile.id]);

  // Auto-speak when audio is on and step changes
  useEffect(() => {
    if (audioOn && supported) {
      speak(buildSpoken(steps[active], active, steps.length));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, audioOn, profile.id]);

  const toggleAudio = () => {
    if (audioOn) { stop(); setAudioOn(false); }
    else setAudioOn(true);
  };

  const replay = () => {
    if (!supported) return;
    if (speaking) stop();
    else speak(buildSpoken(steps[active], active, steps.length));
  };

  const step = steps[active];

  return (
    <div className="flex h-full flex-col gap-5 overflow-y-auto rounded-3xl border-2 border-border bg-card p-6 animate-fade-in">
      <header>
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {profile.icon} {profile.label} mode
            </p>
            <h2 className="mt-1 text-2xl font-bold leading-tight">Shower Area</h2>
            <p className="mt-1 text-sm text-muted-foreground">{profile.route.label}</p>
          </div>

          {supported && (
            <button
              onClick={toggleAudio}
              aria-pressed={audioOn}
              aria-label={audioOn ? "Turn off audio guidance" : "Turn on audio guidance"}
              title={audioOn ? "Audio on" : "Audio off"}
              className={`flex h-10 w-10 items-center justify-center rounded-full border-2 transition ${
                audioOn
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-card hover:border-primary"
              }`}
            >
              {audioOn ? <Volume2 size={16} /> : <VolumeX size={16} />}
            </button>
          )}
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          <Pill icon="⏱" label={`${profile.route.minutes} min`} />
          <Pill icon="📏" label={`${profile.route.distanceM} m`} />
          <Pill icon="♿" label="Step-free" tone="success" />
        </div>

        {navState === "preview" && (
          <button
            onClick={() => { setNavState("active"); setActive(0); }}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-primary px-4 py-3 text-sm font-bold text-primary-foreground shadow-sm transition hover:opacity-90"
          >
            <Navigation size={18} /> Start navigation
          </button>
        )}
        {navState === "active" && (
          <button
            onClick={() => { setNavState("preview"); setActive(0); stop(); }}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-full border-2 border-destructive bg-card px-4 py-2.5 text-sm font-bold text-destructive transition hover:bg-destructive/10"
          >
            <X size={16} /> End route
          </button>
        )}
        {navState === "arrived" && (
          <div className="mt-4 rounded-2xl border-2 border-success bg-success/15 p-3 text-center text-sm font-bold text-success-foreground">
            🎉 You have arrived
            <button
              onClick={() => { setNavState("preview"); setActive(0); }}
              className="ml-3 rounded-full bg-card px-3 py-1 text-xs font-semibold text-foreground"
            >
              Start over
            </button>
          </div>
        )}
      </header>

      <section
        aria-label="Current step"
        aria-live="polite"
        className="rounded-2xl border-2 border-primary bg-primary/5 p-4 animate-scale-in"
        key={`${profile.id}-${active}`}
      >
        <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-primary">
          <span>Step {active + 1} of {steps.length}</span>
          {speaking && <span>🔈 Speaking…</span>}
        </div>
        <div className="mt-2 flex items-start gap-3">
          <span aria-hidden className="text-3xl">{step.icon}</span>
          <div className="min-w-0 flex-1">
            <h3 className="text-lg font-bold leading-tight">{step.title}</h3>
            <p className="mt-1 text-sm text-foreground/80">{step.detail}</p>
            {step.upcoming && (
              <p className="mt-2 rounded-xl bg-secondary px-3 py-2 text-sm font-medium">
                <span aria-hidden className="mr-1">➡️</span>{step.upcoming}
              </p>
            )}
          </div>
        </div>

        <div className="mt-4 flex items-center gap-2">
          <button
            onClick={() => setActive((i) => Math.max(0, i - 1))}
            disabled={active === 0}
            className="flex h-10 items-center gap-1 rounded-full border-2 border-border bg-card px-3 text-sm font-semibold transition hover:border-primary disabled:opacity-40"
          >
            <ChevronLeft size={18} /> Prev
          </button>
          <button
            onClick={() => {
              setActive((i) => {
                const next = Math.min(steps.length - 1, i + 1);
                if (next === steps.length - 1) setNavState("arrived");
                return next;
              });
            }}
            disabled={active === steps.length - 1 || navState === "preview"}
            className="flex h-10 flex-1 items-center justify-center gap-1 rounded-full bg-primary px-4 text-sm font-bold text-primary-foreground transition hover:opacity-90 disabled:opacity-40"
          >
            Next step <ChevronRight size={18} />
          </button>
          {supported && (
            <button
              onClick={replay}
              aria-label={speaking ? "Stop speaking" : "Replay step"}
              className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-border bg-card transition hover:border-primary"
            >
              {speaking ? <Square size={16} /> : <Play size={16} />}
            </button>
          )}
        </div>
      </section>

      <section aria-label="All steps">
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Step by step
        </h3>
        <ol className="space-y-2">
          {steps.map((s, i) => {
            const isActive = i === active;
            const isDone = i < active;
            return (
              <li key={i}>
                <button
                  onClick={() => setActive(i)}
                  className={`flex w-full gap-3 rounded-2xl border-2 p-3 text-left transition ${
                    isActive
                      ? "border-primary bg-primary/10"
                      : "border-border bg-background hover:border-primary/50"
                  }`}
                >
                  <div
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-base font-bold ${
                      isDone ? "bg-success text-success-foreground" : "bg-primary text-primary-foreground"
                    }`}
                  >
                    {isDone ? "✓" : i + 1}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 font-semibold">
                      <span aria-hidden>{s.icon}</span>
                      <span>{s.title}</span>
                    </div>
                    <p className="mt-0.5 text-sm text-muted-foreground">{s.detail}</p>
                  </div>
                </button>
              </li>
            );
          })}
        </ol>
      </section>

      <section aria-label="Route notes">
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          What to expect
        </h3>
        <ul className="space-y-2">
          {profile.route.notes.map((n) => (
            <li
              key={n}
              className="flex items-center gap-3 rounded-xl bg-secondary px-3 py-2 text-sm font-medium animate-fade-in"
            >
              <span aria-hidden>✓</span>
              <span>{n}</span>
            </li>
          ))}
        </ul>
      </section>

      <section aria-label="Emergency" className="mt-auto">
        <div className="flex items-center justify-between gap-3 rounded-2xl border-2 border-warning/50 bg-warning/15 p-3">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <span aria-hidden className="text-lg">🚑</span>
            <span>Need help?</span>
          </div>
          <button className="rounded-full bg-warning px-4 py-1.5 text-sm font-bold text-warning-foreground shadow-sm transition hover:opacity-90">
            Call assistance
          </button>
        </div>
      </section>
    </div>
  );
}

function Pill({ icon, label, tone = "default" }: { icon: string; label: string; tone?: "default" | "success" }) {
  const cls =
    tone === "success"
      ? "bg-success/20 text-success-foreground border-success/40"
      : "bg-secondary text-secondary-foreground border-border";
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${cls}`}>
      <span aria-hidden>{icon}</span>
      {label}
    </span>
  );
}
