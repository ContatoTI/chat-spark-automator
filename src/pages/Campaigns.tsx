
import React, { useState, useEffect } from "react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { 
  PlusCircle, 
  Search, 
  MessageSquare, 
  Calendar, 
  MoreHorizontal,
  Edit,
  Trash2,
  Copy,
  CheckCircle,
  Clock,
  AlertCircle
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { NewCampaignDialog } from "@/components/campaigns/NewCampaignDialog";
import { EditCampaignDialog } from "@/components/campaigns/EditCampaignDialog";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Campaign, fetchCampaigns, deleteCampaign, insertSampleCampaigns } from "@/lib/api/campaigns";

type CampaignStatus = "draft" | "scheduled" | "sending" | "completed" | "failed";

const statusConfig = {
  draft: {
    label: "Rascunho",
    icon: Edit,
    className: "text-slate-500 bg-slate-100 dark:bg-slate-800",
  },
  scheduled: {
    label: "Agendada",
    icon: Calendar,
    className: "text-blue-500 bg-blue-100 dark:bg-blue-900/20",
  },
  sending: {
    label: "Enviando",
    icon: Clock,
    className: "text-amber-500 bg-amber-100 dark:bg-amber-900/20",
  },
  completed: {
    label: "Concluída",
    icon: CheckCircle,
    className: "text-green-500 bg-green-100 dark:bg-green-900/20",
  },
  failed: {
    label: "Falhou",
    icon: AlertCircle,
    className: "text-red-500 bg-red-100 dark:bg-red-900/20",
  },
};

const CampaignStatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const config = statusConfig[status as CampaignStatus] || statusConfig.draft;
  const Icon = config.icon;
  
  return (
    <div className={cn(
      "flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full",
      config.className
    )}>
      <Icon className="h-3.5 w-3.5" />
      <span>{config.label}</span>
    </div>
  );
};

const Campaigns = () => {
  const [newCampaignDialogOpen, setNewCampaignDialogOpen] = useState(false);
  const [editCampaignDialogOpen, setEditCampaignDialogOpen] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTab, setSelectedTab] = useState<string>("all");
  const queryClient = useQueryClient();
  
  // Fetch campaigns with React Query
  const { data: campaigns = [], isLoading, error } = useQuery({
    queryKey: ['campaigns'],
    queryFn: fetchCampaigns,
  });

  // Initialize sample data if needed
  useEffect(() => {
    insertSampleCampaigns().catch(console.error);
  }, []);
  
  // Delete campaign mutation
  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteCampaign(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['campaigns'] });
      toast.success('Campanha excluída com sucesso');
    },
    onError: (error) => {
      toast.error(`Erro ao excluir campanha: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    },
  });

  const handleDeleteCampaign = (id: number) => {
    if (window.confirm('Tem certeza que deseja excluir esta campanha?')) {
      deleteMutation.mutate(id);
    }
  };

  const handleEditCampaign = (campaign: Campaign) => {
    setSelectedCampaign(campaign);
    setEditCampaignDialogOpen(true);
  };
  
  const formatDate = (dateString: string | null) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString("pt-BR");
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
          <Button 
            className="w-full sm:w-auto bg-primary"
            onClick={() => setNewCampaignDialogOpen(true)}
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Nova Campanha
          </Button>
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
            {isLoading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
              </div>
            ) : filteredCampaigns.length === 0 ? (
              <div className="text-center py-12">
                <h3 className="font-medium text-lg">Nenhuma campanha encontrada</h3>
                <p className="text-muted-foreground mt-1">Crie uma nova campanha para começar</p>
                <Button 
                  className="mt-4 bg-primary"
                  onClick={() => setNewCampaignDialogOpen(true)}
                >
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Nova Campanha
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCampaigns.map((campaign) => (
                  <Card key={campaign.id} className="card-hover">
                    <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                      <div className="space-y-1">
                        <CardTitle>{campaign.nome}</CardTitle>
                      </div>
                      <CampaignStatusBadge status={campaign.status} />
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-4">
                        {campaign.mensagem01}
                      </p>
                      
                      {campaign.mensagem02 && (
                        <p className="text-sm text-muted-foreground mb-2">
                          {campaign.mensagem02}
                        </p>
                      )}
                      
                      {campaign.status !== "draft" && (
                        <div className="flex flex-col gap-2 mt-4">
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Data:</span>
                            <span className="font-medium">
                              {formatDate(campaign.data_disparo)}
                            </span>
                          </div>
                          {campaign.tipo_midia && (
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">Tipo de mídia:</span>
                              <span className="font-medium capitalize">{campaign.tipo_midia}</span>
                            </div>
                          )}
                          {campaign.url_midia && (
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">URL:</span>
                              <span className="font-medium truncate max-w-[150px]">
                                {campaign.url_midia}
                              </span>
                            </div>
                          )}
                        </div>
                      )}
                    </CardContent>
                    <CardFooter className="justify-between gap-2">
                      <Button 
                        variant="outline" 
                        className="w-1/2"
                        onClick={() => handleEditCampaign(campaign)}
                      >
                        <Edit className="mr-2 h-4 w-4" />
                        Editar
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" className="w-1/2">
                            <MoreHorizontal className="mr-2 h-4 w-4" />
                            Ações
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-40">
                          <DropdownMenuLabel>Opções</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>
                            <Copy className="mr-2 h-4 w-4" />
                            Duplicar
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <MessageSquare className="mr-2 h-4 w-4" />
                            Enviar Agora
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            className="text-red-600"
                            onClick={() => campaign.id && handleDeleteCampaign(campaign.id)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Excluir
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
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
