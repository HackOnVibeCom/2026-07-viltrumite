import { Outlet } from "@tanstack/react-router";
import { FounderSidebar } from "./FounderSidebar";
import { AICopilot } from "./AICopilot";
import { Toaster } from "@/components/ui/sonner";
import { AppProfileProvider } from "@/context/AppProfileContext";
import { AnalysisProvider } from "@/context/AnalysisContext";

export function FounderLayout() {
  return (
    <AppProfileProvider>
      <AnalysisProvider>
        <div className="min-h-screen bg-background text-foreground">
          <FounderSidebar />
          <main className="ml-64 min-h-screen">
            <Outlet />
          </main>
          <AICopilot />
          <Toaster position="top-right" richColors closeButton />
        </div>
      </AnalysisProvider>
    </AppProfileProvider>
  );
}
