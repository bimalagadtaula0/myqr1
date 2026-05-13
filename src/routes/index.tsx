import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Map as MapIcon, ListOrdered } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { AccessibleMap } from "@/components/AccessibleMap";
import { GuidancePanel } from "@/components/GuidancePanel";
import { SettingsDock } from "@/components/SettingsDock";
import { NavigationProvider } from "@/lib/navigation";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "PathFinder — Accessible beach navigation" },
      {
        name: "description",
        content:
          "Inclusive wayfinding with simplified maps, step-free routes, and clear step-by-step guidance for every visitor.",
      },
    ],
  }),
});

type MobileTab = "map" | "steps";

function Index() {
  const [tab, setTab] = useState<MobileTab>("map");

  return (
    <NavigationProvider>
      <div className="min-h-screen bg-background text-foreground">
        <SiteHeader />

        <main className="mx-auto max-w-[1440px] px-3 pb-24 pt-3 sm:px-6 sm:pb-6 sm:pt-6">
          <h1 className="sr-only">Accessible navigation</h1>

          {/* Mobile tab switcher */}
          <div
            role="tablist"
            aria-label="View"
            className="mb-3 flex gap-1 rounded-full border-2 border-border bg-card p-1 md:hidden"
          >
            <TabBtn active={tab === "map"} onClick={() => setTab("map")} icon={<MapIcon size={16} />} label="Map" />
            <TabBtn active={tab === "steps"} onClick={() => setTab("steps")} icon={<ListOrdered size={16} />} label="Steps" />
          </div>

          <div className="grid gap-4 md:grid-cols-[1.5fr_1fr] md:gap-5 lg:grid-cols-[1.6fr_1fr] lg:gap-6">
            <section
              aria-label="Map"
              className={`${tab === "map" ? "block" : "hidden"} h-[calc(100vh-12rem)] min-h-[360px] md:block md:h-[calc(100vh-6.5rem)]`}
            >
              <AccessibleMap />
            </section>

            <section
              aria-label="Route guidance"
              className={`${tab === "steps" ? "block" : "hidden"} md:block md:h-[calc(100vh-6.5rem)]`}
            >
              <GuidancePanel />
            </section>
          </div>
        </main>

        <SettingsDock />
      </div>
    </NavigationProvider>
  );
}

function TabBtn({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button
      role="tab"
      aria-selected={active}
      onClick={onClick}
      className={`flex flex-1 items-center justify-center gap-2 rounded-full px-3 py-2 text-sm font-bold transition ${
        active ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:bg-secondary"
      }`}
    >
      {icon}
      {label}
    </button>
  );
}
