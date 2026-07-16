export type MuscleGroup =
  | "Chest"
  | "Back"
  | "Legs"
  | "Shoulders"
  | "Arms"
  | "Core";

export type Equipment = "Barbell" | "Dumbbell" | "Machine" | "Bodyweight" | "Cable";

export type WorkoutType = "Push" | "Pull" | "Legs" | "Full Body" | "Upper" | "Lower";

export interface Exercise {
  id: string;
  name: string;
  target: MuscleGroup;
  body_part: string;
  equipment: Equipment;
  description?: string;
}

export interface SetLog {
  id: string;
  reps: number;
  weight: number;
  rpe: number;
  completed: boolean;
}

export interface WorkoutExercise {
  exerciseId: string;
  sets: SetLog[];
}

export interface WorkoutLog {
  id: string;
  name: string;
  type: WorkoutType;
  date: string;
  durationMin: number;
  volumeKg: number;
  exercises: WorkoutExercise[];
}

export interface UserStats {
  name: string;
  handle: string;
  streakDays: number;
  weeklyVolumeKg: number;
  weeklyVolumeDelta: number;
  monthlyWorkoutsDone: number;
  monthlyWorkoutsGoal: number;
}
