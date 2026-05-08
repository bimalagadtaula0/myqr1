type Props = {
  icon: string;
  label: string;
  badge?: string;
  tone?: "default" | "current" | "destination";
  size?: "sm" | "md";
};

export function LandmarkCard({ icon, label, badge, tone = "default", size = "md" }: Props) {
  const toneClass =
    tone === "current"
      ? "bg-primary text-primary-foreground border-primary"
      : tone === "destination"
        ? "bg-warning text-warning-foreground border-warning"
        : "bg-card text-card-foreground border-border";

  const sizeClass = size === "sm" ? "px-3 py-2 text-sm" : "px-4 py-3 text-base";

  return (
    <div
      className={`inline-flex flex-col items-start gap-1 rounded-2xl border-2 shadow-sm ${toneClass} ${sizeClass}`}
    >
      <div className="flex items-center gap-2 font-semibold leading-tight">
        <span aria-hidden className="text-xl">
          {icon}
        </span>
        <span>{label}</span>
      </div>
      {badge && (
        <span className="text-xs font-medium opacity-90">{badge}</span>
      )}
    </div>
  );
}
