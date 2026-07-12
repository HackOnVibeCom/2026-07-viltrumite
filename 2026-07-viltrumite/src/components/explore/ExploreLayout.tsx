import { useState } from "react";
import { Outlet } from "@tanstack/react-router";
import { Sidebar } from "./Sidebar";
import { TopNav } from "./TopNav";
import { SearchPalette } from "./SearchPalette";

import { ThemeProvider, useTheme } from "@/context/ThemeContext";

function ExploreLayoutContent() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { theme } = useTheme();

  return (
    <div className={`min-h-screen bg-background text-foreground transition-colors duration-200 ${theme === "light" ? "light-dashboard" : "dark-dashboard"}`}>
      {/* Sidebar with open/close state */}
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Mobile Drawer Overlay Backdrop */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm lg:hidden transition-opacity duration-300"
        />
      )}

      <TopNav onSearchOpen={() => setSearchOpen(true)} onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
      <main className="ml-0 lg:ml-64 pt-16 min-h-screen transition-[margin-left] duration-300 ease-in-out">
        <Outlet />
      </main>
      <SearchPalette open={searchOpen} onClose={() => setSearchOpen(false)} />
    </div>
  );
}

export function ExploreLayout() {
  return (
    <ThemeProvider>
      <ExploreLayoutContent />
    </ThemeProvider>
  );
}
