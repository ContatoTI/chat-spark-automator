
import React, { useEffect, useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { CompaniesHeader } from "@/components/companies/CompaniesHeader";
import { CompaniesTable } from "@/components/companies/CompaniesTable";
import { useCompanies } from "@/hooks/useCompanies";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { useQueryClient } from "@tanstack/react-query";
import { LogWindow } from "@/components/debug/LogWindow";

const Companies = () => {
  const { companies, isLoading, error, refetch, isError } = useCompanies();
  const { selectedCompany, isMaster } = useAuth();
  const queryClient = useQueryClient();
  const [showLogs, setShowLogs] = useState(true);
  const [apiLogs, setApiLogs] = useState<Array<{ timestamp: string; data: any }>>([]);
  
  const addApiLog = (data: any) => {
    setApiLogs(prev => [...prev, {
      timestamp: new Date().toISOString(),
      data
    }]);
  };

  // Log when companies data changes
  useEffect(() => {
    if (companies) {
      addApiLog({
        type: 'FETCH_COMPANIES',
        count: companies.length,
        companies
      });
    }
  }, [companies]);

  // Log when component mounts to debug loading issues
  useEffect(() => {
    console.log("Companies component mounted, isMaster:", isMaster, "selectedCompany:", selectedCompany);
    addApiLog({
      type: 'COMPONENT_MOUNTED',
      isMaster,
      selectedCompany,
      timestamp: new Date().toISOString()
    });
  }, []);

  // Evitar chamadas repetidas durante a montagem do componente
  const handleRefresh = () => {
    toast.info("Atualizando lista de empresas...");
    queryClient.invalidateQueries({ queryKey: ['companies'] });
    queryClient.invalidateQueries({ queryKey: ['company-settings'] });
    refetch();
  };

  // Tratamento de erros
  React.useEffect(() => {
    if (error) {
      console.error("Erro ao carregar empresas:", error);
      toast.error("Erro ao carregar empresas", {
        description: error instanceof Error ? error.message : "Tente novamente mais tarde"
      });
    }
  }, [error]);

  return (
    <Layout>
      <div className="flex flex-col gap-8">
        <CompaniesHeader 
          onRefresh={handleRefresh} 
          onToggleLogs={() => setShowLogs(prev => !prev)}
          showLogs={showLogs}
        />
        <CompaniesTable 
          companies={companies} 
          isLoading={isLoading} 
          error={error} 
          refetch={handleRefresh}
        />
        {showLogs && (
          <LogWindow 
            title="API Logs" 
            logs={apiLogs}
            onClose={() => setShowLogs(false)}
          />
        )}
      </div>
    </Layout>
  );
};

export default Companies;
