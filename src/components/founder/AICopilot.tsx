import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, X, Send, Sparkles, ChevronDown } from "lucide-react";
import { useAppProfile } from "@/context/AppProfileContext";

type Message = { role: "user" | "ai"; text: string };

const PROMPTS = [
  "Analyze my app",
  "Find growth partners",
  "Generate launch strategy",
  "Improve my app description",
  "Build a launch checklist",
];

const MOCK_RESPONSES: Record<string, string> = {
  "Analyze my app": "**DesignVault Analysis** 🎨\n\nYour app scores **85/100** on AI readiness.\n\n**Strengths:**\n• Strong visual identity\n• Clear value proposition\n• Good platform coverage (Web + Figma)\n\n**Opportunities:**\n• Expand to React Native export\n• Add template marketplace\n• Improve onboarding flow\n\nEstimated growth potential: **+2,400 users** with the right partnerships.",
  "Find growth partners": "**Top 3 Growth Partners for DesignVault** 🤝\n\n1. **StudyFlow** — 96% match\n   Students need design tools. Newsletter swap could reach 12k users.\n\n2. **DevPulse** — 88% match\n   Developers who build need design systems. Bundle opportunity.\n\n3. **NoteMind** — 81% match\n   Visual thinkers overlap perfectly. Joint launch recommended.\n\nWant me to draft a Growth Pact for any of these?",
  "Generate launch strategy": "**7-Day Launch Strategy** 🚀\n\n**Day 1–2:** Soft launch to beta list\n**Day 3:** Product Hunt submission at 12:01 AM PST\n**Day 4:** Newsletter campaign to 8k subscribers\n**Day 5:** Cross-promo with StudyFlow goes live\n**Day 6:** Bundle launch with DevPulse\n**Day 7:** Analytics review + retargeting\n\n**Expected outcome:** 1,200–1,800 installs in first week.",
  "Improve my app description": "**Improved Description** ✨\n\nCurrent: *The Figma library that designs itself*\n\n**Suggested:**\n*\"Stop rebuilding design systems from scratch. DesignVault generates a full production-ready component library from just your brand description — tokens, components, dark mode, and React export included. In minutes, not weeks.\"*\n\nThis version leads with the pain point, highlights the 'wow' moment, and ends with a concrete time-saving claim.",
  "Build a launch checklist": "**Launch Checklist for DesignVault** ✅\n\n**Pre-launch:**\n☐ Set up analytics tracking\n☐ Prepare Product Hunt assets\n☐ Schedule newsletter campaign\n☐ Confirm partnership with StudyFlow\n☐ Set up referral tracking\n\n**Launch day:**\n☐ Post on PH at 12:01 AM PST\n☐ Notify email list\n☐ Post on Twitter/X thread\n☐ Activate cross-promo banners\n\n**Post-launch:**\n☐ Respond to all PH comments\n☐ Review day-1 analytics\n☐ Send thank-you to partners",
};

function formatMessage(text: string) {
  const lines = text.split("\n");
  return lines.map((line, i) => {
    if (line.startsWith("**") && line.endsWith("**")) {
      return <p key={i} className="font-bold text-foreground">{line.replace(/\*\*/g, "")}</p>;
    }
    if (line.includes("**")) {
      const parts = line.split(/\*\*(.*?)\*\*/g);
      return (
        <p key={i} className="text-muted-foreground text-sm leading-relaxed">
          {parts.map((p, j) => j % 2 === 1 ? <strong key={j} className="text-foreground">{p}</strong> : p)}
        </p>
      );
    }
    if (line.startsWith("•") || line.startsWith("☐") || line.match(/^\d\./)) {
      return <p key={i} className="text-sm text-muted-foreground ml-2">{line}</p>;
    }
    if (line === "") return <div key={i} className="h-1" />;
    return <p key={i} className="text-sm text-muted-foreground leading-relaxed">{line}</p>;
  });
}

