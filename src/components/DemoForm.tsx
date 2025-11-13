"use client";
import { useEffect } from "react";
import { useForm, ValidationError } from "@formspree/react";
import { Loader2, Send, CheckCircle2 } from "lucide-react";

export function DemoForm({ onClose }: { onClose: () => void }) {
  const [state, handleSubmit] = useForm("xyzlzgok");

  useEffect(() => {
    if (state.succeeded) {
      const timeout = setTimeout(() => onClose(), 2200);
      return () => clearTimeout(timeout);
    }
  }, [state.succeeded, onClose]);

  if (state.succeeded) {
    return (
      <div className="fixed inset-0 z-[100] flex items-start justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 100 }}>
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl mt-20 mb-8">
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center mb-4">
              <CheckCircle2 className="w-8 h-8 text-emerald-400" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">Thank You!</h3>
            <p className="text-neutral-400">
              We've received your demo request. We'll be in touch soon!
            </p>
          </div>
        </div>
      </div>
    );
  }

  const submitting = state.submitting;

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-start justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto" 
      role="dialog" 
      aria-modal="true"
      style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 100 }}
    >
      <div className="relative w-full max-w-md rounded-2xl border border-neutral-800 bg-neutral-900 p-8 shadow-2xl animate-fadeIn mt-20 mb-8">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-10 rounded-lg p-2 text-neutral-400 transition hover:bg-neutral-800 hover:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
          aria-label="Close demo request form"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="mb-6">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-cyan-300 to-emerald-300 bg-clip-text text-transparent">
            Book a Demo
          </h2>
          <p className="text-sm text-neutral-400 mt-2">
            Experience how Profectus orchestrates AI-driven coaching. Share your goals and we will schedule a tailored walkthrough.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="hidden" name="formType" value="Book a demo" />

          <div>
            <label htmlFor="name" className="block text-sm font-medium text-neutral-300 mb-2">
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              required
              className="w-full bg-neutral-950/50 border border-neutral-700/50 rounded-lg px-4 py-3 text-white placeholder-neutral-500 focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 transition-all"
              placeholder="Your name"
            />
            <ValidationError prefix="Name" field="name" errors={state.errors} />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-neutral-300 mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              className="w-full bg-neutral-950/50 border border-neutral-700/50 rounded-lg px-4 py-3 text-white placeholder-neutral-500 focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 transition-all"
              placeholder="your.email@example.com"
            />
            <ValidationError prefix="Email" field="email" errors={state.errors} />
          </div>

          <div>
            <label htmlFor="goal" className="block text-sm font-medium text-neutral-300 mb-2">
              Your Goal
            </label>
            <textarea
              id="goal"
              name="message"
              required
              rows={3}
              className="w-full bg-neutral-950/50 border border-neutral-700/50 rounded-lg px-4 py-3 text-white placeholder-neutral-500 focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 transition-all resize-none"
              placeholder="Tell us about your fitness goals..."
            />
            <ValidationError prefix="Message" field="message" errors={state.errors} />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-gradient-to-r from-cyan-600 to-emerald-600 text-white rounded-lg px-6 py-3 font-semibold hover:from-cyan-700 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-cyan-500/20"
          >
            {submitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <Send className="w-5 h-5" />
                Request Demo
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

