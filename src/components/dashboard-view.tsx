import { motion } from "framer-motion";
import {
  ArrowUpRight,
  Dumbbell,
  Flame,
  Play,
  TrendingUp,
  Trophy,
} from "lucide-react";
import { Link } from "@tanstack/react-router";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  muscleSplit,
  recentWorkouts,
  userStats,
  volumeSeries,
} from "@/lib/mock-data";

const fadeUp = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
};

const typeColor: Record<string, string> = {
  Empuje: "bg-chart-4/15 text-chart-4 border-chart-4/30",
  Tirón: "bg-primary/15 text-primary border-primary/30",
  Piernas: "bg-streak/15 text-streak border-streak/30",
  Superior: "bg-chart-5/15 text-chart-5 border-chart-5/30",
  "Cuerpo Completo": "bg-success/15 text-success border-success/30",
  Inferior: "bg-chart-4/15 text-chart-4 border-chart-4/30",
};

function MetricCard({
  index,
  icon,
  label,
  value,
  sub,
  gradient,
  children,
}: {
  index: number;
  icon: React.ReactNode;
  label: string;
  value: string;
  sub?: React.ReactNode;
  gradient: string;
  children?: React.ReactNode;
}) {
  return (
    <motion.div
      variants={fadeUp}
      initial="initial"
      animate="animate"
      transition={{ delay: index * 0.06, duration: 0.4, ease: "easeOut" }}
      whileHover={{ y: -3 }}
    >
      <Card className="relative overflow-hidden border-border/60 glass-card">
        <div
          className={`absolute -top-16 -right-16 h-40 w-40 rounded-full blur-3xl opacity-30 ${gradient}`}
        />
        <CardHeader className="relative pb-2">
          <div className="flex items-start justify-between">
            <CardDescription className="text-xs font-medium uppercase tracking-wider">
              {label}
            </CardDescription>
            <div
              className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl text-primary-foreground ${gradient}`}
            >
              {icon}
            </div>
          </div>
          <CardTitle className="text-3xl font-black tracking-tight">{value}</CardTitle>
          {sub && <div className="mt-1">{sub}</div>}
        </CardHeader>
        {children && <CardContent className="relative pt-0">{children}</CardContent>}
      </Card>
    </motion.div>
  );
}

export function DashboardView() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-6 lg:px-8 lg:py-10 space-y-6 lg:space-y-8">
      {/* Hero greeting */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-wrap items-end justify-between gap-4"
      >
        <div className="min-w-0">
          <p className="text-sm text-muted-foreground">Bienvenido de nuevo,</p>
          <h1 className="text-3xl lg:text-4xl font-black tracking-tight">
            {userStats.name.split(" ")[0]}{" "}
            <span className="text-gradient-brand">a entrenar.</span>
          </h1>
        </div>
        <Button
          asChild
          className="gradient-brand text-primary-foreground shadow-[var(--shadow-glow)] hover:opacity-90 rounded-full h-11 px-5"
        >
          <Link to="/workout">
            <Play className="h-4 w-4" /> Iniciar entreno
          </Link>
        </Button>
      </motion.div>

      {/* Metric cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <MetricCard
          index={0}
          icon={<TrendingUp className="h-5 w-5" />}
          label="Volumen Semanal"
          value="45.200 kg"
          gradient="gradient-brand"
          sub={
            <Badge className="border-success/40 bg-success/15 text-success">
              <ArrowUpRight className="h-3 w-3" /> +{userStats.weeklyVolumeDelta}%
              vs semana anterior
            </Badge>
          }
        />
        <MetricCard
          index={1}
          icon={<Trophy className="h-5 w-5" />}
          label="Entrenos este Mes"
          value={`${userStats.monthlyWorkoutsDone}/${userStats.monthlyWorkoutsGoal}`}
          gradient="gradient-success"
          sub={
            <span className="text-xs text-muted-foreground">
              {userStats.monthlyWorkoutsGoal - userStats.monthlyWorkoutsDone} para
              alcanzar tu meta
            </span>
          }
        >
          <Progress
            value={(userStats.monthlyWorkoutsDone / userStats.monthlyWorkoutsGoal) * 100}
            className="h-1.5 bg-muted"
          />
        </MetricCard>
        <MetricCard
          index={2}
          icon={<Flame className="h-5 w-5" />}
          label="Racha Actual"
          value={`${userStats.streakDays} Días`}
          gradient="gradient-streak"
          sub={
            <span className="text-xs text-muted-foreground">
              Más larga: 12 días · Mantén el ritmo
            </span>
          }
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        <motion.div
          variants={fadeUp}
          initial="initial"
          animate="animate"
          transition={{ delay: 0.2 }}
          className="lg:col-span-3"
        >
          <Card className="glass-card border-border/60 h-full">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Progreso de Volumen</CardTitle>
                  <CardDescription>Últimas 8 semanas · kilogramos</CardDescription>
                </div>
                <Badge variant="outline" className="border-primary/30 text-primary">
                  En ascenso
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={volumeSeries}>
                    <defs>
                      <linearGradient id="vol" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="oklch(0.68 0.19 280)" stopOpacity={0.6} />
                        <stop offset="100%" stopColor="oklch(0.68 0.19 280)" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="oklch(1 0 0 / 0.06)" />
                    <XAxis dataKey="week" stroke="oklch(0.68 0.02 258)" fontSize={11} tickLine={false} axisLine={false} />
                    <YAxis stroke="oklch(0.68 0.02 258)" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(v) => `${v / 1000}k`} />
                    <Tooltip
                      contentStyle={{
                        background: "oklch(0.21 0.02 262)",
                        border: "1px solid oklch(0.28 0.02 262)",
                        borderRadius: 12,
                        fontSize: 12,
                      }}
                      labelStyle={{ color: "oklch(0.98 0.005 250)" }}
                    />
                    <Area
                      type="monotone"
                      dataKey="volume"
                      stroke="oklch(0.68 0.19 280)"
                      strokeWidth={2.5}
                      fill="url(#vol)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          variants={fadeUp}
          initial="initial"
          animate="animate"
          transition={{ delay: 0.28 }}
          className="lg:col-span-2"
        >
          <Card className="glass-card border-border/60 h-full">
            <CardHeader className="pb-2">
              <CardTitle>Grupos Musculares</CardTitle>
              <CardDescription>Series esta semana</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={muscleSplit}>
                    <CartesianGrid strokeDasharray="3 3" stroke="oklch(1 0 0 / 0.06)" />
                    <XAxis dataKey="group" stroke="oklch(0.68 0.02 258)" fontSize={10} tickLine={false} axisLine={false} />
                    <YAxis stroke="oklch(0.68 0.02 258)" fontSize={10} tickLine={false} axisLine={false} />
                    <Tooltip
                      contentStyle={{
                        background: "oklch(0.21 0.02 262)",
                        border: "1px solid oklch(0.28 0.02 262)",
                        borderRadius: 12,
                        fontSize: 12,
                      }}
                      cursor={{ fill: "oklch(1 0 0 / 0.04)" }}
                    />
                    <Bar dataKey="sets" fill="oklch(0.72 0.17 155)" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Recent workouts */}
      <motion.div
        variants={fadeUp}
        initial="initial"
        animate="animate"
        transition={{ delay: 0.35 }}
      >
        <Card className="glass-card border-border/60">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Entrenos Recientes</CardTitle>
                <CardDescription>Tus últimas sesiones</CardDescription>
              </div>
              <Button variant="ghost" size="sm" className="text-primary hover:text-primary">
                Ver todos
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <ul className="divide-y divide-border/60">
              {recentWorkouts.map((w, i) => (
                <motion.li
                  key={w.id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + i * 0.05 }}
                  className="flex items-center gap-3 py-3"
                >
                  <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
                    <Dumbbell className="h-4 w-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold">{w.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {w.date} · {w.durationMin} min · {w.volumeKg.toLocaleString("es-ES")} kg
                    </p>
                  </div>
                  <Badge variant="outline" className={typeColor[w.type]}>
                    {w.type}
                  </Badge>
                </motion.li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
