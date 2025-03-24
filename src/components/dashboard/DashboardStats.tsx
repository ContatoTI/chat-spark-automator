
import React from "react";
import { 
  Users, 
  CheckCircle, 
  Clock, 
  AlertTriangle
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "../ui/skeleton";
import { supabase } from "@/lib/supabase";

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
  isLoading?: boolean;
}

const StatCard: React.FC<StatCardProps> = ({ 
  title, 
  value, 
  icon: Icon, 
  description,
  trend,
  className,
  isLoading = false
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
        <div className="text-3xl font-semibold">
          {isLoading ? (
            <Skeleton className="h-8 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
          ) : (
            value
          )}
        </div>
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

// Função para buscar estatísticas de contatos do Supabase
const fetchContactsStats = async () => {
  try {
    // Buscar número total de contatos
    const { count: total, error: totalError } = await supabase
      .from('Contatos')
      .select('*', { count: 'exact', head: true });

    if (totalError) throw totalError;

    // Buscar número de contatos enviados
    const { count: sent, error: sentError } = await supabase
      .from('Contatos')
      .select('*', { count: 'exact', head: true })
      .eq('Enviado', true);

    if (sentError) throw sentError;

    // Buscar número de contatos restantes
    const { count: remaining, error: remainingError } = await supabase
      .from('Contatos')
      .select('*', { count: 'exact', head: true })
      .eq('Enviado', false);

    if (remainingError) throw remainingError;

    // Buscar número de contatos inválidos
    const { count: invalid, error: invalidError } = await supabase
      .from('Contatos')
      .select('*', { count: 'exact', head: true })
      .eq('Invalido', true);

    if (invalidError) throw invalidError;

    console.log("Estatísticas de contatos:", { total, sent, remaining, invalid });
    
    return {
      total: total || 0,
      sent: sent || 0,
      remaining: remaining || 0,
      invalid: invalid || 0
    };
  } catch (error) {
    console.error("Erro ao buscar estatísticas de contatos:", error);
    throw error;
  }
};

export const DashboardStats: React.FC = () => {
  const { data: contactsStats, isLoading, error } = useQuery({
    queryKey: ['contactsStats'],
    queryFn: fetchContactsStats,
  });

  if (error) {
    console.error("Erro ao buscar estatísticas do dashboard:", error);
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatCard
        title="Número de Contatos"
        value={isLoading ? 0 : contactsStats?.total || 0}
        icon={Users}
        description="Total de contatos"
        isLoading={isLoading}
      />
      <StatCard
        title="Enviados"
        value={isLoading ? 0 : contactsStats?.sent || 0}
        icon={CheckCircle}
        description="Contatos com Enviado=TRUE"
        isLoading={isLoading}
      />
      <StatCard
        title="Restantes"
        value={isLoading ? 0 : contactsStats?.remaining || 0}
        icon={Clock}
        description="Contatos com Enviado=FALSE"
        isLoading={isLoading}
      />
      <StatCard
        title="Inválidos"
        value={isLoading ? 0 : contactsStats?.invalid || 0}
        icon={AlertTriangle}
        description="Contatos com Invalido=TRUE"
        isLoading={isLoading}
      />
    </div>
  );
};
