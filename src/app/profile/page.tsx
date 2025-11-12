"use client";
import { useMemo, useState, useEffect } from "react";
import { useAppStore, deriveMacroTargets, cmToInches, inchesToCm, kgToLbs, lbsToKg } from "@/store/appStore";
import type { ActivityLevel, Gender, GoalType } from "@/lib/types";

export default function ProfilePage() {
  const profile = useAppStore((s) => s.profile);
  const setProfile = useAppStore((s) => s.setProfile);

  const [unit, setUnit] = useState<"metric" | "imperial">(profile?.unitSystem ?? "metric");
  
  const initializeForm = useMemo(() => {
    const defaultHeight = 175;
    const defaultWeight = 75;
    const defaultAge = 30;
    
    const heightCm = profile?.heightCm ?? defaultHeight;
    const weightKg = profile?.weightKg ?? defaultWeight;
    const goalWeightKg = profile?.goalWeightKg ?? weightKg;
    
    const heightValue: number = unit === "imperial" 
      ? parseFloat(cmToInches(heightCm).toFixed(1)) 
      : heightCm;
    const weightValue: number = unit === "imperial" 
      ? parseFloat(kgToLbs(weightKg).toFixed(1)) 
      : weightKg;
    const goalWeightValue: number = unit === "imperial" 
      ? parseFloat(kgToLbs(goalWeightKg).toFixed(1)) 
      : goalWeightKg;
    
    return {
      name: profile?.name ?? "",
      height: heightValue,
      weight: weightValue,
      age: profile?.age ?? defaultAge,
      gender: (profile?.gender ?? "male") as Gender,
      activityLevel: (profile?.activityLevel ?? "moderate") as ActivityLevel,
      goal: (profile?.goal ?? "maintain") as GoalType,
      goalWeight: goalWeightValue,
    };
  }, [profile, unit]);
  
  const [form, setForm] = useState(initializeForm);
  const [showMacrosEditor, setShowMacrosEditor] = useState(false);
  const targets = useAppStore((s) => s.targets);
  const setTargets = useAppStore((s) => s.setTargets);
  
  // Sync form when profile or unit changes
  useEffect(() => {
    setForm(initializeForm);
  }, [initializeForm]);
  
  // Show macros editor after profile is saved
  useEffect(() => {
    if (profile && targets) {
      setShowMacrosEditor(true);
    }
  }, [profile, targets]);
  
  // Recalculate targets whenever form values change (for preview)
  const previewTargets = useMemo(() => {
    if (!form.height || !form.weight || !form.age) return null;
    const heightCm = unit === "imperial" ? inchesToCm(form.height) : form.height;
    const weightKg = unit === "imperial" ? lbsToKg(form.weight) : form.weight;
    return deriveMacroTargets({
      heightCm,
      weightKg,
      age: form.age,
      gender: form.gender,
      activityLevel: form.activityLevel,
      goal: form.goal,
    } as any);
  }, [form.height, form.weight, form.age, form.gender, form.activityLevel, form.goal, unit]);

  const addWeight = useAppStore((s) => s.addWeight);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const heightCm = unit === "imperial" ? inchesToCm(form.height) : form.height;
    const weightKg = unit === "imperial" ? lbsToKg(form.weight) : form.weight;
    const goalWeightKg = unit === "imperial" ? lbsToKg(form.goalWeight) : form.goalWeight;
    
    const today = new Date().toISOString().slice(0, 10);
    
    // If weight changed, add/update today's weight entry
    if (profile && Math.abs(profile.weightKg - weightKg) > 0.01) {
      // Check if today's weight entry exists
      const weights = useAppStore.getState().weights;
      const todayWeight = weights.find(w => w.date === today);
      
      if (!todayWeight) {
        // Add new weight entry for today
        addWeight(today, weightKg);
      }
    }
    
    setProfile({
      name: form.name,
      unitSystem: unit,
      heightCm,
      weightKg,
      age: form.age,
      gender: form.gender as Gender,
      activityLevel: form.activityLevel as ActivityLevel,
      goal: form.goal as GoalType,
      goalWeightKg,
      cardioFrequencyPerWeek: profile?.cardioFrequencyPerWeek ?? 3,
      weightFrequencyPerWeek: profile?.weightFrequencyPerWeek ?? 4,
    });
    setShowMacrosEditor(true);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <h1 className="text-2xl font-bold">Profile</h1>
      
      {/* Show saved profile info */}
      {profile && (
        <div className="rounded-lg border border-cyan-500/30 bg-cyan-950/20 p-4">
          <h2 className="mb-2 text-sm font-semibold text-cyan-300">✓ Profile Saved</h2>
          <div className="grid grid-cols-2 gap-2 text-xs text-neutral-400">
            <div>Name: <span className="text-neutral-200">{profile.name || "—"}</span></div>
            <div>Gender: <span className="text-neutral-200 capitalize">{profile.gender}</span></div>
            <div>Age: <span className="text-neutral-200">{profile.age}</span></div>
            <div>Goal: <span className="text-neutral-200 capitalize">{profile.goal}</span></div>
            <div>
              Height: <span className="text-neutral-200">
                {unit === "imperial" ? `${cmToInches(profile.heightCm).toFixed(1)} in` : `${profile.heightCm} cm`}
              </span>
            </div>
            <div>
              Weight: <span className="text-neutral-200">
                {unit === "imperial" ? `${kgToLbs(profile.weightKg).toFixed(1)} lb` : `${profile.weightKg} kg`}
              </span>
            </div>
            {profile.cardioFrequencyPerWeek && (
              <div>Cardio: <span className="text-neutral-200">{profile.cardioFrequencyPerWeek}x/week</span></div>
            )}
            {profile.weightFrequencyPerWeek && (
              <div>Weights: <span className="text-neutral-200">{profile.weightFrequencyPerWeek}x/week</span></div>
            )}
          </div>
        </div>
      )}
      
      <form
        className="grid grid-cols-1 gap-4 md:grid-cols-2"
        onSubmit={handleSubmit}
      >
        <Input label="Name" value={form.name} onChange={(v) => setForm({ ...form, name: v })} />
        <Select label="Units" value={unit} onChange={(v) => {
          const nextUnit = v as "metric" | "imperial";
          // Convert existing values to the next unit for display
          // If switching from metric to imperial, convert cm to inches
          // If switching from imperial to metric, convert inches to cm
          const currentHeightCm = unit === "imperial" ? inchesToCm(form.height) : form.height;
          const currentWeightKg = unit === "imperial" ? lbsToKg(form.weight) : form.weight;
          const currentGoalWeightKg = unit === "imperial" ? lbsToKg(form.goalWeight) : form.goalWeight;
          
          const height: number = nextUnit === "imperial" 
            ? parseFloat(cmToInches(currentHeightCm).toFixed(1)) 
            : Math.round(currentHeightCm);
          const weight: number = nextUnit === "imperial" 
            ? parseFloat(kgToLbs(currentWeightKg).toFixed(1)) 
            : parseFloat(currentWeightKg.toFixed(1));
          const goalWeight: number = nextUnit === "imperial" 
            ? parseFloat(kgToLbs(currentGoalWeightKg).toFixed(1)) 
            : parseFloat(currentGoalWeightKg.toFixed(1));
          setUnit(nextUnit);
          setForm({ ...form, height, weight, goalWeight });
        }} options={["metric","imperial"]} />
        <Select label="Gender" value={form.gender} onChange={(v) => setForm({ ...form, gender: v as Gender })} options={["male","female","other"]} />
        {unit === "imperial" ? (
          <HeightFeetInches label="Height" value={form.height} onChange={(v) => setForm({ ...form, height: v })} />
        ) : (
          <Number label="Height (cm)" value={form.height} onChange={(v) => setForm({ ...form, height: v })} />
        )}
        <Number label={unit === "imperial" ? "Weight (lb)" : "Weight (kg)"} value={form.weight} onChange={(v) => setForm({ ...form, weight: v })} />
        <Number label="Age" value={form.age} onChange={(v) => setForm({ ...form, age: v })} />
        <Select label="Activity" value={form.activityLevel} onChange={(v) => setForm({ ...form, activityLevel: v as ActivityLevel })} options={["sedentary","light","moderate","active","very_active"]} />
        <Select label="Goal" value={form.goal} onChange={(v) => setForm({ ...form, goal: v as GoalType })} options={["cut","maintain","bulk"]} />
        <Number label={unit === "imperial" ? "Goal weight (lb)" : "Goal weight (kg)"} value={form.goalWeight ?? 0} onChange={(v) => setForm({ ...form, goalWeight: v })} />

        <div className="md:col-span-2 flex items-center gap-3">
          <button className="rounded-md bg-white/10 px-4 py-2 text-sm hover:bg-white/15" type="submit">
            {profile ? "Update" : "Save"}
          </button>
          <Preview unit={unit} {...form} />
        </div>
      </form>
      
      {/* Editable Macros Section - shown after profile is saved */}
      {showMacrosEditor && targets && profile && (
        <MacrosEditor 
          key={`${profile.goal}-${profile.weightKg}-${targets.calories}`} // Force re-render when goal, weight, or targets change
          initialTargets={targets}
          initialCardioFreq={profile.cardioFrequencyPerWeek ?? 3}
          initialWeightFreq={profile.weightFrequencyPerWeek ?? 4}
          onSave={(newTargets, cardioFreq, weightFreq) => {
            setTargets(newTargets);
            if (profile) {
              setProfile({
                ...profile,
                cardioFrequencyPerWeek: cardioFreq,
                weightFrequencyPerWeek: weightFreq,
              });
            }
          }}
        />
      )}
    </div>
  );
}

