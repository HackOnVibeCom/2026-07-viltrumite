import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Bell, Sparkles, TrendingUp, Zap } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { APPS, CATEGORIES, COLLECTIONS } from "@/data/mock";
import { AppCard } from "@/components/explore/AppCard";
import { cn } from "@/lib/utils";

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
          <div className="glass-strong rounded-xl px-3 py-2 min-w-[48px] text-center">
            <div className="text-xl font-bold tabular-nums">{String(v).padStart(2, "0")}</div>
            <div className="text-[9px] uppercase tracking-widest text-muted-foreground">{l}</div>
          </div>
          {i < 3 && <span className="text-muted-foreground font-bold text-lg">:</span>}
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
      className="relative rounded-3xl overflow-hidden border border-border/60 shadow-elevated min-h-[340px] flex flex-col justify-end">

      {/* Background */}
      <div className={`absolute inset-0 bg-gradient-to-br ${featured.gradient} opacity-20`} />
      <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(10,10,15,0.95) 40%, rgba(10,10,15,0.4) 100%)" }} />
      <div className="absolute inset-0 grid-bg opacity-20" />

      {/* Floating orbs */}
      <div className="absolute top-8 right-8 h-48 w-48 rounded-full opacity-30 blur-3xl animate-float-slow"
        style={{ background: `radial-gradient(circle, ${featured.accent}, transparent 70%)` }} />
      <div className="absolute top-16 right-32 h-24 w-24 rounded-full opacity-20 blur-2xl"
        style={{ background: `radial-gradient(circle, ${featured.accent}, transparent 70%)` }} />

      {/* Badge */}
      <div className="absolute top-6 left-6">
        <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}
          className="flex items-center gap-2 glass-strong rounded-full px-3 py-1.5">
          <Sparkles className="h-3.5 w-3.5 text-accent" />
          <span className="text-xs font-semibold text-accent">Today's Featured Launch</span>
        </motion.div>
      </div>

      {/* App icon top right */}
      <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.4 }}
        className="absolute top-6 right-6 h-20 w-20 rounded-3xl shadow-elevated grid place-items-center text-4xl"
        style={{ background: `linear-gradient(135deg, ${featured.accent}40, ${featured.accent}20)`, border: `1px solid ${featured.accent}40` }}>
        {featured.icon}
      </motion.div>

      {/* Content */}
      <div className="relative p-6 md:p-8">
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span className="text-xs glass px-2.5 py-1 rounded-full text-muted-foreground">{featured.category}</span>
          <span className="text-xs bg-primary/20 text-primary border border-primary/30 px-2.5 py-1 rounded-full font-semibold">Upcoming</span>
        </div>

        <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white mb-1">{featured.name}</h2>
        <p className="text-muted-foreground text-base max-w-xl mb-5">{featured.tagline}</p>

        <div className="flex flex-wrap items-center gap-4 mb-6">
          <div>
            <p className="text-xs text-muted-foreground mb-1">Launches in</p>
            <CountDown target={featured.launchDate} />
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
            onClick={() => setNotified(!notified)}
            className={cn("flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all",
              notified ? "bg-accent text-background" : "bg-primary text-white shadow-glow hover:brightness-110")}>
            <Bell className="h-4 w-4" />
            {notified ? "Notified ✓" : "Notify Me"}
          </motion.button>
          <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
            onClick={() => setFollowed(!followed)}
            className={cn("flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold border transition-all",
              followed ? "bg-white/10 border-white/20 text-white" : "glass border-border/60 text-muted-foreground hover:text-foreground")}>
            {followed ? "Following ✓" : "Follow"}
          </motion.button>
          <Link to={`/explore/app/${featured.id}`}>
            <motion.button whileHover={{ scale: 1.04 }}
              className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
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
    <div className="flex items-center gap-2 flex-wrap">
      <button onClick={() => onSelect("all")}
        className={cn("text-sm px-4 py-2 rounded-full border transition-all font-medium",
          active === "all" ? "bg-primary text-white border-primary" : "glass border-border/60 text-muted-foreground hover:text-foreground")}>
        All
      </button>
      {CATEGORIES.map(c => (
        <button key={c.id} onClick={() => onSelect(c.id)}
          className={cn("text-sm px-4 py-2 rounded-full border transition-all flex items-center gap-1.5",
            active === c.id ? "bg-primary/20 text-primary border-primary/40" : "glass border-border/60 text-muted-foreground hover:text-foreground")}>
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
    <div className="space-y-6">
      {sections.map((section, si) => (
        <div key={section.label}>
          <div className="flex items-center gap-3 mb-3">
            <div className="h-px flex-1 bg-border/60" />
            <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground glass px-3 py-1 rounded-full">{section.label}</span>
            <div className="h-px flex-1 bg-border/60" />
          </div>
          <div className="space-y-2.5">
            {section.apps.map((app, i) => (
              <Link key={app.id} to={`/explore/app/${app.id}`}>
                <motion.div whileHover={{ x: 4 }}
                  className="flex items-center gap-4 glass-strong rounded-2xl p-4 border border-border/60 hover:border-primary/30 transition-colors">
                  <div className={`h-11 w-11 rounded-xl bg-gradient-to-br ${app.gradient} grid place-items-center text-xl shrink-0`}>{app.icon}</div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm">{app.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{app.tagline}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-xs text-accent font-semibold">Launching {new Date(app.launchDate).toLocaleDateString("en", { month: "short", day: "numeric" })}</p>
                    <p className="text-xs text-muted-foreground">{app.category}</p>
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function FeaturedCollections() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
      {COLLECTIONS.map((col, i) => (
        <motion.div key={col.id}
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
          whileHover={{ y: -4, scale: 1.02 }}
          className="relative overflow-hidden rounded-2xl p-4 cursor-pointer border border-border/60 hover:border-primary/30 transition-colors"
          style={{ background: "linear-gradient(135deg, rgba(255,255,255,0.04), rgba(255,255,255,0.01))" }}>
          <div className={`absolute inset-0 bg-gradient-to-br ${col.gradient} opacity-10`} />
          <div className="relative">
            <span className="text-2xl">{col.icon}</span>
            <p className="text-sm font-semibold mt-2">{col.label}</p>
            <p className="text-xs text-muted-foreground">{col.count} apps</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

function DiscoverPage() {
  const [activeCategory, setActiveCategory] = useState("all");

  const filteredApps = activeCategory === "all"
    ? APPS
    : APPS.filter(a => a.category.toLowerCase().replace(/\s+/g, "") === activeCategory.replace(/\s+/g, ""));

  return (
    <div className="p-6 md:p-8 space-y-10 max-w-6xl">
      {/* Hero */}
      <HeroBanner />

      {/* Trending */}
      <section>
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-accent" />
            <h2 className="text-xl font-bold">Trending Apps</h2>
          </div>
          <Link to="/explore/trending" className="text-sm text-primary hover:text-primary/80 transition-colors flex items-center gap-1">
            See all <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {/* Category filter */}
        <div className="mb-5 overflow-x-auto pb-1">
          <CategoryChips active={activeCategory} onSelect={setActiveCategory} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredApps.slice(0, 6).map((app, i) => (
            <AppCard key={app.id} app={app} index={i} />
          ))}
        </div>
      </section>

      {/* Upcoming */}
      <section>
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-bold">Upcoming Launches</h2>
          </div>
          <Link to="/explore/upcoming" className="text-sm text-primary hover:text-primary/80 transition-colors flex items-center gap-1">
            See all <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
        <UpcomingTimeline />
      </section>

      {/* Collections */}
      <section>
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-accent" />
            <h2 className="text-xl font-bold">Featured Collections</h2>
          </div>
        </div>
        <FeaturedCollections />
      </section>
    </div>
  );
}
