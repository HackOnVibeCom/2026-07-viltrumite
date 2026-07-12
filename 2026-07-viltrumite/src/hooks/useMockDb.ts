import { useQuery } from "@tanstack/react-query";
import { getAllApps, getAppBySlug, getFeaturedApp, getLiveApps, getRelatedApps, getTrendingApps, getUpcomingApps } from "@/services/appService";
import { getCategories } from "@/services/categoryService";
import { getCollections, getBundles } from "@/services/bundleService";
import { getAnalyticsForApp } from "@/services/analyticsService";
import { getMatchesForApp, getTopMatchForFounder } from "@/services/matchService";
import { getPactsForFounderApp, getActivePactCount } from "@/services/pactService";
import { getExploreNotifications, getFounderActivityFeed, getFounderNotifications } from "@/services/notificationService";
import { getTimelineForApp } from "@/services/launchService";
import { getFounderRecommendations } from "@/services/reviewService";
import { getCurrentFounderApp } from "@/services/founderService";
import { CURRENT_FOUNDER_APP_ID } from "@/lib/mock-db/constants";

const STALE = Infinity;

export function useApps() {
  return useQuery({ queryKey: ["apps"], queryFn: getAllApps, staleTime: STALE });
}

export function useApp(slug: string) {
  return useQuery({
    queryKey: ["app", slug],
    queryFn: () => getAppBySlug(slug),
    staleTime: STALE,
    enabled: Boolean(slug),
  });
}

export function useFeaturedApp() {
  return useQuery({ queryKey: ["app", "featured"], queryFn: getFeaturedApp, staleTime: STALE });
}

export function useTrendingApps() {
  return useQuery({ queryKey: ["apps", "trending"], queryFn: getTrendingApps, staleTime: STALE });
}

export function useUpcomingApps() {
  return useQuery({ queryKey: ["apps", "upcoming"], queryFn: getUpcomingApps, staleTime: STALE });
}

export function useLiveApps() {
  return useQuery({ queryKey: ["apps", "live"], queryFn: getLiveApps, staleTime: STALE });
}

export function useRelatedApps(slug: string) {
  return useQuery({
    queryKey: ["apps", "related", slug],
    queryFn: () => getRelatedApps(slug),
    staleTime: STALE,
    enabled: Boolean(slug),
  });
}

export function useCategories() {
  return useQuery({ queryKey: ["categories"], queryFn: getCategories, staleTime: STALE });
}

export function useCollections() {
  return useQuery({ queryKey: ["collections"], queryFn: getCollections, staleTime: STALE });
}

export function useBundles() {
  return useQuery({ queryKey: ["bundles"], queryFn: getBundles, staleTime: STALE });
}

export function useExploreNotifications() {
  return useQuery({ queryKey: ["notifications", "explore"], queryFn: getExploreNotifications, staleTime: STALE });
}

export function useFounderMatches(appId = CURRENT_FOUNDER_APP_ID) {
  return useQuery({ queryKey: ["matches", appId], queryFn: () => getMatchesForApp(appId), staleTime: STALE });
}

export function useTopMatch(appId = CURRENT_FOUNDER_APP_ID) {
  return useQuery({ queryKey: ["matches", appId, "top"], queryFn: () => getTopMatchForFounder(appId), staleTime: STALE });
}

export function useFounderPacts(appId = CURRENT_FOUNDER_APP_ID) {
  return useQuery({ queryKey: ["pacts", appId], queryFn: () => getPactsForFounderApp(appId), staleTime: STALE });
}

export function useActivePactCount(appId = CURRENT_FOUNDER_APP_ID) {
  return useQuery({ queryKey: ["pacts", appId, "count"], queryFn: () => getActivePactCount(appId), staleTime: STALE });
}

export function useFounderAnalytics(appId = CURRENT_FOUNDER_APP_ID) {
  return useQuery({ queryKey: ["analytics", appId], queryFn: () => getAnalyticsForApp(appId), staleTime: STALE });
}

export function useFounderTimeline(appId = CURRENT_FOUNDER_APP_ID) {
  return useQuery({ queryKey: ["timeline", appId], queryFn: () => getTimelineForApp(appId), staleTime: STALE });
}

export function useFounderActivity() {
  return useQuery({ queryKey: ["activity", "founder"], queryFn: getFounderActivityFeed, staleTime: STALE });
}

export function useFounderNotifications() {
  return useQuery({ queryKey: ["notifications", "founder"], queryFn: () => getFounderNotifications(), staleTime: STALE });
}

export function useFounderRecommendations(appId = CURRENT_FOUNDER_APP_ID) {
  return useQuery({ queryKey: ["recommendations", appId], queryFn: () => getFounderRecommendations(appId), staleTime: STALE });
}

export function useCurrentFounderApp() {
  return useQuery({ queryKey: ["founder-app"], queryFn: getCurrentFounderApp, staleTime: STALE });
}
