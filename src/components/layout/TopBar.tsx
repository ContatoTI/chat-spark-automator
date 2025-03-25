
import React from "react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

interface TopBarProps {
  setSidebarOpen: (open: boolean) => void;
  sidebarOpen: boolean;
}

export const TopBar: React.FC<TopBarProps> = ({ setSidebarOpen, sidebarOpen }) => {
  const { user, profile, isAdmin } = useAuth();
  
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background/95 px-4 sm:px-6 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex items-center gap-2">
        <img 
          src="https://falcontruck.com.br/wp-content/uploads/2023/06/logo-falcontruck-positivosvg.svg" 
          alt="Falcontruck Logo" 
          className="h-10"
        />
      </div>
      
      {/* Espaçador para empurrar o avatar para a direita */}
      <div className="flex-1"></div>
      
      {/* Avatar e nome do usuário */}
      {user && (
        <div className="flex items-center gap-3">
          {isAdmin && (
            <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
              Admin
            </Badge>
          )}
          <span className="text-sm font-medium hidden sm:block">
            {profile?.full_name || user.email}
          </span>
          <Avatar>
            <AvatarFallback>
              {profile?.full_name 
                ? profile.full_name.split(' ').map(name => name[0]).join('').toUpperCase().substring(0, 2)
                : user.email?.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </div>
      )}
    </header>
  );
};
