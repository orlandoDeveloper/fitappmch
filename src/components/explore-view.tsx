import { AnimatePresence, motion } from "framer-motion";
import { Plus, Search, Sparkles } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Toggle } from "@/components/ui/toggle";
import { Separator } from "@/components/ui/separator";
import { exercises } from "@/lib/mock-data";
import { useWorkoutStore } from "@/lib/store";
import type { Equipment, MuscleGroup } from "@/lib/types";

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

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search exercises…"
          className="h-12 pl-11 rounded-2xl bg-card border-border/60 focus-visible:ring-primary/40"
        />
      </div>

      {/* Filters */}
      <div className="space-y-3">
        {/* Muscle group toggles */}
        <div className="flex flex-wrap gap-2">
          {muscles.map((m) => (
            <Toggle
              key={m}
              pressed={muscle === m}
              onPressedChange={() => setMuscle(m)}
              variant="outline"
              size="sm"
              className="rounded-full data-[state=on]:gradient-brand data-[state=on]:border-transparent data-[state=on]:text-primary-foreground data-[state=on]:shadow-[var(--shadow-glow)] border-border/60 text-muted-foreground hover:text-foreground"
            >
              {m}
            </Toggle>
          ))}
        </div>
        {/* Equipment toggles */}
        <div className="flex flex-wrap gap-2">
          {equipments.map((e) => (
            <Toggle
              key={e}
              pressed={equipment === e}
              onPressedChange={() => setEquipment(e)}
              variant="outline"
              size="sm"
              className="rounded-full text-[11px] data-[state=on]:border-success/50 data-[state=on]:bg-success/15 data-[state=on]:text-success border-border/50 text-muted-foreground hover:text-foreground"
            >
              {e}
            </Toggle>
          ))}
        </div>
      </div>

      <Separator className="border-border/40" />

      {/* Exercise grid */}
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
              <Card className="group relative overflow-hidden border-border/60 glass-card h-full flex flex-col">
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity gradient-brand" style={{ mixBlendMode: "overlay" }} />

                <CardHeader className="relative pb-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className="grid h-11 w-11 place-items-center rounded-xl bg-primary/10 text-primary">
                      <Sparkles className="h-5 w-5" />
                    </div>
                    <Badge variant="outline" className="border-border/60 text-[10px] shrink-0">
                      {ex.equipment}
                    </Badge>
                  </div>
                  <CardTitle className="text-base leading-tight">{ex.name}</CardTitle>
                  <CardDescription>{ex.target} · {ex.body_part}</CardDescription>
                </CardHeader>

                <CardFooter className="relative mt-auto pt-0 gap-2 opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0 transition-all">
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
                </CardFooter>
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
