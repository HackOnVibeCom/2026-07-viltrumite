import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Package, Sparkles, Plus, Zap } from "lucide-react";
import { useState } from "react";
import { useBundles } from "@/hooks/useMockDb";

export const Route = createFileRoute("/founder/bundles")({ component: BundlesPage });

const gradients = ["from-amber-500 to-orange-600", "from-violet-500 to-purple-700", "from-cyan-500 to-teal-600"];

function BundlesPage() {
  const [creating, setCreating] = useState(false);
  const { data: bundles = [] } = useBundles();

  return <div className="pt-20 md:pt-24 px-6 md:px-8 pb-6 md:pb-8 max-w-5xl">
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
      <div className="flex items-center justify-between flex-wrap gap-4"><div className="flex items-center gap-3"><div className="h-10 w-10 rounded-2xl bg-primary/20 grid place-items-center"><Package className="h-5 w-5 text-primary" /></div><div><h1 className="text-2xl font-bold">Bundle Builder</h1><p className="text-sm text-muted-foreground">Themed multi-app launch campaigns</p></div></div><motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }} onClick={() => setCreating(!creating)} className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white" style={{ background: "linear-gradient(135deg, #6C5CE7, #00D4B8)", boxShadow: "0 0 24px -8px rgba(108,92,231,0.5)" }}><Plus className="h-4 w-4" /> New Bundle</motion.button></div>
    </motion.div>

    {creating && <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} className="glass-strong rounded-2xl border border-primary/30 p-6 mb-6" style={{ boxShadow: "0 0 40px -15px rgba(108,92,231,0.3)" }}><div className="flex items-center gap-2 mb-4"><Sparkles className="h-4 w-4 text-accent" /><h3 className="text-base font-semibold">AI Bundle Generator</h3></div><div className="space-y-4"><div><label className="text-xs text-muted-foreground block mb-1.5">Bundle Theme</label><input placeholder="e.g. New Year Productivity Pack" className="w-full glass border border-border/60 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary/40 transition-colors" /></div><div><label className="text-xs text-muted-foreground block mb-1.5">Target Audience</label><input placeholder="e.g. Students, Developers, Founders" className="w-full glass border border-border/60 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary/40 transition-colors" /></div><motion.button whileHover={{ scale: 1.03 }} className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white" style={{ background: "linear-gradient(135deg, #6C5CE7, #00D4B8)" }}><Zap className="h-4 w-4" /> Generate Bundle with AI</motion.button></div></motion.div>}

    <div className="space-y-5">{bundles.map((bundle, index) => { const gradient = gradients[index % gradients.length]; return <motion.div key={bundle.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }} whileHover={{ y: -3 }} className="glass-strong rounded-3xl p-6 border border-border/60 hover:border-primary/30 transition-colors relative overflow-hidden"><div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-5`} /><div className="absolute -right-10 -top-10 h-40 w-40 rounded-full blur-3xl opacity-20" style={{ background: "linear-gradient(135deg, #6C5CE7, #00D4B8)" }} /><div className="relative flex flex-col md:flex-row md:items-center gap-5 md:justify-between"><div><div className="flex items-center gap-2 mb-1"><span className="text-xs text-accent uppercase tracking-widest font-semibold">{new Date(bundle.createdAt).toLocaleDateString("en", { month: "short", year: "numeric" })}</span><span className="text-[10px] px-2 py-0.5 rounded-full border font-bold bg-emerald-500/20 text-emerald-400 border-emerald-500/30">active</span></div><h3 className="text-2xl font-bold">{bundle.name} Bundle</h3><div className="flex flex-wrap gap-2 mt-3">{bundle.apps.map((app) => <span key={app.name} className="text-xs glass px-3 py-1.5 rounded-full border border-border/40 flex items-center gap-1.5"><span>{app.icon}</span> {app.name}</span>)}</div></div><div className="flex items-center gap-6"><div><p className="text-xs text-muted-foreground">Purchases</p><p className="text-2xl font-bold gradient-brand">{bundle.purchases.toLocaleString()}</p></div><motion.button whileHover={{ scale: 1.04 }} className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white shrink-0" style={{ background: "linear-gradient(135deg, #6C5CE7, #00D4B8)" }}><Sparkles className="h-4 w-4" /> Manage</motion.button></div></div></motion.div>; })}</div>
  </div>;
}
