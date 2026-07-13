import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import {
  Sparkles, TrendingUp, Users, Zap, ArrowRight, Brain,
  Rocket, BarChart3, CheckCircle2, Bell, Bot, Loader2, RefreshCw,
  Briefcase, Search, Mail, Send, Gift, Share2, Globe, MessageSquare, BookOpen
} from "lucide-react";
import { useAnalysis } from "@/context/AnalysisContext";
import { useAppProfile } from "@/context/AppProfileContext";
import { PactModal } from "@/components/founder/PactModal";
import { MOCK_ANALYSIS } from "@/data/analysisData";
import { calculateLaunchBudgetPlan } from "@/lib/budgetPlanner";

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

const getChannelIcon = (channel: string) => {
  switch (channel) {
    case "Product Hunt promotion":
      return <Rocket className="h-4 w-4 text-orange-500 font-semibold" />;
    case "Reddit ads":
      return <MessageSquare className="h-4 w-4 text-orange-400 font-semibold" />;
    case "X (Twitter) promotion":
      return <TrendingUp className="h-4 w-4 text-sky-400 font-semibold" />;
    case "LinkedIn":
      return <Briefcase className="h-4 w-4 text-blue-500 font-semibold" />;
    case "Google Ads":
      return <Search className="h-4 w-4 text-emerald-400 font-semibold" />;
    case "Meta Ads":
      return <Globe className="h-4 w-4 text-blue-400 font-semibold" />;
    case "Influencer partnerships":
      return <Sparkles className="h-4 w-4 text-pink-500 font-semibold" />;
    case "Newsletter sponsorships":
      return <Mail className="h-4 w-4 text-amber-500 font-semibold" />;
    case "Discord communities":
      return <MessageSquare className="h-4 w-4 text-indigo-400 font-semibold" />;
    case "Slack communities":
      return <MessageSquare className="h-4 w-4 text-emerald-500 font-semibold" />;
    case "Telegram communities":
      return <Send className="h-4 w-4 text-sky-500 font-semibold" />;
    case "Content marketing":
      return <BookOpen className="h-4 w-4 text-indigo-500 font-semibold" />;
    case "Giveaway budget":
      return <Gift className="h-4 w-4 text-red-400 font-semibold" />;
    case "Referral rewards":
      return <Share2 className="h-4 w-4 text-teal-400 font-semibold" />;
    default:
      return <Sparkles className="h-4 w-4 text-primary font-semibold" />;
  }
};

