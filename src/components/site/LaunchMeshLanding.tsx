import { motion, useScroll, useTransform, useMotionValue, useSpring } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "@tanstack/react-router";
import {
  ArrowRight, Play, Sparkles, Brain, Network, Handshake, Package, MessageSquare,
  BarChart3, ShieldCheck, Check, Zap, Rocket, Users, Bot, TrendingUp, Layers, Star,
} from "lucide-react";
import { NetworkGraph } from "@/components/site/NetworkGraph";

/* ————————————————————————————————————— NAV ————————————————————————————————————— */
function Nav() {
  return (
    <header className="fixed top-4 inset-x-0 z-50 flex justify-center px-4">
      <nav className="glass-strong flex items-center gap-2 md:gap-6 rounded-full pl-4 pr-2 py-2 shadow-elevated">
        <a href="#top" className="flex items-center gap-2 pr-2">
          <div className="relative h-6 w-6">
            <div className="absolute inset-0 rounded-md animated-gradient" />
            <div className="absolute inset-[3px] rounded-[5px] bg-background grid place-items-center">
              <div className="h-1.5 w-1.5 rounded-full bg-accent" />
            </div>
          </div>
          <span className="text-sm font-semibold tracking-tight">LaunchMesh</span>
        </a>
        <div className="hidden md:flex items-center gap-1 text-sm text-muted-foreground">
          {["Product", "How it works", "Pricing", "Changelog"].map((l) => (
            <a key={l} href={`#${l.toLowerCase().replace(/\s/g, "-")}`}
              className="px-3 py-1.5 rounded-full hover:text-foreground hover:bg-white/5 transition-colors">
              {l}
            </a>
          ))}
        </div>
        <a href="/explore" className="relative overflow-hidden rounded-full bg-white text-background text-sm font-medium px-4 py-1.5 hover:scale-[1.02] transition-transform">
          Start Free
        </a>
      </nav>
    </header>
  );
}

/* ————————————————————————————————————— MAGNETIC BTN ————————————————————————————————————— */
function MagneticButton({ children, variant = "primary", className = "", ...props }: any) {
  const ref = useRef<HTMLButtonElement>(null);
  const x = useMotionValue(0); const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 200, damping: 15 });
  const sy = useSpring(y, { stiffness: 200, damping: 15 });
  const onMove = (e: React.MouseEvent) => {
    const r = ref.current!.getBoundingClientRect();
    x.set((e.clientX - (r.left + r.width / 2)) * 0.25);
    y.set((e.clientY - (r.top + r.height / 2)) * 0.25);
  };
  const reset = () => { x.set(0); y.set(0); };
  const base = "relative inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-medium transition-shadow";
  const styles = variant === "primary"
    ? "bg-primary text-primary-foreground shadow-glow hover:shadow-[0_0_60px_-8px_var(--primary)]"
    : "glass-strong hover:bg-white/10 text-foreground";
  return (
    <motion.button ref={ref} onMouseMove={onMove} onMouseLeave={reset}
      style={{ x: sx, y: sy }} className={`${base} ${styles} ${className}`} {...props}>
      {children}
    </motion.button>
  );
}

