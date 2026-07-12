import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import {
  Sparkles, TrendingUp, Users, Zap, ArrowRight, Brain,
  Rocket, BarChart3, CheckCircle2, Bell, Bot, Loader2,
} from "lucide-react";
import { AnalysisModal } from "@/components/founder/AnalysisModal";
import { useAnalysis } from "@/context/AnalysisContext";
import { MOCK_ANALYSIS } from "@/data/analysisData";

export const Route = createFileRoute("/founder/")({
  component: FounderDashboard,
});

function useCountdown(target: string) {
  const [, setTick] = useState(0);
  useEffect(() => { const t = setInterval(() => setTick(x => x + 1), 1000); return () => clearInterval(t); }, []);
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
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay }}
      whileHover={{ y: -4 }}
      className="glass-strong rounded-2xl p-5 border border-border/60 hover:border-primary/30 transition-colors">
      <div className="flex items-start justify-between mb-3">
        <div className="h-10 w-10 rounded-xl grid place-items-center" style={{ background: `${color}20`, border: `1px solid ${color}30` }}>
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
  const { d, h, m, s } = useCountdown("2026-07-20T00:00:00");
  const navigate = useNavigate();
  const { result, status, analyze, reset } = useAnalysis();
  const [analysisOpen, setAnalysisOpen] = useState(false);
  const [apiComplete, setApiComplete] = useState(false);

  const display = result ?? MOCK_ANALYSIS;
  const topPartner = display.topPartners[0];
  const isAnalyzing = status === "loading";

  const runAnalysis = useCallback(async () => {
    reset();
    setApiComplete(false);
    setAnalysisOpen(true);

    const analysisResult = await analyze();
    if (analysisResult) {
      setApiComplete(true);
    } else {
      setAnalysisOpen(false);
      toast.error("Analysis failed", {
        description: "LaunchMesh AI couldn't complete your growth report. Please try again.",
        action: {
          label: "Retry",
          onClick: () => void runAnalysis(),
        },
        duration: 8000,
      });
    }
  }, [analyze, reset]);

  const ACTIVITY = [
    { icon: "🤖", text: "AI generated growth report", time: "2m ago", color: "#6C5CE7" },
    { icon: "🤝", text: "New partnership request from StudyFlow", time: "1h ago", color: "#00D4B8" },
    { icon: "📧", text: "Newsletter campaign scheduled for Friday", time: "3h ago", color: "#F59E0B" },
    { icon: "📦", text: "Bundle invitation: Back to School collection", time: "5h ago", color: "#EC4899" },
  ];

  const TIMELINE = [
    { label: "Today", sub: "Soft launch prep", done: true },
    { label: "Cross Promotion", sub: "StudyFlow newsletter swap", done: true },
    { label: "Newsletter", sub: "8k subscriber email", done: false },
    { label: "Launch Day", sub: "Product Hunt go-live", done: false },
    { label: "Analytics", sub: "Review & optimize", done: false },
  ];

  const RECS = [
    { icon: "📦", text: "Bundle with FocusFlow — +340 installs projected" },
    { icon: "📅", text: "Launch on Friday — 42% higher visibility" },
    { icon: "📧", text: "Run newsletter campaign — 12k reach available" },
    { icon: "🤝", text: "Accept StudyFlow pact — 96% audience match" },
  ];

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-6xl">

      {/* Welcome header */}
      <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold">Welcome back, Founder 👋</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Your AI growth engine is running. Here's what's happening.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="glass rounded-xl px-4 py-2 border border-border/60 flex items-center gap-2">
            <Zap className="h-4 w-4 text-accent" />
            <span className="text-xs text-muted-foreground">Launch in</span>
            <span className="text-sm font-bold tabular-nums">{d}d {String(h).padStart(2,"0")}h {String(m).padStart(2,"0")}m</span>
          </div>
          <Link to="/founder/pacts">
            <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white"
              style={{ background: "linear-gradient(135deg, #6C5CE7, #00D4B8)", boxShadow: "0 0 30px -8px rgba(108,92,231,0.6)" }}>
              <Zap className="h-4 w-4" /> Create Growth Pact
            </motion.button>
          </Link>
        </div>
      </motion.div>

      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard icon={TrendingUp} label="Growth Score" value={`${display.growthScore}/100`} sub={result ? "AI live" : "↑ 12 pts"} color="#6C5CE7" delay={0.05} />
        <StatCard icon={Users} label="Expected Installs" value={display.expectedInstalls} sub="This month" color="#00D4B8" delay={0.1} />
        <StatCard icon={Sparkles} label="AI Confidence" value={`${display.aiConfidence}%`} sub={result ? "Live" : "High"} color="#F59E0B" delay={0.15} />
        <StatCard icon={BarChart3} label="Active Pacts" value="3" sub="2 pending" color="#EC4899" delay={0.2} />
      </div>

      {/* Hero AI card */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
        className="relative overflow-hidden rounded-3xl border border-primary/30 p-6 md:p-8"
        style={{
          background: "linear-gradient(135deg, rgba(108,92,231,0.18) 0%, rgba(0,212,184,0.10) 100%)",
          boxShadow: "0 0 60px -15px rgba(108,92,231,0.4)",
        }}>
        {/* bg orbs */}
        <div className="absolute -top-16 -right-16 h-56 w-56 rounded-full opacity-25 blur-3xl"
          style={{ background: "radial-gradient(circle, #6C5CE7, transparent 70%)" }} />
        <div className="absolute -bottom-8 -left-8 h-40 w-40 rounded-full opacity-15 blur-3xl"
          style={{ background: "radial-gradient(circle, #00D4B8, transparent 70%)" }} />
        <div className="absolute inset-0 grid-bg opacity-10" />

        <div className="relative flex flex-col md:flex-row gap-6 md:items-center">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-3">
              <Brain className="h-5 w-5 text-accent" />
              <span className="text-xs font-semibold uppercase tracking-widest text-accent">🚀 AI Growth Insights</span>
            </div>
            <h2 className="text-2xl font-bold mb-1">Top Partnership Match</h2>

            <div className="flex items-center gap-4 mt-4 mb-5">
              <div className={`h-14 w-14 rounded-2xl bg-gradient-to-br ${topPartner.gradient} grid place-items-center text-3xl shrink-0`}>{topPartner.icon}</div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xl font-bold">{topPartner.name}</span>
                  <span className="text-sm font-bold text-accent glass px-2.5 py-1 rounded-full border border-accent/30">{topPartner.match}% Match</span>
                </div>
                <p className="text-sm text-muted-foreground mt-0.5">{topPartner.reason}</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 mb-5">
              {[
                { label: "Expected installs", value: topPartner.installs },
                { label: "Audience overlap", value: topPartner.overlap },
                { label: "Trust score", value: topPartner.trustScore },
              ].map(s => (
                <div key={s.label} className="glass rounded-xl p-3 border border-border/40">
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{s.label}</p>
                  <p className="text-base font-bold mt-0.5">{s.value}</p>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-2">
              <Link to="/founder/matches">
                <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold glass border border-border/60 text-muted-foreground hover:text-foreground transition-colors">
                  View Match <ArrowRight className="h-4 w-4" />
                </motion.button>
              </Link>
              <Link to="/founder/pacts">
                <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white"
                  style={{ background: "linear-gradient(135deg, #6C5CE7, #00D4B8)", boxShadow: "0 0 20px -8px rgba(108,92,231,0.6)" }}>
                  <Zap className="h-4 w-4" /> Create Growth Pact
                </motion.button>
              </Link>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="shrink-0 space-y-2 min-w-[200px]">
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-3">Quick Actions</p>
            {[
              { icon: Brain, label: "Analyze My App", action: "analyze" },
              { icon: Zap, label: "Create Growth Pact", to: "/founder/pacts" },
              { icon: BarChart3, label: "View Audience Graph", to: "/founder/audience" },
            ].map(({ icon: Icon, label, to, action }: any) => (
              action === "analyze" ? (
                <motion.div key={label} whileHover={{ x: 4 }}
                  onClick={() => void runAnalysis()}
                  className={`flex items-center gap-3 glass rounded-xl px-4 py-2.5 border transition-colors cursor-pointer ${
                    isAnalyzing
                      ? "border-primary/50 bg-primary/15 opacity-80 pointer-events-none"
                      : "border-primary/30 bg-primary/10 hover:border-primary/50"
                  }`}>
                  {isAnalyzing ? (
                    <Loader2 className="h-4 w-4 text-primary shrink-0 animate-spin" />
                  ) : (
                    <Icon className="h-4 w-4 text-primary shrink-0" />
                  )}
                  <span className="text-sm font-medium text-primary">{isAnalyzing ? "Analyzing..." : label}</span>
                  <ArrowRight className="h-3.5 w-3.5 text-primary ml-auto" />
                </motion.div>
              ) : (
                <Link key={to} to={to}>
                  <motion.div whileHover={{ x: 4 }}
                    className="flex items-center gap-3 glass rounded-xl px-4 py-2.5 border border-border/40 hover:border-primary/30 transition-colors cursor-pointer">
                    <Icon className="h-4 w-4 text-primary shrink-0" />
                    <span className="text-sm font-medium">{label}</span>
                    <ArrowRight className="h-3.5 w-3.5 text-muted-foreground ml-auto" />
                  </motion.div>
                </Link>
              )
            ))}
          </div>
        </div>
      </motion.div>

      {/* Second row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* AI Recommendations */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="glass-strong rounded-2xl p-5 border border-border/60">
          <div className="flex items-center gap-2 mb-4">
            <Bot className="h-4 w-4 text-accent" />
            <h3 className="text-base font-semibold">Recent AI Recommendations</h3>
          </div>
          <div className="space-y-3">
            {RECS.map((r, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.25 + i * 0.06 }}
                className="flex items-start gap-3 glass rounded-xl p-3 border border-border/40 hover:border-primary/20 transition-colors cursor-pointer">
                <span className="text-base shrink-0">{r.icon}</span>
                <p className="text-sm text-muted-foreground">{r.text}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Launch Timeline */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
          className="glass-strong rounded-2xl p-5 border border-border/60">
          <div className="flex items-center gap-2 mb-4">
            <Rocket className="h-4 w-4 text-primary" />
            <h3 className="text-base font-semibold">Launch Timeline</h3>
          </div>
          <div className="relative space-y-0">
            {TIMELINE.map((step, i) => (
              <div key={step.label} className="flex gap-3 relative">
                {i < TIMELINE.length - 1 && (
                  <div className="absolute left-[13px] top-8 w-px h-full"
                    style={{ background: "linear-gradient(to bottom, rgba(108,92,231,0.4), rgba(0,212,184,0.1))" }} />
                )}
                <div className={`h-7 w-7 rounded-full grid place-items-center shrink-0 mt-1 z-10 ${step.done ? "bg-accent/20 border border-accent/40" : "bg-white/5 border border-border/40"}`}>
                  {step.done ? <CheckCircle2 className="h-3.5 w-3.5 text-accent" /> : <div className="h-2 w-2 rounded-full bg-border" />}
                </div>
                <div className="pb-4 flex-1">
                  <p className={`text-sm font-semibold ${step.done ? "text-foreground" : "text-muted-foreground"}`}>{step.label}</p>
                  <p className="text-xs text-muted-foreground">{step.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Growth Metrics */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
        className="glass-strong rounded-2xl p-5 border border-border/60">
        <div className="flex items-center gap-2 mb-5">
          <TrendingUp className="h-4 w-4 text-accent" />
          <h3 className="text-base font-semibold">Growth Metrics</h3>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Followers", value: "9,200", trend: "+18%", up: true },
            { label: "CTR", value: "4.7%", trend: "+0.8%", up: true },
            { label: "Expected Reach", value: "48,000", trend: "+32%", up: true },
            { label: "Growth Trend", value: "↑ Strong", trend: "Week 2", up: true },
          ].map((m, i) => (
            <motion.div key={m.label} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.35 + i * 0.06 }}
              className="glass rounded-2xl p-4 border border-border/40 text-center">
              <p className="text-xl font-bold">{m.value}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{m.label}</p>
              <p className={`text-xs font-semibold mt-1.5 ${m.up ? "text-accent" : "text-rose-400"}`}>{m.trend}</p>
              {/* mini sparkline */}
              <svg className="w-full mt-2 h-8" viewBox="0 0 60 24">
                <polyline points={[0,20,10,16,20,18,30,10,40,12,50,6,60,4].map((v,j)=> j%2===0?`${v},`:`${v} `).join("").trim()}
                  fill="none" stroke="#6C5CE7" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Recent Activity */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
        className="glass-strong rounded-2xl p-5 border border-border/60">
        <div className="flex items-center gap-2 mb-4">
          <Bell className="h-4 w-4 text-primary" />
          <h3 className="text-base font-semibold">Recent Activity</h3>
        </div>
        <div className="space-y-2">
          {ACTIVITY.map((a, i) => (
            <motion.div key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 + i * 0.05 }}
              className="flex items-center gap-4 glass rounded-xl p-3.5 border border-border/40">
              <div className="h-8 w-8 rounded-xl grid place-items-center text-base shrink-0"
                style={{ background: `${a.color}20`, border: `1px solid ${a.color}30` }}>
                {a.icon}
              </div>
              <p className="text-sm flex-1">{a.text}</p>
              <span className="text-xs text-muted-foreground shrink-0">{a.time}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* AI Analysis Modal */}
      <AnalysisModal
        open={analysisOpen}
        apiComplete={apiComplete}
        onComplete={() => {
          setAnalysisOpen(false);
          navigate({ to: "/founder/analysis" });
        }}
      />
    </div>
  );
}
