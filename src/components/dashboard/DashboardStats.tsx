
import React from "react";
import { 
  Users, 
  RefreshCw
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "../ui/skeleton";
import { supabase } from "@/lib/supabase";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { useInstanceStore } from "@/stores/instanceStore";

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

const fetchContactsStats = async () => {
  const empresaId = 'empresa-01';
  
  try {
    const { data, error } = await supabase
      .from('AppW_Options')
      .select('numero_de_contatos')
      .eq('empresa_id', empresaId)
      .limit(1)
      .single();

    if (error) {
      console.error("Error fetching contacts stats:", error);
      throw error;
    }
    
    return {
      total: data?.numero_de_contatos || 0
    };
  } catch (error) {
    console.error("Error in fetchContactsStats:", error);
    throw error;
  }
};

export const DashboardStats: React.FC = () => {
  const { selectedInstance } = useInstanceStore();
  
  const { data: contactsStats, isLoading, error, refetch } = useQuery({
    queryKey: ['contactsStats', selectedInstance?.id],
    queryFn: () => fetchContactsStats(),
    staleTime: 60000,
    enabled: !!selectedInstance,
  });

  if (error) {
    console.error("Erro ao buscar estatísticas do dashboard:", error);
  }

  const handleRefresh = () => {
    refetch();
    toast.info("Atualizando estatísticas...");
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-medium">
          Estatísticas da Instância: {selectedInstance?.nome_instancia}
        </h2>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleRefresh}
          className="flex items-center gap-1"
          disabled={isLoading}
        >
          <RefreshCw className={cn("h-4 w-4", isLoading && "animate-spin")} />
          {isLoading ? "Atualizando..." : "Atualizar"}
        </Button>
      </div>
      
      <div className="grid grid-cols-1 gap-6">
        <StatCard
          title="Número de Contatos"
          value={contactsStats?.total ?? 0}
          icon={Users}
          description="Total de contatos na base"
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};
