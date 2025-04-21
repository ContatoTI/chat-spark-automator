
import { useMutation } from "@tanstack/react-query";
import { disconnectInstance, deleteInstance, createInstance } from "@/lib/api/whatsapp/webhook";
import { createWhatsAccount, deleteWhatsAccount } from "@/lib/api/whatsapp/api";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

export const useWhatsAccountStatus = (queryClient: any) => {
  const { user, selectedCompany } = useAuth();
  
  // Create account mutation
  const createAccountMutation = useMutation({
    mutationFn: async (data: { nome_instancia: string }) => {
      let empresa_id: string;
      
      if (user?.role === 'master' && selectedCompany) {
        empresa_id = selectedCompany;
      } else if (user?.company_id) {
        empresa_id = user.company_id;
      } else {
        throw new Error("Empresa não identificada");
      }
      
      const newAccount = await createWhatsAccount({ 
        nome_instancia: data.nome_instancia, 
        empresa_id 
      }, empresa_id);
      
      await createInstance(data.nome_instancia, empresa_id);
      
      return newAccount;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['whatsapp-accounts'] });
      toast.success("Conta criada com sucesso");
    },
    onError: (error) => {
      toast.error("Erro ao criar conta", {
        description: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // Delete account mutation
  const deleteAccountMutation = useMutation({
    mutationFn: async (params: { id: number, nomeInstancia: string }) => {
      await deleteInstance(params.nomeInstancia);
      await deleteWhatsAccount(params.id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['whatsapp-accounts'] });
      toast.success("Conta excluída com sucesso");
    },
    onError: (error) => {
      toast.error("Erro ao excluir conta", {
        description: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // Disconnect account mutation
  const disconnectAccountMutation = useMutation({
    mutationFn: async (params: { id: number, nomeInstancia: string }) => {
      await disconnectInstance(params.nomeInstancia);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['whatsapp-accounts'] });
      toast.success("Conta desconectada com sucesso");
    },
    onError: (error) => {
      toast.error("Erro ao desconectar conta", {
        description: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  return {
    createAccount: createAccountMutation.mutate,
    deleteAccount: deleteAccountMutation.mutate,
    disconnectAccount: disconnectAccountMutation.mutate,
    isCreating: createAccountMutation.isPending,
    isDeleting: deleteAccountMutation.isPending,
    isDisconnecting: disconnectAccountMutation.isPending
  };
};
