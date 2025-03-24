
import React from "react";
import { cn } from "@/lib/utils";

interface TopBarProps {
  setSidebarOpen: (open: boolean) => void;
  sidebarOpen: boolean;
}

export const TopBar: React.FC<TopBarProps> = ({ setSidebarOpen, sidebarOpen }) => {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background/95 px-4 sm:px-6 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex items-center gap-2">
        <img 
          src="https://falcontruck.com.br/wp-content/uploads/2023/06/logo-falcontruck-positivosvg.svg" 
          alt="Falcontruck Logo" 
          className="h-10" // aproximadamente 40px de altura
        />
      </div>
      {/* Removed the gray circle that was here */}
    </header>
  );
};
