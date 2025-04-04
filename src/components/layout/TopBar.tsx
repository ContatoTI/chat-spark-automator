
import React from "react";
import { Menu, X, Bell, Search } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { ThemeToggle } from "./ThemeToggle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface TopBarProps {
  setSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
  sidebarOpen: boolean;
}

export const TopBar: React.FC<TopBarProps> = ({ setSidebarOpen, sidebarOpen }) => {
  const { user } = useAuth();

  return (
    <header className="h-16 px-4 md:px-6 bg-card border-b border-border/40 shadow-sm flex items-center justify-between">
      <div className="flex items-center gap-4">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-md hover:bg-muted text-muted-foreground"
          aria-label="Toggle menu"
        >
          {sidebarOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </button>
        <span className="text-lg font-semibold bg-gradient-to-r from-secondary to-primary bg-clip-text text-transparent">AppWhats</span>
        
        <div className="hidden md:flex relative ml-8">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            className="w-64 pl-10 rounded-full bg-muted/50 border-muted focus-visible:ring-secondary" 
            placeholder="Pesquisar..." 
          />
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
          <Bell className="h-5 w-5" />
        </Button>
        <ThemeToggle />
        {user && (
          <div className="flex items-center gap-3">
            <div className="hidden md:block text-sm">
              <p className="font-medium">{user.email}</p>
              <p className="text-xs text-muted-foreground">
                {user.role === 'admin' ? 'Administrador' : 'Usuário'}
              </p>
            </div>
            <Avatar className="h-8 w-8 border border-border/40">
              <AvatarImage src={user.avatar || ""} alt={user.email || ""} />
              <AvatarFallback className="bg-primary text-primary-foreground">
                {user.email?.charAt(0).toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
          </div>
        )}
      </div>
    </header>
  );
};
