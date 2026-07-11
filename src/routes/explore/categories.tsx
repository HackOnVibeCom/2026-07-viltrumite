import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Tag } from "lucide-react";
import { useState } from "react";
import { APPS, CATEGORIES } from "@/data/mock";
import { AppCard } from "@/components/explore/AppCard";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/explore/categories")({
  component: CategoriesPage,
});

function CategoriesPage() {
  const [active, setActive] = useState<string | null>(null);
  const filtered = active
    ? APPS.filter(a => a.category.toLowerCase().replace(/\s+/g, "") === active)
    : APPS;

  return (
    <div className="p-6 md:p-8 max-w-6xl">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="h-10 w-10 rounded-2xl bg-accent/20 grid place-items-center">
            <Tag className="h-5 w-5 text-accent" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Categories</h1>
            <p className="text-sm text-muted-foreground">Browse apps by category</p>
          </div>
        </div>
      </motion.div>

      {/* Category grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        {CATEGORIES.map((cat, i) => (
          <motion.button key={cat.id}
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
            whileHover={{ y: -3, scale: 1.02 }} whileTap={{ scale: 0.97 }}
            onClick={() => setActive(active === cat.id ? null : cat.id)}
            className={cn(
              "relative overflow-hidden rounded-2xl p-4 border text-left transition-all",
              active === cat.id
                ? "border-primary/40 bg-primary/10"
                : "glass-strong border-border/60 hover:border-primary/20"
            )}>
            <div className="text-2xl mb-2">{cat.icon}</div>
            <p className="text-sm font-semibold">{cat.label}</p>
            <p className="text-xs text-muted-foreground">{cat.count} apps</p>
          </motion.button>
        ))}
      </div>

      {/* Apps grid */}
      <div>
        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">
          {active ? CATEGORIES.find(c => c.id === active)?.label : "All Apps"}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((app, i) => <AppCard key={app.id} app={app} index={i} />)}
        </div>
      </div>
    </div>
  );
}
