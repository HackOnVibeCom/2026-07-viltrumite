import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Package, Sparkles, Plus, Zap } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/founder/bundles")({
  component: BundlesPage,
});

const BUNDLES = [
  {
    name: "Back to School", tag: "Sept 2026",
    apps: [{ icon: "🎨", name: "DesignVault" }, { icon: "📚", name: "StudyFlow" }, { icon: "⚡", name: "FocusFlow" }, { icon: "🧠", name: "NoteMind" }],
    reach: "24,000", status: "draft", gradient: "from-amber-500 to-orange-600",
  },
  {
    name: "AI Builder Stack", tag: "Aug 2026",
    apps: [{ icon: "🎨", name: "DesignVault" }, { icon: "🤖", name: "MindMap AI" }, { icon: "🛠️", name: "DevPulse" }],
    reach: "18,000", status: "active", gradient: "from-violet-500 to-purple-700",
  },
];

function BundlesPage() {
  const [creating, setCreating] = useState(false);

  return (
    <div className="p-6 md:p-8 max-w-5xl">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-primary/20 grid place-items-center">
              <Package className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Bundle Builder</h1>
              <p className="text-sm text-muted-foreground">Themed multi-app launch campaigns</p>
            </div>
          </div>
          <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
            onClick={() => setCreating(!creating)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white"
            style={{ background: "linear-gradient(135deg, #6C5CE7, #00D4B8)", boxShadow: "0 0 24px -8px rgba(108,92,231,0.5)" }}>
            <Plus className="h-4 w-4" /> New Bundle
          </motion.button>
        </div>
      </motion.div>

      {creating && (
        <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }}
          className="glass-strong rounded-2xl border border-primary/30 p-6 mb-6"
          style={{ boxShadow: "0 0 40px -15px rgba(108,92,231,0.3)" }}>
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="h-4 w-4 text-accent" />
            <h3 className="text-base font-semibold">AI Bundle Generator</h3>
          </div>
          <div className="space-y-4">
            <div>
              <label className="text-xs text-muted-foreground block mb-1.5">Bundle Theme</label>
              <input placeholder="e.g. New Year Productivity Pack" className="w-full glass border border-border/60 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary/40 transition-colors" />
            </div>
            <div>
              <label className="text-xs text-muted-foreground block mb-1.5">Target Audience</label>
              <input placeholder="e.g. Students, Developers, Founders" className="w-full glass border border-border/60 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary/40 transition-colors" />
            </div>
            <motion.button whileHover={{ scale: 1.03 }}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white"
              style={{ background: "linear-gradient(135deg, #6C5CE7, #00D4B8)" }}>
              <Zap className="h-4 w-4" /> Generate Bundle with AI
            </motion.button>
          </div>
        </motion.div>
      )}

      <div className="space-y-5">
        {BUNDLES.map((b, i) => (
          <motion.div key={b.name}
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
            whileHover={{ y: -3 }}
            className="glass-strong rounded-3xl p-6 border border-border/60 hover:border-primary/30 transition-colors relative overflow-hidden">
            <div className={`absolute inset-0 bg-gradient-to-br ${b.gradient} opacity-5`} />
            <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full blur-3xl opacity-20"
              style={{ background: `linear-gradient(135deg, #6C5CE7, #00D4B8)` }} />
            <div className="relative flex flex-col md:flex-row md:items-center gap-5 md:justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs text-accent uppercase tracking-widest font-semibold">{b.tag}</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full border font-bold ${b.status === "active" ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" : "bg-white/10 text-muted-foreground border-border/40"}`}>
                    {b.status}
                  </span>
                </div>
                <h3 className="text-2xl font-bold">{b.name} Bundle</h3>
                <div className="flex flex-wrap gap-2 mt-3">
                  {b.apps.map(a => (
                    <span key={a.name} className="text-xs glass px-3 py-1.5 rounded-full border border-border/40 flex items-center gap-1.5">
                      <span>{a.icon}</span> {a.name}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div>
                  <p className="text-xs text-muted-foreground">Expected reach</p>
                  <p className="text-2xl font-bold gradient-brand">{b.reach}</p>
                </div>
                <motion.button whileHover={{ scale: 1.04 }}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white shrink-0"
                  style={{ background: "linear-gradient(135deg, #6C5CE7, #00D4B8)" }}>
                  <Sparkles className="h-4 w-4" /> {b.status === "active" ? "Manage" : "Launch"}
                </motion.button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
