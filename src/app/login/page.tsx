"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignup, setIsSignup] = useState(false);
  const [error, setError] = useState("");
  const { login, signup } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      if (isSignup) {
        await signup(email, password);
      } else {
        await login(email, password);
      }
      router.push("/");
    } catch (err: any) {
      setError(err.message || "Authentication failed");
    }
  };

  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="w-full max-w-md space-y-6 rounded-lg border border-neutral-800 bg-neutral-900 p-6">
        <h1 className="text-2xl font-bold">{isSignup ? "Sign Up" : "Sign In"}</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-2 block text-sm text-neutral-400">Email</label>
            <input
              type="email"
              className="w-full rounded-md border border-neutral-800 bg-neutral-950 p-2"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="mb-2 block text-sm text-neutral-400">Password</label>
            <input
              type="password"
              className="w-full rounded-md border border-neutral-800 bg-neutral-950 p-2"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
            />
          </div>
          {error && <div className="text-sm text-red-400">{error}</div>}
          <button
            type="submit"
            className="w-full rounded-md bg-white/10 px-4 py-2 hover:bg-white/15"
          >
            {isSignup ? "Sign Up" : "Sign In"}
          </button>
        </form>
        <button
          onClick={() => setIsSignup(!isSignup)}
          className="w-full text-sm text-neutral-400 hover:text-neutral-300"
        >
          {isSignup ? "Already have an account? Sign in" : "Don't have an account? Sign up"}
        </button>
      </div>
    </div>
  );
}

