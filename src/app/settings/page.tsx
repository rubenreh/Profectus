"use client";
import { useAppStore } from "@/store/appStore";
import { exportMacrosToCSV, exportWeightToCSV, exportWorkoutsToCSV } from "@/lib/csvExport";

export default function SettingsPage() {
  const diary = useAppStore((s) => s.diary);
  const weights = useAppStore((s) => s.weights);
  const workouts = useAppStore((s) => s.workouts);

  return (
    <div className="space-y-6 animate-fadeIn">
      <h1 className="text-2xl font-bold">Settings</h1>
      
      <div className="rounded-lg border border-neutral-800 bg-neutral-900 p-6 transition-all hover:border-neutral-700">
        <h2 className="mb-4 text-xl font-bold text-cyan-300">Data Export</h2>
        <p className="mb-4 text-sm text-neutral-400">
          Export your fitness data to CSV files for backup or analysis.
        </p>
        
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <button
            onClick={() => exportMacrosToCSV(diary)}
            className="rounded-md bg-cyan-500/20 px-4 py-3 text-sm font-medium text-cyan-300 hover:bg-cyan-500/25 transition-colors"
          >
            Export Macros (Diary)
          </button>
          
          <button
            onClick={() => exportWeightToCSV(weights)}
            className="rounded-md bg-emerald-500/20 px-4 py-3 text-sm font-medium text-emerald-300 hover:bg-emerald-500/25 transition-colors"
          >
            Export Weight Data
          </button>
          
          <button
            onClick={() => exportWorkoutsToCSV(workouts)}
            className="rounded-md bg-amber-500/20 px-4 py-3 text-sm font-medium text-amber-300 hover:bg-amber-500/25 transition-colors"
          >
            Export Workouts
          </button>
        </div>
      </div>
    </div>
  );
}

