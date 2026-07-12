import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import {
  Handshake, Zap, CheckCircle2, Clock, ArrowRight, Plus, TrendingUp,
  Users, BarChart3, Sparkles, Send, RefreshCw, X, Calendar
} from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { useAnalysis } from "@/context/AnalysisContext";
import { useAppProfile } from "@/context/AppProfileContext";
import { PactModal } from "@/components/founder/PactModal";
import { MOCK_ANALYSIS } from "@/data/analysisData";

export const Route = createFileRoute("/founder/pacts")({
  component: PactsPage,
});

const STATUS_STYLES: Record<string, string> = {
  active: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  pending: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  changes: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  rejected: "bg-rose-500/20 text-rose-400 border-rose-500/30",
  draft: "bg-white/10 text-muted-foreground border-border/40",
};

const STATUS_LABELS: Record<string, string> = {
  active: "✅ Active",
  pending: "⏳ Pending",
  changes: "📝 Revisions",
  rejected: "❌ Rejected",
  draft: "📄 Draft",
};

function useLivePacts() {
  const [pacts, setPacts] = useState<any[]>([]);

  useEffect(() => {
    const load = () => {
      const stored = localStorage.getItem("lm_pacts");
      setPacts(stored ? JSON.parse(stored) : []);
    };
    load();
    const interval = setInterval(load, 1500);
    return () => clearInterval(interval);
  }, []);

  return pacts;
}

