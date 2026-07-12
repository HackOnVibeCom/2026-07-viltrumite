import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Brain, ArrowRight, Users, TrendingUp, Zap, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/founder/matches")({
  component: MatchesPage,
});

const MATCHES = [
  {
    icon: "📚", name: "StudyFlow", match: 96, overlap: "92%", installs: "+720",
    reason: "Both products target engineering students preparing for placements. Peak usage overlap at 9–11pm.",
    gradient: "from-amber-500 to-orange-500", tags: ["Newsletter swap", "Bundle", "Referral"],
    trustScore: "A+", followers: 8200,
  },
  {
    icon: "⚡", name: "FocusFlow", match: 88, overlap: "76%", installs: "+540",
    reason: "Complementary workflow — users switch between both apps in the same session for design sprints.",
    gradient: "from-cyan-500 to-teal-500", tags: ["In-app banner", "Joint launch"],
    trustScore: "A", followers: 6100,
  },
  {
    icon: "🧠", name: "MindMap AI", match: 81, overlap: "69%", installs: "+410",
    reason: "Shared interest in visual thinking — designers who use MindMap AI naturally need design systems.",
    gradient: "from-violet-500 to-purple-600", tags: ["Bundle", "Newsletter"],
    trustScore: "B+", followers: 4800,
  },
  {
    icon: "🛠️", name: "DevPulse", match: 74, overlap: "61%", installs: "+310",
    reason: "Developers who build apps need design systems — DevPulse users are likely buyers.",
    gradient: "from-slate-500 to-zinc-600", tags: ["Referral", "Blog feature"],
    trustScore: "A", followers: 7300,
  },
  {
    icon: "📝", name: "NoteMind", match: 68, overlap: "55%", installs: "+240",
    reason: "Note-takers who care about visual presentation are ideal DesignVault customers.",
    gradient: "from-pink-500 to-rose-500", tags: ["Newsletter swap"],
    trustScore: "A+", followers: 4820,
  },
];

function MatchesPage() {
  const [active, setActive] = useState(0);

  return (
    <div className="p-6 md:p-8 max-w-6xl">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="h-10 w-10 rounded-2xl bg-primary/20 grid place-items-center">
            <Brain className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">AI Matches</h1>
            <p className="text-sm text-muted-foreground">Your best growth partners, ranked by AI</p>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6">
        {/* Match list */}
        <div className="space-y-3">
          {MATCHES.map((m, i) => (
            <motion.div key={m.name}
              initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.07 }}
              whileHover={{ scale: 1.01 }}
              onClick={() => setActive(i)}
              className={cn("relative overflow-hidden rounded-2xl p-5 border cursor-pointer transition-all",
                active === i ? "border-primary/40 glass-strong" : "border-border/60 glass hover:border-primary/20")}>
              {active === i && (
                <div className={`absolute inset-0 bg-gradient-to-r ${m.gradient} opacity-5`} />
              )}
              <div className="relative flex items-center gap-4">
                <div className={`h-14 w-14 rounded-2xl bg-gradient-to-br ${m.gradient} grid place-items-center text-2xl shrink-0`}>
                  {m.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="font-semibold">{m.name}</span>
                    <span className="text-xs font-bold text-accent glass px-2 py-0.5 rounded-full border border-accent/30">{m.match}% match</span>
                  </div>
                  <p className="text-sm text-muted-foreground truncate">{m.reason}</p>
                  <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><Users className="h-3 w-3" />{m.followers.toLocaleString()}</span>
                    <span className="flex items-center gap-1"><TrendingUp className="h-3 w-3 text-accent" />{m.installs} installs</span>
                    <span>Overlap {m.overlap}</span>
                  </div>
                </div>
                <motion.button whileHover={{ scale: 1.08 }}
                  className="shrink-0 h-9 w-9 rounded-xl grid place-items-center glass border border-border/40 text-muted-foreground hover:text-primary hover:border-primary/40 transition-colors">
                  <ArrowRight className="h-4 w-4" />
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Detail panel */}
        <motion.div key={active} initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }}
          className="glass-strong rounded-2xl border border-border/60 p-6 h-fit space-y-5">
          <div className={`h-16 w-16 rounded-2xl bg-gradient-to-br ${MATCHES[active].gradient} grid place-items-center text-3xl mx-auto`}>
            {MATCHES[active].icon}
          </div>
          <div className="text-center">
            <h3 className="text-xl font-bold">{MATCHES[active].name}</h3>
            <span className="text-sm font-bold text-accent">{MATCHES[active].match}% compatibility</span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {[
              { label: "Overlap", value: MATCHES[active].overlap },
              { label: "Est. Installs", value: MATCHES[active].installs },
              { label: "Trust", value: MATCHES[active].trustScore },
            ].map(s => (
              <div key={s.label} className="glass rounded-xl p-3 text-center border border-border/40">
                <p className="text-sm font-bold">{s.value}</p>
                <p className="text-[10px] text-muted-foreground">{s.label}</p>
              </div>
            ))}
          </div>

          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">AI Reasoning</p>
            <p className="text-sm text-muted-foreground leading-relaxed glass rounded-xl p-3 border border-border/40">
              {MATCHES[active].reason}
            </p>
          </div>

          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">Partnership Options</p>
            <div className="flex flex-wrap gap-1.5">
              {MATCHES[active].tags.map(t => (
                <span key={t} className="text-xs glass px-2.5 py-1 rounded-full border border-border/40 flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3 text-accent" /> {t}
                </span>
              ))}
            </div>
          </div>

          <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold text-white"
            style={{ background: "linear-gradient(135deg, #6C5CE7, #00D4B8)", boxShadow: "0 0 24px -8px rgba(108,92,231,0.6)" }}>
            <Zap className="h-4 w-4" /> Create Growth Pact
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}
