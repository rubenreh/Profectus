"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
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
          className="opacity-90 hover:opacity-100"
        >
          Book a Demo
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

