import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowLeft, Rocket, Sparkles } from "lucide-react";

export const Route = createFileRoute("/founder")({
  component: FounderPlaceholder,
});

function FounderPlaceholder() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center px-6">
      {/* Background orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 h-96 w-96 rounded-full opacity-20 blur-3xl"
          style={{ background: "radial-gradient(circle, #6C5CE7, transparent 70%)" }} />
        <div className="absolute bottom-1/4 right-1/4 h-64 w-64 rounded-full opacity-15 blur-3xl"
          style={{ background: "radial-gradient(circle, #00D4B8, transparent 70%)" }} />
      </div>

      <div className="relative text-center max-w-xl">
        <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, type: "spring" }}
          className="h-24 w-24 rounded-3xl mx-auto mb-8 grid place-items-center text-4xl"
          style={{
            background: "linear-gradient(135deg, rgba(108,92,231,0.3), rgba(0,212,184,0.2))",
            border: "1px solid rgba(108,92,231,0.4)",
            boxShadow: "0 0 60px -10px rgba(108,92,231,0.6)",
          }}>
          🚀
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <div className="inline-flex items-center gap-2 glass rounded-full px-3 py-1.5 text-xs text-muted-foreground mb-4">
            <Sparkles className="h-3 w-3 text-accent" />
            Coming very soon
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            <span className="gradient-brand">Founder Workspace</span>
          </h1>
          <p className="text-muted-foreground text-lg leading-relaxed mb-8">
            The full founder experience — launch pages, AI matching, growth pacts,
            analytics and more — is being built right now.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link to="/explore">
              <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                className="flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold bg-primary text-white shadow-glow">
                <ArrowLeft className="h-4 w-4" /> Back to Explorer
              </motion.button>
            </Link>
            <motion.button whileHover={{ scale: 1.04 }}
              className="flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold glass border border-border/60 text-muted-foreground hover:text-foreground transition-colors">
              <Rocket className="h-4 w-4" /> Join Waitlist
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
