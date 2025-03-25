
import React, { useState } from "react";
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
  AlertCircle,
  Send
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
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
  React.useEffect(() => {
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

  // Enviar agora mutation (mock implementation)
  const sendNowMutation = useMutation({
    mutationFn: async (campaign: Campaign) => {
      // Simulação de envio - em produção isso chamaria uma API
      await new Promise(resolve => setTimeout(resolve, 1000));
      return campaign;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['campaigns'] });
      toast.success('Campanha enviada com sucesso');
    },
    onError: (error) => {
      toast.error(`Erro ao enviar campanha: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    },
  });

  const handleDeleteCampaign = (id: number) => {
    if (window.confirm('Tem certeza que deseja excluir esta campanha?')) {
      deleteMutation.mutate(id);
    }
  };

  const handleSendCampaignNow = (campaign: Campaign) => {
    sendNowMutation.mutate(campaign);
  };

  const handleEditCampaign = (campaign: Campaign) => {
    setSelectedCampaign(campaign);
    setEditCampaignDialogOpen(true);
  };
  
  const formatDate = (dateString: string | null) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString("pt-BR");
  };
  
  // Função para obter uma prévia da mensagem (limitada a 80 caracteres)
  const getMessagePreview = (message: string) => {
    if (!message) return "";
    return message.length > 80 ? `${message.substring(0, 80)}...` : message;
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
              <div className="flex flex-col gap-4">
                {filteredCampaigns.map((campaign) => (
                  <Card key={campaign.id} className="card-hover">
                    <div className="flex flex-col md:flex-row">
                      <div className="flex-1">
                        <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                          <div>
                            <CardTitle className="text-xl">{campaign.nome}</CardTitle>
                            <div className="mt-2">
                              <CampaignStatusBadge status={campaign.status} />
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            <div>
                              <h4 className="text-sm font-medium text-muted-foreground mb-1">Mensagem:</h4>
                              <p className="text-base">
                                {getMessagePreview(campaign.mensagem01)}
                              </p>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4 pt-2">
                              <div>
                                <h4 className="text-sm font-medium text-muted-foreground mb-1">Data:</h4>
                                <p className="flex items-center gap-2">
                                  <Calendar className="h-4 w-4" />
                                  {formatDate(campaign.data_disparo)}
                                </p>
                              </div>
                              
                              {campaign.tipo_midia && (
                                <div>
                                  <h4 className="text-sm font-medium text-muted-foreground mb-1">Tipo de mídia:</h4>
                                  <p className="capitalize">{campaign.tipo_midia}</p>
                                </div>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </div>
                      
                      <CardFooter className="flex-col gap-3 justify-center p-6 border-t md:border-t-0 md:border-l">
                        <Button 
                          variant="outline" 
                          className="w-full"
                          onClick={() => handleEditCampaign(campaign)}
                        >
                          <Edit className="mr-2 h-4 w-4" />
                          Editar
                        </Button>
                        
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="outline"
                              className="w-full border-green-500 hover:bg-green-50 text-green-600"
                            >
                              <Send className="mr-2 h-4 w-4" />
                              Enviar Agora
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Confirmar envio</AlertDialogTitle>
                              <AlertDialogDescription>
                                Deseja realmente disparar a campanha "{campaign.nome}" agora?
                                Esta ação não pode ser desfeita.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleSendCampaignNow(campaign)}>
                                Enviar
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                        
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="outline" className="w-full">
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
                    </div>
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
