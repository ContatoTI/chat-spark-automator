
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { WhatsAccount } from "@/lib/api/whatsapp/types";
import { getWhatsAccounts, createWhatsAccount, deleteWhatsAccount } from "@/lib/api/whatsapp/api";
import { callInstanceWebhook } from "@/lib/api/whatsapp/webhook";

export function useWhatsAccounts() {
  const [accounts, setAccounts] = useState<WhatsAccount[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const { toast } = useToast();

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
      toast({
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
        toast({
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
      
      toast({
        title: "Sucesso",
        description: webhookResult.message || "Conta de WhatsApp criada com sucesso",
      });
      
      return Promise.resolve();
    } catch (err) {
      console.error("Erro ao criar conta:", err);
      toast({
        title: "Erro",
        description: err instanceof Error ? err.message : "Não foi possível criar a conta de WhatsApp",
        variant: "destructive",
      });
      
      return Promise.reject(err);
    } finally {
      setIsCreating(false);
    }
  };

  const handleDeleteAccount = async (id: number) => {
    try {
      await deleteWhatsAccount(id);
      setAccounts((prev) => prev.filter((account) => account.id !== id));
      
      toast({
        title: "Sucesso",
        description: "Conta de WhatsApp excluída com sucesso",
      });
    } catch (err) {
      console.error("Erro ao excluir conta:", err);
      toast({
        title: "Erro",
        description: err instanceof Error ? err.message : "Não foi possível excluir a conta de WhatsApp",
        variant: "destructive",
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
    isCreating,
    refreshAccounts: fetchAccounts
  };
}
