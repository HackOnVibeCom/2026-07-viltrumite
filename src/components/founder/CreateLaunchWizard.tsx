import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAppProfile, type AppProfile } from "@/context/AppProfileContext";
import { useAnalysis } from "@/context/AnalysisContext";
import {
  Sparkles, Check, ChevronRight, ChevronLeft,
  Upload, Globe, Shield, Tag, Laptop, DollarSign,
  Calendar, Clock, User, AlertCircle, Trash2
} from "lucide-react";

type Props = {
  open: boolean;
  onClose: () => void;
  onStartAnalysis: () => void;
};

const CATEGORIES = [
  "AI", "Productivity", "Finance", "Health", "Education",
  "Developer Tools", "Design", "Gaming", "Travel", "Shopping",
  "Security", "Career", "Social", "Music", "Food"
];

const PLATFORMS = ["Web", "iOS", "Android", "macOS", "Windows"];
const PRICING_MODELS = ["Freemium", "Subscription", "One-Time Purchase", "Usage-Based"];
const STATUSES = ["Upcoming", "Beta", "Launching Today", "Live"];
const AGE_GROUPS = ["Teenagers", "Young Adults", "Professionals", "Seniors", "All Ages"];

const EMOJIS = ["🎨", "🤖", "⚡", "🧠", "🛠️", "📝", "🚀", "💳", "📚", "❤️", "🎮", "✈️", "🛍️", "🔒", "💬"];

