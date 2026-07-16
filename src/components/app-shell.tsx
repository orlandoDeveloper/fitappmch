import { Link, useRouterState } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { LayoutDashboard, Compass, Dumbbell, User, Bell, Flame, Zap } from "lucide-react";
import type { ReactNode } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { userStats } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

const nav = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/explore", label: "Explore", icon: Compass },
  { to: "/workout", label: "Workout", icon: Dumbbell },
  { to: "/profile", label: "Profile", icon: User },
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (r) => r.location.pathname });

  return (
    <div className="dark min-h-screen bg-background text-foreground">
      <div className="flex min-h-screen">
        {/* Desktop sidebar */}
        <aside className="hidden lg:flex w-64 shrink-0 flex-col border-r border-border bg-sidebar px-4 py-6 sticky top-0 h-screen">
          <div className="flex items-center gap-2 px-2 mb-8">
            <div className="grid h-10 w-10 place-items-center rounded-xl gradient-brand shadow-[var(--shadow-glow)]">
              <Zap className="h-5 w-5 text-primary-foreground" />
            </div>
            <div className="font-black text-lg tracking-tight">
              PULSE<span className="text-gradient-brand">FIT</span>
            </div>
          </div>

          <nav className="flex flex-col gap-1">
            {nav.map((item) => {
              const active =
                item.to === "/" ? pathname === "/" : pathname.startsWith(item.to);
              const Icon = item.icon;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={cn(
                    "group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all",
                    active
                      ? "bg-sidebar-accent text-sidebar-accent-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-sidebar-accent/60",
                  )}
                >
                  {active && (
                    <motion.span
                      layoutId="sidebar-active"
                      className="absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full gradient-brand"
                    />
                  )}
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="mt-auto rounded-2xl border border-border p-4 glass-card">
            <div className="flex items-center gap-2 text-xs font-semibold text-streak">
              <Flame className="h-4 w-4" /> {userStats.streakDays} day streak
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              Keep it going. Log a session today to reach a new personal best.
            </p>
          </div>
        </aside>

        {/* Main */}
        <div className="flex-1 min-w-0 flex flex-col">
          {/* Sticky top header */}
          <header className="sticky top-0 z-30 border-b border-border/60 bg-background/80 backdrop-blur-xl">
            <div className="flex h-16 items-center gap-3 px-4 lg:px-8">
              <div className="lg:hidden flex items-center gap-2">
                <div className="grid h-9 w-9 place-items-center rounded-xl gradient-brand">
                  <Zap className="h-4 w-4 text-primary-foreground" />
                </div>
                <span className="font-black tracking-tight">
                  PULSE<span className="text-gradient-brand">FIT</span>
                </span>
              </div>

              <div className="ml-auto flex items-center gap-2 sm:gap-3">
                <motion.div
                  whileHover={{ scale: 1.03 }}
                  className="flex items-center gap-1.5 rounded-full gradient-streak px-3 py-1.5 text-xs font-bold text-streak-foreground shadow-sm"
                >
                  <Flame className="h-3.5 w-3.5" />
                  {userStats.streakDays}
                  <span className="hidden sm:inline">day streak</span>
                </motion.div>

                <Button
                  variant="ghost"
                  size="icon"
                  className="relative rounded-full hover:bg-accent"
                >
                  <Bell className="h-5 w-5" />
                  <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-destructive ring-2 ring-background" />
                </Button>

                <Avatar className="h-9 w-9 ring-2 ring-primary/30">
                  <AvatarFallback className="gradient-brand text-primary-foreground text-xs font-bold">
                    AM
                  </AvatarFallback>
                </Avatar>
              </div>
            </div>
          </header>

          <main className="flex-1 pb-24 lg:pb-8">{children}</main>
        </div>
      </div>

      {/* Mobile bottom nav */}
      <nav className="lg:hidden fixed bottom-0 inset-x-0 z-40 border-t border-border/60 bg-background/90 backdrop-blur-xl">
        <div className="mx-auto grid max-w-md grid-cols-4 px-2 py-2">
          {nav.map((item) => {
            const active =
              item.to === "/" ? pathname === "/" : pathname.startsWith(item.to);
            const Icon = item.icon;
            return (
              <Link
                key={item.to}
                to={item.to}
                className="relative flex flex-col items-center gap-1 py-2 text-[10px] font-medium"
              >
                {active && (
                  <motion.span
                    layoutId="bottom-active"
                    className="absolute inset-x-3 top-0 h-0.5 rounded-full gradient-brand"
                  />
                )}
                <motion.span
                  animate={{ scale: active ? 1.1 : 1 }}
                  className={cn(
                    "grid h-9 w-9 place-items-center rounded-xl transition-colors",
                    active
                      ? "bg-primary/15 text-primary"
                      : "text-muted-foreground",
                  )}
                >
                  <Icon className="h-5 w-5" />
                </motion.span>
                <span
                  className={cn(
                    active ? "text-foreground" : "text-muted-foreground",
                  )}
                >
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
