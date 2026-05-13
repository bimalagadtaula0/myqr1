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

  const sizeClass =
    size === "sm"
      ? "px-2 py-1.5 text-[11px] sm:px-3 sm:py-2 sm:text-sm"
      : "px-2.5 py-1.5 text-xs sm:px-4 sm:py-3 sm:text-base";

  return (
    <div
      className={`inline-flex flex-col items-start gap-0.5 rounded-xl border-2 shadow-sm sm:rounded-2xl sm:gap-1 ${toneClass} ${sizeClass}`}
    >
      <div className="flex items-center gap-1.5 font-semibold leading-tight sm:gap-2">
        <span aria-hidden className="text-base sm:text-xl">
          {icon}
        </span>
        <span>{label}</span>
      </div>
      {badge && (
        <span className="text-[10px] font-medium opacity-90 sm:text-xs">{badge}</span>
      )}
    </div>
  );
}