function MacrosEditor({
  initialTargets,
  initialCardioFreq,
  initialWeightFreq,
  onSave,
}: {
  initialTargets: { calories: number; proteinGrams: number; carbGrams: number; fatGrams: number };
  initialCardioFreq: number;
  initialWeightFreq: number;
  onSave: (targets: typeof initialTargets, cardioFreq: number, weightFreq: number) => void;
}) {
  const [targets, setTargets] = useState(initialTargets);
  const [cardioFreq, setCardioFreq] = useState(initialCardioFreq);
  const [weightFreq, setWeightFreq] = useState(initialWeightFreq);
  
  // Update local state when initialTargets change (e.g., when profile goal/weight changes)
  useEffect(() => {
    setTargets(initialTargets);
  }, [initialTargets.calories, initialTargets.proteinGrams, initialTargets.carbGrams, initialTargets.fatGrams]);
  
  useEffect(() => {
    setCardioFreq(initialCardioFreq);
  }, [initialCardioFreq]);
  
  useEffect(() => {
    setWeightFreq(initialWeightFreq);
  }, [initialWeightFreq]);
  
  return (
    <div className="rounded-lg border border-emerald-500/30 bg-emerald-950/20 p-6">
      <h2 className="mb-4 text-lg font-semibold text-emerald-300">✨ Awesome! Here are your recommended macros</h2>
      <p className="mb-4 text-sm text-neutral-400">You can adjust these values and click Save to update your targets.</p>
      
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 mb-4">
        <Number label="Calories (kcal/day)" value={targets.calories} onChange={(v) => setTargets({ ...targets, calories: Math.max(0, v) })} />
        <Number label="Protein (g/day)" value={targets.proteinGrams} onChange={(v) => setTargets({ ...targets, proteinGrams: Math.max(0, v) })} />
        <Number label="Carbs (g/day)" value={targets.carbGrams} onChange={(v) => setTargets({ ...targets, carbGrams: Math.max(0, v) })} />
        <Number label="Fats (g/day)" value={targets.fatGrams} onChange={(v) => setTargets({ ...targets, fatGrams: Math.max(0, v) })} />
      </div>
      
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 mb-4">
        <Number label="Cardio Frequency (times per week)" value={cardioFreq} onChange={(v) => setCardioFreq(Math.max(0, Math.min(7, v)))} />
        <Number label="Weight Training Frequency (times per week)" value={weightFreq} onChange={(v) => setWeightFreq(Math.max(0, Math.min(7, v)))} />
      </div>
      
      <button
        onClick={() => onSave(targets, cardioFreq, weightFreq)}
        className="rounded-md bg-emerald-500/20 px-4 py-2 text-sm font-medium text-emerald-300 hover:bg-emerald-500/25"
      >
        Save Macros & Frequencies
      </button>
    </div>
  );
}

