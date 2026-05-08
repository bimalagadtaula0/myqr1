import { useState } from "react";

const FILTERS = [
  { id: "wheelchair", label: "Wheelchair accessible only", icon: "♿", on: true },
  { id: "stairs", label: "Avoid stairs", icon: "🚫", on: true },
  { id: "contrast", label: "High contrast mode", icon: "🌗", on: false },
  { id: "audio", label: "Audio guidance", icon: "🔈", on: false },
  { id: "quiet", label: "Quiet route", icon: "🤫", on: false },
  { id: "rest", label: "Show rest areas", icon: "🪑", on: true },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [filters, setFilters] = useState(
    Object.fromEntries(FILTERS.map((f) => [f.id, f.on])) as Record<string, boolean>,
  );
  const activeCount = Object.values(filters).filter(Boolean).length;

  return (
    <header className="sticky top-0 z-30 border-b-2 border-border bg-background/90 backdrop-blur">
      <div className="mx-auto flex max-w-[1440px] items-center gap-3 px-4 py-3 sm:gap-4 sm:px-6">
        {/* Logo */}
        <a href="/" className="flex items-center gap-2 font-bold">
          <span
            aria-hidden
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground"
          >
            ♿
          </span>
          <span className="hidden text-lg sm:inline">PathFinder</span>
        </a>

        {/* Search */}
        <div className="flex flex-1 items-center gap-2 rounded-full border-2 border-border bg-card px-4 py-2 focus-within:border-primary">
          <span aria-hidden className="text-muted-foreground">
            🔍
          </span>
          <input
            type="search"
            placeholder="Search a destination…"
            aria-label="Search destination"
            className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            defaultValue="Shower"
          />
        </div>

        {/* Filters */}
        <div className="relative">
          <button
            onClick={() => setOpen((v) => !v)}
            className="flex items-center gap-2 rounded-full border-2 border-border bg-card px-4 py-2 text-sm font-semibold transition hover:border-primary"
            aria-expanded={open}
          >
            <span aria-hidden>⚙</span>
            <span className="hidden sm:inline">Accessibility</span>
            <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-xs font-bold text-primary-foreground">
              {activeCount}
            </span>
          </button>

          {open && (
            <div className="absolute right-0 top-full z-40 mt-2 w-72 rounded-2xl border-2 border-border bg-card p-3 shadow-xl">
              <p className="px-2 pb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Accessibility filters
              </p>
              <ul className="space-y-1">
                {FILTERS.map((f) => (
                  <li key={f.id}>
                    <label className="flex cursor-pointer items-center gap-3 rounded-xl px-2 py-2 hover:bg-secondary">
                      <input
                        type="checkbox"
                        checked={filters[f.id]}
                        onChange={(e) =>
                          setFilters((s) => ({ ...s, [f.id]: e.target.checked }))
                        }
                        className="h-4 w-4 accent-primary"
                      />
                      <span aria-hidden className="text-base">
                        {f.icon}
                      </span>
                      <span className="text-sm font-medium">{f.label}</span>
                    </label>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Profile */}
        <button
          aria-label="Profile"
          className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-border bg-card font-bold transition hover:border-primary"
        >
          🙂
        </button>
      </div>
    </header>
  );
}
