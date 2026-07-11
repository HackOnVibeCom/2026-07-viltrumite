import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Trophy } from "lucide-react";
import { APPS } from "@/data/mock";
import { AppCardHorizontal } from "@/components/explore/AppCard";

export const Route = createFileRoute("/explore/top")({
  component: TopLaunchesPage,
});

function TopLaunchesPage() {
  const sorted = [...APPS].sort((a, b) => b.upvotes - a.upvotes);
  return (
    <div className="p-6 md:p-8 max-w-4xl">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="h-10 w-10 rounded-2xl bg-amber-500/20 grid place-items-center">
            <Trophy className="h-5 w-5 text-amber-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Top Launches</h1>
            <p className="text-sm text-muted-foreground">All-time most popular apps on LaunchMesh</p>
          </div>
        </div>
      </motion.div>
      <div className="space-y-3">
        {sorted.map((app, i) => (
          <div key={app.id} className="flex items-center gap-4">
            <div className="text-2xl font-bold w-8 text-center shrink-0">
              {i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : (
                <span className="text-base text-muted-foreground">#{i + 1}</span>
              )}
            </div>
            <div className="flex-1">
              <AppCardHorizontal app={app} index={i} />
            </div>
            <div className="text-right shrink-0 w-20">
              <p className="text-sm font-bold text-primary">{app.upvotes.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">upvotes</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
