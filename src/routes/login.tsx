import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAppProfile } from "@/context/AppProfileContext";
import { Sparkles, ArrowRight, User, Rocket, Shield, Mail, Lock } from "lucide-react";

export const Route = createFileRoute("/login")({
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAppProfile();
  const [stage, setStage] = useState<"login" | "select">("login");
  const [email, setEmail] = useState("vibe@gmail.com");
  const [password, setPassword] = useState("12345");
  const [loading, setLoading] = useState(false);

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStage("select");
    }, 800);
  };

  const handleQuickLogin = (role: "explorer" | "founder", name: string) => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      login(role, name);
      if (role === "explorer") {
        navigate({ to: "/explore" });
      } else {
        navigate({ to: "/founder" });
      }
    }, 600);
  };

  return (
    <div className="relative min-h-screen bg-background text-foreground flex items-center justify-center p-6 overflow-hidden">
      {/* Background Gradients & Particles */}
      <div className="absolute inset-0 grid-bg radial-fade opacity-40" />
      <div className="absolute -top-40 -left-40 h-[500px] w-[500px] rounded-full bg-primary/25 blur-[120px] pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 h-[500px] w-[500px] rounded-full bg-accent/20 blur-[120px] pointer-events-none" />

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-primary/20"
            style={{
              width: Math.random() * 6 + 2,
              height: Math.random() * 6 + 2,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -40, 0],
              opacity: [0.2, 0.7, 0.2],
            }}
            transition={{
              duration: Math.random() * 6 + 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      <AnimatePresence mode="wait">
        {stage === "login" ? (
          <motion.div
            key="login"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className="w-full max-w-md glass-strong rounded-3xl p-8 border border-primary/25 shadow-elevated relative z-10"
          >
            {/* Logo */}
            <div className="flex items-center gap-3 justify-center mb-8">
              <div className="relative h-9 w-9">
                <div className="absolute inset-0 rounded-lg animated-gradient animate-pulse" />
                <div className="absolute inset-[3px] rounded-[5px] bg-background grid place-items-center">
                  <div className="h-2 w-2 rounded-full bg-accent" />
                </div>
              </div>
              <span className="text-xl font-bold tracking-tight">LaunchMesh</span>
            </div>

            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold">Welcome Back</h2>
              <p className="text-sm text-muted-foreground mt-1">Sign in to orchestrate your next launch.</p>
            </div>

            <form onSubmit={handleSignIn} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-3 h-4 w-4 text-muted-foreground" />
                  <input
                    type="email"
                    required
                    placeholder="vibe@gmail.com"
                    className="w-full glass bg-white/5 border border-border/40 focus:border-primary/60 outline-none rounded-xl pl-10 pr-4 py-2.5 text-sm transition-all"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-3 h-4 w-4 text-muted-foreground" />
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    className="w-full glass bg-white/5 border border-border/40 focus:border-primary/60 outline-none rounded-xl pl-10 pr-4 py-2.5 text-sm transition-all"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold text-white cursor-pointer"
                style={{ background: "linear-gradient(135deg, #6C5CE7, #00D4B8)", boxShadow: "0 0 30px -8px rgba(108,92,231,0.5)" }}
              >
                {loading ? "Authenticating..." : "Sign In"}
                <ArrowRight className="h-4 w-4" />
              </motion.button>
            </form>

            <div className="relative my-6 flex items-center justify-center">
              <div className="absolute inset-x-0 h-px bg-border/40" />
              <span className="relative px-3 bg-[#0A051D] text-xs text-muted-foreground uppercase tracking-wider font-semibold">Quick Sandbox Demo Login</span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => handleQuickLogin("founder", "Alex")}
                className="glass rounded-xl p-3 border border-border hover:border-primary/50 text-center cursor-pointer transition-all hover:bg-white/5"
              >
                <Rocket className="h-5 w-5 text-primary mx-auto mb-1.5" />
                <p className="text-xs font-semibold">Founder Space</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">Log in as Alex</p>
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin("explorer", "Sarah")}
                className="glass rounded-xl p-3 border border-border hover:border-accent/50 text-center cursor-pointer transition-all hover:bg-white/5"
              >
                <User className="h-5 w-5 text-accent mx-auto mb-1.5" />
                <p className="text-xs font-semibold">Explore Space</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">Log in as Sarah</p>
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="select"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className="w-full max-w-2xl text-center relative z-10"
          >
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mb-8"
            >
              <div className="inline-flex items-center gap-1.5 bg-primary/20 border border-primary/30 rounded-full px-3 py-1 text-xs text-primary mb-3">
                <Sparkles className="h-3.5 w-3.5 text-accent" />
                <span>Select Workspace</span>
              </div>
              <h2 className="text-3xl font-extrabold tracking-tight">Choose your entry path</h2>
              <p className="text-muted-foreground mt-1.5 text-sm max-w-md mx-auto">
                Decide whether you are exploring new launches, or managing your own product launch workspace.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-6 max-w-xl mx-auto">
              <motion.div
                whileHover={{ y: -6, scale: 1.02 }}
                onClick={() => handleQuickLogin("explorer", "Alex")}
                className="glass-strong rounded-3xl p-6 border border-border/60 hover:border-accent/40 text-left cursor-pointer transition-all relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="h-12 w-12 rounded-2xl bg-accent/20 border border-accent/30 grid place-items-center mb-4">
                  <User className="h-6 w-6 text-accent" />
                </div>
                <h3 className="text-lg font-bold">👤 Explore Launches</h3>
                <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                  Browse products launching today or upcoming, follow and upvote other founders, write feedback comments, and receive notifications.
                </p>
                <div className="flex items-center gap-1.5 text-xs text-accent font-semibold mt-4 group-hover:gap-2.5 transition-all">
                  <span>Enter Explorer Mode</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </div>
              </motion.div>

              <motion.div
                whileHover={{ y: -6, scale: 1.02 }}
                onClick={() => handleQuickLogin("founder", "Alex")}
                className="glass-strong rounded-3xl p-6 border border-border/60 hover:border-primary/40 text-left cursor-pointer transition-all relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="h-12 w-12 rounded-2xl bg-primary/20 border border-primary/30 grid place-items-center mb-4">
                  <Rocket className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-bold">🚀 Founder Workspace</h3>
                <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                  Launch your app, run intelligent matches to find non-competing growth partners, draft co-promotional Growth Pacts, and check analytics.
                </p>
                <div className="flex items-center gap-1.5 text-xs text-primary font-semibold mt-4 group-hover:gap-2.5 transition-all">
                  <span>Enter Founder Mode</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
