
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

  return {
    accounts,
    isLoading,
    error,
    createAccount: status.createAccount,
    deleteAccount: status.deleteAccount,
    connectAccount: connection.connectAccount,
    disconnectAccount: status.disconnectAccount,
    isCreating: status.isCreating,
    isProcessing: processingStatus,
    refreshAccounts: refetchAccounts,
    refreshAccountsStatus: refreshStatusMutation.mutate,
    isRefreshing: refreshStatusMutation.isPending,
    qrCodeData: connection.qrCodeData,
    qrCodeDialogOpen: connection.qrCodeDialogOpen,
    currentInstance: connection.currentInstance,
    closeQrCodeDialog: connection.closeQrCodeDialog,
    getStatusInfo: mapStatusToText,
  };
};
