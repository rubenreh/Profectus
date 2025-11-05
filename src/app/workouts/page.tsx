"use client";
import { useState } from "react";
import { useAppStore } from "@/store/appStore";
import { formatDate } from "@/lib/dateUtils";
import { WORKOUT_SPLITS } from "@/lib/workoutSplits";
import type { WorkoutSplit } from "@/lib/workoutSplits";

export default function WorkoutsPage() {
  const workouts = useAppStore((s) => s.workouts);
  const selectedSplit = useAppStore((s) => s.selectedWorkoutSplit);
  const setSelectedSplit = useAppStore((s) => s.setSelectedWorkoutSplit);
  const addWorkout = useAppStore((s) => s.addWorkout);
  const updateWorkout = useAppStore((s) => s.updateWorkout);
  const removeWorkout = useAppStore((s) => s.removeWorkout);

  const today = new Date().toISOString().slice(0, 10);
  const [date, setDate] = useState<string>(today);
  const [title, setTitle] = useState<string>("Workout");
  const [selectedDay, setSelectedDay] = useState<string | null>(null);

  const currentSplit = selectedSplit ? WORKOUT_SPLITS.find(s => s.id === selectedSplit) : null;
  const currentDay = currentSplit && selectedDay 
    ? currentSplit.days.find(d => d.name === selectedDay) 
    : null;

  const handleDaySelect = (dayName: string) => {
    setSelectedDay(dayName);
    setTitle(dayName);
  };

  const handleAddWorkoutFromDay = () => {
    if (!currentDay || currentDay.exercises.length === 0) return;
    
    const exercises = currentDay.exercises.map(exName => ({
      id: crypto.randomUUID(),
      name: exName,
      sets: [],
    }));

    addWorkout({ 
      date: date + "T00:00:00", 
      title: currentDay.name, 
      exercises,
      cardio: [] 
    });
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Workouts</h1>
      </div>

      {/* Workout Split Selection */}
      <div className="space-y-4 rounded-lg border border-neutral-800 bg-neutral-900 p-6">
        <h2 className="text-xl font-bold text-cyan-300">Choose Your Workout Split</h2>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
          {WORKOUT_SPLITS.map((split) => (
            <button
              key={split.id}
              onClick={() => {
                setSelectedSplit(split.id);
                setSelectedDay(null);
              }}
              className={`rounded-lg border-2 p-4 text-left transition-all duration-200 ${
                selectedSplit === split.id
                  ? "border-cyan-500 bg-cyan-500/10 shadow-lg shadow-cyan-500/20"
                  : "border-neutral-800 bg-neutral-950 hover:border-neutral-700 hover:bg-neutral-900"
              }`}
            >
              <div className="font-semibold text-lg">{split.name}</div>
              <div className="mt-1 text-xs text-neutral-400">{split.days.length} training days</div>
            </button>
          ))}
        </div>
      </div>

      {/* Day Selection and Exercise List */}
      {currentSplit && (
        <div className="space-y-4 rounded-lg border border-neutral-800 bg-neutral-900 p-6 animate-slideIn">
          <h2 className="text-xl font-bold text-emerald-300">Select Training Day</h2>
          <div className="flex flex-wrap gap-3">
            {currentSplit.days.map((day) => (
              <button
                key={day.name}
                onClick={() => handleDaySelect(day.name)}
                className={`rounded-lg border-2 px-4 py-2 transition-all duration-200 ${
                  selectedDay === day.name
                    ? "border-emerald-500 bg-emerald-500/10 text-emerald-300 shadow-lg shadow-emerald-500/20"
                    : "border-neutral-800 bg-neutral-950 text-neutral-300 hover:border-neutral-700 hover:bg-neutral-900"
                }`}
              >
                {day.name}
              </button>
            ))}
          </div>

          {currentDay && (
            <div className="mt-4 space-y-4 animate-fadeIn">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-neutral-200">{currentDay.name}</h3>
                <button
                  onClick={handleAddWorkoutFromDay}
                  className="rounded-md bg-emerald-500/20 px-4 py-2 text-sm font-medium text-emerald-300 hover:bg-emerald-500/25"
                >
                  Create Workout with Exercises
                </button>
              </div>
              <div className="grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-3">
                {currentDay.exercises.length > 0 ? (
                  currentDay.exercises.map((exercise, idx) => (
                    <div
                      key={idx}
                      className="rounded-lg border border-neutral-800 bg-neutral-950 p-3 text-sm transition-all hover:border-neutral-700 hover:bg-neutral-900"
                    >
                      {exercise}
                    </div>
                  ))
                ) : (
                  <div className="col-span-full text-center text-sm text-neutral-500 py-4">
                    Rest day - no exercises
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Manual Workout Creation */}
      <div className="space-y-4 rounded-lg border border-neutral-800 bg-neutral-900 p-6">
        <h2 className="text-xl font-bold text-amber-300">Create Custom Workout</h2>
        <div className="flex flex-wrap items-end gap-3">
          <label className="flex flex-col gap-1">
            <span className="text-xs text-neutral-400">Date</span>
            <input className="rounded-md border border-neutral-800 bg-neutral-950 p-2" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-xs text-neutral-400">Title</span>
            <input className="rounded-md border border-neutral-800 bg-neutral-950 p-2" value={title} onChange={(e) => setTitle(e.target.value)} />
          </label>
          <button 
            className="rounded-md bg-cyan-500/20 px-4 py-2 text-sm font-medium text-cyan-300 hover:bg-cyan-500/25 transition-all" 
            onClick={() => addWorkout({ date: date + "T00:00:00", title, exercises: [], cardio: [] })}
          >
            Add Workout
          </button>
        </div>
      </div>

      {/* Workout List */}
      <div className="space-y-3">
        <h2 className="text-xl font-bold text-purple-300">Your Workouts</h2>
        {workouts.map((w) => (
          <WorkoutCard key={w.id} workoutId={w.id} />
        ))}
        {workouts.length === 0 && <div className="text-sm text-neutral-500">No workouts yet</div>}
      </div>
    </div>
  );
}

function WorkoutCard({ workoutId }: { workoutId: string }) {
  const workout = useAppStore((s) => s.workouts.find((x) => x.id === workoutId));
  const update = useAppStore((s) => s.updateWorkout);
  const remove = useAppStore((s) => s.removeWorkout);
  if (!workout) return null;

  const workoutDate = workout.date.includes('T') ? workout.date.slice(0, 10) : workout.date;

  return (
    <div className="space-y-4 rounded-xl border border-neutral-800 bg-neutral-900 p-5 transition-all hover:border-neutral-700 animate-fadeIn">
      <div className="flex items-center justify-between gap-3">
        <input className="min-w-0 flex-1 rounded-md border border-neutral-700 bg-neutral-950 p-3 text-lg font-semibold" value={workout.title ?? "Workout"} onChange={(e) => update({ ...workout, title: e.target.value })} />
        <div className="text-sm text-neutral-400">{formatDate(workoutDate)}</div>
        <button className="rounded-md bg-red-500/20 px-3 py-2 text-sm text-red-300 hover:bg-red-500/25 transition-all" onClick={() => remove(workout.id)}>Delete</button>
      </div>

      <div className="space-y-3">
        <div className="text-sm font-semibold uppercase tracking-wide text-cyan-400">Exercises</div>
        {workout.exercises.map((ex, i) => (
          <div key={ex.id} className="space-y-2 rounded-lg border border-neutral-800 bg-neutral-950 p-3 transition-all hover:border-neutral-700">
            <input className="w-full rounded-md border border-neutral-700 bg-neutral-900 p-2 font-medium" value={ex.name} onChange={(e) => {
              const next = { ...workout };
              next.exercises[i] = { ...ex, name: e.target.value };
              update(next);
            }} />
            <div className="space-y-2">
              <div className="mb-2 flex items-center justify-between text-xs text-neutral-400">
                <span>Sets: {ex.sets.length}</span>
                <button
                  className="rounded-md bg-cyan-500/20 px-2 py-1 text-xs text-cyan-300 hover:bg-cyan-500/25 transition-all"
                  onClick={() => {
                    const next = { ...workout };
                    next.exercises[i].sets.push({ id: crypto.randomUUID(), setType: "normal", reps: 10, weight: 0, toFailure: false });
                    update(next);
                  }}
                >
                  + Add Set
                </button>
              </div>
              {ex.sets.map((s, si) => (
                <div key={s.id} className="rounded-lg border border-neutral-700 bg-neutral-900 p-3 transition-all hover:border-neutral-600">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-xs font-semibold text-neutral-300">Set {si + 1}</span>
                    <button
                      className="text-xs text-red-400 hover:text-red-300 transition-colors"
                      onClick={() => {
                        const next = { ...workout };
                        next.exercises[i].sets = next.exercises[i].sets.filter((_, idx) => idx !== si);
                        update(next);
                      }}
                    >
                      Remove
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="mb-1 block text-xs text-neutral-400">Set Type</label>
                      <select
                        className="w-full rounded-md border border-neutral-700 bg-neutral-950 p-2 text-sm"
                        value={s.setType}
                        onChange={(e) => {
                          const next = { ...workout };
                          next.exercises[i].sets[si] = { ...s, setType: e.target.value as any };
                          update(next);
                        }}
                      >
                        <option value="normal">Normal Set</option>
                        <option value="dropset">Drop Set</option>
                        <option value="superset">Super Set</option>
                        <option value="amrap">AMRAP</option>
                      </select>
                    </div>
                    <div>
                      <label className="mb-1 block text-xs text-neutral-400">Reps</label>
                      <input
                        className="w-full rounded-md border border-neutral-700 bg-neutral-950 p-2 text-sm"
                        type="number"
                        min="0"
                        placeholder="Reps"
                        value={s.reps ?? ""}
                        onChange={(e) => {
                          const next = { ...workout };
                          next.exercises[i].sets[si] = { ...s, reps: e.target.value ? Number(e.target.value) : undefined };
                          update(next);
                        }}
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs text-neutral-400">Weight (kg)</label>
                      <input
                        className="w-full rounded-md border border-neutral-700 bg-neutral-950 p-2 text-sm"
                        type="number"
                        min="0"
                        step="0.5"
                        placeholder="Weight"
                        value={s.weight ?? ""}
                        onChange={(e) => {
                          const next = { ...workout };
                          next.exercises[i].sets[si] = { ...s, weight: e.target.value ? Number(e.target.value) : undefined };
                          update(next);
                        }}
                      />
                    </div>
                    <div className="flex items-end">
                      <label className="flex w-full items-center gap-2 rounded-md border border-neutral-700 bg-neutral-950 p-2 text-sm">
                        <input
                          type="checkbox"
                          checked={!!s.toFailure}
                          onChange={(e) => {
                            const next = { ...workout };
                            next.exercises[i].sets[si] = { ...s, toFailure: e.target.checked };
                            update(next);
                          }}
                          className="h-4 w-4"
                        />
                        <span className="text-xs">To Failure</span>
                      </label>
                    </div>
                  </div>
                  {(s.setType === "dropset" || s.setType === "superset") && (
                    <div className="mt-2 text-xs text-amber-400">
                      {s.setType === "dropset" && "💡 Drop set: Reduce weight after reaching failure"}
                      {s.setType === "superset" && "💡 Super set: Perform immediately after previous exercise"}
                    </div>
                  )}
                </div>
              ))}
              {ex.sets.length === 0 && (
                <div className="py-4 text-center text-sm text-neutral-500">No sets added. Click "Add Set" to get started.</div>
              )}
            </div>
          </div>
        ))}
        <button className="rounded-md bg-cyan-500/20 px-3 py-2 text-sm text-cyan-300 hover:bg-cyan-500/25 transition-all" onClick={() => {
          update({ ...workout, exercises: [...workout.exercises, { id: crypto.randomUUID(), name: "New Exercise", sets: [] }] });
        }}>Add Exercise</button>
      </div>

      <div className="space-y-2">
        <div className="text-sm font-semibold uppercase tracking-wide text-purple-400">Cardio</div>
        {(workout.cardio ?? []).map((c, ci) => (
          <div key={c.id} className="grid grid-cols-3 gap-2 rounded-md border border-neutral-800 bg-neutral-950 p-3 transition-all hover:border-neutral-700">
            <input className="rounded-md border border-neutral-700 bg-neutral-900 p-2" value={c.type} onChange={(e) => {
              const next = { ...workout };
              next.cardio![ci] = { ...c, type: e.target.value };
              update(next);
            }} />
            <input className="rounded-md border border-neutral-700 bg-neutral-900 p-2" type="number" placeholder="Minutes" value={c.durationMinutes} onChange={(e) => {
              const next = { ...workout };
              next.cardio![ci] = { ...c, durationMinutes: Number(e.target.value) };
              update(next);
            }} />
            <input className="rounded-md border border-neutral-700 bg-neutral-900 p-2" type="number" placeholder="Calories (optional)" value={c.caloriesBurned ?? 0} onChange={(e) => {
              const next = { ...workout };
              next.cardio![ci] = { ...c, caloriesBurned: Number(e.target.value) };
              update(next);
            }} />
          </div>
        ))}
        <button className="rounded-md bg-cyan-500/20 px-3 py-2 text-sm text-cyan-300 hover:bg-cyan-500/25 transition-all" onClick={() => {
          update({ ...workout, cardio: [...(workout.cardio ?? []), { id: crypto.randomUUID(), type: "Running", durationMinutes: 20 }] });
        }}>Add Cardio</button>
      </div>
    </div>
  );
}