export function AICopilot() {
  const { profile } = useAppProfile();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  
  // Set initial message once profile is loaded
  useEffect(() => {
    setMessages([
      { role: "ai", text: `Hey! I'm your AI growth copilot 🚀\n\n${profile ? `I see you are working on launching **${profile.appName}** in the **${profile.category}** space. ` : ""}How can I help you optimize your launch strategy, find growth partners, or write copy today?` }
    ]);
  }, [profile]);

  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  const send = async (text: string) => {
    if (!text.trim()) return;
    
    // Add user message to history
    const updatedMessages = [...messages, { role: "user" as const, text }];
    setMessages(updatedMessages);
    setInput("");
    setTyping(true);

    try {
      const response = await fetch("/api/copilot-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          history: messages.slice(-10), // Send last 10 messages of context
          profile
        })
      });

      const data = await response.json();
      setTyping(false);

      if (response.ok && data.reply) {
        setMessages(m => [...m, { role: "ai", text: data.reply }]);
      } else {
        const errorMsg = data.error || "Failed to generate AI reply";
        setMessages(m => [...m, { role: "ai", text: `⚠️ **AI Copilot Connection Error:**\n\n${errorMsg}` }]);
      }
    } catch (err: any) {
      setTyping(false);
      setMessages(m => [...m, { role: "ai", text: `⚠️ **AI Copilot Connection Error:**\n\nFailed to establish connection. Reverting to local fallback:\n\nBased on your app description, I suggest focusing on initial launch newsletter cross-promotions with matched category apps.` }]);
    }
  };

  return (
    <>
      {/* Toggle button */}
      <motion.button
        whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 h-14 w-14 rounded-2xl grid place-items-center z-50 shadow-elevated"
        style={{
          background: "linear-gradient(135deg, #6C5CE7, #00D4B8)",
          boxShadow: "0 0 40px -8px rgba(108,92,231,0.7)",
        }}>
        <AnimatePresence mode="wait">
          {open
            ? <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}><ChevronDown className="h-6 w-6 text-white" /></motion.div>
            : <motion.div key="bot" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }}><Bot className="h-6 w-6 text-white" /></motion.div>
          }
        </AnimatePresence>
      </motion.button>

      {/* Chat window */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="fixed bottom-24 right-6 w-96 h-[560px] z-50 flex flex-col rounded-3xl overflow-hidden border border-border/60 shadow-elevated"
            style={{ background: "linear-gradient(180deg, #12121a 0%, #0a0a0f 100%)" }}>

            {/* Header */}
            <div className="flex items-center gap-3 px-5 py-4 border-b border-border/40"
              style={{ background: "linear-gradient(135deg, rgba(108,92,231,0.15), rgba(0,212,184,0.08))" }}>
              <div className="h-9 w-9 rounded-xl grid place-items-center animated-gradient shrink-0">
                <Bot className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-sm font-semibold">AI Copilot</p>
                <div className="flex items-center gap-1.5">
                  <div className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
                  <span className="text-[10px] text-muted-foreground">Always online</span>
                </div>
              </div>
              <button onClick={() => setOpen(false)} className="ml-auto text-muted-foreground hover:text-foreground transition-colors">
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4" data-lenis-prevent>
              {messages.map((msg, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  {msg.role === "ai" && (
                    <div className="h-7 w-7 rounded-xl animated-gradient grid place-items-center shrink-0 mr-2 mt-0.5">
                      <Sparkles className="h-3.5 w-3.5 text-white" />
                    </div>
                  )}
                  <div className={`max-w-[80%] rounded-2xl px-4 py-3 space-y-0.5 ${
                    msg.role === "user"
                      ? "bg-primary/25 border border-primary/30 text-sm text-foreground"
                      : "glass border border-border/40"
                  }`}>
                    {msg.role === "ai" ? formatMessage(msg.text) : <p className="text-sm">{msg.text}</p>}
                  </div>
                </motion.div>
              ))}
              {typing && (
                <div className="flex items-center gap-2">
                  <div className="h-7 w-7 rounded-xl animated-gradient grid place-items-center shrink-0">
                    <Sparkles className="h-3.5 w-3.5 text-white" />
                  </div>
                  <div className="glass rounded-2xl px-4 py-3 border border-border/40">
                    <div className="flex gap-1 items-center h-4">
                      {[0, 1, 2].map(i => (
                        <motion.div key={i} className="h-1.5 w-1.5 rounded-full bg-accent"
                          animate={{ y: [0, -4, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }} />
                      ))}
                    </div>
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            {/* Suggested prompts */}
            {messages.length <= 1 && (
              <div className="px-4 pb-2">
                <div className="flex flex-wrap gap-1.5">
                  {PROMPTS.map(p => (
                    <button key={p} onClick={() => send(p)}
                      className="text-xs glass border border-border/40 rounded-full px-3 py-1.5 text-muted-foreground hover:text-foreground hover:border-primary/30 transition-colors">
                      {p}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input */}
            <div className="px-4 pb-4 pt-2 border-t border-border/40">
              <div className="flex items-center gap-2 glass rounded-2xl px-4 py-2.5 border border-border/40 focus-within:border-primary/40 transition-colors">
                <input value={input} onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && send(input)}
                  placeholder="Ask your AI copilot..."
                  className="flex-1 bg-transparent text-sm outline-none text-foreground placeholder:text-muted-foreground" />
                <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                  onClick={() => send(input)} disabled={!input.trim()}
                  className="h-7 w-7 rounded-xl grid place-items-center disabled:opacity-30 transition-opacity"
                  style={{ background: "linear-gradient(135deg, #6C5CE7, #00D4B8)" }}>
                  <Send className="h-3.5 w-3.5 text-white" />
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
