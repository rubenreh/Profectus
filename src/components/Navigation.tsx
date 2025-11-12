"use client";
import { useAuth } from "@/contexts/AuthContext";
import { NavAuth } from "./NavAuth";

export function Navigation() {
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-10 bg-neutral-950/80 backdrop-blur supports-[backdrop-filter]:bg-neutral-950/60">
      <nav className="flex items-center justify-between py-5">
        <a href="/" className="text-2xl font-bold tracking-tight bg-gradient-to-r from-cyan-300 to-emerald-300 bg-clip-text text-transparent">
          FitTrack
        </a>
        <div className="flex items-center gap-6 text-sm">
          {user && (
            <>
              <a className="opacity-90 hover:opacity-100" href="/">Dashboard</a>
              <a className="opacity-90 hover:opacity-100" href="/profile">Profile</a>
              <a className="opacity-90 hover:opacity-100" href="/diary">Diary</a>
              <a className="opacity-90 hover:opacity-100" href="/workouts">Workouts</a>
              <a className="opacity-90 hover:opacity-100" href="/kitchen">Your Kitchen</a>
              <a className="opacity-90 hover:opacity-100" href="/trainer">Your Personal Trainer</a>
              <a className="opacity-90 hover:opacity-100" href="/settings">Settings</a>
            </>
          )}
          <NavAuth />
        </div>
      </nav>
    </header>
  );
}

