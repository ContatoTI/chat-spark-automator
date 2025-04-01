
import React from "react";
import { Send, Settings, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";

interface TabNavigationProps {
  activeTab: "message" | "settings" | "schedule";
  setActiveTab: (tab: "message" | "settings" | "schedule") => void;
  isValid: boolean;
  onInvalidTabClick: () => void;
}

export const TabNavigation: React.FC<TabNavigationProps> = ({
  activeTab,
  setActiveTab,
  isValid,
  onInvalidTabClick
}) => {
  return (
    <div className="flex border-b mb-6">
      <button
        className={cn(
          "flex items-center gap-2 px-4 py-2 font-medium",
          "border-b-2 transition-colors",
          activeTab === "message"
            ? "border-primary text-primary"
            : "border-transparent text-muted-foreground hover:text-foreground"
        )}
        onClick={() => setActiveTab("message")}
      >
        <Send className="h-4 w-4" />
        Mensagem
      </button>
      <button
        className={cn(
          "flex items-center gap-2 px-4 py-2 font-medium",
          "border-b-2 transition-colors",
          activeTab === "settings"
            ? "border-primary text-primary"
            : "border-transparent text-muted-foreground hover:text-foreground"
        )}
        onClick={() => {
          if (isValid) {
            setActiveTab("settings");
          } else {
            onInvalidTabClick();
          }
        }}
      >
        <Settings className="h-4 w-4" />
        Configurações
      </button>
      <button
        className={cn(
          "flex items-center gap-2 px-4 py-2 font-medium",
          "border-b-2 transition-colors",
          activeTab === "schedule"
            ? "border-primary text-primary"
            : "border-transparent text-muted-foreground hover:text-foreground"
        )}
        onClick={() => {
          if (isValid) {
            setActiveTab("schedule");
          } else {
            onInvalidTabClick();
          }
        }}
      >
        <Calendar className="h-4 w-4" />
        Agendamento
      </button>
    </div>
  );
};
