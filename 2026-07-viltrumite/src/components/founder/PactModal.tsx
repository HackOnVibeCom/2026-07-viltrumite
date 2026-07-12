/**
 * ⚠️ HACKATHON / DEMO ONLY ⚠️
 * This component calls the Slack Web API directly from the browser.
 * The access token is embedded in the client bundle.
 * Before production, move Slack calls to a secure backend.
 */
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAppProfile } from "@/context/AppProfileContext";
import { generatePact, type PactResult } from "@/lib/api/generate-pact";
import { sendSlackMessage } from "@/lib/slack";
import {
  Sparkles, Check, Send, AlertTriangle, Loader2,
  TrendingUp, Users, ShieldCheck, Mail, Edit3, X, Calendar
} from "lucide-react";
import { toast } from "sonner";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  partner: {
    id: string;
    name: string;
    icon: string;
    match: number;
    overlap: string;
    installs: string;
    trustScore: string;
    reason: string;
    gradient: string;
    category?: string;
    tags?: string[];
  } | null;
  onSuccess?: () => void;
};

export function PactModal({ isOpen, onClose, partner, onSuccess }: Props) {
  const { profile, userName } = useAppProfile();
  const [loading, setLoading] = useState(false);
  const [pactData, setPactData] = useState<PactResult | null>(null);
  const [message, setMessage] = useState("");
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    if (!isOpen || !partner || !profile) {
      setPactData(null);
      setMessage("");
      return;
    }

    const fetchPact = async () => {
      setLoading(true);
      try {
        const myInput = {
          name: profile.appName,
          category: profile.category,
          description: profile.description,
          targetAudience: profile.targetAudience
        };
        const partnerInput = {
          name: partner.name,
          category: partner.category || "Cross-promo",
          description: partner.reason,
          targetAudience: profile.targetAudience // assume similar
        };

        const res = await generatePact(myInput, partnerInput);
        setPactData(res);
        setMessage(res.outreachMessage);
      } catch (err) {
        // Fall back to offline template silently
      } finally {
        setLoading(false);
      }
    };

    fetchPact();
  }, [isOpen, partner, profile]);

  if (!isOpen || !partner || !profile) return null;

  const handleSend = () => {
    // Save to pacts database in localStorage
    const storedPacts = localStorage.getItem("lm_pacts");
    const currentPacts = storedPacts ? JSON.parse(storedPacts) : [];
    
    // Add new pending pact
    const newPact = {
      pact_id: `PACT-${Date.now()}`,
      partnerName: partner.name,
      partnerIcon: partner.icon,
      partnerGradient: partner.gradient,
      partnerId: partner.id,
      status: "pending",
      compatibility: partner.match,
      overlap: partner.overlap,
      expectedInstalls: pactData ? pactData.expectedInstalls : parseInt(partner.installs.replace(/\D/g, "")) || 350,
      expectedCtr: pactData ? pactData.expectedCtr : "4.0%",
      successProbability: pactData ? pactData.successProbability : "85%",
      campaignType: pactData ? pactData.campaignSuggestions[0] : "Newsletter swap",
      whyMatch: pactData ? pactData.whyMatch : partner.reason,
      outreachMessage: message,
      timeline: pactData ? pactData.timeline : [
        "Milestone 1: Launch Day - Setup tracking",
        "Milestone 2: Week 1 - Newsletter cross-promotion slot"
      ],
      campaignSuggestions: pactData ? pactData.campaignSuggestions : ["Newsletter Swap", "Banner Ads"],
      promotionPlan: pactData ? pactData.promotionPlan : "Cross promotion via newsletter insert slots.",
      created_at: new Date().toISOString()
    };

    localStorage.setItem("lm_pacts", JSON.stringify([...currentPacts, newPact]));
    
    // Trigger callback if provided
    if (onSuccess) onSuccess();

    toast.success(`Partnership request sent to ${partner.name}!`, {
      description: "You can track their response in the Growth Pacts hub."
    });

    // ⚠️ HACKATHON ONLY: Fire-and-forget Slack notification.
    // Attempt to post the partnership request to a Slack channel.
    // Uses the VITE_SLACK_ACCESS_TOKEN from .env. If the token is not set
    // or is invalid, the Slack client will show its own error toast —
    // we catch here to avoid breaking the main flow.
    const slackToken = import.meta.env.VITE_SLACK_ACCESS_TOKEN;
    if (slackToken && slackToken !== "YOUR_SLACK_BOT_TOKEN") {
      const slackChannelId = import.meta.env.VITE_SLACK_CHANNEL_ID || "general";
      const slackText = `🚀 *New LaunchMesh Growth Pact Request*\n\n*From:* ${profile.appName}\n*To:* ${partner.name}\n*Match:* ${partner.match}%\n*Expected Installs:* ${pactData?.expectedInstalls ?? "350"}\n\n${message}`;

      sendSlackMessage(slackChannelId, slackText).catch(() => {
        // Slack client already shows a toast on failure, no extra handling needed
      });
    }
    
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(10,10,15,0.85)", backdropFilter: "blur(20px)" }}>
      {/* Background glow orbs */}
      <div className="absolute top-1/4 left-1/4 h-72 w-72 rounded-full opacity-20 blur-3xl bg-primary/30 pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 h-72 w-72 rounded-full opacity-15 blur-3xl bg-accent/20 pointer-events-none" />

      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="w-full max-w-3xl glass-strong rounded-3xl border border-primary/20 shadow-elevated overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-border/40 bg-surface/40 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-accent animate-pulse" />
            <h2 className="text-lg font-bold text-white">Create Growth Pact</h2>
          </div>
          <button onClick={onClose} className="h-8 w-8 rounded-lg glass grid place-items-center text-muted-foreground hover:text-foreground cursor-pointer transition-colors">
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Modal Scroll Body */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6">
          
          {/* Product Comparison Header */}
          <div className="grid grid-cols-3 items-center gap-4 p-4 rounded-2xl glass border border-border/40 relative">
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#12121A] border border-border/50 h-8 w-8 rounded-full grid place-items-center z-10 text-[10px] font-bold text-muted-foreground">
              VS
            </div>

            {/* My App */}
            <div className="text-center space-y-1">
              <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-700 grid place-items-center text-2xl mx-auto">
                {profile.appIcon || "🚀"}
              </div>
              <p className="text-xs font-bold text-white truncate">{profile.appName}</p>
              <p className="text-[10px] text-muted-foreground uppercase">{profile.category}</p>
            </div>

            {/* Match Affinities */}
            <div className="text-center space-y-1.5 z-0">
              <div className="inline-block px-3 py-1 rounded-full text-xs font-extrabold text-accent border border-accent/20 bg-accent/10">
                {partner.match}% Match
              </div>
              <p className="text-[10px] text-muted-foreground">Trust Score: <strong className="text-white">{partner.trustScore}</strong></p>
            </div>

            {/* Partner App */}
            <div className="text-center space-y-1">
              <div className={`h-12 w-12 rounded-2xl bg-gradient-to-br ${partner.gradient} grid place-items-center text-2xl mx-auto`}>
                {partner.icon}
              </div>
              <p className="text-xs font-bold text-white truncate">{partner.name}</p>
              <p className="text-[10px] text-muted-foreground uppercase">{partner.tags?.[0] || "Cross-promo"}</p>
            </div>
          </div>

          {loading ? (
            <div className="py-16 text-center space-y-4">
              <Loader2 className="h-10 w-10 animate-spin text-accent mx-auto" />
              <div>
                <p className="text-sm font-semibold text-white animate-pulse">LaunchMesh AI is drafting terms...</p>
                <p className="text-xs text-muted-foreground mt-1">Analyzing cross-promotion slots and subscriber reach compatibility</p>
              </div>
            </div>
          ) : pactData ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6"
            >
              {/* Fit analysis */}
              <div className="space-y-2">
                <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">AI Growth Recommendation</h4>
                <p className="text-sm text-muted-foreground leading-relaxed glass rounded-2xl p-4 border border-border/40">
                  {pactData.whyMatch}
                </p>
              </div>

              {/* Stats Panel */}
              <div className="grid grid-cols-3 gap-3">
                <div className="glass rounded-xl p-3 border border-border/40 text-center">
                  <TrendingUp className="h-4 w-4 text-accent mx-auto mb-1" />
                  <p className="text-lg font-bold text-white">+{pactData.expectedInstalls}</p>
                  <p className="text-[9px] text-muted-foreground uppercase tracking-widest mt-0.5">Est. Installs</p>
                </div>
                <div className="glass rounded-xl p-3 border border-border/40 text-center">
                  <Users className="h-4 w-4 text-primary mx-auto mb-1" />
                  <p className="text-lg font-bold text-white">{partner.overlap}</p>
                  <p className="text-[9px] text-muted-foreground uppercase tracking-widest mt-0.5">Audience Overlap</p>
                </div>
                <div className="glass rounded-xl p-3 border border-border/40 text-center">
                  <ShieldCheck className="h-4 w-4 text-accent mx-auto mb-1" />
                  <p className="text-lg font-bold text-white">{pactData.successProbability}</p>
                  <p className="text-[9px] text-muted-foreground uppercase tracking-widest mt-0.5">Success Prob.</p>
                </div>
              </div>

              {/* Campaign Suggestions & Timeline */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Campaign Suggestions</h4>
                  <ul className="space-y-2">
                    {pactData.campaignSuggestions.map((s, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
                        <Check className="h-4 w-4 text-accent shrink-0 mt-0.5" />
                        <span>{s}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="space-y-2">
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Joint Launch Timeline</h4>
                  <ul className="space-y-2">
                    {pactData.timeline.map((t, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
                        <Calendar className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                        <span>{t}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Editable outreach email */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                    <Mail className="h-3.5 w-3.5" />
                    Outreach Message (Auto-Generated)
                  </label>
                  <button
                    onClick={() => setEditing(!editing)}
                    className="text-xs text-primary hover:text-primary-glow flex items-center gap-1 cursor-pointer"
                  >
                    <Edit3 className="h-3 w-3" />
                    {editing ? "Save" : "Edit"}
                  </button>
                </div>
                {editing ? (
                  <textarea
                    rows={6}
                    className="w-full glass bg-white/5 border border-primary/40 focus:border-primary/60 outline-none rounded-2xl p-4 text-sm text-white resize-none font-mono"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                  />
                ) : (
                  <div className="w-full glass bg-white/5 border border-border/40 rounded-2xl p-4 text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap select-text">
                    {message}
                  </div>
                )}
              </div>

            </motion.div>
          ) : (
            <div className="py-16 text-center text-muted-foreground text-xs">
              <AlertTriangle className="h-8 w-8 text-amber-500 mx-auto mb-2" />
              Failed to load Growth Pact terms. Please try again.
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-border/40 bg-surface/40 flex items-center justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 rounded-xl text-xs font-semibold border border-border/60 glass text-muted-foreground hover:text-foreground cursor-pointer transition-colors">
            Cancel
          </button>
          <button
            onClick={handleSend}
            disabled={loading || !pactData}
            className={`flex items-center gap-1.5 px-6 py-2.5 rounded-xl text-xs font-bold text-white cursor-pointer ${loading || !pactData ? "opacity-50 cursor-not-allowed" : "animated-gradient"}`}
            style={{ boxShadow: !loading && pactData ? "0 0 35px -8px rgba(108,92,231,0.6)" : "none" }}
          >
            Send Partnership Request
            <Send className="h-3.5 w-3.5 text-accent shrink-0" />
          </button>
        </div>
      </motion.div>
    </div>
  );
}
