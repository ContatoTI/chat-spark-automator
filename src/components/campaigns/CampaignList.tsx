
import React from "react";
import { Campaign } from "@/lib/api/campaigns";
import { LoadingState } from "./LoadingState";
import { EmptyState } from "./EmptyState";
import { ViewModeSelector } from "./ViewModeSelector";
import { ListView } from "./ListView";
import { CampaignCalendarView } from "./CampaignCalendarView";

interface CampaignListProps {
  campaigns: Campaign[];
  isLoading: boolean;
  onEdit: (campaign: Campaign) => void;
  onDelete: (id: number) => void;
  onSendNow: (campaign: Campaign) => void;
  onDuplicate: (campaign: Campaign) => void;
  onNewCampaign: () => void;
  isSending: boolean;
}

export const CampaignList: React.FC<CampaignListProps> = ({
  campaigns,
  isLoading,
  onEdit,
  onDelete,
  onSendNow,
  onDuplicate,
  onNewCampaign,
  isSending
}) => {
  const [viewMode, setViewMode] = React.useState<"list" | "calendar">("calendar");

  if (isLoading) {
    return <LoadingState />;
  }

  if (campaigns.length === 0) {
    return <EmptyState onNewCampaign={onNewCampaign} />;
  }

  return (
    <div className="space-y-4">
      <ViewModeSelector 
        viewMode={viewMode} 
        setViewMode={setViewMode} 
        onNewCampaign={onNewCampaign}
      />

      {viewMode === "calendar" ? (
        <CampaignCalendarView 
          campaigns={campaigns} 
          onEdit={onEdit} 
          onDelete={onDelete} 
          onSendNow={onSendNow} 
          onDuplicate={onDuplicate} 
          isSending={isSending} 
        />
      ) : (
        <ListView 
          campaigns={campaigns} 
          onEdit={onEdit} 
          onDelete={onDelete} 
          onSendNow={onSendNow} 
          onDuplicate={onDuplicate} 
          isSending={isSending} 
        />
      )}
    </div>
  );
};
