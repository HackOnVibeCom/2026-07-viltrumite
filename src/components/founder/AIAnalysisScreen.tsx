import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Sparkles, Loader2, Brain, Zap, Globe } from "lucide-react";

type Props = {
  apiReady: boolean;
  onComplete: () => void;
};

const ANALYSIS_STEPS = [
  "Reading product...",
  "Understanding audience...",
  "Searching similar launches...",
  "Finding complementary apps...",
  "Calculating audience overlap...",
  "Generating launch strategy...",
  "Preparing partnership recommendations..."
];

export function AIAnalysisScreen({ apiReady, onComplete }: Props) {
  const [currentStep, setCurrentStep] = useState(0);
  const [percent, setPercent] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // 1. Tick steps and percentages
  useEffect(() => {
    const totalDuration = 5000; // 5 seconds
    const intervalTime = totalDuration / ANALYSIS_STEPS.length; // ~714ms per step
    
    // Increment steps
    const stepInterval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev < ANALYSIS_STEPS.length - 1) {
          return prev + 1;
        }
        clearInterval(stepInterval);
        return prev;
      });
    }, intervalTime);

    // Smoothly animate progress percentage
    const start = Date.now();
    const percentInterval = setInterval(() => {
      const elapsed = Date.now() - start;
      const progress = Math.min(100, Math.floor((elapsed / totalDuration) * 100));
      setPercent(progress);
      if (progress >= 100) {
        clearInterval(percentInterval);
      }
    }, 30);

    return () => {
      clearInterval(stepInterval);
      clearInterval(percentInterval);
    };
  }, []);

  // 2. Complete condition (Must take 5s + API must be completed)
  useEffect(() => {
    if (percent >= 100 && apiReady) {
      const delay = setTimeout(onComplete, 800);
      return () => clearTimeout(delay);
    }
  }, [percent, apiReady, onComplete]);

  // 3. Floating particle canvas background
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      color: string;
      alpha: number;
      dAlpha: number;
    }> = [];

    const colors = ["#6C5CE7", "#00D4B8", "#8B5CF6", "#C084FC"];

    for (let i = 0; i < 40; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        size: Math.random() * 4 + 1.5,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: Math.random() * 0.5 + 0.1,
        dAlpha: (Math.random() - 0.5) * 0.005,
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw node connection lines
      ctx.strokeStyle = "rgba(108, 92, 231, 0.04)";
      ctx.lineWidth = 1;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 150) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      // Draw particles
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.alpha += p.dAlpha;

        if (p.alpha <= 0.05 || p.alpha >= 0.75) {
          p.dAlpha = -p.dAlpha;
        }

        if (p.x < 0 || p.x > width) p.vx = -p.vx;
        if (p.y < 0 || p.y > height) p.vy = -p.vy;

        ctx.fillStyle = p.color;
        ctx.globalAlpha = Math.max(0.01, p.alpha);
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      });

      ctx.globalAlpha = 1;
      animId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-[100] bg-background text-foreground flex items-center justify-center p-6 overflow-hidden">
      {/* Particle canvas background */}
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" />

      {/* Glowing backdrop meshes */}
      <div className="absolute top-1/4 left-1/4 h-[500px] w-[500px] rounded-full opacity-20 blur-[130px] bg-primary pointer-events-none animate-float-slow" />
      <div className="absolute bottom-1/4 right-1/4 h-[400px] w-[400px] rounded-full opacity-15 blur-[100px] bg-accent pointer-events-none" />

      <div className="w-full max-w-xl glass-strong border border-primary/20 rounded-3xl p-8 md:p-10 shadow-elevated relative z-10">
        
        {/* Loading Brain visualization */}
        <div className="text-center mb-8">
          <motion.div
            animate={{
              rotate: [0, 8, -8, 0],
              scale: [1, 1.05, 1],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="inline-block relative mb-4"
          >
            <div className="absolute inset-0 bg-primary/25 rounded-full blur-2xl scale-125" />
            <div className="relative h-20 w-20 rounded-2xl bg-gradient-to-br from-[#6C5CE7] to-[#00D4B8] grid place-items-center shadow-glow">
              <Brain className="h-10 w-10 text-white animate-pulse" />
            </div>
          </motion.div>
          <h2 className="text-2xl font-bold tracking-tight">LaunchMesh AI Core</h2>
          <p className="text-sm text-muted-foreground mt-1.5 max-w-sm mx-auto">
            Orchestrating your growth pact match vectors...
          </p>
        </div>

        {/* Custom Progress Ring / Circle */}
        <div className="flex items-center gap-6 mb-8 p-4 glass rounded-2xl border border-border/40">
          <div className="relative h-16 w-16 shrink-0">
            <svg className="h-16 w-16 -rotate-90" viewBox="0 0 60 60">
              <circle cx="30" cy="30" r="26" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="4" />
              <motion.circle
                cx="30"
                cy="30"
                r="26"
                fill="none"
                stroke="url(#progress-gradient)"
                strokeWidth="4"
                strokeDasharray={2 * Math.PI * 26}
                strokeDashoffset={2 * Math.PI * 26 - (2 * Math.PI * 26 * percent) / 100}
                strokeLinecap="round"
                transition={{ duration: 0.1 }}
              />
              <defs>
                <linearGradient id="progress-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#6C5CE7" />
                  <stop offset="100%" stopColor="#00D4B8" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex items-center justify-center text-sm font-bold tabular-nums">
              {percent}%
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-accent uppercase tracking-widest">Growth Engine Running</p>
            <h4 className="text-sm font-semibold truncate text-white mt-0.5">
              {ANALYSIS_STEPS[currentStep]}
            </h4>
          </div>
        </div>

        {/* Steps List */}
        <div className="space-y-3.5">
          {ANALYSIS_STEPS.map((stepText, idx) => {
            const isCompleted = currentStep > idx;
            const isCurrent = currentStep === idx;
            
            return (
              <motion.div
                key={stepText}
                initial={{ opacity: 0.3 }}
                animate={{
                  opacity: isCompleted || isCurrent ? 1 : 0.25,
                  x: isCurrent ? 6 : 0,
                }}
                className="flex items-center gap-3.5"
              >
                <div className={`h-5 w-5 rounded-full grid place-items-center shrink-0 border transition-colors ${
                  isCompleted 
                    ? "bg-accent/20 border-accent/40" 
                    : isCurrent 
                      ? "bg-primary/20 border-primary/40" 
                      : "bg-white/5 border-border/40"
                }`}>
                  {isCompleted ? (
                    <CheckCircle2 className="h-3.5 w-3.5 text-accent" />
                  ) : isCurrent ? (
                    <Loader2 className="h-3 w-3 animate-spin text-primary" />
                  ) : (
                    <div className="h-1.5 w-1.5 rounded-full bg-border" />
                  )}
                </div>
                <span className={`text-xs font-medium ${isCurrent ? "text-white font-bold" : isCompleted ? "text-muted-foreground" : "text-muted-foreground/40"}`}>
                  {stepText}
                </span>
                {isCompleted && (
                  <Sparkles className="h-3.5 w-3.5 text-accent ml-auto animate-pulse" />
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Final Sync Message */}
        {percent >= 100 && !apiReady && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-6 flex items-center justify-center gap-2 text-xs text-muted-foreground border-t border-border/20 pt-4"
          >
            <Loader2 className="h-3.5 w-3.5 animate-spin text-accent" />
            <span>Resolving Oxlo AI growth report...</span>
          </motion.div>
        )}
      </div>
    </div>
  );
}
