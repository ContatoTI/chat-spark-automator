
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Campaign } from "@/lib/api/campaigns/types";
import { fetchCampaigns, deleteCampaign, updateCampaign } from "@/lib/api/campaigns";
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
    handleDeleteCampaign,
    handleSendCampaignNow,
    handleEditCampaign,
    sendNowMutation
  };
};
