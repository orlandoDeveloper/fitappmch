import type { Exercise, UserStats, WorkoutLog } from "./types";

export const exercises: Exercise[] = [
  { id: "e1", name: "Barbell Bench Press", target: "Chest", body_part: "Pectorals", equipment: "Barbell" },
  { id: "e2", name: "Incline Dumbbell Press", target: "Chest", body_part: "Upper Chest", equipment: "Dumbbell" },
  { id: "e3", name: "Cable Fly", target: "Chest", body_part: "Pectorals", equipment: "Cable" },
  { id: "e4", name: "Deadlift", target: "Back", body_part: "Posterior Chain", equipment: "Barbell" },
  { id: "e5", name: "Pull-Up", target: "Back", body_part: "Lats", equipment: "Bodyweight" },
  { id: "e6", name: "Barbell Row", target: "Back", body_part: "Upper Back", equipment: "Barbell" },
  { id: "e7", name: "Lat Pulldown", target: "Back", body_part: "Lats", equipment: "Machine" },
  { id: "e8", name: "Back Squat", target: "Legs", body_part: "Quads", equipment: "Barbell" },
  { id: "e9", name: "Romanian Deadlift", target: "Legs", body_part: "Hamstrings", equipment: "Barbell" },
  { id: "e10", name: "Leg Press", target: "Legs", body_part: "Quads", equipment: "Machine" },
  { id: "e11", name: "Walking Lunges", target: "Legs", body_part: "Glutes", equipment: "Dumbbell" },
  { id: "e12", name: "Overhead Press", target: "Shoulders", body_part: "Delts", equipment: "Barbell" },
  { id: "e13", name: "Lateral Raise", target: "Shoulders", body_part: "Side Delts", equipment: "Dumbbell" },
  { id: "e14", name: "Face Pull", target: "Shoulders", body_part: "Rear Delts", equipment: "Cable" },
  { id: "e15", name: "Barbell Curl", target: "Arms", body_part: "Biceps", equipment: "Barbell" },
  { id: "e16", name: "Tricep Pushdown", target: "Arms", body_part: "Triceps", equipment: "Cable" },
  { id: "e17", name: "Hammer Curl", target: "Arms", body_part: "Biceps", equipment: "Dumbbell" },
  { id: "e18", name: "Hanging Leg Raise", target: "Core", body_part: "Abs", equipment: "Bodyweight" },
  { id: "e19", name: "Cable Crunch", target: "Core", body_part: "Abs", equipment: "Cable" },
  { id: "e20", name: "Plank", target: "Core", body_part: "Abs", equipment: "Bodyweight" },
];

export const userStats: UserStats = {
  name: "Alex Morgan",
  handle: "@alexlifts",
  streakDays: 5,
  weeklyVolumeKg: 45200,
  weeklyVolumeDelta: 12,
  monthlyWorkoutsDone: 14,
  monthlyWorkoutsGoal: 20,
};

export const recentWorkouts: WorkoutLog[] = [
  { id: "w1", name: "Día de Empuje — Pecho y Hombros", type: "Push", date: "Hoy", durationMin: 62, volumeKg: 8420, exercises: [] },
  { id: "w2", name: "Día de Tirón — Espalda y Bíceps", type: "Pull", date: "Ayer", durationMin: 71, volumeKg: 9180, exercises: [] },
  { id: "w3", name: "Día de Pierna — Foco en Cuádriceps", type: "Legs", date: "Hace 2d", durationMin: 84, volumeKg: 12400, exercises: [] },
  { id: "w4", name: "Hipertrofia Superior", type: "Upper", date: "Hace 4d", durationMin: 58, volumeKg: 7620, exercises: [] },
  { id: "w5", name: "Acondicionamiento Full Body", type: "Full Body", date: "Hace 5d", durationMin: 45, volumeKg: 5900, exercises: [] },
];

export const volumeSeries = [
  { week: "W1", volume: 32000 },
  { week: "W2", volume: 35400 },
  { week: "W3", volume: 34200 },
  { week: "W4", volume: 38900 },
  { week: "W5", volume: 41200 },
  { week: "W6", volume: 40100 },
  { week: "W7", volume: 43500 },
  { week: "W8", volume: 45200 },
];

export const muscleSplit = [
  { group: "Pecho", sets: 24 },
  { group: "Espalda", sets: 28 },
  { group: "Piernas", sets: 32 },
  { group: "Hombros", sets: 18 },
  { group: "Brazos", sets: 20 },
  { group: "Core", sets: 14 },
];
