import { motion } from "framer-motion";
import { Heart, Bookmark, Bell, Users, ExternalLink } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useState } from "react";
import type { App } from "@/data/mock";
import { cn } from "@/lib/utils";

const STATUS_STYLES = {
  live: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  upcoming: "bg-primary/15 text-primary border-primary/30",
  trending: "bg-accent/15 text-accent border-accent/30",
};

export function AppCard({ app, index = 0 }: { app: App; index?: number }) {
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [notified, setNotified] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.06 }}
      whileHover={{ y: -4 }}
      className="group relative rounded-2xl overflow-hidden border border-border/60 hover:border-primary/40 hover:shadow-lg transition-all duration-300 dot-bg bg-card/45 flex flex-col justify-between min-h-[220px]">

      {/* Top border indicator strip */}
      <div className={`h-[3px] w-full bg-gradient-to-r ${app.gradient}`} />

      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div className="flex items-start gap-4">
          {/* Icon */}
          <motion.div whileHover={{ scale: 1.05, rotate: 3 }}
            className={`h-12 w-12 rounded-xl bg-gradient-to-br ${app.gradient} grid place-items-center text-xl shrink-0 shadow-md`}>
            {app.icon}
          </motion.div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <h3 className="font-bold text-foreground text-sm truncate group-hover:text-primary transition-colors">{app.name}</h3>
              <span className={cn("text-[8px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border shrink-0", STATUS_STYLES[app.status])}>
                {app.status}
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-1 truncate">{app.tagline}</p>
            <div className="flex flex-wrap items-center gap-2 mt-2 text-[10px] text-muted-foreground">
              <span className="glass border border-border/30 px-2 py-0.5 rounded-md font-medium">{app.category}</span>
              <span className="flex items-center gap-1 font-medium"><Users className="h-3 w-3 text-primary" />{app.followers.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Live Sparkline Widget */}
        <div className="flex items-center justify-between border-t border-border/40 pt-3">
          <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>Developer Velocity</span>
          </div>
          <div className="flex items-center gap-2">
            <svg className="h-5 w-14" viewBox="0 0 60 20">
              <path
                d={`M 0 ${12 + Math.sin(index) * 4} Q 15 ${4 + Math.cos(index) * 4}, 30 ${13 + Math.sin(index * 1.5) * 3} T 60 ${5 + Math.cos(index * 2) * 3}`}
                fill="none"
                stroke="var(--color-primary)"
                strokeWidth="1.5"
                className="opacity-70 group-hover:opacity-100 transition-opacity"
              />
            </svg>
            <span className="text-[10px] font-bold text-foreground">{(75 + (index * 7) % 25)}%</span>
          </div>
        </div>

        {/* Actions Drawer */}
        <div className="flex items-center gap-1.5 bg-muted/40 p-1.5 rounded-xl border border-border/30">
          <Link to={`/explore/app/${app.id}`} className="flex-1">
            <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
              className="w-full text-[10px] font-bold py-1.5 rounded-lg bg-primary text-white hover:brightness-110 shadow-sm transition-all">
              Launch Console
            </motion.button>
          </Link>
          <div className="flex gap-0.5">
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              onClick={(e) => { e.preventDefault(); setNotified(!notified); }}
              className={cn("h-7 w-7 rounded-lg grid place-items-center transition-colors border",
                notified ? "bg-accent/20 text-accent border-accent/30" : "glass text-muted-foreground hover:text-foreground border-transparent")}>
              <Bell className="h-3 w-3" />
            </motion.button>
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              onClick={(e) => { e.preventDefault(); setLiked(!liked); }}
              className={cn("h-7 w-7 rounded-lg grid place-items-center transition-colors border",
                liked ? "bg-rose-500/20 text-rose-400 border-rose-500/30" : "glass text-muted-foreground hover:text-foreground border-transparent")}>
              <Heart className={cn("h-3 w-3", liked && "fill-current")} />
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export function AppCardHorizontal({ app, index = 0 }: { app: App; index?: number }) {
  const [liked, setLiked] = useState(false);
  const [notified, setNotified] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      whileHover={{ y: -2 }}
      className="group flex items-center gap-4 bg-card/40 hover:bg-card/65 rounded-2xl p-3 border border-border/60 hover:border-primary/40 transition-all cursor-pointer">

      <Link to={`/explore/app/${app.id}`} className="flex items-center gap-4 flex-1 min-w-0">
        <div className={`h-11 w-11 rounded-xl bg-gradient-to-br ${app.gradient} grid place-items-center text-lg shrink-0 shadow-sm`}>
          {app.icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-bold text-sm text-foreground truncate group-hover:text-primary transition-colors">{app.name}</span>
            <span className={cn("text-[7px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full border", STATUS_STYLES[app.status])}>
              {app.status}
            </span>
          </div>
          <p className="text-xs text-muted-foreground truncate mt-0.5">{app.tagline}</p>
        </div>
        <div className="hidden md:flex items-center gap-3 text-xs text-muted-foreground">
          <span className="glass border border-border/30 px-2 py-0.5 rounded-lg">{app.category}</span>
          <span className="flex items-center gap-1 font-medium"><Users className="h-3 w-3 text-primary" />{app.followers.toLocaleString()}</span>
        </div>
      </Link>

      <div className="flex items-center gap-1 shrink-0 bg-muted/40 p-1 rounded-lg border border-border/30">
        <motion.button whileHover={{ scale: 1.1 }} onClick={() => setNotified(!notified)}
          className={cn("h-7 w-7 rounded-md grid place-items-center text-xs transition-colors",
            notified ? "bg-accent/20 text-accent" : "glass text-muted-foreground hover:text-foreground border-transparent")}>
          <Bell className="h-3 w-3" />
        </motion.button>
        <motion.button whileHover={{ scale: 1.1 }} onClick={() => setLiked(!liked)}
          className={cn("h-7 w-7 rounded-md grid place-items-center text-xs transition-colors",
            liked ? "bg-rose-500/20 text-rose-400 border border-transparent" : "glass text-muted-foreground hover:text-foreground border-transparent")}>
          <Heart className={cn("h-3 w-3", liked && "fill-current")} />
        </motion.button>
      </div>
    </motion.div>
  );
}
