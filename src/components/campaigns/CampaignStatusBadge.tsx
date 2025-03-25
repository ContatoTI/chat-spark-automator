
import React from "react";
import { CheckCircle, Clock, Edit, Calendar, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export type CampaignStatus = "draft" | "scheduled" | "sending" | "completed" | "failed";

const statusConfig = {
  draft: {
    label: "Rascunho",
    icon: Edit,
    className: "text-slate-500 bg-slate-100 dark:bg-slate-800",
  },
  scheduled: {
    label: "Agendada",
    icon: Calendar,
    className: "text-blue-500 bg-blue-100 dark:bg-blue-900/20",
  },
  sending: {
    label: "Enviando",
    icon: Clock,
    className: "text-amber-500 bg-amber-100 dark:bg-amber-900/20",
  },
  completed: {
    label: "Concluída",
    icon: CheckCircle,
    className: "text-green-500 bg-green-100 dark:bg-green-900/20",
  },
  failed: {
    label: "Falhou",
    icon: AlertCircle,
    className: "text-red-500 bg-red-100 dark:bg-red-900/20",
  },
};

export const CampaignStatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const config = statusConfig[status as CampaignStatus] || statusConfig.draft;
  const Icon = config.icon;
  
  return (
    <div className={cn(
      "flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full",
      config.className
    )}>
      <Icon className="h-3.5 w-3.5" />
      <span>{config.label}</span>
    </div>
  );
};
