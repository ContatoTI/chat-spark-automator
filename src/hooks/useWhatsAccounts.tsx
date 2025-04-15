
import { useState } from "react";
import { useWhatsAccountsCore } from "./whatsapp/useWhatsAccountsCore";
import { useWhatsAccountConnection } from "./whatsapp/useWhatsAccountConnection";
import { useWhatsAccountStatus } from "./whatsapp/useWhatsAccountStatus";
import { useMutation } from "@tanstack/react-query";
import { fetchInstanceStatus, mapStatusToText } from "@/lib/api/whatsapp/webhook";
import { toast } from "sonner";

export const useWhatsAccounts = () => {
  const [processingInstanceId, setProcessingInstanceId] = useState<number | null>(null);
  const { accounts, isLoading, error, refetchAccounts, queryClient } = useWhatsAccountsCore();
  const connection = useWhatsAccountConnection();
  const status = useWhatsAccountStatus(queryClient);

  // Check accounts status mutation
  const refreshStatusMutation = useMutation({
    mutationFn: async () => {
      const statusPromises = accounts.map(account => 
        fetchInstanceStatus(account.nome_instancia)
      );
      return Promise.all(statusPromises);
    },
    onSuccess: () => {
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

  const connectAccount = async (id: number, nomeInstancia: string) => {
    setProcessingInstanceId(id);
    return connection.connectAccount({ id, nomeInstancia });
  };

  const disconnectAccount = async (id: number, nomeInstancia: string) => {
    setProcessingInstanceId(id);
    return status.disconnectAccount({ id, nomeInstancia });
  };

  const refreshAccountsStatus = async () => {
    return refreshStatusMutation.mutate();
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
    refreshAccounts: refetchAccounts,
    refreshAccountsStatus,
    isRefreshing: refreshStatusMutation.isPending,
    qrCodeData: connection.qrCodeData,
    qrCodeDialogOpen: connection.qrCodeDialogOpen,
    currentInstance: connection.currentInstance,
    closeQrCodeDialog: connection.closeQrCodeDialog,
    getStatusInfo,
  };
};
