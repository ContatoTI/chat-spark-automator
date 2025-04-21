import { useState, useEffect } from "react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import { useQueryClient } from "@tanstack/react-query";
import { callWebhook } from "@/lib/api/webhook-utils";

type SyncStatus = "idle" | "syncing" | "success" | "error";

interface WebhookResponse {
  message?: string;
  status?: string;
  contactsCount?: number;
  [key: string]: any;
}

export const useSyncContacts = (isOpen: boolean) => {
  const [status, setStatus] = useState<SyncStatus>("idle");
  const [progress, setProgress] = useState(0);
  const [webhookUrl, setWebhookUrl] = useState<string>("");
  const [webhookMessage, setWebhookMessage] = useState<string>("");
  const queryClient = useQueryClient();

  // Fetch webhook URL when dialog opens
  useEffect(() => {
    if (isOpen) {
      fetchWebhookUrl();
    }
  }, [isOpen]);

  const fetchWebhookUrl = async () => {
    try {
      const { data, error } = await supabase
        .from('AppW_Options')
        .select('text')
        .eq('option', 'webhook_disparo')
        .single();
      
      if (error) {
        console.error('Error fetching dispatch webhook URL:', error);
        return;
      }
      
      if (data && data.text) {
        setWebhookUrl(data.text);
        console.log('Dispatch webhook URL loaded:', data.text);
      } else {
        console.warn('Dispatch webhook URL is empty or null');
      }
    } catch (err) {
      console.error('Error in dispatch webhook URL fetch:', err);
    }
  };

  // Função para atualizar o contador de contatos na tabela AppW_Options
  const updateContactsCount = async (count: number) => {
    try {
      console.log('Atualizando contador de contatos para:', count);
      const { error } = await supabase
        .from('AppW_Options')
        .update({ numeric: count })
        .eq('option', 'numero_de_contatos');
      
      if (error) {
        console.error('Erro ao atualizar contador de contatos:', error);
        throw error;
      }
      
      console.log('Contador de contatos atualizado com sucesso');
      // Invalidar a query de estatísticas para forçar uma atualização
      queryClient.invalidateQueries({ queryKey: ['contactsStats'] });
    } catch (err) {
      console.error('Erro durante atualização do contador de contatos:', err);
      // Não lançamos o erro aqui para não interromper o fluxo principal
    }
  };

  const startSync = async () => {
    setStatus("syncing");
    setProgress(0);
    setWebhookMessage("");
    
    if (!webhookUrl) {
      toast.error("URL do webhook de disparo não encontrada nas configurações");
      setStatus("error");
      return;
    }
    
    console.log('Attempting to call dispatch webhook URL:', webhookUrl);
    
    // Prepare the payload with new action
    const payload = {
      action: 'atualizar_contatos',
      timestamp: new Date().toISOString()
    };
    
    // Slower progress simulation
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        // Slower increment for progress animation
        const newProgress = prev + Math.random() * 4;
        if (newProgress >= 95) {
          clearInterval(progressInterval);
          return 95; // Leave the last 5% for the actual webhook response
        }
        return newProgress;
      });
    }, 500); // Longer interval for slower progress
    
    try {
      const response = await callWebhook(webhookUrl, payload);
      
      if (response.success) {
        console.log('Webhook call successful:', response);
        
        if (response.data?.contactsCount !== undefined) {
          await updateContactsCount(response.data.contactsCount);
        }
        
        if (response.message) {
          setWebhookMessage(response.message);
        }
        
        setProgress(100);
        setStatus("success");
        
        const message = response.message || "Sincronização concluída";
        toast.success(message);
      } else {
        throw new Error(response.message || "Erro ao sincronizar contatos");
      }
    } catch (err) {
      console.error('Error calling dispatch webhook:', err);
      setStatus("error");
      toast.error(`Erro ao sincronizar contatos: ${err instanceof Error ? err.message : 'Erro desconhecido'}`);
    } finally {
      clearInterval(progressInterval);
      setProgress(100);
    }
  };

  const resetState = () => {
    if (status === "success" || status === "error") {
      setStatus("idle");
      setProgress(0);
      setWebhookMessage("");
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
