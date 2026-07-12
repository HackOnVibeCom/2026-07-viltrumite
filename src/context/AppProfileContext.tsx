import { createContext, useContext, useMemo, useState, useEffect, type ReactNode } from "react";

export type AppProfile = {
  appName: string;
  description: string;
  category: string;
  targetAudience: string;
  launchDate: string;
  platform: string;
  pricing: string;
  appIcon: string;
  
  // Step 2 pitch
  longDescription: string;
  problem: string;
  solution: string;
  website: string;

  // Step 3 audience detail
  ageGroup: string;
  country: string;
  interests: string;
  userPersona: string;

  // Step 4 media
  screenshots: string[];
  banner: string;
  logoUrl?: string;
  socialLinks?: {
    twitter?: string;
    github?: string;
    linkedin?: string;
  };

  // Step 5 timing
  launchTime: string;
  timezone: string;
  productStatus: "Upcoming" | "Beta" | "Launching Today" | "Live";
};

type AppProfileContextValue = {
  profile: AppProfile | null;
  hasProduct: boolean;
  isLoggedIn: boolean;
  role: "explorer" | "founder";
  analysisComplete: boolean;
  login: (role: "explorer" | "founder", userName?: string) => void;
  logout: () => void;
  setRole: (role: "explorer" | "founder") => void;
  publishProduct: (newProduct: AppProfile) => void;
  updateProfile: (updates: Partial<AppProfile>) => void;
  setAnalysisComplete: (complete: boolean) => void;
  deleteProduct: () => void;
  userName: string;
};

const AppProfileContext = createContext<AppProfileContextValue | null>(null);

export function AppProfileProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    return localStorage.getItem("lm_is_logged_in") === "true";
  });

  const [role, setRoleState] = useState<"explorer" | "founder">((() => {
    return (localStorage.getItem("lm_user_role") as "explorer" | "founder") || "explorer";
  }));

  const [profile, setProfile] = useState<AppProfile | null>(() => {
    const stored = localStorage.getItem("lm_product");
    return stored ? JSON.parse(stored) : null;
  });

  const [analysisComplete, setAnalysisCompleteState] = useState<boolean>(() => {
    return localStorage.getItem("lm_analysis_complete") === "true";
  });

  const [userName, setUserName] = useState<string>(() => {
    return localStorage.getItem("lm_user_name") || "Alex";
  });

  const hasProduct = useMemo(() => profile !== null, [profile]);

  const login = (newRole: "explorer" | "founder", name = "Alex") => {
    setIsLoggedIn(true);
    setRoleState(newRole);
    setUserName(name);
    localStorage.setItem("lm_is_logged_in", "true");
    localStorage.setItem("lm_user_role", newRole);
    localStorage.setItem("lm_user_name", name);
  };

  const logout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem("lm_is_logged_in");
    localStorage.removeItem("lm_user_role");
    localStorage.removeItem("lm_user_name");
  };

  const setRole = (newRole: "explorer" | "founder") => {
    setRoleState(newRole);
    localStorage.setItem("lm_user_role", newRole);
  };

  const publishProduct = (newProduct: AppProfile) => {
    setProfile(newProduct);
    localStorage.setItem("lm_product", JSON.stringify(newProduct));
  };

  const updateProfile = (updates: Partial<AppProfile>) => {
    if (!profile) return;
    const updated = { ...profile, ...updates };
    setProfile(updated);
    localStorage.setItem("lm_product", JSON.stringify(updated));
  };

  const setAnalysisComplete = (complete: boolean) => {
    setAnalysisCompleteState(complete);
    localStorage.setItem("lm_analysis_complete", complete ? "true" : "false");
  };

  const deleteProduct = () => {
    setProfile(null);
    setAnalysisCompleteState(false);
    localStorage.removeItem("lm_product");
    localStorage.removeItem("lm_analysis_complete");
    localStorage.removeItem("lm_analysis_result");
  };

  const value = useMemo(
    () => ({
      profile,
      hasProduct,
      isLoggedIn,
      role,
      analysisComplete,
      login,
      logout,
      setRole,
      publishProduct,
      updateProfile,
      setAnalysisComplete,
      deleteProduct,
      userName,
    }),
    [profile, hasProduct, isLoggedIn, role, analysisComplete, userName]
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