/* ————————————————————————————————————— HERO ————————————————————————————————————— */
function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0]);

  return (
    <section ref={ref} id="top" className="relative min-h-[100svh] pt-28 overflow-hidden">
      {/* bg */}
      <div className="absolute inset-0 grid-bg radial-fade opacity-60" />
      <div className="absolute -top-40 -left-40 h-[500px] w-[500px] rounded-full bg-primary/20 blur-[120px]" />
      <div className="absolute -top-20 right-0 h-[400px] w-[400px] rounded-full bg-accent/15 blur-[120px]" />

      <motion.div style={{ y, opacity }} className="relative container mx-auto max-w-7xl px-6 grid lg:grid-cols-[1.05fr_1fr] gap-10 items-center pt-8">
        <div>
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 rounded-full glass px-3 py-1.5 text-xs text-muted-foreground">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inset-0 rounded-full bg-accent animate-pulse-glow" />
              <span className="relative rounded-full bg-accent h-1.5 w-1.5" />
            </span>
            Now in private beta · <span className="text-foreground">50+ founders onboard</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05, duration: 0.8 }}
            className="mt-6 text-[46px] leading-[1.02] md:text-[72px] lg:text-[86px] font-semibold tracking-[-0.04em]">
            <span className="gradient-text">Stop launching</span>
            <br />
            <span className="gradient-text">alone.</span>
            <br />
            <span className="gradient-brand">Grow together.</span>
          </motion.h1>

          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25, duration: 0.8 }}
            className="mt-6 max-w-xl text-[17px] leading-relaxed text-muted-foreground">
            LaunchMesh uses AI to connect founders with complementary — not competing — apps,
            automate cross-promotion agreements, and turn your launch into a network.
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
            className="mt-8 flex flex-wrap items-center gap-3">
            <MagneticButton variant="primary" onClick={() => router.navigate({ to: "/explore" })}>
              Start free <ArrowRight className="h-4 w-4" />
            </MagneticButton>
            <MagneticButton variant="ghost">
              <Play className="h-3.5 w-3.5" /> Watch demo
            </MagneticButton>
          </motion.div>

          <div className="mt-10 flex items-center gap-5 text-xs text-muted-foreground">
            <div className="flex -space-x-2">
              {[0, 1, 2, 3].map((i) => (
                <div key={i} className="h-7 w-7 rounded-full ring-2 ring-background"
                  style={{ background: `linear-gradient(135deg, hsl(${260 + i * 30} 80% 60%), hsl(${180 + i * 20} 70% 55%))` }} />
              ))}
            </div>
            Loved by indie founders shipping every week
          </div>
        </div>

        {/* right: 3D-ish network */}
        <div className="relative h-[440px] md:h-[560px] lg:h-[620px]">
          <div className="absolute inset-0 rounded-3xl glass-strong overflow-hidden shadow-elevated">
            <NetworkGraph className="h-full w-full" />
            {/* floating cards */}
            <FloatingCard className="absolute top-6 left-6" delay={0.2}>
              <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Match</div>
              <div className="mt-1 text-sm font-medium">Pomodoro · 96%</div>
              <div className="mt-2 h-1 w-24 rounded-full bg-white/10 overflow-hidden">
                <motion.div initial={{ width: 0 }} animate={{ width: "96%" }} transition={{ duration: 1.4, delay: 0.5 }}
                  className="h-full animated-gradient" />
              </div>
            </FloatingCard>
            <FloatingCard className="absolute bottom-6 right-6" delay={0.5}>
              <div className="flex items-center gap-2">
                <Sparkles className="h-3.5 w-3.5 text-accent" />
                <span className="text-xs text-muted-foreground">AI Pact ready</span>
              </div>
              <div className="mt-1 text-sm font-medium">Newsletter swap · 420 installs</div>
            </FloatingCard>
            <FloatingCard className="absolute top-6 right-6" delay={0.8}>
              <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Audience overlap</div>
              <div className="mt-1 text-2xl font-semibold gradient-brand">72%</div>
            </FloatingCard>
          </div>
        </div>
      </motion.div>
    </section>
  );
}

function FloatingCard({ children, className = "", delay = 0 }: any) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.7 }}
      className={`glass-strong rounded-2xl px-4 py-3 animate-float-slow shadow-elevated ${className}`}
      style={{ animationDelay: `${delay}s` }}
    >
      {children}
    </motion.div>
  );
}

