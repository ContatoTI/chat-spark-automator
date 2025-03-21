
import React from "react";
import { 
  MessageSquare, 
  UserCheck, 
  Clock, 
  CheckCircle,
  AlertCircle
} from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ElementType;
  description?: string;
  trend?: {
    value: number;
    positive: boolean;
  };
  className?: string;
}

const StatCard: React.FC<StatCardProps> = ({ 
  title, 
  value, 
  icon: Icon, 
  description,
  trend,
  className
}) => {
  return (
    <div className={cn(
      "glass-panel p-6 flex flex-col gap-4",
      "transition-all duration-300 ease-in-out card-hover",
      className
    )}>
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-slate-600 dark:text-slate-300">{title}</h3>
        <div className="bg-primary/10 p-2 rounded-full">
          <Icon className="h-5 w-5 text-primary" />
        </div>
      </div>
      <div className="flex flex-col gap-1">
        <div className="text-3xl font-semibold">{value}</div>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
        {trend && (
          <div className="flex items-center gap-1 mt-2">
            <span className={cn(
              "text-xs font-medium",
              trend.positive ? "text-green-500" : "text-red-500"
            )}>
              {trend.positive ? "+" : "-"}{Math.abs(trend.value)}%
            </span>
            <span className="text-xs text-muted-foreground">vs. último período</span>
          </div>
        )}
      </div>
    </div>
  );
};

export const DashboardStats: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatCard
        title="Total Campanhas"
        value={86}
        icon={MessageSquare}
        description="Todas as campanhas"
        trend={{ value: 12, positive: true }}
      />
      <StatCard
        title="Contatos Ativos"
        value={2458}
        icon={UserCheck}
        description="Contatos sincronizados"
        trend={{ value: 8, positive: true }}
      />
      <StatCard
        title="Agendadas"
        value={14}
        icon={Clock}
        description="Campanhas pendentes"
      />
      <StatCard
        title="Taxa de Entrega"
        value="98.2%"
        icon={CheckCircle}
        description="Mensagens entregues"
        trend={{ value: 2.5, positive: true }}
      />
    </div>
  );
};
