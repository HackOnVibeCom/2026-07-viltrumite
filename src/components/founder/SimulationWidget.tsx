import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Handshake, Bell, Check, X, ShieldAlert, Sparkles, RefreshCw, Layers } from "lucide-react";
import { toast } from "sonner";

export function SimulationWidget() {
  const [pendingPacts, setPendingPacts] = useState<any[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedPact, setSelectedPact] = useState<any | null>(null);

  // Sync with localStorage periodically
  useEffect(() => {
    const checkPacts = () => {
      const stored = localStorage.getItem("lm_pacts");
      if (stored) {
        const parsed = JSON.parse(stored);
        const pending = parsed.filter((p: any) => p.status === "pending");
        setPendingPacts(pending);
      } else {
        setPendingPacts([]);
      }
    };

    checkPacts();
    const interval = setInterval(checkPacts, 2000);
    return () => clearInterval(interval);
  }, []);

  const openPactView = (pact: any) => {
    setSelectedPact(pact);
    setModalOpen(true);
  };

  const handlePartnerAction = (action: "accept" | "reject" | "changes") => {
    if (!selectedPact) return;

    const stored = localStorage.getItem("lm_pacts");
    if (!stored) return;
    
    const parsed = JSON.parse(stored);
    const updated = parsed.map((p: any) => {
      if (p.pact_id === selectedPact.pact_id) {
        return {
          ...p,
          status: action === "accept" ? "active" : action === "reject" ? "rejected" : "changes",
          // If accepted, generate mock shared launch hub analytics
          clicks: action === "accept" ? 0 : undefined,
          ctr: action === "accept" ? "0.0%" : undefined,
          installs: action === "accept" ? 0 : undefined,
          conversions: action === "accept" ? 0 : undefined,
          referralTraffic: action === "accept" ? [] : undefined
        };
      }
      return p;
    });

    localStorage.setItem("lm_pacts", JSON.stringify(updated));
    setModalOpen(false);

    if (action === "accept") {
      toast.success(`Pact with ${selectedPact.partnerName} is now ACTIVE!`, {
        description: "Shared Launch Hub, joint campaign timeline, and analytics are now live."
      });
      
      // Inject activity feed notification
      const storedActivities = localStorage.getItem("lm_activities") || "[]";
      const acts = JSON.parse(storedActivities);
      const newAct = {
        id: `ACT-${Date.now()}`,
        icon: "🤝",
        text: `Growth Pact with ${selectedPact.partnerName} was accepted and is live!`,
        time: "Just now",
        color: "#00D4B8"
      };
      localStorage.setItem("lm_activities", JSON.stringify([newAct, ...acts]));
    } else if (action === "reject") {
      toast.warning(`${selectedPact.partnerName} declined the pact request.`);
    } else {
      toast.info(`${selectedPact.partnerName} requested revisions to co-marketing slots.`);
    }
  };

  if (pendingPacts.length === 0) return null;

  const pact = pendingPacts[0];

  return (
    <>
      {/* Floating Simulation Bubble */}
      <div className="fixed bottom-6 right-6 z-40">
        <motion.button
          initial={{ scale: 0, y: 30 }}
          animate={{ scale: 1, y: 0 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => openPactView(pact)}
          className="flex items-center gap-2 px-4 py-3 rounded-full text-xs font-bold text-white shadow-glow-accent cursor-pointer bg-slate-900 border border-accent/40"
          style={{ background: "linear-gradient(135deg, #0d0a20, #0c2020)" }}
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75" />
            <span className="relative rounded-full h-2 w-2 bg-accent" />
          </span>
          <span>Simulation: Pact Pending</span>
          <Handshake className="h-4 w-4 text-accent shrink-0" />
        </motion.button>
      </div>

      {/* Simulated Partner Acceptance Screen Modal */}
      <AnimatePresence>
        {modalOpen && selectedPact && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(10,10,15,0.9)", backdropFilter: "blur(15px)" }}>
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-lg glass-strong border border-accent/30 rounded-3xl p-6 md:p-8 shadow-elevated"
            >
              <div className="flex items-center justify-between mb-5 border-b border-border/40 pb-4">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-accent animate-pulse" />
                  <h3 className="text-base font-bold text-white">Partner Inbox View: {selectedPact.partnerName}</h3>
                </div>
                <button onClick={() => setModalOpen(false)} className="h-7 w-7 glass rounded-lg grid place-items-center text-muted-foreground hover:text-white cursor-pointer transition-colors">
                  ✕
                </button>
              </div>

              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-accent/10 border border-accent/25 flex gap-3">
                  <Bell className="h-5 w-5 text-accent shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider">New Growth Pact Request</h4>
                    <p className="text-xs text-muted-foreground mt-1">
                      Alex (founder of StudyPal) has requested a partnership matching your launch windows.
                    </p>
                  </div>
                </div>

                <div className="glass rounded-xl p-4 border border-border/40 space-y-3">
                  <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold">Alex's Message</p>
                  <p className="text-xs text-muted-foreground italic leading-relaxed whitespace-pre-wrap">
                    "{selectedPact.outreachMessage}"
                  </p>
                </div>

                <div className="grid grid-cols-4 gap-2">
                  {[
                    { label: "Compatibility", value: `${selectedPact.compatibility}%` },
                    { label: "Overlap", value: selectedPact.overlap },
                    { label: "Installs", value: `+${selectedPact.expectedInstalls}` },
                    { label: "Campaign", value: selectedPact.campaignType }
                  ].map((stat) => (
                    <div key={stat.label} className="glass rounded-xl p-2.5 text-center border border-border/40">
                      <p className="text-xs font-bold text-white">{stat.value}</p>
                      <p className="text-[9px] text-muted-foreground mt-0.5 truncate">{stat.label}</p>
                    </div>
                  ))}
                </div>

                <div className="flex flex-col gap-2 pt-3">
                  <button
                    onClick={() => handlePartnerAction("accept")}
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-bold text-white animated-gradient cursor-pointer"
                  >
                    <Check className="h-4 w-4" /> Accept Partnership Pact
                  </button>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => handlePartnerAction("changes")}
                      className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-semibold glass border border-border hover:border-primary/50 text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
                    >
                      <RefreshCw className="h-3.5 w-3.5" /> Request Changes
                    </button>
                    <button
                      onClick={() => handlePartnerAction("reject")}
                      className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-semibold glass border border-border hover:border-rose-500/50 text-muted-foreground hover:text-rose-400 cursor-pointer transition-colors"
                    >
                      <X className="h-3.5 w-3.5" /> Reject Request
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
