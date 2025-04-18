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
  const { selectedCompany } = useAuth();
  const queryClient = useQueryClient();
  const [showLogs, setShowLogs] = useState(true);
  const [apiLogs, setApiLogs] = useState<Array<{ timestamp: string; data: any }>>([]);
  
  const addApiLog = (data: any) => {
    setApiLogs(prev => [...prev, {
      timestamp: new Date().toISOString(),
      data
    }]);
  };

  useEffect(() => {
    if (companies) {
      addApiLog({
        type: 'FETCH_COMPANIES',
        companies
      });
    }
  }, [companies]);

  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: ['company-settings'] });
  }, [queryClient]);

  useEffect(() => {
    if (selectedCompany) {
      refetch();
    }
  }, [selectedCompany, refetch]);

  const handleRefresh = () => {
    toast.info("Atualizando lista de empresas...");
    queryClient.invalidateQueries({ queryKey: ['companies'] });
    queryClient.invalidateQueries({ queryKey: ['company-settings'] });
    refetch();
  };

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
          onApiResponse={addApiLog}
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
