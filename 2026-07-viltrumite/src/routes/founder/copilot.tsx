import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Bot, Sparkles } from "lucide-react";

export const Route = createFileRoute("/founder/copilot")({
  component: CopilotPage,
});

function CopilotPage() {
  return (
    <div className="p-6 md:p-8 max-w-3xl">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-2xl grid place-items-center animated-gradient">
            <Bot className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">AI Copilot</h1>
            <p className="text-sm text-muted-foreground">Your AI growth assistant — available 24/7</p>
          </div>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="glass-strong rounded-3xl border border-primary/20 p-8 text-center"
        style={{ boxShadow: "0 0 60px -20px rgba(108,92,231,0.4)" }}>
        <div className="h-20 w-20 rounded-3xl animated-gradient grid place-items-center mx-auto mb-5 text-4xl"
          style={{ boxShadow: "0 0 40px -8px rgba(108,92,231,0.6)" }}>
          <Bot className="h-10 w-10 text-white" />
        </div>
        <h2 className="text-2xl font-bold mb-2">AI Copilot is Ready</h2>
        <p className="text-muted-foreground text-sm max-w-sm mx-auto mb-6">
          Use the chat bubble in the bottom-right corner to talk to your AI growth copilot. It can analyze your app, find partners, and build your launch strategy.
        </p>
        <div className="flex flex-wrap justify-center gap-2">
          {["Analyze my app", "Find growth partners", "Generate launch strategy", "Improve my app description", "Build a launch checklist"].map(p => (
            <span key={p} className="text-xs glass border border-border/40 rounded-full px-3 py-1.5 text-muted-foreground flex items-center gap-1.5">
              <Sparkles className="h-3 w-3 text-accent" /> {p}
            </span>
          ))}
        </div>
        <p className="text-xs text-muted-foreground mt-6">
          Click the <span className="text-primary font-semibold">🤖 button</span> in the bottom-right corner to start chatting
        </p>
      </motion.div>
    </div>
  );
}
