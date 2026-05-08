import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { AccessibleMap } from "@/components/AccessibleMap";
import { GuidancePanel } from "@/components/GuidancePanel";
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

function Index() {
  return (
    <NavigationProvider>
      <div className="min-h-screen bg-background text-foreground">
        <SiteHeader />

        <main className="mx-auto max-w-[1440px] px-4 py-4 sm:px-6 sm:py-6">
          <h1 className="sr-only">Accessible navigation</h1>

          <div className="grid gap-4 md:grid-cols-[1.5fr_1fr] md:gap-5 lg:grid-cols-[1.6fr_1fr] lg:gap-6">
            <section
              aria-label="Map"
              className="h-[60vh] min-h-[420px] md:h-[calc(100vh-6.5rem)]"
            >
              <AccessibleMap />
            </section>

            <section
              aria-label="Route guidance"
              className="md:h-[calc(100vh-6.5rem)]"
            >
              <GuidancePanel />
            </section>
          </div>
        </main>
      </div>
    </NavigationProvider>
  );
}
