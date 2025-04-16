
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchCompanies } from "@/lib/api/companies";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";

export const useCompanies = () => {
  const [retryCount, setRetryCount] = useState(0);
  const queryClient = useQueryClient();
  const { selectedCompany, isMaster } = useAuth();

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
    queryFn: async () => {
      console.log("Executando fetchCompanies com empresa:", selectedCompany);
      const result = await fetchCompanies(selectedCompany);
      console.log("Resultado fetchCompanies:", result);
      return result;
    },
    refetchOnWindowFocus: false,
    retry: 1,
    staleTime: 300000, // 5 minutos
    gcTime: 600000, // 10 minutos,
    // Não mostrar loading se não houver empresa selecionada
    enabled: !!selectedCompany
  });

  const forceRefresh = () => {
    setRetryCount(prev => prev + 1);
    queryClient.invalidateQueries({ queryKey: ['companies'] });
  };

  return {
    companies: companies || [],
    isLoading: isLoading && !!selectedCompany, // Only show loading if there's a selected company
    error,
    refetch: forceRefresh,
    isError
  };
};
