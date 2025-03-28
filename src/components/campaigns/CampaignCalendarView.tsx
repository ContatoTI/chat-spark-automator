
import React, { useState } from "react";
import { Campaign } from "@/lib/api/campaigns";
import { Calendar } from "@/components/ui/calendar";
import { Card } from "@/components/ui/card";
import { Edit } from "lucide-react";
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
        return 'bg-yellow-100 border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-800/50';
      case 'agendada':
        return 'bg-blue-100 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800/50';
      case 'em_andamento':
        return 'bg-amber-100 border-amber-200 dark:bg-amber-900/20 dark:border-amber-800/50';
      case 'concluida':
        return 'bg-green-100 border-green-200 dark:bg-green-900/20 dark:border-green-800/50';
      case 'failed':
        return 'bg-red-100 border-red-200 dark:bg-red-900/20 dark:border-red-800/50';
      default:
        return 'bg-gray-100 border-gray-200 dark:bg-gray-800 dark:border-gray-700';
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
          "relative h-full min-h-[100px] w-full border-t p-0",
          isCurrentDay ? "bg-blue-50 dark:bg-blue-900/10" : "hover:bg-slate-50/50 dark:hover:bg-slate-900/20"
        )}
        onDragOver={(e) => {
          e.preventDefault();
          e.currentTarget.classList.add('bg-slate-100', 'dark:bg-slate-800/50');
        }}
        onDragLeave={(e) => {
          e.currentTarget.classList.remove('bg-slate-100', 'dark:bg-slate-800/50');
        }}
        onDrop={(e) => {
          e.preventDefault();
          e.currentTarget.classList.remove('bg-slate-100', 'dark:bg-slate-800/50');
          handleDropOnDate(day);
        }}
      >
        <div className={cn(
          "absolute top-1 right-1 font-medium text-sm",
          isCurrentDay ? "text-sm h-6 w-6 rounded-full bg-blue-500 text-white flex items-center justify-center" : "text-muted-foreground"
        )}>
          {day.getDate()}
        </div>
        <div className="pt-7 px-1 space-y-1 overflow-visible">
          {dayCampaigns.map((campaign) => (
            <div 
              key={campaign.id}
              className={cn(
                "px-2 py-1 text-xs rounded-md border cursor-move transition-all duration-100",
                getCampaignBgColor(campaign.status)
              )}
              draggable
              onDragStart={() => handleDragStart(campaign)}
              onDragEnd={handleDragEnd}
            >
              <div className="flex items-center justify-between">
                <div className="font-medium truncate max-w-[85%]">
                  {campaign.nome.length > 18 ? campaign.nome.substring(0, 16) + '...' : campaign.nome}
                </div>
                <button 
                  onClick={(e) => { e.stopPropagation(); onEdit(campaign); }}
                  className="text-gray-500 hover:text-blue-500 transition-colors"
                >
                  <Edit className="h-3.5 w-3.5" />
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
      <Card className="overflow-hidden rounded-md">
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
      </Card>
      <div className="text-center text-sm text-muted-foreground">
        Arraste e solte as campanhas para reagendá-las
      </div>
    </div>
  );
};
