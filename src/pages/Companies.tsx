
import React from "react";
import { Layout } from "@/components/layout/Layout";
import { CompaniesHeader } from "@/components/companies/CompaniesHeader";
import { CompaniesTable } from "@/components/companies/CompaniesTable";
import { useCompanies } from "@/hooks/useCompanies";
import { toast } from "sonner";

const Companies = () => {
  const { companies, isLoading, error, refetch, isError } = useCompanies();

  // Função para forçar uma atualização dos dados
  const handleRefresh = () => {
    toast.info("Atualizando lista de empresas...");
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
