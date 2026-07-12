import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import {
  Sparkles, Users, ArrowRight, Brain,
  Rocket, CheckCircle2, AlertTriangle, Globe,
  Package, MessageSquare, ChevronRight, Loader2,
} from "lucide-react";
import { MOCK_ANALYSIS } from "@/data/analysisData";
import { useAnalysis } from "@/context/AnalysisContext";

export const Route = createFileRoute("/founder/analysis")({
  component: AnalysisResultsPage,
});

function ScoreRing({ score, color, label }: { score: number; color: string; label: string }) {
  const r = 36;
  const circ = 2 * Math.PI * r;
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  return (
    <div ref={ref} className="flex flex-col items-center gap-2">
      <div className="relative h-24 w-24">
        <svg className="h-24 w-24 -rotate-90" viewBox="0 0 88 88">
          <circle cx="44" cy="44" r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="6" />
          <motion.circle cx="44" cy="44" r={r} fill="none" stroke={color} strokeWidth="6"
            strokeLinecap="round"
            initial={{ strokeDasharray: circ, strokeDashoffset: circ }}
            animate={inView ? { strokeDashoffset: circ - (circ * score) / 100 } : {}}
            transition={{ duration: 1.2, ease: "easeOut" }} />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-xl font-bold">{score}</span>
          <span className="text-[10px] text-muted-foreground">/ 100</span>
        </div>
      </div>
      <span className="text-xs text-muted-foreground">{label}</span>
    </div>
  );
}

