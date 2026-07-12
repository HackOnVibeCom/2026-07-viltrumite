import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import {
  Sparkles, TrendingUp, Users, Zap, ArrowRight, Brain,
  Rocket, BarChart3, CheckCircle2, Bell, Bot, Loader2, RefreshCw
} from "lucide-react";
import { useAnalysis } from "@/context/AnalysisContext";
import { useAppProfile } from "@/context/AppProfileContext";
import { PactModal } from "@/components/founder/PactModal";
import { MOCK_ANALYSIS } from "@/data/analysisData";
import { SimulationWidget } from "@/components/founder/SimulationWidget";

export const Route = createFileRoute("/founder/")({
  component: FounderDashboard,
});

function useCountdown(target: string) {
  const [, setTick] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setTick((x) => x + 1), 1000);
    return () => clearInterval(t);
  }, []);
  const diff = Math.max(0, new Date(target).getTime() - Date.now());
  return {
    d: Math.floor(diff / 86400000),
    h: Math.floor((diff % 86400000) / 3600000),
    m: Math.floor((diff % 3600000) / 60000),
    s: Math.floor((diff % 60000) / 1000),
  };
}

function StatCard({ icon: Icon, label, value, sub, color, delay }: any) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      whileHover={{ y: -4 }}
      className="glass-strong rounded-2xl p-5 border border-border/60 hover:border-primary/30 transition-colors"
    >
      <div className="flex items-start justify-between mb-3">
        <div
          className="h-10 w-10 rounded-xl grid place-items-center"
          style={{ background: `${color}20`, border: `1px solid ${color}30` }}
        >
          <Icon className="h-5 w-5" style={{ color }} />
        </div>
        <span className="text-xs text-muted-foreground glass px-2 py-0.5 rounded-full">{sub}</span>
      </div>
      <p className="text-2xl font-bold">{value}</p>
      <p className="text-sm text-muted-foreground mt-0.5">{label}</p>
    </motion.div>
  );
}

