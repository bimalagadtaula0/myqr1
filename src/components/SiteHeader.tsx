import { useState } from "react";
import { Search, Settings2, User } from "lucide-react";
import { NEEDS, PROFILES, useNavigation, type ProfileId } from "@/lib/navigation";

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const { profile, profileId, setProfile, needs, toggleNeed } = useNavigation();
  const activeCount = needs.size;

  return (
    <header className="sticky top-0 z-30 border-b-2 border-border bg-background/90 backdrop-blur">
      <div className="mx-auto flex max-w-[1440px] items-center gap-3 px-4 py-3 sm:gap-4 sm:px-6">
        <a href="/" className="flex items-center gap-2 font-bold">
          <span
            aria-hidden
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground"
          >
            ♿
          </span>
          <span className="hidden text-lg sm:inline">PathFinder</span>
        </a>

        <div className="flex flex-1 items-center gap-2 rounded-full border-2 border-border bg-card px-4 py-2 focus-within:border-primary">
          <Search size={16} className="text-muted-foreground" />
          <input
            type="search"
            placeholder="Search a destination…"
            aria-label="Search destination"
            className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            defaultValue="Shower"
          />
        </div>

        <div className="relative">
          <button
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            className="flex items-center gap-2 rounded-full border-2 border-border bg-card px-3 py-2 text-sm font-semibold transition hover:border-primary sm:px-4"
          >
            <Settings2 size={16} />
            <span className="hidden sm:inline">Choose navigation needs</span>
            <span className="sm:hidden" aria-hidden>{profile.icon}</span>
            <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-xs font-bold text-primary-foreground">
              {activeCount}
            </span>
          </button>

          {open && (
            <div className="absolute right-0 top-full z-40 mt-2 w-[20rem] rounded-2xl border-2 border-border bg-card p-4 shadow-xl animate-scale-in">
              <p className="text-sm font-bold">How would you like to navigate?</p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                The map adapts to your needs.
              </p>

              {/* Profile presets */}
              <div className="mt-3 grid grid-cols-2 gap-2">
                {(Object.keys(PROFILES) as ProfileId[]).map((id) => {
                  const p = PROFILES[id];
                  const active = profileId === id;
                  return (
                    <button
                      key={id}
                      onClick={() => setProfile(id)}
                      className={`flex flex-col items-start gap-0.5 rounded-xl border-2 p-2 text-left transition ${
                        active
                          ? "border-primary bg-primary/10"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      <span className="text-base" aria-hidden>{p.icon}</span>
                      <span className="text-xs font-bold leading-tight">{p.label}</span>
                      <span className="text-[10px] leading-tight text-muted-foreground">
                        {p.tagline}
                      </span>
                    </button>
                  );
                })}
              </div>

              <div className="my-3 h-px bg-border" />

              <p className="px-1 pb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Fine-tune
              </p>
              <ul className="max-h-64 space-y-1 overflow-y-auto pr-1">
                {NEEDS.map((n) => (
                  <li key={n.id}>
                    <label className="flex cursor-pointer items-center gap-3 rounded-xl px-2 py-2 hover:bg-secondary">
                      <input
                        type="checkbox"
                        checked={needs.has(n.id)}
                        onChange={() => toggleNeed(n.id)}
                        className="h-4 w-4 accent-primary"
                      />
                      <span aria-hidden className="text-base">{n.icon}</span>
                      <span className="text-sm font-medium">{n.label}</span>
                    </label>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <button
          aria-label="Profile"
          className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-border bg-card transition hover:border-primary"
        >
          <User size={18} />
        </button>
      </div>
    </header>
  );
}
