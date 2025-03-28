
import React from "react";
import { Campaign } from "@/lib/api/campaigns";
import { CampaignCard } from "./CampaignCard";
import { Button } from "@/components/ui/button";
import { PlusCircle, Calendar as CalendarIcon, List } from "lucide-react";
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
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <div className="flex space-x-2">
          <Button
            variant={viewMode === "calendar" ? "default" : "outline"}
            size="sm"
            className="h-8"
            onClick={() => setViewMode("calendar")}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            Calendário
          </Button>
          <Button
            variant={viewMode === "list" ? "default" : "outline"}
            size="sm"
            className="h-8"
            onClick={() => setViewMode("list")}
          >
            <List className="mr-2 h-4 w-4" />
            Lista
          </Button>
        </div>
        <Button
          className="bg-primary"
          onClick={onNewCampaign}
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Nova Campanha
        </Button>
      </div>

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
        <div className="flex flex-col gap-4">
          {campaigns.map((campaign) => (
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
      )}
    </div>
  );
};
