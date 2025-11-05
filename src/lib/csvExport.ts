import Papa from "papaparse";
import type { DiaryEntry, WorkoutSession, WeightEntry } from "./types";

export function exportMacrosToCSV(diary: DiaryEntry[]) {
  const groupedByDate = diary.reduce(
    (acc, entry) => {
      const date = entry.date;
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(entry);
      return acc;
    },
    {} as Record<string, DiaryEntry[]>
  );

  const rows: any[] = [];
  Object.entries(groupedByDate)
    .sort((a, b) => a[0].localeCompare(b[0]))
    .forEach(([date, entries]) => {
      const totals = entries.reduce(
        (acc, e) => {
          const q = e.quantity;
          acc.calories += e.food.calories * q;
          acc.protein += e.food.proteinGrams * q;
          acc.carbs += e.food.carbGrams * q;
          acc.fats += e.food.fatGrams * q;
          return acc;
        },
        { calories: 0, protein: 0, carbs: 0, fats: 0 }
      );

      // Summary row
      rows.push({
        Date: date,
        Meal: "TOTAL",
        Food: "",
        Quantity: "",
        Calories: totals.calories.toFixed(1),
        Protein_g: totals.protein.toFixed(1),
        Carbs_g: totals.carbs.toFixed(1),
        Fats_g: totals.fats.toFixed(1),
      });

      // Individual entries
      entries.forEach((entry) => {
        rows.push({
          Date: date,
          Meal: entry.meal,
          Food: entry.food.name,
          Quantity: entry.quantity,
          Calories: (entry.food.calories * entry.quantity).toFixed(1),
          Protein_g: (entry.food.proteinGrams * entry.quantity).toFixed(1),
          Carbs_g: (entry.food.carbGrams * entry.quantity).toFixed(1),
          Fats_g: (entry.food.fatGrams * entry.quantity).toFixed(1),
        });
      });

      // Empty row between dates
      rows.push({
        Date: "",
        Meal: "",
        Food: "",
        Quantity: "",
        Calories: "",
        Protein_g: "",
        Carbs_g: "",
        Fats_g: "",
      });
    });

  const csv = Papa.unparse(rows);
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `macros-export-${new Date().toISOString().slice(0, 10)}.csv`;
  link.click();
}

export function exportWorkoutsToCSV(workouts: WorkoutSession[]) {
  const rows: any[] = [];

  workouts
    .slice()
    .sort((a, b) => a.date.localeCompare(b.date))
    .forEach((workout) => {
      const date = workout.date.slice(0, 10);
      const time = workout.date.slice(11, 16);

      rows.push({
        Date: date,
        Time: time,
        Title: workout.title || "",
        Exercise: "",
        Type: "",
        Sets: "",
        Reps: "",
        Weight_kg: "",
        To_Failure: "",
        Cardio_Type: "",
        Cardio_Duration_min: "",
        Cardio_Calories: "",
      });

      workout.exercises.forEach((exercise) => {
        exercise.sets.forEach((set, idx) => {
          rows.push({
            Date: date,
            Time: time,
            Title: workout.title || "",
            Exercise: idx === 0 ? exercise.name : "",
            Type: set.setType,
            Sets: `${idx + 1}`,
            Reps: set.reps?.toString() || "",
            Weight_kg: set.weight?.toString() || "",
            To_Failure: set.toFailure ? "Yes" : "No",
            Cardio_Type: "",
            Cardio_Duration_min: "",
            Cardio_Calories: "",
          });
        });
      });

      workout.cardio?.forEach((cardio) => {
        rows.push({
          Date: date,
          Time: time,
          Title: workout.title || "",
          Exercise: "",
          Type: "",
          Sets: "",
          Reps: "",
          Weight_kg: "",
          To_Failure: "",
          Cardio_Type: cardio.type,
          Cardio_Duration_min: cardio.durationMinutes.toString(),
          Cardio_Calories: cardio.caloriesBurned?.toString() || "",
        });
      });

      rows.push({
        Date: "",
        Time: "",
        Title: "",
        Exercise: "",
        Type: "",
        Sets: "",
        Reps: "",
        Weight_kg: "",
        To_Failure: "",
        Cardio_Type: "",
        Cardio_Duration_min: "",
        Cardio_Calories: "",
      });
    });

  const csv = Papa.unparse(rows);
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `workouts-export-${new Date().toISOString().slice(0, 10)}.csv`;
  link.click();
}

export function exportWeightToCSV(weights: WeightEntry[]) {
  const rows = weights
    .slice()
    .sort((a, b) => a.date.localeCompare(b.date))
    .map((entry) => ({
      Date: entry.date,
      Weight_kg: entry.weightKg.toFixed(2),
    }));

  rows.unshift({ Date: "Date", Weight_kg: "Weight (kg)" });

  const csv = Papa.unparse(rows);
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `weight-export-${new Date().toISOString().slice(0, 10)}.csv`;
  link.click();
}

