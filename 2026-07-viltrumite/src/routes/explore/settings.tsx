import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { User, Palette, Bell, Lock, Globe, Trash2, Link2, ChevronRight } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useTheme } from "@/context/ThemeContext";

export const Route = createFileRoute("/explore/settings")({
  component: SettingsPage,
});

const SECTIONS = [
  { id: "profile", icon: User, label: "Profile", desc: "Name, bio, avatar" },
  { id: "appearance", icon: Palette, label: "Appearance", desc: "Theme, display" },
  { id: "notifications", icon: Bell, label: "Notifications", desc: "Email, push alerts" },
  { id: "privacy", icon: Lock, label: "Privacy", desc: "Who sees your activity" },
  { id: "security", icon: Lock, label: "Security", desc: "Password, 2FA" },
  { id: "language", icon: Globe, label: "Language", desc: "Region, language" },
  { id: "connected", icon: Link2, label: "Connected Accounts", desc: "Google, GitHub" },
];

function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const [active, setActive] = useState("profile");
  const [name, setName] = useState("Your Name");
  const [bio, setBio] = useState("Explorer on LaunchMesh");
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [pushNotifs, setPushNotifs] = useState(true);
  const [launchAlerts, setLaunchAlerts] = useState(true);

  return (
    <div className="p-6 md:p-8 max-w-5xl">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-sm text-muted-foreground">Manage your account preferences</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-6">
        {/* Sidebar */}
        <motion.div initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }}
          className="glass-strong rounded-2xl border border-border/60 p-2 h-fit">
          {SECTIONS.map(({ id, icon: Icon, label, desc }) => (
            <button key={id} onClick={() => setActive(id)} className={cn(
              "w-full flex items-center gap-3 px-3 py-3 rounded-xl text-left transition-colors",
              active === id ? "bg-primary/15 text-primary" : "text-muted-foreground hover:text-foreground hover:bg-muted"
            )}>
              <Icon className="h-4 w-4 shrink-0" />
              <div>
                <p className="text-sm font-medium">{label}</p>
                <p className="text-xs opacity-70">{desc}</p>
              </div>
              <ChevronRight className="h-3.5 w-3.5 ml-auto opacity-50" />
            </button>
          ))}
          <div className="border-t border-border/40 mt-2 pt-2">
            <button className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-left text-rose-400 hover:bg-rose-500/10 transition-colors">
              <Trash2 className="h-4 w-4 shrink-0" />
              <p className="text-sm font-medium">Delete Account</p>
            </button>
          </div>
        </motion.div>

        {/* Content */}
        <motion.div initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }}
          className="glass-strong rounded-2xl border border-border/60 p-6">
          {active === "profile" && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold">Profile Settings</h2>
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-2xl animated-gradient grid place-items-center text-xl font-bold text-white shrink-0">U</div>
                <div>
                  <button className="text-sm text-primary hover:underline">Change avatar</button>
                  <p className="text-xs text-muted-foreground mt-0.5">JPG, PNG up to 2MB</p>
                </div>
              </div>
              <div className="space-y-4">
                {[
                  { label: "Display Name", value: name, setter: setName, placeholder: "Your name" },
                  { label: "Bio", value: bio, setter: setBio, placeholder: "Tell others about yourself" },
                ].map(({ label, value, setter, placeholder }) => (
                  <div key={label}>
                    <label className="text-sm font-medium text-muted-foreground block mb-1.5">{label}</label>
                    <input value={value} onChange={e => setter(e.target.value)} placeholder={placeholder}
                      className="w-full bg-background/60 border border-border/60 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary/60 transition-colors" />
                  </div>
                ))}
              </div>
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                className="px-6 py-2.5 bg-primary text-white rounded-xl text-sm font-semibold shadow-glow">
                Save Changes
              </motion.button>
            </div>
          )}

          {active === "notifications" && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold">Notification Preferences</h2>
              {[
                { label: "Email Notifications", desc: "Receive updates via email", value: emailNotifs, setter: setEmailNotifs },
                { label: "Push Notifications", desc: "Browser push alerts", value: pushNotifs, setter: setPushNotifs },
                { label: "Launch Alerts", desc: "Get notified when apps you follow launch", value: launchAlerts, setter: setLaunchAlerts },
              ].map(({ label, desc, value, setter }) => (
                <div key={label} className="flex items-center justify-between p-4 glass rounded-2xl border border-border/60">
                  <div>
                    <p className="text-sm font-medium">{label}</p>
                    <p className="text-xs text-muted-foreground">{desc}</p>
                  </div>
                  <button onClick={() => setter(!value)}
                    className={cn("h-6 w-11 rounded-full transition-colors relative", value ? "bg-primary" : "bg-muted")}>
                    <motion.div animate={{ x: value ? 20 : 2 }}
                      className="absolute top-0.5 h-5 w-5 rounded-full bg-white shadow" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {active === "appearance" && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold">Appearance</h2>
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-3">Theme</p>
                <div className="flex gap-3">
                  {[
                    { id: "dark", label: "Dark" },
                    { id: "light", label: "Light" },
                  ].map((t) => (
                    <button
                      key={t.id}
                      onClick={() => setTheme(t.id as any)}
                      className={cn(
                        "px-5 py-3.5 rounded-xl border text-sm font-medium cursor-pointer transition-all duration-200",
                        theme === t.id
                          ? "border-primary/40 bg-primary/10 text-primary shadow-sm"
                          : "border-border/40 text-muted-foreground hover:bg-muted"
                      )}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {!["profile", "notifications", "appearance"].includes(active) && (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="h-12 w-12 rounded-2xl glass grid place-items-center mb-4">
                {(() => { const s = SECTIONS.find(s => s.id === active); return s ? <s.icon className="h-6 w-6 text-muted-foreground" /> : null; })()}
              </div>
              <p className="text-muted-foreground text-sm">This section is coming soon</p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
