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
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
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
          <Card className="glass-card border-border/60 p-8 lg:p-12 text-center">
            <div className="mx-auto grid h-20 w-20 place-items-center rounded-3xl gradient-brand shadow-[var(--shadow-glow)]">
              <Flag className="h-10 w-10 text-primary-foreground" />
            </div>
            <h1 className="mt-6 text-3xl font-black tracking-tight">
              Ready to <span className="text-gradient-brand">crush it?</span>
            </h1>
            <p className="mt-2 text-muted-foreground max-w-sm mx-auto">
              Start a live session to log sets, reps, weight and RPE in real
              time.
            </p>
            <Button
              onClick={startWorkout}
              className="mt-8 gradient-brand text-primary-foreground rounded-full h-12 px-8 text-base shadow-[var(--shadow-glow)]"
            >
              Start new workout
            </Button>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-6 lg:px-8 lg:py-10 space-y-5">
      {/* Session bar */}
      <Card className="glass-card border-border/60 p-4 sticky top-16 z-20">
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 sm:flex sm:justify-between">
          <div className="flex min-w-0 items-center gap-3">
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl gradient-brand text-primary-foreground">
              <Timer className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <p className="text-xs text-muted-foreground">Active session</p>
              <p className="text-lg font-black tabular-nums">{elapsed}</p>
            </div>
          </div>
          <div className="hidden sm:flex gap-4 text-xs text-muted-foreground">
            <div>
              <p className="text-[10px] uppercase tracking-wider">Sets</p>
              <p className="text-foreground font-bold">
                {stats.completed}/{stats.totalSets}
              </p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wider">Volume</p>
              <p className="text-foreground font-bold">
                {stats.volume.toLocaleString()} kg
              </p>
            </div>
          </div>
        </div>
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
              <Card className="glass-card border-border/60 p-5">
                <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
                  <div className="min-w-0">
                    <h3 className="font-bold truncate">{ex.name}</h3>
                    <p className="text-xs text-muted-foreground">
                      {ex.target} · {ex.equipment}
                    </p>
                  </div>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => removeExercise(we.exerciseId)}
                    className="h-8 w-8 text-muted-foreground hover:text-destructive"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                <div className="mt-4 grid grid-cols-[24px_1fr_1fr_60px_40px_40px] gap-2 items-center text-[10px] uppercase tracking-wider text-muted-foreground font-semibold px-1">
                  <span>#</span>
                  <span>Weight (kg)</span>
                  <span>Reps</span>
                  <span>RPE</span>
                  <span />
                  <span />
                </div>

                <div className="mt-1 space-y-1.5">
                  {we.sets.map((s, i) => (
                    <motion.div
                      key={s.id}
                      layout
                      className={cn(
                        "grid grid-cols-[24px_1fr_1fr_60px_40px_40px] gap-2 items-center rounded-xl px-1 py-1 transition-colors",
                        s.completed && "bg-success/10",
                      )}
                    >
                      <span className="text-xs font-bold text-muted-foreground pl-1">
                        {i + 1}
                      </span>
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
                      <button
                        onClick={() => removeSet(we.exerciseId, s.id)}
                        className="grid h-9 w-9 place-items-center rounded-xl text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </motion.div>
                  ))}
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => addSet(we.exerciseId)}
                  className="mt-3 w-full text-primary hover:text-primary hover:bg-primary/10 rounded-xl"
                >
                  <Plus className="h-4 w-4" /> Add set
                </Button>
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
        <Plus className="h-4 w-4" /> Add exercise
      </Button>

      {/* Floating finish button */}
      {exercises.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed bottom-24 lg:bottom-8 right-4 lg:right-8 z-40"
        >
          <Button
            onClick={() => setSummaryOpen(true)}
            className="gradient-success text-success-foreground rounded-full h-14 px-6 shadow-[var(--shadow-glow)] font-bold"
          >
            <CheckCircle2 className="h-5 w-5" /> Finish workout
          </Button>
        </motion.div>
      )}

      {/* Exercise picker */}
      <Dialog open={pickerOpen} onOpenChange={setPickerOpen}>
        <DialogContent className="max-w-lg bg-card border-border/60">
          <DialogHeader>
            <DialogTitle>Pick an exercise</DialogTitle>
            <DialogDescription>Add to your active session.</DialogDescription>
          </DialogHeader>
          <div className="max-h-[60vh] overflow-y-auto space-y-1 -mx-2 px-2">
            {allExercises.map((ex) => (
              <button
                key={ex.id}
                onClick={() => {
                  addExercise(ex.id);
                  toast.success(`Added ${ex.name}`);
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

      {/* Summary modal */}
      <Dialog open={summaryOpen} onOpenChange={setSummaryOpen}>
        <DialogContent className="max-w-md bg-card border-border/60">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black">
              Workout <span className="text-gradient-brand">complete!</span>
            </DialogTitle>
            <DialogDescription>Great work. Here's your session.</DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-3 gap-3 my-4">
            <div className="rounded-2xl bg-muted/50 p-4 text-center">
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Duration</p>
              <p className="text-xl font-black mt-1 tabular-nums">{elapsed}</p>
            </div>
            <div className="rounded-2xl bg-muted/50 p-4 text-center">
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Sets</p>
              <p className="text-xl font-black mt-1">{stats.completed}</p>
            </div>
            <div className="rounded-2xl bg-muted/50 p-4 text-center">
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Volume</p>
              <p className="text-xl font-black mt-1">
                {(stats.volume / 1000).toFixed(1)}<span className="text-xs">k</span>
              </p>
            </div>
          </div>
          <Button
            onClick={() => {
              finishWorkout();
              setSummaryOpen(false);
              toast.success("Workout saved!", { description: "Nice session." });
            }}
            className="w-full gradient-brand text-primary-foreground rounded-xl h-11"
          >
            Save & finish
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}
