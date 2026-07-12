import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useState } from "react";
import { Settings, User, Bell, Lock, Trash2, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAppProfile } from "@/context/AppProfileContext";
import { toast } from "sonner";

export const Route = createFileRoute("/founder/settings")({
  component: FounderSettingsPage,
});

const SECTIONS = [
  { id: "profile", icon: User, label: "App Profile", desc: "Name, description, icon" },
  { id: "notifications", icon: Bell, label: "Notifications", desc: "Pact alerts, partner requests" },
  { id: "security", icon: Lock, label: "Security", desc: "Password, API keys" },
];

function FounderSettingsPage() {
  const [active, setActive] = useState("profile");
  const { profile, updateProfile, deleteProduct } = useAppProfile();
  const navigate = useNavigate();

  if (!profile) {
    return (
      <div className="p-6 md:p-8 flex items-center justify-center min-h-[60vh] text-muted-foreground text-sm">
        No product launched yet. Create a launch first.
      </div>
    );
  }

  return (
    <div className="pt-20 md:pt-24 px-6 md:px-8 pb-6 md:pb-8 max-w-5xl">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-2xl bg-primary/20 grid place-items-center">
            <Settings className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Settings</h1>
            <p className="text-sm text-muted-foreground">Manage your founder workspace</p>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-[220px_minmax(0,1fr)] gap-6">
        <div className="glass-strong rounded-2xl border border-border/60 p-2 h-fit">
          {SECTIONS.map(({ id, icon: Icon, label, desc }) => (
            <button key={id} onClick={() => setActive(id)} className={cn(
              "w-full flex items-center gap-3 px-3 py-3 rounded-xl text-left transition-colors",
              active === id ? "bg-primary/15 text-primary" : "text-muted-foreground hover:text-foreground hover:bg-white/5"
            )}>
              <Icon className="h-4 w-4 shrink-0" />
              <div>
                <p className="text-sm font-medium">{label}</p>
                <p className="text-xs opacity-60">{desc}</p>
              </div>
              <ChevronRight className="h-3.5 w-3.5 ml-auto opacity-40" />
            </button>
          ))}
          <div className="border-t border-border/40 mt-2 pt-2">
            <button 
              onClick={() => {
                if (confirm("Are you sure you want to delete this app launch profile? This will reset your founder workspace.")) {
                  deleteProduct();
                  toast.success("Launch profile deleted. Workspace reset.");
                  navigate({ to: "/founder" });
                }
              }}
              className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-left text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
            >
              <Trash2 className="h-4 w-4" />
              <p className="text-sm font-medium">Delete App</p>
            </button>
          </div>
        </div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="glass-strong rounded-2xl border border-border/60 p-6">
          {active === "profile" && (
            <div className="space-y-5">
              <h2 className="text-lg font-semibold">App Profile</h2>
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-700 grid place-items-center text-3xl shrink-0">{profile.appIcon}</div>
                <button className="text-sm text-primary hover:underline">Change icon</button>
              </div>
              {[
                { label: "App Name", key: "appName" as const },
                { label: "Description", key: "description" as const, multiline: true },
                { label: "Category", key: "category" as const },
                { label: "Target Audience", key: "targetAudience" as const },
                { label: "Launch Date", key: "launchDate" as const, type: "date" },
                { label: "Platform", key: "platform" as const },
                { label: "Pricing", key: "pricing" as const },
              ].map(({ label, key, multiline, type }) => (
                <div key={label}>
                  <label className="text-sm font-medium text-muted-foreground block mb-1.5">{label}</label>
                  {multiline ? (
                    <textarea
                      value={profile[key]}
                      onChange={(e) => updateProfile({ [key]: e.target.value })}
                      rows={3}
                      className="w-full bg-background/60 border border-border/60 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary/60 transition-colors resize-none"
                    />
                  ) : (
                    <input
                      type={type ?? "text"}
                      value={profile[key]}
                      onChange={(e) => updateProfile({ [key]: e.target.value })}
                      className="w-full bg-background/60 border border-border/60 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary/60 transition-colors"
                    />
                  )}
                </div>
              ))}
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white"
                style={{ background: "linear-gradient(135deg, #6C5CE7, #00D4B8)" }}>
                Save Changes
              </motion.button>
            </div>
          )}
          {active !== "profile" && (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <Settings className="h-12 w-12 text-muted-foreground/30 mb-4" />
              <p className="text-muted-foreground text-sm">This section is coming soon</p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
