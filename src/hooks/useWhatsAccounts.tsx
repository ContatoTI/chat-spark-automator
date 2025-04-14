
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getWhatsAccounts, createWhatsAccount, deleteWhatsAccount } from "@/lib/api/whatsapp/api";
import { WhatsAccount } from "@/lib/api/whatsapp/types";
import { 
  generateQRCodeData, 
  fetchInstanceStatus, 
  mapStatusToText, 
  isInstanceConnected,
  disconnectInstance,
  deleteInstance,
  createInstance
} from "@/lib/api/whatsapp/webhook";
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
    mutationFn: async (data: { nome_instancia: string }) => {
      // Determine empresa_id based on user role and selected company
      let empresa_id: string;
      
      if (user?.role === 'master' && selectedCompany) {
        empresa_id = selectedCompany;
      } else if (user?.company_id) {
        empresa_id = user.company_id;
      } else {
        throw new Error("Empresa não identificada. Selecione uma empresa ou verifique suas permissões.");
      }

      console.log(`Criando conta com empresa_id: ${empresa_id}`);
      
      // Primeiro criar no banco local
      const newAccount = await createWhatsAccount({ 
        nome_instancia: data.nome_instancia, 
        empresa_id 
      }, user, selectedCompany);
      
      // Depois chamar o webhook para criar a instância no serviço externo
      await createInstance(data.nome_instancia, empresa_id);
      
      return newAccount;
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
    mutationFn: async (params: { id: number, nomeInstancia: string }) => {
      setProcessingInstanceId(params.id);
      // Primeiro tentar excluir via webhook
      await deleteInstance(params.nomeInstancia);
      // Depois excluir do banco local
      await deleteWhatsAccount(params.id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['whatsapp-accounts'] });
      toast.success("Conta excluída com sucesso");
      setProcessingInstanceId(null);
    },
    onError: (error) => {
      console.error("Error deleting account:", error);
      toast.error("Erro ao excluir conta", {
        description: error instanceof Error ? error.message : "Unknown error"
      });
      setProcessingInstanceId(null);
    }
  });

  // Connect account mutation
  const connectAccountMutation = useMutation({
    mutationFn: async (params: { id: number, nomeInstancia: string }) => {
      setProcessingInstanceId(params.id);
      const data = await generateQRCodeData(params.nomeInstancia);
      return { qrCodeData: data, instanceName: params.nomeInstancia };
    },
    onSuccess: (data) => {
      setQrCodeData(data.qrCodeData);
      setCurrentInstance(data.instanceName);
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
    mutationFn: async (params: { id: number, nomeInstancia: string }) => {
      setProcessingInstanceId(params.id);
      await disconnectInstance(params.nomeInstancia);
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
  const createAccount = async (data: { nome_instancia: string }) => {
    return createAccountMutation.mutate(data);
  };

  const deleteAccount = async (id: number, nomeInstancia: string) => {
    return deleteAccountMutation.mutate({ id, nomeInstancia });
  };

  const connectAccount = async (id: number, nomeInstancia: string) => {
    return connectAccountMutation.mutate({ id, nomeInstancia });
  };

  const disconnectAccount = async (id: number, nomeInstancia: string) => {
    return disconnectAccountMutation.mutate({ id, nomeInstancia });
  };

  const refreshAccountsStatus = async () => {
    return refreshStatusMutation.mutate();
  };

  const closeQrCodeDialog = () => {
    setQrCodeDialogOpen(false);
    setQrCodeData(null);
    setCurrentInstance(null);
  };

  // Create a record of processing status by instance ID
  const processingStatus: { [id: number]: string } = {};
  if (processingInstanceId) {
    if (connectAccountMutation.isPending) {
      processingStatus[processingInstanceId] = 'connecting';
    } else if (disconnectAccountMutation.isPending) {
      processingStatus[processingInstanceId] = 'disconnecting';
    } else if (deleteAccountMutation.isPending) {
      processingStatus[processingInstanceId] = 'deleting';
    }
  }

  const getStatusInfo = (status: string | null) => {
    const result = mapStatusToText(status);
    return {
      label: result.text,
      color: `text-${result.color}-500`,
      bgColor: `bg-${result.color}-50 dark:bg-${result.color}-900/20`,
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
    isCreating: createAccountMutation.isPending,
    isProcessing: processingStatus,
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
