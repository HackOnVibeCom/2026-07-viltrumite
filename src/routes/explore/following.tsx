import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import { APPS } from "@/data/mock";
import { AppCard } from "@/components/explore/AppCard";

export const Route = createFileRoute("/explore/following")({
  component: FollowingPage,
});

function FollowingPage() {
  return (
    <div className="p-6 md:p-8 max-w-6xl">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="h-10 w-10 rounded-2xl bg-rose-500/20 grid place-items-center">
            <Heart className="h-5 w-5 text-rose-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Following</h1>
            <p className="text-sm text-muted-foreground">Apps and founders you follow</p>
          </div>
        </div>
      </motion.div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {APPS.slice(0, 6).map((app, i) => <AppCard key={app.id} app={app} index={i} />)}
      </div>
    </div>
  );
}
