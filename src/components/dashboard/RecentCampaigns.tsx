
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
  Zap
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchCampaigns, Campaign } from "@/lib/api/campaigns";
import { Skeleton } from "@/components/ui/skeleton";
import { EditCampaignDialog } from "@/components/campaigns/EditCampaignDialog";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

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
  
  const { data: campaigns = [], isLoading, error } = useQuery({
    queryKey: ['campaigns'],
    queryFn: fetchCampaigns,
  });
  
  const formatDate = (dateString: string | null) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString("pt-BR");
  };
  
  // Show only the most recent 5 campaigns
  const recentCampaigns = campaigns.slice(0, 5);
  
  // Function to get message preview (limited to 80 characters)
  const getMessagePreview = (message: string) => {
    if (!message) return "";
    return message.length > 80 ? `${message.substring(0, 80)}...` : message;
  };
  
  const handleEditCampaign = (campaign: Campaign) => {
    setSelectedCampaign(campaign);
    setEditCampaignDialogOpen(true);
  };

  // Calculate progress percentage for the campaign
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
                <th className="text-left text-xs font-medium text-muted-foreground px-6 py-3">MENSAGEM</th>
                <th className="text-left text-xs font-medium text-muted-foreground px-6 py-3">DATA</th>
                <th className="text-left text-xs font-medium text-muted-foreground px-6 py-3">TIPO</th>
                <th className="text-left text-xs font-medium text-muted-foreground px-6 py-3">ENVIADOS</th>
                <th className="text-left text-xs font-medium text-muted-foreground px-6 py-3">LIMITE</th>
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
                  <td className="px-6 py-4 text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <MessageSquare className="h-4 w-4" />
                      {getMessagePreview(campaign.mensagem01)}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-muted-foreground flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    {formatDate(campaign.data_disparo)}
                  </td>
                  <td className="px-6 py-4 capitalize">
                    {campaign.tipo_midia || "Texto"}
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Users className="h-4 w-4 text-blue-500" />
                        {campaign.enviados || 0}
                      </div>
                      <Progress 
                        value={getProgressPercentage(campaign.enviados || 0, campaign.limite_disparos || 1)} 
                        className="h-1.5 w-24"
                      />
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-green-500" />
                      {campaign.limite_disparos || 1000}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <CampaignStatusBadge status={campaign.status} />
                  </td>
                  <td className="px-6 py-4">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleEditCampaign(campaign)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
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
