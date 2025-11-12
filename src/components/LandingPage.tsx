"use client";
import { useState } from "react";
import { DemoForm } from "./DemoForm";
import { 
  Sparkles, 
  TrendingUp, 
  Target, 
  BookOpen, 
  Zap, 
  Shield,
  ArrowRight,
  CheckCircle2
} from "lucide-react";

export function LandingPage() {
  const [showDemoForm, setShowDemoForm] = useState(false);

  const features = [
    {
      icon: BookOpen,
      title: "Research-Backed",
      description: "Every answer is based on peer-reviewed research and scientific evidence from leading institutions worldwide.",
    },
    {
      icon: Target,
      title: "Personalized Training",
      description: "Get customized workout plans and nutrition guidance tailored to your specific goals and needs.",
    },
    {
      icon: TrendingUp,
      title: "Track Progress",
      description: "Monitor your fitness journey with detailed analytics, weight tracking, and nutrition insights.",
    },
    {
      icon: Zap,
      title: "AI Trainer",
      description: "24/7 access to an AI personal trainer with the knowledge of thousands of research papers.",
    },
    {
      icon: Shield,
      title: "Evidence-Based",
      description: "No fads, no myths. Only scientifically-proven methods for optimal health and performance.",
    },
    {
      icon: Sparkles,
      title: "Comprehensive",
      description: "From exercise science to nutrition, recovery to supplementation - all in one platform.",
    },
  ];

  const benefits = [
    "Access to the world's most comprehensive fitness research database",
    "Personalized advice based on your goals and profile",
    "Real-time tracking of nutrition, workouts, and progress",
    "Evidence-based recommendations you can trust",
    "24/7 AI trainer available whenever you need guidance",
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 md:py-32">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-transparent to-emerald-500/10" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/30 mb-8 animate-fadeIn">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span className="text-sm font-semibold text-cyan-300">
                The Most Researched Physical Health Platform
              </span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-fadeIn">
              <span className="bg-gradient-to-r from-cyan-300 via-emerald-300 to-cyan-300 bg-clip-text text-transparent animate-pulse-subtle">
                Your AI-Powered
              </span>
              <br />
              <span className="text-white">Fitness & Health Coach</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-neutral-300 max-w-3xl mx-auto mb-8 leading-relaxed animate-fadeIn">
              Powered by research from every credible source on the internet. 
              Get evidence-based fitness, nutrition, and health guidance from the most comprehensive knowledge base available.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12 animate-fadeIn">
              <button
                onClick={() => setShowDemoForm(true)}
                className="group px-8 py-4 bg-gradient-to-r from-cyan-600 to-emerald-600 text-white rounded-xl font-semibold text-lg hover:from-cyan-700 hover:to-emerald-700 transition-all shadow-lg hover:shadow-cyan-500/30 flex items-center gap-2"
              >
                Book a Demo
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <a
                href="/login"
                className="px-8 py-4 bg-neutral-800/50 border border-neutral-700 text-white rounded-xl font-semibold text-lg hover:bg-neutral-800 transition-all"
              >
                Sign In
              </a>
            </div>

            <div className="flex flex-wrap justify-center gap-8 text-sm text-neutral-400 animate-fadeIn">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <span>Research-Backed</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <span>AI-Powered</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <span>Personalized</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-neutral-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-cyan-300 to-emerald-300 bg-clip-text text-transparent">
                Why Choose Us
              </span>
            </h2>
            <p className="text-xl text-neutral-400 max-w-2xl mx-auto">
              The most comprehensive physical health platform, powered by research from every credible source on the internet.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="bg-neutral-900/50 border border-neutral-800 rounded-xl p-6 hover:border-cyan-500/30 transition-all hover:shadow-lg hover:shadow-cyan-500/10 animate-fadeIn"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-cyan-500/20 to-emerald-500/20 border border-cyan-500/30 flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-cyan-400" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                  <p className="text-neutral-400 leading-relaxed">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                <span className="bg-gradient-to-r from-cyan-300 to-emerald-300 bg-clip-text text-transparent">
                  Everything You Need
                </span>
                <br />
                <span className="text-white">For Optimal Health</span>
              </h2>
              <p className="text-lg text-neutral-400 mb-8 leading-relaxed">
                Our platform combines cutting-edge AI technology with the world's most comprehensive fitness and health research database. 
                Every recommendation is backed by scientific evidence from peer-reviewed studies, sports science institutions, and leading health organizations.
              </p>
              <ul className="space-y-4 mb-8">
                {benefits.map((benefit, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle2 className="w-6 h-6 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <span className="text-neutral-300">{benefit}</span>
                  </li>
                ))}
              </ul>
              <button
                onClick={() => setShowDemoForm(true)}
                className="px-8 py-4 bg-gradient-to-r from-cyan-600 to-emerald-600 text-white rounded-xl font-semibold hover:from-cyan-700 hover:to-emerald-700 transition-all shadow-lg hover:shadow-cyan-500/30 flex items-center gap-2"
              >
                Book Your Demo
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-cyan-500/10 to-emerald-500/10 rounded-2xl p-8 border border-cyan-500/20">
                <div className="space-y-6">
                  <div className="bg-neutral-900/50 rounded-lg p-6 border border-neutral-800">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500/20 to-emerald-500/20 border border-cyan-500/30 flex items-center justify-center">
                        <Sparkles className="w-5 h-5 text-cyan-400" />
                      </div>
                      <div>
                        <div className="font-semibold text-white">AI Trainer</div>
                        <div className="text-xs text-neutral-400">Online</div>
                      </div>
                    </div>
                    <div className="text-sm text-neutral-300 leading-relaxed">
                      "Based on recent research from the Journal of Sports Sciences, here's an evidence-based approach to your goal..."
                    </div>
                  </div>
                  <div className="bg-neutral-900/50 rounded-lg p-6 border border-neutral-800">
                    <div className="text-sm font-semibold text-cyan-300 mb-2">Today's Progress</div>
                    <div className="space-y-2 text-sm text-neutral-400">
                      <div className="flex justify-between">
                        <span>Calories</span>
                        <span className="text-white">2,150 / 2,400</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Protein</span>
                        <span className="text-white">165g / 180g</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Workout</span>
                        <span className="text-emerald-400">Completed</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-cyan-500/10 via-transparent to-emerald-500/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-cyan-300 to-emerald-300 bg-clip-text text-transparent">
              Ready to Transform
            </span>
            <br />
            <span className="text-white">Your Health Journey?</span>
          </h2>
          <p className="text-xl text-neutral-400 mb-8 max-w-2xl mx-auto">
            Join the most researched physical health platform and get personalized, evidence-based guidance from day one.
          </p>
          <button
            onClick={() => setShowDemoForm(true)}
            className="px-10 py-5 bg-gradient-to-r from-cyan-600 to-emerald-600 text-white rounded-xl font-semibold text-lg hover:from-cyan-700 hover:to-emerald-700 transition-all shadow-lg hover:shadow-cyan-500/30 inline-flex items-center gap-2"
          >
            Book a Demo
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </section>

      {showDemoForm && <DemoForm onClose={() => setShowDemoForm(false)} />}
    </div>
  );
}

