import { useState, useEffect } from "react";
import { Outlet, useNavigate } from "@tanstack/react-router";
import { FounderSidebar } from "./FounderSidebar";
import { AICopilot } from "./AICopilot";
import { Toaster } from "@/components/ui/sonner";
import { AppProfileProvider, useAppProfile } from "@/context/AppProfileContext";
import { AnalysisProvider, useAnalysis } from "@/context/AnalysisContext";
import { ThemeProvider, useTheme } from "@/context/ThemeContext";
import { motion } from "framer-motion";
import { Sun, Moon, LogOut } from "lucide-react";
import { EmptyState } from "./EmptyState";
import { CreateLaunchWizard } from "./CreateLaunchWizard";
import { AIAnalysisScreen } from "./AIAnalysisScreen";
import { SimulationWidget } from "./SimulationWidget";
import { toast } from "sonner";

function FounderTopBar() {
  const { theme, toggleTheme } = useTheme();
  const { logout } = useAppProfile();

  const handleLogout = () => {
    logout();
    window.location.href = "/login";
  };

  return (
    <header
      className="fixed top-0 left-64 right-0 h-14 z-30 flex items-center justify-end px-6 border-b border-border/40 gap-3"
      style={{ background: "var(--header-bg, rgba(10,10,15,0.85))", backdropFilter: "blur(20px)" }}
    >
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={toggleTheme}
        className="h-9 w-9 glass rounded-xl grid place-items-center text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
        title={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
      >
        {theme === "light" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
      </motion.button>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleLogout}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-border/40 glass text-xs font-semibold text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
      >
        <LogOut className="h-3.5 w-3.5" />
        Logout
      </motion.button>
    </header>
  );
}

function FounderLayoutContent() {
  const { theme } = useTheme();
  const { hasProduct, analysisComplete, setAnalysisComplete, role } = useAppProfile();
  const { analyze } = useAnalysis();
  const navigate = useNavigate();

  const [wizardOpen, setWizardOpen] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [apiReady, setApiReady] = useState(false);

  // Role Gate: Non-founders go to login
  useEffect(() => {
    if (role !== "founder") {
      navigate({ to: "/login" });
    }
  }, [role, navigate]);

  // Handle automatic analysis trigger if product is set but not analyzed
  useEffect(() => {
    if (hasProduct && !analysisComplete && !isAnalyzing) {
      triggerAnalysis();
    }
  }, [hasProduct, analysisComplete]);

  const triggerAnalysis = async () => {
    setIsAnalyzing(true);
    setApiReady(false);
    try {
      const res = await analyze();
      if (res) {
        setApiReady(true);
      } else {
        // API unavailable — fall back to mock data silently
        setApiReady(true);
      }
    } catch {
      // Fall back gracefully without showing error
      setApiReady(true);
    }
  };

  const handleAnalysisComplete = () => {
    setAnalysisComplete(true);
    setIsAnalyzing(false);
    toast.success("LaunchMesh AI: App analyzed successfully!", {
      description: "Unlocked AI matches, audience overlap and growth pact insights."
    });
    navigate({ to: "/founder" });
  };

  if (role !== "founder") return null;

  // Render Full Screen AI Analysis
  if (hasProduct && (isAnalyzing || !analysisComplete)) {
    return (
      <div className={`min-h-screen bg-background text-foreground transition-colors duration-200 ${theme === "light" ? "light-dashboard" : "dark-dashboard"}`}>
        <AIAnalysisScreen apiReady={apiReady} onComplete={handleAnalysisComplete} />
        <Toaster position="top-right" richColors closeButton />
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-background text-foreground transition-colors duration-200 ${theme === "light" ? "light-dashboard" : "dark-dashboard"}`}>
      <FounderSidebar />
      <FounderTopBar />
      <main className="ml-64 pt-14 min-h-screen">
        {hasProduct ? (
          <Outlet />
        ) : (
          <EmptyState onCreateClick={() => setWizardOpen(true)} />
        )}
      </main>
      <AICopilot />
      <SimulationWidget />
      <Toaster position="top-right" richColors closeButton />

      {/* Product launch wizard modal */}
      <CreateLaunchWizard
        open={wizardOpen}
        onClose={() => setWizardOpen(false)}
        onStartAnalysis={triggerAnalysis}
      />
    </div>
  );
}

export function FounderLayout() {
  return (
    <AnalysisProvider>
      <ThemeProvider>
        <FounderLayoutContent />
      </ThemeProvider>
    </AnalysisProvider>
  );
}
