
import React from "react";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface TopBarProps {
  setSidebarOpen: (open: boolean) => void;
  sidebarOpen: boolean;
}

export const TopBar: React.FC<TopBarProps> = ({ setSidebarOpen, sidebarOpen }) => {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background/95 px-4 sm:px-6 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <Button
        variant="ghost"
        className="mr-2 md:mr-4 p-0 w-9 h-9 rounded-full"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        <span className="sr-only">Toggle menu</span>
        {sidebarOpen ? (
          <X className="h-5 w-5 text-muted-foreground" />
        ) : (
          <Menu className="h-5 w-5 text-muted-foreground" />
        )}
      </Button>
      <div className="flex items-center gap-2">
        <img 
          src="https://falcontruck.com.br/wp-content/uploads/2023/06/logo-falcontruck-positivosvg.svg" 
          alt="Falcontruck Logo" 
          className="h-10" // aproximadamente 40px de altura
        />
        <h1 className="text-xl font-medium ml-2">
          AutomaWhats
        </h1>
      </div>
      <div className="ml-auto flex items-center gap-2">
        {/* Profile section - would contain user profile/settings */}
        <div className="h-8 w-8 rounded-full bg-muted" />
      </div>
    </header>
  );
};
