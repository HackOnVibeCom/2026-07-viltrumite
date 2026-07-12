import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Settings, User, Bell, Lock, Trash2, ChevronRight } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

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
  const [appName, setAppName] = useState("DesignVault");
  const [tagline, setTagline] = useState("The Figma library that designs itself");

  return (
    <div className="p-6 md:p-8 max-w-5xl">
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

      <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-6">
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
            <button className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-left text-rose-400 hover:bg-rose-500/10 transition-colors">
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
                <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-700 grid place-items-center text-3xl shrink-0">🎨</div>
                <button className="text-sm text-primary hover:underline">Change icon</button>
              </div>
              {[
                { label: "App Name", value: appName, setter: setAppName },
                { label: "Tagline", value: tagline, setter: setTagline },
              ].map(({ label, value, setter }) => (
                <div key={label}>
                  <label className="text-sm font-medium text-muted-foreground block mb-1.5">{label}</label>
                  <input value={value} onChange={e => setter(e.target.value)}
                    className="w-full bg-background/60 border border-border/60 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary/60 transition-colors" />
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
