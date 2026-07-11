import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Bell, MessageSquare, ChevronDown, Zap } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { NOTIFICATIONS } from "@/data/mock";

function useCountdown(targetDate: string) {
  const target = new Date(targetDate).getTime();
  const now = Date.now();
  const diff = Math.max(0, target - now);
  const d = Math.floor(diff / 86400000);
  const h = Math.floor((diff % 86400000) / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  const s = Math.floor((diff % 60000) / 1000);
  return { d, h, m, s };
}

function CountdownUnit({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center min-w-[28px]">
      <span className="text-sm font-bold tabular-nums text-foreground">{String(value).padStart(2, "0")}</span>
      <span className="text-[9px] uppercase tracking-wider text-muted-foreground">{label}</span>
    </div>
  );
}

export function TopNav({ onSearchOpen }: { onSearchOpen: () => void }) {
  const [showNotifs, setShowNotifs] = useState(false);
  const unread = NOTIFICATIONS.filter((n) => !n.read).length;
  const { d, h, m } = useCountdown("2026-07-20T00:00:00");

  return (
    <header className="fixed top-0 left-64 right-0 h-16 z-30 flex items-center gap-4 px-6 border-b border-border/40"
      style={{ background: "rgba(10,10,15,0.85)", backdropFilter: "blur(20px)" }}>

      {/* Search trigger */}
      <motion.button
        whileHover={{ scale: 1.01 }}
        onClick={onSearchOpen}
        className="flex-1 max-w-md flex items-center gap-3 glass rounded-xl px-4 py-2.5 text-sm text-muted-foreground hover:text-foreground transition-colors cursor-text">
        <Search className="h-4 w-4 shrink-0" />
        <span>Search apps, founders, collections...</span>
        <span className="ml-auto text-xs glass px-1.5 py-0.5 rounded-md">⌘K</span>
      </motion.button>

      <div className="flex items-center gap-2 ml-auto">
        {/* Launch countdown */}
        <div className="hidden lg:flex items-center gap-2 glass rounded-xl px-3 py-1.5">
          <Zap className="h-3.5 w-3.5 text-accent" />
          <span className="text-[11px] text-muted-foreground mr-1">Next launch</span>
          <div className="flex items-center gap-1">
            <CountdownUnit value={d} label="d" />
            <span className="text-muted-foreground text-xs mb-0.5">:</span>
            <CountdownUnit value={h} label="h" />
            <span className="text-muted-foreground text-xs mb-0.5">:</span>
            <CountdownUnit value={m} label="m" />
          </div>
        </div>

        {/* Messages */}
        <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}
          className="relative h-9 w-9 glass rounded-xl grid place-items-center text-muted-foreground hover:text-foreground transition-colors">
          <MessageSquare className="h-4 w-4" />
        </motion.button>

        {/* Notifications */}
        <div className="relative">
          <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}
            onClick={() => setShowNotifs(!showNotifs)}
            className="relative h-9 w-9 glass rounded-xl grid place-items-center text-muted-foreground hover:text-foreground transition-colors">
            <Bell className="h-4 w-4" />
            {unread > 0 && (
              <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-accent text-[9px] font-bold text-background grid place-items-center">
                {unread}
              </span>
            )}
          </motion.button>

          <AnimatePresence>
            {showNotifs && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.96 }}
                className="absolute right-0 top-12 w-80 glass-strong rounded-2xl shadow-elevated border border-border/60 overflow-hidden z-50">
                <div className="px-4 py-3 border-b border-border/40 flex items-center justify-between">
                  <span className="text-sm font-semibold">Notifications</span>
                  <span className="text-xs text-accent">{unread} new</span>
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {NOTIFICATIONS.map((n) => (
                    <Link key={n.id} to={`/explore/app/${n.appId}`}>
                      <div className={`px-4 py-3 hover:bg-white/5 transition-colors border-b border-border/30 last:border-0 ${!n.read ? "bg-primary/5" : ""}`}>
                        <p className="text-sm text-foreground">{n.message}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{n.time}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Profile */}
        <Link to="/explore/profile">
          <motion.div whileHover={{ scale: 1.05 }}
            className="flex items-center gap-2 glass rounded-xl px-3 py-1.5 cursor-pointer">
            <div className="h-6 w-6 rounded-full animated-gradient grid place-items-center text-xs font-bold text-white">U</div>
            <span className="text-sm font-medium hidden sm:block">You</span>
            <ChevronDown className="h-3 w-3 text-muted-foreground" />
          </motion.div>
        </Link>
      </div>
    </header>
  );
}
