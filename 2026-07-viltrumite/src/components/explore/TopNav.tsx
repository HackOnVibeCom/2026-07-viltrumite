import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Bell, MessageSquare, ChevronDown, Zap, Sun, Moon, Menu, ArrowLeft } from "lucide-react";
import { Link, useLocation } from "@tanstack/react-router";
import { useExploreNotifications } from "@/hooks/useMockDb";
import { useTheme } from "@/context/ThemeContext";

function useCountdown(targetDate: string) {
  const target = new Date(targetDate).getTime();
  const [timeLeft, setTimeLeft] = useState(target - Date.now());

  useState(() => {
    const timer = setInterval(() => {
      setTimeLeft(Math.max(0, target - Date.now()));
    }, 60000);
    return () => clearInterval(timer);
  });

  const diff = timeLeft;
  return {
    d: Math.floor(diff / 86400000),
    h: Math.floor((diff % 86400000) / 3600000),
    m: Math.floor((diff % 3600000) / 60000),
  };
}

function CountdownUnit({ value, label }: { value: number; label: string }) {
  return (
    <span className="tabular-nums font-semibold text-foreground text-xs">
      {String(value).padStart(2, "0")}
      <span className="text-[10px] text-muted-foreground ml-0.5 uppercase tracking-wide">{label}</span>
    </span>
  );
}

export function TopNav({ onSearchOpen, onMenuToggle }: { onSearchOpen: () => void; onMenuToggle: () => void }) {
  const { theme, toggleTheme } = useTheme();
  const { pathname } = useLocation();
  const [showNotifs, setShowNotifs] = useState(false);
  const { data: notifications = [] } = useExploreNotifications();
  const unread = notifications.filter((n) => !n.read).length;
  const { d, h, m } = useCountdown("2026-07-20T00:00:00");

  return (
    <header className="fixed top-0 left-0 lg:left-64 right-0 h-16 z-30 flex items-center gap-3 md:gap-4 px-4 md:px-6 border-b border-border/40"
      style={{ background: "var(--header-bg, rgba(10,10,15,0.85))", backdropFilter: "blur(20px)" }}>

      {/* Mobile menu trigger */}
      <button onClick={onMenuToggle} className="lg:hidden h-9 w-9 rounded-xl grid place-items-center text-muted-foreground hover:text-foreground bg-muted/30 border border-border/30 shrink-0 transition-colors">
        <Menu className="h-4 w-4" />
      </button>

      {/* Dynamic back links based on page path */}
      {pathname !== "/explore" && pathname !== "/explore/" ? (
        <Link to="/explore" className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground hover:text-foreground transition-colors shrink-0 mr-1 sm:mr-2">
          <ArrowLeft className="h-4 w-4 text-primary" />
          <span className="hidden sm:inline">Back to Dashboard</span>
        </Link>
      ) : (
        <Link to="/" className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground hover:text-foreground transition-colors shrink-0 mr-1 sm:mr-2">
          <ArrowLeft className="h-4 w-4 text-primary" />
          <span className="hidden sm:inline">Landing Page</span>
        </Link>
      )}

      {/* Search trigger */}
      <motion.button
        whileHover={{ scale: 1.01 }}
        onClick={onSearchOpen}
        className="flex-1 max-w-sm sm:max-w-md flex items-center gap-2 md:gap-3 glass rounded-xl px-3.5 py-2.5 text-xs md:text-sm text-muted-foreground hover:text-foreground transition-colors cursor-text">
        <Search className="h-3.5 w-3.5 md:h-4 md:w-4 shrink-0" />
        <span className="truncate">Search apps, founders...</span>
        <span className="ml-auto text-[9px] glass px-1.5 py-0.5 rounded-md hidden sm:inline">⌘K</span>
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

        {/* Theme Toggle */}
        <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}
          onClick={toggleTheme}
          className="relative h-9 w-9 glass rounded-xl grid place-items-center text-muted-foreground hover:text-foreground transition-colors"
          title={`Switch to ${theme === "light" ? "dark" : "light"} mode`}>
          {theme === "light" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
        </motion.button>

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
                  {notifications.map((n) => (
                    <Link key={n.id} to={`/explore/app/${n.appId}`}>
                      <div className={`px-4 py-3 hover:bg-muted transition-colors border-b border-border/30 last:border-0 ${!n.read ? "bg-primary/5" : ""}`}>
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
