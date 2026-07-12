export type App = {
  id: string;
  name: string;
  tagline: string;
  description: string;
  icon: string;
  category: string;
  followers: number;
  launchDate: string;
  status: "live" | "upcoming" | "trending";
  founder: { name: string; avatar: string; bio: string };
  platforms: string[];
  pricing: string;
  gradient: string;
  accent: string;
  images: string[];
  features: string[];
  upvotes: number;
  problem: string;
  solution: string;
};

export type CategoryItem = {
  id: string;
  label: string;
  icon: string;
  count: number;
};

export type CollectionItem = {
  id: string;
  label: string;
  icon: string;
  count: number;
  gradient: string;
};

export type ExploreNotification = {
  id: string;
  type: string;
  message: string;
  time: string;
  read: boolean;
  appId: string;
};
