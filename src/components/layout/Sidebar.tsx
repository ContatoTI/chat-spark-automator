
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  MessageSquare, 
  Settings,
  Users,
  LogOut,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface SidebarProps {
  open: boolean;
}

interface SidebarLinkProps {
  to: string;
  icon: React.ElementType;
  label: string;
  active?: boolean;
}

const SidebarLink: React.FC<SidebarLinkProps> = ({ to, icon: Icon, label, active }) => {
  return (
    <Link
      to={to}
      className={cn(
        "flex items-center gap-3 px-3 py-2.5 rounded-md transition-all duration-200 mb-1",
        "hover:bg-sidebar-accent/10",
        active 
          ? "bg-sidebar-primary/20 text-sidebar-primary font-medium" 
          : "text-sidebar-foreground/80"
      )}
    >
      <Icon className={cn("h-5 w-5", active ? "text-sidebar-primary" : "text-sidebar-foreground/60")} />
      <span>{label}</span>
    </Link>
  );
};

export const Sidebar: React.FC<SidebarProps> = ({ open }) => {
  const location = useLocation();
  const currentPath = location.pathname;
  const { isAdmin, logout } = useAuth();

  return (
    <aside
      className={cn(
        "bg-sidebar border-r border-sidebar-border transition-all duration-300 ease-in-out",
        "z-20 h-full w-64 overflow-y-auto flex-shrink-0",
        open ? "translate-x-0" : "-translate-x-full",
        "md:relative md:translate-x-0",
        open ? "fixed md:relative left-0 top-16 bottom-0 md:top-auto" : ""
      )}
      style={{ height: "calc(100vh - 4rem)" }}
    >
      <div className="flex flex-col h-full gap-2 p-4">
        <div className="flex-grow">
          <h2 className="text-[11px] font-semibold text-sidebar-foreground/50 mb-3 px-3 uppercase tracking-wider mt-6">
            Menu Principal
          </h2>
          <nav className="flex flex-col gap-1 mb-6">
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
          </nav>
          
          {/* Seção Admin */}
          {isAdmin && (
            <>
              <h2 className="text-[11px] font-semibold text-sidebar-foreground/50 mb-3 px-3 uppercase tracking-wider">
                Administração
              </h2>
              <nav className="flex flex-col gap-1">
                <SidebarLink
                  to="/users"
                  icon={Users}
                  label="Usuários"
                  active={currentPath === "/users"}
                />
                <SidebarLink
                  to="/settings"
                  icon={Settings}
                  label="Configurações"
                  active={currentPath === "/settings"}
                />
              </nav>
            </>
          )}
        </div>
        
        {/* Botão de logout no final */}
        <div className="mt-auto pb-4 pt-6 border-t border-sidebar-border/30">
          <button
            onClick={() => logout()}
            className="flex w-full items-center gap-3 px-3 py-2.5 rounded-md transition-all duration-200
              text-sidebar-foreground/80 hover:bg-sidebar-accent/10"
          >
            <LogOut className="h-5 w-5 text-sidebar-foreground/60" />
            <span>Sair</span>
          </button>
        </div>
      </div>
    </aside>
  );
};