function FounderDashboard() {
  const navigate = useNavigate();
  const { profile, setAnalysisComplete, deleteProduct } = useAppProfile();
  const { result } = useAnalysis();
  
  const [selectedPartner, setSelectedPartner] = useState<any | null>(null);
  const [pactOpen, setPactOpen] = useState(false);
  const [activeCount, setActiveCount] = useState(0);
  const [pendingCount, setPendingCount] = useState(0);

  // AI Launch Budget Planner States
  const [plannerBudget, setPlannerBudget] = useState<number>(5000);
  const [plannerCurrency, setPlannerCurrency] = useState<"USD" | "INR">("USD");
  const [plannerCountry, setPlannerCountry] = useState<string>("United States");
  const [plannerCategory, setPlannerCategory] = useState<string>("SaaS");
  const [plannerGoal, setPlannerGoal] = useState<"Users" | "Revenue" | "Waitlist" | "Awareness">("Users");
  const [isOptimizing, setIsOptimizing] = useState<boolean>(false);
  const [optimizationStep, setOptimizationStep] = useState<string>("");
  const [budgetPlan, setBudgetPlan] = useState<any>(null);

  const activePactExists = activeCount > 0;

  const runBudgetOptimization = useCallback(async (isInitial = false) => {
    if (!isInitial) {
      setIsOptimizing(true);
      
      const steps = [
        "Analyzing target demographics...",
        "Evaluating historical channel ROI...",
        "Benchmarking CAC for category...",
        "Integrating Growth Pact co-marketing efficiencies...",
        "Finalizing budget distribution..."
      ];

      for (let i = 0; i < steps.length; i++) {
        setOptimizationStep(steps[i]);
        await new Promise((resolve) => setTimeout(resolve, i === 0 ? 300 : 250));
      }
    }

    const res = calculateLaunchBudgetPlan({
      totalBudget: plannerBudget,
      currency: plannerCurrency,
      country: plannerCountry,
      category: plannerCategory,
      goal: plannerGoal,
      hasGrowthPact: activePactExists,
    });

    setBudgetPlan(res);
    setIsOptimizing(false);
    setOptimizationStep("");
    if (!isInitial) {
      toast.success("Launch budget optimized successfully!");
    }
  }, [plannerBudget, plannerCurrency, plannerCountry, plannerCategory, plannerGoal, activePactExists]);

  useEffect(() => {
    runBudgetOptimization(true);
  }, [activeCount, runBudgetOptimization]);

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

      {/* AI Launch Budget Planner Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.18 }}
        className="relative overflow-hidden rounded-3xl border border-primary/20 p-6 md:p-8 glass-strong"
        style={{
          background: "linear-gradient(135deg, rgba(108,92,231,0.06) 0%, rgba(0,212,184,0.03) 100%)",
        }}
      >
        <div
          className="absolute -top-24 -left-24 h-64 w-64 rounded-full opacity-10 blur-3xl"
          style={{ background: "radial-gradient(circle, #6C5CE7, transparent 70%)" }}
        />
        <div
          className="absolute -bottom-24 -right-24 h-64 w-64 rounded-full opacity-10 blur-3xl"
          style={{ background: "radial-gradient(circle, #00D4B8, transparent 70%)" }}
        />

        {/* Card Header */}
        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 border-b border-border/40 pb-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="h-8 w-8 rounded-lg bg-primary/10 border border-primary/20 grid place-items-center">
                <Sparkles className="h-4.5 w-4.5 text-primary" />
              </div>
              <span className="text-xs font-semibold uppercase tracking-widest text-primary">
                SaaS Growth Suite
              </span>
            </div>
            <h2 className="text-2xl font-bold">AI Launch Budget Planner</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Distribute and optimize marketing spend across channels aligned to your launch objectives.
            </p>
          </div>
          
          <button
            onClick={() => runBudgetOptimization(false)}
            disabled={isOptimizing}
            className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold text-white cursor-pointer hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:pointer-events-none self-start md:self-auto shrink-0 min-w-[200px]"
            style={{
              background: "linear-gradient(135deg, #6C5CE7, #00D4B8)",
              boxShadow: "0 0 20px -8px rgba(108,92,231,0.6)",
            }}
          >
            {isOptimizing ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Optimizing...</span>
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                <span>Optimize Budget with AI</span>
              </>
            )}
          </button>
        </div>

        {/* Inputs Section */}
        <div className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {/* Budget Input */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Launch Budget
            </label>
            <div className="relative flex items-center">
              <span className="absolute left-3.5 text-muted-foreground font-semibold">
                {plannerCurrency === "USD" ? "$" : "₹"}
              </span>
              <input
                type="number"
                value={plannerBudget}
                onChange={(e) => setPlannerBudget(Math.max(0, parseInt(e.target.value) || 0))}
                className="w-full pl-8 pr-16 py-2.5 rounded-xl bg-background/40 border border-border/60 text-sm font-semibold focus:outline-none focus:border-primary/50 text-foreground"
              />
              <div className="absolute right-1.5 flex gap-1 bg-muted/60 p-0.5 rounded-lg border border-border/20">
                <button
                  onClick={() => {
                    const newBudget = plannerCurrency === "USD" ? plannerBudget * 80 : Math.round(plannerBudget / 80);
                    setPlannerCurrency("INR");
                    setPlannerBudget(newBudget);
                  }}
                  className={`text-[10px] px-1.5 py-0.5 rounded-md font-bold transition-all cursor-pointer ${
                    plannerCurrency === "INR" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  ₹
                </button>
                <button
                  onClick={() => {
                    const newBudget = plannerCurrency === "INR" ? Math.round(plannerBudget / 80) : plannerBudget;
                    setPlannerCurrency("USD");
                    setPlannerBudget(newBudget);
                  }}
                  className={`text-[10px] px-1.5 py-0.5 rounded-md font-bold transition-all cursor-pointer ${
                    plannerCurrency === "USD" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  $
                </button>
              </div>
            </div>
          </div>

          {/* Launch Country Select */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Launch Country
            </label>
            <select
              value={plannerCountry}
              onChange={(e) => setPlannerCountry(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-background/40 border border-border/60 text-sm font-semibold focus:outline-none focus:border-primary/50 text-foreground appearance-none cursor-pointer"
              style={{ backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><polyline points='6 9 12 15 18 9'></polyline></svg>")`, backgroundPosition: "right 12px center", backgroundSize: "16px", backgroundRepeat: "no-repeat" }}
            >
              <option value="United States" className="bg-slate-900 text-slate-100">United States</option>
              <option value="India" className="bg-slate-900 text-slate-100">India</option>
              <option value="United Kingdom" className="bg-slate-900 text-slate-100">United Kingdom</option>
              <option value="Germany" className="bg-slate-900 text-slate-100">Germany</option>
              <option value="Canada" className="bg-slate-900 text-slate-100">Canada</option>
              <option value="Global" className="bg-slate-900 text-slate-100">Global / Multi-region</option>
            </select>
          </div>

          {/* Product Category Select */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Product Category
            </label>
            <select
              value={plannerCategory}
              onChange={(e) => setPlannerCategory(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-background/40 border border-border/60 text-sm font-semibold focus:outline-none focus:border-primary/50 text-foreground appearance-none cursor-pointer"
              style={{ backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><polyline points='6 9 12 15 18 9'></polyline></svg>")`, backgroundPosition: "right 12px center", backgroundSize: "16px", backgroundRepeat: "no-repeat" }}
            >
              <option value="SaaS" className="bg-slate-900 text-slate-100">SaaS (Software as a Service)</option>
              <option value="Mobile App" className="bg-slate-900 text-slate-100">Mobile Application</option>
              <option value="B2B Developer Tool" className="bg-slate-900 text-slate-100">B2B Developer Tool</option>
              <option value="Consumer Tech" className="bg-slate-900 text-slate-100">Consumer Tech / Social</option>
              <option value="Web3/Crypto" className="bg-slate-900 text-slate-100">Web3 / Crypto App</option>
            </select>
          </div>

          {/* Goal Select */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Launch Goal
            </label>
            <select
              value={plannerGoal}
              onChange={(e: any) => setPlannerGoal(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-background/40 border border-border/60 text-sm font-semibold focus:outline-none focus:border-primary/50 text-foreground appearance-none cursor-pointer"
              style={{ backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><polyline points='6 9 12 15 18 9'></polyline></svg>")`, backgroundPosition: "right 12px center", backgroundSize: "16px", backgroundRepeat: "no-repeat" }}
            >
              <option value="Users" className="bg-slate-900 text-slate-100">Maximize Users</option>
              <option value="Revenue" className="bg-slate-900 text-slate-100">Drive Revenue</option>
              <option value="Waitlist" className="bg-slate-900 text-slate-100">Build Pre-launch Waitlist</option>
              <option value="Awareness" className="bg-slate-900 text-slate-100">Increase Brand Awareness</option>
            </select>
          </div>
        </div>

        {/* Growth Pact Integration Banner */}
        {budgetPlan?.savings && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 rounded-2xl border border-accent/30 bg-accent/10 flex items-start gap-3 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 h-24 w-24 rounded-full bg-accent/5 blur-xl pointer-events-none" />
            <Zap className="h-5 w-5 text-accent shrink-0 mt-0.5 animate-pulse" />
            <div className="flex-1">
              <h4 className="text-sm font-bold text-accent">
                Growth Pact Savings Active!
              </h4>
              <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                By leveraging your active Growth Pact with <strong className="text-foreground">{budgetPlan.savings.partnerName}</strong>, 
                you save <strong className="text-accent">{plannerCurrency === "USD" ? "$" : "₹"}{budgetPlan.savings.amount.toLocaleString()}</strong> in marketing costs through audience cross-promotion. 
                This co-marketing is projected to bring in <strong className="text-accent">+{budgetPlan.savings.installs.toLocaleString()} users</strong> without paid ad spend (saving an average paid CAC of {plannerCurrency === "USD" ? "$" : "₹"}{budgetPlan.savings.cacSaved}/user).
              </p>
            </div>
          </motion.div>
        )}

        {/* Loading Overlay */}
        {isOptimizing && (
          <div className="relative my-8 p-8 rounded-2xl border border-primary/20 bg-background/50 backdrop-blur-md flex flex-col items-center justify-center text-center gap-4">
            <Loader2 className="h-8 w-8 text-primary animate-spin" />
            <div>
              <p className="text-sm font-bold text-foreground">AI Growth Engine Running</p>
              <p className="text-xs text-muted-foreground mt-1 transition-all animate-pulse">{optimizationStep}</p>
            </div>
            <div className="w-48 h-1 bg-border/40 rounded-full overflow-hidden mt-1">
              <div className="h-full bg-gradient-to-r from-primary to-accent animate-infinite-loading" />
            </div>
          </div>
        )}

        {/* Results Content */}
        {!isOptimizing && budgetPlan && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            {/* Summary Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              {[
                { 
                  label: "Total Budget", 
                  value: `${plannerCurrency === "USD" ? "$" : "₹"}${budgetPlan.summary.totalBudget.toLocaleString()}`,
                  sub: "Configured Spend", 
                  color: "#6C5CE7" 
                },
                { 
                  label: "Est. New Users", 
                  value: budgetPlan.summary.estimatedNewUsers.toLocaleString(),
                  sub: "Expected Signups", 
                  color: "#00D4B8" 
                },
                { 
                  label: "Est. Revenue", 
                  value: `${plannerCurrency === "USD" ? "$" : "₹"}${budgetPlan.summary.estimatedRevenue.toLocaleString()}`,
                  sub: "Projected Return", 
                  color: "#10B981" 
                },
                { 
                  label: "Est. Profit", 
                  value: `${plannerCurrency === "USD" ? "$" : "₹"}${budgetPlan.summary.estimatedProfit.toLocaleString()}`,
                  sub: "Net ROI Lift", 
                  color: budgetPlan.summary.estimatedProfit >= 0 ? "#10B981" : "#EF4444" 
                },
                { 
                  label: "Break-even Point", 
                  value: budgetPlan.summary.breakEvenPoint,
                  sub: "Target Required", 
                  color: "#F59E0B" 
                },
                { 
                  label: "AI Confidence", 
                  value: `${budgetPlan.summary.aiConfidence}%`,
                  sub: "Calculated Accuracy", 
                  color: "#6C5CE7" 
                },
              ].map((stat, i) => (
                <div 
                  key={i} 
                  className="glass rounded-xl p-3 border border-border/40 hover:border-primary/20 transition-all hover:scale-[1.01]"
                >
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{stat.label}</p>
                  <p className="text-base font-bold mt-1" style={{ color: stat.color }}>{stat.value}</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5 font-medium">{stat.sub}</p>
                </div>
              ))}
            </div>

            {/* Channels Table/List */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                  Recommended Channel Breakdown
                </h3>
                <span className="text-xs font-semibold text-primary bg-primary/10 px-2.5 py-1 rounded-full">
                  14 Target Channels
                </span>
              </div>

              {/* Table wrapper for responsiveness */}
              <div className="overflow-x-auto rounded-2xl border border-border/40 bg-background/10">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-border/40 bg-white/5 text-muted-foreground font-semibold">
                      <th className="p-3">Marketing Channel</th>
                      <th className="p-3">Suggested Spend</th>
                      <th className="p-3">Allocation</th>
                      <th className="p-3 text-right">Expected Users</th>
                      <th className="p-3 text-right">Est. CPC/CAC</th>
                      <th className="p-3 text-right">Expected ROI</th>
                      <th className="p-3 text-right">Confidence</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/20 font-medium">
                    {budgetPlan.allocations.map((alloc: any, i: number) => {
                      const allocationPercent = Math.round((alloc.suggestedSpend / (budgetPlan.summary.totalBudget || 1)) * 100);
                      return (
                        <tr 
                          key={i} 
                          className="hover:bg-white/5 transition-colors"
                        >
                          <td className="p-3 flex items-center gap-2.5">
                            {getChannelIcon(alloc.channel)}
                            <span className="font-semibold text-foreground">{alloc.channel}</span>
                          </td>
                          <td className="p-3 text-foreground font-bold">
                            {plannerCurrency === "USD" ? "$" : "₹"}{alloc.suggestedSpend.toLocaleString()}
                          </td>
                          <td className="p-3 min-w-[120px]">
                            <div className="flex items-center gap-2">
                              <div className="flex-1 h-1.5 bg-border/40 rounded-full overflow-hidden">
                                <div 
                                  className="h-full bg-primary/80 rounded-full" 
                                  style={{ width: `${allocationPercent}%` }}
                                />
                              </div>
                              <span className="text-[10px] text-muted-foreground w-6 text-right font-bold">
                                {allocationPercent}%
                              </span>
                            </div>
                          </td>
                          <td className="p-3 text-right text-foreground font-semibold">
                            +{alloc.expectedUsers.toLocaleString()}
                          </td>
                          <td className="p-3 text-right text-muted-foreground">
                            {plannerCurrency === "USD" ? "$" : "₹"}{alloc.estimatedCac.toLocaleString()}/user
                          </td>
                          <td className="p-3 text-right">
                            <span className="text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                              {alloc.expectedRoi}%
                            </span>
                          </td>
                          <td className="p-3 text-right">
                            <span 
                              className={`font-semibold text-[10px] px-1.5 py-0.5 rounded border ${
                                alloc.confidenceScore >= 85 
                                  ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" 
                                  : alloc.confidenceScore >= 75 
                                  ? "text-amber-400 bg-amber-500/10 border-amber-500/20" 
                                  : "text-rose-400 bg-rose-500/10 border-rose-500/20"
                              }`}
                            >
                              {alloc.confidenceScore}%
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}
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