function FounderDashboard() {
  const navigate = useNavigate();
  const { profile, setAnalysisComplete, deleteProduct } = useAppProfile();
  const { result } = useAnalysis();
  
  const [selectedPartner, setSelectedPartner] = useState<any | null>(null);
  const [pactOpen, setPactOpen] = useState(false);
  const [activeCount, setActiveCount] = useState(0);
  const [pendingCount, setPendingCount] = useState(0);

  // Sync Pacts count
  useEffect(() => {
    const syncPacts = () => {
      const stored = localStorage.getItem("lm_pacts");
      if (stored) {
        const parsed = JSON.parse(stored);
        setActiveCount(parsed.filter((p: any) => p.status === "active").length);
        setPendingCount(parsed.filter((p: any) => p.status === "pending").length);
      } else {
        // Fallback defaults
        setActiveCount(1);
        setPendingCount(2);
      }
    };
    syncPacts();
    const interval = setInterval(syncPacts, 2000);
    return () => clearInterval(interval);
  }, []);

  const display = result ?? MOCK_ANALYSIS;
  const topPartner = display.topPartners?.[0] || MOCK_ANALYSIS.topPartners[0];

  // Dynamic countdown target
  const countdownTarget = profile
    ? `${profile.launchDate}T${profile.launchTime || "00:00"}:00`
    : "2026-07-20T00:00:00";
  const { d, h, m } = useCountdown(countdownTarget);

  const reRunAnalysis = () => {
    setAnalysisComplete(false);
    toast.info("LaunchMesh AI: Re-running growth analysis...");
    navigate({ to: "/founder" });
  };

  const handleResetApp = () => {
    if (confirm("Are you sure you want to reset this launch workspace and delete your product profile?")) {
      deleteProduct();
      toast.success("Launch workspace reset successfully.");
      navigate({ to: "/founder" });
    }
  };

  const ACTIVITY = [
    { icon: "🤖", text: "AI generated growth report", time: "2m ago", color: "#6C5CE7" },
    { icon: "🤝", text: `Growth Pact created with ${topPartner.name}`, time: "Just now", color: "#00D4B8" },
    { icon: "📧", text: "Newsletter campaign slots synchronized", time: "3h ago", color: "#F59E0B" },
  ];

  const TIMELINE = [
    { label: "Today", sub: "Review AI matches", done: true },
    { label: "Campaign Sync", sub: `Outreach to ${topPartner.name}`, done: activeCount > 0 },
    { label: "Newsletter", sub: "Shared email slot co-marketing", done: false },
    { label: "Launch Day", sub: "Joint traffic redirects live", done: false },
  ];

  const RECS = [
    { icon: "📦", text: `Bundle recommendation: ${display.recommendedBundle}` },
    { icon: "📅", text: `Launch on a ${display.bestLaunchDay} for optimal matching traffic` },
    { icon: "🤝", text: `Send pact proposal to ${topPartner.name} (${topPartner.match}% match)` },
  ];

  return (
    <div className="pt-20 md:pt-24 px-6 md:px-8 pb-6 md:pb-8 space-y-8 max-w-6xl">
      {/* Welcome header */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between flex-wrap gap-4"
      >
        <div>
          <h1 className="text-2xl font-bold">Welcome back, {profile?.appName || "Founder"} 👋</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Your AI growth engine is running. Here's what's happening.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="glass rounded-xl px-4 py-2 border border-border/60 flex items-center gap-2">
            <Zap className="h-4 w-4 text-accent animate-pulse" />
            <span className="text-xs text-muted-foreground">Launch in</span>
            <span className="text-sm font-bold tabular-nums">
              {d}d {String(h).padStart(2, "0")}h {String(m).padStart(2, "0")}m
            </span>
          </div>
          <button
            onClick={() => {
              setSelectedPartner(topPartner);
              setPactOpen(true);
            }}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white cursor-pointer hover:scale-[1.02] transition-transform"
            style={{
              background: "linear-gradient(135deg, #6C5CE7, #00D4B8)",
              boxShadow: "0 0 30px -8px rgba(108,92,231,0.6)",
            }}
          >
            <Zap className="h-4 w-4" /> Create Growth Pact
          </button>
        </div>
      </motion.div>

      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          icon={TrendingUp}
          label="Growth Score"
          value={`${display.growthScore}/100`}
          sub="AI Core Live"
          color="#6C5CE7"
          delay={0.05}
        />
        <StatCard
          icon={Users}
          label="Expected Installs"
          value={display.expectedInstalls}
          sub="Projected mutual lift"
          color="#00D4B8"
          delay={0.1}
        />
        <StatCard
          icon={Sparkles}
          label="AI Confidence"
          value={`${display.aiConfidence}%`}
          sub="Affinity High"
          color="#F59E0B"
          delay={0.15}
        />
        <StatCard
          icon={BarChart3}
          label="Active Pacts"
          value={String(activeCount)}
          sub={`${pendingCount} pending`}
          color="#EC4899"
          delay={0.2}
        />
      </div>

      {/* Hero AI match card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="relative overflow-hidden rounded-3xl border border-primary/30 p-6 md:p-8"
        style={{
          background: "linear-gradient(135deg, rgba(108,92,231,0.18) 0%, rgba(0,212,184,0.10) 100%)",
          boxShadow: "0 0 60px -15px rgba(108,92,231,0.4)",
        }}
      >
        <div
          className="absolute -top-16 -right-16 h-56 w-56 rounded-full opacity-25 blur-3xl"
          style={{ background: "radial-gradient(circle, #6C5CE7, transparent 70%)" }}
        />
        <div
          className="absolute -bottom-8 -left-8 h-40 w-40 rounded-full opacity-15 blur-3xl"
          style={{ background: "radial-gradient(circle, #00D4B8, transparent 70%)" }}
        />
        <div className="absolute inset-0 grid-bg opacity-10" />

        <div className="relative flex flex-col md:flex-row gap-6 md:items-center">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-3">
              <Brain className="h-5 w-5 text-accent animate-pulse" />
              <span className="text-xs font-semibold uppercase tracking-widest text-accent">
                🚀 Top Partnership Match
              </span>
            </div>
            <h2 className="text-2xl font-bold mb-1">Recommended Collaboration</h2>

            <div className="flex items-center gap-4 mt-4 mb-5">
              <div
                className={`h-14 w-14 rounded-2xl bg-gradient-to-br ${topPartner.gradient} grid place-items-center text-3xl shrink-0`}
              >
                {topPartner.icon}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xl font-bold">{topPartner.name}</span>
                  <span className="text-xs font-bold text-accent glass px-2.5 py-1 rounded-full border border-accent/30">
                    {topPartner.match}% Match
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mt-0.5">{topPartner.reason}</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 mb-5">
              {[
                { label: "Expected installs", value: topPartner.installs },
                { label: "Audience overlap", value: topPartner.overlap },
                { label: "Trust score", value: topPartner.trustScore },
              ].map((s) => (
                <div key={s.label} className="glass rounded-xl p-3 border border-border/40">
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{s.label}</p>
                  <p className="text-base font-bold mt-0.5">{s.value}</p>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-2">
              <Link to="/founder/matches">
                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold glass border border-border/60 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                >
                  View All Matches <ArrowRight className="h-4 w-4" />
                </motion.button>
              </Link>
              <button
                onClick={() => {
                  setSelectedPartner(topPartner);
                  setPactOpen(true);
                }}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white cursor-pointer hover:scale-[1.02] transition-transform"
                style={{
                  background: "linear-gradient(135deg, #6C5CE7, #00D4B8)",
                  boxShadow: "0 0 20px -8px rgba(108,92,231,0.6)",
                }}
              >
                <Zap className="h-4 w-4" /> Create Growth Pact
              </button>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="shrink-0 space-y-2 min-w-[220px]">
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-3">Quick Actions</p>
            <button
              onClick={reRunAnalysis}
              className="w-full flex items-center gap-3 glass bg-white/5 border border-border/40 hover:border-primary/50 rounded-xl px-4 py-2.5 text-xs font-semibold cursor-pointer transition-colors text-left"
            >
              <RefreshCw className="h-4 w-4 text-primary shrink-0" />
              <span>Re-run AI Analysis</span>
              <ArrowRight className="h-3.5 w-3.5 text-muted-foreground ml-auto" />
            </button>
            <Link to="/founder/audience" className="block">
              <div className="flex items-center gap-3 glass bg-white/5 border border-border/40 hover:border-primary/50 rounded-xl px-4 py-2.5 text-xs font-semibold cursor-pointer transition-colors text-left">
                <BarChart3 className="h-4 w-4 text-primary shrink-0" />
                <span>View Audience Graph</span>
                <ArrowRight className="h-3.5 w-3.5 text-muted-foreground ml-auto" />
              </div>
            </Link>
            <button
              onClick={handleResetApp}
              className="w-full flex items-center gap-3 glass bg-white/5 border border-border/40 hover:border-rose-500/50 rounded-xl px-4 py-2.5 text-xs font-semibold cursor-pointer transition-colors text-left text-muted-foreground hover:text-rose-400"
            >
              <Trash2Icon className="h-4 w-4 text-rose-500 shrink-0" />
              <span>Reset Launch Workspace</span>
            </button>
          </div>
        </div>
      </motion.div>

      {/* Recommendations & Timeline */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-strong rounded-2xl p-5 border border-border/60"
        >
          <div className="flex items-center gap-2 mb-4">
            <Bot className="h-4 w-4 text-accent" />
            <h3 className="text-base font-semibold">Growth Recommendations</h3>
          </div>
          <div className="space-y-3">
            {RECS.map((r, i) => (
              <div
                key={i}
                className="flex items-start gap-3 glass rounded-xl p-3 border border-border/40 hover:border-primary/20 transition-colors"
              >
                <span className="text-base shrink-0">{r.icon}</span>
                <p className="text-xs text-muted-foreground leading-normal">{r.text}</p>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="glass-strong rounded-2xl p-5 border border-border/60"
        >
          <div className="flex items-center gap-2 mb-4">
            <Rocket className="h-4 w-4 text-primary" />
            <h3 className="text-base font-semibold">Launch Timeline</h3>
          </div>
          <div className="relative space-y-0">
            {TIMELINE.map((step, i) => (
              <div key={step.label} className="flex gap-3 relative">
                {i < TIMELINE.length - 1 && (
                  <div
                    className="absolute left-[13px] top-8 w-px h-full"
                    style={{ background: "linear-gradient(to bottom, rgba(108,92,231,0.4), rgba(0,212,184,0.1))" }}
                  />
                )}
                <div
                  className={`h-7 w-7 rounded-full grid place-items-center shrink-0 mt-1 z-10 ${step.done ? "bg-accent/20 border border-accent/40" : "bg-white/5 border border-border/40"}`}
                >
                  {step.done ? (
                    <CheckCircle2 className="h-3.5 w-3.5 text-accent" />
                  ) : (
                    <div className="h-2 w-2 rounded-full bg-border" />
                  )}
                </div>
                <div className="pb-4 flex-1">
                  <p className={`text-sm font-semibold ${step.done ? "text-foreground" : "text-muted-foreground"}`}>
                    {step.label}
                  </p>
                  <p className="text-xs text-muted-foreground">{step.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Growth Strategy */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.28 }}
        className="glass-strong rounded-2xl p-5 border border-border/60"
      >
        <div className="flex items-center gap-2 mb-4">
          <Brain className="h-4 w-4 text-primary animate-pulse" />
          <h3 className="text-base font-semibold">AI Launch Strategy</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {display.launchStrategy.slice(0, 4).map((strat, idx) => (
            <div key={idx} className="glass rounded-xl p-4 border border-border/40 flex items-start gap-3">
              <span className="h-5 w-5 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center text-[10px] font-bold text-primary shrink-0 mt-0.5">
                {idx + 1}
              </span>
              <p className="text-xs text-muted-foreground leading-relaxed">{strat.replace(/\*\*/g, "")}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Activity Feed */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        className="glass-strong rounded-2xl p-5 border border-border/60"
      >
        <div className="flex items-center gap-2 mb-4">
          <Bell className="h-4 w-4 text-primary" />
          <h3 className="text-base font-semibold">Recent Activity</h3>
        </div>
        <div className="space-y-2">
          {ACTIVITY.map((a, i) => (
            <div key={i} className="flex items-center gap-4 glass rounded-xl p-3.5 border border-border/40">
              <div
                className="h-8 w-8 rounded-xl grid place-items-center text-base shrink-0"
                style={{ background: `${a.color}20`, border: `1px solid ${a.color}30` }}
              >
                {a.icon}
              </div>
              <p className="text-xs flex-1">{a.text}</p>
              <span className="text-[10px] text-muted-foreground shrink-0">{a.time}</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Dynamic Pact Creator Modal */}
      <PactModal
        isOpen={pactOpen}
        onClose={() => setPactOpen(false)}
        partner={selectedPartner}
      />

      {/* Simulation Widget renders only on Dashboard */}
      <SimulationWidget />
    </div>
  );
}

function Trash2Icon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 6h18" />
      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
      <line x1="10" x2="10" y1="11" y2="17" />
      <line x1="14" x2="14" y1="11" y2="17" />
    </svg>
  );
}
