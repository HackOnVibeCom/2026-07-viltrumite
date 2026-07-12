import { Outlet } from "@tanstack/react-router";
import { FounderSidebar } from "./FounderSidebar";
import { AICopilot } from "./AICopilot";

export function FounderLayout() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <FounderSidebar />
      <main className="ml-64 min-h-screen">
        <Outlet />
      </main>
      <AICopilot />
    </div>
  );
}
