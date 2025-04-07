
import { useState, useCallback, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

type SyncStatus = "idle" | "syncing" | "success" | "error";

interface UseSyncContactsReturn {
  status: SyncStatus;
  progress: number;
  webhookMessage: string | null;
  startSync: () => Promise<void>;
  resetState: () => void;
}

export const useSyncContacts = (isDialogOpen: boolean): UseSyncContactsReturn => {
  const [status, setStatus] = useState<SyncStatus>("idle");
  const [progress, setProgress] = useState(0);
  const [webhookMessage, setWebhookMessage] = useState<string | null>(null);
  const empresaId = 'empresa-01';

  // Reset state when dialog closes
  useEffect(() => {
    if (!isDialogOpen) {
      resetState();
    }
  }, [isDialogOpen]);

  const resetState = useCallback(() => {
    setStatus("idle");
    setProgress(0);
    setWebhookMessage(null);
  }, []);

  const fetchWebhookUrl = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('AppW_Options')
        .select('webhook_contatos')
        .eq('empresa_id', empresaId)
        .limit(1);
      
      if (error) throw error;
      
      return data?.[0]?.webhook_contatos || null;
    } catch (error) {
      console.error("Error fetching webhook URL:", error);
      return null;
    }
  }, []);

  const startSync = useCallback(async () => {
    try {
      setStatus("syncing");
      setProgress(10);
      
      // Fetch webhook URL from the database
      const webhookUrl = await fetchWebhookUrl();
      
      if (!webhookUrl) {
        toast.error("URL do webhook não configurada");
        setStatus("error");
        return;
      }
      
      setProgress(30);
      
      // Simulando chamada para o webhook
      console.log(`Chamando webhook ${webhookUrl}`);
      
      // Simulação de progresso
      setProgress(50);
      
      setTimeout(() => {
        setProgress(70);
        
        setTimeout(() => {
          setProgress(100);
          setStatus("success");
          setWebhookMessage("Contatos sincronizados com sucesso!");
          
          // Atualizando o número de contatos na tabela AppW_Options
          updateContactCount();
          
          toast.success("Sincronização de contatos finalizada!");
        }, 1000);
      }, 1500);
      
    } catch (error) {
      console.error("Error in contacts sync:", error);
      setStatus("error");
      toast.error("Erro ao sincronizar contatos");
    }
  }, [fetchWebhookUrl]);
  
  // Função para atualizar o número de contatos na tabela AppW_Options
  const updateContactCount = async () => {
    try {
      // Busca a contagem de contatos
      const { count, error: countError } = await supabase
        .from('AppW_Contatos')
        .select('*', { count: 'exact', head: true });
      
      if (countError) throw countError;
      
      // Atualiza o número de contatos na tabela AppW_Options
      const { error: updateError } = await supabase
        .from('AppW_Options')
        .update({ numero_de_contatos: count })
        .eq('empresa_id', empresaId);
      
      if (updateError) throw updateError;
      
      console.log(`Número de contatos atualizado: ${count}`);
    } catch (error) {
      console.error("Erro ao atualizar número de contatos:", error);
    }
  };

  return {
    status,
    progress,
    webhookMessage,
    startSync,
    resetState
  };
};
