import React from "react";
import { 
  Users, 
  AlertTriangle,
  RefreshCw
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "../ui/skeleton";
import { supabase } from "@/lib/supabase";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

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

const fetchContactsStats = async (companyId?: string | null) => {
  console.log("Fetching contacts stats for company:", companyId);
  try {
    let query = supabase
      .from('AppW_Options')
      .select('numeric')
      .eq('option', 'numero_de_contatos');
    
    if (companyId) {
      query = query.eq('empresa_id', companyId);
    }
    
    const { data: totalData, error: totalError } = await query.single();

    if (totalError) {
      console.error("Error fetching total contacts count from options:", totalError);
      throw totalError;
    }

    console.log("Total contacts from options:", totalData?.numeric);

    let invalidQuery = supabase
      .from('AppW_Contatos')
      .select('*', { count: 'exact', head: true })
      .eq('Invalido', 'Invalido');
    
    if (companyId) {
      invalidQuery = invalidQuery.eq('empresa_id', companyId);
    }
    
    const { count: invalid, error: invalidError } = await invalidQuery;

    if (invalidError) {
      console.error("Error fetching invalid contacts:", invalidError);
      throw invalidError;
    }

    console.log("Invalid contacts count:", invalid);
    
    return {
      total: totalData?.numeric ?? 0,
      invalid: invalid ?? 0
    };
  } catch (error) {
    console.error("Erro ao buscar estatísticas de contatos:", error);
    throw error;
  }
};

export const DashboardStats: React.FC = () => {
  const { user, selectedCompany } = useAuth();
  const companyId = user?.role === 'master' ? selectedCompany : user?.company_id;
  
  const { data: contactsStats, isLoading, error, refetch } = useQuery({
    queryKey: ['contactsStats', companyId],
    queryFn: () => fetchContactsStats(companyId),
    staleTime: 60000,
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
      <div className="flex justify-end">
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
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <StatCard
          title="Número de Contatos"
          value={contactsStats?.total ?? 0}
          icon={Users}
          description="Total de contatos na base"
          isLoading={isLoading}
        />
        <StatCard
          title="Inválidos"
          value={contactsStats?.invalid ?? 0}
          icon={AlertTriangle}
          description="Contatos com Invalido='Invalido'"
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};
