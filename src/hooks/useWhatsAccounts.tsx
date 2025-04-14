
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getWhatsAccounts, createWhatsAccount, deleteWhatsAccount } from "@/lib/api/whatsapp/api";
import { WhatsAccount } from "@/lib/api/whatsapp/types";
import { generateQRCodeData, fetchInstanceStatus } from "@/lib/api/whatsapp/webhook";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

export const useWhatsAccounts = () => {
  const [qrCodeData, setQrCodeData] = useState<string | null>(null);
  const [qrCodeDialogOpen, setQrCodeDialogOpen] = useState(false);
  const [currentInstance, setCurrentInstance] = useState<string | null>(null);
  const [processingInstanceId, setProcessingInstanceId] = useState<number | null>(null);
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

  // Create account mutation
  const createAccountMutation = useMutation({
    mutationFn: () => {
      const randomId = Math.floor(Math.random() * 10000);
      return createWhatsAccount({ 
        nome_instancia: `instance_${randomId}` 
      }, user, selectedCompany);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['whatsapp-accounts'] });
      toast.success("Conta criada com sucesso");
    },
    onError: (error) => {
      console.error("Error creating account:", error);
      toast.error("Erro ao criar conta", {
        description: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // Delete account mutation
  const deleteAccountMutation = useMutation({
    mutationFn: deleteWhatsAccount,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['whatsapp-accounts'] });
      toast.success("Conta excluída com sucesso");
    },
    onError: (error) => {
      console.error("Error deleting account:", error);
      toast.error("Erro ao excluir conta", {
        description: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // Connect account mutation
  const connectAccountMutation = useMutation({
    mutationFn: async (instanceId: string) => {
      const data = await generateQRCodeData(instanceId);
      return data;
    },
    onSuccess: (data, instanceId) => {
      setQrCodeData(data);
      setCurrentInstance(instanceId);
      setQrCodeDialogOpen(true);
      setProcessingInstanceId(null);
    },
    onError: (error) => {
      console.error("Error connecting account:", error);
      toast.error("Erro ao conectar conta", {
        description: error instanceof Error ? error.message : "Unknown error"
      });
      setProcessingInstanceId(null);
    }
  });

  // Disconnect account mutation
  const disconnectAccountMutation = useMutation({
    mutationFn: async (id: number) => {
      // In a real app, this would call an API to disconnect
      return new Promise<void>((resolve) => {
        setTimeout(resolve, 1000);
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['whatsapp-accounts'] });
      toast.success("Conta desconectada com sucesso");
      setProcessingInstanceId(null);
    },
    onError: (error) => {
      console.error("Error disconnecting account:", error);
      toast.error("Erro ao desconectar conta", {
        description: error instanceof Error ? error.message : "Unknown error"
      });
      setProcessingInstanceId(null);
    }
  });

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

  // Handler functions
  const createAccount = () => {
    createAccountMutation.mutate();
  };

  const deleteAccount = (id: number) => {
    deleteAccountMutation.mutate(id);
  };

  const connectAccount = (account: WhatsAccount) => {
    setProcessingInstanceId(account.id);
    connectAccountMutation.mutate(account.nome_instancia);
  };

  const disconnectAccount = (id: number) => {
    setProcessingInstanceId(id);
    disconnectAccountMutation.mutate(id);
  };

  const refreshAccountsStatus = () => {
    refreshStatusMutation.mutate();
  };

  const closeQrCodeDialog = () => {
    setQrCodeDialogOpen(false);
    setQrCodeData(null);
    setCurrentInstance(null);
  };

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'connected':
        return {
          label: 'Conectado',
          color: 'text-green-500',
          bgColor: 'bg-green-50 dark:bg-green-900/20',
        };
      case 'disconnected':
        return {
          label: 'Desconectado',
          color: 'text-red-500',
          bgColor: 'bg-red-50 dark:bg-red-900/20',
        };
      case 'connecting':
        return {
          label: 'Conectando',
          color: 'text-amber-500',
          bgColor: 'bg-amber-50 dark:bg-amber-900/20',
        };
      default:
        return {
          label: 'Desconhecido',
          color: 'text-slate-500',
          bgColor: 'bg-slate-50 dark:bg-slate-800',
        };
    }
  };

  return {
    accounts,
    isLoading,
    error,
    createAccount,
    deleteAccount,
    connectAccount,
    disconnectAccount,
    isCreating: createAccountMutation.isPending,
    isProcessing: Boolean(processingInstanceId),
    refreshAccounts: refetchAccounts,
    refreshAccountsStatus,
    isRefreshing: refreshStatusMutation.isPending,
    qrCodeData,
    qrCodeDialogOpen,
    currentInstance,
    closeQrCodeDialog,
    getStatusInfo
  };
};
