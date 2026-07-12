import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { BarChart3, TrendingUp, Users, Zap, Eye } from "lucide-react";
import { useAnalysis } from "@/context/AnalysisContext";
import { useAppProfile } from "@/context/AppProfileContext";
import { MOCK_ANALYSIS } from "@/data/analysisData";

export const Route = createFileRoute("/founder/analytics")({
  component: AnalyticsPage,
});

function MiniBar({ value, max, day, i }: { value: number; max: number; day: string; i: number }) {
  return (
    <div className="flex flex-col items-center gap-1.5 flex-1">
      <span className="text-[10px] text-muted-foreground">{value}</span>
      <div className="w-full rounded-t-lg overflow-hidden flex flex-col justify-end" style={{ height: 80 }}>
        <motion.div
          initial={{ height: 0 }}
          animate={{ height: `${(value / max) * 100}%` }}
          transition={{ duration: 0.8, delay: i * 0.07, ease: "easeOut" }}
          className="w-full rounded-t-lg"
          style={{ background: "linear-gradient(to top, #6C5CE7, #00D4B8)" }}
        />
      </div>
      <span className="text-[10px] text-muted-foreground">{day}</span>
    </div>
  );
}

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function AnalyticsPage() {
  const { result } = useAnalysis();
  const { profile } = useAppProfile();

  const display = result ?? MOCK_ANALYSIS;
  const parsedInstalls = parseInt(display.expectedInstalls.replace(/\D/g, "")) || 450;

  const followers = Math.round(parsedInstalls * 7.4);
  const views = Math.round(parsedInstalls * 20);
  const weeklyGrowth = Math.round(parsedInstalls * 0.27);
  const pactInstalls = parsedInstalls;

  const WEEK_DATA = [
    Math.round(parsedInstalls * 0.08),
    Math.round(parsedInstalls * 0.12),
    Math.round(parsedInstalls * 0.1),
    Math.round(parsedInstalls * 0.15),
    Math.round(parsedInstalls * 0.13),
    Math.round(parsedInstalls * 0.19),
    Math.round(parsedInstalls * 0.23)
  ];
  
  const max = Math.max(...WEEK_DATA);

  const stats = [
    { icon: Users, label: "Total Followers", value: profile ? followers.toLocaleString() : "0", change: "+18%", color: "#6C5CE7" },
    { icon: Eye, label: "Profile Views", value: profile ? views.toLocaleString() : "0", change: "+32%", color: "#00D4B8" },
    { icon: TrendingUp, label: "Weekly Growth", value: profile ? `+${weeklyGrowth}` : "0", change: "+12%", color: "#F59E0B" },
    { icon: Zap, label: "Pact Installs", value: profile ? `+${pactInstalls.toLocaleString()}` : "0", change: "+67%", color: "#EC4899" },
  ];

  const funnel = [
    { label: "Profile Views", value: views, pct: 100, color: "#6C5CE7" },
    { label: "Clicked Notify Me", value: Math.round(parsedInstalls * 7), pct: 35, color: "#8B7CF6" },
    { label: "Followed", value: Math.round(parsedInstalls * 3.4), pct: 17, color: "#00D4B8" },
    { label: "Installed", value: parsedInstalls, pct: 5, color: "#00B8A0" },
  ];

  return (
    <div className="p-6 md:p-8 max-w-5xl">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-2xl bg-primary/20 grid place-items-center">
            <BarChart3 className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Analytics</h1>
            <p className="text-sm text-muted-foreground">Your growth performance at a glance</p>
          </div>
        </div>
      </motion.div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {stats.map((s, i) => (
          <motion.div key={s.label}
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
            whileHover={{ y: -3 }}
            className="glass-strong rounded-2xl p-5 border border-border/60">
            <div className="h-9 w-9 rounded-xl mb-3 grid place-items-center" style={{ background: `${s.color}20` }}>
              <s.icon className="h-4 w-4" style={{ color: s.color }} />
            </div>
            <p className="text-xl font-bold">{s.value}</p>
            <p className="text-xs text-muted-foreground">{s.label}</p>
            <p className="text-xs text-accent font-semibold mt-1">{s.change} this week</p>
          </motion.div>
        ))}
      </div>

      {/* Bar chart */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
        className="glass-strong rounded-2xl border border-border/60 p-6 mb-6">
        <h3 className="text-base font-semibold mb-5">Weekly Installs</h3>
        <div className="flex items-end gap-2">
          {WEEK_DATA.map((v, i) => <MiniBar key={i} value={v} max={max} day={DAYS[i]} i={i} />)}
        </div>
      </motion.div>

      {/* Funnel */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
        className="glass-strong rounded-2xl border border-border/60 p-6">
        <h3 className="text-base font-semibold mb-5">Conversion Funnel</h3>
        <div className="space-y-3">
          {funnel.map((f, i) => (
            <div key={f.label} className="space-y-1">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">{f.label}</span>
                <span className="font-semibold">{profile ? f.value.toLocaleString() : "0"} <span className="text-muted-foreground text-xs">({profile ? f.pct : 0}%)</span></span>
              </div>
              <div className="h-2 w-full rounded-full bg-white/5 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${profile ? f.pct : 0}%` }}
                  transition={{ duration: 1, delay: 0.35 + i * 0.1 }}
                  className="h-full rounded-full"
                  style={{ background: f.color }}
                />
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
