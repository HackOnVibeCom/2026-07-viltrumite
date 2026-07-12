import { Link, useLocation } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  LayoutDashboard, Brain, Globe, Handshake, Package,
  BarChart3, Bot, Settings, ChevronRight, Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV = [
  { icon: LayoutDashboard, label: "Dashboard", to: "/founder" },
  { icon: Brain, label: "AI Matches", to: "/founder/matches" },
  { icon: Globe, label: "Audience Graph", to: "/founder/audience" },
  { icon: Handshake, label: "Growth Pacts", to: "/founder/pacts" },
  { icon: Package, label: "Bundle Builder", to: "/founder/bundles" },
  { icon: BarChart3, label: "Analytics", to: "/founder/analytics" },
  { icon: Bot, label: "AI Copilot", to: "/founder/copilot" },
  { icon: Settings, label: "Settings", to: "/founder/settings" },
];

export function FounderSidebar() {
  const { pathname } = useLocation();

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 flex flex-col z-40 border-r border-border/60"
      style={{ background: "linear-gradient(180deg, #0d0d14 0%, #0a0a0f 100%)" }}>

      {/* Logo */}
      <div className="px-5 py-5 border-b border-border/40">
        <Link to="/founder" className="flex items-center gap-2.5">
          <div className="relative h-7 w-7">
            <div className="absolute inset-0 rounded-lg animated-gradient" />
            <div className="absolute inset-[3px] rounded-[5px] bg-background grid place-items-center">
              <Zap className="h-3 w-3 text-accent" />
            </div>
          </div>
          <div>
            <span className="text-sm font-bold tracking-tight">LaunchMesh</span>
            <span className="ml-2 text-[10px] bg-primary/20 text-primary border border-primary/30 px-1.5 py-0.5 rounded-full font-semibold">Founder</span>
          </div>
        </Link>
      </div>

      {/* App card */}
      <div className="mx-3 my-3 rounded-2xl p-3 border border-border/40 glass">
        <div className="flex items-center gap-2.5">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-violet-500 to-purple-700 grid place-items-center text-lg shrink-0">🎨</div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold truncate">DesignVault</p>
            <p className="text-[10px] text-muted-foreground">Design · Upcoming</p>
          </div>
        </div>
        <div className="mt-2.5">
          <div className="flex items-center justify-between text-[10px] text-muted-foreground mb-1">
            <span>AI Readiness</span>
            <span className="text-accent font-semibold">85%</span>
          </div>
          <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
            <motion.div initial={{ width: 0 }} animate={{ width: "85%" }} transition={{ duration: 1.2, delay: 0.3 }}
              className="h-full rounded-full animated-gradient" />
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-2 space-y-0.5 overflow-y-auto">
        {NAV.map(({ icon: Icon, label, to }) => {
          const active = pathname === to || (to !== "/founder" && pathname.startsWith(to));
          return (
            <Link key={to} to={to}>
              <motion.div whileHover={{ x: 4 }}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors",
                  active
                    ? "bg-primary/15 text-primary border border-primary/20"
                    : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                )}>
                <Icon className={cn("h-4 w-4 shrink-0", active && "text-primary")} />
                {label}
                {label === "AI Matches" && (
                  <span className="ml-auto text-[10px] bg-accent/20 text-accent border border-accent/30 px-1.5 py-0.5 rounded-full font-bold">3</span>
                )}
              </motion.div>
            </Link>
          );
        })}
      </nav>

      {/* Back to Explorer */}
      <div className="px-3 pb-4 border-t border-border/40 pt-3">
        <Link to="/explore">
          <motion.div whileHover={{ x: 3 }}
            className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm text-muted-foreground hover:text-foreground hover:bg-white/5 transition-colors">
            <div className="h-6 w-6 rounded-lg glass grid place-items-center">
              <ChevronRight className="h-3 w-3 rotate-180" />
            </div>
            Back to Explorer
          </motion.div>
        </Link>
      </div>
    </aside>
  );
}
