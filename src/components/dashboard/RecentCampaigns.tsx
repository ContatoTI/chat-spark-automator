
import React from "react";
import { 
  Check, 
  Clock, 
  AlertCircle,
  Calendar,
  Users,
  ArrowUpRight
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

type CampaignStatus = "completed" | "scheduled" | "failed";

interface Campaign {
  id: string;
  name: string;
  date: string;
  contacts: number;
  delivered: number;
  status: CampaignStatus;
}

const statusConfig = {
  completed: {
    label: "Concluída",
    icon: Check,
    className: "text-green-500 bg-green-50 dark:bg-green-900/20",
  },
  scheduled: {
    label: "Agendada",
    icon: Clock,
    className: "text-amber-500 bg-amber-50 dark:bg-amber-900/20",
  },
  failed: {
    label: "Falhou",
    icon: AlertCircle,
    className: "text-red-500 bg-red-50 dark:bg-red-900/20",
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

const mockData: Campaign[] = [
  {
    id: "1",
    name: "Promoção de Verão",
    date: "2023-07-15",
    contacts: 578,
    delivered: 562,
    status: "completed",
  },
  {
    id: "2",
    name: "Lançamento Produto X",
    date: "2023-08-01",
    contacts: 1024,
    delivered: 0,
    status: "scheduled",
  },
  {
    id: "3",
    name: "Pesquisa de Satisfação",
    date: "2023-06-25",
    contacts: 245,
    delivered: 132,
    status: "failed",
  },
  {
    id: "4",
    name: "Atualização do Sistema",
    date: "2023-07-10",
    contacts: 1890,
    delivered: 1852,
    status: "completed",
  },
  {
    id: "5",
    name: "Convite para Evento",
    date: "2023-08-20",
    contacts: 350,
    delivered: 0,
    status: "scheduled",
  },
];

export const RecentCampaigns: React.FC = () => {
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
        <table className="w-full">
          <thead>
            <tr className="border-b bg-muted/40">
              <th className="text-left text-xs font-medium text-muted-foreground px-6 py-3">NOME</th>
              <th className="text-left text-xs font-medium text-muted-foreground px-6 py-3">DATA</th>
              <th className="text-left text-xs font-medium text-muted-foreground px-6 py-3">CONTATOS</th>
              <th className="text-left text-xs font-medium text-muted-foreground px-6 py-3">ENTREGUES</th>
              <th className="text-left text-xs font-medium text-muted-foreground px-6 py-3">STATUS</th>
            </tr>
          </thead>
          <tbody>
            {mockData.map((campaign) => (
              <tr 
                key={campaign.id} 
                className="border-b hover:bg-muted/20 transition-colors"
              >
                <td className="px-6 py-4 font-medium">{campaign.name}</td>
                <td className="px-6 py-4 text-muted-foreground flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  {new Date(campaign.date).toLocaleDateString("pt-BR")}
                </td>
                <td className="px-6 py-4 flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  {campaign.contacts}
                </td>
                <td className="px-6 py-4">
                  {campaign.status === "scheduled" ? (
                    <span className="text-muted-foreground">Pendente</span>
                  ) : (
                    <span>
                      {campaign.delivered} <span className="text-muted-foreground">({Math.round((campaign.delivered / campaign.contacts) * 100)}%)</span>
                    </span>
                  )}
                </td>
                <td className="px-6 py-4">
                  <CampaignStatusBadge status={campaign.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
