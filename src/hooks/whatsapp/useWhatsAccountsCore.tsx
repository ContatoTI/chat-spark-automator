
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getWhatsAccounts } from "@/lib/api/whatsapp/api";
import { toast } from "sonner";
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
    queryFn: () => getWhatsAccounts(user, selectedCompany),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  return {
    accounts,
    isLoading,
    error,
    refetchAccounts,
    queryClient,
  };
};
