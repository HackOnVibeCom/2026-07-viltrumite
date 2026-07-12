/** CSV row types matching files in public/mock-db/ */

export type CsvApp = {
  app_id: string;
  app_name: string;
  tagline: string;
  description: string;
  category_id: string;
  founder_id: string;
  launch_date: string;
  primary_tech_stack: string;
  followers_count: string;
  average_rating: string;
  growth_score: string;
  pricing_model: string;
};

export type CsvFounder = {
  founder_id: string;
  name: string;
  email: string;
  bio: string;
  linkedin_url: string;
};

export type CsvUser = {
  user_id: string;
  name: string;
  email: string;
  joined_date: string;
  role: string;
};

export type CsvCategory = {
  category_id: string;
  category_name: string;
  description: string;
};

export type CsvAiMatch = {
  match_id: string;
  app_id_1: string;
  app_id_2: string;
  match_percentage: string;
  reasoning: string;
  status: string;
};

export type CsvGrowthPact = {
  pact_id: string;
  match_id: string;
  campaign_type: string;
  start_date: string;
  status: string;
  shared_conversions: string;
};

export type CsvBundle = {
  bundle_id: string;
  bundle_name: string;
  app_ids: string;
  discount_percentage: string;
  created_at: string;
  total_purchases: string;
};

export type CsvAnalytics = {
  analytics_id: string;
  app_id: string;
  daily_active_users: string;
  monthly_active_users: string;
  churn_rate: string;
  conversion_rate: string;
  revenue_mrr_usd: string;
};

export type CsvReview = {
  review_id: string;
  app_id: string;
  user_id: string;
  rating: string;
  review_text: string;
  created_at: string;
};

export type CsvNotification = {
  notification_id: string;
  founder_id: string;
  message: string;
  is_read: string;
  created_at: string;
};

export type CsvActivity = {
  activity_id: string;
  user_id: string;
  activity_type: string;
  description: string;
  timestamp: string;
};

export type CsvCommunity = {
  community_id: string;
  community_name: string;
  description: string;
  category_id: string;
  member_count: string;
};

export type CsvLaunchEvent = {
  event_id: string;
  app_id: string;
  event_title: string;
  event_type: string;
  scheduled_date: string;
  attendees_count: string;
};

export type CsvLaunchTimeline = {
  milestone_id: string;
  app_id: string;
  milestone_title: string;
  target_date: string;
  status: string;
};

export type CsvScreenshot = {
  screenshot_id: string;
  app_id: string;
  image_url: string;
  caption: string;
};

export type MockDbTable =
  | "apps"
  | "founders"
  | "users"
  | "categories"
  | "ai_matches"
  | "growth_pacts"
  | "bundles"
  | "analytics"
  | "reviews"
  | "notifications"
  | "activity_feed"
  | "communities"
  | "launch_events"
  | "launch_timeline"
  | "screenshots";
