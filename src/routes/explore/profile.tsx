import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { User, Heart, Bookmark, Bell, Settings } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { APPS } from "@/data/mock";
import { AppCard } from "@/components/explore/AppCard";
import { useState } from "react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/explore/profile")({
  component: ProfilePage,
});

function ProfilePage() {
  const [tab, setTab] = useState("following");
  const TABS = [
    { id: "following", label: "Following", icon: Heart },
    { id: "bookmarks", label: "Bookmarks", icon: Bookmark },
    { id: "notifications", label: "Notifications", icon: Bell },
  ];

  return (
    <div className="p-6 md:p-8 max-w-4xl">
      {/* Profile hero */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
        className="relative glass-strong rounded-3xl border border-border/60 overflow-hidden mb-8">
        <div className="h-28 bg-gradient-to-r from-primary/30 via-accent/20 to-primary/10 relative">
          <div className="absolute inset-0 grid-bg opacity-30" />
        </div>
        <div className="px-6 pb-6">
          <div className="flex items-end justify-between -mt-10 mb-4">
            <motion.div whileHover={{ scale: 1.05 }}
              className="h-20 w-20 rounded-2xl animated-gradient grid place-items-center text-2xl font-bold text-white border-4 border-background shadow-elevated">
              U
            </motion.div>
            <Link to="/explore/settings">
              <motion.button whileHover={{ scale: 1.05 }}
                className="flex items-center gap-2 glass border border-border/60 rounded-xl px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                <Settings className="h-4 w-4" /> Edit Profile
              </motion.button>
            </Link>
          </div>
          <h2 className="text-xl font-bold">Your Name</h2>
          <p className="text-sm text-muted-foreground">Explorer · Joined July 2026</p>
          <div className="flex items-center gap-6 mt-4 text-sm">
            <div><span className="font-bold text-foreground">12</span> <span className="text-muted-foreground">Following</span></div>
            <div><span className="font-bold text-foreground">3</span> <span className="text-muted-foreground">Collections</span></div>
            <div><span className="font-bold text-foreground">48</span> <span className="text-muted-foreground">Upvotes given</span></div>
          </div>
        </div>
      </motion.div>

      {/* Tabs */}
      <div className="flex gap-1 glass-strong rounded-xl p-1 w-fit mb-6">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button key={id} onClick={() => setTab(id)}
            className={cn("flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all",
              tab === id ? "bg-primary text-white" : "text-muted-foreground hover:text-foreground")}>
            <Icon className="h-3.5 w-3.5" /> {label}
          </button>
        ))}
      </div>

      {tab === "following" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {APPS.slice(0, 6).map((app, i) => <AppCard key={app.id} app={app} index={i} />)}
        </div>
      )}
      {tab === "bookmarks" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {APPS.slice(2, 5).map((app, i) => <AppCard key={app.id} app={app} index={i} />)}
        </div>
      )}
      {tab === "notifications" && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <Bell className="h-12 w-12 text-muted-foreground/30 mb-4" />
          <p className="text-muted-foreground">No new notifications</p>
          <Link to="/explore/notifications" className="text-sm text-primary mt-2">View all notifications</Link>
        </div>
      )}
    </div>
  );
}