export function CreateLaunchWizard({ open, onClose, onStartAnalysis }: Props) {
  const { publishProduct } = useAppProfile();
  const [step, setStep] = useState(1);

  // Form State
  const [appName, setAppName] = useState("");
  const [appIcon, setAppIcon] = useState("🚀");
  const [tagline, setTagline] = useState("");
  const [category, setCategory] = useState("AI");
  const [platform, setPlatform] = useState("Web");

  const [longDescription, setLongDescription] = useState("");
  const [problem, setProblem] = useState("");
  const [solution, setSolution] = useState("");
  const [pricing, setPricing] = useState("Freemium");
  const [website, setWebsite] = useState("");

  const [targetAudience, setTargetAudience] = useState("");
  const [ageGroup, setAgeGroup] = useState("All Ages");
  const [country, setCountry] = useState("Global");
  const [interests, setInterests] = useState("");
  const [userPersona, setUserPersona] = useState("");

  const [banner, setBanner] = useState("from-violet-600 to-indigo-700");
  const [twitter, setTwitter] = useState("");
  const [github, setGithub] = useState("");
  const [linkedin, setLinkedin] = useState("");

  const [launchDate, setLaunchDate] = useState("");
  const [launchTime, setLaunchTime] = useState("12:00");
  const [timezone, setTimezone] = useState("UTC");
  const [productStatus, setProductStatus] = useState<AppProfile["productStatus"]>("Upcoming");

  if (!open) return null;

  const nextStep = () => setStep((s) => Math.min(6, s + 1));
  const prevStep = () => setStep((s) => Math.max(1, s - 1));

  const handlePublish = () => {
    const newProduct: AppProfile = {
      appName,
      description: tagline,
      category,
      targetAudience,
      launchDate: launchDate || new Date().toISOString().split("T")[0],
      platform,
      pricing,
      appIcon,
      longDescription,
      problem,
      solution,
      website,
      ageGroup,
      country,
      interests,
      userPersona,
      screenshots: [
        "https://cdn.launchmesh.io/mock/screen1.png",
        "https://cdn.launchmesh.io/mock/screen2.png"
      ],
      banner,
      socialLinks: { twitter, github, linkedin },
      launchTime,
      timezone,
      productStatus
    };

    publishProduct(newProduct);
    onStartAnalysis();
    onClose();
  };

  const stepsInfo = [
    { title: "App Basics", desc: "Define your product name and category" },
    { title: "Core Pitch", desc: "What problem are you solving?" },
    { title: "Audience Profiling", desc: "Describe your ideal customer" },
    { title: "Media & Links", desc: "Select banners, icons, and socials" },
    { title: "Schedule Launch", desc: "Set launch windows and date" },
    { title: "Final Review", desc: "Double check before publishing" }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(10,10,15,0.85)", backdropFilter: "blur(20px)" }}>
      {/* Immersive backdrop glows */}
      <div className="absolute top-1/4 left-1/4 h-80 w-80 rounded-full opacity-20 blur-3xl bg-primary/30 pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 h-80 w-80 rounded-full opacity-15 blur-3xl bg-accent/25 pointer-events-none" />

      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="w-full max-w-3xl glass-strong rounded-3xl border border-primary/20 shadow-elevated overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Wizard Header with Progress Bar */}
        <div className="p-6 border-b border-border/40 bg-surface/40 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-accent uppercase tracking-widest">Step {step} of 6</span>
              <h2 className="text-xl font-bold text-foreground mt-0.5">{stepsInfo[step - 1].title}</h2>
              <p className="text-xs text-muted-foreground">{stepsInfo[step - 1].desc}</p>
            </div>
            <button onClick={onClose} className="h-8 w-8 rounded-lg glass grid place-items-center text-muted-foreground hover:text-foreground cursor-pointer transition-colors">
              ✕
            </button>
          </div>

          {/* Progress bar */}
          <div className="relative">
            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
              <motion.div
                className="h-full rounded-full animated-gradient"
                animate={{ width: `${(step / 6) * 100}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
            <div className="flex justify-between text-[10px] text-muted-foreground mt-2">
              {stepsInfo.map((s, i) => (
                <span key={s.title} className={step > i ? "text-accent font-bold" : step === i + 1 ? "text-primary font-bold" : ""}>
                  {s.title}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Wizard Body (Scrollable form) */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6" data-lenis-prevent>
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ x: 15, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -15, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="space-y-5"
            >
              {/* STEP 1: App Info */}
              {step === 1 && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">App Name</label>
                      <input
                        type="text"
                        placeholder="e.g. StudyPal"
                        className="w-full glass bg-white/5 border border-border/40 focus:border-primary/60 outline-none rounded-xl px-4 py-2.5 text-sm text-foreground"
                        value={appName}
                        onChange={(e) => setAppName(e.target.value)}
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Select Emoji Logo</label>
                      <div className="flex items-center gap-2">
                        <div className="h-10 w-10 glass rounded-xl grid place-items-center text-xl shrink-0">{appIcon}</div>
                        <div className="flex gap-1 overflow-x-auto pb-1 scrollbar-none">
                          {EMOJIS.map((e) => (
                            <button
                              key={e}
                              type="button"
                              onClick={() => setAppIcon(e)}
                              className={`h-8 w-8 rounded-lg text-sm grid place-items-center transition-all cursor-pointer ${appIcon === e ? "bg-primary/20 border border-primary/50" : "glass hover:bg-white/5"}`}
                            >
                              {e}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Tagline</label>
                    <input
                      type="text"
                      placeholder="e.g. AI-powered planner for student growth."
                      className="w-full glass bg-white/5 border border-border/40 focus:border-primary/60 outline-none rounded-xl px-4 py-2.5 text-sm text-foreground"
                      value={tagline}
                      onChange={(e) => setTagline(e.target.value)}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Category</label>
                      <select
                        className="w-full glass bg-white/5 border border-border/40 focus:border-primary/60 outline-none rounded-xl px-4 py-2.5 text-sm text-foreground"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                      >
                        {CATEGORIES.map((c) => (
                          <option key={c} value={c} className="bg-[#12121A] text-foreground">{c}</option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Primary Platform</label>
                      <select
                        className="w-full glass bg-white/5 border border-border/40 focus:border-primary/60 outline-none rounded-xl px-4 py-2.5 text-sm text-foreground"
                        value={platform}
                        onChange={(e) => setPlatform(e.target.value)}
                      >
                        {PLATFORMS.map((p) => (
                          <option key={p} value={p} className="bg-[#12121A] text-foreground">{p}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 2: Pitch Details */}
              {step === 2 && (
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Long Description</label>
                    <textarea
                      placeholder="Give a brief summary of how your app works and who it's for."
                      rows={3}
                      className="w-full glass bg-white/5 border border-border/40 focus:border-primary/60 outline-none rounded-xl px-4 py-2 text-sm text-foreground resize-none"
                      value={longDescription}
                      onChange={(e) => setLongDescription(e.target.value)}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">What problem does it solve?</label>
                      <textarea
                        placeholder="e.g. Students struggle to find study groups and coordinate schedules."
                        rows={2}
                        className="w-full glass bg-white/5 border border-border/40 focus:border-primary/60 outline-none rounded-xl px-4 py-2 text-sm text-foreground resize-none"
                        value={problem}
                        onChange={(e) => setProblem(e.target.value)}
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">What is your unique solution?</label>
                      <textarea
                        placeholder="e.g. AI matchmaking that groups students by study patterns and course syllabus."
                        rows={2}
                        className="w-full glass bg-white/5 border border-border/40 focus:border-primary/60 outline-none rounded-xl px-4 py-2 text-sm text-foreground resize-none"
                        value={solution}
                        onChange={(e) => setSolution(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Pricing Model</label>
                      <select
                        className="w-full glass bg-white/5 border border-border/40 focus:border-primary/60 outline-none rounded-xl px-4 py-2.5 text-sm text-foreground"
                        value={pricing}
                        onChange={(e) => setPricing(e.target.value)}
                      >
                        {PRICING_MODELS.map((p) => (
                          <option key={p} value={p} className="bg-[#12121A] text-foreground">{p}</option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Website URL</label>
                      <input
                        type="url"
                        placeholder="https://studypal.ai"
                        className="w-full glass bg-white/5 border border-border/40 focus:border-primary/60 outline-none rounded-xl px-4 py-2.5 text-sm text-foreground"
                        value={website}
                        onChange={(e) => setWebsite(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 3: Target Audience */}
              {step === 3 && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Target Audience (comma separated)</label>
                      <input
                        type="text"
                        placeholder="e.g. Students, Designers, Academics"
                        className="w-full glass bg-white/5 border border-border/40 focus:border-primary/60 outline-none rounded-xl px-4 py-2.5 text-sm text-foreground"
                        value={targetAudience}
                        onChange={(e) => setTargetAudience(e.target.value)}
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Primary Age Group</label>
                      <select
                        className="w-full glass bg-white/5 border border-border/40 focus:border-primary/60 outline-none rounded-xl px-4 py-2.5 text-sm text-foreground"
                        value={ageGroup}
                        onChange={(e) => setAgeGroup(e.target.value)}
                      >
                        {AGE_GROUPS.map((a) => (
                          <option key={a} value={a} className="bg-[#12121A] text-foreground">{a}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Target Country / Region</label>
                      <input
                        type="text"
                        placeholder="e.g. United States, Global"
                        className="w-full glass bg-white/5 border border-border/40 focus:border-primary/60 outline-none rounded-xl px-4 py-2.5 text-sm text-foreground"
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">User Interests (comma separated)</label>
                      <input
                        type="text"
                        placeholder="e.g. Productivity, Niche Hobbies, Learning"
                        className="w-full glass bg-white/5 border border-border/40 focus:border-primary/60 outline-none rounded-xl px-4 py-2.5 text-sm text-foreground"
                        value={interests}
                        onChange={(e) => setInterests(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">User Persona Description</label>
                    <textarea
                      placeholder="Describe your ideal user in detail (e.g. college freshman looking to excel in STEM courses and find study networks)."
                      rows={3}
                      className="w-full glass bg-white/5 border border-border/40 focus:border-primary/60 outline-none rounded-xl px-4 py-2 text-sm text-foreground resize-none"
                      value={userPersona}
                      onChange={(e) => setUserPersona(e.target.value)}
                    />
                  </div>
                </div>
              )}

              {/* STEP 4: Media & Socials */}
              {step === 4 && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Workspace Color Theme / Banner Gradient</label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { label: "Purple / Indigo", gradient: "from-violet-600 to-indigo-700" },
                        { label: "Teal / Emerald", gradient: "from-cyan-500 via-teal-500 to-emerald-600" },
                        { label: "Pink / Rose", gradient: "from-pink-500 via-rose-500 to-red-500" }
                      ].map((g) => (
                        <button
                          key={g.gradient}
                          type="button"
                          onClick={() => setBanner(g.gradient)}
                          className={`rounded-xl p-3 border text-left cursor-pointer transition-all flex flex-col gap-2 ${banner === g.gradient ? "border-primary bg-primary/10 shadow-glow" : "border-border/40 glass hover:bg-white/5"}`}
                        >
                          <div className={`h-6 w-full rounded bg-gradient-to-r ${g.gradient}`} />
                          <span className="text-[10px] font-semibold text-center w-full">{g.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Social Link Handles</label>
                    <div className="grid grid-cols-3 gap-3">
                      <div className="glass rounded-xl px-3 py-2 border border-border/40 flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">Twitter:</span>
                        <input
                          type="text"
                          placeholder="@studypal"
                          className="w-full bg-transparent border-none outline-none text-xs text-foreground"
                          value={twitter}
                          onChange={(e) => setTwitter(e.target.value)}
                        />
                      </div>
                      <div className="glass rounded-xl px-3 py-2 border border-border/40 flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">GitHub:</span>
                        <input
                          type="text"
                          placeholder="studypal-app"
                          className="w-full bg-transparent border-none outline-none text-xs text-foreground"
                          value={github}
                          onChange={(e) => setGithub(e.target.value)}
                        />
                      </div>
                      <div className="glass rounded-xl px-3 py-2 border border-border/40 flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">LinkedIn:</span>
                        <input
                          type="text"
                          placeholder="studypal"
                          className="w-full bg-transparent border-none outline-none text-xs text-foreground"
                          value={linkedin}
                          onChange={(e) => setLinkedin(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 5: Launch Details */}
              {step === 5 && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Launch Date</label>
                      <input
                        type="date"
                        className="w-full glass bg-white/5 border border-border/40 focus:border-primary/60 outline-none rounded-xl px-4 py-2.5 text-sm text-foreground"
                        value={launchDate}
                        onChange={(e) => setLaunchDate(e.target.value)}
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Launch Time</label>
                      <input
                        type="time"
                        className="w-full glass bg-white/5 border border-border/40 focus:border-primary/60 outline-none rounded-xl px-4 py-2.5 text-sm text-foreground"
                        value={launchTime}
                        onChange={(e) => setLaunchTime(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Timezone</label>
                      <select
                        className="w-full glass bg-white/5 border border-border/40 focus:border-primary/60 outline-none rounded-xl px-4 py-2.5 text-sm text-foreground"
                        value={timezone}
                        onChange={(e) => setTimezone(e.target.value)}
                      >
                        <option value="UTC" className="bg-[#12121A]">UTC</option>
                        <option value="PST" className="bg-[#12121A]">PST (Pacific Time)</option>
                        <option value="EST" className="bg-[#12121A]">EST (Eastern Time)</option>
                        <option value="IST" className="bg-[#12121A]">IST (Indian Time)</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Product Status</label>
                      <select
                        className="w-full glass bg-white/5 border border-border/40 focus:border-primary/60 outline-none rounded-xl px-4 py-2.5 text-sm text-foreground"
                        value={productStatus}
                        onChange={(e) => setProductStatus(e.target.value as AppProfile["productStatus"])}
                      >
                        {STATUSES.map((s) => (
                          <option key={s} value={s} className="bg-[#12121A] text-foreground">{s}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 6: Review */}
              {step === 6 && (
                <div className="space-y-4">
                  <div className="p-4 rounded-2xl glass-strong border border-accent/20 flex items-center gap-3">
                    <AlertCircle className="h-5 w-5 text-accent shrink-0" />
                    <p className="text-xs text-muted-foreground leading-normal">
                      Publishing will ingest your app details into **LaunchMesh AI** and trigger partnership analysis. This takes approximately 5 seconds.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="glass rounded-xl p-4 border border-border/40 space-y-2">
                      <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">Basics</p>
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{appIcon}</span>
                        <div>
                          <p className="text-sm font-bold text-foreground">{appName || "Unnamed App"}</p>
                          <p className="text-[10px] text-muted-foreground">{category} · {platform}</p>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground italic truncate">"{tagline || "No tagline provided."}"</p>
                    </div>

                    <div className="glass rounded-xl p-4 border border-border/40 space-y-1">
                      <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">Audience</p>
                      <p className="text-xs text-foreground font-semibold">{targetAudience || "General Public"}</p>
                      <p className="text-[10px] text-muted-foreground">Age: {ageGroup} | Region: {country}</p>
                      <p className="text-[10px] text-muted-foreground truncate">Interests: {interests}</p>
                    </div>

                    <div className="glass rounded-xl p-4 border border-border/40 space-y-1 col-span-2">
                      <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">Launch Schedule</p>
                      <p className="text-xs text-foreground">
                        Scheduled for <strong className="text-primary">{launchDate || "Today"}</strong> at <strong className="text-primary">{launchTime} {timezone}</strong>
                      </p>
                      <p className="text-[10px] text-muted-foreground">Status: <span className="text-accent font-semibold">{productStatus}</span> | Pricing: {pricing} | Website: {website || "Not provided"}</p>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Wizard Footer Controls */}
        <div className="p-6 border-t border-border/40 bg-surface/40 flex items-center justify-between">
          <button
            type="button"
            onClick={prevStep}
            disabled={step === 1}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold border border-border/60 glass text-muted-foreground hover:text-foreground cursor-pointer transition-colors ${step === 1 ? "opacity-40 cursor-not-allowed" : ""}`}
          >
            <ChevronLeft className="h-4 w-4" /> Back
          </button>

          {step < 6 ? (
            <button
              type="button"
              onClick={nextStep}
              className="flex items-center gap-1.5 px-5 py-2 rounded-xl text-xs font-semibold text-white bg-primary hover:bg-primary/95 cursor-pointer transition-colors"
            >
              Continue <ChevronRight className="h-4 w-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handlePublish}
              className="flex items-center gap-1.5 px-6 py-2.5 rounded-xl text-xs font-bold text-white animated-gradient cursor-pointer hover:scale-[1.02] transition-transform"
              style={{ boxShadow: "0 0 30px -8px rgba(108,92,231,0.5)" }}
            >
              Publish & Run AI Analysis <Sparkles className="h-4 w-4 text-accent" />
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
}
