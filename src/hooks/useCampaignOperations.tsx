import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Campaign } from "@/lib/api/campaigns/types";
import { fetchCampaigns, deleteCampaign, updateCampaign, createCampaign } from "@/lib/api/campaigns";
import { useAuth } from "@/contexts/AuthContext";
import { callWebhook } from "@/lib/api/webhook-utils";
import { supabase } from "@/lib/supabase";

export const useCampaignOperations = () => {
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const queryClient = useQueryClient();
  const { user, selectedCompany } = useAuth();

  const { data: campaigns = [], isLoading, error, isError } = useQuery({
    queryKey: ['campaigns', user?.id, selectedCompany],
    queryFn: () => fetchCampaigns(user, selectedCompany),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const createMutation = useMutation({
    mutationFn: (campaign: Campaign) => {
      return createCampaign(campaign, user, selectedCompany);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['campaigns'] });
      toast.success("Campanha criada com sucesso");
    },
    onError: (error) => {
      toast.error("Erro ao criar campanha", {
        description: error instanceof Error ? error.message : "Erro desconhecido"
      });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: deleteCampaign,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['campaigns'] });
      toast.success("Campanha excluída com sucesso");
    },
    onError: (error) => {
      toast.error("Erro ao excluir campanha", {
        description: error instanceof Error ? error.message : "Erro desconhecido"
      });
    }
  });

  const sendNowMutation = useMutation({
    mutationFn: async (campaign: Campaign) => {
      await updateCampaign(campaign.id!, {
        status: 'sending',
        data_disparo: new Date().toISOString()
      });
      
      try {
        const { data: settingsData } = await supabase
          .from('AppW_Options')
          .select('text')
          .eq('option', 'webhook_disparo')
          .single();
          
        const webhookUrl = settingsData?.text;
        
        if (webhookUrl) {
          console.log(`[Campaign] Notificando webhook de disparo: ${webhookUrl}`);
          
          await callWebhook(webhookUrl, {
            action: 'disparar',
            campaign_id: campaign.id,
            empresa_id: campaign.empresa_id,
            timestamp: new Date().toISOString()
          });
          
          console.log(`[Campaign] Webhook notificado com sucesso`);
        } else {
          console.warn(`[Campaign] URL do webhook de disparo não configurada`);
        }
      } catch (webhookError) {
        console.error(`[Campaign] Erro ao notificar webhook:`, webhookError);
      }
      
      return campaign;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['campaigns'] });
      toast.success("Campanha enviada com sucesso");
    },
    onError: (error) => {
      toast.error("Erro ao enviar campanha", {
        description: error instanceof Error ? error.message : "Erro desconhecido"
      });
    }
  });

  const handleCreateCampaign = (campaign: Campaign) => {
    let empresa_id: string;
    
    if (user?.role === 'master' && selectedCompany) {
      empresa_id = selectedCompany;
    } else if (user?.company_id) {
      empresa_id = user.company_id;
    } else {
      toast.error("Empresa não identificada. Selecione uma empresa ou verifique suas permissões.");
      return;
    }
    
    createMutation.mutate({
      ...campaign,
      empresa_id
    });
  };

  const handleDeleteCampaign = (id: number) => {
    deleteMutation.mutate(id);
  };

  const handleSendCampaignNow = (campaign: Campaign) => {
    if (!campaign.id) {
      toast.error("Campanha inválida");
      return;
    }
    sendNowMutation.mutate(campaign);
  };

  const handleEditCampaign = (campaign: Campaign) => {
    setSelectedCampaign(campaign);
  };

  return {
    campaigns,
    isLoading,
    error,
    isError,
    selectedCampaign,
    setSelectedCampaign,
    handleCreateCampaign,
    handleDeleteCampaign,
    handleSendCampaignNow,
    handleEditCampaign,
    createMutation,
    sendNowMutation
  };
};
