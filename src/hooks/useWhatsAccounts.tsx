
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { WhatsAccount } from "@/lib/api/whatsapp/types";
import { getWhatsAccounts, createWhatsAccount, deleteWhatsAccount } from "@/lib/api/whatsapp/api";

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
      const data = await getWhatsAccounts();
      setAccounts(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Erro desconhecido ao carregar contas'));
      toast({
        title: "Erro",
        description: "Não foi possível carregar as contas de WhatsApp",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateAccount = async (data: { nome_instancia: string }) => {
    try {
      setIsCreating(true);
      const newAccount = await createWhatsAccount({
        nome_instancia: data.nome_instancia
      });
      
      setAccounts((prev) => [...prev, newAccount]);
      
      toast({
        title: "Sucesso",
        description: "Conta de WhatsApp criada com sucesso",
      });
      
      return Promise.resolve();
    } catch (err) {
      toast({
        title: "Erro",
        description: "Não foi possível criar a conta de WhatsApp",
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
      toast({
        title: "Erro",
        description: "Não foi possível excluir a conta de WhatsApp",
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
