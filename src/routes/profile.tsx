import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { ProfileView } from "@/components/profile-view";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [{ title: "Profile — PulseFit" }],
  }),
  component: () => (
    <AppShell>
      <ProfileView />
    </AppShell>
  ),
});
