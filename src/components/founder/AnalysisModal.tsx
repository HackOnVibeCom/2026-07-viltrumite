import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Brain, Sparkles, Loader2 } from "lucide-react";
import { ANALYSIS_STEPS } from "@/data/analysisData";

type Props = {
  open: boolean;
  apiComplete: boolean;
  onComplete: () => void;
};

/* ─── Step 1: Profile checklist ─── */
function ProfileStep({ active }: { active: boolean }) {
  const [visible, setVisible] = useState<number>(0);
  useEffect(() => {
    if (!active) return;
    const items = ANALYSIS_STEPS[0].checks;
    items.forEach((_, i) => {
      setTimeout(() => setVisible(i + 1), i * 220 + 200);
    });
  }, [active]);
  return (
    <div className="space-y-2.5">
      {ANALYSIS_STEPS[0].checks.map((check, i) => (
        <motion.div key={check}
          initial={{ opacity: 0, x: -12 }}
          animate={visible > i ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.3 }}
          className="flex items-center gap-3">
          <motion.div
            initial={{ scale: 0 }}
            animate={visible > i ? { scale: 1 } : {}}
            transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.1 }}>
            <CheckCircle2 className="h-4 w-4 text-accent" />
          </motion.div>
          <span className="text-sm text-muted-foreground">{check}</span>
        </motion.div>
      ))}
    </div>
  );
}

/* ─── Step 2: Network visualization ─── */
function NetworkStep({ active }: { active: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (!active) return;
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    const W = canvas.width = canvas.offsetWidth;
    const H = canvas.height = canvas.offsetHeight;

    const nodes = [
      { x: W / 2, y: H / 2, label: "Your App", core: true, color: "#fff" },
      { x: W * 0.2, y: H * 0.3, label: "StudyFlow", core: false, color: "#00D4B8" },
      { x: W * 0.8, y: H * 0.25, label: "FocusFlow", core: false, color: "#6C5CE7" },
      { x: W * 0.15, y: H * 0.72, label: "MindMap", core: false, color: "#F59E0B" },
      { x: W * 0.82, y: H * 0.7, label: "DevPulse", core: false, color: "#EC4899" },
      { x: W * 0.5, y: H * 0.12, label: "NoteMind", core: false, color: "#8B5CF6" },
    ];

    let step = 0;
    const interval = setInterval(() => {
      ctx.clearRect(0, 0, W, H);
      for (let i = 1; i <= Math.min(step, nodes.length - 1); i++) {
        const t = (step - i) / 3;
        const alpha = Math.min(1, t) * 0.6;
        ctx.beginPath();
        ctx.strokeStyle = `rgba(108,92,231,${alpha})`;
        ctx.lineWidth = 1;
        ctx.moveTo(nodes[0].x, nodes[0].y);
        ctx.lineTo(nodes[i].x, nodes[i].y);
        ctx.stroke();
      }
      for (let i = 0; i <= Math.min(step, nodes.length - 1); i++) {
        const n = nodes[i];
        const g = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, n.core ? 30 : 20);
        g.addColorStop(0, n.color + "55");
        g.addColorStop(1, "transparent");
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.core ? 30 : 20, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = n.color;
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.core ? 7 : 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "rgba(255,255,255,0.7)";
        ctx.font = "11px Inter, sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(n.label, n.x, n.y + (n.core ? 20 : 18));
      }
      step++;
      if (step > nodes.length + 4) clearInterval(interval);
    }, 220);
    return () => clearInterval(interval);
  }, [active]);
  return (
    <canvas ref={canvasRef} className="w-full h-36 rounded-xl"
      style={{ background: "rgba(255,255,255,0.03)" }} />
  );
}

/* ─── Step 3: Overlap bars ─── */
function OverlapStep({ active }: { active: boolean }) {
  const segments = ["Students", "Developers", "Founders", "Designers"];
  const targets = [92, 84, 71, 68];
  const colors = ["#6C5CE7", "#00D4B8", "#F59E0B", "#EC4899"];
  const [values, setValues] = useState([0, 0, 0, 0]);
  const [confidence, setConfidence] = useState(0);

  useEffect(() => {
    if (!active) return;
    const start = Date.now();
    const duration = 1200;
    const raf = setInterval(() => {
      const t = Math.min((Date.now() - start) / duration, 1);
      const ease = 1 - Math.pow(1 - t, 3);
      setValues(targets.map(v => Math.round(v * ease)));
      setConfidence(Math.round(94 * ease));
      if (t >= 1) clearInterval(raf);
    }, 16);
    return () => clearInterval(raf);
  }, [active]);

  return (
    <div className="space-y-3">
      {segments.map((s, i) => (
        <div key={s}>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-muted-foreground">{s}</span>
            <span className="font-semibold" style={{ color: colors[i] }}>{values[i]}%</span>
          </div>
          <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
            <motion.div className="h-full rounded-full" style={{ width: `${values[i]}%`, background: colors[i] }} />
          </div>
        </div>
      ))}
      <div className="flex items-center justify-between pt-2 text-xs">
        <span className="text-muted-foreground">AI Confidence</span>
        <span className="font-bold text-accent">{confidence}%</span>
      </div>
    </div>
  );
}

