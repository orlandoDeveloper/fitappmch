import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { WorkoutView } from "@/components/workout-view";

export const Route = createFileRoute("/workout")({
  head: () => ({
    meta: [{ title: "Workout — PulseFit" }],
  }),
  component: () => (
    <AppShell>
      <WorkoutView />
    </AppShell>
  ),
});
