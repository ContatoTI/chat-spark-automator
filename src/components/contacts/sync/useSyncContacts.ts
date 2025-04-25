
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import { useQueryClient } from "@tanstack/react-query";
import { callWebhook } from "@/lib/api/webhook-utils";

type SyncStatus = "idle" | "syncing" | "success" | "error";

export const useSyncContacts = (isOpen: boolean) => {
  const [status, setStatus] = useState<SyncStatus>("idle");
  const [progress, setProgress] = useState(0);
  const [webhookMessage, setWebhookMessage] = useState<string>("");
  const queryClient = useQueryClient();

  const startSync = async () => {
    setStatus("syncing");
    setProgress(0);
    setWebhookMessage("");
    
    try {
      // Get webhook URL from localStorage first
      let webhookUrl = localStorage.getItem('webhook_disparo');
      
      // If not in localStorage, fetch from database
      if (!webhookUrl) {
        const { data, error } = await supabase
          .from('AppW_Options')
          .select('text')
          .eq('option', 'webhook_disparo')
          .single();
        
        if (error) throw new Error("Webhook não configurado");
        if (data?.text) {
          webhookUrl = data.text;
          localStorage.setItem('webhook_disparo', webhookUrl);
        }
      }
      
      if (!webhookUrl) {
        throw new Error("URL do webhook não configurada");
      }

      // Simulate progress while webhook processes
      const progressInterval = setInterval(() => {
        setProgress((prev) => Math.min(prev + 5, 95));
      }, 500);

      // Call webhook with sync action
      const response = await callWebhook(webhookUrl, {
        action: "sincronizar",
        timestamp: new Date().toISOString()
      });

      clearInterval(progressInterval);
      
      if (response.success) {
        setProgress(100);
        setStatus("success");
        setWebhookMessage(response.message || "Sincronização concluída com sucesso");
        toast.success("Contatos sincronizados com sucesso");
        queryClient.invalidateQueries({ queryKey: ['contacts'] });
      } else {
        throw new Error(response.message || "Erro na sincronização");
      }
    } catch (error) {
      console.error("Erro na sincronização:", error);
      setStatus("error");
      toast.error("Erro ao sincronizar contatos", {
        description: error instanceof Error ? error.message : "Erro desconhecido"
      });
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
