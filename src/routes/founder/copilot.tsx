import { createFileRoute } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Bot, Sparkles, AlertTriangle, CheckCircle, Copy, Check, 
  Settings, Award, Twitter, Globe, Send, Terminal, Loader2
} from "lucide-react";
import { useState, useMemo, useEffect } from "react";
import { useAppProfile } from "@/context/AppProfileContext";
import { lint, type LintReport, type AppListing } from "@/lib/aso-lint";
import { ScoreDial } from "@/components/founder/ScoreDial";
import { toast } from "sonner";

export const Route = createFileRoute("/founder/copilot")({
  component: CopilotPage,
});

type TabType = "aso" | "kit";
type KitTabType = "aso_opt" | "ph" | "social" | "press";

function CopilotPage() {
  const { profile, hasProduct } = useAppProfile();
  const [activeTab, setActiveTab] = useState<TabType>("aso");
  const [kitTab, setKitTab] = useState<KitTabType>("aso_opt");
  const [loading, setLoading] = useState(false);
  const [progressMsg, setProgressMsg] = useState("");
  const [copiedText, setCopiedText] = useState<string | null>(null);

  // Load from local storage if previously generated
  const [launchKit, setLaunchKit] = useState<any>(() => {
    const cached = localStorage.getItem("lm_launch_kit");
    return cached ? JSON.parse(cached) : null;
  });

  // Calculate ASO audit report from product profile
  const asoReport = useMemo<LintReport | null>(() => {
    if (!profile) return null;
    const listing: AppListing = {
      appName: profile.appName,
      platform: profile.platform === "Both" ? "both" : profile.platform === "Android" ? "android" : "ios",
      category: profile.category,
      title: profile.appName,
      subtitle: profile.category,
      keywords: "productivity, matching, cross promotion, launches, growth, community",
      shortDescription: profile.description || "",
      description: profile.longDescription || profile.description || "",
      whatItDoes: profile.description || "",
    };
    return lint(listing);
  }, [profile]);

  // Copy helper
  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(id);
    toast.success("Copied to clipboard!");
    setTimeout(() => setCopiedText(null), 2000);
  };

  // Generate launch kit via backend API
  const generateKit = async () => {
    if (!profile) return;
    setLoading(true);
    setErrorMsg(null);

    const stages = [
      "Consulting Llama-3.3-70b-versatile...",
      "Analyzing store metadata...",
      "Generating Product Hunt materials...",
      "Formatting 7-day social media calendar...",
      "Refining cold outreach pitches..."
    ];

    let stageIdx = 0;
    setProgressMsg(stages[0]);
    const timer = setInterval(() => {
      stageIdx = (stageIdx + 1) % stages.length;
      setProgressMsg(stages[stageIdx]);
    }, 2000);

    try {
      const response = await fetch("/api/launch-kit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profile }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate launch kit. Check your Groq key and server log.");
      }

      const data = await response.json();
      localStorage.setItem("lm_launch_kit", JSON.stringify(data));
      setLaunchKit(data);
      toast.success("Launch Kit generated successfully!");
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "An error occurred during generation");
      toast.error("Generation Failed");
    } finally {
      clearInterval(timer);
      setLoading(false);
    }
  };

  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!hasProduct || !profile) {
    return (
      <div className="p-6 md:p-8 max-w-4xl">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl grid place-items-center bg-primary/20">
              <Bot className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">AI Launch Copilot</h1>
              <p className="text-sm text-muted-foreground">ASO Audits & Growth Kits powered by Llama 3.3</p>
            </div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 16 }} 
          animate={{ opacity: 1, y: 0 }}
          className="glass-strong rounded-3xl border border-primary/20 p-8 text-center"
        >
          <Bot className="h-16 w-16 text-primary/40 mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">No Product Launched Yet</h2>
          <p className="text-muted-foreground text-sm max-w-md mx-auto mb-6">
            Launch your product profile using the Wizard on the Dashboard page to unlock instant ASO audits, store optimizations, and social marketing launch calendars.
          </p>
        </motion.div>
      </div>
    );
  }

  // Group findings by field name
  const findingsByField = asoReport
    ? asoReport.findings.reduce((acc: any, item) => {
        acc[item.field] = acc[item.field] || [];
        acc[item.field].push(item);
        return acc;
      }, {})
    : {};

  const getSeverityStyle = (s: string) => {
    if (s === "critical") return "border-red-500/20 bg-red-500/5 text-red-400";
    if (s === "warn") return "border-amber-500/20 bg-amber-500/5 text-amber-400";
    return "border-sky-500/20 bg-sky-500/5 text-sky-400";
  };

  return (
    <div className="p-6 md:p-8 max-w-5xl">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-2xl grid place-items-center bg-primary/20">
            <Bot className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">AI Launch Copilot</h1>
            <p className="text-sm text-muted-foreground">ASO Audits & Custom Growth Kits for {profile.appName}</p>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex bg-border/40 p-1 rounded-xl w-fit">
          <button 
            onClick={() => setActiveTab("aso")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${activeTab === "aso" ? "bg-primary text-white" : "text-muted-foreground hover:text-foreground"}`}
          >
            ASO Audit
          </button>
          <button 
            onClick={() => setActiveTab("kit")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${activeTab === "kit" ? "bg-primary text-white" : "text-muted-foreground hover:text-foreground"}`}
          >
            Launch Kit
          </button>
        </div>
      </motion.div>

      {/* Main workspace */}
      <AnimatePresence mode="wait">
        {activeTab === "aso" ? (
          <motion.div 
            key="aso-tab"
            initial={{ opacity: 0, y: 12 }} 
            animate={{ opacity: 1, y: 0 }} 
            exit={{ opacity: 0, y: -12 }}
            className="space-y-6"
          >
            {/* Score & dial screen */}
            {asoReport && (
              <div className="grid md:grid-cols-[200px_1fr] gap-6 glass-strong rounded-3xl p-6 border border-border/50">
                <div className="flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-border/60 pb-6 md:pb-0 md:pr-6">
                  <ScoreDial score={asoReport.score} grade={asoReport.grade} size={150} />
                </div>
                <div className="space-y-4">
                  <h3 className="text-lg font-bold">ASO Audit Summary</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    We scanned your launch metadata (Title, Subtitle, Description) against standard store rules. 
                    Your app received an ASO score of <span className="text-primary font-bold">{asoReport.score}/100</span>.
                    Each critical warning resolved directly increases your discoverability on launch day.
                  </p>
                  
                  {/* Field status breakdown */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
                    {Object.entries(asoReport.fieldStats).map(([field, stat]: any) => (
                      <div key={field} className="glass rounded-xl p-3 border border-border/40">
                        <div className="text-[10px] text-muted-foreground uppercase tracking-widest">{field}</div>
                        <div className="text-sm font-bold mt-1 text-white">{stat.used} chars</div>
                        <div className="text-[10px] text-muted-foreground mt-0.5">budget: {stat.max}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Findings list */}
            <div className="space-y-4">
              <h2 className="text-lg font-bold">Audit Violations & Recommendations</h2>
              {asoReport && asoReport.findings.length === 0 ? (
                <div className="glass rounded-2xl p-6 border border-green-500/20 bg-green-500/5 text-center text-green-400">
                  <CheckCircle className="h-10 w-10 mx-auto mb-2 text-green-400" />
                  <p className="font-semibold text-sm">Perfect Store Optimization!</p>
                  <p className="text-xs text-muted-foreground mt-1">We found no character, superlatives, or keyword stuffing violations.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {Object.entries(findingsByField).map(([field, list]: any) => (
                    <div key={field} className="glass rounded-2xl p-5 border border-border/40 space-y-3">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-accent">{field} checks</h4>
                      <div className="space-y-2.5">
                        {list.map((finding: any, idx: number) => (
                          <div key={idx} className={`p-4 rounded-xl border flex items-start gap-3 ${getSeverityStyle(finding.severity)}`}>
                            <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
                            <div className="space-y-1">
                              <p className="text-sm font-semibold">{finding.message}</p>
                              <p className="text-xs text-muted-foreground font-mono">➜ Fix: {finding.fix}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="kit-tab"
            initial={{ opacity: 0, y: 12 }} 
            animate={{ opacity: 1, y: 0 }} 
            exit={{ opacity: 0, y: -12 }}
            className="space-y-6"
          >
            {/* Generate launch kit placeholder */}
            {!launchKit ? (
              <div className="glass-strong rounded-3xl border border-primary/20 p-8 text-center space-y-6">
                <Sparkles className="h-12 w-12 text-primary mx-auto animate-pulse" />
                <div className="space-y-2">
                  <h3 className="text-xl font-bold">Generate Custom Launch Kit</h3>
                  <p className="text-sm text-muted-foreground max-w-lg mx-auto leading-relaxed">
                    Ask **Llama-3.3-70b-versatile** on Groq to generate optimized ASO rewrites, a 7-day social marketing calendar, Product Hunt text, and email pitches specifically matching your app details.
                  </p>
                </div>
                {errorMsg && (
                  <div className="text-xs text-red-400 bg-red-500/10 p-3 rounded-lg max-w-sm mx-auto border border-red-500/20 font-mono">
                    {errorMsg}
                  </div>
                )}
                <button 
                  onClick={generateKit}
                  disabled={loading}
                  className="px-6 py-3 rounded-xl bg-primary hover:bg-primary-hover text-white font-semibold flex items-center gap-2 mx-auto disabled:opacity-50 transition cursor-pointer"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" /> {progressMsg}
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4" /> Generate Launch Kit
                    </>
                  )}
                </button>
              </div>
            ) : (
              <div className="grid lg:grid-cols-[220px_1fr] gap-6">
                {/* Secondary navigation */}
                <div className="flex flex-col gap-2 bg-border/20 p-2 rounded-2xl h-fit">
                  {[
                    { id: "aso_opt", label: "Store Optimization", icon: Award },
                    { id: "ph", label: "Product Hunt", icon: Globe },
                    { id: "social", label: "Social Calendar", icon: Twitter },
                    { id: "press", label: "Press Pitch", icon: Send },
                  ].map((subTab) => {
                    const Icon = subTab.icon;
                    return (
                      <button
                        key={subTab.id}
                        onClick={() => setKitTab(subTab.id as KitTabType)}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-left text-sm font-medium transition ${
                          kitTab === subTab.id ? "bg-primary text-white" : "text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        <Icon className="h-4 w-4" /> {subTab.label}
                      </button>
                    );
                  })}
                  <div className="border-t border-border/40 my-1 pt-1">
                    <button
                      onClick={() => {
                        localStorage.removeItem("lm_launch_kit");
                        setLaunchKit(null);
                      }}
                      className="w-full text-center py-2 text-xs text-red-400 hover:bg-red-500/10 rounded-xl transition"
                    >
                      Reset & Regenerate
                    </button>
                  </div>
                </div>

                {/* Content display */}
                <div className="glass rounded-3xl p-6 border border-border/50 min-h-[300px]">
                  {kitTab === "aso_opt" && (
                    <div className="space-y-5">
                      <h3 className="text-lg font-bold border-b border-border/60 pb-3 flex items-center gap-2">
                        <Award className="h-5 w-5 text-accent" /> Store Search Optimizations
                      </h3>
                      <div className="space-y-4">
                        <div className="space-y-1">
                          <label className="text-xs text-muted-foreground uppercase tracking-widest font-mono">Optimized Title (max 30)</label>
                          <div className="p-3 bg-black/20 border border-border/40 rounded-xl flex items-center justify-between">
                            <span className="font-semibold text-sm">{launchKit.aso.title}</span>
                            <button onClick={() => handleCopy(launchKit.aso.title, "aso_title")} className="text-muted-foreground hover:text-primary transition">
                              {copiedText === "aso_title" ? <Check className="h-4 w-4 text-green-400" /> : <Copy className="h-4 w-4" />}
                            </button>
                          </div>
                        </div>

                        <div className="space-y-1">
                          <label className="text-xs text-muted-foreground uppercase tracking-widest font-mono">Optimized Subtitle (max 30)</label>
                          <div className="p-3 bg-black/20 border border-border/40 rounded-xl flex items-center justify-between">
                            <span className="font-semibold text-sm">{launchKit.aso.subtitle}</span>
                            <button onClick={() => handleCopy(launchKit.aso.subtitle, "aso_sub")} className="text-muted-foreground hover:text-primary transition">
                              {copiedText === "aso_sub" ? <Check className="h-4 w-4 text-green-400" /> : <Copy className="h-4 w-4" />}
                            </button>
                          </div>
                        </div>

                        <div className="space-y-1">
                          <label className="text-xs text-muted-foreground uppercase tracking-widest font-mono">Optimized Long Description</label>
                          <div className="p-4 bg-black/20 border border-border/40 rounded-xl relative">
                            <button onClick={() => handleCopy(launchKit.aso.description, "aso_desc")} className="absolute top-3 right-3 text-muted-foreground hover:text-primary transition">
                              {copiedText === "aso_desc" ? <Check className="h-4 w-4 text-green-400" /> : <Copy className="h-4 w-4" />}
                            </button>
                            <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap pr-6">{launchKit.aso.description}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {kitTab === "ph" && (
                    <div className="space-y-5">
                      <h3 className="text-lg font-bold border-b border-border/60 pb-3 flex items-center gap-2">
                        <Globe className="h-5 w-5 text-accent" /> Product Hunt Templates
                      </h3>
                      <div className="space-y-4">
                        <div className="space-y-1">
                          <label className="text-xs text-muted-foreground uppercase tracking-widest font-mono">Launch Tagline (max 60)</label>
                          <div className="p-3 bg-black/20 border border-border/40 rounded-xl flex items-center justify-between">
                            <span className="font-semibold text-sm">{launchKit.productHunt.tagline}</span>
                            <button onClick={() => handleCopy(launchKit.productHunt.tagline, "ph_tag")} className="text-muted-foreground hover:text-primary transition">
                              {copiedText === "ph_tag" ? <Check className="h-4 w-4 text-green-400" /> : <Copy className="h-4 w-4" />}
                            </button>
                          </div>
                        </div>

                        <div className="space-y-1">
                          <label className="text-xs text-muted-foreground uppercase tracking-widest font-mono">Product Hunt Description</label>
                          <div className="p-3 bg-black/20 border border-border/40 rounded-xl flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">{launchKit.productHunt.description}</span>
                            <button onClick={() => handleCopy(launchKit.productHunt.description, "ph_desc")} className="text-muted-foreground hover:text-primary transition shrink-0 ml-4">
                              {copiedText === "ph_desc" ? <Check className="h-4 w-4 text-green-400" /> : <Copy className="h-4 w-4" />}
                            </button>
                          </div>
                        </div>

                        <div className="space-y-1">
                          <label className="text-xs text-muted-foreground uppercase tracking-widest font-mono">Maker's First Comment</label>
                          <div className="p-4 bg-black/20 border border-border/40 rounded-xl relative">
                            <button onClick={() => handleCopy(launchKit.productHunt.firstComment, "ph_comment")} className="absolute top-3 right-3 text-muted-foreground hover:text-primary transition">
                              {copiedText === "ph_comment" ? <Check className="h-4 w-4 text-green-400" /> : <Copy className="h-4 w-4" />}
                            </button>
                            <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap pr-6">{launchKit.productHunt.firstComment}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {kitTab === "social" && (
                    <div className="space-y-5">
                      <h3 className="text-lg font-bold border-b border-border/60 pb-3 flex items-center gap-2">
                        <Twitter className="h-5 w-5 text-accent" /> 7-Day Social Posting Calendar
                      </h3>
                      <div className="space-y-4 max-h-[450px] overflow-y-auto pr-2" data-lenis-prevent>
                        {launchKit.social.map((item: any, idx: number) => (
                          <div key={idx} className="p-4 bg-black/20 border border-border/40 rounded-xl space-y-2 relative">
                            <button onClick={() => handleCopy(item.post + " " + item.hashtags.join(" "), `soc_${idx}`)} className="absolute top-4 right-4 text-muted-foreground hover:text-primary transition">
                              {copiedText === `soc_${idx}` ? <Check className="h-4 w-4 text-green-400" /> : <Copy className="h-4 w-4" />}
                            </button>
                            <div className="text-xs font-bold text-primary font-mono">{item.day}</div>
                            <p className="text-sm text-white/90 leading-relaxed pr-6">{item.post}</p>
                            <div className="flex gap-2.5">
                              {item.hashtags.map((h: string) => (
                                <span key={h} className="text-xs text-accent">{h}</span>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {kitTab === "press" && (
                    <div className="space-y-5">
                      <h3 className="text-lg font-bold border-b border-border/60 pb-3 flex items-center gap-2">
                        <Send className="h-5 w-5 text-accent" /> Blogger Pitch & Blurbs
                      </h3>
                      <div className="space-y-4">
                        <div className="space-y-1">
                          <label className="text-xs text-muted-foreground uppercase tracking-widest font-mono">Blogger Email Subject</label>
                          <div className="p-3 bg-black/20 border border-border/40 rounded-xl flex items-center justify-between">
                            <span className="font-semibold text-sm">{launchKit.press.coldEmail.subject}</span>
                            <button onClick={() => handleCopy(launchKit.press.coldEmail.subject, "email_sub")} className="text-muted-foreground hover:text-primary transition">
                              {copiedText === "email_sub" ? <Check className="h-4 w-4 text-green-400" /> : <Copy className="h-4 w-4" />}
                            </button>
                          </div>
                        </div>

                        <div className="space-y-1">
                          <label className="text-xs text-muted-foreground uppercase tracking-widest font-mono">Blogger Pitch Body</label>
                          <div className="p-4 bg-black/20 border border-border/40 rounded-xl relative">
                            <button onClick={() => handleCopy(launchKit.press.coldEmail.body, "email_body")} className="absolute top-3 right-3 text-muted-foreground hover:text-primary transition">
                              {copiedText === "email_body" ? <Check className="h-4 w-4 text-green-400" /> : <Copy className="h-4 w-4" />}
                            </button>
                            <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap pr-6">{launchKit.press.coldEmail.body}</p>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <label className="text-xs text-muted-foreground uppercase tracking-widest font-mono">50-Word Blurb</label>
                            <div className="p-3 bg-black/20 border border-border/40 rounded-xl relative min-h-[100px]">
                              <button onClick={() => handleCopy(launchKit.press.blurb50, "blurb_50")} className="absolute top-3 right-3 text-muted-foreground hover:text-primary transition">
                                {copiedText === "blurb_50" ? <Check className="h-4 w-4 text-green-400" /> : <Copy className="h-4 w-4" />}
                              </button>
                              <p className="text-xs text-muted-foreground leading-relaxed pr-6">{launchKit.press.blurb50}</p>
                            </div>
                          </div>
                          <div className="space-y-1">
                            <label className="text-xs text-muted-foreground uppercase tracking-widest font-mono">100-Word Blurb</label>
                            <div className="p-3 bg-black/20 border border-border/40 rounded-xl relative min-h-[100px]">
                              <button onClick={() => handleCopy(launchKit.press.blurb100, "blurb_100")} className="absolute top-3 right-3 text-muted-foreground hover:text-primary transition">
                                {copiedText === "blurb_100" ? <Check className="h-4 w-4 text-green-400" /> : <Copy className="h-4 w-4" />}
                              </button>
                              <p className="text-xs text-muted-foreground leading-relaxed pr-6">{launchKit.press.blurb100}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