function PactsPage() {
  const { result } = useAnalysis();
  const { profile } = useAppProfile();
  const [pactOpen, setPactOpen] = useState(false);
  const [selectedPartner, setSelectedPartner] = useState<any | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const livePacts = useLivePacts();
  const matches = result?.topPartners ?? MOCK_ANALYSIS.topPartners;

  const openPact = (partner: any) => {
    setSelectedPartner(partner);
    setPactOpen(true);
  };

  const handlePactSuccess = () => {
    // Pact saved — the useLivePacts hook will auto-refresh
  };

  const activePacts = livePacts.filter((p) => p.status === "active");
  const pendingPacts = livePacts.filter((p) => p.status === "pending");
  const totalExpected = livePacts.reduce((s, p) => s + (p.expectedInstalls || 0), 0);

  return (
    <div className="pt-20 md:pt-24 px-6 md:px-8 pb-6 md:pb-8 max-w-5xl">
      {/* Page Header */}
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
          <button
            onClick={() => openPact(matches[0])}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white cursor-pointer hover:scale-[1.02] transition-transform"
            style={{
              background: "linear-gradient(135deg, #6C5CE7, #00D4B8)",
              boxShadow: "0 0 24px -8px rgba(108,92,231,0.5)",
            }}
          >
            <Plus className="h-4 w-4" /> New Pact
          </button>
        </div>
      </motion.div>

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { icon: CheckCircle2, label: "Active Pacts", value: String(activePacts.length), color: "#10B981" },
          { icon: Clock, label: "Pending", value: String(pendingPacts.length), color: "#F59E0B" },
          { icon: TrendingUp, label: "Total Est. Installs", value: `+${totalExpected.toLocaleString()}`, color: "#6C5CE7" },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="glass-strong rounded-2xl p-4 border border-border/60"
          >
            <div className="flex items-start justify-between mb-2">
              <div
                className="h-8 w-8 rounded-xl grid place-items-center"
                style={{ background: `${stat.color}20`, border: `1px solid ${stat.color}30` }}
              >
                <stat.icon className="h-4 w-4" style={{ color: stat.color }} />
              </div>
            </div>
            <p className="text-xl font-bold">{stat.value}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Live Pacts List */}
      {livePacts.length > 0 && (
        <div className="mb-8 space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="h-4 w-4 text-accent animate-pulse" />
            <h2 className="text-base font-semibold">My Growth Pacts</h2>
            <span className="text-xs text-muted-foreground glass px-2 py-0.5 rounded-full border border-border/40 ml-1">
              {livePacts.length} total
            </span>
          </div>
          {livePacts.map((pact) => (
            <motion.div
              key={pact.pact_id}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              className="glass-strong rounded-2xl border border-border/60 overflow-hidden"
            >
              <button
                onClick={() => setExpandedId(expandedId === pact.pact_id ? null : pact.pact_id)}
                className="w-full flex items-center gap-4 p-4 text-left cursor-pointer hover:bg-white/5 transition-colors"
              >
                <div className={`h-12 w-12 rounded-2xl bg-gradient-to-br ${pact.partnerGradient || "from-violet-500 to-purple-700"} grid place-items-center text-xl shrink-0`}>
                  {pact.partnerIcon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="font-semibold text-sm">{pact.partnerName}</span>
                    <span className={cn("text-[10px] font-bold px-2 py-0.5 rounded-full border", STATUS_STYLES[pact.status])}>
                      {STATUS_LABELS[pact.status]}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground truncate">{pact.campaignType}</p>
                  <div className="flex items-center gap-3 mt-1 text-[10px] text-muted-foreground">
                    <span>Compatibility: <strong className="text-white">{pact.compatibility}%</strong></span>
                    <span>Est. Installs: <strong className="text-accent">+{pact.expectedInstalls}</strong></span>
                    <span>CTR: <strong className="text-white">{pact.expectedCtr}</strong></span>
                  </div>
                </div>
                <ArrowRight className={cn("h-4 w-4 text-muted-foreground shrink-0 transition-transform duration-200", expandedId === pact.pact_id && "rotate-90")} />
              </button>

              <AnimatePresence>
                {expandedId === pact.pact_id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden border-t border-border/40"
                  >
                    <div className="p-4 space-y-4">
                      {/* Why matched */}
                      <div>
                        <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold mb-1.5">AI Match Reasoning</p>
                        <p className="text-xs text-muted-foreground leading-relaxed glass rounded-xl p-3 border border-border/40">
                          {pact.whyMatch}
                        </p>
                      </div>

                      {/* Campaign suggestions */}
                      {pact.campaignSuggestions?.length > 0 && (
                        <div>
                          <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold mb-1.5">Campaign Plan</p>
                          <ul className="space-y-1">
                            {pact.campaignSuggestions.map((s: string, i: number) => (
                              <li key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
                                <CheckCircle2 className="h-3.5 w-3.5 text-accent shrink-0 mt-0.5" />
                                {s}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Milestones */}
                      {pact.timeline?.length > 0 && (
                        <div>
                          <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold mb-1.5">Timeline Milestones</p>
                          <ul className="space-y-1">
                            {pact.timeline.map((t: string, i: number) => (
                              <li key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
                                <Calendar className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" />
                                {t}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Pact created time */}
                      <p className="text-[10px] text-muted-foreground">
                        Sent: {new Date(pact.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      )}

      {/* Suggested Partners */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Users className="h-4 w-4 text-primary" />
          <h2 className="text-base font-semibold">Suggested Partners</h2>
          <span className="text-xs text-muted-foreground glass px-2 py-0.5 rounded-full border border-border/40 ml-1">
            AI recommendations
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {matches.map((match, i) => {
            const alreadySent = livePacts.some(
              (p) => p.partnerName.toLowerCase() === match.name.toLowerCase()
            );
            return (
              <motion.div
                key={match.name}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07 }}
                className="glass-strong rounded-2xl border border-border/60 p-5 flex flex-col gap-4 hover:border-primary/30 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className={`h-12 w-12 rounded-2xl bg-gradient-to-br ${match.gradient} grid place-items-center text-2xl shrink-0`}>
                    {match.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm truncate">{match.name}</span>
                      <span className="text-xs font-bold text-accent glass px-2 py-0.5 rounded-full border border-accent/30 shrink-0">
                        {match.match}%
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5 truncate">{match.reason}</p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  {[
                    { label: "Overlap", value: match.overlap },
                    { label: "Est. Installs", value: match.installs },
                    { label: "Trust", value: match.trustScore },
                  ].map((s) => (
                    <div key={s.label} className="glass rounded-xl p-2 text-center border border-border/40">
                      <p className="text-xs font-bold">{s.value}</p>
                      <p className="text-[9px] text-muted-foreground">{s.label}</p>
                    </div>
                  ))}
                </div>

                {alreadySent ? (
                  <div className="flex items-center justify-center gap-2 py-2 text-xs text-muted-foreground glass rounded-xl border border-border/40">
                    <CheckCircle2 className="h-4 w-4 text-accent" />
                    Pact Request Sent
                  </div>
                ) : (
                  <button
                    onClick={() => openPact(match)}
                    className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold text-white cursor-pointer hover:scale-[1.01] transition-transform"
                    style={{
                      background: "linear-gradient(135deg, #6C5CE7, #00D4B8)",
                      boxShadow: "0 0 20px -8px rgba(108,92,231,0.5)",
                    }}
                  >
                    <Send className="h-3.5 w-3.5" /> Send Partnership Request
                  </button>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>

      <PactModal
        isOpen={pactOpen}
        onClose={() => setPactOpen(false)}
        partner={selectedPartner}
        onSuccess={handlePactSuccess}
      />
    </div>
  );
}
