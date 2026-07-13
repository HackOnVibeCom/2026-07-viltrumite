import { createFileRoute } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Package, Sparkles, Plus, Zap, X, Trash2, Edit3, ShieldAlert, 
  BadgeCheck, DollarSign, TrendingUp, Users, Percent, HelpCircle, 
  ArrowRight, Share2, Calendar, Layout, BarChart3, Send, CheckCircle,
  Clock, Shield, Award, AlertCircle, MessageSquare
} from "lucide-react";
import { useState, useEffect } from "react";
import { useBundles } from "@/hooks/useMockDb";
import { toast } from "sonner";

export const Route = createFileRoute("/founder/bundles")({ component: BundlesPage });

interface AppItem {
  name: string;
  icon: string;
  founder: string;
}

interface TimelineTask {
  id: string;
  task: string;
  owner: string;
  completed: boolean;
  phase: "pre" | "day" | "post";
}

interface CampaignBundle {
  id: string;
  name: string;
  status: "draft" | "proposal_sent" | "accepted" | "launch_scheduled" | "live" | "completed";
  score: number;
  apps: AppItem[];
  discount: string;
  purchases: number;
  ctr: string;
  conversionRate: string;
  audienceOverlap: string;
  trustScore: string;
  compatibility: string;
  bestLaunchDay: string;
  bestCommunities: string[];
  rationale: string;
  roi: {
    installs: number;
    revenue: number;
    savings: number;
  };
  revSplit: number;
  timeline: TimelineTask[];
  budget: {
    free: number;
    paid: number;
  };
  analytics: {
    impressions: number[];
    clicks: number[];
    conversions: number[];
  };
}

const INITIAL_CAMPAIGNS: CampaignBundle[] = [
  {
    id: "camp_1",
    name: "FocusGrid Ultimate Starter Pack",
    status: "live",
    score: 94,
    apps: [
      { name: "FocusGrid", icon: "⚡", founder: "You" },
      { name: "VibeCheck", icon: "💬", founder: "Alex" }
    ],
    discount: "35%",
    purchases: 256,
    ctr: "4.8%",
    conversionRate: "22.2%",
    audienceOverlap: "92%",
    compatibility: "96%",
    trustScore: "A+",
    bestLaunchDay: "Friday",
    bestCommunities: ["Product Hunt", "Indie Hackers", "r/productivity"],
    rationale: "Both apps target Gen-Z creators. FocusGrid handles time blocking, while VibeCheck captures mood swings. Bundling them creates a comprehensive workspace starter kit. Audience overlap is exceptionally high in study groups.",
    roi: {
      installs: 1450,
      revenue: 5800,
      savings: 1500
    },
    revSplit: 50,
    timeline: [
      { id: "t1", task: "Configure Google Analytics shared parameters", owner: "You", completed: true, phase: "pre" },
      { id: "t2", task: "Design Product Hunt co-marketing banners", owner: "Alex", completed: true, phase: "pre" },
      { id: "t3", task: "Publish PH launch announcement thread", owner: "You", completed: true, phase: "day" },
      { id: "t4", task: "Run live launch AMA in discord servers", owner: "Alex", completed: true, phase: "day" },
      { id: "t5", task: "Publish co-attributed founder story on Indie Hackers", owner: "You", completed: false, phase: "post" },
      { id: "t6", task: "Execute retargeting pixel campaigns", owner: "Alex", completed: false, phase: "post" }
    ],
    budget: {
      free: 100,
      paid: 250
    },
    analytics: {
      impressions: [2400, 3200, 4800, 6200, 7100, 8900, 10200],
      clicks: [120, 210, 310, 420, 510, 640, 780],
      conversions: [24, 45, 68, 89, 110, 140, 256]
    }
  },
  {
    id: "camp_2",
    name: "PixelForge & BeatWeave Gamedev Kit",
    status: "accepted",
    score: 87,
    apps: [
      { name: "PixelForge", icon: "🎮", founder: "You" },
      { name: "BeatWeave", icon: "🎵", founder: "Sarah" }
    ],
    discount: "20%",
    purchases: 128,
    ctr: "3.5%",
    conversionRate: "18.5%",
    audienceOverlap: "76%",
    compatibility: "89%",
    trustScore: "A",
    bestLaunchDay: "Wednesday",
    bestCommunities: ["r/gamedev", "Product Hunt", "Itch.io"],
    rationale: "Game developers require assets. PixelForge constructs custom 2D tilesets, while BeatWeave synthesizes game audio. Combining these saves gamedevs time and money during game jams.",
    roi: {
      installs: 850,
      revenue: 3200,
      savings: 900
    },
    revSplit: 60,
    timeline: [
      { id: "t21", task: "Draft bundle licensing framework", owner: "Sarah", completed: true, phase: "pre" },
      { id: "t22", task: "Build promo landing page graphics", owner: "You", completed: true, phase: "pre" },
      { id: "t23", task: "Schedule PH launch timestamp", owner: "You", completed: false, phase: "pre" },
      { id: "t24", task: "Co-authored newsletter dispatch", owner: "Sarah", completed: false, phase: "day" }
    ],
    budget: {
      free: 200,
      paid: 400
    },
    analytics: {
      impressions: [1200, 1800, 2400, 3100, 3800, 4200, 4800],
      clicks: [80, 110, 140, 190, 220, 240, 280],
      conversions: [15, 24, 38, 51, 72, 98, 128]
    }
  },
  {
    id: "camp_3",
    name: "TaskFlow Travel Nomad Pack",
    status: "proposal_sent",
    score: 79,
    apps: [
      { name: "TaskFlow", icon: "⏳", founder: "You" },
      { name: "RoamWise", icon: "✈️", founder: "Michael" }
    ],
    discount: "25%",
    purchases: 40,
    ctr: "2.9%",
    conversionRate: "14.2%",
    audienceOverlap: "69%",
    compatibility: "81%",
    trustScore: "B+",
    bestLaunchDay: "Thursday",
    bestCommunities: ["Nomad List", "Product Hunt", "r/digitalnomad"],
    rationale: "Digital nomads need productivity systems combined with travel itineraries. TaskFlow manages standard checklists, while RoamWise syncs locations and itineraries.",
    roi: {
      installs: 410,
      revenue: 1800,
      savings: 600
    },
    revSplit: 50,
    timeline: [
      { id: "t31", task: "Develop co-branded travel templates", owner: "You", completed: true, phase: "pre" },
      { id: "t32", task: "Evaluate target group compatibility metrics", owner: "Michael", completed: true, phase: "pre" },
      { id: "t33", task: "Approve proposal details", owner: "Michael", completed: false, phase: "pre" }
    ],
    budget: {
      free: 150,
      paid: 100
    },
    analytics: {
      impressions: [500, 800, 1200, 1500, 1800, 2100, 2400],
      clicks: [30, 45, 62, 78, 92, 105, 120],
      conversions: [4, 10, 18, 25, 31, 35, 40]
    }
  }
];

