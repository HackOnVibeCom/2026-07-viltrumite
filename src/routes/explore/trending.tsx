import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Flame, TrendingUp } from "lucide-react";
import { APPS } from "@/data/mock";
import { AppCard } from "@/components/explore/AppCard";

export const Route = createFileRoute("/explore/trending")({
  component: TrendingPage,
});

function TrendingPage() {
  const trending = [...APPS].sort((a, b) => b.upvotes - a.upvotes);
  return (
    <div className="p-6 md:p-8 max-w-6xl">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="h-10 w-10 rounded-2xl bg-orange-500/20 grid place-items-center">
            <Flame className="h-5 w-5 text-orange-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Trending</h1>
            <p className="text-sm text-muted-foreground">Most popular apps right now</p>
          </div>
        </div>
      </motion.div>

      {/* Top 3 podium */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {trending.slice(0, 3).map((app, i) => (
          <motion.div key={app.id}
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
            className="relative">
            <div className="absolute -top-3 left-4 z-10">
              <span className="text-2xl">{i === 0 ? "🥇" : i === 1 ? "🥈" : "🥉"}</span>
            </div>
            <AppCard app={app} index={i} />
          </motion.div>
        ))}
      </div>

      {/* Rest */}
      <div className="space-y-1 mb-2">
        <div className="flex items-center gap-2 text-sm text-muted-foreground font-semibold uppercase tracking-wider px-2 mb-3">
          <TrendingUp className="h-4 w-4" /> All Trending
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {trending.slice(3).map((app, i) => (
            <AppCard key={app.id} app={app} index={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