function Input({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-xs text-neutral-400">{label}</span>
      <input 
        className="rounded-md border border-neutral-800 bg-neutral-900 p-2" 
        value={value} 
        onChange={(e) => onChange(e.target.value)}
        autoComplete="off"
        autoCapitalize="off"
        autoCorrect="off"
      />
    </label>
  );
}

function HeightFeetInches({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) {
  // Convert total inches to feet and inches
  const totalInches = typeof value === "number" && !isNaN(value) ? value : 0;
  const feet = Math.floor(totalInches / 12);
  const inches = totalInches % 12;
  
  const [feetValue, setFeetValue] = useState(String(feet || ""));
  const [inchesValue, setInchesValue] = useState(String(inches || ""));
  
  // Update when value prop changes
  useEffect(() => {
    const total = typeof value === "number" && !isNaN(value) ? value : 0;
    const f = Math.floor(total / 12);
    const i = total % 12;
    setFeetValue(String(f || ""));
    setInchesValue(String(i || ""));
  }, [value]);
  
  const handleChange = (newFeet: string, newInches: string) => {
    setFeetValue(newFeet);
    setInchesValue(newInches);
    const f = parseFloat(newFeet) || 0;
    const i = parseFloat(newInches) || 0;
    const totalInches = f * 12 + i;
    onChange(totalInches);
  };
  
  return (
    <label className="flex flex-col gap-1">
      <span className="text-xs text-neutral-400">{label}</span>
      <div className="flex gap-2">
        <div className="flex-1">
          <input 
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            autoComplete="off"
            autoCapitalize="off"
            autoCorrect="off"
            data-form-type="other"
            className="w-full rounded-md border border-neutral-800 bg-neutral-900 p-2" 
            placeholder="Feet"
            value={feetValue}
            onChange={(e) => {
              const val = e.target.value.replace(/[^0-9]/g, '');
              handleChange(val, inchesValue);
            }}
          />
          <span className="text-xs text-neutral-500 mt-1 block">ft</span>
        </div>
        <div className="flex-1">
          <input 
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            autoComplete="off"
            autoCapitalize="off"
            autoCorrect="off"
            data-form-type="other"
            className="w-full rounded-md border border-neutral-800 bg-neutral-900 p-2" 
            placeholder="Inches"
            value={inchesValue}
            onChange={(e) => {
              const val = e.target.value.replace(/[^0-9.]/g, '');
              handleChange(feetValue, val);
            }}
          />
          <span className="text-xs text-neutral-500 mt-1 block">in</span>
        </div>
      </div>
    </label>
  );
}

function Number({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) {
  // Ensure value is always a valid number
  const numValue = typeof value === "number" && !isNaN(value) ? value : 0;
  const displayValue = numValue === 0 ? "" : String(numValue);
  
  return (
    <label className="flex flex-col gap-1">
      <span className="text-xs text-neutral-400">{label}</span>
      <input 
        type="text"
        inputMode="decimal"
        pattern="[0-9]*"
        autoComplete="off"
        autoCapitalize="off"
        autoCorrect="off"
        data-form-type="other"
        className="rounded-md border border-neutral-800 bg-neutral-900 p-2" 
        value={displayValue}
        onChange={(e) => {
          const val = e.target.value.replace(/[^0-9.]/g, '');
          const numVal = val === "" ? 0 : parseFloat(val);
          if (!isNaN(numVal)) {
            onChange(numVal);
          }
        }}
      />
    </label>
  );
}

function Select({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: string[] }) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-xs text-neutral-400">{label}</span>
      <select className="rounded-md border border-neutral-800 bg-neutral-900 p-2" value={value} onChange={(e) => onChange(e.target.value)}>
        {options.map((o) => (
          <option key={o} value={o}>{o}</option>
        ))}
      </select>
    </label>
  );
}