function ProgressBar({ label, pct, color, delay }: { label: string; pct: number; color: string; delay: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  return (
    <div ref={ref} className="space-y-1.5">
      <div className="flex justify-between text-sm">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-semibold" style={{ color }}>{pct}%</span>
      </div>
      <div className="h-2 rounded-full bg-white/5 overflow-hidden">
        <motion.div className="h-full rounded-full"
          initial={{ width: 0 }}
          animate={inView ? { width: `${pct}%` } : {}}
          transition={{ duration: 1, delay, ease: "easeOut" }}
          style={{ background: color }} />
      </div>
    </div>
  );
}

function TypedText({ lines }: { lines: string[] }) {
  return (
    <div className="space-y-3">
      {lines.map((line, i) => {
        const parts = line.split(/\*\*(.*?)\*\*/g);
        return (
          <motion.div key={i}
            initial={{ opacity: 0, x: -8 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="flex items-start gap-2.5">
            <div className="h-1.5 w-1.5 rounded-full bg-accent mt-2 shrink-0" />
            <p className="text-sm text-muted-foreground leading-relaxed">
              {parts.map((p, j) =>
                j % 2 === 1
                  ? <strong key={j} className="text-foreground font-semibold">{p}</strong>
                  : p
              )}
            </p>
          </motion.div>
        );
      })}
    </div>
  );
}

function AnalysisResultsPage() {
  const navigate = useNavigate();
  const { result, status } = useAnalysis();
  const data = result ?? MOCK_ANALYSIS;
  const isLive = Boolean(result);

  if (status === "loading") {
    return (
      <div className="flex min-h-[60vh] items-center justify-center p-8">
        <div className="text-center space-y-4">
          <Loader2 className="h-10 w-10 animate-spin text-accent mx-auto" />
          <p className="text-muted-foreground">LaunchMesh AI is analyzing your app...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 max-w-6xl space-y-8">

      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-2 mb-2">
          <Brain className="h-5 w-5 text-accent" />
          <span className="text-xs font-semibold uppercase tracking-widest text-accent">
            {isLive ? "AI Analysis Complete" : "Sample Growth Report"}
          </span>
        </div>
        <h1 className="text-3xl font-bold">{data.appIcon} {data.appName} — Growth Report</h1>
        <p className="text-muted-foreground mt-1">AI analyzed your app and found significant growth opportunities. Here's everything.</p>
      </motion.div>

      {/* Score row */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="glass-strong rounded-3xl border border-primary/30 p-6 relative overflow-hidden"
        style={{ boxShadow: "0 0 60px -20px rgba(108,92,231,0.4)" }}>
        <div className="absolute inset-0 grid-bg opacity-10" />
        <div className="absolute -top-10 -right-10 h-48 w-48 rounded-full blur-3xl opacity-20"
          style={{ background: "radial-gradient(circle, #6C5CE7, transparent 70%)" }} />
        <div className="relative grid grid-cols-2 md:grid-cols-4 gap-6 items-center">
          <ScoreRing score={data.growthScore} color="#6C5CE7" label="Growth Score" />
          <ScoreRing score={data.aiConfidence} color="#00D4B8" label="AI Confidence" />
          <div className="text-center">
            <div className="text-3xl font-bold text-white">{data.expectedInstalls}</div>
            <div className="text-xs text-muted-foreground mt-1">Expected Installs</div>
            <div className="text-xs text-accent mt-0.5 font-semibold">This month</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-white">{data.bestLaunchDay}</div>
            <div className="text-xs text-muted-foreground mt-1">Best Launch Day</div>
            <div className="text-xs text-accent mt-0.5 font-semibold">+42% visibility</div>
          </div>
        </div>
      </motion.div>

      {/* Top Partners */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <Users className="h-4 w-4 text-primary" />
          <h2 className="text-lg font-bold">Top 5 Partner Matches</h2>
          <span className="ml-auto text-xs text-muted-foreground glass px-2 py-0.5 rounded-full">AI ranked</span>
        </div>
        <div className="space-y-3">
          {data.topPartners.map((p, i) => (
            <motion.div key={p.id}
              initial={{ opacity: 0, x: -16 }} whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }} transition={{ delay: i * 0.07 }}
              whileHover={{ scale: 1.01 }}
              className="relative overflow-hidden glass-strong rounded-2xl p-5 border border-border/60 hover:border-primary/30 transition-colors">
              <div className={`absolute inset-0 bg-gradient-to-r ${p.gradient} opacity-5`} />
              <div className="relative flex items-center gap-4">
                <div className="shrink-0 h-8 w-8 glass rounded-full grid place-items-center text-sm font-bold text-muted-foreground">
                  #{i + 1}
                </div>
                <div className={`h-12 w-12 rounded-2xl bg-gradient-to-br ${p.gradient} grid place-items-center text-2xl shrink-0`}>
                  {p.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="font-semibold">{p.name}</span>
                    <span className="text-xs font-bold text-accent glass px-2 py-0.5 rounded-full border border-accent/30">{p.match}% match</span>
                  </div>
                  <p className="text-xs text-muted-foreground truncate">{p.reason}</p>
                  <div className="flex items-center gap-3 mt-1.5 text-xs text-muted-foreground">
                    <span>Overlap {p.overlap}</span>
                    <span className="text-accent font-semibold">{p.installs} installs</span>
                    <span>Trust {p.trustScore}</span>
                    {p.tags.slice(0, 2).map(t => (
                      <span key={t} className="glass px-2 py-0.5 rounded-full border border-border/40">{t}</span>
                    ))}
                  </div>
                </div>
                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                  onClick={() => navigate({ to: "/founder/pacts" })}
                  className="shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold border border-primary/40 bg-primary/15 text-primary hover:bg-primary/25 transition-colors">
                  Pact <ArrowRight className="h-3 w-3" />
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Audience + Strategy row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Audience Insights */}
        <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="glass-strong rounded-2xl border border-border/60 p-6">
          <div className="flex items-center gap-2 mb-5">
            <Globe className="h-4 w-4 text-accent" />
            <h3 className="text-base font-semibold">Audience Insights</h3>
          </div>
          <div className="space-y-4">
            {data.audienceInsights.map((a, i) => (
              <ProgressBar key={a.segment} label={a.segment} pct={a.pct} color={a.color} delay={i * 0.1} />
            ))}
          </div>
        </motion.div>

        {/* Launch Strategy */}
        <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="glass-strong rounded-2xl border border-border/60 p-6">
          <div className="flex items-center gap-2 mb-5">
            <Rocket className="h-4 w-4 text-primary" />
            <h3 className="text-base font-semibold">Launch Strategy</h3>
          </div>
          <TypedText lines={data.launchStrategy} />
        </motion.div>
      </div>

      {/* Bundle + Communities row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recommended Bundle */}
        <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="glass-strong rounded-2xl border border-border/60 p-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/5" />
          <div className="relative">
            <div className="flex items-center gap-2 mb-3">
              <Package className="h-4 w-4 text-accent" />
              <h3 className="text-base font-semibold">Recommended Bundle</h3>
            </div>
            <div className="glass rounded-2xl p-4 border border-primary/20">
              <p className="text-xl font-bold">{data.recommendedBundle}</p>
              <p className="text-sm text-muted-foreground mt-1">AI-assembled from your top partner matches</p>
              <div className="flex flex-wrap gap-2 mt-3">
                {data.topPartners.slice(0, 3).map(p => (
                  <span key={p.id} className="text-xs glass px-2.5 py-1 rounded-full border border-border/40 flex items-center gap-1">
                    {p.icon} {p.name}
                  </span>
                ))}
              </div>
              <div className="flex items-center justify-between mt-4">
                <div>
                  <p className="text-xs text-muted-foreground">Expected combined reach</p>
                  <p className="text-xl font-bold gradient-brand">48,000+</p>
                </div>
                <motion.button whileHover={{ scale: 1.04 }}
                  onClick={() => navigate({ to: "/founder/bundles" })}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-white"
                  style={{ background: "linear-gradient(135deg, #6C5CE7, #00D4B8)" }}>
                  Build Bundle
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Top Communities */}
        <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="glass-strong rounded-2xl border border-border/60 p-6">
          <div className="flex items-center gap-2 mb-5">
            <MessageSquare className="h-4 w-4 text-primary" />
            <h3 className="text-base font-semibold">Top Communities to Promote In</h3>
          </div>
          <div className="space-y-2.5">
            {data.topCommunities.map((c, i) => (
              <motion.div key={c.name}
                initial={{ opacity: 0, x: -8 }} whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.07 }}
                className="flex items-center gap-3 glass rounded-xl px-4 py-2.5 border border-border/40">
                <div className="h-7 w-7 rounded-lg bg-primary/20 grid place-items-center text-xs font-bold text-primary shrink-0">
                  #{i + 1}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">{c.name}</p>
                  <p className="text-xs text-muted-foreground">{c.size} members</p>
                </div>
                <span className="text-xs font-bold text-accent">{c.fit} fit</span>
                <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Risks + Opportunities */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="glass-strong rounded-2xl border border-rose-500/20 p-6">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="h-4 w-4 text-rose-400" />
            <h3 className="text-base font-semibold">Risks</h3>
          </div>
          <div className="space-y-3">
            {data.risks.map((r, i) => (
              <motion.div key={i}
                initial={{ opacity: 0, x: -8 }} whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                className="flex items-start gap-2.5 glass rounded-xl p-3.5 border border-rose-500/10">
                <div className="h-1.5 w-1.5 rounded-full bg-rose-400 mt-2 shrink-0" />
                <p className="text-sm text-muted-foreground leading-relaxed">{r}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="glass-strong rounded-2xl border border-accent/20 p-6">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="h-4 w-4 text-accent" />
            <h3 className="text-base font-semibold">Opportunities</h3>
          </div>
          <div className="space-y-3">
            {data.opportunities.map((o, i) => (
              <motion.div key={i}
                initial={{ opacity: 0, x: -8 }} whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                className="flex items-start gap-2.5 glass rounded-xl p-3.5 border border-accent/10">
                <CheckCircle2 className="h-4 w-4 text-accent mt-0.5 shrink-0" />
                <p className="text-sm text-muted-foreground leading-relaxed">{o}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Big CTAs */}
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
        className="relative overflow-hidden rounded-3xl p-8 border border-primary/30 text-center"
        style={{
          background: "linear-gradient(135deg, rgba(108,92,231,0.18), rgba(0,212,184,0.10))",
          boxShadow: "0 0 80px -20px rgba(108,92,231,0.5)",
        }}>
        <div className="absolute inset-0 grid-bg opacity-10" />
        <div className="absolute -top-12 -right-12 h-48 w-48 rounded-full blur-3xl opacity-25"
          style={{ background: "radial-gradient(circle, #6C5CE7, transparent 70%)" }} />
        <div className="relative">
          <div className="text-4xl mb-3">🚀</div>
          <h2 className="text-2xl font-bold text-white mb-2">Ready to grow?</h2>
          <p className="text-muted-foreground text-sm max-w-sm mx-auto mb-6">
            Your AI analysis is complete. Create your first Growth Pact with {data.topPartners[0]?.name ?? "a top match"} and get {data.topPartners[0]?.installs ?? "projected"} installs.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}
              onClick={() => navigate({ to: "/founder/pacts" })}
              className="flex items-center gap-2.5 px-8 py-3.5 rounded-2xl text-sm font-bold text-white"
              style={{
                background: "linear-gradient(135deg, #6C5CE7, #00D4B8)",
                boxShadow: "0 0 40px -8px rgba(108,92,231,0.7)",
              }}>
              🚀 Create Growth Pact
            </motion.button>
            <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
              onClick={() => navigate({ to: "/founder/audience" })}
              className="flex items-center gap-2.5 px-8 py-3.5 rounded-2xl text-sm font-semibold glass border border-border/60 text-muted-foreground hover:text-foreground transition-colors">
              🌐 Open Audience Graph
            </motion.button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
