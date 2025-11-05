"use client";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useAppStore } from "@/store/appStore";

export function NavAuth() {
  const { user, logout } = useAuth();
  const profile = useAppStore((s) => s.profile);
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  if (!user) {
    return (
      <a className="opacity-90 hover:opacity-100" href="/login">
        Login
      </a>
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

