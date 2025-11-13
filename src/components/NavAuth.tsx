"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useAppStore } from "@/store/appStore";
import { DemoForm } from "./DemoForm";

export function NavAuth() {
  const { user, logout } = useAuth();
  const profile = useAppStore((s) => s.profile);
  const router = useRouter();
  const [showDemoForm, setShowDemoForm] = useState(false);

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  if (!user) {
    return (
      <>
        <button
          onClick={() => setShowDemoForm(true)}
          className="group inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 px-6 py-2.5 text-sm font-semibold text-white shadow-[0_4px_15px_rgba(34,211,238,0.25)] transition hover:shadow-[0_6px_20px_rgba(52,211,153,0.3)] hover:from-cyan-600 hover:to-emerald-600"
        >
          Book a Demo
          <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
        </button>
        {showDemoForm && <DemoForm onClose={() => setShowDemoForm(false)} />}
      </>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <span className="text-sm text-neutral-300">{profile?.name || "Account"}</span>
      <button
        onClick={handleLogout}
        className="rounded-md bg-white/10 px-4 py-2 text-xs hover:bg-white/15"
      >
        Logout
      </button>
    </div>
  );
}

