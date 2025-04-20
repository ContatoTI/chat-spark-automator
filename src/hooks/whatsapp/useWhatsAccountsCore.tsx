
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getWhatsAccounts } from "@/lib/api/whatsapp/api";
import { useAuth } from "@/contexts/AuthContext";
import { WhatsAccount } from "@/lib/api/whatsapp/types";

export const useWhatsAccountsCore = () => {
  const queryClient = useQueryClient();
  const { user, selectedCompany } = useAuth();

  // Fetch accounts with company filtering
  const { 
    data: accounts = [], 
    isLoading, 
    error,
    refetch: refetchAccounts
  } = useQuery({
    queryKey: ['whatsapp-accounts', user?.id, selectedCompany],
    queryFn: async () => {
      console.log("Buscando contas de WhatsApp com filtros - User:", user?.role, "Empresa:", selectedCompany);
      return getWhatsAccounts(user, selectedCompany);
    },
    staleTime: 1000 * 15, // 15 segundos - reduzido para atualizar mais frequentemente
    refetchInterval: 1000 * 30 // Atualizar a cada 30 segundos automaticamente
  });

  return {
    accounts,
    isLoading,
    error,
    refetchAccounts,
    queryClient,
  };
};
