import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { HelpCircle, ChevronDown } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/explore/help")({
  component: HelpPage,
});

const FAQS = [
  { q: "How do I follow an app?", a: "Click the Follow button on any app card or detail page to get notified about updates and launches." },
  { q: "What does Notify Me do?", a: "You'll receive a notification when the app officially launches or releases a major update." },
  { q: "How are trending apps ranked?", a: "Trending is based on upvotes, follower growth, and engagement over the past 24 hours." },
  { q: "Can I submit my own app?", a: "Yes! Click the Founder Workspace button in the sidebar to launch your own app on LaunchMesh." },
  { q: "What are Collections?", a: "Collections are curated lists of apps grouped by theme, use case, or audience — like 'Student Essentials' or 'AI Builders'." },
];

function HelpPage() {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <div className="p-6 md:p-8 max-w-2xl">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="h-10 w-10 rounded-2xl bg-primary/20 grid place-items-center">
            <HelpCircle className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Help Center</h1>
            <p className="text-sm text-muted-foreground">Frequently asked questions</p>
          </div>
        </div>
      </motion.div>
      <div className="space-y-2">
        {FAQS.map((faq, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
            className="glass-strong rounded-2xl border border-border/60 overflow-hidden">
            <button onClick={() => setOpen(open === i ? null : i)}
              className="w-full flex items-center justify-between px-5 py-4 text-left">
              <span className="text-sm font-medium">{faq.q}</span>
              <motion.div animate={{ rotate: open === i ? 180 : 0 }}>
                <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0" />
              </motion.div>
            </button>
            {open === i && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}
                className="px-5 pb-4 text-sm text-muted-foreground leading-relaxed border-t border-border/40 pt-3">
                {faq.a}
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
