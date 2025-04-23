
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getWhatsAccounts } from "@/lib/api/whatsapp/api";
import { useAuth } from "@/contexts/AuthContext";

export const useWhatsAccountsCore = () => {
  const queryClient = useQueryClient();
  const { user, selectedCompany } = useAuth();

  const { 
    data: accounts = [], 
    isLoading, 
    error,
    refetch: refetchAccounts
  } = useQuery({
    queryKey: ['whatsapp-accounts', user?.id, selectedCompany],
    queryFn: async () => {
      console.log("Buscando contas de WhatsApp com filtros - User:", user?.role, "Empresa:", selectedCompany);
      const result = await getWhatsAccounts(user, selectedCompany);
      console.log("Contas de WhatsApp obtidas:", result);
      return result;
    },
    staleTime: 1000 * 5, // 5 segundos
    refetchInterval: 1000 * 10 // Atualizar a cada 10 segundos
  });

  return {
    accounts,
    isLoading,
    error,
    refetchAccounts,
    queryClient,
  };
};
