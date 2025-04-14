
import React, { useEffect } from "react";
import { Layout } from "@/components/layout/Layout";
import { CompaniesHeader } from "@/components/companies/CompaniesHeader";
import { CompaniesTable } from "@/components/companies/CompaniesTable";
import { useCompanies } from "@/hooks/useCompanies";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { useQueryClient } from "@tanstack/react-query";

const Companies = () => {
  const { companies, isLoading, error, refetch, isError } = useCompanies();
  const { selectedCompany } = useAuth();
  const queryClient = useQueryClient();
  
  // Limpar cache de configurações quando mudar a página para garantir
  // que carregamos os dados atualizados para cada empresa
  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: ['company-settings'] });
  }, [queryClient]);

  // Se houver uma mudança na empresa selecionada, recarregar os dados
  useEffect(() => {
    if (selectedCompany) {
      refetch();
    }
  }, [selectedCompany, refetch]);

  // Função para forçar uma atualização dos dados
  const handleRefresh = () => {
    toast.info("Atualizando lista de empresas...");
    // Invalidar todas as queries relacionadas a empresas
    queryClient.invalidateQueries({ queryKey: ['companies'] });
    queryClient.invalidateQueries({ queryKey: ['company-settings'] });
    refetch();
  };

  // Se houver erro, mostra uma toast
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
        <CompaniesHeader onRefresh={handleRefresh} />
        <CompaniesTable 
          companies={companies} 
          isLoading={isLoading} 
          error={error} 
          refetch={handleRefresh} 
        />
      </div>
    </Layout>
  );
};

export default Companies;
