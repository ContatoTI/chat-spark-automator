
import React, { useState } from "react";
import { Sidebar } from "./Sidebar";
import { TopBar } from "./TopBar";
import { cn } from "@/lib/utils";

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
      <TopBar setSidebarOpen={setSidebarOpen} sidebarOpen={sidebarOpen} />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar open={sidebarOpen} />
        <main
          className={cn(
            "flex-1 overflow-auto transition-all duration-300 ease-in-out",
            "px-4 sm:px-6 md:px-8 py-6",
            "animate-fade-in"
          )}
        >
          <div className="container mx-auto max-w-7xl pb-12">{children}</div>
        </main>
      </div>
    </div>
  );
};
