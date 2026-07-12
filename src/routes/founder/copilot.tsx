import { createFileRoute } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Bot, Sparkles, AlertTriangle, CheckCircle2, Copy, Check, 
  Award, Twitter, Globe, Send, Loader2, Download, Edit3, Save, 
  Search, RefreshCw, ChevronRight, FileText, Printer, BookOpen,
  DollarSign, Briefcase, GraduationCap, Calendar, Users, Eye,
  BarChart3, ShieldAlert, Sparkle, Heart, MessageCircle, Share2, 
  Mail, ShieldCheck, HelpCircle, Flame, ArrowRight, Target, 
  Plus, ArrowUpRight, Shield, Layers, Play, CheckCircle
} from "lucide-react";
import { useState, useMemo } from "react";
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
  { id: "press_kit", label: "Press Kit", icon: Send, desc: "Press releases, blogger & outreach pitches" },
  { id: "social_media", label: "Social Media", icon: Twitter, desc: "X threads, LinkedIn posts & Reddit pitches" },
  { id: "email_marketing", label: "Email Marketing", icon: Mail, desc: "Welcome flow, newsletters & referral programs" },
  { id: "seo", label: "SEO Strategy", icon: Search, desc: "Metadata, target keywords & linking plan" },
  { id: "content_marketing", label: "Content Marketing", icon: BookOpen, desc: "Blog ideas, Medium drafts & documentation" },
  { id: "sales_kit", label: "Sales Kit", icon: DollarSign, desc: "Sales script, cold emails & objection guides" },
  { id: "investor_kit", label: "Investor Kit", icon: Briefcase, desc: "Executive summaries, pitch outlines & TAM sizing" },
  { id: "customer_support", label: "Customer Support", icon: GraduationCap, desc: "Help center articles, onboarding & refunds" },
  { id: "launch_planner", label: "Launch Planner", icon: Calendar, desc: "30-day roadmap, calendar & metrics" },
  { id: "competitor_analysis", label: "Competitor Analysis", icon: ShieldAlert, desc: "Comparison table, SWOT & pricing matrix" },
  { id: "audience_insights", label: "Audience Insights", icon: Users, desc: "Buyer personas, pain triggers & positioning" },
  { id: "growth_engine", label: "Growth Engine", icon: Eye, desc: "Viral growth, partnerships & experiments" },
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

  // Custom UI Card Renderers
  const renderBrandKit = (data: any) => {
    if (!data) return null;
    return (
      <div className="space-y-6">
        <div className="grid md:grid-cols-2 gap-4">
          <div className="glass-strong p-6 rounded-2xl border border-border/40 space-y-2">
            <span className="text-[10px] uppercase font-bold text-accent">One-Liner Slogan</span>
            <p className="text-xl md:text-2xl font-bold text-foreground leading-tight">"{data.oneLiner}"</p>
          </div>
          <div className="glass-strong p-6 rounded-2xl border border-border/40 space-y-2">
            <span className="text-[10px] uppercase font-bold text-primary">Value Proposition</span>
            <p className="text-lg font-semibold text-foreground leading-relaxed">{data.valueProposition}</p>
          </div>
        </div>

        <div className="glass-strong p-6 rounded-2xl border border-border/40 space-y-3">
          <span className="text-[10px] uppercase font-bold text-muted-foreground">Brand Story</span>
          <p className="text-lg text-foreground leading-relaxed whitespace-pre-wrap select-text">{data.brandStory}</p>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          <div className="glass-strong p-5 rounded-xl border border-border/40 space-y-2">
            <span className="text-[10px] uppercase font-bold text-muted-foreground">Mission</span>
            <p className="text-sm text-foreground leading-relaxed">{data.mission}</p>
          </div>
          <div className="glass-strong p-5 rounded-xl border border-border/40 space-y-2">
            <span className="text-[10px] uppercase font-bold text-muted-foreground">Vision</span>
            <p className="text-sm text-foreground leading-relaxed">{data.vision}</p>
          </div>
          <div className="glass-strong p-5 rounded-xl border border-border/40 space-y-2">
            <span className="text-[10px] uppercase font-bold text-muted-foreground">Elevator Pitch</span>
            <p className="text-sm text-foreground leading-relaxed">{data.elevatorPitch}</p>
          </div>
        </div>

        <div className="glass-strong p-6 rounded-2xl border border-border/40 space-y-4">
          <h4 className="text-xs font-extrabold uppercase tracking-widest text-muted-foreground">Company Bios</h4>
          <div className="space-y-3">
            <div className="p-3 bg-black/10 rounded-xl border border-border/30">
              <div className="text-[9px] text-muted-foreground uppercase font-bold mb-1">50 Words</div>
              <p className="text-base text-foreground">{data.bio50}</p>
            </div>
            <div className="p-3 bg-black/10 rounded-xl border border-border/30">
              <div className="text-[9px] text-muted-foreground uppercase font-bold mb-1">100 Words</div>
              <p className="text-base text-foreground">{data.bio100}</p>
            </div>
            <div className="p-3 bg-black/10 rounded-xl border border-border/30">
              <div className="text-[9px] text-muted-foreground uppercase font-bold mb-1">250 Words</div>
              <p className="text-sm text-muted-foreground leading-relaxed">{data.bio250}</p>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="glass-strong p-5 rounded-xl border border-border/40 space-y-2">
            <span className="text-[10px] uppercase font-bold text-muted-foreground">Brand Colors Suggestions</span>
            <div className="flex gap-2.5 flex-wrap">
              {data.brandColors?.map((c: string) => (
                <span key={c} className="text-xs glass border border-border/40 px-3 py-1.5 rounded-full text-foreground flex items-center gap-1.5">
                  <div className="h-3 w-3 rounded-full bg-primary" /> {c}
                </span>
              ))}
            </div>
          </div>
          <div className="glass-strong p-5 rounded-xl border border-border/40 space-y-2">
            <span className="text-[10px] uppercase font-bold text-muted-foreground">Logo Concepts</span>
            <p className="text-sm text-muted-foreground leading-relaxed">{data.logoConcepts}</p>
          </div>
        </div>
      </div>
    );
  };

  const renderWebsiteCopy = (data: any) => {
    if (!data) return null;
    return (
      <div className="space-y-6">
        <div className="border border-border/50 rounded-3xl overflow-hidden shadow-elevated">
          <div className="bg-border/20 px-4 py-2 flex items-center gap-1.5 border-b border-border/40">
            <div className="h-2.5 w-2.5 rounded-full bg-rose-500" />
            <div className="h-2.5 w-2.5 rounded-full bg-amber-500" />
            <div className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
            <span className="text-[10px] text-muted-foreground ml-2 font-mono">Hero Section Mockup Preview</span>
          </div>
          <div className="p-8 md:p-12 text-center space-y-6 bg-surface/5">
            <h1 className="text-3xl md:text-5xl font-black text-foreground leading-tight max-w-2xl mx-auto tracking-tight select-text">
              {data.heroHeadline}
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-xl mx-auto leading-relaxed select-text">
              {data.heroSubtitle}
            </p>
            <div className="flex justify-center gap-3 flex-wrap">
              {data.ctaButtons?.map((btn: string, i: number) => (
                <button 
                  key={i} 
                  className={`px-6 py-3 rounded-xl text-sm font-bold cursor-pointer transition-transform hover:scale-[1.01] ${
                    i === 0 ? "text-white bg-primary shadow-glow-primary" : "glass border border-border/60 text-foreground"
                  }`}
                >
                  {btn}
                </button>
              ))}
            </div>
            <div className="pt-6 border-t border-border/30 max-w-md mx-auto text-xs text-muted-foreground">
              {data.trustSection}
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="glass-strong p-6 rounded-2xl border border-border/40 space-y-4">
            <h4 className="text-xs font-extrabold uppercase tracking-widest text-primary">Core Features</h4>
            <div className="space-y-3">
              {data.features?.map((f: any, i: number) => (
                <div key={i} className="p-4 bg-black/10 border border-border/30 rounded-xl space-y-1">
                  <div className="text-sm font-bold text-foreground">{f.title}</div>
                  <p className="text-xs text-muted-foreground">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-strong p-6 rounded-2xl border border-border/40 space-y-4">
            <h4 className="text-xs font-extrabold uppercase tracking-widest text-accent">Value Benefits</h4>
            <div className="space-y-3">
              {data.benefits?.map((b: any, i: number) => (
                <div key={i} className="p-4 bg-black/10 border border-border/30 rounded-xl space-y-1">
                  <div className="text-sm font-bold text-foreground">{b.title}</div>
                  <p className="text-xs text-muted-foreground">{b.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="glass-strong p-6 rounded-2xl border border-border/40 space-y-4">
          <h4 className="text-xs font-extrabold uppercase tracking-widest text-muted-foreground">Testimonials</h4>
          <div className="grid sm:grid-cols-2 gap-4">
            {data.testimonials?.map((t: any, i: number) => (
              <div key={i} className="p-4 bg-black/15 border border-border/30 rounded-xl space-y-2">
                <p className="text-sm text-muted-foreground italic">"{t.quote}"</p>
                <div className="text-xs text-foreground font-bold">{t.name} • <span className="font-normal text-muted-foreground">{t.role}</span></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderASO = (data: any) => {
    if (!data) return null;
    return (
      <div className="space-y-6">
        <div className="border border-border/50 rounded-3xl overflow-hidden shadow-elevated">
          <div className="bg-border/20 px-4 py-2 border-b border-border/40 flex items-center justify-between">
            <span className="text-[10px] text-muted-foreground font-mono">App Store Listing Preview</span>
            <div className="flex gap-1">
              <div className="h-2 w-2 rounded-full bg-border/80" />
              <div className="h-2 w-2 rounded-full bg-border/80" />
            </div>
          </div>
          <div className="p-6 space-y-6 bg-surface/10 select-text">
            <div className="flex items-start gap-4">
              <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 grid place-items-center text-3xl text-white shadow-glow-primary">
                {profile?.appIcon || "🚀"}
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-foreground leading-tight">{data.title}</h3>
                  <button className="px-3 py-1 rounded-full text-[10px] font-bold text-white bg-primary hover:scale-[1.02] cursor-pointer">
                    GET
                  </button>
                </div>
                <p className="text-xs text-muted-foreground">{data.subtitle}</p>
                <div className="flex items-center gap-1.5 text-[10px] text-accent mt-2">
                  <Award className="h-3.5 w-3.5" /> #1 Growth category
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 border-t border-border/30 pt-4 text-xs">
              <div className="space-y-1 bg-black/10 p-3 rounded-xl border border-border/30">
                <div className="text-[9px] text-muted-foreground uppercase font-bold">Title Characters</div>
                <div className="flex items-center justify-between">
                  <span className="font-semibold">{data.title?.length || 0} / 30</span>
                  <span className={(data.title?.length || 0) > 30 ? "text-rose-500" : "text-emerald-400"}>
                    {(data.title?.length || 0) > 30 ? "Over Limit" : "Compliant"}
                  </span>
                </div>
              </div>
              <div className="space-y-1 bg-black/10 p-3 rounded-xl border border-border/30">
                <div className="text-[9px] text-muted-foreground uppercase font-bold">Subtitle Characters</div>
                <div className="flex items-center justify-between">
                  <span className="font-semibold">{data.subtitle?.length || 0} / 30</span>
                  <span className={(data.subtitle?.length || 0) > 30 ? "text-rose-500" : "text-emerald-400"}>
                    {(data.subtitle?.length || 0) > 30 ? "Over Limit" : "Compliant"}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-2 border-t border-border/30 pt-4">
              <h4 className="text-xs font-bold uppercase text-muted-foreground">What's New (Release Notes)</h4>
              <p className="text-xs text-muted-foreground bg-black/10 border border-border/30 rounded-xl p-3">{data.releaseNotes}</p>
            </div>

            <div className="space-y-2 border-t border-border/30 pt-4">
              <h4 className="text-xs font-bold uppercase text-muted-foreground">Product Description</h4>
              <p className="text-sm text-foreground/90 leading-relaxed whitespace-pre-wrap">{data.description}</p>
            </div>
          </div>
        </div>

        <div className="glass-strong p-6 rounded-2xl border border-border/40 space-y-3">
          <span className="text-[10px] uppercase font-bold text-muted-foreground">ASO Target Keywords</span>
          <div className="flex flex-wrap gap-1.5">
            {data.keywords?.map((k: string) => (
              <span key={k} className="text-xs glass border border-border/40 px-2.5 py-1 rounded-full text-foreground">
                #{k}
              </span>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderSocialMedia = (data: any) => {
    if (!data) return null;
    return (
      <div className="space-y-8 select-text">
        <div className="space-y-4">
          <h3 className="text-lg font-black text-foreground border-b border-border/40 pb-2 flex items-center gap-2">
            <Twitter className="h-5 w-5 text-primary" /> X / Twitter Post Templates
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            {data.twitter?.map((post: string, i: number) => (
              <div key={i} className="glass-strong border border-border/40 rounded-2xl p-5 space-y-3 relative hover:scale-[1.01] transition-transform">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 grid place-items-center text-white text-sm shrink-0">
                    {profile?.appIcon || "🚀"}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm font-black text-foreground">{profile?.appName}</span>
                      <div className="h-3.5 w-3.5 rounded-full bg-primary grid place-items-center text-white text-[8px] font-bold">✓</div>
                    </div>
                    <div className="text-[10px] text-muted-foreground">@{profile?.appName.toLowerCase().replace(/\s/g, "")} • Just now</div>
                  </div>
                </div>
                <p className="text-base text-foreground leading-relaxed whitespace-pre-wrap">{post}</p>
                <div className="flex items-center justify-between text-muted-foreground text-xs pt-3 border-t border-border/30">
                  <span className="flex items-center gap-1 hover:text-primary cursor-pointer"><MessageCircle className="h-4 w-4" /> 12</span>
                  <span className="flex items-center gap-1 hover:text-emerald-400 cursor-pointer"><RefreshCw className="h-4 w-4" /> {3 + i}</span>
                  <span className="flex items-center gap-1 hover:text-rose-500 cursor-pointer"><Heart className="h-4 w-4" /> {24 + i * 2}</span>
                  <span className="flex items-center gap-1 hover:text-primary cursor-pointer"><Share2 className="h-4 w-4" /></span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-black text-foreground border-b border-border/40 pb-2 flex items-center gap-2">
            <Briefcase className="h-5 w-5 text-primary" /> LinkedIn Professional Updates
          </h3>
          <div className="space-y-4">
            {data.linkedin?.map((post: string, i: number) => (
              <div key={i} className="glass-strong border border-border/60 rounded-2xl p-6 space-y-4 hover:border-primary/20 transition-all">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 grid place-items-center text-white text-sm shrink-0">
                    {profile?.appIcon || "🚀"}
                  </div>
                  <div>
                    <div className="text-sm font-black text-foreground">{profile?.appName}</div>
                    <div className="text-[10px] text-muted-foreground">5,200 followers • Promoted</div>
                  </div>
                </div>
                <p className="text-base text-foreground/90 leading-relaxed whitespace-pre-wrap">{post}</p>
                <div className="flex items-center gap-4 text-xs text-muted-foreground pt-3 border-t border-border/30">
                  <span className="hover:text-primary cursor-pointer flex items-center gap-1"><Heart className="h-4 w-4" /> Like ({43 + i * 5})</span>
                  <span className="hover:text-primary cursor-pointer flex items-center gap-1"><MessageCircle className="h-4 w-4" /> Comment</span>
                  <span className="hover:text-primary cursor-pointer flex items-center gap-1"><Share2 className="h-4 w-4" /> Share</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderEmailMarketing = (data: any) => {
    if (!data) return null;
    return (
      <div className="space-y-6 select-text">
        {Object.entries(data).map(([key, email]: any) => (
          <div key={key} className="border border-border/50 rounded-2xl overflow-hidden shadow-elevated">
            <div className="bg-border/25 px-5 py-3 border-b border-border/40 space-y-1">
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] text-muted-foreground uppercase font-bold w-12">Subject:</span>
                <span className="text-sm font-bold text-foreground">{email.subject}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] text-muted-foreground uppercase font-bold w-12">To:</span>
                <span className="text-xs text-muted-foreground">[Recipient Email Address]</span>
              </div>
            </div>
            <div className="p-6 bg-white/5 space-y-4">
              <p className="text-base text-foreground/90 leading-relaxed whitespace-pre-wrap">{email.body}</p>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderAIRecommendations = (data: any) => {
    if (!data) return null;
    return (
      <div className="space-y-6">
        <h3 className="text-lg font-black text-foreground border-b border-border/40 pb-2 flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-primary" /> AI Prioritized Audit & Improvements
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          {Object.entries(data).map(([categoryName, list]: any) => {
            if (!Array.isArray(list) || list.length === 0) return null;
            return (
              <div key={categoryName} className="glass-strong border border-border/40 p-5 rounded-2xl space-y-3">
                <h4 className="text-xs font-black uppercase text-accent tracking-wider">
                  {categoryName.replace(/([A-Z])/g, " $1")}
                </h4>
                <div className="space-y-2">
                  {list.map((rec: any, idx: number) => {
                    const isCritical = rec.priority === "critical" || rec.priority === "high";
                    return (
                      <div key={idx} className={`p-4 rounded-xl border flex items-start gap-3 ${
                        isCritical ? "border-rose-500/20 bg-rose-500/5 text-rose-400" : "border-sky-500/20 bg-sky-500/5 text-sky-400"
                      }`}>
                        <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-extrabold text-foreground">{rec.title}</span>
                            <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded border ${
                              isCritical ? "bg-rose-500/20 text-rose-400 border-rose-500/40" : "bg-sky-500/20 text-sky-400 border-sky-500/40"
                            }`}>
                              {rec.priority}
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground leading-relaxed">{rec.why}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderProductHunt = (data: any) => {
    if (!data) return null;
    return (
      <div className="space-y-6 select-text">
        <div className="border border-amber-500/30 rounded-3xl overflow-hidden shadow-elevated bg-amber-500/5">
          <div className="bg-amber-500/10 px-5 py-3 border-b border-amber-500/20 flex items-center justify-between">
            <span className="text-xs text-amber-500 font-bold uppercase tracking-wider">Product Hunt Launch Details</span>
            <span className="text-[10px] bg-amber-500/20 text-amber-500 px-2 py-0.5 rounded-full font-bold">Scheduled</span>
          </div>
          <div className="p-6 space-y-4">
            <h3 className="text-2xl font-black text-foreground">"{data.tagline}"</h3>
            <p className="text-base text-muted-foreground leading-relaxed">{data.description}</p>
            <div className="flex items-center gap-2 border-t border-border/30 pt-4">
              <span className="text-[10px] uppercase font-bold text-muted-foreground">Launch Checklist:</span>
              <div className="flex flex-wrap gap-1.5">
                {data.checklist?.map((item: string, i: number) => (
                  <span key={i} className="text-xs glass border border-border/40 px-2.5 py-1 rounded-full text-foreground flex items-center gap-1">
                    <CheckCircle className="h-3 w-3 text-emerald-400" /> {item}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="glass-strong p-6 rounded-2xl border border-border/40 space-y-3">
          <span className="text-[10px] uppercase font-bold text-accent">Maker's First Comment</span>
          <div className="p-4 bg-black/10 border border-border/30 rounded-xl space-y-2">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-primary grid place-items-center text-xs text-white">M</div>
              <div>
                <div className="text-xs font-bold text-foreground">Founder (Maker)</div>
                <div className="text-[9px] text-muted-foreground">Product Hunt discussion</div>
              </div>
            </div>
            <p className="text-sm text-foreground/90 leading-relaxed whitespace-pre-wrap italic">"{data.firstComment}"</p>
          </div>
        </div>

        {data.hunterOutreach && (
          <div className="border border-border/50 rounded-2xl overflow-hidden shadow-elevated">
            <div className="bg-border/25 px-5 py-3 border-b border-border/40 text-xs font-bold text-muted-foreground uppercase">
              Hunter Outreach Template
            </div>
            <div className="p-5 bg-black/5 text-sm text-foreground/95 leading-relaxed whitespace-pre-wrap font-mono">
              {data.hunterOutreach}
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderPressKit = (data: any) => {
    if (!data) return null;
    return (
      <div className="space-y-6 select-text">
        <div className="glass-strong p-8 rounded-3xl border border-border/40 space-y-4">
          <span className="text-[10px] uppercase font-bold text-muted-foreground">Official Press Release</span>
          <p className="text-base text-foreground leading-relaxed whitespace-pre-wrap select-text">{data.pressRelease}</p>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="glass-strong p-5 rounded-xl border border-border/40 space-y-2">
            <span className="text-[10px] uppercase font-bold text-muted-foreground">Journalist Pitch Email</span>
            <p className="text-xs text-muted-foreground whitespace-pre-wrap leading-relaxed bg-black/10 border border-border/30 p-3 rounded-xl">{data.journalistEmail}</p>
          </div>
          <div className="glass-strong p-5 rounded-xl border border-border/40 space-y-2">
            <span className="text-[10px] uppercase font-bold text-muted-foreground">Blogger Pitch Email</span>
            <p className="text-xs text-muted-foreground whitespace-pre-wrap leading-relaxed bg-black/10 border border-border/30 p-3 rounded-xl">{data.bloggerOutreach}</p>
          </div>
        </div>
      </div>
    );
  };

  const renderSEO = (data: any) => {
    if (!data) return null;
    return (
      <div className="space-y-6 select-text">
        <div className="border border-border/50 rounded-2xl overflow-hidden shadow-elevated">
          <div className="bg-border/25 px-4 py-2 border-b border-border/40 text-[10px] text-muted-foreground font-mono">
            Google Search Snippet Preview
          </div>
          <div className="p-6 bg-[#1a1a1a] text-white space-y-1.5 font-sans">
            <div className="text-[11px] text-[#bdc1c6] truncate">https://www.google.com/search?q={profile?.appName.toLowerCase()}</div>
            <h3 className="text-xl font-bold text-[#8ab4f8] hover:underline cursor-pointer leading-tight">
              {data.seoTitle}
            </h3>
            <p className="text-sm text-[#bdc1c6] leading-relaxed max-w-xl">
              {data.metaDescription}
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="glass-strong p-5 rounded-xl border border-border/40 space-y-2">
            <span className="text-[10px] uppercase font-bold text-primary">Primary Keywords</span>
            <div className="flex flex-wrap gap-1.5">
              {data.primaryKeywords?.map((k: string) => (
                <span key={k} className="text-xs glass border border-border/40 px-2.5 py-1 rounded-full text-foreground font-semibold">
                  {k}
                </span>
              ))}
            </div>
          </div>
          <div className="glass-strong p-5 rounded-xl border border-border/40 space-y-2">
            <span className="text-[10px] uppercase font-bold text-accent">Long-Tail Search Targets</span>
            <div className="flex flex-wrap gap-1.5">
              {data.longTailKeywords?.map((k: string) => (
                <span key={k} className="text-xs glass border border-border/40 px-2.5 py-1 rounded-full text-foreground font-semibold">
                  {k}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderContentMarketing = (data: any) => {
    if (!data) return null;
    return (
      <div className="space-y-6 select-text">
        <div className="space-y-4">
          <h3 className="text-lg font-black text-foreground border-b border-border/40 pb-2 flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary" /> Blog Article Ideas
          </h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.blogIdeas?.map((idea: string, i: number) => (
              <div key={i} className="glass-strong border border-border/40 rounded-2xl p-5 flex flex-col justify-between space-y-4 hover:border-primary/30 transition-all">
                <span className="text-[9px] uppercase font-bold text-accent">Article Concept #{i+1}</span>
                <p className="text-sm font-black text-foreground leading-snug">{idea}</p>
                <div className="flex items-center justify-between text-xs text-primary font-bold pt-2 border-t border-border/30">
                  <span>View Outline</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="border border-border/50 rounded-2xl overflow-hidden shadow-elevated">
          <div className="bg-border/25 px-5 py-3 border-b border-border/40 flex items-center justify-between">
            <span className="text-xs text-muted-foreground font-bold uppercase tracking-wider">Medium Publication Article Draft</span>
            <span className="text-[10px] bg-primary/20 text-primary px-2 py-0.5 rounded-full font-bold">Draft ready</span>
          </div>
          <div className="p-6 md:p-8 space-y-6 bg-surface/5">
            <h2 className="text-2xl md:text-3xl font-black text-foreground leading-tight select-text">
              {data.mediumArticle?.title}
            </h2>
            <div className="flex items-center gap-3 border-b border-border/30 pb-4">
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 grid place-items-center text-white font-bold">F</div>
              <div>
                <div className="text-xs font-bold text-foreground">Founder Team</div>
                <div className="text-[10px] text-muted-foreground">5 min read • Published in Bootstrappers</div>
              </div>
            </div>
            <p className="text-base text-foreground/90 leading-relaxed whitespace-pre-wrap select-text">
              {data.mediumArticle?.body}
            </p>
          </div>
        </div>
      </div>
    );
  };

  const renderSalesKit = (data: any) => {
    if (!data) return null;
    return (
      <div className="space-y-6 select-text">
        <div className="border border-border/50 rounded-2xl overflow-hidden shadow-elevated">
          <div className="bg-border/25 px-5 py-3 border-b border-border/40 text-xs font-bold text-muted-foreground uppercase">
            Sales Outreach Cold Email
          </div>
          <div className="p-6 bg-black/5 text-base text-foreground/95 leading-relaxed whitespace-pre-wrap">
            {data.coldEmail}
          </div>
        </div>

        <div className="glass-strong p-6 rounded-2xl border border-border/40 space-y-3 bg-primary/5">
          <div className="flex items-center gap-2 text-primary font-bold text-sm uppercase">
            <Flame className="h-4 w-4" /> Core Sales Pitch Script
          </div>
          <p className="text-lg text-foreground leading-relaxed whitespace-pre-wrap select-text italic">
            "{data.salesPitch}"
          </p>
        </div>

        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase text-muted-foreground">Objection Handling Guidelines</h4>
          <div className="grid md:grid-cols-2 gap-4">
            {data.objectionHandling?.map((item: any, i: number) => (
              <div key={i} className="glass-strong border border-border/40 p-4 rounded-xl space-y-2">
                <div className="text-xs font-bold text-rose-400">Objection: "{item.objection}"</div>
                <p className="text-xs text-muted-foreground leading-relaxed">Response Strategy: {item.response}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderInvestorKit = (data: any) => {
    if (!data) return null;
    return (
      <div className="space-y-6 select-text">
        <div className="glass-strong p-6 rounded-2xl border border-border/40 space-y-3 bg-gradient-to-br from-primary/10 to-accent/10">
          <span className="text-[10px] uppercase font-bold text-primary">Executive Summary</span>
          <p className="text-lg text-foreground leading-relaxed select-text">{data.executiveSummary}</p>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="glass-strong p-5 rounded-xl border border-border/40 space-y-2">
            <span className="text-[10px] uppercase font-bold text-muted-foreground">Problem Statement</span>
            <p className="text-sm text-foreground/90 leading-relaxed">{data.problemStatement}</p>
          </div>
          <div className="glass-strong p-5 rounded-xl border border-border/40 space-y-2">
            <span className="text-[10px] uppercase font-bold text-muted-foreground">Proposed Solution</span>
            <p className="text-sm text-foreground/90 leading-relaxed">{data.solution}</p>
          </div>
        </div>

        <div className="glass-strong p-6 rounded-2xl border border-border/40 space-y-4">
          <h4 className="text-xs font-extrabold uppercase tracking-widest text-muted-foreground">Pitch Deck Slides Blueprint</h4>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {data.pitchDeckOutline?.map((slide: string, i: number) => (
              <div key={i} className="p-3 bg-black/10 border border-border/30 rounded-xl flex items-start gap-2.5">
                <span className="text-xs font-bold text-accent font-mono">Slide {i+1}</span>
                <p className="text-xs text-foreground font-semibold">{slide}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderCustomerSupport = (data: any) => {
    if (!data) return null;
    return (
      <div className="space-y-6 select-text">
        <div className="grid md:grid-cols-2 gap-4">
          {data.helpArticles?.map((art: any, i: number) => (
            <div key={i} className="glass-strong border border-border/40 p-6 rounded-2xl space-y-3">
              <span className="text-[9px] uppercase font-bold text-primary">Help Center Guide</span>
              <h3 className="text-base font-black text-foreground">{art.title}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">{art.body}</p>
            </div>
          ))}
        </div>

        <div className="glass-strong p-6 rounded-2xl border border-border/40 space-y-4">
          <h4 className="text-xs font-extrabold uppercase tracking-widest text-muted-foreground">Refund Policy Framework</h4>
          <p className="text-sm text-foreground/90 leading-relaxed bg-black/10 border border-border/30 rounded-xl p-4">{data.refundPolicy}</p>
        </div>
      </div>
    );
  };

  const renderLaunchPlanner = (data: any) => {
    if (!data) return null;
    return (
      <div className="space-y-6 select-text">
        <div className="grid md:grid-cols-3 gap-4">
          {data.kpis?.map((kpi: string, i: number) => (
            <div key={i} className="glass-strong p-5 rounded-xl border border-border/40 space-y-2 text-center">
              <span className="text-[10px] uppercase font-bold text-primary">Target KPI #{i+1}</span>
              <p className="text-xl font-bold text-foreground">{kpi}</p>
            </div>
          ))}
        </div>

        <div className="glass-strong p-6 rounded-2xl border border-border/40 space-y-4">
          <h4 className="text-xs font-extrabold uppercase tracking-widest text-muted-foreground">30-Day Launch Roadmap</h4>
          <div className="space-y-3">
            {data.roadmap?.map((step: string, i: number) => (
              <div key={i} className="flex items-start gap-3 p-3 bg-black/10 border border-border/30 rounded-xl">
                <span className="text-xs font-bold text-accent bg-accent/20 px-2 py-0.5 rounded-full shrink-0 font-mono">Phase {i+1}</span>
                <p className="text-sm text-foreground font-semibold leading-relaxed">{step}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderCompetitorAnalysis = (data: any) => {
    if (!data) return null;
    return (
      <div className="space-y-6 select-text">
        <div className="glass-strong p-6 rounded-2xl border border-border/40 space-y-4">
          <h4 className="text-xs font-extrabold uppercase tracking-widest text-muted-foreground">Feature Comparison Table</h4>
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-border/40">
                  <th className="py-2.5 font-bold uppercase text-muted-foreground">Feature</th>
                  <th className="py-2.5 font-bold uppercase text-primary">Our App</th>
                  <th className="py-2.5 font-bold uppercase text-muted-foreground">Main Competitor</th>
                </tr>
              </thead>
              <tbody>
                {data.comparisonTable?.map((row: any, i: number) => (
                  <tr key={i} className="border-b border-border/30">
                    <td className="py-3 font-semibold text-foreground">{row.feature}</td>
                    <td className="py-3 text-emerald-400 font-bold">{row.me}</td>
                    <td className="py-3 text-muted-foreground">{row.competitor}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="glass-strong p-5 rounded-xl border border-border/40 space-y-2">
            <span className="text-[10px] uppercase font-bold text-muted-foreground">Positioning Strategy</span>
            <p className="text-sm text-foreground/90 leading-relaxed">{data.positioning}</p>
          </div>
          <div className="glass-strong p-5 rounded-xl border border-border/40 space-y-2">
            <span className="text-[10px] uppercase font-bold text-muted-foreground">Competitive Advantages</span>
            <ul className="space-y-1">
              {data.advantages?.map((adv: string, i: number) => (
                <li key={i} className="flex items-center gap-1.5 text-xs text-foreground/95">
                  <CheckCircle2 className="h-3.5 w-3.5 text-accent shrink-0" /> {adv}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    );
  };

  const renderAudienceInsights = (data: any) => {
    if (!data) return null;
    return (
      <div className="space-y-6 select-text">
        <div className="grid md:grid-cols-2 gap-4">
          {data.personas?.map((p: any, i: number) => (
            <div key={i} className="glass-strong p-6 rounded-2xl border border-border/40 space-y-3">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 grid place-items-center text-white font-bold">P</div>
                <div>
                  <h4 className="text-base font-black text-foreground">{p.name}</h4>
                  <span className="text-[9px] uppercase font-bold text-accent">Target Buyer Persona</span>
                </div>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">{p.details}</p>
            </div>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="glass-strong p-5 rounded-xl border border-border/40 space-y-2">
            <span className="text-[10px] uppercase font-bold text-muted-foreground">Core Pain Points</span>
            <ul className="space-y-1.5">
              {data.painPoints?.map((p: string, i: number) => (
                <li key={i} className="flex items-start gap-2 text-xs text-foreground/90">
                  <span className="h-1.5 w-1.5 rounded-full bg-rose-400 mt-1.5 shrink-0" /> {p}
                </li>
              ))}
            </ul>
          </div>
          <div className="glass-strong p-5 rounded-xl border border-border/40 space-y-2">
            <span className="text-[10px] uppercase font-bold text-muted-foreground">Buying Triggers</span>
            <ul className="space-y-1.5">
              {data.triggers?.map((t: string, i: number) => (
                <li key={i} className="flex items-start gap-2 text-xs text-foreground/90">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary mt-1.5 shrink-0" /> {t}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    );
  };

  const renderGrowthEngine = (data: any) => {
    if (!data) return null;
    return (
      <div className="space-y-6 select-text">
        <div className="glass-strong p-6 rounded-2xl border border-border/40 space-y-4">
          <h4 className="text-xs font-extrabold uppercase tracking-widest text-primary">Viral Growth Ideas</h4>
          <div className="grid sm:grid-cols-2 gap-3">
            {data.viralIdeas?.map((idea: string, i: number) => (
              <div key={i} className="p-4 bg-black/10 border border-border/30 rounded-xl space-y-1 flex items-start gap-2.5">
                <Sparkle className="h-4 w-4 text-accent mt-0.5 shrink-0" />
                <p className="text-xs text-foreground font-semibold leading-relaxed">{idea}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-strong p-6 rounded-2xl border border-border/40 space-y-3">
          <span className="text-[10px] uppercase font-bold text-muted-foreground">Referral Program Concept</span>
          <p className="text-sm text-foreground/90 leading-relaxed bg-black/10 border border-border/30 rounded-xl p-4">{data.referralProgram}</p>
        </div>
      </div>
    );
  };

  const renderSectionView = () => {
    if (!activeSecData) return null;
    
    if (activeSection === "brand_kit") return renderBrandKit(activeSecData);
    if (activeSection === "website_copy") return renderWebsiteCopy(activeSecData);
    if (activeSection === "aso") return renderASO(activeSecData);
    if (activeSection === "product_hunt") return renderProductHunt(activeSecData);
    if (activeSection === "press_kit") return renderPressKit(activeSecData);
    if (activeSection === "social_media") return renderSocialMedia(activeSecData);
    if (activeSection === "email_marketing") return renderEmailMarketing(activeSecData);
    if (activeSection === "seo") return renderSEO(activeSecData);
    if (activeSection === "content_marketing") return renderContentMarketing(activeSecData);
    if (activeSection === "sales_kit") return renderSalesKit(activeSecData);
    if (activeSection === "investor_kit") return renderInvestorKit(activeSecData);
    if (activeSection === "customer_support") return renderCustomerSupport(activeSecData);
    if (activeSection === "launch_planner") return renderLaunchPlanner(activeSecData);
    if (activeSection === "competitor_analysis") return renderCompetitorAnalysis(activeSecData);
    if (activeSection === "audience_insights") return renderAudienceInsights(activeSecData);
    if (activeSection === "growth_engine") return renderGrowthEngine(activeSecData);
    if (activeSection === "ai_recommendations") return renderAIRecommendations(activeSecData);

    // Fallback card renderer
    return (
      <div className="space-y-4">
        {Object.entries(activeSecData).map(([key, val]) => {
          const isEditing = editingField?.section === activeSection && editingField?.key === key;
          const fieldId = `${activeSection}_${key}`;

          return (
            <div key={key} className="glass-strong border border-border/40 p-6 rounded-2xl space-y-4 relative hover:border-primary/20 transition-all print:border-none print:px-0">
              <div className="flex items-center justify-between border-b border-border/40 pb-2.5">
                <h4 className="text-xs font-extrabold uppercase tracking-widest text-muted-foreground">
                  {key.replace(/([A-Z])/g, " $1")}
                </h4>
                <div className="flex items-center gap-2 print:hidden">
                  {isEditing ? (
                    <button onClick={() => handleSaveEdit(activeSection, key)} className="h-7 w-7 rounded-lg glass text-emerald-400 hover:text-emerald-300 grid place-items-center cursor-pointer"><Save className="h-3.5 w-3.5" /></button>
                  ) : (
                    <button onClick={() => { setEditingField({ section: activeSection, key }); setEditValue(typeof val === "object" ? JSON.stringify(val, null, 2) : String(val)); }} className="h-7 w-7 rounded-lg glass text-muted-foreground hover:text-foreground grid place-items-center cursor-pointer"><Edit3 className="h-3.5 w-3.5" /></button>
                  )}
                  <button onClick={() => handleCopy(typeof val === "object" ? JSON.stringify(val, null, 2) : String(val), fieldId)} className="h-7 w-7 rounded-lg glass text-muted-foreground hover:text-foreground grid place-items-center cursor-pointer">
                    {copiedId === fieldId ? <Check className="h-3.5 w-3.5 text-green-400" /> : <Copy className="h-3.5 w-3.5" />}
                  </button>
                </div>
              </div>
              {isEditing ? (
                <textarea rows={6} value={editValue} onChange={(e) => setEditValue(e.target.value)} className="w-full bg-black/25 text-sm text-foreground p-3 border border-primary/40 focus:border-primary/60 rounded-xl outline-none resize-none font-mono" />
              ) : (
                <div className="text-sm leading-relaxed text-foreground select-text">{String(val)}</div>
              )}
            </div>
          );
        })}
      </div>
    );
  };

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
              <div className="w-full bg-border/40 h-2.5 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-300" style={{ width: `${bulkProgress}%` }} />
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

      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6 print:block">
        
        <div className="space-y-4 lg:sticky lg:top-8 h-fit print:hidden">
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
                    setSearchQuery("");
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

        <div id="print-area" className="space-y-6">
          {searchQuery ? (
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
                        <button onClick={() => { setSearchQuery(""); setActiveSection(item.section); }} className="text-[10px] text-primary hover:underline cursor-pointer">
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
            <div className="space-y-6">
              
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

              {!activeSecData ? (
                <div className="glass-strong rounded-3xl border border-border/40 p-12 text-center space-y-4">
                  <Sparkles className="h-10 w-10 text-primary/40 mx-auto animate-pulse" />
                  <div>
                    <h3 className="text-sm font-semibold text-foreground font-title">Launch Asset Suite is Ready</h3>
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
                renderSectionView()
              )}

            </div>
          )}
        </div>

      </div>
    </div>
  );
}
