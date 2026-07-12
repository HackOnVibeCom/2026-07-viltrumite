import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import { APPS } from "@/data/mock";

export type AppProfile = {
  appName: string;
  description: string;
  category: string;
  targetAudience: string;
  launchDate: string;
  platform: string;
  pricing: string;
  appIcon: string;
};

const defaultApp = APPS.find((app) => app.id === "designvault") ?? APPS[0];

const DEFAULT_PROFILE: AppProfile = {
  appName: defaultApp.name,
  description: defaultApp.description,
  category: defaultApp.category,
  targetAudience: "Designers, Developers, Founders, Students",
  launchDate: defaultApp.launchDate,
  platform: defaultApp.platforms.join(", "),
  pricing: defaultApp.pricing,
  appIcon: defaultApp.icon,
};

type AppProfileContextValue = {
  profile: AppProfile;
  updateProfile: (updates: Partial<AppProfile>) => void;
};

const AppProfileContext = createContext<AppProfileContextValue | null>(null);

export function AppProfileProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<AppProfile>(DEFAULT_PROFILE);

  const value = useMemo(
    () => ({
      profile,
      updateProfile: (updates: Partial<AppProfile>) =>
        setProfile((current) => ({ ...current, ...updates })),
    }),
    [profile],
  );

  return <AppProfileContext.Provider value={value}>{children}</AppProfileContext.Provider>;
}

export function useAppProfile() {
  const context = useContext(AppProfileContext);
  if (!context) {
    throw new Error("useAppProfile must be used within AppProfileProvider");
  }
  return context;
}

export function toAppProfileInput(profile: AppProfile) {
  return {
    appName: profile.appName,
    description: profile.description,
    category: profile.category,
    targetAudience: profile.targetAudience,
    launchDate: profile.launchDate,
    platform: profile.platform,
    pricing: profile.pricing,
  };
}
