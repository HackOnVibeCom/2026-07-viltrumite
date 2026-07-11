import { Link, useLocation } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  Home, Flame, Rocket, Heart, Tag, Trophy, Compass, Bell,
  Settings, HelpCircle, MessageSquare, User, ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV = [
  { icon: Home, label: "Discover", to: "/explore" },
  { icon: Flame, label: "Trending", to: "/explore/trending" },
  { icon: Rocket, label: "Upcoming", to: "/explore/upcoming" },
  { icon: Heart, label: "Following", to: "/explore/following" },
  { icon: Tag, label: "Categories", to: "/explore/categories" },
  { icon: Trophy, label: "Top Launches", to: "/explore/top" },
  { icon: Compass, label: "Explore", to: "/explore/browse" },
  { icon: Bell, label: "Notifications", to: "/explore/notifications" },
];

const BOTTOM = [
  { icon: Settings, label: "Settings", to: "/explore/settings" },
  { icon: HelpCircle, label: "Help", to: "/explore/help" },
  { icon: MessageSquare, label: "Feedback", to: "/explore/feedback" },
  { icon: User, label: "Profile", to: "/explore/profile" },
];

export function Sidebar() {
  const { pathname } = useLocation();

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 flex flex-col z-40 border-r border-border/60"
      style={{ background: "linear-gradient(180deg, #0d0d14 0%, #0a0a0f 100%)" }}>
      {/* Logo */}
      <div className="px-5 py-5 border-b border-border/40">
        <Link to="/explore" className="flex items-center gap-2.5">
          <div className="relative h-7 w-7">
            <div className="absolute inset-0 rounded-lg animated-gradient" />
            <div className="absolute inset-[3px] rounded-[5px] bg-background grid place-items-center">
              <div className="h-1.5 w-1.5 rounded-full bg-accent" />
            </div>
          </div>
          <span className="text-base font-bold tracking-tight">LaunchMesh</span>
        </Link>
      </div>

      {/* Main nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {NAV.map(({ icon: Icon, label, to }) => {
          const active = pathname === to || (to !== "/explore" && pathname.startsWith(to));
          return (
            <Link key={to} to={to}>
              <motion.div
                whileHover={{ x: 4 }}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors",
                  active
                    ? "bg-primary/15 text-primary border border-primary/20"
                    : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                )}>
                <Icon className={cn("h-4 w-4 shrink-0", active && "text-primary")} />
                {label}
                {label === "Notifications" && (
                  <span className="ml-auto h-2 w-2 rounded-full bg-accent animate-pulse" />
                )}
              </motion.div>
            </Link>
          );
        })}

        {/* Divider */}
        <div className="my-3 border-t border-border/40" />

        {/* Founder CTA */}
        <Link to="/founder">
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="relative overflow-hidden rounded-2xl p-4 cursor-pointer mt-2"
            style={{
              background: "linear-gradient(135deg, rgba(108,92,231,0.25) 0%, rgba(108,92,231,0.1) 100%)",
              border: "1px solid rgba(108,92,231,0.4)",
              boxShadow: "0 0 24px -8px rgba(108,92,231,0.6)",
            }}>
            <div className="absolute inset-0 opacity-30"
              style={{ background: "radial-gradient(circle at 70% 50%, rgba(108,92,231,0.4), transparent 60%)" }} />
            <div className="relative">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-base">🚀</span>
                <span className="text-sm font-semibold text-primary">Founder Workspace</span>
              </div>
              <p className="text-[11px] text-muted-foreground leading-snug">Launch and grow your own app</p>
              <div className="mt-2.5 flex items-center gap-1 text-xs text-primary font-medium">
                Get started <ChevronRight className="h-3 w-3" />
              </div>
            </div>
          </motion.div>
        </Link>
      </nav>

      {/* Bottom nav */}
      <div className="px-3 py-3 border-t border-border/40 space-y-0.5">
        {BOTTOM.map(({ icon: Icon, label, to }) => (
          <Link key={to} to={to}>
            <motion.div whileHover={{ x: 4 }}
              className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-white/5 transition-colors">
              <Icon className="h-3.5 w-3.5 shrink-0" />
              {label}
            </motion.div>
          </Link>
        ))}
      </div>
    </aside>
  );
}
