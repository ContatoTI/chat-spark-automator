
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  MessageSquare, 
  History, 
  Settings,
  Users,
  LogOut
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";

interface SidebarProps {
  open: boolean;
}

interface SidebarLinkProps {
  to: string;
  icon: React.ElementType;
  label: string;
  active?: boolean;
  onClick?: () => void;
}

const SidebarLink: React.FC<SidebarLinkProps> = ({ to, icon: Icon, label, active, onClick }) => {
  if (onClick) {
    return (
      <button
        onClick={onClick}
        className={cn(
          "flex items-center gap-3 px-3 py-2 rounded-md transition-all duration-200 w-full text-left",
          "hover:bg-slate-100 dark:hover:bg-slate-800",
          active 
            ? "bg-primary/10 text-primary font-medium" 
            : "text-slate-600 dark:text-slate-400"
        )}
      >
        <Icon className="h-5 w-5" />
        <span>{label}</span>
      </button>
    );
  }
  
  return (
    <Link
      to={to}
      className={cn(
        "flex items-center gap-3 px-3 py-2 rounded-md transition-all duration-200",
        "hover:bg-slate-100 dark:hover:bg-slate-800",
        active 
          ? "bg-primary/10 text-primary font-medium" 
          : "text-slate-600 dark:text-slate-400"
      )}
    >
      <Icon className="h-5 w-5" />
      <span>{label}</span>
    </Link>
  );
};

export const Sidebar: React.FC<SidebarProps> = ({ open }) => {
  const location = useLocation();
  const currentPath = location.pathname;
  const { user, isAdmin, signOut } = useAuth();

  return (
    <aside
      className={cn(
        "bg-white dark:bg-slate-950 border-r transition-all duration-300 ease-in-out",
        "z-20 h-[calc(100vh-4rem)] w-64 overflow-y-auto",
        open ? "translate-x-0" : "-translate-x-full",
        "md:relative md:translate-x-0",
        open ? "absolute md:relative" : ""
      )}
    >
      <div className="flex flex-col gap-2 p-4">
        <div className="py-2">
          <nav className="flex flex-col gap-1">
            <SidebarLink
              to="/"
              icon={LayoutDashboard}
              label="Dashboard"
              active={currentPath === "/"}
            />
            <SidebarLink
              to="/campaigns"
              icon={MessageSquare}
              label="Campanhas"
              active={currentPath === "/campaigns"}
            />
            <SidebarLink
              to="/history"
              icon={History}
              label="Histórico"
              active={currentPath === "/history"}
            />
            
            <SidebarLink
              to="/settings"
              icon={Settings}
              label="Configurações"
              active={currentPath === "/settings"}
            />
            
            {isAdmin && (
              <SidebarLink
                to="/users"
                icon={Users}
                label="Usuários"
                active={currentPath === "/users"}
              />
            )}
          </nav>
        </div>

        {user && (
          <div className="mt-auto pt-4 border-t">
            <SidebarLink
              to="#"
              icon={LogOut}
              label="Sair"
              onClick={signOut}
            />
          </div>
        )}
      </div>
    </aside>
  );
};
