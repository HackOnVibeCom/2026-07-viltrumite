import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Brain, ArrowRight, Users, TrendingUp, Zap, CheckCircle2, Sparkles } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useAnalysis } from "@/context/AnalysisContext";
import { useAppProfile } from "@/context/AppProfileContext";
import { PactModal } from "@/components/founder/PactModal";
import { MOCK_ANALYSIS } from "@/data/analysisData";

export const Route = createFileRoute("/founder/matches")({
  component: MatchesPage,
});

function MatchesPage() {
  const [active, setActive] = useState(0);
  const [pactOpen, setPactOpen] = useState(false);
  const [selectedPartner, setSelectedPartner] = useState<any | null>(null);
  const { result } = useAnalysis();

  const matches = result?.topPartners ?? MOCK_ANALYSIS.topPartners;
  const selected = matches[active] ?? matches[0];

  const openPact = (partner: any) => {
    setSelectedPartner(partner);
    setPactOpen(true);
  };

  return (
    <div className="pt-20 md:pt-24 px-6 md:px-8 pb-6 md:pb-8 max-w-6xl" style={{ paddingTop: "40px" }}>
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
        <div className="flex items-center gap-2 mt-3">
          <Sparkles className="h-4 w-4 text-accent animate-pulse" />
          <p className="text-xs text-muted-foreground">
            {matches.length} complementary apps matched — sorted by audience compatibility score
          </p>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_360px] gap-6">
        {/* Match list */}
        <div className="space-y-3">
          {matches.map((match, index) => (
            <motion.div
              key={match.name}
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.07 }}
              whileHover={{ scale: 1.01 }}
              onClick={() => setActive(index)}
              className={cn(
                "relative overflow-hidden rounded-2xl p-5 border cursor-pointer transition-all",
                active === index
                  ? "border-primary/40 glass-strong"
                  : "border-border/60 glass hover:border-primary/20"
              )}
            >
              {active === index && (
                <div className={`absolute inset-0 bg-gradient-to-r ${match.gradient} opacity-5`} />
              )}
              <div className="relative flex items-center gap-4">
                <div className={`h-14 w-14 rounded-2xl bg-gradient-to-br ${match.gradient} grid place-items-center text-2xl shrink-0`}>
                  {match.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="font-semibold">{match.name}</span>
                    <span className="text-xs font-bold text-accent glass px-2 py-0.5 rounded-full border border-accent/30">
                      {match.match}% match
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground truncate">{match.reason}</p>
                  <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <TrendingUp className="h-3 w-3 text-accent" />
                      {match.installs} installs
                    </span>
                    <span>Overlap {match.overlap}</span>
                    <span className="text-primary font-semibold">Trust {match.trustScore}</span>
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.08 }}
                  className="shrink-0 h-9 w-9 rounded-xl grid place-items-center glass border border-border/40 text-muted-foreground hover:text-primary hover:border-primary/40 transition-colors"
                >
                  <ArrowRight className="h-4 w-4" />
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Detail panel */}
        {selected && (
          <motion.div
            key={selected.name}
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass-strong rounded-2xl border border-border/60 p-6 h-fit space-y-5"
          >
            <div className={`h-16 w-16 rounded-2xl bg-gradient-to-br ${selected.gradient} grid place-items-center text-3xl mx-auto`}>
              {selected.icon}
            </div>
            <div className="text-center">
              <h3 className="text-xl font-bold">{selected.name}</h3>
              <span className="text-sm font-bold text-accent">{selected.match}% compatibility</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: "Overlap", value: selected.overlap },
                { label: "Est. Installs", value: selected.installs },
                { label: "Trust", value: selected.trustScore },
              ].map((stat) => (
                <div key={stat.label} className="glass rounded-xl p-3 text-center border border-border/40">
                  <p className="text-sm font-bold">{stat.value}</p>
                  <p className="text-[10px] text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">AI Reasoning</p>
              <p className="text-sm text-muted-foreground leading-relaxed glass rounded-xl p-3 border border-border/40">
                {selected.reason}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">Partnership Tags</p>
              <div className="flex flex-wrap gap-1.5">
                {selected.tags.map((tag: string) => (
                  <span key={tag} className="text-xs glass px-2.5 py-1 rounded-full border border-border/40 flex items-center gap-1">
                    <CheckCircle2 className="h-3 w-3 text-accent" /> {tag}
                  </span>
                ))}
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => openPact(selected)}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold text-white cursor-pointer"
              style={{
                background: "linear-gradient(135deg, #6C5CE7, #00D4B8)",
                boxShadow: "0 0 24px -8px rgba(108,92,231,0.6)",
              }}
            >
              <Zap className="h-4 w-4" /> Create Growth Pact
            </motion.button>
          </motion.div>
        )}
      </div>

      <PactModal
        isOpen={pactOpen}
        onClose={() => setPactOpen(false)}
        partner={selectedPartner}
      />
    </div>
  );
}
