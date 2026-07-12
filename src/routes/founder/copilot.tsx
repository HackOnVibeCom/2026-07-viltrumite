import { createFileRoute } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Bot, Sparkles, AlertTriangle, CheckCircle2, Copy, Check, 
  Award, Twitter, Globe, Send, Loader2, Download, Edit3, Save, 
  Search, RefreshCw, ChevronRight, FileText, Printer, BookOpen,
  DollarSign, Briefcase, GraduationCap, Calendar, Users, Eye,
  BarChart3, ShieldAlert, Sparkle, HeartHandshake, ShieldCheck
} from "lucide-react";
import { useState, useMemo, useEffect } from "react";
import { useAppProfile } from "@/context/AppProfileContext";
import { toast } from "sonner";

export const Route = createFileRoute("/founder/copilot")({
  component: CopilotPage,
});

interface GTMSection {
  id: string;
  label: string;
  icon: any;
  desc: string;
}

const GTM_SECTIONS: GTMSection[] = [
  { id: "brand_kit", label: "Brand Kit", icon: Award, desc: "Story, mission, values, slogan & colors" },
  { id: "website_copy", label: "Website Copy", icon: Globe, desc: "Hero sections, features list, pricing & FAQs" },
  { id: "aso", label: "App Store Optimization", icon: Bot, desc: "Title, subtitle, keywords & screenshots" },
  { id: "product_hunt", label: "Product Hunt Launch", icon: Sparkles, desc: "Tagline, maker comments & checklists" },
  { id: "press_kit", label: "Press Kit", icon: Send, desc: "Press releases, blogger & podcast outreach pitch" },
  { id: "social_media", label: "Social Media", icon: Twitter, desc: "Twitter threads, LinkedIn posts & Reddit pitches" },
  { id: "email_marketing", label: "Email Marketing", icon: FileText, desc: "Welcome flow, newsletters & referral programs" },
  { id: "seo", label: "SEO Strategy", icon: Search, desc: "Metadata, target keywords & linking plan" },
  { id: "content_marketing", label: "Content Marketing", icon: BookOpen, desc: "50 blog ideas, Medium drafts & documentation" },
  { id: "sales_kit", label: "Sales Kit", icon: DollarSign, desc: "Sales script, cold emails & objection guides" },
  { id: "investor_kit", label: "Investor Kit", icon: Briefcase, desc: "Executive summaries, pitch outlines & SOM sizing" },
  { id: "customer_support", label: "Customer Support", icon: GraduationCap, desc: "Help center articles, onboarding & refunds policy" },
  { id: "launch_planner", label: "Launch Planner", icon: Calendar, desc: "30-day roadmap, calendar & success metrics" },
  { id: "competitor_analysis", label: "Competitor Analysis", icon: ShieldAlert, desc: "Comparison table, SWOT & pricing matrix" },
  { id: "audience_insights", label: "Audience Insights", icon: Users, desc: "Buyer personas, pain triggers & positioning" },
  { id: "growth_engine", label: "Growth Engine", icon: Eye, desc: "Viral growth, influencer list & experiments" },
  { id: "ai_recommendations", label: "AI Recommendations", icon: BarChart3, desc: "Audit recommendations with priority scores" }
];

