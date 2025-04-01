
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";

type SyncStatus = "idle" | "syncing" | "success" | "error";

export const useSyncContacts = (isOpen: boolean) => {
  const [status, setStatus] = useState<SyncStatus>("idle");
  const [progress, setProgress] = useState(0);
  const [webhookUrl, setWebhookUrl] = useState<string>("");

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
        .eq('option', 'webhook_contatos')
        .single();
      
      if (error) {
        console.error('Error fetching contacts webhook URL:', error);
        return;
      }
      
      if (data && data.text) {
        setWebhookUrl(data.text);
        console.log('Contacts webhook URL loaded:', data.text);
      } else {
        console.warn('Contacts webhook URL is empty or null');
      }
    } catch (err) {
      console.error('Error in contacts webhook URL fetch:', err);
    }
  };

  const startSync = async () => {
    setStatus("syncing");
    setProgress(0);
    
    if (!webhookUrl) {
      toast.error("URL do webhook de contatos não encontrada nas configurações");
      setStatus("error");
      return;
    }
    
    console.log('Attempting to call contacts webhook URL:', webhookUrl);
    
    // Prepare the payload
    const payload = {
      action: 'sync_contacts',
      timestamp: new Date().toISOString()
    };
    
    // Simulate progress regardless of webhook status
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev + Math.random() * 10;
        if (newProgress >= 95) {
          clearInterval(progressInterval);
          return 95; // Leave the last 5% for the actual webhook response
        }
        return newProgress;
      });
    }, 300);
    
    try {
      // Try POST request first
      console.log('Attempting POST request to contacts webhook');
      const postResponse = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      
      console.log('POST response status:', postResponse.status);
      
      // If POST works, set success
      if (postResponse.ok) {
        console.log('POST request successful');
        setProgress(100);
        setStatus("success");
        toast.success("Sincronização concluída com sucesso!");
        clearInterval(progressInterval);
        return;
      }
      
      // If it's specifically a 404 "not registered for POST" error, try GET
      if (postResponse.status === 404) {
        console.log('POST request failed with 404, trying GET request');
        
        // Build URL with query parameters
        const queryParams = new URLSearchParams();
        Object.entries(payload).forEach(([key, value]) => {
          queryParams.append(key, String(value));
        });
        
        const getUrl = `${webhookUrl}?${queryParams.toString()}`;
        console.log('Attempting GET request to:', getUrl);
        
        const getResponse = await fetch(getUrl, {
          method: 'GET',
        });
        
        console.log('GET response status:', getResponse.status);
        
        if (getResponse.ok) {
          console.log('GET request successful');
          setProgress(100);
          setStatus("success");
          toast.success("Sincronização concluída com sucesso!");
        } else {
          throw new Error(`Erro ao chamar webhook via GET: ${getResponse.status}`);
        }
      } else {
        throw new Error(`Erro ao chamar webhook via POST: ${postResponse.status}`);
      }
    } catch (err) {
      console.error('Error calling contacts webhook:', err);
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
    }
  };

  return {
    status,
    progress,
    startSync,
    resetState
  };
};
