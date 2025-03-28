
import React, { useState } from "react";
import { Campaign } from "@/lib/api/campaigns";
import { Calendar } from "@/components/ui/calendar";
import { Card } from "@/components/ui/card";
import { CampaignStatusBadge } from "./CampaignStatusBadge";
import { Edit, Trash2, Send, Copy } from "lucide-react";
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
import { toast } from "sonner";
import { updateCampaign } from "@/lib/api/campaigns";
import { cn } from "@/lib/utils";

interface CampaignCalendarViewProps {
  campaigns: Campaign[];
  onEdit: (campaign: Campaign) => void;
  onDelete: (id: number) => void;
  onSendNow: (campaign: Campaign) => void;
  onDuplicate: (campaign: Campaign) => void;
  isSending: boolean;
}

export const CampaignCalendarView: React.FC<CampaignCalendarViewProps> = ({
  campaigns,
  onEdit,
  onDelete,
  onSendNow,
  onDuplicate,
  isSending
}) => {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [draggingCampaign, setDraggingCampaign] = useState<Campaign | null>(null);

  // Agrupa campanhas por data
  const campaignsByDate = campaigns.reduce<Record<string, Campaign[]>>((acc, campaign) => {
    if (campaign.data_disparo) {
      const dateStr = new Date(campaign.data_disparo).toDateString();
      if (!acc[dateStr]) {
        acc[dateStr] = [];
      }
      acc[dateStr].push(campaign);
    }
    return acc;
  }, {});

  // Função para lidar com o início do arraste
  const handleDragStart = (campaign: Campaign) => {
    setDraggingCampaign(campaign);
  };

  // Função para lidar com o término do arraste
  const handleDragEnd = () => {
    setDraggingCampaign(null);
  };

  // Função para lidar com o soltar em uma data
  const handleDropOnDate = async (date: Date) => {
    if (!draggingCampaign || !draggingCampaign.id) return;

    try {
      // Atualizar a data da campanha
      const updatedCampaign = {
        ...draggingCampaign,
        data_disparo: date.toISOString()
      };

      // Chamar API para atualizar a campanha
      await updateCampaign(draggingCampaign.id, { data_disparo: date.toISOString() });
      
      // Mostrar notificação de sucesso
      toast.success(`Campanha "${draggingCampaign.nome}" reagendada para ${date.toLocaleDateString("pt-BR")}`);

      // Limpar o estado de arraste
      setDraggingCampaign(null);
    } catch (error) {
      console.error("Erro ao reagendar campanha:", error);
      toast.error("Erro ao reagendar campanha");
    }
  };

  // Função para verificar se uma data é hoje
  const isToday = (date: Date) => {
    const today = new Date();
    return date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear();
  };

  // Função para obter cor de fundo baseada no status da campanha
  const getCampaignBgColor = (status: string) => {
    switch (status) {
      case 'rascunho':
        return 'bg-slate-100 border-slate-200 dark:bg-slate-800 dark:border-slate-700';
      case 'agendada':
        return 'bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800/50';
      case 'em_andamento':
        return 'bg-amber-50 border-amber-200 dark:bg-amber-900/20 dark:border-amber-800/50';
      case 'concluida':
        return 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800/50';
      case 'failed':
        return 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800/50';
      default:
        return 'bg-slate-100 border-slate-200 dark:bg-slate-800 dark:border-slate-700';
    }
  };

  // Custom day renderer for Calendar
  const renderDay = (day: Date) => {
    const dateStr = day.toDateString();
    const dayCampaigns = campaignsByDate[dateStr] || [];
    const isCurrentDay = isToday(day);
    
    return (
      <div 
        className={cn(
          "relative h-full min-h-[120px] border-t hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors",
          isCurrentDay && "bg-blue-50 dark:bg-blue-900/20"
        )}
        onDragOver={(e) => {
          e.preventDefault();
          e.currentTarget.classList.add('bg-slate-100', 'dark:bg-slate-800');
        }}
        onDragLeave={(e) => {
          e.currentTarget.classList.remove('bg-slate-100', 'dark:bg-slate-800');
        }}
        onDrop={(e) => {
          e.preventDefault();
          e.currentTarget.classList.remove('bg-slate-100', 'dark:bg-slate-800');
          handleDropOnDate(day);
        }}
      >
        <div className={cn(
          "absolute top-1 left-2 font-semibold text-sm",
          isCurrentDay && "bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
        )}>
          {day.getDate()}
        </div>
        <div className="pt-6 px-1 max-h-[150px] overflow-y-auto space-y-1">
          {dayCampaigns.map((campaign) => (
            <div 
              key={campaign.id}
              className={cn(
                "text-xs p-2 rounded-md border shadow-sm cursor-move hover:shadow-md transition-all duration-200",
                getCampaignBgColor(campaign.status)
              )}
              draggable
              onDragStart={() => handleDragStart(campaign)}
              onDragEnd={handleDragEnd}
            >
              <div className="flex items-center justify-between gap-2">
                <div className="font-medium truncate flex-1">{campaign.nome}</div>
                <button 
                  onClick={(e) => { e.stopPropagation(); onEdit(campaign); }}
                  className="text-slate-500 hover:text-blue-500 transition-colors p-0.5 rounded-full hover:bg-white"
                >
                  <Edit className="h-4 w-4" />
                  <span className="sr-only">Editar</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <Card className="overflow-hidden border rounded-md">
        <div className="p-0">
          <Calendar
            mode="single"
            month={currentDate}
            onMonthChange={setCurrentDate}
            selected={undefined}
            className="w-full"
            showOutsideDays={true}
            fixedWeeks={true}
            ISOWeek={false}
            formatters={{
              formatDay: (date) => {
                // Render customized days
                return renderDay(date);
              },
            }}
          />
        </div>
      </Card>
      <div className="text-center text-sm text-muted-foreground">
        Arraste e solte as campanhas para reagendá-las
      </div>
    </div>
  );
};
