import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Bell, Rocket, MessageSquare, Heart } from "lucide-react";
import { useExploreNotifications } from "@/hooks/useMockDb";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/explore/notifications")({
  component: NotificationsPage,
});

const ICON_MAP: Record<string, React.ReactNode> = {
  launch: <Rocket className="h-4 w-4 text-primary" />,
  follow: <Heart className="h-4 w-4 text-rose-400" />,
  comment: <MessageSquare className="h-4 w-4 text-accent" />,
};

function NotificationsPage() {
  const { data: notifications = [] } = useExploreNotifications();
  return (
    <div className="p-6 md:p-8 max-w-2xl">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="h-10 w-10 rounded-2xl bg-primary/20 grid place-items-center">
            <Bell className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Notifications</h1>
            <p className="text-sm text-muted-foreground">{notifications.filter(n => !n.read).length} unread</p>
          </div>
        </div>
      </motion.div>

      <div className="space-y-2">
        {notifications.map((n, i) => (
          <motion.div key={n.id}
            initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06 }}>
            <Link to={`/explore/app/${n.appId}`}>
              <div className={cn(
                "flex items-start gap-4 p-4 rounded-2xl border transition-colors hover:border-primary/30",
                n.read ? "glass border-border/40" : "glass-strong border-primary/20 bg-primary/5"
              )}>
                <div className="h-9 w-9 rounded-xl glass grid place-items-center shrink-0">
                  {ICON_MAP[n.type]}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">{n.message}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{n.time}</p>
                </div>
                {!n.read && <div className="h-2 w-2 rounded-full bg-accent mt-1.5 shrink-0" />}
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
