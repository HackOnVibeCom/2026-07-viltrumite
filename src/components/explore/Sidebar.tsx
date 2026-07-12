import { Link, useLocation } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  Home, Flame, Rocket, Heart, Tag, Trophy, Compass, Bell,
  Settings, HelpCircle, MessageSquare, User, ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useTheme } from "@/context/ThemeContext";

const NAV = [
  { icon: Home, label: "Discover", to: "/explore", key: "D" },
  { icon: Flame, label: "Trending", to: "/explore/trending", key: "T" },
  { icon: Rocket, label: "Upcoming", to: "/explore/upcoming", key: "U" },
  { icon: Heart, label: "Following", to: "/explore/following", key: "F" },
  { icon: Tag, label: "Categories", to: "/explore/categories", key: "C" },
  { icon: Trophy, label: "Top Launches", to: "/explore/top", key: "L" },
  { icon: Compass, label: "Explore", to: "/explore/browse", key: "E" },
  { icon: Bell, label: "Notifications", to: "/explore/notifications", key: "N" },
];

const BOTTOM = [
  { icon: Settings, label: "Settings", to: "/explore/settings" },
  { icon: HelpCircle, label: "Help", to: "/explore/help" },
  { icon: MessageSquare, label: "Feedback", to: "/explore/feedback" },
];

export function Sidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { pathname } = useLocation();
  const { theme } = useTheme();

  return (
    <aside className={cn("fixed left-0 top-0 h-screen w-64 flex flex-col z-40 border-r border-border/60 transition-transform duration-300 ease-in-out lg:translate-x-0",
      open ? "translate-x-0" : "-translate-x-full")}
      style={{ background: "var(--sidebar-bg, linear-gradient(180deg, #0d0d14 0%, #0a0a0f 100%))" }}>
      {/* Logo */}
      <div className="px-5 py-5 border-b border-border/40 flex items-center justify-between">
        <Link to="/explore" className="flex items-center gap-2.5">
          <div className="relative h-7 w-7">
            <div className="absolute inset-0 rounded-lg animated-gradient" />
            <div className="absolute inset-[3px] rounded-[5px] bg-background grid place-items-center">
              <div className="h-1.5 w-1.5 rounded-full bg-accent" />
            </div>
          </div>
          <span className="text-base font-bold tracking-tight">LaunchMesh</span>
        </Link>
        <button onClick={onClose} className="lg:hidden h-8 w-8 rounded-lg grid place-items-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Main nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {NAV.map(({ icon: Icon, label, to, key }) => {
          const active = pathname === to || (to !== "/explore" && pathname.startsWith(to));
          return (
            <Link key={to} to={to} className="block">
              <div
                className={cn(
                  "group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
                  active
                    ? (theme === "light"
                        ? "bg-primary/15 text-primary border border-primary/20"
                        : "bg-gradient-to-r from-[#9F7AEA] to-[#6366F1] text-white shadow-lg shadow-purple-900/30 border border-transparent")
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                )}>
                <Icon className={cn("h-4 w-4 shrink-0", active ? (theme === "light" ? "text-primary" : "text-white") : "text-muted-foreground")} />
                <span className="flex-1">{label}</span>
                {label === "Notifications" && (
                  <span className="h-2 w-2 rounded-full bg-accent animate-pulse mr-2" />
                )}
                <kbd className="hidden lg:inline-flex h-5 select-none items-center gap-1 rounded border border-border bg-muted/50 px-1.5 font-mono text-[9px] font-medium text-muted-foreground opacity-50 group-hover:opacity-100 transition-opacity">
                  {key}
                </kbd>
              </div>
            </Link>
          );
        })}

        {/* Divider */}
        <div className="my-3 border-t border-border/40" />

        {/* Founder CTA / Workspace Status */}
        <Link to="/founder" className="block mt-2">
          <div className="relative overflow-hidden rounded-2xl p-4 cursor-pointer bg-gradient-to-br from-primary/5 to-surface border border-border/50 hover:border-primary/40 shadow-sm transition-all duration-300">
            {/* Background scanline glow */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent -translate-x-full hover:animate-shimmer" />
            
            <div className="relative z-10 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[9px] font-bold text-primary uppercase tracking-wider">Console Workspace</span>
                <span className="text-[9px] text-muted-foreground font-medium">85% Ready</span>
              </div>
              <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-primary to-accent w-[85%] rounded-full" />
              </div>
              <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                <span>Deploy Status</span>
                <span className="text-emerald-400 font-semibold flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" /> Active
                </span>
              </div>
            </div>
          </div>
        </Link>
      </nav>

      {/* Bottom nav */}
      <div className="px-3 py-3 border-t border-border/40 space-y-0.5">
        {BOTTOM.map(({ icon: Icon, label, to }) => (
          <Link key={to} to={to} className="block">
            <div className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors duration-200">
              <Icon className="h-3.5 w-3.5 shrink-0" />
              {label}
            </div>
          </Link>
        ))}
      </div>

      {/* User profile row */}
      <div className="p-3 border-t border-border/40 bg-surface/50">
        <Link to="/explore/profile">
          <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-muted/70 transition-colors cursor-pointer group">
            <div className="relative h-9 w-9 shrink-0">
              <div className="h-full w-full rounded-full bg-gradient-to-br from-primary/30 to-accent/30 border border-border flex items-center justify-center font-bold text-sm text-foreground">
                U
              </div>
              <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-500 border-2 border-background" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-foreground truncate group-hover:text-primary transition-colors">You</p>
              <p className="text-[10px] text-muted-foreground truncate">pro_explorer</p>
            </div>
            <div className="text-[9px] bg-primary/20 text-primary border border-primary/20 rounded px-1 font-semibold uppercase tracking-wider">
              PRO
            </div>
          </div>
        </Link>
      </div>
    </aside>
  );
}
