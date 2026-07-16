import { AnimatePresence, motion } from "framer-motion";
import { Plus, Search, Sparkles } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { exercises } from "@/lib/mock-data";
import { useWorkoutStore } from "@/lib/store";
import type { Equipment, MuscleGroup } from "@/lib/types";
import { cn } from "@/lib/utils";

const muscles: (MuscleGroup | "All")[] = ["All", "Chest", "Back", "Legs", "Shoulders", "Arms", "Core"];
const equipments: (Equipment | "All")[] = ["All", "Barbell", "Dumbbell", "Machine", "Cable", "Bodyweight"];

export function ExploreView() {
  const [q, setQ] = useState("");
  const [muscle, setMuscle] = useState<(typeof muscles)[number]>("All");
  const [equipment, setEquipment] = useState<(typeof equipments)[number]>("All");
  const addExercise = useWorkoutStore((s) => s.addExercise);

  const filtered = useMemo(() => {
    return exercises.filter((e) => {
      if (muscle !== "All" && e.target !== muscle) return false;
      if (equipment !== "All" && e.equipment !== equipment) return false;
      if (q && !e.name.toLowerCase().includes(q.toLowerCase())) return false;
      return true;
    });
  }, [q, muscle, equipment]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 lg:px-8 lg:py-10 space-y-6">
      <div>
        <h1 className="text-3xl lg:text-4xl font-black tracking-tight">
          Explore <span className="text-gradient-brand">Exercises</span>
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Discover movements. Perfect your technique.
        </p>
      </div>

      {/* Search + filters */}
      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search exercises…"
            className="h-12 pl-11 rounded-2xl bg-card border-border/60 focus-visible:ring-primary/40"
          />
        </div>

        <div className="space-y-2">
          <div className="flex flex-wrap gap-2">
            {muscles.map((m) => (
              <button
                key={m}
                onClick={() => setMuscle(m)}
                className={cn(
                  "rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-all",
                  muscle === m
                    ? "gradient-brand border-transparent text-primary-foreground shadow-[var(--shadow-glow)]"
                    : "border-border/60 bg-card text-muted-foreground hover:text-foreground hover:border-primary/40",
                )}
              >
                {m}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            {equipments.map((e) => (
              <button
                key={e}
                onClick={() => setEquipment(e)}
                className={cn(
                  "rounded-full border px-3 py-1 text-[11px] font-medium transition-all",
                  equipment === e
                    ? "border-success/50 bg-success/15 text-success"
                    : "border-border/50 text-muted-foreground hover:text-foreground",
                )}
              >
                {e}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        <AnimatePresence mode="popLayout">
          {filtered.map((ex, i) => (
            <motion.div
              key={ex.id}
              layout
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ delay: Math.min(i * 0.03, 0.3), duration: 0.35 }}
            >
              <Card className="group relative overflow-hidden border-border/60 glass-card p-5 h-full">
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity gradient-brand" style={{ mixBlendMode: "overlay" }} />
                <div className="relative flex flex-col h-full">
                  <div className="flex items-start justify-between gap-2">
                    <div className="grid h-11 w-11 place-items-center rounded-xl bg-primary/10 text-primary">
                      <Sparkles className="h-5 w-5" />
                    </div>
                    <Badge variant="outline" className="border-border/60 text-[10px]">
                      {ex.equipment}
                    </Badge>
                  </div>
                  <h3 className="mt-4 font-bold text-base leading-tight">{ex.name}</h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    {ex.target} · {ex.body_part}
                  </p>

                  <div className="mt-4 flex gap-2 opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0 transition-all">
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1 border-border/60 h-8 text-xs"
                    >
                      Technique
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => {
                        addExercise(ex.id);
                        toast.success(`Added ${ex.name} to workout`);
                      }}
                      className="flex-1 gradient-brand text-primary-foreground h-8 text-xs"
                    >
                      <Plus className="h-3 w-3" /> Add
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16 text-muted-foreground">
          No exercises match those filters.
        </div>
      )}
    </div>
  );
}
