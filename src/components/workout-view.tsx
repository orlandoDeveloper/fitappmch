import { AnimatePresence, motion } from "framer-motion";
import {
  Check,
  CheckCircle2,
  Flag,
  Plus,
  Timer,
  Trash2,
  X,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { exercises as allExercises } from "@/lib/mock-data";
import { useWorkoutStore } from "@/lib/store";
import { cn } from "@/lib/utils";

function useElapsed(start: number | null) {
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    if (!start) return;
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, [start]);
  if (!start) return "00:00";
  const sec = Math.floor((now - start) / 1000);
  const m = Math.floor(sec / 60).toString().padStart(2, "0");
  const s = (sec % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

export function WorkoutView() {
  const {
    active,
    startedAt,
    exercises,
    startWorkout,
    finishWorkout,
    addExercise,
    removeExercise,
    addSet,
    updateSet,
    toggleSetComplete,
    removeSet,
  } = useWorkoutStore();

  const [pickerOpen, setPickerOpen] = useState(false);
  const [summaryOpen, setSummaryOpen] = useState(false);
  const elapsed = useElapsed(startedAt);

  const stats = useMemo(() => {
    const totalSets = exercises.reduce((a, e) => a + e.sets.length, 0);
    const completed = exercises.reduce(
      (a, e) => a + e.sets.filter((s) => s.completed).length,
      0,
    );
    const volume = exercises.reduce(
      (a, e) =>
        a +
        e.sets.filter((s) => s.completed).reduce((b, s) => b + s.weight * s.reps, 0),
      0,
    );
    return { totalSets, completed, volume };
  }, [exercises]);

  const getExercise = (id: string) => allExercises.find((e) => e.id === id);

  if (!active) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-10 lg:py-16">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="glass-card border-border/60">
            <CardContent className="pt-8 pb-12 lg:py-16 text-center">
              <div className="mx-auto grid h-20 w-20 place-items-center rounded-3xl gradient-brand shadow-[var(--shadow-glow)]">
                <Flag className="h-10 w-10 text-primary-foreground" />
              </div>
              <h1 className="mt-6 text-3xl font-black tracking-tight">
                ¿Listo para <span className="text-gradient-brand">darlo todo?</span>
              </h1>
              <p className="mt-2 text-muted-foreground max-w-sm mx-auto">
                Inicia una sesión en vivo para registrar series, reps, peso y RPE en tiempo real.
              </p>
              <Button
                onClick={startWorkout}
                className="mt-8 gradient-brand text-primary-foreground rounded-full h-12 px-8 text-base shadow-[var(--shadow-glow)]"
              >
                Iniciar nuevo entreno
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-6 lg:px-8 lg:py-10 space-y-5">
      {/* Session bar */}
      <Card className="glass-card border-border/60 sticky top-16 z-20">
        <CardContent className="py-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl gradient-brand text-primary-foreground">
                <Timer className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Sesión activa</p>
                <p className="text-lg font-black tabular-nums">{elapsed}</p>
              </div>
            </div>
            <div className="hidden sm:flex gap-6 text-xs text-muted-foreground">
              <div className="text-center">
                <p className="text-[10px] uppercase tracking-wider">Series</p>
                <p className="text-foreground font-bold text-sm">
                  {stats.completed}/{stats.totalSets}
                </p>
              </div>
              <div className="text-center">
                <p className="text-[10px] uppercase tracking-wider">Volumen</p>
                <p className="text-foreground font-bold text-sm">
                  {stats.volume.toLocaleString("es-ES")} kg
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Exercises */}
      <AnimatePresence>
        {exercises.map((we) => {
          const ex = getExercise(we.exerciseId);
          if (!ex) return null;
          return (
            <motion.div
              key={we.exerciseId}
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <Card className="glass-card border-border/60">
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <CardTitle className="truncate">{ex.name}</CardTitle>
                      <CardDescription>{ex.target} · {ex.equipment}</CardDescription>
                    </div>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => removeExercise(we.exerciseId)}
                      className="h-8 w-8 shrink-0 text-muted-foreground hover:text-destructive"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>

                <CardContent className="pt-0">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-border/40 hover:bg-transparent">
                        <TableHead className="w-8 text-[10px] uppercase tracking-wider">#</TableHead>
                        <TableHead className="text-[10px] uppercase tracking-wider">Peso (kg)</TableHead>
                        <TableHead className="text-[10px] uppercase tracking-wider">Reps</TableHead>
                        <TableHead className="w-16 text-[10px] uppercase tracking-wider">RPE</TableHead>
                        <TableHead className="w-10" />
                        <TableHead className="w-10" />
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {we.sets.map((s, i) => (
                        <TableRow
                          key={s.id}
                          className={cn(
                            "border-border/40 hover:bg-transparent transition-colors",
                            s.completed && "bg-success/10",
                          )}
                        >
                          <TableCell className="text-xs font-bold text-muted-foreground py-2">
                            {i + 1}
                          </TableCell>
                          <TableCell className="py-2">
                            <Input
                              type="number"
                              value={s.weight}
                              onChange={(e) =>
                                updateSet(we.exerciseId, s.id, {
                                  weight: Number(e.target.value) || 0,
                                })
                              }
                              className="h-9 bg-input/60 border-border/60 focus-visible:ring-primary/40 text-sm"
                            />
                          </TableCell>
                          <TableCell className="py-2">
                            <Input
                              type="number"
                              value={s.reps}
                              onChange={(e) =>
                                updateSet(we.exerciseId, s.id, {
                                  reps: Number(e.target.value) || 0,
                                })
                              }
                              className="h-9 bg-input/60 border-border/60 focus-visible:ring-primary/40 text-sm"
                            />
                          </TableCell>
                          <TableCell className="py-2">
                            <Input
                              type="number"
                              min={1}
                              max={10}
                              value={s.rpe}
                              onChange={(e) =>
                                updateSet(we.exerciseId, s.id, {
                                  rpe: Number(e.target.value) || 0,
                                })
                              }
                              className="h-9 bg-input/60 border-border/60 focus-visible:ring-primary/40 text-sm"
                            />
                          </TableCell>
                          <TableCell className="py-2">
                            <motion.button
                              whileTap={{ scale: 0.85 }}
                              onClick={() => toggleSetComplete(we.exerciseId, s.id)}
                              className={cn(
                                "grid h-9 w-9 place-items-center rounded-xl transition-all",
                                s.completed
                                  ? "gradient-success text-success-foreground shadow-md"
                                  : "bg-muted text-muted-foreground hover:bg-accent",
                              )}
                            >
                              <motion.span
                                animate={s.completed ? { scale: [1, 1.3, 1] } : {}}
                                transition={{ duration: 0.3 }}
                              >
                                <Check className="h-4 w-4" strokeWidth={3} />
                              </motion.span>
                            </motion.button>
                          </TableCell>
                          <TableCell className="py-2">
                            <button
                              onClick={() => removeSet(we.exerciseId, s.id)}
                              className="grid h-9 w-9 place-items-center rounded-xl text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => addSet(we.exerciseId)}
                    className="mt-3 w-full text-primary hover:text-primary hover:bg-primary/10 rounded-xl"
                  >
                    <Plus className="h-4 w-4" /> Añadir serie
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </AnimatePresence>

      <Button
        variant="outline"
        onClick={() => setPickerOpen(true)}
        className="w-full h-14 border-dashed border-border/60 rounded-2xl hover:bg-accent hover:border-primary/40"
      >
        <Plus className="h-4 w-4" /> Añadir ejercicio
      </Button>

      {/* Floating finish button */}
      {exercises.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed bottom-24 md:bottom-8 right-4 lg:right-8 z-40"
        >
          <Button
            onClick={() => setSummaryOpen(true)}
            className="gradient-success text-success-foreground rounded-full h-14 px-6 shadow-[var(--shadow-glow)] font-bold"
          >
            <CheckCircle2 className="h-5 w-5" /> Finalizar entreno
          </Button>
        </motion.div>
      )}

      {/* Exercise picker dialog */}
      <Dialog open={pickerOpen} onOpenChange={setPickerOpen}>
        <DialogContent className="max-w-lg bg-card border-border/60">
          <DialogHeader>
            <DialogTitle>Elige un ejercicio</DialogTitle>
            <DialogDescription>Añádelo a tu sesión activa.</DialogDescription>
          </DialogHeader>
          <Separator className="border-border/40" />
          <div className="max-h-[60vh] overflow-y-auto space-y-1 -mx-2 px-2">
            {allExercises.map((ex) => (
              <button
                key={ex.id}
                onClick={() => {
                  addExercise(ex.id);
                  toast.success(`${ex.name} añadido`);
                  setPickerOpen(false);
                }}
                className="w-full flex items-center gap-3 rounded-xl px-3 py-2.5 hover:bg-accent text-left transition-colors"
              >
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold truncate">{ex.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {ex.target} · {ex.equipment}
                  </p>
                </div>
                <Badge variant="outline" className="border-border/60 text-[10px] shrink-0">
                  {ex.body_part}
                </Badge>
              </button>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* Workout summary dialog */}
      <Dialog open={summaryOpen} onOpenChange={setSummaryOpen}>
        <DialogContent className="max-w-md bg-card border-border/60">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black">
              Entreno <span className="text-gradient-brand">completado!</span>
            </DialogTitle>
            <DialogDescription>Gran trabajo. Aquí está el resumen de tu sesión.</DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-3 gap-3 my-4">
            <div className="rounded-2xl bg-muted/50 p-4 text-center">
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Duración</p>
              <p className="text-xl font-black mt-1 tabular-nums">{elapsed}</p>
            </div>
            <div className="rounded-2xl bg-muted/50 p-4 text-center">
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Series</p>
              <p className="text-xl font-black mt-1">{stats.completed}</p>
            </div>
            <div className="rounded-2xl bg-muted/50 p-4 text-center">
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Volumen</p>
              <p className="text-xl font-black mt-1">
                {(stats.volume / 1000).toFixed(1)}<span className="text-xs">k</span>
              </p>
            </div>
          </div>
          <Button
            onClick={() => {
              finishWorkout();
              setSummaryOpen(false);
              toast.success("¡Entreno guardado!", { description: "Buena sesión." });
            }}
            className="w-full gradient-brand text-primary-foreground rounded-xl h-11"
          >
            Guardar y finalizar
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}
