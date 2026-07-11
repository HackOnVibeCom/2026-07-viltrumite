import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { MessageSquare, Send } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/explore/feedback")({
  component: FeedbackPage,
});

function FeedbackPage() {
  const [sent, setSent] = useState(false);
  const [type, setType] = useState("suggestion");
  const [msg, setMsg] = useState("");

  return (
    <div className="p-6 md:p-8 max-w-2xl">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="h-10 w-10 rounded-2xl bg-accent/20 grid place-items-center">
            <MessageSquare className="h-5 w-5 text-accent" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Feedback</h1>
            <p className="text-sm text-muted-foreground">Help us make LaunchMesh better</p>
          </div>
        </div>
      </motion.div>

      {sent ? (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
          className="glass-strong rounded-3xl border border-accent/30 p-12 text-center">
          <div className="text-5xl mb-4">🎉</div>
          <h2 className="text-xl font-bold mb-2">Thanks for your feedback!</h2>
          <p className="text-sm text-muted-foreground">We read every single submission and use it to improve LaunchMesh.</p>
          <button onClick={() => { setSent(false); setMsg(""); }}
            className="mt-6 text-sm text-primary hover:underline">Submit another</button>
        </motion.div>
      ) : (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
          className="glass-strong rounded-2xl border border-border/60 p-6 space-y-5">
          <div>
            <label className="text-sm font-medium text-muted-foreground block mb-2">Type</label>
            <div className="flex gap-2 flex-wrap">
              {["suggestion", "bug", "feature", "other"].map(t => (
                <button key={t} onClick={() => setType(t)}
                  className={`px-4 py-2 rounded-xl text-sm capitalize transition-all border ${type === t ? "bg-primary/20 text-primary border-primary/40" : "glass border-border/60 text-muted-foreground hover:text-foreground"}`}>
                  {t}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground block mb-2">Your feedback</label>
            <textarea value={msg} onChange={e => setMsg(e.target.value)} rows={5} placeholder="Tell us what's on your mind..."
              className="w-full bg-background/60 border border-border/60 rounded-xl px-4 py-3 text-sm outline-none focus:border-primary/60 transition-colors resize-none" />
          </div>
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
            onClick={() => msg.trim() && setSent(true)}
            className="flex items-center gap-2 px-6 py-2.5 bg-primary text-white rounded-xl text-sm font-semibold shadow-glow">
            <Send className="h-4 w-4" /> Send Feedback
          </motion.button>
        </motion.div>
      )}
    </div>
  );
}
