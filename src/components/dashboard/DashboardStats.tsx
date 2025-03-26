
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
    // Verificar se a tabela AppW_Contatos existe
    const { count: tableExists, error: tableCheckError } = await supabase
      .from('AppW_Contatos')
      .select('*', { count: 'exact', head: true });
      
    // Se a tabela não existir, use valores de fallback
    if (tableCheckError) {
      console.error("Erro ao verificar tabela AppW_Contatos:", tableCheckError);
      console.log("Usando valores de fallback para estatísticas");
      return {
        total: 0,
        sent: 0,
        remaining: 0,
        invalid: 0
      };
    }
    
    // Buscar número total de contatos - Usando AppW_Contatos
    const { count: total, error: totalError } = await supabase
      .from('AppW_Contatos')
      .select('*', { count: 'exact', head: true });

    if (totalError) throw totalError;

    // Buscar número de contatos enviados - Usando AppW_Contatos
    const { count: sent, error: sentError } = await supabase
      .from('AppW_Contatos')
      .select('*', { count: 'exact', head: true })
      .eq('Enviado', true);

    if (sentError) throw sentError;

    // Buscar número de contatos restantes - Usando AppW_Contatos
    const { count: remaining, error: remainingError } = await supabase
      .from('AppW_Contatos')
      .select('*', { count: 'exact', head: true })
      .eq('Enviado', false);

    if (remainingError) throw remainingError;

    // Buscar número de contatos inválidos - Usando AppW_Contatos
    const { count: invalid, error: invalidError } = await supabase
      .from('AppW_Contatos')
      .select('*', { count: 'exact', head: true })
      .eq('Invalido', 'Invalido');

    if (invalidError) throw invalidError;

    // Buscar o valor 'enviados' diretamente da tabela AppW_Options
    const { data: optionsData, error: optionsError } = await supabase
      .from('AppW_Options')
      .select('*')
      .eq('option', 'enviados')
      .single();

    if (optionsError && optionsError.code !== 'PGRST116') throw optionsError;
    
    // Obter o valor numeric da opção 'enviados'
    const settingsEnviados = optionsData?.numeric || 0;

    console.log("Estatísticas de contatos:", { total, sent, remaining, invalid, settingsEnviados });
    
    return {
      total: total || 0,
      sent: settingsEnviados || 0, // Usar o valor diretamente da opção 'enviados'
      remaining: remaining || 0,
      invalid: invalid || 0
    };
  } catch (error) {
    console.error("Erro ao buscar estatísticas de contatos:", error);
    // Retornar valores de fallback em caso de erro
    return {
      total: 0,
      sent: 0,
      remaining: 0,
      invalid: 0
    };
  }
};

export const DashboardStats: React.FC = () => {
  const { data: contactsStats, isLoading, error } = useQuery({
    queryKey: ['contactsStats'],
    queryFn: fetchContactsStats,
    refetchInterval: 60000, // Atualizar a cada minuto
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
        description="Contatos com Invalido='Invalido'"
        isLoading={isLoading}
      />
    </div>
  );
};
