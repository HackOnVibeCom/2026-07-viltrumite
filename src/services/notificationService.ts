import { loadCsv } from "@/lib/mock-db/csvLoader";
import { formatRelativeTime } from "@/lib/mock-db/constants";
import type { CsvActivity, CsvNotification } from "@/lib/mock-db/types";
import { getCsvApps } from "./appService";
import { toAppSlug } from "@/lib/mock-db/constants";

export type ExploreNotification = {
  id: string;
  type: string;
  message: string;
  time: string;
  read: boolean;
  appId: string;
};

export async function getExploreNotifications(): Promise<ExploreNotification[]> {
  const [activities, csvApps] = await Promise.all([
    loadCsv<CsvActivity>("activity_feed"),
    getCsvApps(),
  ]);

  const appNameToSlug = new Map(csvApps.map((a) => [a.app_name, toAppSlug(a.app_name)]));

  return activities.slice(0, 12).map((a) => {
    const matchedApp = csvApps.find((app) => a.description.includes(app.app_name));
    const typeMap: Record<string, string> = {
      Review: "comment",
      Upvote: "follow",
      Bookmark: "follow",
      "Community Join": "follow",
      "Timeline Update": "launch",
    };

    return {
      id: a.activity_id,
      type: typeMap[a.activity_type] ?? "launch",
      message: a.description,
      time: formatRelativeTime(a.timestamp),
      read: Math.random() > 0.5,
      appId: matchedApp ? appNameToSlug.get(matchedApp.app_name) ?? matchedApp.app_id : "colorwave",
    };
  });
}

export async function getFounderNotifications(founderId?: string) {
  const notifications = await loadCsv<CsvNotification>("notifications");
  const filtered = founderId
    ? notifications.filter((n) => n.founder_id === founderId)
    : notifications;

  return filtered.slice(0, 8).map((n) => ({
    icon: n.message.includes("partnership") ? "🤝" : n.message.includes("review") ? "⭐" : "📊",
    text: n.message,
    time: formatRelativeTime(n.created_at),
    color: n.is_read.toUpperCase() === "TRUE" ? "#6C5CE7" : "#00D4B8",
    read: n.is_read.toUpperCase() === "TRUE",
  }));
}

export async function getFounderActivityFeed() {
  const activities = await loadCsv<CsvActivity>("activity_feed");
  return activities.slice(0, 6).map((a) => ({
    icon: a.activity_type === "Review" ? "⭐" : a.activity_type === "Upvote" ? "👍" : "🔔",
    text: a.description,
    time: formatRelativeTime(a.timestamp),
    color: "#6C5CE7",
  }));
}
