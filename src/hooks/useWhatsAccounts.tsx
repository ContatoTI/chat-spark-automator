
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { WhatsAccount } from "@/lib/api/whatsapp/types";
import { getWhatsAccounts, createWhatsAccount, deleteWhatsAccount } from "@/lib/api/whatsapp/api";
import { 
  callInstanceWebhook, 
  callDeleteInstanceWebhook,
  callConnectInstanceWebhook,
  callDisconnectInstanceWebhook
} from "@/lib/api/whatsapp/webhook";
import { toast } from "sonner";

export function useWhatsAccounts() {
  const [accounts, setAccounts] = useState<WhatsAccount[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isProcessing, setIsProcessing] = useState<{[id: number]: string}>({});
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
      
      // Primeiro chamar o webhook
      const webhookResult = await callInstanceWebhook(data.nome_instancia);
      
      if (!webhookResult.success) {
        uiToast({
          title: "Erro no webhook",
          description: webhookResult.message || "Não foi possível criar a instância no servidor externo",
          variant: "destructive",
        });
        return Promise.reject(new Error(webhookResult.message));
      }
      
      // Se o webhook foi bem-sucedido, criar na base de dados
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
      // Registrar que estamos processando esta conta
      setIsProcessing(prev => ({ ...prev, [id]: 'deleting' }));
      
      // Primeiro chamar o webhook de exclusão
      const webhookResult = await callDeleteInstanceWebhook(nomeInstancia);
      
      if (!webhookResult.success) {
        toast.error("Erro ao excluir instância", {
          description: webhookResult.message || "Não foi possível excluir a instância no servidor externo"
        });
        return;
      }
      
      // Se o webhook foi bem-sucedido, excluir na base de dados
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
      // Remover o status de processamento para esta conta
      setIsProcessing(prev => {
        const newState = { ...prev };
        delete newState[id];
        return newState;
      });
    }
  };

  const handleConnectAccount = async (id: number, nomeInstancia: string) => {
    try {
      // Registrar que estamos processando esta conta
      setIsProcessing(prev => ({ ...prev, [id]: 'connecting' }));
      
      // Chamar o webhook de conexão
      const webhookResult = await callConnectInstanceWebhook(nomeInstancia);
      
      if (!webhookResult.success) {
        toast.error("Erro ao conectar instância", {
          description: webhookResult.message || "Não foi possível conectar a instância no servidor externo"
        });
        return;
      }
      
      toast.success("Solicitação de conexão enviada", {
        description: webhookResult.message || "Verifique o QR Code no dispositivo"
      });
    } catch (err) {
      console.error("Erro ao conectar conta:", err);
      toast.error("Erro ao conectar conta", {
        description: err instanceof Error ? err.message : "Não foi possível conectar a conta de WhatsApp"
      });
    } finally {
      // Remover o status de processamento para esta conta
      setIsProcessing(prev => {
        const newState = { ...prev };
        delete newState[id];
        return newState;
      });
    }
  };

  const handleDisconnectAccount = async (id: number, nomeInstancia: string) => {
    try {
      // Registrar que estamos processando esta conta
      setIsProcessing(prev => ({ ...prev, [id]: 'disconnecting' }));
      
      // Chamar o webhook de desconexão
      const webhookResult = await callDisconnectInstanceWebhook(nomeInstancia);
      
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
      // Remover o status de processamento para esta conta
      setIsProcessing(prev => {
        const newState = { ...prev };
        delete newState[id];
        return newState;
      });
    }
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
    refreshAccounts: fetchAccounts
  };
}
