import React, { useState } from "react";
import { 
  Check, 
  Clock, 
  AlertCircle,
  Calendar,
  ArrowUpRight,
  Edit,
  MessageSquare,
  Users,
  Zap,
  Trash2,
  Send,
  Copy
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useCampaignOperations } from "@/hooks/useCampaignOperations";
import { Campaign } from "@/lib/api/campaigns";
import { EditCampaignDialog } from "@/components/campaigns/EditCampaignDialog";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
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
import { useCampaignStatusCalculator } from "@/hooks/useCampaignStatusCalculator";
import { formatLocalDate } from "@/utils/dateUtils";

type CampaignStatus = "draft" | "scheduled" | "sending" | "completed" | "failed";

const statusConfig = {
  draft: {
    label: "Rascunho",
    icon: Edit,
    className: "text-slate-500 bg-slate-50 dark:bg-slate-800",
  },
  scheduled: {
    label: "Agendada",
    icon: Clock,
    className: "text-blue-500 bg-blue-50 dark:bg-blue-900/20",
  },
  sending: {
    label: "Enviando",
    icon: Clock,
    className: "text-amber-500 bg-amber-50 dark:bg-amber-900/20",
  },
  completed: {
    label: "Concluída",
    icon: Check,
    className: "text-green-500 bg-green-50 dark:bg-green-900/20",
  },
  failed: {
    label: "Falhou",
    icon: AlertCircle,
    className: "text-red-500 bg-red-50 dark:bg-red-900/20",
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

export const RecentCampaigns: React.FC = () => {
  const [editCampaignDialogOpen, setEditCampaignDialogOpen] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  
  const { user, selectedCompany } = useAuth();
  
  const { 
    campaigns = [], 
    isLoading, 
    error, 
    handleDeleteCampaign,
    handleSendCampaignNow,
    sendNowMutation 
  } = useCampaignOperations();

  const { updateCampaignsStatus } = useCampaignStatusCalculator();
  
  const formatDate = (dateString: string | null) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString("pt-BR");
  };
  
  const filteredCampaigns = React.useMemo(() => {
    if (user?.role === 'master' && selectedCompany) {
      return campaigns.filter(campaign => campaign.empresa_id === selectedCompany);
    }
    return campaigns;
  }, [campaigns, user?.role, selectedCompany]);
  
  const processedCampaigns = updateCampaignsStatus(filteredCampaigns);
  
  const recentCampaigns = processedCampaigns.slice(0, 5);
  
  const getMessagePreview = (message: string) => {
    if (!message) return "";
    return message.length > 80 ? `${message.substring(0, 80)}...` : message;
  };
  
  const handleEditCampaign = (campaign: Campaign) => {
    setSelectedCampaign(campaign);
    setEditCampaignDialogOpen(true);
  };

  const handleDuplicateCampaign = (campaign: Campaign) => {
    setSelectedCampaign({
      ...campaign,
      id: null,
      nome: `Cópia de ${campaign.nome}`,
      enviados: 0,
      status: 'rascunho'
    });
    setEditCampaignDialogOpen(true);
  };

  const getProgressPercentage = (enviados: number, limite: number) => {
    if (limite <= 0) return 0;
    const percentage = (enviados / limite) * 100;
    return Math.min(percentage, 100);
  };

  return (
    <div className="glass-panel overflow-hidden">
      <div className="flex items-center justify-between p-6 border-b">
        <h2 className="text-xl font-semibold">Campanhas Recentes</h2>
        <Button variant="outline" size="sm" asChild>
          <Link to="/campaigns" className="flex items-center gap-1">
            <span>Ver todas</span>
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>
      <div className="overflow-x-auto">
        {isLoading ? (
          <div className="p-6 space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-4">
                <Skeleton className="h-6 w-40" />
                <Skeleton className="h-6 w-20" />
                <Skeleton className="h-6 w-20 ml-auto" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="p-6 text-center">
            <p className="text-red-500">Erro ao carregar campanhas</p>
          </div>
        ) : recentCampaigns.length === 0 ? (
          <div className="p-6 text-center">
            <p className="text-muted-foreground">Nenhuma campanha encontrada</p>
            <Button variant="default" size="sm" className="mt-4" asChild>
              <Link to="/campaigns">Criar Campanha</Link>
            </Button>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b bg-muted/40">
                <th className="text-left text-xs font-medium text-muted-foreground px-6 py-3">NOME</th>
                <th className="text-left text-xs font-medium text-muted-foreground px-6 py-3">TIPO</th>
                <th className="text-left text-xs font-medium text-muted-foreground px-6 py-3">DATA</th>
                <th className="text-left text-xs font-medium text-muted-foreground px-6 py-3">ANDAMENTO</th>
                <th className="text-left text-xs font-medium text-muted-foreground px-6 py-3">STATUS</th>
                <th className="text-left text-xs font-medium text-muted-foreground px-6 py-3">AÇÕES</th>
              </tr>
            </thead>
            <tbody>
              {recentCampaigns.map((campaign) => (
                <tr 
                  key={campaign.id} 
                  className="border-b hover:bg-muted/20 transition-colors"
                >
                  <td className="px-6 py-4 font-medium">
                    <div className="flex items-center gap-2">
                      {campaign.producao && (
                        <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-300">
                          <Zap className="h-3 w-3 mr-1" />
                          Prod
                        </Badge>
                      )}
                      {campaign.nome}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-muted-foreground capitalize">
                    {campaign.tipo_midia || "Texto"}
                  </td>
                  <td className="px-6 py-4 text-muted-foreground flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    {formatLocalDate(campaign.data_disparo)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center justify-between text-xs">
                        <span>Enviados:</span>
                        <span className="font-medium">{campaign.enviados || 0}</span>
                      </div>
                      <Progress 
                        value={getProgressPercentage(campaign.enviados || 0, campaign.limite_disparos || 1)} 
                        className="h-1.5 w-full"
                      />
                      <div className="flex items-center justify-between text-xs">
                        <span>Limite:</span>
                        <span className="font-medium">{campaign.limite_disparos || 1000}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <CampaignStatusBadge status={campaign.status} />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1">
                      <Button 
                        variant="ghost" 
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handleEditCampaign(campaign)}
                      >
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">Editar</span>
                      </Button>

                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            className="h-8 w-8 text-green-600"
                            disabled={sendNowMutation.isPending}
                          >
                            <Send className="h-4 w-4" />
                            <span className="sr-only">Enviar Agora</span>
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

                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8"
                        onClick={() => handleDuplicateCampaign(campaign)}
                      >
                        <Copy className="h-4 w-4" />
                        <span className="sr-only">Duplicar</span>
                      </Button>

                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            className="h-8 w-8 text-red-600"
                          >
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Excluir</span>
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                            <AlertDialogDescription>
                              Deseja realmente excluir a campanha "{campaign.nome}"?
                              Esta ação não pode ser desfeita.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction 
                              onClick={() => campaign.id && handleDeleteCampaign(campaign.id)}
                              className="bg-red-500 hover:bg-red-600"
                            >
                              Excluir
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      
      <EditCampaignDialog 
        open={editCampaignDialogOpen} 
        onOpenChange={setEditCampaignDialogOpen}
        campaign={selectedCampaign}
      />
    </div>
  );
};
