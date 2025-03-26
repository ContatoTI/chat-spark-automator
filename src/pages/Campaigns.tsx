
import React, { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { NewCampaignDialog } from "@/components/campaigns/NewCampaignDialog";
import { EditCampaignDialog } from "@/components/campaigns/EditCampaignDialog";
import { insertSampleCampaigns } from "@/lib/api/campaigns";
import { useCampaignOperations } from "@/hooks/useCampaignOperations";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { CampaignHeader } from "@/components/campaigns/CampaignHeader";
import { CampaignSearch } from "@/components/campaigns/CampaignSearch";
import { CampaignFilters } from "@/components/campaigns/CampaignFilters";
import { CampaignError } from "@/components/campaigns/CampaignError";

const Campaigns = () => {
  const [newCampaignDialogOpen, setNewCampaignDialogOpen] = useState(false);
  const [editCampaignDialogOpen, setEditCampaignDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTab, setSelectedTab] = useState<string>("all");
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const {
    campaigns,
    isLoading,
    error,
    selectedCampaign,
    setSelectedCampaign,
    handleDeleteCampaign,
    handleSendCampaignNow,
    handleEditCampaign,
    sendNowMutation
  } = useCampaignOperations();

  React.useEffect(() => {
    // Inicialização das campanhas de exemplo
    insertSampleCampaigns().catch(console.error);
  }, []);

  const openEditDialog = (campaign: React.SetStateAction<import("@/lib/api/campaigns").Campaign | null>) => {
    setSelectedCampaign(campaign);
    setEditCampaignDialogOpen(true);
  };
  
  const handleRefreshCampaigns = () => {
    queryClient.invalidateQueries({ queryKey: ['campaigns'] });
    toast({
      title: "Atualizando campanhas",
      description: "Lista de campanhas atualizada."
    });
  };

  const filteredCampaigns = campaigns
    .filter((campaign) => {
      const matchesSearch = campaign.nome.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesTab = selectedTab === "all" || campaign.status === selectedTab;
      return matchesSearch && matchesTab;
    });
    
  if (error) {
    return (
      <Layout>
        <CampaignError error={error} onRefresh={handleRefreshCampaigns} />
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="flex flex-col gap-8">
        <CampaignHeader 
          onNewCampaign={() => setNewCampaignDialogOpen(true)}
          onRefresh={handleRefreshCampaigns}
          isLoading={isLoading}
        />

        <CampaignSearch 
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          totalFiltered={filteredCampaigns.length}
          totalCampaigns={campaigns.length}
          isLoading={isLoading}
        />

        <CampaignFilters 
          selectedTab={selectedTab}
          setSelectedTab={setSelectedTab}
          filteredCampaigns={filteredCampaigns}
          isLoading={isLoading}
          onEdit={openEditDialog}
          onDelete={handleDeleteCampaign}
          onSendNow={handleSendCampaignNow}
          onNewCampaign={() => setNewCampaignDialogOpen(true)}
          isSending={sendNowMutation.isPending}
        />
      </div>
      
      <NewCampaignDialog 
        open={newCampaignDialogOpen} 
        onOpenChange={setNewCampaignDialogOpen} 
      />
      
      <EditCampaignDialog 
        open={editCampaignDialogOpen} 
        onOpenChange={setEditCampaignDialogOpen}
        campaign={selectedCampaign}
      />
    </Layout>
  );
};

export default Campaigns;
