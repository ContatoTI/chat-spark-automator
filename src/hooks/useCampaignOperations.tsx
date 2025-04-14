
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Campaign } from "@/lib/api/campaigns/types";
import { fetchCampaigns, deleteCampaign, updateCampaign, createCampaign } from "@/lib/api/campaigns";
import { useAuth } from "@/contexts/AuthContext";

export const useCampaignOperations = () => {
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const queryClient = useQueryClient();
  const { user, selectedCompany } = useAuth();

  // Fetch campaigns with company filtering
  const { data: campaigns = [], isLoading, error, isError } = useQuery({
    queryKey: ['campaigns', user?.id, selectedCompany],
    queryFn: () => fetchCampaigns(user, selectedCompany),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Create campaign mutation
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

  // Delete campaign mutation
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

  // Send campaign now mutation
  const sendNowMutation = useMutation({
    mutationFn: (campaign: Campaign) => {
      return updateCampaign(campaign.id!, {
        status: 'sending',
        data_disparo: new Date().toISOString()
      });
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

  // Handler functions
  const handleCreateCampaign = (campaign: Campaign) => {
    // Garantir que a campanha tenha o empresa_id correto
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
