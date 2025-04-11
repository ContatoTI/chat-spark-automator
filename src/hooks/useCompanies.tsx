
import { useQuery } from "@tanstack/react-query";
import { fetchCompanies } from "@/lib/api/companies";
import { useState } from "react";

export const useCompanies = () => {
  const [retryCount, setRetryCount] = useState(0);

  const { 
    data: companies, 
    isLoading, 
    error,
    isError
  } = useQuery({
    queryKey: ['companies', retryCount],
    queryFn: fetchCompanies,
    refetchOnWindowFocus: false,
    retry: 1,
    staleTime: 10000,
  });

  // Função para forçar uma atualização ao alterar a chave de consulta
  const forceRefresh = () => {
    setRetryCount(prev => prev + 1);
  };

  return {
    companies: companies || [],
    isLoading,
    error,
    refetch: forceRefresh,
    isError
  };
};
