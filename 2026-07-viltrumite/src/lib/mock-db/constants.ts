/** Logged-in founder's primary app (ColorWave — Design category) */
export const CURRENT_FOUNDER_APP_ID = "APP-020";

/** Reference date aligned with demo timeline */
export const REFERENCE_DATE = new Date("2026-07-12T12:00:00");

export const CATEGORY_ICONS: Record<string, string> = {
  AI: "🤖",
  Productivity: "⚡",
  Finance: "💳",
  Health: "❤️",
  Education: "📚",
  "Developer Tools": "🛠️",
  Design: "🎨",
  Gaming: "🎮",
  Travel: "✈️",
  Shopping: "🛍️",
  Security: "🔒",
  Career: "💼",
  Social: "💬",
  Music: "🎵",
  Food: "🍽️",
};

export const CATEGORY_GRADIENTS: Record<string, string> = {
  AI: "from-violet-600 via-purple-600 to-indigo-700",
  Productivity: "from-cyan-500 via-teal-500 to-emerald-600",
  Finance: "from-emerald-500 via-green-500 to-teal-600",
  Health: "from-rose-500 via-pink-500 to-fuchsia-600",
  Education: "from-orange-500 via-amber-500 to-yellow-500",
  "Developer Tools": "from-slate-600 via-zinc-600 to-gray-700",
  Design: "from-pink-500 via-rose-500 to-red-500",
  Gaming: "from-violet-600 via-purple-600 to-fuchsia-600",
  Travel: "from-sky-500 via-blue-500 to-indigo-600",
  Shopping: "from-amber-500 via-orange-500 to-red-500",
  Security: "from-zinc-600 via-slate-600 to-gray-700",
  Career: "from-blue-500 via-indigo-500 to-violet-600",
  Social: "from-pink-500 via-rose-500 to-orange-500",
  Music: "from-purple-500 via-violet-500 to-fuchsia-600",
  Food: "from-lime-500 via-green-500 to-emerald-600",
};

export const CATEGORY_ACCENTS: Record<string, string> = {
  AI: "#8B5CF6",
  Productivity: "#06B6D4",
  Finance: "#10B981",
  Health: "#F43F5E",
  Education: "#F59E0B",
  "Developer Tools": "#6366F1",
  Design: "#EC4899",
  Gaming: "#7C3AED",
  Travel: "#0EA5E9",
  Shopping: "#F97316",
  Security: "#64748B",
  Career: "#4F46E5",
  Social: "#EC4899",
  Music: "#A855F7",
  Food: "#22C55E",
};

export const COLLECTION_GRADIENTS = [
  "from-amber-500 to-orange-600",
  "from-violet-500 to-purple-700",
  "from-cyan-500 to-teal-600",
  "from-orange-400 to-green-500",
  "from-pink-500 to-rose-600",
];

export const PARTNER_GRADIENTS = [
  "from-amber-500 to-orange-500",
  "from-cyan-500 to-teal-500",
  "from-violet-500 to-purple-600",
  "from-slate-500 to-zinc-600",
  "from-pink-500 to-rose-500",
];

export function toAppSlug(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "");
}

export function founderInitials(name: string): string {
  return name
    .split(/\s+/)
    .map((part) => part[0] ?? "")
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function parsePercent(value: string): number {
  return Number.parseFloat(value.replace("%", "")) || 0;
}

export function formatRelativeTime(dateStr: string): string {
  const date = new Date(dateStr.includes(" ") ? dateStr.replace(" ", "T") : dateStr);
  const diffMs = REFERENCE_DATE.getTime() - date.getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 60) return `${Math.max(1, mins)}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return date.toLocaleDateString("en", { month: "short", day: "numeric" });
}

export function formatPricing(model: string): string {
  switch (model) {
    case "Freemium":
      return "Free / Premium";
    case "Subscription":
      return "Subscription";
    case "One-Time Purchase":
      return "One-time";
    case "Usage-Based":
      return "Usage-based";
    default:
      return model;
  }
}

export function platformsFromStack(stack: string): string[] {
  const parts = stack.split(",").map((s) => s.trim());
  const platforms = new Set<string>();
  for (const part of parts) {
    if (/react native|flutter/i.test(part)) {
      platforms.add("iOS");
      platforms.add("Android");
    } else if (/next\.js|sveltekit|vue|angular|react/i.test(part)) {
      platforms.add("Web");
    }
  }
  if (platforms.size === 0) platforms.add("Web");
  return [...platforms];
}

export function trustFromMatch(match: number): string {
  if (match >= 90) return "A+";
  if (match >= 80) return "A";
  if (match >= 70) return "B+";
  if (match >= 60) return "B";
  return "C";
}

export function pactStatusToUi(status: string): "active" | "pending" | "draft" {
  const normalized = status.toLowerCase();
  if (normalized === "active" || normalized === "completed") return "active";
  if (normalized === "proposed") return "pending";
  return "draft";
}
