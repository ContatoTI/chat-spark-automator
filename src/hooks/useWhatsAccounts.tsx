
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { WhatsAccount } from "@/lib/api/whatsapp/types";
import { getWhatsAccounts, createWhatsAccount, deleteWhatsAccount } from "@/lib/api/whatsapp/api";
import { getWebhookInstanciasUrl, extractQrCodeFromResponse, mapStatusToText } from "@/lib/api/whatsapp/webhook";
import { callWebhook } from "@/lib/api/webhook-utils";
import { toast } from "sonner";

export function useWhatsAccounts() {
  const [accounts, setAccounts] = useState<WhatsAccount[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isProcessing, setIsProcessing] = useState<{[id: number]: string}>({});
  const [qrCodeData, setQrCodeData] = useState<string | null>(null);
  const [qrCodeDialogOpen, setQrCodeDialogOpen] = useState(false);
  const [currentInstance, setCurrentInstance] = useState<string>("");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { toast: uiToast } = useToast();

  const fetchAccounts = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      console.log("Iniciando busca de contas...");
      const data = await getWhatsAccounts();
      console.log("Contas obtidas:", data);
      
      setAccounts(data);
    } catch (err) {
      console.error("Erro completo:", err);
      setError(err instanceof Error ? err : new Error('Erro desconhecido ao carregar contas'));
      uiToast({
        title: "Erro",
        description: err instanceof Error ? err.message : "Não foi possível carregar as contas de WhatsApp",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const refreshAccountsStatus = async () => {
    try {
      setIsRefreshing(true);
      
      // Get webhook URL
      const webhookUrl = await getWebhookInstanciasUrl();
      
      if (!webhookUrl) {
        toast.error("Erro ao atualizar status", {
          description: "URL do webhook não configurada"
        });
        return;
      }
      
      // Call webhook for status update
      const webhookResult = await callWebhook(webhookUrl, {
        acao: 'status'
      });
      
      if (!webhookResult.success) {
        toast.error("Erro ao atualizar status", {
          description: webhookResult.message || "Não foi possível atualizar o status das instâncias"
        });
        return;
      }
      
      // Refresh accounts data from database
      await fetchAccounts();
      
      toast.success("Status atualizado", {
        description: "Status de todas as instâncias atualizado com sucesso"
      });
    } catch (err) {
      console.error("Erro ao atualizar status:", err);
      toast.error("Erro ao atualizar status", {
        description: err instanceof Error ? err.message : "Não foi possível atualizar o status das instâncias"
      });
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleCreateAccount = async (data: { nome_instancia: string }) => {
    try {
      setIsCreating(true);
      
      // Call the webhook
      const webhookUrl = await getWebhookInstanciasUrl();
      
      if (!webhookUrl) {
        uiToast({
          title: "Erro",
          description: "URL do webhook de instâncias não configurada",
          variant: "destructive",
        });
        return Promise.reject(new Error("URL do webhook de instâncias não configurada"));
      }
      
      const webhookResult = await callWebhook(webhookUrl, {
        nome_instancia: data.nome_instancia,
        acao: 'new'
      });
      
      if (!webhookResult.success) {
        uiToast({
          title: "Erro no webhook",
          description: webhookResult.message || "Não foi possível criar a instância no servidor externo",
          variant: "destructive",
        });
        return Promise.reject(new Error(webhookResult.message));
      }
      
      // If webhook was successful, create in database
      const newAccount = await createWhatsAccount({
        nome_instancia: data.nome_instancia
      });
      
      setAccounts((prev) => [...prev, newAccount]);
      
      uiToast({
        title: "Sucesso",
        description: webhookResult.message || "Conta de WhatsApp criada com sucesso",
      });
      
      return Promise.resolve();
    } catch (err) {
      console.error("Erro ao criar conta:", err);
      uiToast({
        title: "Erro",
        description: err instanceof Error ? err.message : "Não foi possível criar a conta de WhatsApp",
        variant: "destructive",
      });
      
      return Promise.reject(err);
    } finally {
      setIsCreating(false);
    }
  };

  const handleDeleteAccount = async (id: number, nomeInstancia: string) => {
    try {
      // Register that we're processing this account
      setIsProcessing(prev => ({ ...prev, [id]: 'deleting' }));
      
      // Call the delete webhook
      const webhookUrl = await getWebhookInstanciasUrl();
      
      if (!webhookUrl) {
        toast.error("Erro ao excluir instância", {
          description: "URL do webhook de exclusão não configurada"
        });
        return;
      }
      
      const webhookResult = await callWebhook(webhookUrl, {
        nome_instancia: nomeInstancia,
        acao: 'delete'
      });
      
      if (!webhookResult.success) {
        toast.error("Erro ao excluir instância", {
          description: webhookResult.message || "Não foi possível excluir a instância no servidor externo"
        });
        return;
      }
      
      // If webhook was successful, delete from database
      await deleteWhatsAccount(id);
      setAccounts((prev) => prev.filter((account) => account.id !== id));
      
      toast.success("Conta excluída com sucesso", {
        description: webhookResult.message || "Conta de WhatsApp excluída com sucesso"
      });
    } catch (err) {
      console.error("Erro ao excluir conta:", err);
      toast.error("Erro ao excluir conta", {
        description: err instanceof Error ? err.message : "Não foi possível excluir a conta de WhatsApp"
      });
    } finally {
      // Remove the processing status for this account
      setIsProcessing(prev => {
        const newState = { ...prev };
        delete newState[id];
        return newState;
      });
    }
  };

  const handleConnectAccount = async (id: number, nomeInstancia: string) => {
    try {
      // Register that we're processing this account
      setIsProcessing(prev => ({ ...prev, [id]: 'connecting' }));
      setCurrentInstance(nomeInstancia);
      
      // Get webhook URL
      const webhookUrl = await getWebhookInstanciasUrl();
      
      if (!webhookUrl) {
        toast.error("Erro ao conectar instância", {
          description: "URL do webhook não configurada"
        });
        return;
      }
      
      // Call connect webhook
      const webhookResult = await callWebhook(webhookUrl, {
        nome_instancia: nomeInstancia,
        acao: 'connect'
      });
      
      if (!webhookResult.success) {
        toast.error("Erro ao conectar instância", {
          description: webhookResult.message || "Não foi possível conectar a instância no servidor externo"
        });
        return;
      }
      
      // Process results to extract QR code
      let qrCode = null;
      
      if (webhookResult.data) {
        qrCode = extractQrCodeFromResponse(webhookResult.data);
      }
      
      // If we have a QR code, show the dialog
      if (qrCode) {
        setQrCodeData(qrCode);
        setQrCodeDialogOpen(true);
        toast.info("QR Code disponível", {
          description: "Escaneie o QR Code para conectar seu WhatsApp"
        });
      } else {
        toast.success("Solicitação de conexão enviada", {
          description: webhookResult.message || "Verifique o QR Code no dispositivo"
        });
      }
      
      // Refresh accounts to update status
      await fetchAccounts();
    } catch (err) {
      console.error("Erro ao conectar conta:", err);
      toast.error("Erro ao conectar conta", {
        description: err instanceof Error ? err.message : "Não foi possível conectar a conta de WhatsApp"
      });
    } finally {
      // Remove the processing status for this account
      setIsProcessing(prev => {
        const newState = { ...prev };
        delete newState[id];
        return newState;
      });
    }
  };

  const handleDisconnectAccount = async (id: number, nomeInstancia: string) => {
    try {
      // Register that we're processing this account
      setIsProcessing(prev => ({ ...prev, [id]: 'disconnecting' }));
      
      // Get webhook URL
      const webhookUrl = await getWebhookInstanciasUrl();
      
      if (!webhookUrl) {
        toast.error("Erro ao desconectar instância", {
          description: "URL do webhook não configurada"
        });
        return;
      }
      
      // Call disconnect webhook
      const webhookResult = await callWebhook(webhookUrl, {
        nome_instancia: nomeInstancia,
        acao: 'disconnect'
      });
      
      if (!webhookResult.success) {
        toast.error("Erro ao desconectar instância", {
          description: webhookResult.message || "Não foi possível desconectar a instância no servidor externo"
        });
        return;
      }
      
      toast.success("Instância desconectada", {
        description: webhookResult.message || "Instância desconectada com sucesso"
      });
      
      // Refresh accounts to update status
      await fetchAccounts();
    } catch (err) {
      console.error("Erro ao desconectar conta:", err);
      toast.error("Erro ao desconectar conta", {
        description: err instanceof Error ? err.message : "Não foi possível desconectar a conta de WhatsApp"
      });
    } finally {
      // Remove the processing status for this account
      setIsProcessing(prev => {
        const newState = { ...prev };
        delete newState[id];
        return newState;
      });
    }
  };

  const handleCloseQrCodeDialog = () => {
    setQrCodeDialogOpen(false);
    setQrCodeData(null);
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  return {
    accounts,
    isLoading,
    error,
    createAccount: handleCreateAccount,
    deleteAccount: handleDeleteAccount,
    connectAccount: handleConnectAccount,
    disconnectAccount: handleDisconnectAccount,
    isCreating,
    isProcessing,
    refreshAccounts: fetchAccounts,
    refreshAccountsStatus,
    isRefreshing,
    qrCodeData,
    qrCodeDialogOpen,
    currentInstance,
    closeQrCodeDialog: handleCloseQrCodeDialog,
    getStatusInfo: mapStatusToText
  };
}
