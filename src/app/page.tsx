"use client";
import { useMemo } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useAppStore, kgToLbs } from "@/store/appStore";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { formatDate } from "@/lib/dateUtils";
import { LandingPage } from "@/components/LandingPage";

function Dashboard() {
  const profile = useAppStore((s) => s.profile);
  const targets = useAppStore((s) => s.targets);
  const diary = useAppStore((s) => s.diary);
  const weights = useAppStore((s) => s.weights);

  const today = new Date().toISOString().slice(0, 10);
  const todayTotals = useMemo(() => {
    const entries = diary.filter((d) => d.date === today);
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
    return totals;
  }, [diary, today]);

  // Calculate streak (consecutive days with diary entries)
  const streak = useMemo(() => {
    if (diary.length === 0) return 0;
    
    const dates = [...new Set(diary.map(d => d.date))].sort((a, b) => b.localeCompare(a));
    if (dates.length === 0) return 0;
    
    let currentStreak = 0;
    const today = new Date().toISOString().slice(0, 10);
    let checkDate = today;
    
    while (dates.includes(checkDate)) {
      currentStreak++;
      const date = new Date(checkDate + "T00:00:00");
      date.setDate(date.getDate() - 1);
      checkDate = date.toISOString().slice(0, 10);
    }
    
    return currentStreak;
  }, [diary]);

  const unit = profile?.unitSystem ?? "metric";
  
  // Weight chart data
  const weightData = useMemo(() => {
    return [...weights].sort((a, b) => a.date.localeCompare(b.date)).map((w) => ({ 
      date: w.date, 
      kg: w.weightKg,
      display: unit === "imperial" ? kgToLbs(w.weightKg) : w.weightKg
    }));
  }, [weights, unit]);
  
  // Format weight for display
  const formatWeightForDisplay = (weightKg: number) => {
    if (unit === "imperial") {
      return `${kgToLbs(weightKg).toFixed(1)} lb`;
    }
    return `${weightKg.toFixed(1)} kg`;
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      
      <div className="space-y-6">
        <div>
          <h2 className="mb-3 text-xl font-bold text-cyan-300">Today's Totals</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
            <Card 
              title="Calories" 
              value={`${todayTotals.calories.toFixed(0)}${targets ? ` / ${targets.calories}` : ""} kcal`}
              target={targets?.calories}
            />
            <Card 
              title="Protein" 
              value={`${todayTotals.protein.toFixed(0)}${targets ? ` / ${targets.proteinGrams}` : ""} g`}
              target={targets?.proteinGrams}
            />
            <Card 
              title="Carbs" 
              value={`${todayTotals.carbs.toFixed(0)}${targets ? ` / ${targets.carbGrams}` : ""} g`}
              target={targets?.carbGrams}
            />
            <Card 
              title="Fats" 
              value={`${todayTotals.fats.toFixed(0)}${targets ? ` / ${targets.fatGrams}` : ""} g`}
              target={targets?.fatGrams}
            />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="rounded-lg border border-emerald-500/30 bg-emerald-950/20 p-4">
            <div className="text-xs uppercase tracking-wide text-neutral-400 mb-1">Diary Streak</div>
            <div className="text-2xl font-bold text-emerald-300">{streak}</div>
            <div className="text-xs text-neutral-400 mt-1">consecutive days</div>
          </div>
        </div>

        {targets && (
          <div>
            <h2 className="mb-3 text-xl font-bold text-emerald-300">Progress</h2>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <Progress label="Calories" value={todayTotals.calories} target={targets.calories} color="#22d3ee" />
              <Progress label="Protein (g)" value={todayTotals.protein} target={targets.proteinGrams} color="#34d399" />
              <Progress label="Carbs (g)" value={todayTotals.carbs} target={targets.carbGrams} color="#fbbf24" />
              <Progress label="Fats (g)" value={todayTotals.fats} target={targets.fatGrams} color="#f472b6" />
            </div>
          </div>
        )}

        {!profile && (
          <div className="rounded-lg border border-amber-800 bg-amber-950/20 p-4">
            <p className="text-sm text-amber-300">
              💡 <strong>Set up your profile</strong> in the Profile page to get personalized macro targets and track your progress!
            </p>
          </div>
        )}

        {/* Weight Chart */}
        {weights.length > 0 && (
          <div>
            <h2 className="mb-3 text-xl font-bold text-purple-300">Weight Trend</h2>
            <div className="h-72 w-full min-w-0 rounded-lg border border-neutral-800 bg-neutral-900 p-4">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={weightData} margin={{ left: 8, right: 8, top: 8, bottom: 8 }}>
                  <XAxis 
                    dataKey="date" 
                    stroke="#7a7a7a" 
                    tick={{ fontSize: 10 }} 
                    angle={-45}
                    textAnchor="end"
                    height={80}
                    tickFormatter={(value) => {
                      try {
                        return formatDate(value);
                      } catch {
                        return value;
                      }
                    }}
                  />
                  <YAxis 
                    stroke="#7a7a7a" 
                    tick={{ fontSize: 12 }} 
                    domain={["dataMin - 2", "dataMax + 2"]}
                    tickFormatter={(value) => {
                      return unit === "imperial" ? `${kgToLbs(value).toFixed(1)} lb` : `${value.toFixed(1)} kg`;
                    }}
                  />
                  <Tooltip 
                    contentStyle={{ background: "#0a0a0a", border: "1px solid #262626" }} 
                    labelStyle={{ color: "#fff" }}
                    labelFormatter={(value) => formatDate(value)}
                    formatter={(value: number, payload: any) => {
                      const weightKg = payload?.payload?.kg || value;
                      return [formatWeightForDisplay(weightKg), "Weight"];
                    }}
                  />
                  <Line type="monotone" dataKey="kg" stroke="#22d3ee" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>

      <div className="text-sm text-neutral-400">
        Tip: Track meals in the Diary and update your weight from the Profile page.
      </div>
    </div>
  );
}

export default function Home() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-sm text-neutral-400">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return <LandingPage />;
  }

  return <Dashboard />;
}

function Card({ title, value, target }: { title: string; value: string; target?: number }) {
  return (
    <div className="rounded-lg border border-neutral-800 bg-neutral-900 p-4 transition-all hover:border-neutral-700 hover:shadow-lg animate-fadeIn">
      <div className="text-xs uppercase tracking-wide text-neutral-400 font-semibold">{title}</div>
      <div className="mt-2 text-lg font-bold text-neutral-200">{value}</div>
    </div>
  );
}

function Progress({ label, value, target, color }: { label: string; value: number; target: number; color: string }) {
  const pct = Math.min(100, Math.round((value / Math.max(1, target)) * 100));
  return (
    <div className="rounded-lg border border-neutral-800 bg-neutral-900 p-4 transition-all hover:border-neutral-700 hover:shadow-lg animate-fadeIn">
      <div className="mb-2 flex items-center justify-between text-sm">
        <span className="text-neutral-300 font-semibold">{label}</span>
        <span className="text-neutral-400">{value.toFixed(0)} / {target}</span>
      </div>
      <div className="h-2 w-full rounded-full bg-neutral-800">
        <div className="h-2 rounded-full transition-all duration-500 ease-out" style={{ width: pct + "%", background: color }} />
      </div>
    </div>
  );
}
