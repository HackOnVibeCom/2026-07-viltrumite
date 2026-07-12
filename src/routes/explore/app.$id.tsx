import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect, useRef } from "react";
import { motion, useInView, useMotionValue, useSpring } from "framer-motion";
import {
  Bell, Heart, Share2, ExternalLink, Users, ArrowLeft,
  CheckCircle2, MessageSquare, ThumbsUp, Star, ChevronRight,
  Sparkles, TrendingUp, Zap, Rocket, Brain, ArrowRight,
} from "lucide-react";
import { APPS } from "@/data/mock";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/explore/app/$id")({
  component: AppDetailPage,
});

/* ─── Animated counter ─── */
function AnimatedNumber({ value }: { value: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const mv = useMotionValue(0);
  const spring = useSpring(mv, { stiffness: 80, damping: 20 });
  useEffect(() => { if (inView) mv.set(value); }, [inView, value, mv]);
  useEffect(() => spring.on("change", v => { if (ref.current) ref.current.textContent = Math.round(v).toString(); }), [spring]);
  return <span ref={ref}>0</span>;
}

/* ─── Animated progress bar ─── */
function ProgressBar({ label, pct, delay }: { label: string; pct: number; delay: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  return (
    <div ref={ref} className="space-y-1.5">
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-semibold text-foreground">{pct}%</span>
      </div>
      <div className="h-2 w-full rounded-full bg-white/5 overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={inView ? { width: `${pct}%` } : {}}
          transition={{ duration: 1, delay, ease: "easeOut" }}
          className="h-full rounded-full"
          style={{ background: `linear-gradient(90deg, #6C5CE7, #00D4B8)` }}
        />
      </div>
    </div>
  );
}

/* ─── AI Growth Opportunities section ─── */
function AIGrowthOpportunities({ app }: { app: typeof APPS[0] }) {
  const partners = [
    {
      icon: "📚", name: "StudyFlow", match: 96, overlap: "84%", installs: "+720",
      reason: "Identical student audience — peak usage overlaps at 9–11pm study sessions.",
      gradient: "from-amber-500 to-orange-500",
    },
    {
      icon: "⏱️", name: "FocusPro", match: 88, overlap: "76%", installs: "+540",
      reason: "Complementary workflow — users switch between both apps in the same session.",
      gradient: "from-cyan-500 to-teal-500",
    },
    {
      icon: "🧠", name: "MindMap AI", match: 81, overlap: "69%", installs: "+410",
      reason: "Shared interest in visual thinking — natural bundle opportunity.",
      gradient: "from-violet-500 to-purple-600",
    },
  ];

  const timeline = [
    { icon: "🚀", label: "Product Hunt Launch", desc: "Day 1 — go live on PH with cross-promo", done: true },
    { icon: "🤝", label: "Cross-promo with StudyFlow", desc: "Week 1 — newsletter swap (12k reach)", done: true },
    { icon: "📧", label: "Newsletter Campaign", desc: "Week 2 — co-authored founder email", done: false },
    { icon: "📦", label: "Bundle Launch", desc: "Week 3 — Back to School bundle", done: false },
    { icon: "📈", label: "Projected Growth", desc: "+2,400 users by end of month", done: false, highlight: true },
  ];

  const audiences = [
    { label: "Students", pct: 92 },
    { label: "Developers", pct: 84 },
    { label: "Founders", pct: 71 },
    { label: "Designers", pct: 68 },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6 }}
      className="space-y-6 pt-2"
    >
      {/* Section header */}
      <div className="flex items-center gap-3">
        <div className="h-px flex-1 bg-border/40" />
        <div className="flex items-center gap-2 glass-strong rounded-full px-4 py-2 border border-primary/30"
          style={{ boxShadow: "0 0 24px -8px rgba(108,92,231,0.5)" }}>
          <Sparkles className="h-4 w-4 text-accent" />
          <span className="text-sm font-semibold gradient-brand">✨ AI Growth Opportunities</span>
        </div>
        <div className="h-px flex-1 bg-border/40" />
      </div>

      {/* 1 — Recommended Growth Partners */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Brain className="h-4 w-4 text-primary" />
          <h3 className="text-base font-semibold">Recommended Growth Partners</h3>
          <span className="text-xs glass px-2 py-0.5 rounded-full text-muted-foreground ml-1">AI matched</span>
        </div>
        <div className="space-y-3">
          {partners.map((p, i) => (
            <motion.div key={p.name}
              initial={{ opacity: 0, x: -16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ scale: 1.01 }}
              className="relative overflow-hidden glass-strong rounded-2xl p-5 border border-border/60 hover:border-primary/40 transition-colors">
              {/* subtle bg glow */}
              <div className={`absolute inset-0 bg-gradient-to-r ${p.gradient} opacity-5`} />
              <div className="relative flex items-center gap-4">
                {/* icon */}
                <div className={`h-12 w-12 rounded-2xl bg-gradient-to-br ${p.gradient} grid place-items-center text-2xl shrink-0`}>
                  {p.icon}
                </div>
                {/* info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="font-semibold text-sm">{p.name}</span>
                    <span className="text-xs font-bold text-accent glass px-2 py-0.5 rounded-full border border-accent/30">
                      {p.match}% match
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">{p.reason}</p>
                  <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><Users className="h-3 w-3" />Overlap {p.overlap}</span>
                    <span className="flex items-center gap-1"><TrendingUp className="h-3 w-3 text-accent" />{p.installs} est. installs</span>
                  </div>
                </div>
                {/* CTA */}
                <motion.button
                  whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                  className="shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold border border-primary/40 bg-primary/15 text-primary hover:bg-primary/25 transition-colors">
                  View Partnership <ArrowRight className="h-3 w-3" />
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* 2 — AI Growth Plan */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Rocket className="h-4 w-4 text-primary" />
          <h3 className="text-base font-semibold">AI Growth Plan</h3>
        </div>
        <div className="relative glass-strong rounded-2xl p-5 border border-border/60 overflow-hidden">
          <div className="absolute inset-0 opacity-5 grid-bg" />
          <div className="relative space-y-0">
            {timeline.map((step, i) => (
              <motion.div key={step.label}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.09 }}
                className="flex gap-4 relative">
                {/* vertical line */}
                {i < timeline.length - 1 && (
                  <div className="absolute left-[19px] top-10 w-px h-full"
                    style={{ background: "linear-gradient(to bottom, rgba(108,92,231,0.4), rgba(0,212,184,0.1))" }} />
                )}
                {/* dot */}
                <div className={cn(
                  "h-10 w-10 rounded-full grid place-items-center text-base shrink-0 z-10 mt-1",
                  step.done ? "bg-accent/20 border border-accent/40" :
                  step.highlight ? "bg-primary/20 border border-primary/40 animate-pulse-glow" :
                  "bg-white/5 border border-border/40"
                )}>
                  {step.icon}
                </div>
                {/* content */}
                <div className={cn("pb-5 flex-1", i === timeline.length - 1 && "pb-0")}>
                  <div className="flex items-center gap-2">
                    <p className={cn("text-sm font-semibold",
                      step.highlight ? "gradient-brand" : step.done ? "text-foreground" : "text-muted-foreground")}>
                      {step.label}
                    </p>
                    {step.done && <CheckCircle2 className="h-3.5 w-3.5 text-accent" />}
                    {step.highlight && <span className="text-xs glass px-2 py-0.5 rounded-full text-accent border border-accent/30">Projected</span>}
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* 3 — Audience Compatibility */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Users className="h-4 w-4 text-primary" />
          <h3 className="text-base font-semibold">Audience Compatibility</h3>
        </div>
        <div className="glass-strong rounded-2xl p-5 border border-border/60 space-y-4">
          {audiences.map((a, i) => (
            <ProgressBar key={a.label} label={a.label} pct={a.pct} delay={i * 0.12} />
          ))}
          <p className="text-xs text-muted-foreground pt-1">
            Based on AI analysis of {app.followers.toLocaleString()} followers and behavioral patterns.
          </p>
        </div>
      </div>

      {/* 4 — Create Growth Pact CTA */}
      <motion.div
        whileHover={{ scale: 1.01 }}
        className="relative overflow-hidden rounded-3xl p-6 border border-primary/40 cursor-pointer"
        style={{
          background: "linear-gradient(135deg, rgba(108,92,231,0.18) 0%, rgba(0,212,184,0.10) 100%)",
          boxShadow: "0 0 60px -15px rgba(108,92,231,0.5)",
        }}>
        {/* orbs */}
        <div className="absolute -top-10 -right-10 h-40 w-40 rounded-full opacity-30 blur-3xl"
          style={{ background: "radial-gradient(circle, #6C5CE7, transparent 70%)" }} />
        <div className="absolute -bottom-10 -left-10 h-32 w-32 rounded-full opacity-20 blur-3xl"
          style={{ background: "radial-gradient(circle, #00D4B8, transparent 70%)" }} />
        <div className="absolute inset-0 opacity-10 grid-bg" />

        <div className="relative flex flex-col sm:flex-row items-center gap-5">
          <div className="flex-1 text-center sm:text-left">
            <div className="flex items-center gap-2 justify-center sm:justify-start mb-2">
              <Zap className="h-5 w-5 text-accent" />
              <span className="text-xs uppercase tracking-widest text-accent font-semibold">AI-Powered</span>
            </div>
            <h3 className="text-xl font-bold text-white mb-1">Ready to grow together?</h3>
            <p className="text-sm text-muted-foreground max-w-sm">
              LaunchMesh AI will draft a fair cross-promotion agreement with your best-matched partner in seconds.
            </p>
            <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground justify-center sm:justify-start">
              <span className="flex items-center gap-1"><CheckCircle2 className="h-3.5 w-3.5 text-accent" />AI-drafted agreement</span>
              <span className="flex items-center gap-1"><CheckCircle2 className="h-3.5 w-3.5 text-accent" />Sign in one click</span>
              <span className="flex items-center gap-1"><CheckCircle2 className="h-3.5 w-3.5 text-accent" />Live analytics</span>
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.96 }}
            className="shrink-0 flex items-center gap-2.5 px-7 py-3.5 rounded-2xl text-sm font-bold text-white transition-all"
            style={{
              background: "linear-gradient(135deg, #6C5CE7, #00D4B8)",
              boxShadow: "0 0 40px -8px rgba(108,92,231,0.7)",
            }}>
            🚀 Create Growth Pact
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}

function AppDetailPage() {
  const { id } = Route.useParams();
  const app = APPS.find(a => a.id === id) ?? APPS[0];
  const [notified, setNotified] = useState(false);
  const [followed, setFollowed] = useState(false);
  const [liked, setLiked] = useState(false);
  const [activeTab, setActiveTab] = useState("about");

  const TABS = ["about", "roadmap", "discussion"];

  const ROADMAP = [
    { label: "AI Notes", done: true },
    { label: "Flashcards Integration", done: true },
    { label: "Desktop App", done: false },
    { label: "Community Features", done: false },
    { label: "API Access", done: false },
  ];

  const COMMENTS = [
    { user: "Amit S.", avatar: "AS", text: "This is exactly what I've been waiting for. The AI linking is incredible.", votes: 34, time: "2h ago" },
    { user: "Zara K.", avatar: "ZK", text: "Tried the beta — the onboarding is super smooth. When's iOS launch?", votes: 18, time: "5h ago" },
    { user: "Raj M.", avatar: "RM", text: "Love the concept. Would be great if it integrated with Notion too.", votes: 12, time: "1d ago" },
  ];

  return (
    <div className="max-w-5xl mx-auto">
      {/* Hero */}
      <div className="relative overflow-hidden">
        {/* Background gradient */}
        <div className={`absolute inset-0 bg-gradient-to-br ${app.gradient} opacity-15`} />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, transparent 40%, var(--background) 100%)" }} />
        <div className="absolute top-0 right-0 h-80 w-80 rounded-full opacity-20 blur-3xl animate-float-slow"
          style={{ background: `radial-gradient(circle, ${app.accent}, transparent 70%)` }} />

        <div className="relative px-6 md:px-10 pt-8 pb-10">
          {/* Back */}
          <Link to="/explore">
            <motion.button whileHover={{ x: -3 }}
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8">
              <ArrowLeft className="h-4 w-4" /> Back to Discover
            </motion.button>
          </Link>

          <div className="flex flex-col md:flex-row gap-6 md:items-end">
            {/* App icon */}
            <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              className={`h-24 w-24 rounded-3xl bg-gradient-to-br ${app.gradient} grid place-items-center text-5xl shadow-elevated shrink-0`}>
              {app.icon}
            </motion.div>

            <div className="flex-1">
              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className="text-xs glass px-2.5 py-1 rounded-full text-muted-foreground">{app.category}</span>
                  <span className={cn("text-xs font-semibold px-2.5 py-1 rounded-full border",
                    app.status === "live" ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" : "bg-primary/20 text-primary border-primary/30")}>
                    {app.status}
                  </span>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-foreground">{app.name}</h1>
                <p className="text-lg text-muted-foreground mt-1">{app.tagline}</p>

                <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1.5"><Users className="h-4 w-4" />{app.followers.toLocaleString()} followers</span>
                  <span>·</span>
                  <span>{app.platforms.join(", ")}</span>
                  <span>·</span>
                  <span>{app.pricing}</span>
                </div>
              </motion.div>
            </div>

            {/* Action buttons */}
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
              className="flex flex-wrap gap-2 shrink-0">
              <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                onClick={() => setNotified(!notified)}
                className={cn("flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all",
                  notified ? "bg-accent text-background" : "bg-primary text-white shadow-glow")}>
                <Bell className="h-4 w-4" />
                {notified ? "Notified ✓" : "Notify Me"}
              </motion.button>
              <motion.button whileHover={{ scale: 1.04 }} onClick={() => setFollowed(!followed)}
                className={cn("flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold border transition-all",
                  followed ? "bg-muted border-border/80 text-foreground" : "glass border-border/60 text-muted-foreground hover:text-foreground")}>
                {followed ? "Following ✓" : "Follow"}
              </motion.button>
              <motion.button whileHover={{ scale: 1.04 }} onClick={() => setLiked(!liked)}
                className={cn("h-10 w-10 rounded-full border grid place-items-center transition-all",
                  liked ? "bg-rose-500/20 text-rose-400 border-rose-500/30" : "glass border-border/60 text-muted-foreground hover:text-foreground")}>
                <Heart className={cn("h-4 w-4", liked && "fill-current")} />
              </motion.button>
              <motion.button whileHover={{ scale: 1.04 }}
                className="h-10 w-10 rounded-full glass border border-border/60 grid place-items-center text-muted-foreground hover:text-foreground transition-colors">
                <Share2 className="h-4 w-4" />
              </motion.button>
              <motion.button whileHover={{ scale: 1.04 }}
                className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold glass border border-border/60 text-muted-foreground hover:text-foreground transition-colors">
                <ExternalLink className="h-4 w-4" /> Visit Website
              </motion.button>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 md:px-10 pb-12">
        {/* Screenshot placeholders */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="flex gap-3 overflow-x-auto pb-2 mb-8 -mx-2 px-2">
          {[0, 1, 2, 3].map(i => (
            <div key={i} className={`shrink-0 h-44 w-72 rounded-2xl bg-gradient-to-br ${app.gradient} opacity-30 border border-border/40 grid place-items-center`}>
              <span className="text-4xl opacity-50">{app.icon}</span>
            </div>
          ))}
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-8">
          {/* Main content */}
          <div>
            {/* Tabs */}
            <div className="flex gap-1 glass-strong rounded-xl p-1 w-fit mb-6">
              {TABS.map(tab => (
                <button key={tab} onClick={() => setActiveTab(tab)}
                  className={cn("px-4 py-2 rounded-lg text-sm font-medium capitalize transition-all",
                    activeTab === tab ? "bg-primary text-white" : "text-muted-foreground hover:text-foreground")}>
                  {tab}
                </button>
              ))}
            </div>

            {activeTab === "about" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-2">About</h3>
                  <p className="text-muted-foreground leading-relaxed">{app.description}</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="glass-strong rounded-2xl p-5 border border-border/60">
                    <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">The Problem</h4>
                    <p className="text-sm leading-relaxed">{app.problem}</p>
                  </div>
                  <div className="glass-strong rounded-2xl p-5 border border-border/60">
                    <h4 className="text-sm font-semibold text-accent uppercase tracking-wider mb-3">The Solution</h4>
                    <p className="text-sm leading-relaxed">{app.solution}</p>
                  </div>
                </div>
                <div>
                  <h3 className="text-base font-semibold mb-3">Key Features</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {app.features.map(f => (
                      <div key={f} className="flex items-center gap-2.5 glass rounded-xl px-4 py-2.5">
                        <CheckCircle2 className="h-4 w-4 text-accent shrink-0" />
                        <span className="text-sm">{f}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {[{ label: "Platforms", value: app.platforms.join(", ") }, { label: "Pricing", value: app.pricing }, { label: "Category", value: app.category }].map(item => (
                    <div key={item.label} className="glass-strong rounded-2xl p-4 border border-border/60">
                      <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">{item.label}</p>
                      <p className="text-sm font-semibold">{item.value}</p>
                    </div>
                  ))}
                </div>

                {/* ✨ AI GROWTH OPPORTUNITIES */}
                <AIGrowthOpportunities app={app} />
              </motion.div>
            )}

            {activeTab === "roadmap" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
                <h3 className="text-lg font-semibold mb-4">Product Roadmap</h3>
                {ROADMAP.map((item, i) => (
                  <motion.div key={item.label}
                    initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.07 }}
                    className="flex items-center gap-4 glass-strong rounded-2xl p-4 border border-border/60">
                    <div className={cn("h-8 w-8 rounded-full grid place-items-center shrink-0",
                      item.done ? "bg-accent/20 text-accent" : "bg-muted text-muted-foreground")}>
                      {item.done ? <CheckCircle2 className="h-4 w-4" /> : <div className="h-2 w-2 rounded-full bg-current" />}
                    </div>
                    <span className={cn("text-sm font-medium", !item.done && "text-muted-foreground")}>{item.label}</span>
                    {!item.done && <span className="ml-auto text-xs text-muted-foreground glass px-2 py-1 rounded-lg">Coming Soon</span>}
                    {item.done && <span className="ml-auto text-xs text-accent">✓ Done</span>}
                  </motion.div>
                ))}
              </motion.div>
            )}

            {activeTab === "discussion" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-semibold">Discussion</h3>
                  <span className="text-sm text-muted-foreground">{COMMENTS.length} comments</span>
                </div>
                {COMMENTS.map((c, i) => (
                  <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
                    className="glass-strong rounded-2xl p-5 border border-border/60">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="h-8 w-8 rounded-full animated-gradient grid place-items-center text-xs font-bold text-white shrink-0">{c.avatar}</div>
                      <div>
                        <p className="text-sm font-semibold">{c.user}</p>
                        <p className="text-xs text-muted-foreground">{c.time}</p>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">{c.text}</p>
                    <div className="flex items-center gap-3 mt-3">
                      <button className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors">
                        <ThumbsUp className="h-3.5 w-3.5" /> {c.votes}
                      </button>
                      <button className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors">
                        <MessageSquare className="h-3.5 w-3.5" /> Reply
                      </button>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Upvotes */}
            <div className="glass-strong rounded-2xl p-5 border border-border/60 text-center">
              <div className="text-3xl font-bold text-primary mb-1">{app.upvotes.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider">Upvotes</p>
              <div className="flex justify-center gap-0.5 mt-2">
                {[...Array(5)].map((_, i) => <Star key={i} className="h-3.5 w-3.5 text-accent fill-accent" />)}
              </div>
            </div>

            {/* Founder card */}
            <div className="glass-strong rounded-2xl p-5 border border-border/60">
              <h4 className="text-sm font-semibold mb-3 text-muted-foreground uppercase tracking-wider">Founder</h4>
              <div className="flex items-center gap-3 mb-3">
                <div className="h-10 w-10 rounded-full animated-gradient grid place-items-center text-sm font-bold text-white shrink-0">
                  {app.founder.avatar}
                </div>
                <div>
                  <p className="font-semibold text-sm">{app.founder.name}</p>
                  <p className="text-xs text-muted-foreground">Founder</p>
                </div>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed mb-3">{app.founder.bio}</p>
              <button className="w-full text-xs glass rounded-xl py-2 text-muted-foreground hover:text-foreground transition-colors border border-border/40">
                Follow Founder
              </button>
            </div>

            {/* Stats */}
            <div className="glass-strong rounded-2xl p-5 border border-border/60 space-y-3">
              <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Stats</h4>
              {[
                { label: "Followers", value: app.followers.toLocaleString() },
                { label: "Upvotes", value: app.upvotes.toLocaleString() },
                { label: "Launch Date", value: new Date(app.launchDate).toLocaleDateString("en", { month: "short", day: "numeric", year: "numeric" }) },
              ].map(s => (
                <div key={s.label} className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{s.label}</span>
                  <span className="font-semibold">{s.value}</span>
                </div>
              ))}
            </div>

            {/* Similar apps */}
            <div className="glass-strong rounded-2xl p-5 border border-border/60">
              <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">Similar Apps</h4>
              <div className="space-y-2.5">
                {APPS.filter(a => a.id !== app.id && a.category === app.category).slice(0, 3).map(a => (
                  <Link key={a.id} to={`/explore/app/${a.id}`}>
                    <motion.div whileHover={{ x: 3 }}
                      className="flex items-center gap-3 hover:bg-muted rounded-xl p-1.5 transition-colors">
                      <div className={`h-8 w-8 rounded-xl bg-gradient-to-br ${a.gradient} grid place-items-center text-base shrink-0`}>{a.icon}</div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold truncate">{a.name}</p>
                        <p className="text-[10px] text-muted-foreground truncate">{a.tagline}</p>
                      </div>
                      <ChevronRight className="h-3 w-3 text-muted-foreground shrink-0" />
                    </motion.div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