/* ─── Step 4: Typing animation ─── */
function StrategyStep({ active }: { active: boolean }) {
  const full = "Generating optimal launch strategy based on audience patterns, competitor timing, and partnership opportunities...";
  const [text, setText] = useState("");
  useEffect(() => {
    if (!active) return;
    let i = 0;
    const interval = setInterval(() => {
      setText(full.slice(0, i));
      i++;
      if (i > full.length) clearInterval(interval);
    }, 22);
    return () => clearInterval(interval);
  }, [active]);
  return (
    <div className="glass rounded-xl p-4 border border-border/40 min-h-[60px]">
      <p className="text-sm text-muted-foreground leading-relaxed">
        {text}
        <motion.span animate={{ opacity: [1, 0] }} transition={{ duration: 0.5, repeat: Infinity }}
          className="inline-block w-0.5 h-4 bg-accent ml-0.5 align-middle" />
      </p>
    </div>
  );
}

export function AnalysisModal({ open, apiComplete, onComplete }: Props) {
  const [currentStep, setCurrentStep] = useState(-1);
  const [animationDone, setAnimationDone] = useState(false);

  useEffect(() => {
    if (!open) {
      setCurrentStep(-1);
      setAnimationDone(false);
      return;
    }

    let elapsed = 0;
    const timers: ReturnType<typeof setTimeout>[] = [];
    ANALYSIS_STEPS.forEach((step, i) => {
      timers.push(setTimeout(() => setCurrentStep(i), elapsed + 400));
      elapsed += step.duration;
    });
    timers.push(setTimeout(() => setAnimationDone(true), elapsed + 500));
    return () => timers.forEach(clearTimeout);
  }, [open]);

  useEffect(() => {
    if (open && animationDone && apiComplete) {
      const timer = setTimeout(onComplete, 600);
      return () => clearTimeout(timer);
    }
  }, [open, animationDone, apiComplete, onComplete]);

  const progress = currentStep >= 0
    ? Math.min(100, Math.round(((currentStep + 1) / ANALYSIS_STEPS.length) * 100))
    : 0;

  const waitingForApi = animationDone && !apiComplete;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          style={{ background: "rgba(10,10,15,0.95)", backdropFilter: "blur(20px)" }}>

          <div className="absolute top-1/4 left-1/4 h-96 w-96 rounded-full opacity-20 blur-3xl pointer-events-none"
            style={{ background: "radial-gradient(circle, #6C5CE7, transparent 70%)" }} />
          <div className="absolute bottom-1/4 right-1/4 h-64 w-64 rounded-full opacity-15 blur-3xl pointer-events-none"
            style={{ background: "radial-gradient(circle, #00D4B8, transparent 70%)" }} />

          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", stiffness: 280, damping: 24 }}
            className="relative w-full max-w-xl glass-strong rounded-3xl border border-primary/30 p-8 shadow-elevated"
            style={{ boxShadow: "0 0 80px -20px rgba(108,92,231,0.5)" }}>

            <div className="text-center mb-8">
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="text-5xl mb-4 inline-block">🧠</motion.div>
              <h2 className="text-2xl font-bold text-white">LaunchMesh AI Analysis</h2>
              <p className="text-sm text-muted-foreground mt-2">
                Analyzing your app and discovering the best growth opportunities...
              </p>
            </div>

            <div className="mb-6">
              <div className="h-1.5 w-full rounded-full bg-white/5 overflow-hidden">
                <motion.div
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.4 }}
                  className="h-full rounded-full"
                  style={{ background: "linear-gradient(90deg, #6C5CE7, #00D4B8)" }} />
              </div>
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>Step {Math.min(currentStep + 1, 4)} of 4</span>
                <span>{progress}%</span>
              </div>
            </div>

            <div className="space-y-5">
              {ANALYSIS_STEPS.map((step, i) => {
                const isActive = currentStep === i;
                const isDone = currentStep > i || animationDone;
                return (
                  <motion.div key={step.id}
                    initial={{ opacity: 0.3 }}
                    animate={{ opacity: isActive || isDone ? 1 : 0.3 }}
                    className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className={`h-6 w-6 rounded-full grid place-items-center shrink-0 transition-colors ${isDone ? "bg-accent/20 border border-accent/40" : isActive ? "bg-primary/20 border border-primary/40" : "bg-white/5 border border-border/40"}`}>
                        {isDone
                          ? <CheckCircle2 className="h-3.5 w-3.5 text-accent" />
                          : isActive
                            ? <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                className="h-3 w-3 rounded-full border-2 border-primary border-t-transparent" />
                            : <div className="h-1.5 w-1.5 rounded-full bg-border" />
                        }
                      </div>
                      <span className={`text-sm font-medium ${isActive ? "text-foreground" : isDone ? "text-muted-foreground" : "text-muted-foreground/50"}`}>
                        {step.title}
                      </span>
                      {isDone && <Sparkles className="h-3.5 w-3.5 text-accent ml-auto" />}
                    </div>

                    {isActive && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="pl-9">
                        {i === 0 && <ProfileStep active={isActive} />}
                        {i === 1 && <NetworkStep active={isActive} />}
                        {i === 2 && <OverlapStep active={isActive} />}
                        {i === 3 && <StrategyStep active={isActive} />}
                      </motion.div>
                    )}
                  </motion.div>
                );
              })}
            </div>

            {waitingForApi && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="mt-6 flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin text-accent" />
                <span>Waiting for AI response...</span>
              </motion.div>
            )}

            {animationDone && apiComplete && (
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                className="mt-6 text-center">
                <div className="flex items-center justify-center gap-2 text-accent">
                  <CheckCircle2 className="h-5 w-5" />
                  <span className="font-semibold">Analysis complete! Loading results...</span>
                </div>
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
