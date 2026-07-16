import { create } from "zustand";
import type { SetLog, WorkoutExercise } from "./types";

interface AuthState {
  userId: string;
  name: string;
}

interface WorkoutState {
  active: boolean;
  startedAt: number | null;
  name: string;
  exercises: WorkoutExercise[];
  startWorkout: () => void;
  finishWorkout: () => void;
  setName: (name: string) => void;
  addExercise: (exerciseId: string) => void;
  removeExercise: (exerciseId: string) => void;
  addSet: (exerciseId: string) => void;
  updateSet: (exerciseId: string, setId: string, patch: Partial<SetLog>) => void;
  toggleSetComplete: (exerciseId: string, setId: string) => void;
  removeSet: (exerciseId: string, setId: string) => void;
}

interface UIState {
  theme: "dark" | "light";
  toggleTheme: () => void;
}

const uid = () => Math.random().toString(36).slice(2, 9);

const emptySet = (): SetLog => ({
  id: uid(),
  reps: 8,
  weight: 60,
  rpe: 7,
  completed: false,
});

export const useAuthStore = create<AuthState>(() => ({
  userId: "u_alex",
  name: "Alex Morgan",
}));

export const useWorkoutStore = create<WorkoutState>((set) => ({
  active: false,
  startedAt: null,
  name: "New Workout",
  exercises: [],
  startWorkout: () =>
    set({ active: true, startedAt: Date.now(), name: "Today's Session", exercises: [] }),
  finishWorkout: () =>
    set({ active: false, startedAt: null, name: "New Workout", exercises: [] }),
  setName: (name) => set({ name }),
  addExercise: (exerciseId) =>
    set((s) =>
      s.exercises.some((e) => e.exerciseId === exerciseId)
        ? s
        : { exercises: [...s.exercises, { exerciseId, sets: [emptySet()] }] },
    ),
  removeExercise: (exerciseId) =>
    set((s) => ({ exercises: s.exercises.filter((e) => e.exerciseId !== exerciseId) })),
  addSet: (exerciseId) =>
    set((s) => ({
      exercises: s.exercises.map((e) =>
        e.exerciseId === exerciseId ? { ...e, sets: [...e.sets, emptySet()] } : e,
      ),
    })),
  updateSet: (exerciseId, setId, patch) =>
    set((s) => ({
      exercises: s.exercises.map((e) =>
        e.exerciseId === exerciseId
          ? { ...e, sets: e.sets.map((st) => (st.id === setId ? { ...st, ...patch } : st)) }
          : e,
      ),
    })),
  toggleSetComplete: (exerciseId, setId) =>
    set((s) => ({
      exercises: s.exercises.map((e) =>
        e.exerciseId === exerciseId
          ? {
              ...e,
              sets: e.sets.map((st) =>
                st.id === setId ? { ...st, completed: !st.completed } : st,
              ),
            }
          : e,
      ),
    })),
  removeSet: (exerciseId, setId) =>
    set((s) => ({
      exercises: s.exercises.map((e) =>
        e.exerciseId === exerciseId
          ? { ...e, sets: e.sets.filter((st) => st.id !== setId) }
          : e,
      ),
    })),
}));

export const useUIStore = create<UIState>((set) => ({
  theme: "dark",
  toggleTheme: () => set((s) => ({ theme: s.theme === "dark" ? "light" : "dark" })),
}));
