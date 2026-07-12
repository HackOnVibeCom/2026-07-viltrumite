import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Bell, Sparkles, TrendingUp, Zap } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { APPS, CATEGORIES, COLLECTIONS } from "@/data/mock";
import { AppCard } from "@/components/explore/AppCard";
import { cn } from "@/lib/utils";
import { useTheme } from "@/context/ThemeContext";

export const Route = createFileRoute("/explore/")({
  component: DiscoverPage,
});

function useCountdown(target: string) {
  const [tick, setTick] = useState(0);
  useEffect(() => { const t = setInterval(() => setTick(x => x + 1), 1000); return () => clearInterval(t); }, []);
  const diff = Math.max(0, new Date(target).getTime() - Date.now());
  return {
    d: Math.floor(diff / 86400000),
    h: Math.floor((diff % 86400000) / 3600000),
    m: Math.floor((diff % 3600000) / 60000),
    s: Math.floor((diff % 60000) / 1000),
  };
}

function CountDown({ target }: { target: string }) {
  const { d, h, m, s } = useCountdown(target);
  const units = [{ v: d, l: "Days" }, { v: h, l: "Hours" }, { v: m, l: "Min" }, { v: s, l: "Sec" }];
  return (
    <div className="flex items-center gap-2">
      {units.map(({ v, l }, i) => (
        <div key={l} className="flex items-center gap-2">
          <div className="bg-white rounded-xl px-3 py-2 min-w-[48px] text-center shadow-sm">
            <div className="text-xl font-bold tabular-nums text-slate-900">{String(v).padStart(2, "0")}</div>
            <div className="text-[9px] uppercase tracking-widest text-slate-500">{l}</div>
          </div>
          {i < 3 && <span className="text-white/80 font-bold text-lg">:</span>}
        </div>
      ))}
    </div>
  );
}

function HeroBanner() {
  const featured = APPS[6]; // DesignVault
  const [notified, setNotified] = useState(false);
  const [followed, setFollowed] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
      className="relative rounded-3xl overflow-hidden border border-border/60 shadow-lg min-h-[340px] flex flex-col justify-end">

      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-500 opacity-100" />
      <div className="absolute inset-0 bg-white/5" />
      <div className="absolute inset-0 grid-bg opacity-15" />

      {/* Floating orbs */}
      <div className="absolute top-8 right-8 h-48 w-48 rounded-full opacity-35 blur-3xl animate-float-slow"
        style={{ background: "radial-gradient(circle, #60A5FA, transparent 70%)" }} />
      <div className="absolute top-16 right-32 h-24 w-24 rounded-full opacity-20 blur-2xl"
        style={{ background: "radial-gradient(circle, #C084FC, transparent 70%)" }} />

      {/* App icon top right */}
      <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.4 }}
        className="absolute top-6 right-6 h-20 w-20 rounded-3xl shadow-lg grid place-items-center text-4xl"
        style={{ background: "linear-gradient(135deg, rgba(255, 255, 255, 0.25), rgba(255, 255, 255, 0.15))", border: "1px solid rgba(255, 255, 255, 0.3)" }}>
        {featured.icon}
      </motion.div>

      {/* Content */}
      <div className="relative p-6 md:p-8 z-10">
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <div className="flex items-center gap-1.5 border rounded-full px-2.5 py-1 bg-white text-blue-600 border-white/20 shadow-sm">
            <Sparkles className="h-3.5 w-3.5 text-blue-600" />
            <span className="text-xs font-semibold">Today's Featured Launch</span>
          </div>
          <span className="text-xs bg-white/20 border border-white/20 px-2.5 py-1 rounded-full text-white/95 font-medium">{featured.category}</span>
          <span className="text-xs bg-white/20 border border-white/20 px-2.5 py-1 rounded-full text-white/95 font-semibold">Upcoming</span>
        </div>

        <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white mb-1">{featured.name}</h2>
        <p className="text-white/90 text-base max-w-xl mb-5">{featured.tagline}</p>

        <div className="flex flex-wrap items-center gap-4 mb-6">
          <div>
            <p className="text-xs text-white/80 mb-1">Launches in</p>
            <CountDown target={featured.launchDate} />
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
            onClick={() => setNotified(!notified)}
            className={cn("flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all shadow-md",
              notified ? "bg-white text-blue-600" : "bg-slate-900 text-white hover:bg-slate-800"
            )}>
            <Bell className="h-4 w-4" />
            {notified ? "Notified ✓" : "Notify Me"}
          </motion.button>
          <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
            onClick={() => setFollowed(!followed)}
            className={cn("flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold border transition-all",
              followed ? "bg-white/25 border-white/40 text-white" : "bg-white/10 border-white/20 text-white/90 hover:bg-white/20"
            )}>
            {followed ? "Following ✓" : "Follow"}
          </motion.button>
          <Link to={`/explore/app/${featured.id}`}>
            <motion.button whileHover={{ scale: 1.04 }}
              className="flex items-center gap-1.5 text-sm text-white/70 hover:text-white transition-colors">
              View details <ArrowRight className="h-3.5 w-3.5" />
            </motion.button>
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