function BundlesPage() {
  const [campaigns, setCampaigns] = useState<CampaignBundle[]>(INITIAL_CAMPAIGNS);
  const [selectedId, setSelectedId] = useState<string>("camp_1");
  const [activeTab, setActiveTab] = useState<"analysis" | "roi" | "proposal" | "preview" | "analytics">("analysis");
  
  const [creating, setCreating] = useState(false);
  const [newTheme, setNewTheme] = useState("");
  const [newAudience, setNewAudience] = useState("");
  const [partnerApp, setPartnerApp] = useState("VibeCheck");

  // Selected Campaign reference
  const campaign = campaigns.find(c => c.id === selectedId) || campaigns[0];

  // Dynamic ROI inputs state matching currently selected campaign
  const [trafficVal, setTrafficVal] = useState(5000);
  const [priceVal, setPriceVal] = useState(29);
  const [discVal, setDiscVal] = useState(25);
  const [splitVal, setSplitVal] = useState(50);

  // Synchronize dynamic inputs on campaign selection change
  useEffect(() => {
    if (campaign) {
      setTrafficVal(campaign.purchases ? Math.round(campaign.purchases / (parseFloat(campaign.conversionRate) / 100)) : 5000);
      setPriceVal(29); // default base price
      setDiscVal(parseInt(campaign.discount.replace("%", "")) || 20);
      setSplitVal(campaign.revSplit || 50);
    }
  }, [selectedId]);

  // AI-generated proposal states
  const [proposalChannel, setProposalChannel] = useState<"slack" | "discord" | "telegram">("slack");
  const [proposalDraft, setProposalDraft] = useState("");

  useEffect(() => {
    if (campaign) {
      const partner = campaign.apps.find(a => a.founder !== "You")?.founder || "Partner";
      setProposalDraft(`Hey ${partner}! 👋 I just evaluated our apps on LaunchMesh. Our compatibility score is ${campaign.compatibility} with ${campaign.audienceOverlap} audience overlap! 🚀 I'd love to bundle our products "${campaign.apps[0].name}" and "${campaign.apps[1].name}" under a ${campaign.discount} discount package. LaunchMesh predicts this could pull around +${campaign.roi.installs} extra installs and $${campaign.roi.revenue} revenue split between us. What do you think?`);
    }
  }, [selectedId]);

  // Calculations
  const calculatedInstalls = Math.round(trafficVal * (parseFloat(campaign.conversionRate) / 100) * 1.35); // 35% bundle multiplier
  const calculatedRevenue = Math.round(calculatedInstalls * priceVal * (1 - discVal / 100));
  const calculatedSavings = Math.round(trafficVal * 0.12 * 2.5); // free co-marketing value
  
  const yourShare = Math.round(calculatedRevenue * (splitVal / 100));
  const partnerShare = calculatedRevenue - yourShare;

  const handleSendProposal = () => {
    toast.success(`Proposal sent through ${proposalChannel.toUpperCase()}!`, {
      description: `Notified partner ${campaign.apps.find(a => a.founder !== "You")?.founder || "founder"} successfully.`
    });
    // Update local state status
    setCampaigns(prev => prev.map(c => {
      if (c.id === campaign.id) {
        return { ...c, status: "proposal_sent" };
      }
      return c;
    }));
  };

  // Mock Accept / Reject workflows
  const handlePartnerResponse = (response: "accept" | "reject" | "negotiate") => {
    if (response === "accept") {
      setCampaigns(prev => prev.map(c => {
        if (c.id === campaign.id) {
          return { ...c, status: "accepted" };
        }
        return c;
      }));
      toast.success("Partner accepted the proposal!", {
        description: "Status updated to Accepted. You can now schedule the launch date."
      });
    } else if (response === "negotiate") {
      toast.info("Negotiation flags sent", {
        description: "Sent rev-split and pricing comments to partner."
      });
    } else {
      setCampaigns(prev => prev.map(c => {
        if (c.id === campaign.id) {
          return { ...c, status: "draft" };
        }
        return c;
      }));
      toast.error("Proposal rejected", {
        description: "Bundle returned to Draft mode."
      });
    }
  };

  // Timeline completion toggle
  const toggleTask = (taskId: string) => {
    setCampaigns(prev => prev.map(c => {
      if (c.id === campaign.id) {
        return {
          ...c,
          timeline: c.timeline.map(t => t.id === taskId ? { ...t, completed: !t.completed } : t)
        };
      }
      return c;
    }));
  };

  const handleGenerateAI = () => {
    if (!newTheme.trim()) {
      toast.error("Please enter a campaign theme");
      return;
    }
    const newId = `camp_${Date.now()}`;
    const newBundle: CampaignBundle = {
      id: newId,
      name: newTheme.trim() + " Campaign",
      status: "draft",
      score: Math.floor(Math.random() * 20) + 75,
      apps: [
        { name: "FocusGrid", icon: "⚡", founder: "You" },
        { name: partnerApp, icon: partnerApp === "RoamWise" ? "✈️" : partnerApp === "BeatWeave" ? "🎵" : "💬", founder: partnerApp === "RoamWise" ? "Michael" : partnerApp === "BeatWeave" ? "Sarah" : "Alex" }
      ],
      discount: "25%",
      purchases: 0,
      ctr: "3.1%",
      conversionRate: "16.4%",
      audienceOverlap: "78%",
      compatibility: "85%",
      trustScore: "A",
      bestLaunchDay: "Friday",
      bestCommunities: ["Product Hunt", "Indie Hackers", "BetaList"],
      rationale: `AI Analysis predicts that targeting ${newAudience || "developers and creators"} by bundling FocusGrid with ${partnerApp} unlocks cross-selling leverage. Both customer profiles seek tools to structure visual tasks.`,
      roi: {
        installs: 620,
        revenue: 2400,
        savings: 800
      },
      revSplit: 50,
      timeline: [
        { id: "nt1", task: "Integrate shared tracking hooks", owner: "You", completed: false, phase: "pre" },
        { id: "nt2", task: "Configure pricing hooks", owner: partnerApp === "RoamWise" ? "Michael" : partnerApp === "BeatWeave" ? "Sarah" : "Alex", completed: false, phase: "pre" }
      ],
      budget: {
        free: 100,
        paid: 150
      },
      analytics: {
        impressions: [0, 0, 0, 0, 0, 0, 0],
        clicks: [0, 0, 0, 0, 0, 0, 0],
        conversions: [0, 0, 0, 0, 0, 0, 0]
      }
    };

    setCampaigns(prev => [newBundle, ...prev]);
    setSelectedId(newId);
    setCreating(false);
    setNewTheme("");
    setNewAudience("");
    toast.success("AI Growth Campaign Drafted!", {
      description: `"${newTheme}" added to your workspace builder.`
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "live": return "bg-emerald-500/20 text-emerald-400 border-emerald-500/30";
      case "accepted": return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      case "proposal_sent": return "bg-amber-500/20 text-amber-400 border-amber-500/30";
      case "launch_scheduled": return "bg-purple-500/20 text-purple-400 border-purple-500/30";
      case "completed": return "bg-slate-500/20 text-slate-400 border-slate-500/30";
      default: return "bg-zinc-500/20 text-zinc-400 border-zinc-500/30";
    }
  };

  // Preview tab sub-state
  const [previewSubTab, setPreviewSubTab] = useState<"inapp" | "ph">("inapp");

  return (
    <div className="pt-20 md:pt-24 px-6 md:px-8 pb-12 max-w-7xl mx-auto space-y-8 min-h-screen text-foreground">
      
      {/* Page Header */}
      <div className="flex items-center justify-between flex-wrap gap-4 border-b border-border/40 pb-6">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-2xl bg-primary/20 grid place-items-center">
            <Package className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">AI Growth Campaign Builder</h1>
            <p className="text-sm text-muted-foreground">Collaborate with complementary founders to launch high-converting cross-promos</p>
          </div>
        </div>
        
        <motion.button 
          whileHover={{ scale: 1.03 }} 
          whileTap={{ scale: 0.97 }}
          onClick={() => setCreating(true)}
          className="flex items-center gap-2 px-5 py-3 rounded-2xl text-sm font-bold text-white cursor-pointer shadow-lg animate-pulse-glow"
          style={{ background: "linear-gradient(135deg, #6C5CE7, #00D4B8)" }}
        >
          <Sparkles className="h-4 w-4" /> Build AI Campaign
        </motion.button>
      </div>

      {/* Overview Stats Bar */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Active Campaigns", value: campaigns.filter(c => c.status === "live").length, desc: "live bundles running", icon: Layout },
          { label: "Total Purchases", value: campaigns.reduce((sum, c) => sum + c.purchases, 0), desc: "conversions recorded", icon: Users },
          { label: "Rev Split Uplift", value: `$${campaigns.reduce((sum, c) => sum + c.roi.revenue, 0).toLocaleString()}`, desc: "predicted extra value", icon: DollarSign },
          { label: "Average Success Score", value: `${Math.round(campaigns.reduce((sum, c) => sum + c.score, 0) / campaigns.length)}%`, desc: "AI campaign compatibility", icon: Percent }
        ].map((stat, i) => (
          <div key={i} className="glass-strong p-5 rounded-3xl border border-border/40 flex items-center justify-between">
            <div>
              <span className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">{stat.label}</span>
              <p className="text-2xl font-black mt-1 gradient-brand">{stat.value}</p>
              <span className="text-[10px] text-muted-foreground/80 mt-0.5 block">{stat.desc}</span>
            </div>
            <div className="h-10 w-10 rounded-xl bg-white/5 border border-white/10 grid place-items-center shrink-0">
              <stat.icon className="h-5 w-5 text-accent" />
            </div>
          </div>
        ))}
      </div>

      {/* Main Split Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Side: Campaign list */}
        <div className="lg:col-span-4 space-y-4">
          <div className="flex items-center justify-between mb-1">
            <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Growth Campaigns</h3>
            <span className="text-xs bg-white/5 border border-white/10 rounded-full px-2 py-0.5 text-muted-foreground font-semibold">
              {campaigns.length} total
            </span>
          </div>

          <div className="space-y-3.5">
            {campaigns.map((c) => {
              const active = c.id === selectedId;
              const partner = c.apps.find(a => a.founder !== "You");

              return (
                <motion.div
                  key={c.id}
                  onClick={() => setSelectedId(c.id)}
                  whileHover={{ scale: 1.02 }}
                  className={`p-5 rounded-3xl border transition-all cursor-pointer relative overflow-hidden ${
                    active 
                      ? "glass-strong border-primary bg-primary/10 shadow-lg" 
                      : "glass border-border/40 hover:border-white/20"
                  }`}
                >
                  <div className="relative z-10 flex justify-between items-start">
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5">
                        <span className={`text-[10px] px-2 py-0.5 rounded-full border uppercase tracking-wider font-bold ${getStatusColor(c.status)}`}>
                          {c.status.replace("_", " ")}
                        </span>
                      </div>
                      <h4 className="font-bold text-base line-clamp-1 pr-4">{c.name}</h4>
                      <p className="text-xs text-muted-foreground">Partner: {partner?.name} ({partner?.founder})</p>
                    </div>

                    <div className="text-right flex flex-col items-end shrink-0">
                      <div className="h-8 w-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center font-bold text-xs text-accent">
                        {c.score}
                      </div>
                      <span className="text-[9px] text-muted-foreground/80 mt-1 uppercase tracking-wider font-semibold">Score</span>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex gap-2">
                      <span>CTR: <strong className="text-foreground">{c.ctr}</strong></span>
                      <span>Conv: <strong className="text-foreground">{c.conversionRate}</strong></span>
                    </div>
                    <div className="flex gap-1">
                      {c.apps.map(a => (
                        <span key={a.name} title={a.name}>{a.icon}</span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Right Side: Selected Campaign Management Workspace */}
        <div className="lg:col-span-8 glass-strong rounded-3xl border border-border/40 p-6 lg:p-8 space-y-6">
          
          {/* Header */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border/40 pb-5">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className={`text-xs px-2.5 py-0.5 rounded-full border uppercase tracking-wider font-bold ${getStatusColor(campaign.status)}`}>
                  {campaign.status.replace("_", " ")}
                </span>
                <span className="text-xs text-muted-foreground">Campaign Dashboard</span>
              </div>
              <h2 className="text-2xl font-black text-foreground">{campaign.name}</h2>
            </div>

            <div className="flex items-center gap-2">
              {campaign.apps.map((a, idx) => (
                <div key={idx} className="flex items-center gap-1 bg-white/5 border border-white/10 px-3 py-1.5 rounded-xl text-xs">
                  <span>{a.icon}</span>
                  <span className="font-bold">{a.name}</span>
                  <span className="text-[10px] text-muted-foreground">({a.founder})</span>
                </div>
              ))}
            </div>
          </div>

          {/* Tab Selection */}
          <div className="flex border-b border-border/30 overflow-x-auto gap-2.5 pb-2">
            {[
              { id: "analysis", label: "AI Insights", icon: Sparkles },
              { id: "roi", label: "ROI & Splits", icon: DollarSign },
              { id: "proposal", label: "Proposals & Tasks", icon: ClipboardList },
              { id: "preview", label: "Previews", icon: Layout },
              { id: "analytics", label: "Analytics & Budget", icon: BarChart3 }
            ].map(t => (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id as any)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                  activeTab === t.id 
                    ? "bg-primary/20 text-primary border border-primary/30 shadow-glow-primary" 
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <t.icon className="h-3.5 w-3.5" />
                {t.label}
              </button>
            ))}
          </div>

          {/* Dynamic Tab Body */}
          <div className="pt-2 min-h-[300px]">

            {/* TAB 1: AI Insights */}
            {activeTab === "analysis" && (
              <div className="space-y-6">
                
                {/* Dials & Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  {/* radial dial score */}
                  <div className="p-5 rounded-2xl bg-black/20 border border-border/40 flex flex-col items-center justify-center text-center">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-3">AI success score</span>
                    <div className="relative h-24 w-24 flex items-center justify-center mb-2">
                      <svg className="absolute inset-0 transform -rotate-90" viewBox="0 0 36 36">
                        <path className="text-white/5" stroke="currentColor" strokeWidth="3" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                        <path className="text-primary" stroke="currentColor" strokeDasharray={`${campaign.score}, 100`} strokeWidth="3" strokeLinecap="round" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                      </svg>
                      <p className="text-2xl font-black">{campaign.score}%</p>
                    </div>
                    <span className="text-[10px] text-emerald-400 font-bold bg-emerald-400/10 px-2 py-0.5 rounded-full border border-emerald-400/25">High Match</span>
                  </div>

                  {/* detailed stats indicators */}
                  <div className="p-5 rounded-2xl bg-black/20 border border-border/40 space-y-3.5 col-span-2">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block">AI Diagnostics</span>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center gap-2">
                        <Shield className="h-4 w-4 text-primary" />
                        <div>
                          <p className="text-[10px] text-muted-foreground uppercase">Trust Score</p>
                          <p className="text-sm font-bold">{campaign.trustScore}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-accent" />
                        <div>
                          <p className="text-[10px] text-muted-foreground uppercase">Audience Overlap</p>
                          <p className="text-sm font-bold">{campaign.audienceOverlap}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Award className="h-4 w-4 text-emerald-400" />
                        <div>
                          <p className="text-[10px] text-muted-foreground uppercase">Compatibility</p>
                          <p className="text-sm font-bold">{campaign.compatibility}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-purple-400" />
                        <div>
                          <p className="text-[10px] text-muted-foreground uppercase">Launch Day</p>
                          <p className="text-sm font-bold">{campaign.bestLaunchDay}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* AI Rationale */}
                <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-3 relative overflow-hidden">
                  <div className="absolute top-4 right-4 text-primary"><Sparkles className="h-4 w-4" /></div>
                  <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">AI Integration Rationale</h4>
                  <p className="text-sm text-slate-200 leading-relaxed font-medium">
                    {campaign.rationale}
                  </p>
                </div>

                {/* launch channels */}
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Recommended Launch Channels</h4>
                  <div className="flex flex-wrap gap-2">
                    {campaign.bestCommunities.map(c => (
                      <span key={c} className="text-xs bg-white/5 border border-white/10 rounded-xl px-3 py-1.5 flex items-center gap-1.5">
                        <CheckCircle className="h-3.5 w-3.5 text-accent" /> {c}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: ROI Calculator & Rev Split */}
            {activeTab === "roi" && (
              <div className="space-y-6">
                
                {/* Sliders grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* inputs */}
                  <div className="glass p-5 rounded-2xl border border-border/40 space-y-5">
                    <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider block">ROI Calculator Inputs</span>
                    
                    {/* Traffic */}
                    <div>
                      <div className="flex justify-between text-xs font-semibold mb-1">
                        <span>Expected Campaign Views</span>
                        <span className="text-primary">{trafficVal.toLocaleString()}</span>
                      </div>
                      <input 
                        type="range" min="1000" max="25000" step="500" value={trafficVal} onChange={e => setTrafficVal(Number(e.target.value))}
                        className="w-full accent-primary h-1 bg-muted rounded-lg appearance-none cursor-pointer"
                      />
                    </div>

                    {/* Price */}
                    <div>
                      <div className="flex justify-between text-xs font-semibold mb-1">
                        <span>Average Base Product Price</span>
                        <span className="text-primary">${priceVal}</span>
                      </div>
                      <input 
                        type="range" min="9" max="99" step="5" value={priceVal} onChange={e => setPriceVal(Number(e.target.value))}
                        className="w-full accent-primary h-1 bg-muted rounded-lg appearance-none cursor-pointer"
                      />
                    </div>

                    {/* Discount */}
                    <div>
                      <div className="flex justify-between text-xs font-semibold mb-1">
                        <span>Proposed Bundle Discount</span>
                        <span className="text-primary">{discVal}%</span>
                      </div>
                      <input 
                        type="range" min="10" max="50" step="5" value={discVal} onChange={e => setDiscVal(Number(e.target.value))}
                        className="w-full accent-primary h-1 bg-muted rounded-lg appearance-none cursor-pointer"
                      />
                    </div>
                  </div>

                  {/* calculated outcomes */}
                  <div className="p-5 rounded-2xl bg-black/20 border border-border/40 space-y-5">
                    <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider block">Calculated ROI Outcomes</span>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between items-center py-2 border-b border-white/5">
                        <span className="text-sm text-slate-300">Estimated Installs</span>
                        <span className="text-base font-bold text-slate-100">+{calculatedInstalls}</span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-white/5">
                        <span className="text-sm text-slate-300">Revenue Uplift</span>
                        <span className="text-base font-bold text-emerald-400">+${calculatedRevenue.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center py-2">
                        <span className="text-sm text-slate-300">Promo Cost Savings</span>
                        <span className="text-base font-bold text-accent">+${calculatedSavings.toLocaleString()}</span>
                      </div>
                    </div>

                    <div className="p-3 bg-white/5 rounded-xl text-[10px] text-muted-foreground flex gap-1.5 items-start">
                      <AlertCircle className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" />
                      <span>LaunchMesh ROI calculations are backed by actual conversion weights computed for digital nomad products.</span>
                    </div>
                  </div>
                </div>

                {/* Rev Split Simulator */}
                <div className="p-5 rounded-2xl bg-black/20 border border-border/40 space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider block">Revenue Split Simulator</span>
                    <span className="text-sm font-bold text-accent">{splitVal} / {100 - splitVal} Split</span>
                  </div>

                  <input 
                    type="range" min="30" max="70" step="5" value={splitVal} onChange={e => setSplitVal(Number(e.target.value))}
                    className="w-full accent-accent h-1.5 bg-muted rounded-lg appearance-none cursor-pointer"
                  />

                  <div className="flex items-center gap-2 h-6 rounded-full overflow-hidden mt-3 text-[10px] font-bold">
                    <div className="bg-primary h-full flex items-center justify-center text-white transition-all" style={{ width: `${splitVal}%` }}>
                      Your share (${yourShare.toLocaleString()})
                    </div>
                    <div className="bg-accent h-full flex items-center justify-center text-white transition-all" style={{ width: `${100 - splitVal}%` }}>
                      Partner share (${partnerShare.toLocaleString()})
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: Proposals & Timelines */}
            {activeTab === "proposal" && (
              <div className="space-y-6">
                
                {/* proposal generator */}
                <div className="glass p-5 rounded-2xl border border-border/40 space-y-4">
                  <div className="flex justify-between items-center flex-wrap gap-2">
                    <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">AI proposal drafting</h4>
                    <div className="flex gap-1">
                      {["slack", "discord", "telegram"].map(c => (
                        <button
                          key={c} onClick={() => setProposalChannel(c as any)}
                          className={`px-2.5 py-1 rounded-lg text-[10px] font-semibold cursor-pointer ${proposalChannel === c ? 'bg-primary text-white shadow-glow-primary' : 'bg-white/5 border border-white/10 text-muted-foreground'}`}
                        >
                          {c.toUpperCase()}
                        </button>
                      ))}
                    </div>
                  </div>

                  <textarea
                    value={proposalDraft}
                    onChange={e => setProposalDraft(e.target.value)}
                    rows={4}
                    className="w-full bg-black/30 border border-border/60 rounded-xl px-4 py-3 text-sm outline-none focus:border-primary/40 text-slate-200 leading-relaxed"
                  />

                  <div className="flex justify-end gap-2 flex-wrap">
                    {campaign.status === "proposal_sent" && (
                      <div className="flex items-center gap-2 border border-border/40 rounded-xl px-3 bg-black/15 text-xs">
                        <span className="text-[10px] font-semibold text-muted-foreground">SIMULATE PARTNER VIEW:</span>
                        <button onClick={() => handlePartnerResponse("accept")} className="text-[10px] text-emerald-400 font-bold hover:underline cursor-pointer">Accept</button>
                        <span className="text-muted-foreground">|</span>
                        <button onClick={() => handlePartnerResponse("negotiate")} className="text-[10px] text-amber-400 font-bold hover:underline cursor-pointer">Negotiate</button>
                        <span className="text-muted-foreground">|</span>
                        <button onClick={() => handlePartnerResponse("reject")} className="text-[10px] text-rose-400 font-bold hover:underline cursor-pointer">Reject</button>
                      </div>
                    )}
                    <button
                      onClick={handleSendProposal}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white cursor-pointer"
                      style={{ background: "linear-gradient(135deg, #6C5CE7, #00D4B8)" }}
                    >
                      <Send className="h-3.5 w-3.5" /> Send Proposal
                    </button>
                  </div>
                </div>

                {/* shared launch timeline */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Shared Launch Timeline & Checklist</h4>
                  
                  <div className="space-y-2">
                    {campaign.timeline.map((t) => (
                      <div
                        key={t.id}
                        onClick={() => toggleTask(t.id)}
                        className="flex items-center justify-between p-3.5 rounded-xl bg-black/20 border border-border/40 hover:border-white/10 transition-colors cursor-pointer"
                      >
                        <div className="flex items-center gap-3">
                          <input 
                            type="checkbox" 
                            checked={t.completed} 
                            readOnly 
                            className="h-4 w-4 accent-primary rounded cursor-pointer" 
                          />
                          <span className={`text-sm ${t.completed ? 'line-through text-muted-foreground' : 'text-slate-200'}`}>
                            {t.task}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <span className="text-[9px] uppercase tracking-wider bg-white/5 border border-white/10 px-2 py-0.5 rounded-lg text-slate-300">
                            {t.phase === "pre" ? "Pre-launch" : t.phase === "day" ? "Launch Day" : "Post-launch"}
                          </span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-lg ${t.owner === "You" ? "bg-primary/20 text-primary border border-primary/30 animate-pulse-glow" : "bg-accent/20 text-accent border border-accent/30"}`}>
                            {t.owner}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 4: Bundle Previews */}
            {activeTab === "preview" && (
              <div className="space-y-4">
                
                {/* preview selector */}
                <div className="flex gap-2 border-b border-border/30 pb-2">
                  <button
                    onClick={() => setPreviewSubTab("inapp")}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer transition-all ${previewSubTab === "inapp" ? 'bg-white/10 text-slate-100 border border-white/10 shadow-glow-primary' : 'text-muted-foreground hover:text-foreground'}`}
                  >
                    In-App Explorer Layout
                  </button>
                  <button
                    onClick={() => setPreviewSubTab("ph")}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer transition-all ${previewSubTab === "ph" ? 'bg-white/10 text-slate-100 border border-white/10 shadow-glow-primary' : 'text-muted-foreground hover:text-foreground'}`}
                  >
                    Product Hunt Launch Card
                  </button>
                </div>

                {/* Visual Renders */}
                {previewSubTab === "inapp" ? (
                  <div className="p-6 rounded-2xl bg-slate-950/60 border border-border/60 space-y-4 max-w-md mx-auto">
                    <span className="text-[10px] font-black text-primary uppercase tracking-widest">Explore Bundles</span>
                    <div className="border border-white/10 p-5 rounded-2xl space-y-3 relative overflow-hidden bg-slate-900/60">
                      <div className="absolute top-3 right-3 text-xs bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-2 py-0.5 rounded-full font-bold">
                        SAVE {campaign.discount}
                      </div>
                      <h4 className="text-lg font-bold text-white">{campaign.name}</h4>
                      <p className="text-xs text-muted-foreground">Unlock access to both productivity suites for one discounted price.</p>
                      
                      <div className="flex gap-2.5 py-1">
                        {campaign.apps.map(a => (
                          <div key={a.name} className="flex items-center gap-1 bg-white/5 border border-white/10 px-2.5 py-1 rounded-lg text-xs">
                            <span>{a.icon}</span> <span className="font-semibold text-slate-200">{a.name}</span>
                          </div>
                        ))}
                      </div>

                      <button className="w-full py-2 bg-gradient-to-r from-primary to-accent rounded-xl text-xs text-white font-bold pointer-events-none mt-2">
                        Buy Bundle Deal
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="p-5 rounded-2xl bg-white border border-zinc-200 text-zinc-900 max-w-lg mx-auto space-y-4 shadow-xl">
                    <div className="flex items-start gap-4">
                      <div className="h-14 w-14 rounded-2xl bg-orange-100 border border-orange-200 grid place-items-center shrink-0">
                        <span className="text-2xl">📦</span>
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[9px] uppercase tracking-wider font-extrabold text-orange-600 bg-orange-50 px-2 py-0.5 rounded border border-orange-200">Featured</span>
                          <span className="text-xs text-zinc-500 font-medium">Productivity</span>
                        </div>
                        <h4 className="text-base font-extrabold text-zinc-900">{campaign.name}</h4>
                        <p className="text-xs text-zinc-600 font-medium">Save {campaign.discount} on the ultimate startup and gamedev utility toolkit.</p>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center border-t border-zinc-100 pt-3">
                      <div className="flex gap-1">
                        {campaign.apps.map(a => (
                          <span key={a.name} className="text-xs bg-zinc-50 border border-zinc-200/60 px-2.5 py-1 rounded-full font-bold text-zinc-700">
                            {a.icon} {a.name}
                          </span>
                        ))}
                      </div>
                      <button className="px-3.5 py-1.5 bg-orange-600 text-white rounded-lg text-xs font-bold flex items-center gap-1 pointer-events-none shadow-sm shadow-orange-600/30">
                        ▲ Upvote <span className="font-extrabold">246</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB 5: Analytics & Budget */}
            {activeTab === "analytics" && (
              <div className="space-y-6">
                
                {/* budget estimators */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="p-5 rounded-2xl bg-black/20 border border-border/40 space-y-4">
                    <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider block">Campaign Budget Estimator</span>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center py-1">
                        <span className="text-xs text-slate-300">Free / Organic (Directory listings, newsletters)</span>
                        <span className="text-sm font-bold text-emerald-400">FREE</span>
                      </div>
                      <div className="flex justify-between items-center py-1">
                        <span className="text-xs text-slate-300">Sponsor Placements (Product Hunt, Reddit Ads)</span>
                        <span className="text-sm font-bold text-slate-100">${campaign.budget.paid} / mo</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-5 rounded-2xl bg-black/20 border border-border/40 space-y-4">
                    <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider block">Predicted conversion funnel</span>
                    <div className="space-y-2 pt-1.5">
                      <div>
                        <div className="flex justify-between text-[10px] text-muted-foreground mb-1">
                          <span>Impressions ({campaign.purchases ? (campaign.purchases * 35).toLocaleString() : "5,000"})</span>
                          <span>100%</span>
                        </div>
                        <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                          <div className="bg-primary h-full w-full" />
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-[10px] text-muted-foreground mb-1">
                          <span>Clicks ({campaign.purchases ? (campaign.purchases * 3.5).toLocaleString(undefined, { maximumFractionDigits: 0 }) : "150"})</span>
                          <span>{campaign.ctr}</span>
                        </div>
                        <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                          <div className="bg-accent h-full" style={{ width: `${parseFloat(campaign.ctr) * 15}%` }} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* mock charts */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Impressions History (Last 7 Days)</h4>
                  <div className="h-40 flex items-end gap-3.5 pt-6 pb-2 px-4 rounded-2xl bg-black/20 border border-border/40">
                    {campaign.analytics.impressions.map((imp, idx) => {
                      const maxImp = Math.max(...campaign.analytics.impressions) || 1;
                      const heightPct = imp ? (imp / maxImp) * 100 : 5;
                      return (
                        <div key={idx} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                          <span className="text-[9px] font-bold text-primary">{imp.toLocaleString()}</span>
                          <motion.div
                            initial={{ height: 0 }}
                            animate={{ height: `${heightPct * 0.75}%` }}
                            className="w-full bg-gradient-to-t from-primary to-accent rounded-t"
                          />
                          <span className="text-[9px] text-muted-foreground font-semibold">Day {idx + 1}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* AI Generate Dialog Modal */}
      <AnimatePresence>
        {creating && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-lg glass-strong border border-primary/30 p-8 rounded-3xl space-y-6 relative overflow-hidden"
              style={{ boxShadow: "0 0 60px -15px rgba(108,92,231,0.4)" }}
            >
              <div className="absolute -top-12 -right-12 h-40 w-40 rounded-full blur-3xl opacity-20 bg-primary pointer-events-none" />
              
              <div className="flex items-center justify-between border-b border-border/40 pb-4">
                <div className="flex items-center gap-2.5">
                  <Sparkles className="h-5 w-5 text-primary" />
                  <h3 className="text-xl font-bold text-foreground">AI Campaign Generator</h3>
                </div>
                <button 
                  onClick={() => setCreating(false)}
                  className="h-8 w-8 rounded-xl glass hover:bg-white/10 transition-colors grid place-items-center text-muted-foreground hover:text-foreground cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-xs text-muted-foreground block mb-1.5 font-bold uppercase tracking-wider">Campaign Theme / Title</label>
                  <input 
                    type="text"
                    value={newTheme}
                    onChange={e => setNewTheme(e.target.value)}
                    placeholder="e.g. New Year Productivity Bundle"
                    className="w-full glass border border-border/60 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary/40 transition-colors text-slate-100"
                  />
                </div>

                <div>
                  <label className="text-xs text-muted-foreground block mb-1.5 font-bold uppercase tracking-wider">Select Partner App</label>
                  <select 
                    value={partnerApp}
                    onChange={e => setPartnerApp(e.target.value)}
                    className="w-full glass border border-border/60 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary/40 transition-colors bg-slate-950 text-slate-100"
                  >
                    <option value="VibeCheck">VibeCheck (Alex - Mood tracker)</option>
                    <option value="RoamWise">RoamWise (Michael - Nomad maps)</option>
                    <option value="BeatWeave">BeatWeave (Sarah - Game audio synthesizer)</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs text-muted-foreground block mb-1.5 font-bold uppercase tracking-wider">Target Audience Description</label>
                  <input 
                    type="text"
                    value={newAudience}
                    onChange={e => setNewAudience(e.target.value)}
                    placeholder="e.g. Students studying for exams, creators"
                    className="w-full glass border border-border/60 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary/40 transition-colors text-slate-100"
                  />
                </div>
              </div>

              {/* Modal Actions */}
              <div className="flex items-center justify-end border-t border-border/40 pt-5 gap-3">
                <button
                  onClick={() => setCreating(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold glass border border-border/50 text-muted-foreground hover:text-foreground transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleGenerateAI}
                  className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-bold text-white cursor-pointer animate-pulse-glow"
                  style={{ background: "linear-gradient(135deg, #6C5CE7, #00D4B8)" }}
                >
                  <Zap className="h-4 w-4" /> Generate Bundle with AI
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
