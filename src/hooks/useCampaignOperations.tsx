
import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Campaign, fetchCampaigns, deleteCampaign } from "@/lib/api/campaigns";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";

export const useCampaignOperations = () => {
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [webhookUrl, setWebhookUrl] = useState<string>("");
  const queryClient = useQueryClient();
  
  // Fetch campaigns
  const { 
    data: campaigns = [], 
    isLoading, 
    error 
  } = useQuery({
    queryKey: ['campaigns'],
    queryFn: fetchCampaigns,
  });

  // Fetch webhook URL
  useEffect(() => {
    const fetchWebhookUrl = async () => {
      try {
        const { data, error } = await supabase
          .from('AppW_Options')
          .select('text')
          .eq('option', 'webhook_disparo')
          .single();
        
        if (error) {
          console.error('Error fetching webhook URL:', error);
          return;
        }
        
        if (data && data.text) {
          setWebhookUrl(data.text);
          console.log('Webhook URL loaded:', data.text);
        } else {
          console.warn('Webhook URL is empty or null');
        }
      } catch (err) {
        console.error('Error in webhook URL fetch:', err);
      }
    };
    
    fetchWebhookUrl();
  }, []);

  // Delete campaign mutation
  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteCampaign(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['campaigns'] });
      toast.success('Campanha excluída com sucesso');
    },
    onError: (error) => {
      toast.error(`Erro ao excluir campanha: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    },
  });

  // Send campaign now mutation
  const sendNowMutation = useMutation({
    mutationFn: async (campaign: Campaign) => {
      console.log('Starting send now mutation for campaign:', campaign);
      
      if (!webhookUrl) {
        console.error('Webhook URL is empty');
        throw new Error("URL do webhook de disparo não encontrada nas configurações");
      }
      
      console.log('Attempting to call webhook URL:', webhookUrl);
      
      // Prepare the payload
      const payload = {
        campaign_id: campaign.id,
        campaign_name: campaign.nome,
        action: 'send_now',
        timestamp: new Date().toISOString()
      };
      
      // Try POST request first
      try {
        console.log('Attempting POST request to webhook');
        const postResponse = await fetch(webhookUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });
        
        console.log('POST response status:', postResponse.status);
        
        // If POST works, return success
        if (postResponse.ok) {
          console.log('POST request successful');
          return campaign;
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
            return campaign;
          } else {
            throw new Error(`Erro ao chamar webhook via GET: ${getResponse.status}`);
          }
        } else {
          throw new Error(`Erro ao chamar webhook via POST: ${postResponse.status}`);
        }
      } catch (err) {
        console.error('Error calling webhook:', err);
        throw err;
      }
    },
    onSuccess: (campaign) => {
      console.log('Campaign sent successfully:', campaign);
      queryClient.invalidateQueries({ queryKey: ['campaigns'] });
      toast.success(`Campanha "${campaign.nome}" enviada com sucesso`);
    },
    onError: (error) => {
      console.error('Error in send mutation:', error);
      toast.error(`Erro ao enviar campanha: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    },
  });

  // Campaign operations
  const handleDeleteCampaign = (id: number) => {
    if (window.confirm('Tem certeza que deseja excluir esta campanha?')) {
      deleteMutation.mutate(id);
    }
  };

  const handleSendCampaignNow = (campaign: Campaign) => {
    sendNowMutation.mutate(campaign);
  };

  const handleEditCampaign = (campaign: Campaign) => {
    setSelectedCampaign(campaign);
  };

  return {
    campaigns,
    isLoading,
    error,
    selectedCampaign,
    setSelectedCampaign,
    handleDeleteCampaign,
    handleSendCampaignNow,
    handleEditCampaign,
    sendNowMutation
  };
};
