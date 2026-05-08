import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Volume2, VolumeX, Play, Square } from "lucide-react";
import { useSpeech } from "@/hooks/useSpeech";

type Step = {
  title: string;
  detail: string;
  icon: string;
  upcoming?: string;
};

const STEPS: Step[] = [
  {
    icon: "🚪",
    title: "Leave changing room",
    detail: "Exit through the wide door on your right.",
    upcoming: "Next, follow the blue accessible boardwalk.",
  },
  {
    icon: "🧭",
    title: "Follow the blue path",
    detail: "Stay on the marked accessible route. Surface is smooth and step-free.",
    upcoming: "In about 20 meters you will pass the kiosk on your left.",
  },
  {
    icon: "🍹",
    title: "Pass the kiosk",
    detail: "There's a rest area here if you need a break.",
    upcoming: "Next, turn right toward the shower.",
  },
  {
    icon: "🚿",
    title: "Turn right to the shower",
    detail: "Ramp at entrance. No steps. You have arrived at your destination.",
  },
];

const ACCESSIBILITY_INFO = [
  { icon: "♿", label: "Ramp available at shower entrance" },
  { icon: "🚻", label: "Accessible toilet 20m away" },
  { icon: "🪑", label: "Rest area at the kiosk" },
  { icon: "💧", label: "Drinking water along the route" },
];

function buildSpoken(step: Step, index: number, total: number) {
  const position = `Step ${index + 1} of ${total}.`;
  const upcoming = step.upcoming ? ` ${step.upcoming}` : " You have arrived.";
  return `${position} ${step.title}. ${step.detail}${upcoming}`;
}

export function GuidancePanel() {
  const [active, setActive] = useState(0);
  const [audioOn, setAudioOn] = useState(false);
  const { supported, speaking, speak, stop } = useSpeech();

  // Auto-speak when audio guidance is on and active step changes
  useEffect(() => {
    if (audioOn && supported) {
      speak(buildSpoken(STEPS[active], active, STEPS.length));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, audioOn]);

  const toggleAudio = () => {
    if (audioOn) {
      stop();
      setAudioOn(false);
    } else {
      setAudioOn(true);
    }
  };

  const replay = () => {
    if (!supported) return;
    if (speaking) {
      stop();
    } else {
      speak(buildSpoken(STEPS[active], active, STEPS.length));
    }
  };

  const goPrev = () => setActive((i) => Math.max(0, i - 1));
  const goNext = () => setActive((i) => Math.min(STEPS.length - 1, i + 1));

  return (
    <div className="flex h-full flex-col gap-5 overflow-y-auto rounded-3xl border-2 border-border bg-card p-6">
      <header>
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Destination
            </p>
            <h2 className="mt-1 text-2xl font-bold leading-tight">Shower Area</h2>
          </div>

          {supported && (
            <button
              onClick={toggleAudio}
              aria-pressed={audioOn}
              aria-label={audioOn ? "Turn off audio guidance" : "Turn on audio guidance"}
              className={`flex items-center gap-2 rounded-full border-2 px-3 py-2 text-sm font-semibold transition ${
                audioOn
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-card hover:border-primary"
              }`}
            >
              {audioOn ? <Volume2 size={16} /> : <VolumeX size={16} />}
              <span className="hidden sm:inline">{audioOn ? "Audio on" : "Audio"}</span>
            </button>
          )}
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          <Pill icon="⏱" label="2 min" />
          <Pill icon="📏" label="80 m" />
          <Pill icon="♿" label="Step-free" tone="success" />
        </div>
      </header>

      {/* Active step large card */}
      <section
        aria-label="Current step"
        aria-live="polite"
        className="rounded-2xl border-2 border-primary bg-primary/5 p-4"
      >
        <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-primary">
          <span>Step {active + 1} of {STEPS.length}</span>
          {speaking && <span className="inline-flex items-center gap-1">🔈 Speaking…</span>}
        </div>
        <div className="mt-2 flex items-start gap-3">
          <span aria-hidden className="text-3xl">{STEPS[active].icon}</span>
          <div className="min-w-0 flex-1">
            <h3 className="text-lg font-bold leading-tight">{STEPS[active].title}</h3>
            <p className="mt-1 text-sm text-foreground/80">{STEPS[active].detail}</p>
            {STEPS[active].upcoming && (
              <p className="mt-2 rounded-xl bg-secondary px-3 py-2 text-sm font-medium">
                <span aria-hidden className="mr-1">➡️</span>
                {STEPS[active].upcoming}
              </p>
            )}
          </div>
        </div>

        <div className="mt-4 flex items-center gap-2">
          <button
            onClick={goPrev}
            disabled={active === 0}
            className="flex h-10 items-center gap-1 rounded-full border-2 border-border bg-card px-3 text-sm font-semibold transition hover:border-primary disabled:opacity-40"
          >
            <ChevronLeft size={18} /> Prev
          </button>
          <button
            onClick={goNext}
            disabled={active === STEPS.length - 1}
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
          {STEPS.map((step, i) => {
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
                      isDone
                        ? "bg-success text-success-foreground"
                        : "bg-primary text-primary-foreground"
                    }`}
                  >
                    {isDone ? "✓" : i + 1}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 font-semibold">
                      <span aria-hidden>{step.icon}</span>
                      <span>{step.title}</span>
                    </div>
                    <p className="mt-0.5 text-sm text-muted-foreground">{step.detail}</p>
                  </div>
                </button>
              </li>
            );
          })}
        </ol>
      </section>

      <section aria-label="Accessibility info">
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Accessibility info
        </h3>
        <ul className="space-y-2">
          {ACCESSIBILITY_INFO.map((item) => (
            <li
              key={item.label}
              className="flex items-center gap-3 rounded-xl bg-secondary px-3 py-2 text-sm font-medium"
            >
              <span aria-hidden className="text-base">{item.icon}</span>
              <span>{item.label}</span>
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

function Pill({
  icon,
  label,
  tone = "default",
}: {
  icon: string;
  label: string;
  tone?: "default" | "success";
}) {
  const cls =
    tone === "success"
      ? "bg-success/20 text-success-foreground border-success/40"
      : "bg-secondary text-secondary-foreground border-border";
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${cls}`}
    >
      <span aria-hidden>{icon}</span>
      {label}
    </span>
  );
}
