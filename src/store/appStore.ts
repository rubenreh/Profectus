import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
	ActivityLevel,
	AppStateSnapshot,
	DiaryEntry,
	FoodItem,
	GoalType,
	MacroTargets,
	MealType,
	Recipe,
	UserProfile,
	WeightEntry,
	WorkoutSession,
} from "@/lib/types";

import { nanoid } from "nanoid";

export function lbsToKg(lbs: number): number {
  return lbs / 2.2046226218;
}

export function kgToLbs(kg: number): number {
  return kg * 2.2046226218;
}

export function inchesToCm(inches: number): number {
  return inches * 2.54;
}

export function cmToInches(cm: number): number {
  return cm / 2.54;
}

function activityMultiplier(level: ActivityLevel): number {
	switch (level) {
		case "sedentary":
			return 1.2;
		case "light":
			return 1.375;
		case "moderate":
			return 1.55;
		case "active":
			return 1.725;
		case "very_active":
			return 1.9;
		default:
			return 1.2;
	}
}

export function calculateTDEE(profile: UserProfile): number {
	// Mifflin-St Jeor Equation
	const s = profile.gender === "male" ? 5 : -161; // treat non-binary as female baseline for now
	const bmr = 10 * profile.weightKg + 6.25 * profile.heightCm - 5 * profile.age + s;
	return Math.round(bmr * activityMultiplier(profile.activityLevel));
}

export function deriveMacroTargets(profile: UserProfile): MacroTargets {
    const tdee = calculateTDEE(profile);
	let calories = tdee;
	if (profile.goal === "cut") calories = Math.round(tdee * 0.8);
	if (profile.goal === "bulk") calories = Math.round(tdee * 1.1);

	// Defaults: protein 2.0 g/kg, fats 0.8 g/kg, remainder carbs
    const proteinGrams = Math.round(profile.weightKg * 2.0);
    const fatGrams = Math.round(profile.weightKg * 0.8);
	const caloriesAfterPF = calories - (proteinGrams * 4 + fatGrams * 9);
	const carbGrams = Math.max(0, Math.round(caloriesAfterPF / 4));

	return { calories, proteinGrams, fatGrams, carbGrams };
}

type AppStore = AppStateSnapshot & {
	// profile and targets
	setProfile: (profile: UserProfile) => void;
	setTargets: (targets: MacroTargets) => void;

	// weights
	addWeight: (dateISO: string, weightKg: number) => void;
	removeWeight: (id: string) => void;

	// foods
	addFood: (food: Omit<FoodItem, "id">) => string;
	updateFood: (food: FoodItem) => void;
	removeFood: (id: string) => void;

	// pantry
	addPantryItem: (food: Omit<FoodItem, "id">) => string;
	updatePantryItem: (food: FoodItem) => void;
	removePantryItem: (id: string) => void;

	// diary
	addDiaryEntry: (entry: Omit<DiaryEntry, "id">) => string;
	updateDiaryEntry: (entry: DiaryEntry) => void;
	removeDiaryEntry: (id: string) => void;

	// workouts
	addWorkout: (workout: Omit<WorkoutSession, "id">) => string;
	updateWorkout: (workout: WorkoutSession) => void;
	removeWorkout: (id: string) => void;

	// cookbook
	addRecipe: (recipe: Omit<Recipe, "id" | "createdAt">) => string;
	updateRecipe: (recipe: Recipe) => void;
	removeRecipe: (id: string) => void;

	// workout split
	setSelectedWorkoutSplit: (splitId: string | undefined) => void;
};

export const useAppStore = create<AppStore>()(
	persist(
		(set, get) => ({
			profile: undefined,
			targets: undefined,
			weights: [],
			diary: [],
			foods: [
				{
					id: nanoid(),
					name: "Chicken Breast, cooked",
					servingSize: "100 g",
					calories: 165,
					proteinGrams: 31,
					carbGrams: 0,
					fatGrams: 3.6,
				},
				{
					id: nanoid(),
					name: "White Rice, cooked",
					servingSize: "100 g",
					calories: 130,
					proteinGrams: 2.4,
					carbGrams: 28,
					fatGrams: 0.3,
				},
				{
					id: nanoid(),
					name: "Olive Oil",
					servingSize: "1 tbsp (14 g)",
					calories: 119,
					proteinGrams: 0,
					carbGrams: 0,
					fatGrams: 13.5,
				},
			],
			pantry: [],
			workouts: [],
			cookbook: [],
			selectedWorkoutSplit: undefined,

            setProfile: (profile) => {
                const unit = profile.unitSystem ?? "metric";
                // Normalize to metric for storage
                const normalized: UserProfile = {
                    ...profile,
                    unitSystem: unit,
                    heightCm: profile.heightCm,
                    weightKg: profile.weightKg,
                    goalWeightKg: profile.goalWeightKg,
                };
                const targets = deriveMacroTargets(normalized);
                set({ profile: normalized, targets });
            },
			setTargets: (targets) => set({ targets }),

			addWeight: (dateISO, weightKg) => {
				const entry: WeightEntry = { id: nanoid(), date: dateISO, weightKg };
				set({ weights: [...get().weights, entry] });
			},
			removeWeight: (id) => set({ weights: get().weights.filter((w) => w.id !== id) }),

			addFood: (food) => {
				const withId: FoodItem = { id: nanoid(), ...food };
				set({ foods: [withId, ...get().foods] });
				return withId.id;
			},
			updateFood: (food) => set({ foods: get().foods.map((f) => (f.id === food.id ? food : f)) }),
			removeFood: (id) => set({ foods: get().foods.filter((f) => f.id !== id) }),

			addPantryItem: (food) => {
				const withId: FoodItem = { id: nanoid(), ...food };
				set({ pantry: [withId, ...get().pantry] });
				return withId.id;
			},
			updatePantryItem: (food) => set({ pantry: get().pantry.map((f) => (f.id === food.id ? food : f)) }),
			removePantryItem: (id) => set({ pantry: get().pantry.filter((f) => f.id !== id) }),

			addDiaryEntry: (entry) => {
				const withId: DiaryEntry = { id: nanoid(), ...entry };
				set({ diary: [withId, ...get().diary] });
				return withId.id;
			},
			updateDiaryEntry: (entry) => set({ diary: get().diary.map((d) => (d.id === entry.id ? entry : d)) }),
			removeDiaryEntry: (id) => set({ diary: get().diary.filter((d) => d.id !== id) }),

			addWorkout: (workout) => {
				const withId: WorkoutSession = { id: nanoid(), ...workout };
				set({ workouts: [withId, ...get().workouts] });
				return withId.id;
			},
			updateWorkout: (workout) => set({ workouts: get().workouts.map((w) => (w.id === workout.id ? workout : w)) }),
			removeWorkout: (id) => set({ workouts: get().workouts.filter((w) => w.id !== id) }),

			addRecipe: (recipe) => {
				const withId: Recipe = { 
					id: nanoid(), 
					...recipe,
					createdAt: new Date().toISOString()
				};
				set({ cookbook: [withId, ...get().cookbook] });
				return withId.id;
			},
			updateRecipe: (recipe) => set({ cookbook: get().cookbook.map((r) => r.id === recipe.id ? recipe : r) }),
			removeRecipe: (id) => set({ cookbook: get().cookbook.filter((r) => r.id !== id) }),

			setSelectedWorkoutSplit: (splitId) => set({ selectedWorkoutSplit: splitId }),
		}),
		{
			name: "fitness-app-store",
			version: 1,
		}
	)
);


