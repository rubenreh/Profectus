"use client";
import { useFirestoreSync } from "@/hooks/useFirestoreSync";
import { AuthGuard } from "@/components/AuthGuard";

export function ClientRoot({ children }: { children: React.ReactNode }) {
  useFirestoreSync();
  return <AuthGuard>{children}</AuthGuard>;
}


