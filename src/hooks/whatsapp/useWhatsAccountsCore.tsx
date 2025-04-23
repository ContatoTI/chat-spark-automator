
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
      
      // Adicionar logs mais detalhados para depuração
      console.log("Contas de WhatsApp obtidas:", result);
      
      if (result && result.length > 0) {
        console.log("Status das contas:");
        result.forEach(account => {
          console.log(`  - ${account.nome_instancia}: ${account.status} (conectado: ${["connected", "open", "opened"].includes(account.status?.toLowerCase() || "")})`);
        });
      } else {
        console.log("Nenhuma conta de WhatsApp encontrada");
      }
      
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
