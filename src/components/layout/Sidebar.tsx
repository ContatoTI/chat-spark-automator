
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  MessageSquare, 
  Users,
  LogOut,
  Phone,
  Building,
  Info,
  User
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

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
        "flex items-center gap-3 px-3 py-2 rounded-md transition-all duration-200",
        "hover:bg-slate-100 dark:hover:bg-slate-800",
        active 
          ? "bg-secondary/20 text-secondary font-medium" 
          : "text-slate-600 dark:text-slate-400"
      )}
    >
      <Icon className={cn("h-5 w-5", active && "text-secondary")} />
      <span>{label}</span>
    </Link>
  );
};

export const Sidebar: React.FC<SidebarProps> = ({ open }) => {
  const location = useLocation();
  const currentPath = location.pathname;
  const { isAdmin, isMaster, logout, selectedCompany } = useAuth();

  return (
    <aside
      className={cn(
        "bg-white dark:bg-slate-950 border-r border-slate-200 dark:border-slate-800 transition-all duration-300 ease-in-out",
        "z-20 h-full w-64 overflow-y-auto flex-shrink-0",
        open ? "translate-x-0" : "-translate-x-full",
        "md:relative md:translate-x-0",
        open ? "fixed md:relative left-0 top-16 bottom-0 md:top-auto" : ""
      )}
      style={{ height: "calc(100vh - 4rem)" }}
    >
      <div className="flex flex-col h-full gap-2 p-4">
        {/* Exibir informação da empresa selecionada para usuários master */}
        {isMaster && selectedCompany && (
          <div className="px-3 py-2 mb-2 bg-blue-50 dark:bg-blue-900/20 rounded-md text-sm">
            <div className="flex items-center gap-2 text-blue-700 dark:text-blue-400">
              <Info className="h-4 w-4" />
              <span>Empresa selecionada</span>
            </div>
            <p className="mt-1 font-medium text-blue-800 dark:text-blue-300 truncate">
              {selectedCompany}
            </p>
          </div>
        )}
        
        <div className="flex-grow py-2">
          <h2 className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-4 px-3">
            MENU PRINCIPAL
          </h2>
          <nav className="flex flex-col gap-1">
            <SidebarLink
              to="/"
              icon={LayoutDashboard}
              label="Dashboard"
              active={currentPath === "/"}
            />
            <SidebarLink
              to="/contacts"
              icon={User}
              label="Contatos"
              active={currentPath === "/contacts"}
            />
            <SidebarLink
              to="/campaigns"
              icon={MessageSquare}
              label="Campanhas"
              active={currentPath === "/campaigns"}
            />
            
            {/* Exibir links apenas para administradores ou master */}
            {(isAdmin || isMaster) && (
              <>
                <SidebarLink
                  to="/whatsapp-accounts"
                  icon={Phone}
                  label="Contas WhatsApp"
                  active={currentPath === "/whatsapp-accounts"}
                />
                <SidebarLink
                  to="/users"
                  icon={Users}
                  label="Usuários"
                  active={currentPath === "/users"}
                />
              </>
            )}

            {/* Link de empresas apenas para usuários master */}
            {isMaster && (
              <SidebarLink
                to="/companies"
                icon={Building}
                label="Empresas"
                active={currentPath === "/companies"}
              />
            )}
          </nav>
        </div>
        
        {/* Adicionar botão de logout no final do sidebar */}
        <div className="mt-auto pb-4">
          <button
            onClick={() => logout()}
            className="flex w-full items-center gap-3 px-3 py-2 rounded-md text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-200"
          >
            <LogOut className="h-5 w-5" />
            <span>Sair</span>
          </button>
        </div>
      </div>
    </aside>
  );
};
