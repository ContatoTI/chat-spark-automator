
import { useState } from "react";
import { useWhatsAccountsCore } from "./whatsapp/useWhatsAccountsCore";
import { useWhatsAccountConnection } from "./whatsapp/useWhatsAccountConnection";
import { useWhatsAccountStatus } from "./whatsapp/useWhatsAccountStatus";
import { useMutation } from "@tanstack/react-query";
import { fetchAllInstancesStatus, fetchInstanceStatus } from "@/lib/api/whatsapp/status";
import { mapStatusToText } from "@/lib/api/whatsapp/utils";
import { toast } from "sonner";

export const useWhatsAccounts = () => {
  const [processingInstanceId, setProcessingInstanceId] = useState<string | null>(null);
  const { accounts, isLoading, error, refetchAccounts, queryClient } = useWhatsAccountsCore();
  const connection = useWhatsAccountConnection();
  const status = useWhatsAccountStatus(queryClient);

  // Check all accounts status mutation - usando uma única chamada de API
  const refreshStatusMutation = useMutation({
    mutationFn: async () => {
      console.log('[Webhook] Atualizando status de todas as instâncias em uma única chamada');
      const response = await fetchAllInstancesStatus();
      
      if (!response.success) {
        console.error('[Webhook] Erro na resposta do webhook:', response);
        throw new Error('Formato de resposta inválido do webhook');
      }
      
      // Log das instâncias retornadas pelo webhook
      console.log('[Webhook] Instâncias retornadas:', response.data?.map(i => i.name));
      
      // Forçar uma atualização completa dos dados após atualizar os status
      return response.data;
    },
    onSuccess: (data) => {
      console.log('[Webhook] Status de todas as instâncias atualizado com sucesso:', data);
      // Recarregar os dados do banco após a atualização dos status
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

  // Mutation para atualizar status de uma única instância
  const updateSingleStatusMutation = useMutation({
    mutationFn: async (instanceName: string) => {
      console.log(`Atualizando status da instância: ${instanceName}`);
      const newStatus = await fetchInstanceStatus(instanceName);
      
      // Não precisamos atualizar manualmente os dados aqui, o banco já foi atualizado
      // dentro da função fetchInstanceStatus
      
      return { instanceName, status: newStatus };
    },
    onSuccess: (data) => {
      console.log(`Status da instância ${data.instanceName} atualizado para: ${data.status}`);
      
      // Recarregar os dados do banco após a atualização do status
      queryClient.invalidateQueries({ queryKey: ['whatsapp-accounts'] });
      
      toast.success(`Status da instância atualizado: ${data.status}`);
    },
    onError: (error) => {
      console.error("Erro ao atualizar status da instância:", error);
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

  const deleteAccount = async (id: string, nomeInstancia: string) => {
    setProcessingInstanceId(id);
    return status.deleteAccount({ id, nomeInstancia });
  };

  const connectAccount = async (id: string, nomeInstancia: string, webhookUrl: string) => {
    setProcessingInstanceId(id);
    return connection.connectAccount({ id, nomeInstancia, webhookUrl });
  };

  const disconnectAccount = async (id: string, nomeInstancia: string) => {
    setProcessingInstanceId(id);
    return status.disconnectAccount({ id, nomeInstancia });
  };

  // Função para atualizar o status de uma única instância
  const updateInstanceStatus = async (instanceName: string) => {
    return updateSingleStatusMutation.mutateAsync(instanceName);
  };

  // Função para atualizar o status de todas as instâncias
  const refreshAccounts = async () => {
    try {
      await refreshStatusMutation.mutateAsync();
    } catch (error) {
      console.error("Erro ao atualizar contas:", error);
    }
  };

  // Create a record of processing status by instance ID
  const processingStatus: { [id: string]: string } = {};
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

  // Log adicional para debugging
  console.log("Todas as contas disponíveis:", accounts);
  console.log("Contas com status 'open' ou 'connected':", 
    accounts.filter(account => 
      ["connected", "open", "opened", "CONNECTED", "OPEN", "OPENED"].includes(account.status?.toLowerCase() || "")
    )
  );

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
    isRefreshing: refreshStatusMutation.isPending || updateSingleStatusMutation.isPending,
    qrCodeData: connection.qrCodeData,
    qrCodeDialogOpen: connection.qrCodeDialogOpen,
    currentInstance: connection.currentInstance,
    closeQrCodeDialog: connection.closeQrCodeDialog,
    getStatusInfo,
    updateInstanceStatus, // Adicionado para atualizar uma única instância
  };
};
