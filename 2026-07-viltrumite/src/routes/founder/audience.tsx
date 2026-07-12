import { createFileRoute } from "@tanstack/react-router";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Globe, Users } from "lucide-react";

export const Route = createFileRoute("/founder/audience")({
  component: AudiencePage,
});

const SEGMENTS = [
  { label: "Students", pct: 92, color: "#6C5CE7", count: "8,464" },
  { label: "Developers", pct: 84, color: "#00D4B8", count: "7,728" },
  { label: "Founders", pct: 71, color: "#F59E0B", count: "6,532" },
  { label: "Designers", pct: 68, color: "#EC4899", count: "6,256" },
  { label: "Product Managers", pct: 54, color: "#8B5CF6", count: "4,968" },
  { label: "Marketers", pct: 41, color: "#06B6D4", count: "3,772" },
];

const PEAK_HOURS = [8, 22, 35, 28, 45, 62, 88, 95, 78, 55, 40, 30, 25, 35, 48, 62, 75, 90, 95, 88, 72, 58, 42, 18];

function AudiencePage() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const max = Math.max(...PEAK_HOURS);

  return (
    <div className="p-6 md:p-8 max-w-5xl">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-2xl bg-accent/20 grid place-items-center">
            <Globe className="h-5 w-5 text-accent" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Audience Graph</h1>
            <p className="text-sm text-muted-foreground">Who your app reaches and when</p>
          </div>
        </div>
      </motion.div>

      {/* Audience segments */}
      <motion.div ref={ref} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="glass-strong rounded-2xl border border-border/60 p-6 mb-6">
        <div className="flex items-center gap-2 mb-5">
          <Users className="h-4 w-4 text-primary" />
          <h3 className="text-base font-semibold">Audience Segments</h3>
          <span className="ml-auto text-xs text-muted-foreground">Total: 9,200 followers</span>
        </div>
        <div className="space-y-4">
          {SEGMENTS.map((s, i) => (
            <div key={s.label} className="space-y-1.5">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="h-2.5 w-2.5 rounded-full" style={{ background: s.color }} />
                  <span className="text-muted-foreground">{s.label}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-muted-foreground">{s.count}</span>
                  <span className="font-semibold w-10 text-right">{s.pct}%</span>
                </div>
              </div>
              <div className="h-2.5 w-full rounded-full bg-white/5 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={inView ? { width: `${s.pct}%` } : {}}
                  transition={{ duration: 1, delay: i * 0.1, ease: "easeOut" }}
                  className="h-full rounded-full"
                  style={{ background: `linear-gradient(90deg, ${s.color}, ${s.color}99)` }}
                />
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Peak activity hours */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
        className="glass-strong rounded-2xl border border-border/60 p-6 mb-6">
        <h3 className="text-base font-semibold mb-5">Peak Activity Hours</h3>
        <div className="flex items-end gap-1 h-24">
          {PEAK_HOURS.map((v, i) => (
            <motion.div key={i}
              initial={{ height: 0 }}
              animate={{ height: `${(v / max) * 100}%` }}
              transition={{ duration: 0.6, delay: i * 0.03 }}
              className="flex-1 rounded-t-sm"
              style={{ background: `linear-gradient(to top, #6C5CE7, #00D4B8)`, opacity: v > 70 ? 1 : 0.4 }}
              title={`${i}:00 — ${v} active`}
            />
          ))}
        </div>
        <div className="flex justify-between text-[10px] text-muted-foreground mt-1.5">
          <span>12am</span><span>6am</span><span>12pm</span><span>6pm</span><span>11pm</span>
        </div>
        <p className="text-xs text-muted-foreground mt-3">
          Peak activity: <span className="text-foreground font-medium">9–11pm</span> — ideal time for launch announcements
        </p>
      </motion.div>

      {/* Overlap with top partners */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
        className="glass-strong rounded-2xl border border-border/60 p-6">
        <h3 className="text-base font-semibold mb-4">Audience Overlap with Top Partners</h3>
        <div className="space-y-3">
          {[
            { name: "StudyFlow", overlap: 92, icon: "📚" },
            { name: "FocusFlow", overlap: 76, icon: "⚡" },
            { name: "MindMap AI", overlap: 69, icon: "🧠" },
          ].map((p, i) => (
            <div key={p.name} className="flex items-center gap-4">
              <span className="text-xl">{p.icon}</span>
              <div className="flex-1">
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium">{p.name}</span>
                  <span className="text-accent font-bold">{p.overlap}% overlap</span>
                </div>
                <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${p.overlap}%` }}
                    transition={{ duration: 1, delay: 0.35 + i * 0.1 }}
                    className="h-full rounded-full animated-gradient"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