function Preview(props: { unit: "metric" | "imperial"; height: number; weight: number; age: number; gender: Gender; activityLevel: ActivityLevel; goal: GoalType }) {
  const targets = useAppStore((s) => s.targets);
  const valid = useMemo(() => isFinite(props.height as any) && isFinite(props.weight as any) && isFinite(props.age as any) && props.height > 0 && props.weight > 0 && props.age > 0, [props.height, props.weight, props.age]);
  
  const heightCm = props.unit === "imperial" ? inchesToCm(props.height) : props.height;
  const weightKg = props.unit === "imperial" ? lbsToKg(props.weight) : props.weight;
  const calculated = deriveMacroTargets({ heightCm, weightKg, age: props.age, gender: props.gender, activityLevel: props.activityLevel, goal: props.goal } as any);
  
  if (!valid) return <div className="text-xs text-neutral-500">Fill fields to see suggested targets</div>;
  
  // Show saved targets if available, otherwise show calculated preview
  const displayTargets = targets || calculated;
  const isSaved = !!targets;
  
  return (
    <div className={`rounded-lg border ${isSaved ? "border-cyan-500/30 bg-cyan-950/20" : "border-neutral-800 bg-neutral-950"} p-3`}>
      <div className="text-xs font-semibold text-neutral-300 mb-1">
        {isSaved ? "✓ Saved Targets" : "Preview (will save on Update)"}
      </div>
      <div className="text-xs text-neutral-400 space-y-1">
        <div>Calories: <span className="text-cyan-300 font-semibold">{displayTargets.calories} kcal</span></div>
        <div>Protein: <span className="text-emerald-300 font-semibold">{displayTargets.proteinGrams}g</span></div>
        <div>Carbs: <span className="text-amber-300 font-semibold">{displayTargets.carbGrams}g</span></div>
        <div>Fats: <span className="text-pink-300 font-semibold">{displayTargets.fatGrams}g</span></div>
      </div>
    </div>
  );
}


