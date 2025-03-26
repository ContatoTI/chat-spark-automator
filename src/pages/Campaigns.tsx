
import React, { useState, useEffect } from "react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { PlusCircle, Search, RefreshCw } from "lucide-react";
import { Input } from "@/components/ui/input";
import { NewCampaignDialog } from "@/components/campaigns/NewCampaignDialog";
import { EditCampaignDialog } from "@/components/campaigns/EditCampaignDialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { insertSampleCampaigns } from "@/lib/api/campaigns";
import { CampaignList } from "@/components/campaigns/CampaignList";
import { useCampaignOperations } from "@/hooks/useCampaignOperations";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";

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
        <div className="flex flex-col gap-8">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-semibold tracking-tight">Campanhas</h1>
            <Button variant="outline" onClick={handleRefreshCampaigns}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Atualizar
            </Button>
          </div>
          <div className="p-8 text-center">
            <h2 className="text-xl font-medium text-red-600 mb-2">Erro ao carregar campanhas</h2>
            <p className="text-muted-foreground">{error instanceof Error ? error.message : 'Erro desconhecido'}</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="flex flex-col gap-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">Campanhas</h1>
            <p className="text-muted-foreground mt-1">
              Gerencie suas campanhas de WhatsApp
            </p>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={handleRefreshCampaigns}
              disabled={isLoading}
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Atualizar
            </Button>
            <Button 
              className="w-full sm:w-auto bg-primary"
              onClick={() => setNewCampaignDialogOpen(true)}
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              Nova Campanha
            </Button>
          </div>
        </div>

        <div className="glass-panel px-4 py-3">
          <div className="flex flex-col md:flex-row gap-4 w-full items-center">
            <div className="relative w-full md:max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar campanhas..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex-1 hidden md:flex justify-end">
              <p className="text-sm text-muted-foreground">
                {isLoading 
                  ? "Carregando campanhas..." 
                  : `Mostrando ${filteredCampaigns.length} de ${campaigns.length} campanhas`}
              </p>
            </div>
          </div>
        </div>

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
              onEdit={openEditDialog}
              onDelete={handleDeleteCampaign}
              onSendNow={handleSendCampaignNow}
              onNewCampaign={() => setNewCampaignDialogOpen(true)}
              isSending={sendNowMutation.isPending}
            />
          </TabsContent>
        </Tabs>
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
