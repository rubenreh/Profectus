"use client";
import { usePathname } from "next/navigation";
import { useFirestoreSync } from "@/hooks/useFirestoreSync";
import { AuthGuard } from "@/components/AuthGuard";
import { useAuth } from "@/contexts/AuthContext";

export function ClientRoot({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user } = useAuth();
  const isLoginPage = pathname === "/login";
  const isHomePage = pathname === "/";
  
  // Always call hook, but it will handle the user check internally
  useFirestoreSync();
  
  // Don't protect the login page or home page (home page shows landing page for unauthenticated users)
  if (isLoginPage || isHomePage) {
    return <>{children}</>;
  }
  
  return <AuthGuard>{children}</AuthGuard>;
}


