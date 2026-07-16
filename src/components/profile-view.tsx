import { motion } from "framer-motion";
import { Award, Flame, Settings, Share2, Trophy, Zap } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { userStats } from "@/lib/mock-data";

const achievements = [
  { icon: Flame, label: "5-Day Streak", color: "text-streak", bg: "bg-streak/15" },
  { icon: Trophy, label: "New PR: Bench 100kg", color: "text-primary", bg: "bg-primary/15" },
  { icon: Zap, label: "Volume Milestone 40k", color: "text-success", bg: "bg-success/15" },
  { icon: Award, label: "Consistency Badge", color: "text-chart-5", bg: "bg-chart-5/15" },
];

export function ProfileView() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-6 lg:px-8 lg:py-10 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card className="relative overflow-hidden glass-card border-border/60 p-6 lg:p-8">
          <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full gradient-brand opacity-30 blur-3xl" />
          <div className="relative flex flex-wrap items-center gap-5">
            <Avatar className="h-20 w-20 ring-4 ring-primary/30">
              <AvatarFallback className="gradient-brand text-primary-foreground text-2xl font-black">
                AM
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <h1 className="text-2xl font-black tracking-tight">{userStats.name}</h1>
              <p className="text-sm text-muted-foreground">{userStats.handle}</p>
              <div className="mt-2 flex flex-wrap gap-2">
                <Badge className="border-streak/40 bg-streak/15 text-streak">
                  <Flame className="h-3 w-3" /> {userStats.streakDays} day streak
                </Badge>
                <Badge className="border-primary/40 bg-primary/15 text-primary">
                  Intermediate
                </Badge>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="icon" className="rounded-full border-border/60">
                <Share2 className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" className="rounded-full border-border/60">
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="relative mt-6 grid grid-cols-3 gap-3">
            {[
              { label: "Workouts", value: "142" },
              { label: "Volume", value: "412k kg" },
              { label: "Hours", value: "168" },
            ].map((s) => (
              <div key={s.label} className="rounded-2xl bg-muted/50 p-4 text-center">
                <p className="text-xs uppercase tracking-wider text-muted-foreground">
                  {s.label}
                </p>
                <p className="mt-1 text-xl font-black">{s.value}</p>
              </div>
            ))}
          </div>
        </Card>
      </motion.div>

      <div>
        <h2 className="text-lg font-bold mb-3">Achievements</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {achievements.map((a, i) => {
            const Icon = a.icon;
            return (
              <motion.div
                key={a.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                whileHover={{ y: -3 }}
              >
                <Card className="glass-card border-border/60 p-4 text-center">
                  <div className={`mx-auto grid h-12 w-12 place-items-center rounded-2xl ${a.bg} ${a.color}`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <p className="mt-3 text-xs font-semibold">{a.label}</p>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>

      <Card className="glass-card border-border/60 p-5">
        <h2 className="text-lg font-bold">Personal Records</h2>
        <ul className="mt-3 divide-y divide-border/60">
          {[
            { lift: "Bench Press", value: "100 kg × 5" },
            { lift: "Back Squat", value: "160 kg × 3" },
            { lift: "Deadlift", value: "200 kg × 1" },
            { lift: "Overhead Press", value: "70 kg × 5" },
          ].map((pr) => (
            <li key={pr.lift} className="flex items-center justify-between py-3">
              <span className="text-sm font-medium">{pr.lift}</span>
              <span className="text-sm font-black tabular-nums text-gradient-brand">
                {pr.value}
              </span>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}
