import { Outlet } from "@tanstack/react-router";
import { FounderSidebar } from "./FounderSidebar";
import { AICopilot } from "./AICopilot";
import { Toaster } from "@/components/ui/sonner";
import { AppProfileProvider } from "@/context/AppProfileContext";
import { AnalysisProvider } from "@/context/AnalysisContext";
import { ThemeProvider, useTheme } from "@/context/ThemeContext";
import { motion } from "framer-motion";
import { Sun, Moon } from "lucide-react";

function FounderTopBar() {
  const { theme, toggleTheme } = useTheme();
  return (
    <header className="fixed top-0 left-64 right-0 h-14 z-30 flex items-center justify-end px-6 border-b border-border/40"
      style={{ background: "var(--header-bg, rgba(10,10,15,0.85))", backdropFilter: "blur(20px)" }}>
      <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}
        onClick={toggleTheme}
        className="h-9 w-9 glass rounded-xl grid place-items-center text-muted-foreground hover:text-foreground transition-colors"
        title={`Switch to ${theme === "light" ? "dark" : "light"} mode`}>
        {theme === "light" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
      </motion.button>
    </header>
  );
}

function FounderLayoutContent() {
  const { theme } = useTheme();
  return (
    <div className={`min-h-screen bg-background text-foreground transition-colors duration-200 ${theme === "light" ? "light-dashboard" : "dark-dashboard"}`}>
      <FounderSidebar />
      <FounderTopBar />
      <main className="ml-64 pt-14 min-h-screen">
        <Outlet />
      </main>
      <AICopilot />
      <Toaster position="top-right" richColors closeButton />
    </div>
  );
}

export function FounderLayout() {
  return (
    <AppProfileProvider>
      <AnalysisProvider>
        <ThemeProvider>
          <FounderLayoutContent />
        </ThemeProvider>
      </AnalysisProvider>
    </AppProfileProvider>
  );
}