/* ————————————————————————————————————— TRUST / LOGO CLOUD ————————————————————————————————————— */
function Trust() {
  const logos = ["Indie Hackers", "Product Hunt", "Y Combinator", "Solo Builders", "MakerLog", "TinyStartups", "Deta", "Buildspace"];
  return (
    <section className="relative py-16 border-y border-border/60 bg-surface/40">
      <p className="text-center text-xs uppercase tracking-[0.25em] text-muted-foreground">
        Trusted by founders launching from
      </p>
      <div className="mt-6 relative overflow-hidden [mask-image:linear-gradient(90deg,transparent,black_15%,black_85%,transparent)]">
        <div className="flex gap-14 animate-marquee whitespace-nowrap w-max">
          {[...logos, ...logos].map((l, i) => (
            <span key={i} className="text-2xl md:text-3xl font-medium text-muted-foreground/70 hover:text-foreground transition-colors">
              {l}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ————————————————————————————————————— SECTION HEADER ————————————————————————————————————— */
function SectionHeader({ eyebrow, title, sub }: { eyebrow: string; title: React.ReactNode; sub?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.7 }}
      className="max-w-3xl">
      <div className="inline-flex items-center gap-2 rounded-full glass px-3 py-1.5 text-xs text-muted-foreground">
        <Sparkles className="h-3 w-3 text-accent" /> {eyebrow}
      </div>
      <h2 className="mt-5 text-4xl md:text-6xl font-semibold tracking-[-0.03em] gradient-text">{title}</h2>
      {sub && <p className="mt-4 text-lg text-muted-foreground max-w-2xl">{sub}</p>}
    </motion.div>
  );
}

/* ————————————————————————————————————— HOW IT WORKS ————————————————————————————————————— */
function HowItWorks() {
  const steps = [
    { icon: Rocket, title: "Describe Your App", desc: "Drop your app store link or a short pitch. LaunchMesh ingests everything." },
    { icon: Brain, title: "AI Understands Your Audience", desc: "We build a semantic profile of your users, use cases, and moments." },
    { icon: Network, title: "Discover Complementary Apps", desc: "Get ranked matches with audience overlap, timing, and momentum signals." },
    { icon: Handshake, title: "Create a Growth Pact", desc: "AI drafts a fair cross-promotion agreement both founders can sign in a click." },
    { icon: TrendingUp, title: "Grow Together", desc: "Track installs, referrals, and revenue lift from every pact — live." },
  ];
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 70%", "end 30%"] });
  const line = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <section id="how-it-works" className="relative py-32 container mx-auto max-w-7xl px-6">
      <SectionHeader eyebrow="How it works" title={<>A launch is a system.<br />Not a prayer.</>}
        sub="Five steps from lonely launch to a compounding network of growth partners." />

      <div ref={ref} className="mt-20 relative">
        {/* timeline line */}
        <div className="absolute left-[27px] md:left-1/2 top-0 bottom-0 w-px bg-border" />
        <motion.div style={{ height: line }}
          className="absolute left-[27px] md:left-1/2 top-0 w-px bg-gradient-to-b from-primary via-accent to-transparent" />

        <div className="space-y-16">
          {steps.map((s, i) => (
            <motion.div key={s.title}
              initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.7, delay: 0.05 }}
              className={`relative grid md:grid-cols-2 gap-6 md:gap-16 items-center ${i % 2 ? "md:[&>*:first-child]:order-2" : ""}`}>
              <div className={`pl-16 md:pl-0 ${i % 2 ? "md:text-left md:pl-16" : "md:text-right md:pr-16"}`}>
                <div className="text-xs uppercase tracking-[0.25em] text-accent">Step 0{i + 1}</div>
                <h3 className="mt-2 text-3xl md:text-4xl font-semibold tracking-tight">{s.title}</h3>
                <p className="mt-3 text-muted-foreground max-w-md md:inline-block">{s.desc}</p>
              </div>
              {/* node + illustration */}
              <div className="relative">
                <div className="absolute left-[3px] md:left-auto md:right-auto md:-translate-x-1/2 top-6 md:top-1/2 md:-translate-y-1/2 md:left-1/2">
                  <div className="relative h-12 w-12 -translate-x-[3px]">
                    <div className="absolute inset-0 rounded-full bg-primary/20 animate-pulse-glow" />
                    <div className="absolute inset-1.5 rounded-full glass-strong grid place-items-center">
                      <s.icon className="h-4 w-4 text-accent" />
                    </div>
                  </div>
                </div>
                <div className="pl-16 md:pl-0">
                  <StepIllustration index={i} />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function StepIllustration({ index }: { index: number }) {
  return (
    <div className="glass-strong rounded-2xl p-6 h-56 shadow-elevated relative overflow-hidden">
      <div className="absolute inset-0 opacity-60 grid-bg radial-fade" />
      <div className="relative h-full">
        {index === 0 && (
          <div className="flex flex-col justify-between h-full">
            <div className="glass rounded-lg px-3 py-2 text-xs text-muted-foreground">apps.apple.com/study-planner</div>
            <div className="space-y-1.5">
              <div className="h-1.5 w-3/4 rounded bg-white/10 animate-shimmer" />
              <div className="h-1.5 w-1/2 rounded bg-white/10 animate-shimmer" />
              <div className="h-1.5 w-2/3 rounded bg-white/10 animate-shimmer" />
            </div>
          </div>
        )}
        {index === 1 && (
          <div className="grid grid-cols-3 gap-2 h-full">
            {["Students", "Focus", "Habit", "Notes", "Timer", "Goals"].map((t, i) => (
              <div key={t} className="glass rounded-lg grid place-items-center text-[11px]"
                style={{ animation: `float-slow ${4 + i * 0.3}s ease-in-out infinite` }}>{t}</div>
            ))}
          </div>
        )}
        {index === 2 && <MiniNetwork />}
        {index === 3 && (
          <div className="space-y-2">
            <div className="glass rounded-lg p-3 text-xs">✦ Newsletter swap — 12k reach</div>
            <div className="glass rounded-lg p-3 text-xs">✦ In-app banner — 30d</div>
            <div className="glass rounded-lg p-3 text-xs flex items-center justify-between">
              <span>Both parties signed</span>
              <Check className="h-3.5 w-3.5 text-accent" />
            </div>
          </div>
        )}
        {index === 4 && (
          <div className="grid grid-cols-3 gap-3 h-full items-end">
            {[40, 70, 55, 90, 62, 100].map((h, i) => (
              <div key={i} className="rounded-md animated-gradient" style={{ height: `${h}%` }} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function MiniNetwork() {
  const nodes = [
    { x: 50, y: 50, core: true },
    { x: 15, y: 25 }, { x: 85, y: 30 }, { x: 20, y: 80 }, { x: 80, y: 78 }, { x: 55, y: 15 },
  ];
  return (
    <svg viewBox="0 0 100 100" className="h-full w-full">
      {nodes.slice(1).map((n, i) => (
        <line key={i} x1={50} y1={50} x2={n.x} y2={n.y} stroke="url(#g)" strokeWidth="0.4" opacity="0.6" />
      ))}
      <defs>
        <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#6C5CE7" /><stop offset="1" stopColor="#00D4B8" />
        </linearGradient>
      </defs>
      {nodes.map((n, i) => (
        <circle key={i} cx={n.x} cy={n.y} r={n.core ? 3 : 1.6} fill={n.core ? "#fff" : "#00D4B8"} />
      ))}
    </svg>
  );
}

/* ————————————————————————————————————— FEATURES ————————————————————————————————————— */
function Features() {
  const items = [
    { icon: Brain, title: "Audience Intelligence", desc: "Semantic user profiles that go beyond keywords." },
    { icon: Sparkles, title: "AI Matching", desc: "Ranked, non-competing partners with confidence scores." },
    { icon: Handshake, title: "Growth Pacts", desc: "Fair, structured cross-promo agreements in one click." },
    { icon: Package, title: "Bundle Builder", desc: "Assemble themed multi-app launches automatically." },
    { icon: MessageSquare, title: "AI Negotiation", desc: "An agent that drafts, proposes, and iterates for you." },
    { icon: BarChart3, title: "Live Analytics", desc: "Attribution across every partner, banner and referral." },
    { icon: ShieldCheck, title: "Trust Score", desc: "Reputation graph so you only pact with real founders." },
    { icon: Layers, title: "Multi-app Orchestration", desc: "Run 5 pacts in parallel without dropping a beat." },
  ];
  return (
    <section id="product" className="relative py-32 container mx-auto max-w-7xl px-6">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
        <SectionHeader eyebrow="Feature set" title={<>Everything a launch<br />needs. Nothing it doesn't.</>} />
        <p className="text-sm text-muted-foreground max-w-xs">Eight primitives, one system. Every surface designed for founders shipping alone.</p>
      </div>
      <div className="mt-16 grid md:grid-cols-2 lg:grid-cols-4 gap-5">
        {items.map((it, i) => <TiltCard key={it.title} {...it} i={i} />)}
      </div>
    </section>
  );
}

function TiltCard({ icon: Icon, title, desc, i }: any) {
  const ref = useRef<HTMLDivElement>(null);
  const rx = useMotionValue(0); const ry = useMotionValue(0);
  const srx = useSpring(rx, { stiffness: 180, damping: 15 });
  const sry = useSpring(ry, { stiffness: 180, damping: 15 });
  const onMove = (e: React.MouseEvent) => {
    const r = ref.current!.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    ry.set(px * 10); rx.set(-py * 10);
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
      transition={{ duration: 0.6, delay: i * 0.05 }}
      ref={ref} onMouseMove={onMove} onMouseLeave={() => { rx.set(0); ry.set(0); }}
      style={{ rotateX: srx, rotateY: sry, transformPerspective: 800 }}
      className="group relative rounded-2xl p-6 glass-strong hover:-translate-y-0.5 transition-transform overflow-hidden">
      <div className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"
        style={{ background: "linear-gradient(135deg, rgba(108,92,231,0.35), rgba(0,212,184,0.25))", mask: "linear-gradient(#000,#000) content-box, linear-gradient(#000,#000)", WebkitMaskComposite: "xor", maskComposite: "exclude", padding: 1 } as any} />
      <div className="relative">
        <div className="h-10 w-10 rounded-xl glass grid place-items-center">
          <Icon className="h-4 w-4 text-accent" />
        </div>
        <h3 className="mt-5 text-lg font-medium tracking-tight">{title}</h3>
        <p className="mt-2 text-sm text-muted-foreground">{desc}</p>
      </div>
    </motion.div>
  );
}

/* ————————————————————————————————————— INTERACTIVE NETWORK SECTION ————————————————————————————————————— */
function InteractiveNetwork() {
  const partners = [
    { name: "Study Planner", overlap: 84, installs: 620, window: "This week" },
    { name: "Budget Tracker", overlap: 71, installs: 410, window: "Next week" },
    { name: "Pomodoro", overlap: 96, installs: 720, window: "This week" },
    { name: "Flashcards", overlap: 78, installs: 380, window: "In 10 days" },
    { name: "Resume Builder", overlap: 65, installs: 260, window: "Next month" },
  ];
  const [active, setActive] = useState(2);
  return (
    <section className="relative py-32 container mx-auto max-w-7xl px-6">
      <SectionHeader eyebrow="Live network" title={<>Your app,<br />surrounded by allies.</>}
        sub="Every node is a real, non-competing app. Every line is a possible pact." />
      <div className="mt-16 grid lg:grid-cols-[1.2fr_1fr] gap-8">
        <div className="relative h-[520px] rounded-3xl glass-strong overflow-hidden shadow-elevated">
          <NetworkGraph dense className="h-full w-full" />
        </div>
        <div className="space-y-3">
          {partners.map((p, i) => (
            <button key={p.name} onMouseEnter={() => setActive(i)} onFocus={() => setActive(i)}
              className={`w-full text-left rounded-2xl p-5 transition-all border ${active === i ? "glass-strong border-primary/40 shadow-glow" : "glass border-transparent hover:border-white/10"}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-lg animated-gradient" />
                  <div>
                    <div className="text-sm font-medium">{p.name}</div>
                    <div className="text-xs text-muted-foreground">{p.window}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-muted-foreground">Compatibility</div>
                  <div className="text-xl font-semibold gradient-brand">{p.overlap}%</div>
                </div>
              </div>
              {active === i && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}
                  className="mt-4 grid grid-cols-3 gap-3 text-xs">
                  <Stat label="Audience overlap" value={`${p.overlap - 12}%`} />
                  <Stat label="Est. installs" value={`+${p.installs}`} />
                  <Stat label="Launch window" value={p.window} />
                </motion.div>
              )}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="glass rounded-xl p-3">
      <div className="text-[10px] uppercase tracking-widest text-muted-foreground">{label}</div>
      <div className="mt-1 text-sm font-medium">{value}</div>
    </div>
  );
}

/* ————————————————————————————————————— AI MATCH DEMO + NEGOTIATION ————————————————————————————————————— */
function MatchAndNegotiation() {
  return (
    <section className="relative py-32 container mx-auto max-w-7xl px-6">
      <SectionHeader eyebrow="AI in the loop" title={<>From cold app<br />to signed pact in minutes.</>} />
      <div className="mt-16 grid lg:grid-cols-2 gap-6">
        {/* Match flow */}
        <div className="rounded-3xl glass-strong p-6 shadow-elevated">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Bot className="h-3.5 w-3.5 text-accent" /> AI Match Engine
          </div>
          <div className="mt-5 space-y-3">
            <Row label="Input" value="Study Planner" />
            <Arrow />
            <Row label="AI Analysis" value="Audience: students · Moments: 9pm study" glow />
            <Arrow />
            <div className="rounded-2xl p-5 relative overflow-hidden"
              style={{ background: "linear-gradient(135deg, rgba(108,92,231,0.18), rgba(0,212,184,0.14))" }}>
              <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Match found</div>
              <div className="mt-1 flex items-baseline justify-between">
                <div className="text-2xl font-semibold">Pomodoro</div>
                <div className="text-3xl font-semibold gradient-brand">96%</div>
              </div>
              <div className="mt-4 grid grid-cols-3 gap-3">
                <Stat label="Audience overlap" value="84%" />
                <Stat label="Est. installs" value="+420" />
                <Stat label="Trust score" value="A+" />
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {["Newsletter swap", "Referral banner", "Joint launch"].map((t) => (
                  <span key={t} className="text-xs glass px-2.5 py-1 rounded-full">{t}</span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Negotiation */}
        <div className="rounded-3xl glass-strong p-6 shadow-elevated flex flex-col">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <MessageSquare className="h-3.5 w-3.5 text-accent" /> AI Negotiation
          </div>
          <div className="mt-5 space-y-3 flex-1">
            <Bubble side="ai">
              I found a fair pact: newsletter exchange (12k reach), one push notification each,
              and a joint bundle for launch week. Expected ROI: <b className="text-foreground">+18%</b> weekly installs.
            </Bubble>
            <Bubble side="user">Can we skip the push and add an in-app banner instead?</Bubble>
            <Bubble side="ai">
              Updated. Both founders will see the revised terms. Ready to send?
            </Bubble>
          </div>
          <div className="mt-5 flex flex-wrap gap-2">
            <button className="text-xs rounded-full px-3 py-1.5 bg-accent text-accent-foreground font-medium">Approve</button>
            <button className="text-xs rounded-full px-3 py-1.5 glass">Modify</button>
            <button className="text-xs rounded-full px-3 py-1.5 glass text-muted-foreground">Reject</button>
          </div>
        </div>
      </div>
    </section>
  );
}
function Row({ label, value, glow }: any) {
  return (
    <div className={`rounded-xl px-4 py-3 flex items-center justify-between ${glow ? "glass-strong glow-primary" : "glass"}`}>
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className="text-sm font-medium">{value}</span>
    </div>
  );
}
function Arrow() {
  return <div className="flex justify-center text-muted-foreground/60"><ArrowRight className="h-3.5 w-3.5 rotate-90" /></div>;
}
function Bubble({ side, children }: any) {
  const isAi = side === "ai";
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
      className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm ${isAi ? "glass" : "ml-auto bg-primary/20 border border-primary/30"}`}>
      {children}
    </motion.div>
  );
}

/* ————————————————————————————————————— BUNDLE BUILDER ————————————————————————————————————— */
function Bundle() {
  return (
    <section className="relative py-32 container mx-auto max-w-7xl px-6">
      <SectionHeader eyebrow="Bundle builder" title={<>Themed launches,<br />assembled by AI.</>} />
      <div className="mt-14 space-y-5">
        {[
          { name: "Back To School", tag: "Sept 2026", apps: ["Study Planner", "Flashcards", "Pomodoro", "Budget Tracker"], reach: "24,000" },
          { name: "New Year, New You", tag: "Jan 2027", apps: ["Habit", "Focus", "Zen", "Mint"], reach: "48,000" },
        ].map((b, i) => (
          <motion.div key={b.name}
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="rounded-3xl glass-strong p-6 md:p-8 shadow-elevated relative overflow-hidden">
            <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-primary/20 blur-3xl" />
            <div className="relative flex flex-col md:flex-row md:items-center gap-6 md:justify-between">
              <div>
                <div className="text-xs text-accent uppercase tracking-widest">{b.tag}</div>
                <h3 className="mt-1 text-3xl md:text-4xl font-semibold tracking-tight">{b.name} Bundle</h3>
                <div className="mt-4 flex flex-wrap gap-2">
                  {b.apps.map((a) => (
                    <span key={a} className="text-xs glass px-3 py-1.5 rounded-full">{a}</span>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div>
                  <div className="text-xs text-muted-foreground">Expected reach</div>
                  <div className="text-3xl font-semibold gradient-brand">{b.reach}</div>
                </div>
                <MagneticButton variant="primary">Generate <Sparkles className="h-3.5 w-3.5" /></MagneticButton>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

/* ————————————————————————————————————— TESTIMONIALS ————————————————————————————————————— */
function Testimonials() {
  const t = [
    { q: "We doubled TestFlight installs in one week from a single pact.", who: "Ana R.", role: "Founder, Zenlist" },
    { q: "It's the first launch tool that actually makes me feel less alone.", who: "Marcus T.", role: "Solo dev, Habitly" },
    { q: "AI drafted a fair agreement in 20 seconds. Would've taken me a week.", who: "Priya S.", role: "Founder, Flowdesk" },
    { q: "LaunchMesh feels like Linear for indie founder collabs.", who: "Jules M.", role: "Building Clarity" },
    { q: "The compatibility scores are eerily accurate.", who: "Kenji A.", role: "Founder, Pomobar" },
  ];
  return (
    <section className="relative py-32">
      <div className="container mx-auto max-w-7xl px-6">
        <SectionHeader eyebrow="From the network" title={<>Loved by founders<br />who ship every week.</>} />
      </div>
      <div className="mt-16 relative overflow-hidden [mask-image:linear-gradient(90deg,transparent,black_10%,black_90%,transparent)]">
        <div className="flex gap-5 animate-marquee w-max">
          {[...t, ...t].map((x, i) => (
            <div key={i} className="w-[360px] shrink-0 glass-strong rounded-2xl p-6 shadow-elevated">
              <div className="flex gap-0.5 text-accent">
                {Array.from({ length: 5 }).map((_, k) => <Star key={k} className="h-3.5 w-3.5 fill-current" />)}
              </div>
              <p className="mt-4 text-[15px] leading-relaxed">"{x.q}"</p>
              <div className="mt-5 flex items-center gap-3">
                <div className="h-8 w-8 rounded-full animated-gradient" />
                <div>
                  <div className="text-sm font-medium">{x.who}</div>
                  <div className="text-xs text-muted-foreground">{x.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ————————————————————————————————————— PRICING ————————————————————————————————————— */
function Pricing() {
  const plans = [
    { name: "Solo", price: "$0", desc: "For founders exploring their first partners.", feats: ["3 AI matches / mo", "1 active pact", "Basic analytics"], cta: "Start free" },
    { name: "Founder", price: "$29", desc: "For makers actively launching new apps.", feats: ["Unlimited matches", "10 active pacts", "AI negotiation", "Bundle builder", "Trust score"], cta: "Try Founder", featured: true },
    { name: "Studio", price: "$99", desc: "For studios running a portfolio of apps.", feats: ["Everything in Founder", "Portfolio graph", "API access", "Priority support"], cta: "Contact sales" },
  ];
  return (
    <section id="pricing" className="relative py-32 container mx-auto max-w-7xl px-6">
      <SectionHeader eyebrow="Pricing" title={<>Simple plans.<br />Compounding upside.</>} />
      <div className="mt-16 grid md:grid-cols-3 gap-5">
        {plans.map((p, i) => (
          <motion.div key={p.name}
            initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            transition={{ delay: i * 0.08 }}
            className={`relative rounded-3xl p-7 ${p.featured ? "glass-strong shadow-glow border border-primary/40" : "glass"}`}>
            {p.featured && (
              <>
                <div className="absolute -inset-px rounded-3xl pointer-events-none animate-pulse-glow"
                  style={{ background: "linear-gradient(135deg, rgba(108,92,231,0.35), rgba(0,212,184,0.25))", mask: "linear-gradient(#000,#000) content-box, linear-gradient(#000,#000)", WebkitMaskComposite: "xor", padding: 1 } as any} />
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 text-[10px] uppercase tracking-widest px-2.5 py-1 rounded-full bg-accent text-accent-foreground font-semibold">
                  Most popular
                </div>
              </>
            )}
            <div className="relative">
              <div className="text-sm text-muted-foreground">{p.name}</div>
              <div className="mt-3 flex items-baseline gap-1">
                <span className="text-5xl font-semibold tracking-tight">{p.price}</span>
                <span className="text-sm text-muted-foreground">/mo</span>
              </div>
              <p className="mt-3 text-sm text-muted-foreground">{p.desc}</p>
              <ul className="mt-6 space-y-2.5 text-sm">
                {p.feats.map((f) => (
                  <li key={f} className="flex items-center gap-2.5">
                    <span className="h-4 w-4 rounded-full grid place-items-center bg-accent/15">
                      <Check className="h-2.5 w-2.5 text-accent" />
                    </span>
                    {f}
                  </li>
                ))}
              </ul>
              <button className={`mt-7 w-full rounded-full py-2.5 text-sm font-medium transition ${p.featured ? "bg-primary text-primary-foreground hover:brightness-110" : "glass hover:bg-white/10"}`}>
                {p.cta}
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

/* ————————————————————————————————————— FINAL CTA ————————————————————————————————————— */
function FinalCTA() {
  const router = useRouter();
  return (
    <section id="cta" className="relative py-32 container mx-auto max-w-7xl px-6">
      <div className="relative rounded-[36px] overflow-hidden glass-strong shadow-elevated">
        <div className="absolute inset-0 grid-bg opacity-40 radial-fade z-0" />
        {/* orb */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[520px] w-[520px] rounded-full z-0"
          style={{
            background: "radial-gradient(circle at 40% 40%, rgba(108,92,231,0.6), rgba(0,212,184,0.35) 40%, transparent 70%)",
            filter: "blur(20px)",
          }} />
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-64 w-64 rounded-full animate-float-slow z-0"
          style={{
            background: "radial-gradient(circle at 40% 40%, #ffffff, #6C5CE7 40%, #00D4B8 80%)",
            boxShadow: "0 0 120px 20px rgba(108,92,231,0.5), inset 0 0 80px rgba(255,255,255,0.2)",
          }} />
        <div className="relative z-10 py-28 md:py-40 px-6 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="text-5xl md:text-7xl font-bold tracking-[-0.03em] text-white"
            style={{ textShadow: "0 2px 24px rgba(0,0,0,0.8), 0 0px 2px rgba(0,0,0,1)" }}>
            Ready to launch smarter?
          </motion.h2>
          <p className="mt-5 max-w-xl mx-auto text-lg font-medium text-white"
            style={{ textShadow: "0 1px 12px rgba(0,0,0,0.9)" }}>
            Join the founders turning solo launches into a network of compounding growth.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <MagneticButton variant="primary" onClick={() => router.navigate({ to: "/explore" })}>Find my first growth partner <ArrowRight className="h-4 w-4" /></MagneticButton>
            <MagneticButton variant="ghost">Book a demo</MagneticButton>
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-border/60 py-14">
      <div className="container mx-auto max-w-7xl px-6 flex flex-col md:flex-row gap-8 justify-between text-sm">
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 rounded-md animated-gradient" />
          <span className="font-semibold">LaunchMesh</span>
          <span className="text-muted-foreground ml-2">© 2026</span>
        </div>
        <div className="flex flex-wrap gap-6 text-muted-foreground">
          {["Product", "Pricing", "Changelog", "Docs", "Twitter", "Privacy"].map((l) => (
            <a key={l} href="#" className="hover:text-foreground transition-colors">{l}</a>
          ))}
        </div>
      </div>
    </footer>
  );
}

/* ————————————————————————————————————— PAGE ————————————————————————————————————— */
export default function LaunchMeshLanding() {
  // cursor spotlight
  const spot = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = spot.current!;
    const on = (e: MouseEvent) => {
      el.style.background = `radial-gradient(600px circle at ${e.clientX}px ${e.clientY}px, rgba(108,92,231,0.09), transparent 60%)`;
    };
    window.addEventListener("mousemove", on);
    return () => window.removeEventListener("mousemove", on);
  }, []);
  return (
    <div className="relative min-h-screen bg-background text-foreground overflow-x-clip">
      <div ref={spot} className="pointer-events-none fixed inset-0 z-40" />
      <Nav />
      <Hero />
      <Trust />
      <HowItWorks />
      <Features />
      <InteractiveNetwork />
      <MatchAndNegotiation />
      <Bundle />
      <Testimonials />
      <Pricing />
      <FinalCTA />
      <Footer />
    </div>
  );
}
