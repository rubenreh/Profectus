import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { NavAuth } from "@/components/NavAuth";
import { ClientRoot } from "@/components/ClientRoot";
import { Navigation } from "@/components/Navigation";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "FitTrack - The Most Researched Physical Health Platform",
  description: "AI-powered fitness and health coach with access to the world's most comprehensive research database. Get evidence-based fitness, nutrition, and health guidance.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-neutral-950 text-neutral-100`}
      >
        <AuthProvider>
          <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-4">
          <Navigation />
          <main className="flex-1 py-6"><ClientRoot>{children}</ClientRoot></main>
          <footer className="py-8 text-center text-xs opacity-60">© {new Date().getFullYear()} FitTrack</footer>
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
