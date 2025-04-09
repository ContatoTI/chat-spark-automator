
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { WhatsAccount } from "@/lib/api/whatsapp/types";
import { getWhatsAccounts, createWhatsAccount, deleteWhatsAccount } from "@/lib/api/whatsapp/api";
import { 
  getWebhookInstanciasUrl, 
  getWebhookDeleteInstanciaUrl,
  getWebhookConnectInstanciaUrl,
  getWebhookDisconnectInstanciaUrl
} from "@/lib/api/whatsapp/webhook";
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
        acao: 'criar'
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
      const webhookUrl = await getWebhookDeleteInstanciaUrl();
      
      if (!webhookUrl) {
        toast.error("Erro ao excluir instância", {
          description: "URL do webhook de exclusão não configurada"
        });
        return;
      }
      
      const webhookResult = await callWebhook(webhookUrl, {
        nome_instancia: nomeInstancia,
        acao: 'excluir'
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
      
      // Get connect webhook URL
      const webhookUrl = await getWebhookConnectInstanciaUrl();
      
      if (!webhookUrl) {
        toast.error("Erro ao conectar instância", {
          description: "URL do webhook de conexão não configurada"
        });
        return;
      }
      
      // Call connect webhook
      const webhookResult = await callWebhook(webhookUrl, {
        nome_instancia: nomeInstancia,
        acao: 'conectar'
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
        const responseData = webhookResult.data;
        
        // Try different response formats
        if (Array.isArray(responseData) && responseData.length > 0) {
          const firstItem = responseData[0];
          
          if (firstItem.success && firstItem.data) {
            qrCode = firstItem.data.base64 || firstItem.data.code || null;
          }
        } 
        else if (responseData.success && responseData.data) {
          qrCode = responseData.data.base64 || responseData.data.code || null;
        }
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
      
      // Get disconnect webhook URL
      const webhookUrl = await getWebhookDisconnectInstanciaUrl();
      
      if (!webhookUrl) {
        toast.error("Erro ao desconectar instância", {
          description: "URL do webhook de desconexão não configurada"
        });
        return;
      }
      
      // Call disconnect webhook
      const webhookResult = await callWebhook(webhookUrl, {
        nome_instancia: nomeInstancia,
        acao: 'desconectar'
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
    qrCodeData,
    qrCodeDialogOpen,
    currentInstance,
    closeQrCodeDialog: handleCloseQrCodeDialog
  };
}
