import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Handshake, Zap, CheckCircle2, Clock, ArrowRight, Plus } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/founder/pacts")({
  component: PactsPage,
});

const PACTS = [
  {
    partner: "StudyFlow", icon: "📚", status: "active", type: "Newsletter swap",
    reach: "12,000", installs: "+420", started: "Jul 10", ends: "Jul 24",
    gradient: "from-amber-500 to-orange-500",
  },
  {
    partner: "FocusFlow", icon: "⚡", status: "pending", type: "In-app banner",
    reach: "8,400", installs: "+310", started: "—", ends: "—",
    gradient: "from-cyan-500 to-teal-500",
  },
  {
    partner: "MindMap AI", icon: "🧠", status: "draft", type: "Bundle launch",
    reach: "6,200", installs: "+240", started: "—", ends: "—",
    gradient: "from-violet-500 to-purple-600",
  },
];

const STATUS_STYLES: Record<string, string> = {
  active: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  pending: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  draft: "bg-white/10 text-muted-foreground border-border/40",
};

function PactsPage() {
  const [creating, setCreating] = useState(false);
  const [step, setStep] = useState(0);

  const STEPS = ["Choose Partner", "Define Terms", "AI Draft", "Sign & Launch"];

  return (
    <div className="p-6 md:p-8 max-w-5xl">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-primary/20 grid place-items-center">
              <Handshake className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Growth Pacts</h1>
              <p className="text-sm text-muted-foreground">AI-drafted cross-promotion agreements</p>
            </div>
          </div>
          <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
            onClick={() => setCreating(!creating)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white"
            style={{ background: "linear-gradient(135deg, #6C5CE7, #00D4B8)", boxShadow: "0 0 24px -8px rgba(108,92,231,0.5)" }}>
            <Plus className="h-4 w-4" /> New Pact
          </motion.button>
        </div>
      </motion.div>

      {/* Create Pact flow */}
      {creating && (
        <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }}
          className="glass-strong rounded-2xl border border-primary/30 p-6 mb-6"
          style={{ boxShadow: "0 0 40px -15px rgba(108,92,231,0.4)" }}>
          <div className="flex items-center gap-2 mb-5">
            <Zap className="h-4 w-4 text-accent" />
            <h3 className="text-base font-semibold">Create New Growth Pact</h3>
          </div>
          {/* Step indicator */}
          <div className="flex items-center gap-2 mb-6">
            {STEPS.map((s, i) => (
              <div key={s} className="flex items-center gap-2">
                <button onClick={() => setStep(i)}
                  className={cn("flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-all",
                    step === i ? "bg-primary text-white" : step > i ? "bg-accent/20 text-accent" : "glass text-muted-foreground")}>
                  {step > i ? <CheckCircle2 className="h-3 w-3" /> : <span>{i + 1}</span>}
                  <span className="hidden sm:inline">{s}</span>
                </button>
                {i < STEPS.length - 1 && <div className="h-px w-4 bg-border/60" />}
              </div>
            ))}
          </div>

          {step === 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {["StudyFlow 96%", "FocusFlow 88%", "MindMap AI 81%"].map((p, i) => (
                <motion.button key={p} whileHover={{ scale: 1.03 }} onClick={() => setStep(1)}
                  className="glass rounded-xl p-4 border border-border/40 hover:border-primary/40 text-left transition-colors">
                  <p className="text-sm font-semibold">{p}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Click to select</p>
                </motion.button>
              ))}
            </div>
          )}
          {step === 1 && (
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground mb-3">Define partnership terms:</p>
              {["Newsletter swap (12k reach each)", "In-app banner (30 days)", "Joint launch announcement"].map((t, i) => (
                <label key={t} className="flex items-center gap-3 glass rounded-xl p-3.5 border border-border/40 cursor-pointer hover:border-primary/30 transition-colors">
                  <input type="checkbox" className="accent-primary" defaultChecked={i === 0} />
                  <span className="text-sm">{t}</span>
                </label>
              ))}
              <button onClick={() => setStep(2)} className="mt-2 flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-primary/20 text-primary border border-primary/30 hover:bg-primary/30 transition-colors">
                Generate AI Draft <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          )}
          {step === 2 && (
            <div className="space-y-3">
              <div className="glass rounded-xl p-4 border border-accent/20">
                <p className="text-xs text-accent font-semibold mb-2">🤖 AI-Generated Draft</p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Both parties agree to a <strong className="text-foreground">7-day newsletter swap</strong> reaching a combined audience of <strong className="text-foreground">24,000 subscribers</strong>. Each party will feature the other's product with a dedicated section and CTA. Expected mutual benefit: <strong className="text-accent">+420 installs each</strong>.
                </p>
              </div>
              <button onClick={() => setStep(3)} className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-primary/20 text-primary border border-primary/30 hover:bg-primary/30 transition-colors">
                Looks good — Sign <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          )}
          {step === 3 && (
            <div className="text-center py-6">
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring" }}
                className="text-5xl mb-4">🎉</motion.div>
              <h3 className="text-xl font-bold mb-2">Pact Created!</h3>
              <p className="text-sm text-muted-foreground">Your Growth Pact with StudyFlow is now active. Both parties have been notified.</p>
              <button onClick={() => { setCreating(false); setStep(0); }}
                className="mt-4 text-sm text-primary hover:underline">Done</button>
            </div>
          )}
        </motion.div>
      )}

      {/* Pacts list */}
      <div className="space-y-4">
        {PACTS.map((p, i) => (
          <motion.div key={p.partner}
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
            whileHover={{ y: -2 }}
            className="glass-strong rounded-2xl border border-border/60 hover:border-primary/30 p-5 transition-colors">
            <div className="flex items-center gap-4">
              <div className={`h-12 w-12 rounded-2xl bg-gradient-to-br ${p.gradient} grid place-items-center text-2xl shrink-0`}>{p.icon}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="font-semibold">{p.partner}</span>
                  <span className={cn("text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border", STATUS_STYLES[p.status])}>
                    {p.status}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">{p.type}</p>
              </div>
              <div className="hidden md:grid grid-cols-3 gap-4 text-center">
                {[{ label: "Reach", value: p.reach }, { label: "Est. Installs", value: p.installs }, { label: p.status === "active" ? "Ends" : "Status", value: p.status === "active" ? p.ends : "Awaiting" }].map(s => (
                  <div key={s.label}>
                    <p className="text-sm font-semibold">{s.value}</p>
                    <p className="text-xs text-muted-foreground">{s.label}</p>
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-2 shrink-0">
                {p.status === "pending" && (
                  <motion.button whileHover={{ scale: 1.04 }}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-accent/20 text-accent border border-accent/30">
                    Accept
                  </motion.button>
                )}
                <motion.button whileHover={{ scale: 1.04 }}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold glass border border-border/40 text-muted-foreground hover:text-foreground">
                  View
                </motion.button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
