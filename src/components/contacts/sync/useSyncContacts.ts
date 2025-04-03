
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import { useQueryClient } from "@tanstack/react-query";

type SyncStatus = "idle" | "syncing" | "success" | "error";

// Define interface for webhook response
interface WebhookResponse {
  message?: string;
  status?: string;
  contactsCount?: number;
  [key: string]: any; // Allow for other properties
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
        
        // Use response message if available
        let responseData: WebhookResponse = {};
        try {
          responseData = await postResponse.json();
          // Se o webhook retornou a contagem de contatos, atualizamos na tabela de opções
          if (responseData.contactsCount !== undefined) {
            await updateContactsCount(responseData.contactsCount);
          }
          
          // Store the webhook message
          if (responseData.message) {
            setWebhookMessage(responseData.message);
          }
        } catch (e) {
          console.log('No JSON response from webhook');
        }
        
        setProgress(100);
        setStatus("success");
        
        // Use webhook response message if available, otherwise use default
        const message = responseData.message || "Sincronização concluída";
        toast.success(message);
        
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
          
          // Use response message if available
          let responseData: WebhookResponse = {};
          try {
            responseData = await getResponse.json();
            // Se o webhook retornou a contagem de contatos, atualizamos na tabela de opções
            if (responseData.contactsCount !== undefined) {
              await updateContactsCount(responseData.contactsCount);
            }
            
            // Store the webhook message
            if (responseData.message) {
              setWebhookMessage(responseData.message);
            }
          } catch (e) {
            console.log('No JSON response from webhook');
          }
          
          setProgress(100);
          setStatus("success");
          
          // Use webhook response message if available, otherwise use default
          const message = responseData.message || "Sincronização concluída";
          toast.success(message);
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
