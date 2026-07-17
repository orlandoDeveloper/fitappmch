import { Link, useRouterState } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { LayoutDashboard, Compass, Dumbbell, User, Bell, Flame, Zap } from "lucide-react";
import type { ReactNode } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { userStats } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

const nav = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/explore", label: "Explore", icon: Compass },
  { to: "/workout", label: "Workout", icon: Dumbbell },
  { to: "/profile", label: "Profile", icon: User },
] as const;

function AppSidebar() {
  const pathname = useRouterState({ select: (r) => r.location.pathname });

  return (
    <Sidebar collapsible="icon">
      {/* Header: Logo */}
      <SidebarHeader>
        <div className="flex items-center gap-2 px-2 py-3">
          <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl gradient-brand shadow-[var(--shadow-glow)]">
            <Zap className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="font-black text-lg tracking-tight group-data-[collapsible=icon]:hidden">
            PULSE<span className="text-gradient-brand">FIT</span>
          </span>
        </div>
      </SidebarHeader>

      <Separator className="mx-2 w-auto" />

      {/* Nav items */}
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {nav.map((item) => {
                const active =
                  item.to === "/" ? pathname === "/" : pathname.startsWith(item.to);
                const Icon = item.icon;
                return (
                  <SidebarMenuItem key={item.to}>
                    <SidebarMenuButton
                      asChild
                      isActive={active}
                      size="lg"
                      tooltip={item.label}
                    >
                      <Link to={item.to}>
                        <Icon className="h-4 w-4" />
                        <span>{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Footer: streak card */}
      <SidebarFooter>
        <div className="rounded-xl border border-border/60 p-3 glass-card group-data-[collapsible=icon]:hidden">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-streak">
            <Flame className="h-4 w-4" /> {userStats.streakDays} day streak
          </div>
          <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed">
            Keep it going. Log a session today.
          </p>
        </div>
        {/* collapsed state: just icon */}
        <div className="hidden group-data-[collapsible=icon]:flex justify-center pb-1">
          <Flame className="h-5 w-5 text-streak" />
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (r) => r.location.pathname });

  return (
    <div className="dark min-h-screen bg-background text-foreground">
      <SidebarProvider>
        <AppSidebar />

        <SidebarInset>
          {/* Sticky top header */}
          <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border/60 bg-background/80 px-4 backdrop-blur-xl">
            {/* Sidebar trigger (hamburger on mobile, toggle on desktop) */}
            <SidebarTrigger className="text-muted-foreground hover:text-foreground" />

            {/* Logo shown only on mobile when sidebar is closed */}
            <div className="flex items-center gap-2 md:hidden">
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
          </header>

          {/* Page content */}
          <main className="flex-1 pb-8">{children}</main>

          {/* Mobile bottom nav */}
          <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 border-t border-border/60 bg-background/90 backdrop-blur-xl">
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
                        active ? "bg-primary/15 text-primary" : "text-muted-foreground",
                      )}
                    >
                      <Icon className="h-5 w-5" />
                    </motion.span>
                    <span className={cn(active ? "text-foreground" : "text-muted-foreground")}>
                      {item.label}
                    </span>
                  </Link>
                );
              })}
            </div>
          </nav>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}
