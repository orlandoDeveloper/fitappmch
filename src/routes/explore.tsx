import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { ExploreView } from "@/components/explore-view";

export const Route = createFileRoute("/explore")({
  head: () => ({
    meta: [{ title: "Explore Exercises — PulseFit" }],
  }),
  component: () => (
    <AppShell>
      <ExploreView />
    </AppShell>
  ),
});
