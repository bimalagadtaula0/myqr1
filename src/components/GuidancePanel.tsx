type Step = { title: string; detail: string; icon: string };

const STEPS: Step[] = [
  { icon: "🚪", title: "Leave changing room", detail: "Exit through the wide door on your right." },
  { icon: "🧭", title: "Follow the blue path", detail: "Stay on the marked accessible route." },
  { icon: "🍹", title: "Pass the kiosk", detail: "There's a rest area here if you need a break." },
  { icon: "🚿", title: "Turn right to the shower", detail: "Ramp at entrance. No steps." },
];

const ACCESSIBILITY_INFO = [
  { icon: "♿", label: "Ramp available at shower entrance" },
  { icon: "🚻", label: "Accessible toilet 20m away" },
  { icon: "🪑", label: "Rest area at the kiosk" },
  { icon: "💧", label: "Drinking water along the route" },
  { icon: "🔈", label: "Audio guidance available" },
];

export function GuidancePanel() {
  return (
    <div className="flex h-full flex-col gap-5 overflow-y-auto rounded-3xl border-2 border-border bg-card p-6">
      <header>
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Destination
        </p>
        <h2 className="mt-1 text-2xl font-bold leading-tight">Shower Area</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          <Pill icon="⏱" label="2 min" />
          <Pill icon="📏" label="80 m" />
          <Pill icon="♿" label="Step-free" tone="success" />
        </div>
      </header>

      <section aria-label="Step by step directions">
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Step by step
        </h3>
        <ol className="space-y-3">
          {STEPS.map((step, i) => (
            <li
              key={i}
              className="flex gap-3 rounded-2xl border-2 border-border bg-background p-3"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-base font-bold text-primary-foreground">
                {i + 1}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 font-semibold">
                  <span aria-hidden>{step.icon}</span>
                  <span>{step.title}</span>
                </div>
                <p className="mt-0.5 text-sm text-muted-foreground">{step.detail}</p>
              </div>
            </li>
          ))}
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
              <span aria-hidden className="text-base">
                {item.icon}
              </span>
              <span>{item.label}</span>
            </li>
          ))}
        </ul>
      </section>

      <section aria-label="Emergency" className="mt-auto">
        <div className="flex items-center justify-between gap-3 rounded-2xl border-2 border-warning/50 bg-warning/15 p-3">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <span aria-hidden className="text-lg">
              🚑
            </span>
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
