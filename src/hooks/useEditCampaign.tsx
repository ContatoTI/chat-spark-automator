
import React from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateCampaign, Campaign } from "@/lib/api/campaigns";
import { toast } from "sonner";

export const useEditCampaign = (onSuccess: () => void) => {
  const queryClient = useQueryClient();
  
  const updateMutation = useMutation({
    mutationFn: ({ id, updatedCampaign }: { id: number, updatedCampaign: Partial<Campaign> }) => 
      updateCampaign(id, updatedCampaign),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['campaigns'] });
      toast.success("Campanha atualizada com sucesso!");
      onSuccess();
    },
    onError: (error) => {
      toast.error(`Erro ao atualizar campanha: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    },
  });
  
  return {
    updateMutation,
    isSubmitting: updateMutation.isPending
  };
};
