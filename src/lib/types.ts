export type Gender = "male" | "female" | "other";
export type ActivityLevel = "sedentary" | "light" | "moderate" | "active" | "very_active";
export type GoalType = "cut" | "maintain" | "bulk";

export interface UserProfile {
	name?: string;
	unitSystem?: "metric" | "imperial"; // default metric
	heightCm: number; // when unitSystem is imperial, convert inches->cm for storage
	weightKg: number; // when unitSystem is imperial, convert lbs->kg for storage
	age: number;
	gender: Gender;
	activityLevel: ActivityLevel;
	goal: GoalType;
	goalWeightKg?: number;
	cardioFrequencyPerWeek?: number; // times per week
	weightFrequencyPerWeek?: number; // times per week
}

export interface MacroTargets {
	calories: number; // kcal per day
	proteinGrams: number;
	carbGrams: number;
	fatGrams: number;
}

export interface WeightEntry {
	id: string;
	date: string; // ISO date
	weightKg: number;
}

export type MealType = "breakfast" | "lunch" | "dinner" | "snack";

export interface FoodItem {
	id: string;
	name: string;
	brand?: string;
	servingSize: string; // e.g. "100 g", "1 scoop (30 g)"
	calories: number;
	proteinGrams: number;
	carbGrams: number;
	fatGrams: number;
	sugarsGrams?: number;
	fiberGrams?: number;
	sodiumMg?: number;
	saturatedFatGrams?: number;
	transFatGrams?: number;
	cholesterolMg?: number;
}

export interface DiaryEntry {
	id: string;
	date: string; // ISO date (yyyy-mm-dd)
	meal: MealType;
	food: FoodItem; // snapshot at time of logging (user may edit macros)
	quantity: number; // multiplier for serving (1 = default serving)
}

export type SetType = "normal" | "dropset" | "superset" | "amrap";

export interface ExerciseSet {
	id: string;
	setType: SetType;
	reps?: number; // for AMRAP, store achieved reps
	weight?: number; // kg; optional for bodyweight
	toFailure?: boolean;
}

export interface ExerciseEntry {
	id: string;
	name: string; // e.g. "Barbell Bench Press"
	muscleGroup?: string;
	sets: ExerciseSet[];
}

export interface CardioEntry {
	id: string;
	type: string; // e.g. "Running"
	durationMinutes: number;
	caloriesBurned?: number; // optional
}

export interface WorkoutSession {
	id: string;
	date: string; // ISO date-time
	title?: string; // e.g. "Push Day"
	exercises: ExerciseEntry[];
	cardio?: CardioEntry[];
}

export interface Recipe {
	id: string;
	name: string;
	mealType: MealType;
	ingredients: FoodItem[]; // ingredients used
	instructions: string[]; // cooking steps
	calories: number;
	proteinGrams: number;
	carbGrams: number;
	fatGrams: number;
	servings: number; // number of servings this recipe makes
	createdAt: string; // ISO date-time
}

export interface AppStateSnapshot {
	profile?: UserProfile;
	targets?: MacroTargets;
	weights: WeightEntry[];
	diary: DiaryEntry[]; // by day
	foods: FoodItem[]; // user foods library
	pantry: FoodItem[]; // user's pantry items (for kitchen)
	workouts: WorkoutSession[];
	cookbook: Recipe[]; // saved recipes
	selectedWorkoutSplit?: string; // ID of selected workout split
}


