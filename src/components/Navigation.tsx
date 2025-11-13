"use client";
import Image from "next/image";
import { useAuth } from "@/contexts/AuthContext";
import { NavAuth } from "./NavAuth";

export function Navigation() {
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-40 border-b border-white/5 bg-gradient-to-b from-neutral-950 via-neutral-950/95 to-neutral-950/80 backdrop-blur-xl supports-[backdrop-filter]:bg-neutral-950/60">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#22d3ee08_1px,transparent_1px),linear-gradient(to_bottom,#22d3ee08_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]" />
      <nav className="relative flex items-center justify-between py-6 px-4">
        <a href="/" className="flex items-center gap-3">
          <Image
            src="/ProfectusTransparentLogo.png"
            alt="Profectus logo"
            width={40}
            height={40}
            className="h-10 w-10 drop-shadow-[0_6px_18px_rgba(34,211,238,0.35)]"
            priority
          />
          <span className="text-3xl font-black tracking-tight bg-gradient-to-r from-cyan-300 via-emerald-300 to-cyan-300 bg-clip-text text-transparent transition-all hover:from-cyan-200 hover:via-emerald-200 hover:to-cyan-200">
            Profectus
          </span>
        </a>
        <div className="flex items-center gap-8 text-sm font-medium">
          {user && (
            <>
              <a className="text-neutral-300 hover:text-cyan-300 transition-colors" href="/">Dashboard</a>
              <a className="text-neutral-300 hover:text-cyan-300 transition-colors" href="/profile">Profile</a>
              <a className="text-neutral-300 hover:text-cyan-300 transition-colors" href="/diary">Diary</a>
              <a className="text-neutral-300 hover:text-cyan-300 transition-colors" href="/workouts">Workouts</a>
              <a className="text-neutral-300 hover:text-cyan-300 transition-colors" href="/kitchen">Your Kitchen</a>
              <a className="text-neutral-300 hover:text-cyan-300 transition-colors" href="/trainer">Your Personal Trainer</a>
              <a className="text-neutral-300 hover:text-cyan-300 transition-colors" href="/settings">Settings</a>
            </>
          )}
          <NavAuth />
        </div>
      </nav>
    </header>
  );
}

