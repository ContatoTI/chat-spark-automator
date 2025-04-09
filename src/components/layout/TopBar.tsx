
import React from "react";
import { Menu, X } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { ThemeToggle } from "./ThemeToggle";
import { cn } from "@/lib/utils";

interface TopBarProps {
  setSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
  sidebarOpen: boolean;
}

export const TopBar: React.FC<TopBarProps> = ({ setSidebarOpen, sidebarOpen }) => {
  const { user } = useAuth();
  
  return (
    <header className="h-16 px-4 md:px-6 bg-white dark:bg-slate-950 border-b flex items-center justify-between sticky top-0 z-20">
      <div className="flex items-center">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className={cn(
            "p-2 rounded-md transition-colors",
            "hover:bg-slate-100 dark:hover:bg-slate-800",
            "md:hidden"
          )}
          aria-label="Toggle menu"
        >
          {sidebarOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </button>
        <span className="text-lg font-semibold ml-2">AppWhats</span>
      </div>
      
      <div className="flex items-center gap-4">
        <ThemeToggle />
        {user && (
          <div className="text-sm text-slate-600 dark:text-slate-400 hidden sm:block">
            <span className="font-medium">{user.email}</span>
            <span className={cn(
              "ml-2 text-xs",
              "bg-slate-100 dark:bg-slate-800",
              "px-2 py-1 rounded-full"
            )}>
              {user.role === 'admin' ? 'Administrador' : 'Usuário'}
            </span>
          </div>
        )}
      </div>
    </header>
  );
};
