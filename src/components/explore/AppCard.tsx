import { motion } from "framer-motion";
import { Heart, Bookmark, Bell, Users, ExternalLink } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useState } from "react";
import type { App } from "@/data/mock";
import { cn } from "@/lib/utils";

const STATUS_STYLES = {
  live: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  upcoming: "bg-primary/20 text-primary border-primary/30",
  trending: "bg-accent/20 text-accent border-accent/30",
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
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="group relative glass-strong rounded-2xl overflow-hidden border border-border/60 hover:border-primary/30 transition-colors">

      {/* Gradient top strip */}
      <div className={`h-1 w-full bg-gradient-to-r ${app.gradient}`} />

      <div className="p-5">
        <div className="flex items-start gap-4">
          {/* Icon */}
          <motion.div whileHover={{ scale: 1.1, rotate: 5 }}
            className={`h-14 w-14 rounded-2xl bg-gradient-to-br ${app.gradient} grid place-items-center text-2xl shrink-0 shadow-lg`}>
            {app.icon}
          </motion.div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-semibold text-foreground text-base">{app.name}</h3>
              <span className={cn("text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full border", STATUS_STYLES[app.status])}>
                {app.status}
              </span>
            </div>
            <p className="text-sm text-muted-foreground mt-0.5 truncate">{app.tagline}</p>
            <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
              <span className="glass px-2 py-0.5 rounded-full">{app.category}</span>
              <span className="flex items-center gap-1"><Users className="h-3 w-3" />{app.followers.toLocaleString()}</span>
              <span className="flex items-center gap-1">{app.platforms.slice(0, 2).join(" · ")}</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 mt-4">
          <Link to={`/explore/app/${app.id}`} className="flex-1">
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              className="w-full text-xs font-semibold py-2 rounded-xl bg-primary/20 text-primary border border-primary/30 hover:bg-primary/30 transition-colors">
              View App
            </motion.button>
          </Link>

          <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
            onClick={(e) => { e.preventDefault(); setNotified(!notified); }}
            className={cn("h-8 w-8 rounded-xl grid place-items-center transition-colors border",
              notified ? "bg-accent/20 text-accent border-accent/30" : "glass text-muted-foreground hover:text-foreground border-transparent")}>
            <Bell className="h-3.5 w-3.5" />
          </motion.button>

          <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
            onClick={(e) => { e.preventDefault(); setLiked(!liked); }}
            className={cn("h-8 w-8 rounded-xl grid place-items-center transition-colors border",
              liked ? "bg-rose-500/20 text-rose-400 border-rose-500/30" : "glass text-muted-foreground hover:text-foreground border-transparent")}>
            <Heart className={cn("h-3.5 w-3.5", liked && "fill-current")} />
          </motion.button>

          <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
            onClick={(e) => { e.preventDefault(); setBookmarked(!bookmarked); }}
            className={cn("h-8 w-8 rounded-xl grid place-items-center transition-colors border",
              bookmarked ? "bg-primary/20 text-primary border-primary/30" : "glass text-muted-foreground hover:text-foreground border-transparent")}>
            <Bookmark className={cn("h-3.5 w-3.5", bookmarked && "fill-current")} />
          </motion.button>
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
      whileHover={{ scale: 1.01 }}
      className="group flex items-center gap-4 glass-strong rounded-2xl p-4 border border-border/60 hover:border-primary/30 transition-all cursor-pointer">

      <Link to={`/explore/app/${app.id}`} className="flex items-center gap-4 flex-1 min-w-0">
        <div className={`h-12 w-12 rounded-2xl bg-gradient-to-br ${app.gradient} grid place-items-center text-xl shrink-0`}>
          {app.icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-sm">{app.name}</span>
            <span className={cn("text-[9px] font-bold uppercase px-1.5 py-0.5 rounded-full border", STATUS_STYLES[app.status])}>
              {app.status}
            </span>
          </div>
          <p className="text-xs text-muted-foreground truncate">{app.tagline}</p>
        </div>
        <div className="hidden sm:flex items-center gap-3 text-xs text-muted-foreground">
          <span className="glass px-2 py-1 rounded-lg">{app.category}</span>
          <span className="flex items-center gap-1"><Users className="h-3 w-3" />{app.followers.toLocaleString()}</span>
        </div>
      </Link>

      <div className="flex items-center gap-1.5 shrink-0">
        <motion.button whileHover={{ scale: 1.1 }} onClick={() => setNotified(!notified)}
          className={cn("h-7 w-7 rounded-lg grid place-items-center text-xs transition-colors",
            notified ? "bg-accent/20 text-accent" : "glass text-muted-foreground hover:text-foreground")}>
          <Bell className="h-3 w-3" />
        </motion.button>
        <motion.button whileHover={{ scale: 1.1 }} onClick={() => setLiked(!liked)}
          className={cn("h-7 w-7 rounded-lg grid place-items-center text-xs transition-colors",
            liked ? "bg-rose-500/20 text-rose-400" : "glass text-muted-foreground hover:text-foreground")}>
          <Heart className={cn("h-3 w-3", liked && "fill-current")} />
        </motion.button>
        <Link to={`/explore/app/${app.id}`}>
          <motion.button whileHover={{ scale: 1.1 }}
            className="h-7 w-7 rounded-lg grid place-items-center glass text-muted-foreground hover:text-foreground transition-colors">
            <ExternalLink className="h-3 w-3" />
          </motion.button>
        </Link>
      </div>
    </motion.div>
  );
}