function CopilotPage() {
  const { profile, hasProduct } = useAppProfile();
  const [activeSection, setActiveSection] = useState<string>("brand_kit");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [bulkGenerating, setBulkGenerating] = useState(false);
  const [bulkProgress, setBulkProgress] = useState(0);
  const [bulkMessage, setBulkMessage] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  
  // Store all GTM sections in one unified object
  const [gtmKit, setGtmKit] = useState<Record<string, any>>(() => {
    const cached = localStorage.getItem("lm_gtm_kit");
    return cached ? JSON.parse(cached) : {};
  });

  const [editingField, setEditingField] = useState<{ section: string; key: string } | null>(null);
  const [editValue, setEditValue] = useState("");

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    toast.success("Copied to clipboard!");
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDownload = (filename: string, content: string) => {
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${filename}.txt`;
    link.click();
    toast.success("Downloaded asset successfully!");
  };

  const generateSection = async (sectionId: string, silent = false) => {
    if (!profile) return;
    if (!silent) setLoading(true);

    try {
      const response = await fetch("/api/launch-kit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profile, category: sectionId }),
      });

      if (!response.ok) {
        throw new Error(`Failed to generate GTM section: ${sectionId}`);
      }

      const data = await response.json();
      const updatedKit = { ...gtmKit, [sectionId]: data };
      localStorage.setItem("lm_gtm_kit", JSON.stringify(updatedKit));
      setGtmKit(updatedKit);
      if (!silent) toast.success(`Generated ${GTM_SECTIONS.find(s => s.id === sectionId)?.label} successfully!`);
    } catch (err: any) {
      console.error(err);
      if (!silent) toast.error(`Failed to generate: ${err.message}`);
    } finally {
      if (!silent) setLoading(false);
    }
  };

  const generateAllSections = async () => {
    if (!profile) return;
    setBulkGenerating(true);
    setBulkProgress(0);

    const keys = GTM_SECTIONS.map(s => s.id);
    let completed = 0;

    for (const key of keys) {
      const label = GTM_SECTIONS.find(s => s.id === key)?.label || key;
      setBulkMessage(`Generating ${label}...`);
      await generateSection(key, true);
      completed++;
      setBulkProgress(Math.round((completed / keys.length) * 100));
    }

    setBulkGenerating(false);
    toast.success("AI Complete GTM Launch Kit Generated!", {
      description: "Every asset is compiled, ready to edit, and exportable."
    });
  };

  const handleSaveEdit = (section: string, key: string) => {
    const sectionData = { ...gtmKit[section] };
    
    // Support nested object/array updates if needed, simple string replacement for now
    if (key.includes(".")) {
      const [parent, child] = key.split(".");
      sectionData[parent][child] = editValue;
    } else {
      sectionData[key] = editValue;
    }

    const updatedKit = { ...gtmKit, [section]: sectionData };
    localStorage.setItem("lm_gtm_kit", JSON.stringify(updatedKit));
    setGtmKit(updatedKit);
    setEditingField(null);
    toast.success("Asset updated successfully!");
  };

  const exportAsMarkdown = (sectionId?: string) => {
    let md = "";
    if (sectionId) {
      const sec = GTM_SECTIONS.find(s => s.id === sectionId);
      md += `# ${sec?.label} - GTM Launch Kit\n\n`;
      md += `*Generated for ${profile?.appName}*\n\n`;
      const data = gtmKit[sectionId];
      if (data) {
        Object.entries(data).forEach(([key, val]) => {
          md += `## ${key.replace(/([A-Z])/g, " $1").toUpperCase()}\n\n`;
          if (typeof val === "object" && val !== null) {
            md += "```json\n" + JSON.stringify(val, null, 2) + "\n```\n\n";
          } else {
            md += `${val}\n\n`;
          }
        });
      }
      handleDownload(`${profile?.appName.toLowerCase()}_gtm_${sectionId}`, md);
    } else {
      // Export ALL
      md += `# ${profile?.appName} - Complete GTM Launch Kit\n\n`;
      GTM_SECTIONS.forEach(sec => {
        md += `\n# ${sec.label}\n\n`;
        const data = gtmKit[sec.id];
        if (data) {
          Object.entries(data).forEach(([key, val]) => {
            md += `## ${key.replace(/([A-Z])/g, " $1").toUpperCase()}\n\n`;
            if (typeof val === "object" && val !== null) {
              md += "```json\n" + JSON.stringify(val, null, 2) + "\n```\n\n";
            } else {
              md += `${val}\n\n`;
            }
          });
        }
      });
      handleDownload(`${profile?.appName.toLowerCase()}_complete_gtm_kit`, md);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  // Helper to extract searchable text inside generated items
  const flattenedSearchItems = useMemo(() => {
    if (!searchQuery) return [];
    const results: Array<{ section: string; sectionLabel: string; key: string; text: string }> = [];

    Object.entries(gtmKit).forEach(([secId, data]) => {
      const sec = GTM_SECTIONS.find(s => s.id === secId);
      if (!sec) return;

      const traverse = (obj: any, path: string) => {
        if (typeof obj === "string") {
          if (obj.toLowerCase().includes(searchQuery.toLowerCase()) || path.toLowerCase().includes(searchQuery.toLowerCase())) {
            results.push({
              section: secId,
              sectionLabel: sec.label,
              key: path,
              text: obj
            });
          }
        } else if (Array.isArray(obj)) {
          obj.forEach((item, idx) => traverse(item, `${path}[${idx}]`));
        } else if (typeof obj === "object" && obj !== null) {
          Object.entries(obj).forEach(([k, v]) => traverse(v, path ? `${path}.${k}` : k));
        }
      };

      traverse(data, "");
    });

    return results;
  }, [gtmKit, searchQuery]);

  if (!hasProduct || !profile) {
    return (
      <div className="p-6 md:p-8 max-w-4xl">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl grid place-items-center bg-primary/20">
              <Bot className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">AI GTM Copilot</h1>
              <p className="text-sm text-muted-foreground">ASO Audits & 17 Launch Asset suites powered by Groq Llama 3.3</p>
            </div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 16 }} 
          animate={{ opacity: 1, y: 0 }}
          className="glass-strong rounded-3xl border border-primary/20 p-8 text-center"
        >
          <Bot className="h-16 w-16 text-primary/40 mx-auto mb-4 animate-bounce" />
          <h2 className="text-xl font-bold mb-2 text-foreground font-title">No Product Launched Yet</h2>
          <p className="text-muted-foreground text-sm max-w-md mx-auto mb-6">
            Launch your product profile using the Wizard on the Dashboard page to unlock instant GTM launch kits, brand plans, website copy, press kits, and viral engine outlines.
          </p>
        </motion.div>
      </div>
    );
  }

  const activeSecData = gtmKit[activeSection];
  const activeSecMeta = GTM_SECTIONS.find(s => s.id === activeSection)!;

  return (
    <div className="p-6 md:p-8 max-w-7xl relative min-h-screen">
      
      {/* Bulk Generator Overlay Popup */}
      <AnimatePresence>
        {bulkGenerating && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-md glass-strong border border-primary/30 p-8 rounded-3xl text-center space-y-6"
            >
              <Loader2 className="h-12 w-12 animate-spin text-accent mx-auto" />
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-foreground font-title">Generating Complete GTM Launch Kit</h3>
                <p className="text-xs text-muted-foreground">{bulkMessage}</p>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-border/40 h-2.5 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-300"
                  style={{ width: `${bulkProgress}%` }}
                />
              </div>
              <p className="text-sm font-bold text-primary">{bulkProgress}% Complete</p>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Header Panel */}
      <div className="mb-8 flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-border/40 pb-6 print:hidden">
        <div className="flex items-center gap-3">
          <div className="h-11 w-11 rounded-2xl grid place-items-center bg-primary/20 border border-primary/10">
            <Bot className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">AI GTM Copilot</h1>
            <p className="text-sm text-muted-foreground">Comprehensive Go-To-Market workspace for {profile.appName}</p>
          </div>
        </div>

        <div className="flex items-center flex-wrap gap-2.5">
          <button 
            onClick={generateAllSections}
            className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-bold text-white animated-gradient cursor-pointer hover:scale-[1.01] transition-transform"
            style={{ boxShadow: "0 0 20px -8px rgba(108,92,231,0.5)" }}
          >
            <Sparkles className="h-4 w-4" /> Generate Complete Launch Kit
          </button>
          
          <button 
            onClick={() => exportAsMarkdown()}
            className="flex items-center gap-1 px-4 py-2.5 rounded-xl text-xs font-semibold glass border border-border/50 text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
          >
            <FileText className="h-4 w-4 shrink-0" /> Export All (MD)
          </button>

          <button 
            onClick={handlePrint}
            className="flex items-center gap-1 px-4 py-2.5 rounded-xl text-xs font-semibold glass border border-border/50 text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
          >
            <Printer className="h-4 w-4 shrink-0" /> Print / PDF
          </button>
        </div>
      </div>

      {/* GTM Layout grid */}
      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6 print:block">
        
        {/* Sticky sidebar */}
        <div className="space-y-4 lg:sticky lg:top-8 h-fit print:hidden">
          {/* Search bar */}
          <div className="relative">
            <Search className="absolute left-3.5 top-3 h-4 w-4 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Search GTM assets..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full glass bg-white/5 border border-border/40 focus:border-primary/60 outline-none rounded-xl pl-10 pr-4 py-2 text-xs transition-colors"
            />
          </div>

          {/* Categories Nav list */}
          <div className="glass-strong border border-border/60 rounded-2xl p-2 max-h-[70vh] overflow-y-auto space-y-1" data-lenis-prevent="true">
            {GTM_SECTIONS.map((sec) => {
              const Icon = sec.icon;
              const hasData = !!gtmKit[sec.id];
              const isActive = activeSection === sec.id;

              return (
                <button
                  key={sec.id}
                  onClick={() => {
                    setActiveSection(sec.id);
                    setSearchQuery(""); // clear search to view section
                  }}
                  className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-left transition-all cursor-pointer ${
                    isActive 
                      ? "bg-primary/20 text-primary border border-primary/20" 
                      : "text-muted-foreground hover:text-foreground hover:bg-white/5 border border-transparent"
                  }`}
                >
                  <Icon className={`h-4 w-4 shrink-0 ${isActive ? "text-primary" : "text-muted-foreground"}`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold truncate">{sec.label}</p>
                  </div>
                  {hasData ? (
                    <CheckCircle2 className="h-3.5 w-3.5 text-accent shrink-0" />
                  ) : (
                    <div className="h-1.5 w-1.5 rounded-full bg-border/60 shrink-0" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Assets Workspace Main Feed */}
        <div id="print-area" className="space-y-6">
          {searchQuery ? (
            /* Search results feed */
            <div className="space-y-4">
              <h2 className="text-base font-bold text-foreground flex items-center gap-2">
                <Search className="h-4 w-4 text-primary" /> Search Results for "{searchQuery}"
                <span className="text-xs font-normal text-muted-foreground">({flattenedSearchItems.length} items found)</span>
              </h2>
              
              {flattenedSearchItems.length === 0 ? (
                <div className="glass-strong rounded-2xl p-8 border border-border/40 text-center text-muted-foreground text-xs">
                  No matching assets found in generated kits. Try generating sections first.
                </div>
              ) : (
                <div className="space-y-3">
                  {flattenedSearchItems.map((item, idx) => (
                    <div key={idx} className="glass-strong border border-border/40 p-4 rounded-xl space-y-2 relative hover:border-primary/20 transition-all">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] text-accent font-bold uppercase">{item.sectionLabel}</span>
                        <button 
                          onClick={() => {
                            setSearchQuery("");
                            setActiveSection(item.section);
                          }}
                          className="text-[10px] text-primary hover:underline cursor-pointer"
                        >
                          View Section <ChevronRight className="h-3 w-3 inline" />
                        </button>
                      </div>
                      <div className="text-xs font-bold text-foreground font-mono uppercase text-muted-foreground">{item.key}</div>
                      <p className="text-xs text-muted-foreground leading-relaxed whitespace-pre-wrap">{item.text}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            /* Selected GTM Section Feed */
            <div className="space-y-6">
              
              {/* Category card header */}
              <div className="glass-strong border border-border/60 rounded-3xl p-6 relative overflow-hidden print:border-none print:p-0">
                <div className="absolute top-0 right-0 h-40 w-40 rounded-full blur-3xl opacity-10 bg-primary pointer-events-none" />
                <div className="flex items-start justify-between flex-wrap gap-4 relative">
                  <div className="flex items-start gap-4">
                    <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 grid place-items-center text-white shrink-0 shadow-glow-primary">
                      <activeSecMeta.icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-foreground">{activeSecMeta.label}</h2>
                      <p className="text-xs text-muted-foreground mt-0.5">{activeSecMeta.desc}</p>
                    </div>
                  </div>

                  <div className="flex gap-2 print:hidden">
                    <button 
                      onClick={() => generateSection(activeSection)}
                      disabled={loading}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-primary hover:bg-primary/95 disabled:opacity-50 transition cursor-pointer"
                    >
                      {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <RefreshCw className="h-3.5 w-3.5" />}
                      {activeSecData ? "Regenerate" : "Generate"}
                    </button>
                    {activeSecData && (
                      <button 
                        onClick={() => exportAsMarkdown(activeSection)}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold glass border border-border/50 text-muted-foreground hover:text-foreground cursor-pointer transition-all"
                      >
                        <Download className="h-3.5 w-3.5" /> Export Section
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Generated cards display grid */}
              {!activeSecData ? (
                <div className="glass-strong rounded-3xl border border-border/40 p-12 text-center space-y-4">
                  <Sparkles className="h-10 w-10 text-primary/40 mx-auto animate-pulse" />
                  <div>
                    <h3 className="text-sm font-semibold text-foreground">Launch Asset Suite is Ready</h3>
                    <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
                      Generate optimized {activeSecMeta.label.toLowerCase()} copy matching {profile.appName}’s niche and selected tone.
                    </p>
                  </div>
                  <button 
                    onClick={() => generateSection(activeSection)}
                    className="flex items-center gap-1 px-4 py-2 rounded-xl text-xs font-bold text-white animated-gradient cursor-pointer mx-auto hover:scale-[1.01] transition-transform"
                  >
                    <Sparkle className="h-3.5 w-3.5" /> Generate Section
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {Object.entries(activeSecData).map(([key, val]) => {
                    const isEditing = editingField?.section === activeSection && editingField?.key === key;
                    const fieldId = `${activeSection}_${key}`;

                    // Layout resolver based on value shape
                    return (
                      <div key={key} className="glass-strong border border-border/40 p-6 rounded-2xl space-y-4 relative hover:border-primary/20 transition-all print:border-none print:px-0">
                        
                        {/* Card Controls */}
                        <div className="flex items-center justify-between border-b border-border/40 pb-2.5">
                          <h4 className="text-xs font-extrabold uppercase tracking-widest text-muted-foreground">
                            {key.replace(/([A-Z])/g, " $1")}
                          </h4>
                          
                          <div className="flex items-center gap-2 print:hidden">
                            {isEditing ? (
                              <button 
                                onClick={() => handleSaveEdit(activeSection, key)}
                                className="h-7 w-7 rounded-lg glass text-emerald-400 hover:text-emerald-300 grid place-items-center cursor-pointer transition-colors"
                              >
                                <Save className="h-3.5 w-3.5" />
                              </button>
                            ) : (
                              <button 
                                onClick={() => {
                                  setEditingField({ section: activeSection, key });
                                  setEditValue(typeof val === "object" ? JSON.stringify(val, null, 2) : String(val));
                                }}
                                className="h-7 w-7 rounded-lg glass text-muted-foreground hover:text-foreground grid place-items-center cursor-pointer transition-colors"
                              >
                                <Edit3 className="h-3.5 w-3.5" />
                              </button>
                            )}
                            <button 
                              onClick={() => handleCopy(typeof val === "object" ? JSON.stringify(val, null, 2) : String(val), fieldId)}
                              className="h-7 w-7 rounded-lg glass text-muted-foreground hover:text-foreground grid place-items-center cursor-pointer transition-colors"
                            >
                              {copiedId === fieldId ? <Check className="h-3.5 w-3.5 text-green-400" /> : <Copy className="h-3.5 w-3.5" />}
                            </button>
                          </div>
                        </div>

                        {/* Card Content display */}
                        {isEditing ? (
                          <textarea
                            rows={6}
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            className="w-full bg-black/25 text-sm text-foreground p-3 border border-primary/40 focus:border-primary/60 rounded-xl outline-none resize-none font-mono"
                          />
                        ) : (
                          <div className="text-sm leading-relaxed text-foreground whitespace-pre-wrap select-text">
                            {/* Detailed render structures for lists, arrays, priorities */}
                            {Array.isArray(val) ? (
                              <ul className="space-y-3">
                                {val.map((item: any, i: number) => {
                                  if (typeof item === "object" && item !== null) {
                                    return (
                                      <li key={i} className="p-3 bg-black/10 border border-border/40 rounded-xl space-y-1">
                                        {item.day && <div className="text-xs font-bold text-primary font-mono">{item.day}</div>}
                                        {item.q && <div className="font-bold text-xs text-foreground">Q: {item.q}</div>}
                                        {item.a && <div className="text-xs text-muted-foreground">A: {item.a}</div>}
                                        {item.post && <p className="text-xs text-foreground mt-0.5">{item.post}</p>}
                                        {item.hashtags && (
                                          <div className="flex flex-wrap gap-1 mt-1">
                                            {item.hashtags.map((h: string) => (
                                              <span key={h} className="text-[10px] text-accent font-semibold">{h}</span>
                                            ))}
                                          </div>
                                        )}
                                        {item.title && <div className="font-bold text-xs">{item.title}</div>}
                                        {item.desc && <div className="text-xs text-muted-foreground">{item.desc}</div>}
                                        {item.name && <div className="font-semibold text-xs">{item.name} ({item.role})</div>}
                                        {item.quote && <div className="text-xs text-muted-foreground italic">"{item.quote}"</div>}
                                        {item.priority && (
                                          <span className={`inline-block text-[9px] font-bold px-2 py-0.5 rounded-full border mt-1.5 uppercase ${
                                            item.priority === "critical" ? "bg-rose-500/20 text-rose-400 border-rose-500/30" :
                                            item.priority === "high" ? "bg-amber-500/20 text-amber-400 border-amber-500/30" :
                                            item.priority === "medium" ? "bg-yellow-500/20 text-yellow-400 border-yellow-500/30" :
                                            "bg-sky-500/20 text-sky-400 border-sky-500/30"
                                          }`}>
                                            {item.priority}
                                          </span>
                                        )}
                                        {item.why && <p className="text-xs text-muted-foreground mt-1">{item.why}</p>}
                                      </li>
                                    );
                                  }
                                  return (
                                    <li key={i} className="flex items-start gap-2 text-xs">
                                      <CheckCircle2 className="h-4 w-4 text-accent shrink-0 mt-0.5" />
                                      <span className="text-muted-foreground">{item}</span>
                                    </li>
                                  );
                                })}
                              </ul>
                            ) : typeof val === "object" && val !== null ? (
                              <div className="space-y-3">
                                {Object.entries(val).map(([subK, subV]: any) => (
                                  <div key={subK} className="p-3 bg-black/10 border border-border/40 rounded-xl space-y-1">
                                    <div className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">{subK}</div>
                                    <p className="text-xs text-foreground whitespace-pre-wrap leading-relaxed">{subV}</p>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <p className="text-xs leading-relaxed text-muted-foreground">{val}</p>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

            </div>
          )}
        </div>

      </div>
    </div>
  );
}
