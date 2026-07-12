import { loadCsv } from "@/lib/mock-db/csvLoader";
import { CURRENT_FOUNDER_APP_ID } from "@/lib/mock-db/constants";
import type { CsvLaunchTimeline } from "@/lib/mock-db/types";

export async function getTimelineForApp(appId: string = CURRENT_FOUNDER_APP_ID) {
  const milestones = await loadCsv<CsvLaunchTimeline>("launch_timeline");
  return milestones
    .filter((m) => m.app_id === appId)
    .slice(0, 5)
    .map((m) => ({
      label: m.milestone_title.split(" - ").pop() ?? m.milestone_title,
      sub: new Date(m.target_date).toLocaleDateString("en", { month: "short", day: "numeric" }),
      done: m.status.toLowerCase() === "completed",
    }));
}

export async function getLaunchEvents(appId?: string) {
  const events = await loadCsv("launch_events");
  const filtered = appId ? events.filter((e) => e.app_id === appId) : events;
  return filtered;
}

export async function getCommunitiesForCategory(categoryId: string) {
  const communities = await loadCsv("communities");
  return communities.filter((c) => c.category_id === categoryId);
}
