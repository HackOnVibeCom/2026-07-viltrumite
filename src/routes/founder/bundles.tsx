import { createFileRoute } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { Package, Sparkles, Plus, Zap, X, Trash2, Edit3, ShieldAlert, BadgeCheck } from "lucide-react";
import { useState, useEffect } from "react";
import { useBundles } from "@/hooks/useMockDb";
import { toast } from "sonner";

export const Route = createFileRoute("/founder/bundles")({ component: BundlesPage });

const gradients = ["from-amber-500 to-orange-600", "from-violet-500 to-purple-700", "from-cyan-500 to-teal-600"];

interface BundleItem {
  id: string;
  name: string;
  apps: Array<{ icon: string; name: string }>;
  discount: string;
  purchases: number;
  createdAt: string;
  status?: "active" | "inactive";
}

function BundlesPage() {
  const [creating, setCreating] = useState(false);
  const { data: bundles = [] } = useBundles();

  const [localBundles, setLocalBundles] = useState<BundleItem[]>([]);
  const [selectedBundle, setSelectedBundle] = useState<BundleItem | null>(null);
  
  // Edit Form State
  const [editName, setEditName] = useState("");
  const [editDiscount, setEditDiscount] = useState("10");
  const [editStatus, setEditStatus] = useState<"active" | "inactive">("active");

  useEffect(() => {
    if (bundles.length > 0 && localBundles.length === 0) {
      setLocalBundles(bundles.map(b => ({ ...b, status: "active" })));
    }
  }, [bundles]);

  const handleOpenManage = (bundle: BundleItem) => {
    setSelectedBundle(bundle);
    setEditName(bundle.name.replace(" Bundle", ""));
    setEditDiscount(bundle.discount ? bundle.discount.replace("%", "") : "10");
    setEditStatus(bundle.status || "active");
  };

  const handleSave = () => {
    if (!selectedBundle) return;
    if (!editName.trim()) {
      toast.error("Bundle name cannot be empty");
      return;
    }

    setLocalBundles(prev => prev.map(b => {
      if (b.id === selectedBundle.id) {
        return {
          ...b,
          name: editName.trim(),
          discount: `${editDiscount}%`,
          status: editStatus
        };
      }
      return b;
    }));

    toast.success("Bundle updated successfully!", {
      description: `"${editName.trim()}" is now configured with ${editDiscount}% discount.`
    });
    setSelectedBundle(null);
  };

  const handleDelete = () => {
    if (!selectedBundle) return;
    if (confirm(`Are you sure you want to deactivate and remove "${selectedBundle.name}"?`)) {
      setLocalBundles(prev => prev.filter(b => b.id !== selectedBundle.id));
      toast.success("Bundle deactivated", {
        description: "The bundle has been taken offline."
      });
      setSelectedBundle(null);
    }
  };

  const [newTheme, setNewTheme] = useState("");
  const [newAudience, setNewAudience] = useState("");

  const handleCreateAI = () => {
    if (!newTheme.trim()) {
      toast.error("Please enter a bundle theme");
      return;
    }
    const newId = `bundle_${Date.now()}`;
    const newBundleItem: BundleItem = {
      id: newId,
      name: newTheme.trim(),
      discount: "15%",
      purchases: 0,
      createdAt: new Date().toISOString(),
      status: "active",
      apps: [
        { icon: "⚡", name: "FocusGrid" },
        { icon: "📝", name: "NoteMind" }
      ]
    };
    setLocalBundles(prev => [newBundleItem, ...prev]);
    toast.success("AI Bundle Generated!", {
      description: `"${newTheme.trim()}" created successfully with focus on ${newAudience || "General Founders"}.`
    });
    setCreating(false);
    setNewTheme("");
    setNewAudience("");
  };

  return (
    <div className="pt-20 md:pt-24 px-6 md:px-8 pb-6 md:pb-8 max-w-5xl relative min-h-screen">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-primary/20 grid place-items-center">
              <Package className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Bundle Builder</h1>
              <p className="text-sm text-muted-foreground">Themed multi-app launch campaigns</p>
            </div>
          </div>
          <motion.button 
            whileHover={{ scale: 1.04 }} 
            whileTap={{ scale: 0.97 }} 
            onClick={() => setCreating(!creating)} 
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white cursor-pointer" 
            style={{ background: "linear-gradient(135deg, #6C5CE7, #00D4B8)", boxShadow: "0 0 24px -8px rgba(108,92,231,0.5)" }}
          >
            <Plus className="h-4 w-4" /> New Bundle
          </motion.button>
        </div>
      </motion.div>

      {creating && (
        <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} className="glass-strong rounded-2xl border border-primary/30 p-6 mb-6" style={{ boxShadow: "0 0 40px -15px rgba(108,92,231,0.3)" }}>
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="h-4 w-4 text-accent" />
            <h3 className="text-base font-semibold">AI Bundle Generator</h3>
          </div>
          <div className="space-y-4">
            <div>
              <label className="text-xs text-muted-foreground block mb-1.5">Bundle Theme</label>
              <input 
                value={newTheme}
                onChange={e => setNewTheme(e.target.value)}
                placeholder="e.g. New Year Productivity Pack" 
                className="w-full glass border border-border/60 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary/40 transition-colors" 
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground block mb-1.5">Target Audience</label>
              <input 
                value={newAudience}
                onChange={e => setNewAudience(e.target.value)}
                placeholder="e.g. Students, Developers, Founders" 
                className="w-full glass border border-border/60 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary/40 transition-colors" 
              />
            </div>
            <motion.button 
              whileHover={{ scale: 1.03 }} 
              onClick={handleCreateAI}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white cursor-pointer" 
              style={{ background: "linear-gradient(135deg, #6C5CE7, #00D4B8)" }}
            >
              <Zap className="h-4 w-4" /> Generate Bundle with AI
            </motion.button>
          </div>
        </motion.div>
      )}

      <div className="space-y-5">
        {localBundles.map((bundle, index) => { 
          const gradient = gradients[index % gradients.length]; 
          const isActive = bundle.status !== "inactive";

          return (
            <motion.div 
              key={bundle.id} 
              initial={{ opacity: 0, y: 16 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ delay: index * 0.05 }} 
              whileHover={{ y: -3 }} 
              className={`glass-strong rounded-3xl p-6 border transition-colors relative overflow-hidden ${isActive ? 'border-border/60 hover:border-primary/30' : 'border-border/20 opacity-60'}`}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-5`} />
              <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full blur-3xl opacity-20" style={{ background: "linear-gradient(135deg, #6C5CE7, #00D4B8)" }} />
              
              <div className="relative flex flex-col md:flex-row md:items-center gap-5 md:justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs text-accent uppercase tracking-widest font-semibold">
                      {new Date(bundle.createdAt).toLocaleDateString("en", { month: "short", year: "numeric" })}
                    </span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full border font-bold ${isActive ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' : 'bg-rose-500/20 text-rose-400 border-rose-500/30'}`}>
                      {isActive ? 'active' : 'inactive'}
                    </span>
                    {bundle.discount && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full border font-bold bg-primary/20 text-primary border-primary/30">
                        {bundle.discount} OFF
                      </span>
                    )}
                  </div>
                  <h3 className="text-2xl font-bold">{bundle.name.endsWith("Bundle") ? bundle.name : `${bundle.name} Bundle`}</h3>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {bundle.apps.map((app) => (
                      <span key={app.name} className="text-xs glass px-3 py-1.5 rounded-full border border-border/40 flex items-center gap-1.5">
                        <span>{app.icon}</span> {app.name}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="flex items-center gap-6">
                  <div>
                    <p className="text-xs text-muted-foreground">Purchases</p>
                    <p className="text-2xl font-bold gradient-brand">{bundle.purchases.toLocaleString()}</p>
                  </div>
                  <motion.button 
                    whileHover={{ scale: 1.04 }} 
                    onClick={() => handleOpenManage(bundle)}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white shrink-0 cursor-pointer" 
                    style={{ background: "linear-gradient(135deg, #6C5CE7, #00D4B8)" }}
                  >
                    <Edit3 className="h-4 w-4" /> Manage
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ); 
        })}
      </div>

      {/* Premium Manage Modal Overlay */}
      <AnimatePresence>
        {selectedBundle && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-lg glass-strong border border-primary/30 p-8 rounded-3xl space-y-6 relative overflow-hidden"
              style={{ boxShadow: "0 0 60px -15px rgba(108,92,231,0.4)" }}
            >
              <div className="absolute -top-12 -right-12 h-40 w-40 rounded-full blur-3xl opacity-20 bg-primary pointer-events-none" />
              
              <div className="flex items-center justify-between border-b border-border/40 pb-4">
                <div className="flex items-center gap-2.5">
                  <Package className="h-5 w-5 text-primary" />
                  <h3 className="text-xl font-bold text-foreground">Manage Bundle</h3>
                </div>
                <button 
                  onClick={() => setSelectedBundle(null)}
                  className="h-8 w-8 rounded-xl glass hover:bg-white/10 transition-colors grid place-items-center text-muted-foreground hover:text-foreground cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="space-y-4">
                {/* Name */}
                <div>
                  <label className="text-xs text-muted-foreground block mb-1.5 font-bold uppercase tracking-wider">Bundle Name</label>
                  <input 
                    type="text"
                    value={editName}
                    onChange={e => setEditName(e.target.value)}
                    placeholder="e.g. FocusGrid Ultimate"
                    className="w-full glass border border-border/60 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary/40 transition-colors"
                  />
                </div>

                {/* Discount Percentage */}
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="text-xs text-muted-foreground block font-bold uppercase tracking-wider">Discount Percentage</label>
                    <span className="text-sm font-bold text-primary">{editDiscount}% OFF</span>
                  </div>
                  <input 
                    type="range" 
                    min="5" 
                    max="50" 
                    step="5"
                    value={editDiscount} 
                    onChange={e => setEditDiscount(e.target.value)}
                    className="w-full accent-primary bg-muted rounded-lg appearance-none h-1.5 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-muted-foreground mt-1 px-1">
                    <span>5%</span>
                    <span>20%</span>
                    <span>35%</span>
                    <span>50%</span>
                  </div>
                </div>

                {/* Status Toggle */}
                <div>
                  <label className="text-xs text-muted-foreground block mb-2.5 font-bold uppercase tracking-wider">Status</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setEditStatus("active")}
                      className={`flex items-center justify-center gap-2 py-2.5 rounded-xl border text-xs font-bold cursor-pointer transition-all ${editStatus === "active" ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/40 shadow-glow-emerald' : 'glass border-border/50 text-muted-foreground'}`}
                    >
                      <BadgeCheck className="h-4 w-4" /> Active (Live)
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditStatus("inactive")}
                      className={`flex items-center justify-center gap-2 py-2.5 rounded-xl border text-xs font-bold cursor-pointer transition-all ${editStatus === "inactive" ? 'bg-rose-500/10 text-rose-400 border-rose-500/40 shadow-glow-rose' : 'glass border-border/50 text-muted-foreground'}`}
                    >
                      <ShieldAlert className="h-4 w-4" /> Inactive (Draft)
                    </button>
                  </div>
                </div>

                {/* Performance Analytics (Mock) */}
                <div className="p-4 rounded-2xl bg-black/20 border border-border/40 space-y-2">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block">Launch performance summary</span>
                  <div className="grid grid-cols-3 gap-2 text-center pt-1.5">
                    <div>
                      <p className="text-xs text-muted-foreground">Visits</p>
                      <p className="text-sm font-black text-foreground">{(selectedBundle.purchases * 4.5).toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Conversion</p>
                      <p className="text-sm font-black text-accent">22.2%</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Revenue</p>
                      <p className="text-sm font-black text-emerald-400">${(selectedBundle.purchases * 29).toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Modal Actions */}
              <div className="flex items-center justify-between border-t border-border/40 pt-5 gap-3">
                <button
                  onClick={handleDelete}
                  className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold bg-rose-500/10 hover:bg-rose-500/25 border border-rose-500/30 text-rose-400 hover:text-rose-300 transition-colors cursor-pointer"
                >
                  <Trash2 className="h-4 w-4" /> Deactivate
                </button>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSelectedBundle(null)}
                    className="px-4 py-2.5 rounded-xl text-xs font-semibold glass border border-border/50 text-muted-foreground hover:text-foreground transition-all cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-primary hover:bg-primary/90 transition-colors cursor-pointer"
                    style={{ background: "linear-gradient(135deg, #6C5CE7, #00D4B8)" }}
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
