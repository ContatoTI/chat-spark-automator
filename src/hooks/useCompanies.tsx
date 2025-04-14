
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchCompanies } from "@/lib/api/companies";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";

export const useCompanies = () => {
  const [retryCount, setRetryCount] = useState(0);
  const queryClient = useQueryClient();
  const { selectedCompany } = useAuth();

  // Efeito para ouvir por mudanças de empresa
  useEffect(() => {
    const handleCompanyChange = () => {
      setRetryCount(prev => prev + 1);
    };

    window.addEventListener('company-changed', handleCompanyChange);
    return () => {
      window.removeEventListener('company-changed', handleCompanyChange);
    };
  }, []);

  const { 
    data: companies, 
    isLoading, 
    error,
    isError
  } = useQuery({
    queryKey: ['companies', retryCount, selectedCompany],
    queryFn: fetchCompanies,
    refetchOnWindowFocus: false,
    retry: 1,
    staleTime: 10000,
  });

  // Função para forçar uma atualização ao alterar a chave de consulta
  const forceRefresh = () => {
    setRetryCount(prev => prev + 1);
    queryClient.invalidateQueries({ queryKey: ['companies'] });
  };

  return {
    companies: companies || [],
    isLoading,
    error,
    refetch: forceRefresh,
    isError
  };
};
