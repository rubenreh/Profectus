"use client";
import { useMemo, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { DemoForm } from "./DemoForm";
import { 
  Sparkles, 
  TrendingUp, 
  Target, 
  BookOpen, 
  Zap, 
  Shield,
  ArrowRight,
  CheckCircle2,
  BrainCircuit,
  Activity,
  Microwave,
  Dumbbell,
  GraduationCap,
  Github,
  LineChart,
} from "lucide-react";

export function LandingPage() {
  const [showDemoForm, setShowDemoForm] = useState(false);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { damping: 40, stiffness: 300 });
  const springY = useSpring(mouseY, { damping: 40, stiffness: 300 });

  const features = [
    {
      icon: BookOpen,
      title: "Research-Backed",
      description: "Every answer is based on peer-reviewed research and scientific evidence from leading institutions worldwide.",
    },
    {
      icon: BrainCircuit,
      title: "Adaptive Intelligence",
      description: "A custom-trained health intelligence model that adapts to your physiology, history, and goals with every interaction.",
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
      icon: GraduationCap,
      title: "Continuous Learning",
      description: "Daily ingestion pipeline connects to journals, PubMed, and sports science databases to stay ahead of emerging research.",
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

  const stats = [
    { label: "Research Sources", value: "28k+" },
    { label: "Questions Answered", value: "1.2M" },
    { label: "Client Progress Velocity", value: "3.7×" },
    { label: "Recommended by Coaches", value: "92%" },
  ];

  const researchPipeline = useMemo(
    () => [
      {
        title: "Ingest every scientific source",
        description:
          "Automatic ingestion from PubMed, sports science journals, WHO, ACSM, ISSN, and 180+ verified sources - updated nightly.",
        icon: BookOpen,
      },
      {
        title: "Evidence classification engine",
        description:
          "We score every study on methodology, population, and outcome reliability. Meta-analyses are privileged; outdated studies are deprioritized.",
        icon: LineChart,
      },
      {
        title: "Personalized synthesis",
        description:
          "The AI trainer builds responses using only high-confidence evidence, contextualized to your metrics, training history, and goals.",
        icon: BrainCircuit,
      },
      {
        title: "Coach verification layer",
        description:
          "Human performance experts review new protocols weekly, ensuring advice stays applicable, safe, and cutting-edge.",
        icon: Dumbbell,
      },
    ],
    []
  );

  const movementCards = [
    {
      title: "Hyper-personalized programming",
      description:
        "Auto-generate 12-week mesocycles that adapt to your training age, movement screening, and rate of perceived exertion logs.",
      icon: Activity,
    },
    {
      title: "Metabolic precision",
      description:
        "Dynamic macro prescriptions factor in thermic effect, adaptive responses, hormone panels, and recovery capacity.",
      icon: Microwave,
    },
    {
      title: "Coach collaboration",
      description:
        "Share read-only links or co-pilot sessions with coaches. Augment existing coaching with instantaneous research citations.",
      icon: Github,
    },
  ];

  const benefits = [
    "Access to the world's most comprehensive fitness research database",
    "Personalized advice based on your goals and profile",
    "Real-time tracking of nutrition, workouts, and progress",
    "Evidence-based recommendations you can trust",
    "24/7 AI trainer available whenever you need guidance",
  ];

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const { currentTarget, clientX, clientY } = event;
    const rect = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - rect.left);
    mouseY.set(clientY - rect.top);
  };

  return (
    <div className="relative min-h-screen overflow-hidden" onMouseMove={handleMouseMove}>
      <motion.div
        className="pointer-events-none absolute inset-0"
        animate={{ opacity: [0.9, 1, 0.9] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="absolute inset-0 bg-[radial-gradient(45%_60%_at_15%_20%,rgba(34,211,238,0.25),transparent)]" />
        <div className="absolute inset-0 bg-[radial-gradient(40%_45%_at_85%_15%,rgba(244,114,182,0.22),transparent)]" />
        <div className="absolute inset-0 bg-[radial-gradient(55%_60%_at_50%_110%,rgba(52,211,153,0.18),transparent)]" />
      </motion.div>

      <motion.div
        className="pointer-events-none absolute -inset-[400px] bg-[conic-gradient(from_120deg_at_50%_50%,rgba(34,211,238,0.08),transparent,rgba(147,51,234,0.12),transparent)] blur-3xl"
        animate={{ rotate: [0, 30, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
      />

      <motion.div
        className="pointer-events-none absolute h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-500/10 blur-[120px]"
        style={{ left: springX, top: springY }}
      />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-24 pb-28 sm:pt-32 sm:pb-36">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"
        >
          <div className="flex flex-col items-center text-center">
            <motion.div
              className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-black/40 px-4 py-2 backdrop-blur"
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
            >
              <Sparkles className="h-4 w-4 text-cyan-300" />
              <span className="text-sm font-semibold text-cyan-300">
                The Most Researched Physical Health Platform
              </span>
            </motion.div>

            <motion.h1
              className="mt-8 text-5xl font-black tracking-tight text-white sm:text-6xl md:text-7xl"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.2 }}
            >
              <span className="block bg-gradient-to-r from-cyan-200 via-emerald-300 to-cyan-300 bg-clip-text text-transparent">
                AI Performance Lab
              </span>
              <span className="mt-3 block text-white/90">
                Built on every credible source in human performance.
              </span>
            </motion.h1>

            <motion.p
              className="mt-6 max-w-3xl text-xl text-neutral-300 sm:text-2xl"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.35 }}
            >
              FitTrack fuses a proprietary research ingestion engine with a low-latency coaching model.
              Every recommendation is cited, quantified, and adapted to your physiology in real time.
            </motion.p>

            <motion.div
              className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.5 }}
            >
              <button
                onClick={() => setShowDemoForm(true)}
                className="group inline-flex items-center gap-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-emerald-500 px-8 py-4 text-lg font-semibold text-white shadow-[0_10px_35px_rgba(34,211,238,0.28)] transition hover:shadow-[0_12px_45px_rgba(52,211,153,0.35)]"
              >
                Book a Demo
                <ArrowRight className="h-5 w-5 transition group-hover:translate-x-1" />
              </button>
              <a
                href="/login"
                className="inline-flex items-center gap-3 rounded-2xl border border-neutral-800/80 bg-neutral-900/60 px-8 py-4 text-lg font-semibold text-neutral-200 transition hover:border-neutral-700 hover:bg-neutral-900"
              >
                Sign In
              </a>
            </motion.div>

            <motion.div
              className="mt-16 grid w-full max-w-4xl grid-cols-2 gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur sm:grid-cols-4"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.6 }}
            >
              {stats.map((stat) => (
                <div key={stat.label} className="flex flex-col items-center text-center">
                  <span className="text-2xl font-bold text-white sm:text-3xl">{stat.value}</span>
                  <span className="mt-1 text-xs uppercase tracking-wide text-neutral-400">
                    {stat.label}
                  </span>
                </div>
              ))}
            </motion.div>
          </div>
        </motion.div>

        <motion.div
          className="pointer-events-none absolute inset-x-0 top-32 mx-auto h-[520px] max-w-6xl rounded-[52px] border border-white/5 bg-gradient-to-br from-white/10 via-white/5 to-transparent"
          initial={{ opacity: 0, scale: 0.98, y: 30 }}
          animate={{ opacity: 0.12, scale: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.2 }}
        />
      </section>

      {/* Features Section */}
      <section className="relative py-24">
        <div className="absolute inset-0 bg-[radial-gradient(35%_45%_at_50%_50%,rgba(34,211,238,0.08),transparent)]" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
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

          <motion.div
            className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={{
              hidden: {},
              visible: {
                transition: {
                  staggerChildren: 0.12,
                },
              },
            }}
          >
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={index}
                  variants={{
                    hidden: { opacity: 0, y: 24 },
                    visible: { opacity: 1, y: 0 },
                  }}
                  className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] p-6 backdrop-blur transition hover:border-cyan-400/40 hover:bg-white/[0.04]"
                >
                  <motion.span
                    className="absolute inset-0 bg-gradient-to-br from-cyan-400/0 via-emerald-400/10 to-cyan-400/0 opacity-0 transition group-hover:opacity-100"
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 1 }}
                  />
                  <div className="relative flex w-fit items-center justify-center rounded-xl border border-cyan-500/30 bg-cyan-500/10 p-3">
                    <Icon className="h-6 w-6 text-cyan-300" />
                  </div>
                  <h3 className="relative mt-5 text-xl font-semibold text-white">
                    {feature.title}
                  </h3>
                  <p className="relative mt-3 text-sm leading-6 text-neutral-300">
                    {feature.description}
                  </p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="relative py-24">
        <div className="absolute inset-0 bg-[radial-gradient(40%_55%_at_20%_50%,rgba(59,130,246,0.12),transparent)] opacity-60" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-2">
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
                className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-500 to-emerald-500 px-8 py-3 text-lg font-semibold text-white shadow-[0_10px_30px_rgba(34,211,238,0.25)] transition hover:shadow-[0_12px_40px_rgba(52,211,153,0.3)]"
              >
                Book Your Demo
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-6">
              <motion.div
                className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.08] via-white/[0.03] to-transparent p-8 backdrop-blur"
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-120px" }}
                transition={{ duration: 0.7 }}
              >
                <div className="flex items-center gap-3">
                  <div className="rounded-full border border-cyan-400/30 bg-cyan-400/20 p-3">
                    <Sparkles className="h-6 w-6 text-cyan-200" />
                  </div>
                  <div>
                    <p className="text-sm font-medium uppercase tracking-wide text-cyan-200/70">
                      Evidence-backed response
                    </p>
                    <p className="text-sm text-neutral-400">Generated in real time</p>
                  </div>
                </div>
                <p className="mt-6 text-sm leading-7 text-neutral-200">
                  "Based on a 2023 meta-analysis in the <em>Journal of Strength and Conditioning Research</em>, aim
                  for a 250-300 kcal surplus paired with 1.8-2.2 g/kg protein. We'll adjust weekly using your
                  velocity and body comp data to avoid fat spillover."
                </p>
                <div className="mt-6 flex items-center justify-between text-xs uppercase tracking-widest text-neutral-500">
                  <span>Trainer AI</span>
                  <span>Latency: 620ms</span>
                </div>
              </motion.div>

              <motion.div
                className="grid gap-4 rounded-3xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur"
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-120px" }}
                transition={{ duration: 0.7, delay: 0.1 }}
              >
                <div className="flex items-center justify-between text-sm text-neutral-400">
                  <span>Calories</span>
                  <span className="text-white">2,180 / 2,400</span>
                </div>
                <div className="flex items-center justify-between text-sm text-neutral-400">
                  <span>Protein</span>
                  <span className="text-white">170g / 185g</span>
                </div>
                <div className="flex items-center justify-between text-sm text-neutral-400">
                  <span>Recovery</span>
                  <span className="text-emerald-300">HRV +12%</span>
                </div>
                <div className="flex items-center justify-between text-sm text-neutral-400">
                  <span>Training Load</span>
                  <span className="text-white">RPE 7.5</span>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Research pipeline */}
      <section className="relative py-24">
        <div className="absolute inset-0 bg-[radial-gradient(38%_55%_at_80%_20%,rgba(244,114,182,0.12),transparent)] opacity-75" />
        <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 flex flex-col items-center text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.4em] text-cyan-200/70">
              Research Engine
            </p>
            <h3 className="mt-4 text-3xl font-bold text-white sm:text-4xl">
              A full-stack pipeline for medical-grade coaching
            </h3>
            <p className="mt-4 max-w-3xl text-base text-neutral-400 sm:text-lg">
              We don't just quote headlines. The platform continuously validates, ranks, and reasons through
              the global body of sports science to deliver precision recommendations for every human body.
            </p>
          </div>

          <div className="relative flex flex-col gap-6 sm:gap-8">
            <span className="pointer-events-none absolute left-[19px] top-4 hidden h-[calc(100%-32px)] w-[2px] bg-gradient-to-b from-cyan-400/60 via-emerald-400/40 to-transparent md:block" />
            {researchPipeline.map((stage, idx) => {
              const Icon = stage.icon;
              return (
                <motion.div
                  key={stage.title}
                  className="relative flex flex-col gap-4 rounded-3xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur md:flex-row md:items-center"
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-120px" }}
                  transition={{ duration: 0.6, delay: idx * 0.08 }}
                >
                  <div className="flex items-center gap-4 md:w-80">
                    <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl border border-cyan-500/30 bg-cyan-500/10">
                      <Icon className="h-7 w-7 text-cyan-200" />
                      <span className="absolute -left-10 hidden text-sm font-semibold text-cyan-200/70 md:block">
                        {String(idx + 1).padStart(2, "0")}
                      </span>
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-white">{stage.title}</h4>
                    </div>
                  </div>
                  <p className="text-sm leading-7 text-neutral-300">{stage.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Movement cards */}
      <section className="relative py-24">
        <div className="absolute inset-0 bg-[radial-gradient(45%_45%_at_50%_50%,rgba(12,148,136,0.18),transparent)] opacity-60" />
        <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-6 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-emerald-200/80">
              Elite Performance Stack
            </p>
            <h3 className="text-3xl font-bold text-white sm:text-4xl">
              Run your body like a high-performance lab
            </h3>
            <p className="mx-auto max-w-3xl text-base text-neutral-400 sm:text-lg">
              Purpose-built for athletes, coaches, and teams who demand verifiable, adaptive programming with
              zero guesswork. Every feature is battle-tested by practitioners in the field.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
            {movementCards.map((card) => {
              const Icon = card.icon;
              return (
                <motion.div
                  key={card.title}
                  whileHover={{ y: -8 }}
                  transition={{ duration: 0.25 }}
                  className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.02] p-6 backdrop-blur transition hover:border-emerald-400/40 hover:bg-white/[0.05]"
                >
                  <div className="relative flex items-center justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-emerald-400/40 bg-emerald-400/20">
                      <Icon className="h-6 w-6 text-emerald-200" />
                    </div>
                    <motion.span
                      initial={{ opacity: 0, x: 24 }}
                      whileHover={{ opacity: 1, x: 0 }}
                      className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[11px] uppercase tracking-[0.2em] text-white/60"
                    >
                      Elite
                    </motion.span>
                  </div>
                  <h4 className="mt-6 text-lg font-semibold text-white">{card.title}</h4>
                  <p className="mt-4 text-sm leading-6 text-neutral-300">{card.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative pb-24 pt-20">
        <div className="absolute inset-0 bg-[radial-gradient(35%_45%_at_50%_0%,rgba(34,211,238,0.18),transparent)] opacity-70" />
        <div className="relative mx-auto max-w-4xl px-4 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="overflow-hidden rounded-[36px] border border-white/10 bg-white/[0.04] p-10 backdrop-blur"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.4em] text-cyan-200/80">
              Elite Teams · High Performers · Innovators
            </p>
            <h2 className="mt-5 text-3xl font-bold text-white sm:text-4xl md:text-5xl">
              Build your health strategy on defensible science.
            </h2>
            <p className="mt-6 text-base text-neutral-300 sm:text-lg">
              FitTrack is an always-on performance lab that translates research into results you can measure.
              Book a private session to see how we can augment your coaching, team, or personal regimen.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <button
                onClick={() => setShowDemoForm(true)}
                className="group inline-flex items-center gap-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-emerald-500 px-8 py-4 text-lg font-semibold text-white shadow-[0_10px_35px_rgba(34,211,238,0.28)] transition hover:shadow-[0_12px_42px_rgba(52,211,153,0.36)]"
              >
                Book a Demo
                <ArrowRight className="h-5 w-5 transition group-hover:translate-x-1" />
              </button>
              <a
                href="#"
                className="inline-flex items-center gap-2 text-sm uppercase tracking-[0.35em] text-neutral-400 transition hover:text-white/80"
              >
                Explore the research summary
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {showDemoForm && <DemoForm onClose={() => setShowDemoForm(false)} />}
    </div>
  );
}

