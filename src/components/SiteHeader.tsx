import { Search, User } from "lucide-react";
import { useNavigation } from "@/lib/navigation";

export function SiteHeader() {
  const { profile } = useNavigation();

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

        {/* Current mode read-out (picker now lives in the dock) */}
        <div
          className="hidden items-center gap-2 rounded-full border-2 border-border bg-card px-3 py-1.5 text-xs font-semibold sm:flex"
          title={`${profile.label} mode`}
        >
          <span aria-hidden>{profile.icon}</span>
          <span className="max-w-[10ch] truncate">{profile.label}</span>
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
