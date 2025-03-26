
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CampaignList } from "@/components/campaigns/CampaignList";
import { Campaign } from "@/lib/api/campaigns";

interface CampaignFiltersProps {
  selectedTab: string;
  setSelectedTab: (value: string) => void;
  filteredCampaigns: Campaign[];
  isLoading: boolean;
  onEdit: (campaign: Campaign) => void;
  onDelete: (id: number) => void;
  onSendNow: (campaign: Campaign) => void;
  onNewCampaign: () => void;
  isSending: boolean;
}

export const CampaignFilters: React.FC<CampaignFiltersProps> = ({
  selectedTab,
  setSelectedTab,
  filteredCampaigns,
  isLoading,
  onEdit,
  onDelete,
  onSendNow,
  onNewCampaign,
  isSending
}) => {
  return (
    <Tabs defaultValue="all" className="w-full" onValueChange={setSelectedTab}>
      <TabsList className="mb-4">
        <TabsTrigger value="all">Todas</TabsTrigger>
        <TabsTrigger value="draft">Rascunhos</TabsTrigger>
        <TabsTrigger value="scheduled">Agendadas</TabsTrigger>
        <TabsTrigger value="sending">Enviando</TabsTrigger>
        <TabsTrigger value="completed">Concluídas</TabsTrigger>
      </TabsList>
      
      <TabsContent value={selectedTab} className="mt-0">
        <CampaignList
          campaigns={filteredCampaigns}
          isLoading={isLoading}
          onEdit={onEdit}
          onDelete={onDelete}
          onSendNow={onSendNow}
          onNewCampaign={onNewCampaign}
          isSending={isSending}
        />
      </TabsContent>
    </Tabs>
  );
};
