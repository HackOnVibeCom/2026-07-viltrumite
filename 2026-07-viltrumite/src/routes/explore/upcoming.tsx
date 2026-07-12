import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Rocket, Bell } from "lucide-react";
import { Link } from "@tanstack/react-router";
import type { App } from "@/data/mock";
import { useLiveApps, useUpcomingApps } from "@/hooks/useMockDb";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/explore/upcoming")({
  component: UpcomingPage,
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

function LaunchCard({ app, index }: { app: App; index: number }) {
  const { d, h, m, s } = useCountdown(app.launchDate);
  const [notified, setNotified] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.08 }}
      whileHover={{ y: -4 }}
      className="glass-strong rounded-2xl overflow-hidden border border-border/60 hover:border-primary/30 transition-colors">
      <div className={`h-1.5 w-full bg-gradient-to-r ${app.gradient}`} />
      <div className="p-6">
        <div className="flex items-start gap-4 mb-5">
          <div className={`h-16 w-16 rounded-2xl bg-gradient-to-br ${app.gradient} grid place-items-center text-3xl shrink-0`}>
            {app.icon}
          </div>
          <div>
            <h3 className="text-lg font-bold">{app.name}</h3>
            <p className="text-sm text-muted-foreground">{app.tagline}</p>
            <div className="flex items-center gap-2 mt-1.5">
              <span className="text-xs glass px-2 py-0.5 rounded-full">{app.category}</span>
              <span className="text-xs text-muted-foreground">by {app.founder.name}</span>
            </div>
          </div>
        </div>

        {/* Countdown */}
        <div className="mb-5">
          <p className="text-xs text-muted-foreground mb-2 uppercase tracking-wider">Launches in</p>
          <div className="flex items-center gap-2">
            {[{ v: d, l: "Days" }, { v: h, l: "Hours" }, { v: m, l: "Min" }, { v: s, l: "Sec" }].map(({ v, l }, i) => (
              <div key={l} className="flex items-center gap-2">
                <div className="glass rounded-xl px-3 py-2 text-center min-w-[44px]">
                  <div className="text-lg font-bold tabular-nums">{String(v).padStart(2, "0")}</div>
                  <div className="text-[9px] text-muted-foreground">{l}</div>
                </div>
                {i < 3 && <span className="text-muted-foreground font-bold">:</span>}
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
            onClick={() => setNotified(!notified)}
            className={cn("flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all",
              notified ? "bg-accent/20 text-accent border border-accent/30" : "bg-primary text-white shadow-glow")}>
            <Bell className="h-4 w-4" />
            {notified ? "Notified ✓" : "Notify Me"}
          </motion.button>
          <Link to={`/explore/app/${app.id}`}>
            <motion.button whileHover={{ scale: 1.03 }}
              className="px-4 py-2.5 rounded-xl text-sm glass border border-border/60 text-muted-foreground hover:text-foreground transition-colors">
              Preview
            </motion.button>
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

function UpcomingPage() {
  const { data: upcoming = [] } = useUpcomingApps();
  const { data: live = [] } = useLiveApps();

  return (
    <div className="p-6 md:p-8 max-w-6xl">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="h-10 w-10 rounded-2xl bg-primary/20 grid place-items-center">
            <Rocket className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Upcoming Launches</h1>
            <p className="text-sm text-muted-foreground">Apps launching soon — be first to know</p>
          </div>
        </div>
      </motion.div>

      <div className="mb-8">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">Launching Soon</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {upcoming.map((app, i) => <LaunchCard key={app.id} app={app} index={i} />)}
        </div>
      </div>

      <div>
        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">Recently Launched</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {live.map((app, i) => (
            <Link key={app.id} to={`/explore/app/${app.id}`}>
              <motion.div whileHover={{ y: -3 }} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                className="flex items-center gap-4 glass-strong rounded-2xl p-4 border border-border/60 hover:border-emerald-500/30 transition-colors">
                <div className={`h-12 w-12 rounded-xl bg-gradient-to-br ${app.gradient} grid place-items-center text-xl shrink-0`}>{app.icon}</div>
                <div>
                  <p className="font-semibold text-sm">{app.name}</p>
                  <p className="text-xs text-muted-foreground">{app.tagline}</p>
                  <span className="text-xs text-emerald-400 font-semibold">● Live</span>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
