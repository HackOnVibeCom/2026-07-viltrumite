import { motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { Rocket, Compass, Sparkles, ArrowRight } from "lucide-react";

type Props = {
  onCreateClick: () => void;
};

export function EmptyState({ onCreateClick }: Props) {
  return (
    <div className="relative min-h-[80vh] flex items-center justify-center p-6 text-center">
      {/* Glow Backdrops */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[450px] w-[450px] rounded-full opacity-10 blur-[100px] bg-primary pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[350px] w-[350px] rounded-full opacity-10 blur-[80px] bg-accent pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
        className="w-full max-w-xl glass-strong border border-border/50 rounded-3xl p-8 md:p-12 shadow-elevated relative z-10"
      >
        {/* Animated Rocket Wrapper */}
        <motion.div
          animate={{
            y: [0, -12, 0],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="inline-block relative mb-6"
        >
          <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl scale-125" />
          <div className="relative h-20 w-20 rounded-full bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/20 flex items-center justify-center text-4xl">
            🚀
          </div>
        </motion.div>

        <div className="space-y-4 max-w-md mx-auto">
          <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">
            Ready to launch your first app?
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Create your product and let LaunchMesh AI find the best growth partners before launch.
          </p>
        </div>

        {/* Buttons Grid */}
        <div className="mt-8 flex flex-col sm:flex-row items-center gap-4 justify-center">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={onCreateClick}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-bold text-white animated-gradient cursor-pointer"
            style={{ boxShadow: "0 0 30px -8px rgba(108,92,231,0.5)" }}
          >
            Create New Launch
            <Sparkles className="h-4 w-4 text-accent animate-pulse" />
          </motion.button>

          <Link to="/explore" className="w-full sm:w-auto block">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold glass border border-border/60 text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
            >
              <Compass className="h-4 w-4" />
              Explore Launches
            </motion.button>
          </Link>
        </div>

        {/* Mock visual placeholder illustrating locked states */}
        <div className="mt-8 border-t border-border/40 pt-6">
          <div className="flex items-center justify-center gap-6 text-[10px] text-muted-foreground uppercase tracking-widest font-semibold opacity-40">
            <span>No Analytics</span>
            <span>•</span>
            <span>No AI Matches</span>
            <span>•</span>
            <span>No Audience Overlap</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
