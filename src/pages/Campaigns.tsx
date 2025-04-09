
import React, { useState, useEffect } from "react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { NewCampaignDialog } from "@/components/campaigns/NewCampaignDialog";
import { EditCampaignDialog } from "@/components/campaigns/EditCampaignDialog";
import { cn } from "@/lib/utils";
import { insertSampleCampaigns } from "@/lib/api/campaigns";
import { CampaignList } from "@/components/campaigns/CampaignList";
import { useCampaignOperations } from "@/hooks/useCampaignOperations";
import useCampaignStatusCalculator from "@/hooks/useCampaignStatusCalculator";

const Campaigns = () => {
  const [newCampaignDialogOpen, setNewCampaignDialogOpen] = useState(false);
  const [editCampaignDialogOpen, setEditCampaignDialogOpen] = useState(false);
  const {
    campaigns: rawCampaigns,
    isLoading,
    error,
    selectedCampaign,
    setSelectedCampaign,
    handleDeleteCampaign,
    handleSendCampaignNow,
    handleEditCampaign,
    sendNowMutation
  } = useCampaignOperations();

  // Use o hook de cálculo de status para garantir que todas as campanhas tenham o status correto
  const {
    updateCampaignsStatus
  } = useCampaignStatusCalculator();
  const campaigns = updateCampaignsStatus(rawCampaigns);
  
  React.useEffect(() => {
    insertSampleCampaigns().catch(console.error);
  }, []);
  
  const openEditDialog = (campaign: React.SetStateAction<import("@/lib/api/campaigns").Campaign | null>) => {
    setSelectedCampaign(campaign);
    setEditCampaignDialogOpen(true);
  };

  // Add duplicate campaign handler
  const handleDuplicateCampaign = (campaign: import("@/lib/api/campaigns").Campaign) => {
    // For now, just open the dialog with campaign data for user to modify
    setSelectedCampaign({
      ...campaign,
      id: null,
      // Clear ID for new campaign
      nome: `Cópia de ${campaign.nome}`,
      enviados: 0,
      // Reset sent count
      status: 'rascunho' // Reset status to draft
    });
    setNewCampaignDialogOpen(true);
  };
  
  if (error) {
    return <Layout>
        <div className="flex flex-col gap-8">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-semibold tracking-tight">Campanhas</h1>
          </div>
          <div className="p-8 text-center">
            <h2 className="text-xl font-medium text-red-600 mb-2">Erro ao carregar campanhas</h2>
            <p className="text-muted-foreground">{error instanceof Error ? error.message : 'Erro desconhecido'}</p>
          </div>
        </div>
      </Layout>;
  }
  
  return <Layout>
      <div className="flex flex-col gap-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">Campanhas</h1>
            <p className="text-muted-foreground mt-1">
              Gerencie suas campanhas de WhatsApp
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <Button onClick={() => setNewCampaignDialogOpen(true)}>
              <PlusCircle className="h-4 w-4 mr-2" />
              Nova Campanha
            </Button>
          </div>
        </div>

        <CampaignList 
          campaigns={campaigns} 
          isLoading={isLoading} 
          onEdit={openEditDialog} 
          onDelete={handleDeleteCampaign} 
          onSendNow={handleSendCampaignNow} 
          onDuplicate={handleDuplicateCampaign} 
          onNewCampaign={() => setNewCampaignDialogOpen(true)} 
          isSending={sendNowMutation.isPending} 
        />
      </div>
      
      <NewCampaignDialog open={newCampaignDialogOpen} onOpenChange={setNewCampaignDialogOpen} />
      
      <EditCampaignDialog open={editCampaignDialogOpen} onOpenChange={setEditCampaignDialogOpen} campaign={selectedCampaign} />
    </Layout>;
};

export default Campaigns;
