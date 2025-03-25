
import React from "react";
import { Campaign } from "@/lib/api/campaigns";
import { CampaignCard } from "./CampaignCard";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

interface CampaignListProps {
  campaigns: Campaign[];
  isLoading: boolean;
  onEdit: (campaign: Campaign) => void;
  onDelete: (id: number) => void;
  onSendNow: (campaign: Campaign) => void;
  onNewCampaign: () => void;
  isSending: boolean;
}

export const CampaignList: React.FC<CampaignListProps> = ({
  campaigns,
  isLoading,
  onEdit,
  onDelete,
  onSendNow,
  onNewCampaign,
  isSending
}) => {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (campaigns.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="font-medium text-lg">Nenhuma campanha encontrada</h3>
        <p className="text-muted-foreground mt-1">Crie uma nova campanha para começar</p>
        <Button 
          className="mt-4 bg-primary"
          onClick={onNewCampaign}
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Nova Campanha
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {campaigns.map((campaign) => (
        <CampaignCard
          key={campaign.id}
          campaign={campaign}
          onEdit={onEdit}
          onDelete={onDelete}
          onSendNow={onSendNow}
          isSending={isSending}
        />
      ))}
    </div>
  );
};
