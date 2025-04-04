
import React from "react";
import { Campaign } from "@/lib/api/campaigns";
import { CampaignCard } from "./CampaignCard";

interface ListViewProps {
  campaigns: Campaign[];
  onEdit: (campaign: Campaign) => void;
  onDelete: (id: number) => void;
  onSendNow: (campaign: Campaign) => void;
  onDuplicate: (campaign: Campaign) => void;
  isSending: boolean;
}

export const ListView: React.FC<ListViewProps> = ({
  campaigns,
  onEdit,
  onDelete,
  onSendNow,
  onDuplicate,
  isSending
}) => {
  return (
    <div className="flex flex-col gap-4">
      {campaigns.map(campaign => (
        <CampaignCard 
          key={campaign.id} 
          campaign={campaign} 
          onEdit={onEdit} 
          onDelete={onDelete} 
          onSendNow={onSendNow} 
          onDuplicate={onDuplicate} 
          isSending={isSending} 
        />
      ))}
    </div>
  );
};
