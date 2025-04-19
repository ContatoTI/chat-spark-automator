
import { useState } from "react";
import { useWhatsAccountsCore } from "./whatsapp/useWhatsAccountsCore";
import { useWhatsAccountConnection } from "./whatsapp/useWhatsAccountConnection";
import { useWhatsAccountStatus } from "./whatsapp/useWhatsAccountStatus";
import { useMutation } from "@tanstack/react-query";
import { fetchAllInstancesStatus } from "@/lib/api/whatsapp/status";
import { mapStatusToText } from "@/lib/api/whatsapp/utils";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";

export const useWhatsAccounts = () => {
  const [processingInstanceId, setProcessingInstanceId] = useState<number | null>(null);
  const { accounts, isLoading, error, refetchAccounts, queryClient } = useWhatsAccountsCore();
  const connection = useWhatsAccountConnection();
  const status = useWhatsAccountStatus(queryClient);

  // Check all accounts status mutation - usando uma única chamada de API
  const refreshStatusMutation = useMutation({
    mutationFn: async () => {
      console.log('[Webhook] Atualizando status de todas as instâncias em uma única chamada');
      const response = await fetchAllInstancesStatus();
      
      if (!response.success || !response.data || !Array.isArray(response.data)) {
        console.error('[Webhook] Erro na resposta do webhook:', response);
        throw new Error('Formato de resposta inválido do webhook');
      }
      
      // Log das instâncias retornadas pelo webhook
      console.log('[Webhook] Instâncias retornadas:', response.data.map(i => i.name));
      
      // Temos que atualizar o banco de dados para cada instância
      if (accounts && accounts.length > 0) {
        // Para cada instância nas contas, vamos tentar encontrar seu status na resposta
        const updatePromises = accounts.map(async (account) => {
          // Buscar o status correspondente no array de resposta
          const instanceStatus = response.data?.find(
            instance => instance.name === account.nome_instancia
          );
          
          if (instanceStatus && instanceStatus.connectionStatus) {
            console.log(`[Webhook] Atualizando status da instância ${account.nome_instancia} para ${instanceStatus.connectionStatus}`);
            
            // Atualizar o banco de dados
            const { error } = await supabase
              .from('AppW_Instancias')
              .update({ status: instanceStatus.connectionStatus })
              .eq('nome_instancia', account.nome_instancia);
            
            if (error) {
              console.error(`[Webhook] Erro ao atualizar o status da instância ${account.nome_instancia}:`, error);
            }
            
            // Retornar conta com status atualizado para o cache
            return { ...account, status: instanceStatus.connectionStatus };
          }
          
          // Se não encontrou, manter o status atual
          return account;
        });
        
        // Esperar todas as atualizações de banco terminarem
        const updatedAccounts = await Promise.all(updatePromises);
        
        console.log('[Webhook] Contas atualizadas:', updatedAccounts);
        
        // Atualizar o cache do React Query
        queryClient.setQueryData(['whatsapp-accounts'], updatedAccounts);
      }
      
      return response.data;
    },
    onSuccess: (data) => {
      console.log('[Webhook] Status de todas as instâncias atualizado com sucesso:', data);
      queryClient.invalidateQueries({ queryKey: ['whatsapp-accounts'] });
      toast.success("Status das contas atualizado");
    },
    onError: (error) => {
      console.error("Error refreshing accounts status:", error);
      toast.error("Erro ao atualizar status", {
        description: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // Create wrappers to match expected Promise<void> return types
  const createAccount = async (data: { nome_instancia: string }) => {
    setProcessingInstanceId(null);
    return status.createAccount(data);
  };

  const deleteAccount = async (id: number, nomeInstancia: string) => {
    setProcessingInstanceId(id);
    return status.deleteAccount({ id, nomeInstancia });
  };

  const connectAccount = async (id: number, nomeInstancia: string, webhookUrl: string) => {
    setProcessingInstanceId(id);
    return connection.connectAccount({ id, nomeInstancia, webhookUrl });
  };

  const disconnectAccount = async (id: number, nomeInstancia: string) => {
    setProcessingInstanceId(id);
    return status.disconnectAccount({ id, nomeInstancia });
  };

  const refreshAccounts = async () => {
    try {
      await refreshStatusMutation.mutateAsync();
      // Garante que os dados são atualizados após a mutação
      await queryClient.invalidateQueries({ queryKey: ['whatsapp-accounts'] });
    } catch (error) {
      console.error("Erro ao atualizar contas:", error);
    }
  };

  // Create a record of processing status by instance ID
  const processingStatus: { [id: number]: string } = {};
  if (processingInstanceId) {
    if (connection.isConnecting) {
      processingStatus[processingInstanceId] = 'connecting';
    } else if (status.isDisconnecting) {
      processingStatus[processingInstanceId] = 'disconnecting';
    } else if (status.isDeleting) {
      processingStatus[processingInstanceId] = 'deleting';
    }
  }

  // Adapt the mapStatusToText to match the expected signature
  const getStatusInfo = (status: string) => {
    const statusInfo = mapStatusToText(status);
    return {
      label: statusInfo.text,
      color: statusInfo.color,
      bgColor: statusInfo.color === "green" ? "bg-green-100" :
               statusInfo.color === "red" ? "bg-red-100" :
               statusInfo.color === "yellow" ? "bg-yellow-100" : "bg-gray-100"
    };
  };

  return {
    accounts,
    isLoading,
    error,
    createAccount,
    deleteAccount,
    connectAccount,
    disconnectAccount,
    isCreating: status.isCreating,
    isProcessing: processingStatus,
    refreshAccounts,
    isRefreshing: refreshStatusMutation.isPending,
    qrCodeData: connection.qrCodeData,
    qrCodeDialogOpen: connection.qrCodeDialogOpen,
    currentInstance: connection.currentInstance,
    closeQrCodeDialog: connection.closeQrCodeDialog,
    getStatusInfo,
  };
};
