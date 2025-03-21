
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
  AlertCircle
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { NewCampaignDialog } from "@/components/campaigns/NewCampaignDialog";
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

type CampaignStatus = "draft" | "scheduled" | "sending" | "completed" | "failed";

interface Campaign {
  id: string;
  name: string;
  description: string;
  status: CampaignStatus;
  date: string;
  contacts: number;
  delivered: number;
}

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

const CampaignStatusBadge: React.FC<{ status: CampaignStatus }> = ({ status }) => {
  const config = statusConfig[status];
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

// Mock data for campaigns
const mockCampaigns: Campaign[] = [
  {
    id: "1",
    name: "Promoção de Verão",
    description: "20% de desconto em todos os produtos durante o verão",
    status: "completed",
    date: "2023-07-15",
    contacts: 578,
    delivered: 562,
  },
  {
    id: "2",
    name: "Lançamento Produto X",
    description: "Anúncio do novo produto X com condições especiais",
    status: "scheduled",
    date: "2023-08-01",
    contacts: 1024,
    delivered: 0,
  },
  {
    id: "3",
    name: "Pesquisa de Satisfação",
    description: "Pesquisa para avaliar a satisfação dos clientes",
    status: "failed",
    date: "2023-06-25",
    contacts: 245,
    delivered: 132,
  },
  {
    id: "4",
    name: "Atualização do Sistema",
    description: "Informações sobre a atualização do sistema",
    status: "completed",
    date: "2023-07-10",
    contacts: 1890,
    delivered: 1852,
  },
  {
    id: "5",
    name: "Convite para Evento",
    description: "Convite para o evento anual da empresa",
    status: "draft",
    date: "",
    contacts: 0,
    delivered: 0,
  },
  {
    id: "6",
    name: "Confirmação de Pedido",
    description: "Mensagem automática de confirmação de pedidos",
    status: "sending",
    date: "2023-07-20",
    contacts: 125,
    delivered: 58,
  },
];

const Campaigns = () => {
  const [newCampaignDialogOpen, setNewCampaignDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTab, setSelectedTab] = useState<string>("all");
  
  const filteredCampaigns = mockCampaigns
    .filter((campaign) => {
      const matchesSearch = campaign.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesTab = selectedTab === "all" || campaign.status === selectedTab;
      return matchesSearch && matchesTab;
    });

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
                Mostrando {filteredCampaigns.length} de {mockCampaigns.length} campanhas
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCampaigns.map((campaign) => (
                <Card key={campaign.id} className="card-hover">
                  <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                    <div className="space-y-1">
                      <CardTitle>{campaign.name}</CardTitle>
                    </div>
                    <CampaignStatusBadge status={campaign.status} />
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      {campaign.description}
                    </p>
                    
                    {campaign.status !== "draft" && (
                      <div className="flex flex-col gap-2 mt-4">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Data:</span>
                          <span className="font-medium">
                            {campaign.date ? new Date(campaign.date).toLocaleDateString("pt-BR") : "-"}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Contatos:</span>
                          <span className="font-medium">{campaign.contacts}</span>
                        </div>
                        {campaign.status !== "scheduled" && (
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Entregues:</span>
                            <span className="font-medium">
                              {campaign.delivered} 
                              {campaign.contacts > 0 && (
                                <span className="text-xs text-muted-foreground ml-1">
                                  ({Math.round((campaign.delivered / campaign.contacts) * 100)}%)
                                </span>
                              )}
                            </span>
                          </div>
                        )}
                      </div>
                    )}
                  </CardContent>
                  <CardFooter className="justify-between gap-2">
                    <Button variant="outline" className="w-1/2">
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
                        <DropdownMenuItem className="text-red-600">
                          <Trash2 className="mr-2 h-4 w-4" />
                          Excluir
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
      
      <NewCampaignDialog 
        open={newCampaignDialogOpen} 
        onOpenChange={setNewCampaignDialogOpen} 
      />
    </Layout>
  );
};

export default Campaigns;