function CategoryChips({ active, onSelect }: { active: string; onSelect: (id: string) => void }) {
  return (
    <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none bg-muted/40 p-1.5 rounded-xl border border-border/30 max-w-max">
      <button onClick={() => onSelect("all")}
        className={cn("text-xs px-3.5 py-1.5 rounded-lg transition-all font-semibold",
          active === "all" ? "bg-primary text-white shadow-sm" : "text-muted-foreground hover:text-foreground hover:bg-muted/50")}>
        All
      </button>
      {CATEGORIES.map(c => (
        <button key={c.id} onClick={() => onSelect(c.id)}
          className={cn("text-xs px-3.5 py-1.5 rounded-lg transition-all flex items-center gap-1.5 font-semibold",
            active === c.id ? "bg-primary text-white shadow-sm" : "text-muted-foreground hover:text-foreground hover:bg-muted/50")}>
          <span>{c.icon}</span> {c.label}
        </button>
      ))}
    </div>
  );
}

function UpcomingTimeline() {
  const upcoming = APPS.filter(a => a.status === "upcoming");
  const sections = [
    { label: "Tomorrow", apps: upcoming.slice(0, 1) },
    { label: "This Week", apps: upcoming.slice(1, 3) },
    { label: "Next Week", apps: upcoming.slice(3) },
  ];

  return (
    <div className="space-y-6 relative pl-4 border-l border-border/50">
      {sections.map((section, si) => (
        <div key={section.label} className="relative">
          {/* Vertical timeline node dot */}
          <span className="absolute -left-[21px] top-1.5 h-3.5 w-3.5 rounded-full bg-background border-2 border-primary flex items-center justify-center">
            <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
          </span>

          <div className="flex items-center gap-3 mb-3">
            <span className="text-xs font-bold uppercase tracking-widest text-primary bg-primary/10 border border-primary/25 px-3 py-1 rounded-full">{section.label}</span>
            <div className="h-px flex-1 bg-border/40" />
          </div>
          <div className="space-y-2.5">
            {section.apps.map((app, i) => (
              <Link key={app.id} to={`/explore/app/${app.id}`} className="group block">
                <div className="flex items-center gap-4 bg-card/45 hover:bg-card/70 rounded-2xl p-4 border border-border/60 hover:border-primary/30 transition-all duration-300">
                  <div className={`h-11 w-11 rounded-xl bg-gradient-to-br ${app.gradient} grid place-items-center text-xl shrink-0 shadow-sm`}>{app.icon}</div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm text-foreground group-hover:text-primary transition-colors">{app.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{app.tagline}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-xs text-accent font-semibold">Launching {new Date(app.launchDate).toLocaleDateString("en", { month: "short", day: "numeric" })}</p>
                    <p className="text-[10px] text-muted-foreground uppercase font-semibold mt-0.5">{app.category}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function LaunchVelocityChart() {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-border/60 bg-card/45 p-5 dot-bg space-y-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">Ecosystem Velocity</p>
          <h3 className="text-xl font-bold tracking-tight mt-0.5">+48.2%</h3>
        </div>
        <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full font-bold">LIVE METRIC</span>
      </div>
      
      {/* SVG Chart */}
      <div className="h-32 w-full relative">
        <svg className="w-full h-full overflow-visible" viewBox="0 0 300 120">
          <defs>
            <linearGradient id="chart-grad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--color-primary)" stopOpacity="0.25" />
              <stop offset="100%" stopColor="var(--color-primary)" stopOpacity="0" />
            </linearGradient>
          </defs>
          
          {/* Grid lines */}
          <line x1="0" y1="30" x2="300" y2="30" stroke="var(--color-border)" strokeWidth="0.5" strokeDasharray="3 3" />
          <line x1="0" y1="60" x2="300" y2="60" stroke="var(--color-border)" strokeWidth="0.5" strokeDasharray="3 3" />
          <line x1="0" y1="90" x2="300" y2="90" stroke="var(--color-border)" strokeWidth="0.5" strokeDasharray="3 3" />
          
          {/* Area fill */}
          <path
            d="M 0 120 L 0 90 Q 50 110, 100 70 T 200 40 T 300 10 L 300 120 Z"
            fill="url(#chart-grad)"
          />
          
          <path
            d="M 0 90 Q 50 110, 100 70 T 200 40 T 300 10"
            fill="none"
            stroke="var(--color-primary)"
            strokeWidth="2.5"
            className="animate-line-draw"
          />
          
          {/* Glowing node point at the end */}
          <circle cx="300" cy="10" r="4" fill="var(--color-accent)" className="animate-ping" />
          <circle cx="300" cy="10" r="3" fill="var(--color-accent)" />
        </svg>
      </div>

      <div className="grid grid-cols-3 gap-2 border-t border-border/40 pt-3 text-center">
        <div>
          <p className="text-[9px] text-muted-foreground font-semibold uppercase">Hourly Upvotes</p>
          <p className="text-xs font-bold text-foreground">1,208</p>
        </div>
        <div>
          <p className="text-[9px] text-muted-foreground font-semibold uppercase">Daily Visits</p>
          <p className="text-xs font-bold text-foreground">18.4k</p>
        </div>
        <div>
          <p className="text-[9px] text-muted-foreground font-semibold uppercase">Global Index</p>
          <p className="text-xs font-bold text-foreground">1,402</p>
        </div>
      </div>
    </div>
  );
}

const ACTIVITIES = [
  { id: 1, user: "Elena", action: "upvoted", target: "DesignVault", time: "2s ago" },
  { id: 2, user: "Marcus", action: "followed", target: "NoteMind", time: "15s ago" },
  { id: 3, user: "Anya", action: "added feedback on", target: "FocusFlow", time: "1m ago" },
  { id: 4, user: "Devon", action: "subscribed to", target: "Budgetly", time: "3m ago" },
  { id: 5, user: "Siddharth", action: "upvoted", target: "DesignVault", time: "5m ago" },
];

function LiveActivityFeed() {
  const [feed, setFeed] = useState(ACTIVITIES);

  useEffect(() => {
    const interval = setInterval(() => {
      setFeed((prev) => {
        const next = [...prev];
        const first = next.shift();
        if (first) {
          next.push({
            ...first,
            time: "1s ago",
          });
        }
        return next;
      });
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="rounded-2xl border border-border/60 bg-card/45 p-5 dot-bg space-y-4 shadow-sm">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Community Activity</h3>
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
      </div>

      <div className="space-y-2 max-h-[160px] overflow-hidden relative">
        {feed.slice(0, 4).map((act, i) => (
          <motion.div
            key={act.id + "-" + i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="flex items-center justify-between text-xs p-2 rounded-xl bg-muted/30 border border-border/20"
          >
            <div className="flex items-center gap-2 min-w-0">
              <div className="h-5 w-5 rounded-full bg-gradient-to-br from-primary/30 to-accent/30 flex items-center justify-center font-bold text-[9px] text-foreground shrink-0 uppercase">
                {act.user[0]}
              </div>
              <p className="truncate text-muted-foreground">
                <span className="font-semibold text-foreground">{act.user}</span> {act.action}{" "}
                <span className="font-semibold text-primary">{act.target}</span>
              </p>
            </div>
            <span className="text-[10px] text-muted-foreground shrink-0 pl-2">{act.time}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function FeaturedCollections() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
      {COLLECTIONS.map((col, i) => (
        <motion.div key={col.id}
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
          whileHover={{ y: -4 }}
          className="relative overflow-hidden rounded-2xl p-4 cursor-pointer border border-border/60 hover:border-primary/30 transition-colors duration-300"
          style={{ background: "var(--card-gradient-bg, linear-gradient(135deg, rgba(255,255,255,0.04), rgba(255,255,255,0.01)))" }}>
          <div className={`absolute inset-0 bg-gradient-to-br ${col.gradient} opacity-10`} />
          <div className="relative">
            <span className="text-2xl">{col.icon}</span>
            <p className="text-sm font-semibold mt-2 text-foreground">{col.label}</p>
            <p className="text-xs text-muted-foreground">{col.count} apps</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

export function DiscoverPage() {
  const [activeCategory, setActiveCategory] = useState("all");

  const filteredApps = activeCategory === "all"
    ? APPS
    : APPS.filter(a => a.category.toLowerCase().replace(/\s+/g, "") === activeCategory.replace(/\s+/g, ""));

  return (
    <div className="p-6 md:p-8 space-y-10 max-w-7xl mx-auto">
      {/* Hero */}
      <HeroBanner />

      {/* Trending Section */}
      <section className="space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-accent animate-pulse" />
            <h2 className="text-xl font-bold tracking-tight">Trending Launches</h2>
          </div>
          <CategoryChips active={activeCategory} onSelect={setActiveCategory} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredApps.slice(0, 6).map((app, i) => (
            <AppCard key={app.id} app={app} index={i} />
          ))}
        </div>
      </section>

      {/* Timeline & Live Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-4">
        {/* Left Column: Timeline (span 2) */}
        <section className="lg:col-span-2 space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-bold tracking-tight">Upcoming Launches</h2>
            </div>
            <Link to="/explore/upcoming" className="text-xs text-primary hover:underline flex items-center gap-1 font-semibold">
              See all <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <UpcomingTimeline />
        </section>

        {/* Right Column: Velocity & Activity (span 1) */}
        <section className="space-y-6">
          <div className="space-y-0.5">
            <h2 className="text-xl font-bold tracking-tight">Live Insights</h2>
            <p className="text-xs text-muted-foreground">Real-time upvotes and velocity</p>
          </div>
          <LaunchVelocityChart />
          <LiveActivityFeed />
        </section>
      </div>

      {/* Collections */}
      <section className="pt-2">
        <div className="flex items-center gap-2 mb-5">
          <Sparkles className="h-5 w-5 text-accent" />
          <h2 className="text-xl font-bold tracking-tight">Curated Collections</h2>
        </div>
        <FeaturedCollections />
      </section>
    </div>
  );
}
