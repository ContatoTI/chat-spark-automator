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
      await updateCampaign(draggingCampaign.id, {
        data_disparo: date.toISOString()
      });

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
    return date.getDate() === today.getDate() && date.getMonth() === today.getMonth() && date.getFullYear() === today.getFullYear();
  };

  // Função para obter cor de fundo baseada no status da campanha
  const getCampaignBgColor = (status: string) => {
    switch (status) {
      case 'rascunho':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-200';
      case 'agendada':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-200';
      case 'em_andamento':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-200';
      case 'concluida':
        return 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-200';
      case 'failed':
        return 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800/70 dark:text-gray-200';
    }
  };

  // Custom day renderer for Calendar
  const renderDay = (day: Date) => {
    const dateStr = day.toDateString();
    const dayCampaigns = campaignsByDate[dateStr] || [];
    const isCurrentDay = isToday(day);
    return <div className={cn("relative h-full w-full min-h-[110px] p-0", isCurrentDay ? "bg-yellow-100/70 dark:bg-yellow-900/20" : "")} onDragOver={e => {
      e.preventDefault();
      e.currentTarget.classList.add('bg-slate-100', 'dark:bg-slate-800/50');
    }} onDragLeave={e => {
      e.currentTarget.classList.remove('bg-slate-100', 'dark:bg-slate-800/50');
    }} onDrop={e => {
      e.preventDefault();
      e.currentTarget.classList.remove('bg-slate-100', 'dark:bg-slate-800/50');
      handleDropOnDate(day);
    }}>
        {dayCampaigns.length > 0 ?
      // Se houver campanhas, o dia inteiro será preenchido com a cor
      <div className="Isto precisa ficar quadrado ocupando todo o espa\xE7o do quadrado de dia, n\xE3o pode ficar vertical desse jeito. precisa fica igual ao da imagem que eu te mandei. Corrija por favor, tem algo quebrado neste elemento">
            <div className="flex justify-end">
              <div className={cn("w-6 h-6 flex items-center justify-center text-sm font-medium rounded-full mb-1", isCurrentDay ? "bg-white/80 text-primary" : "text-inherit")}>
                {day.getDate()}
              </div>
            </div>
            
            <div className="flex-1 flex flex-col justify-between">
              <div className="font-medium">
                {dayCampaigns[0].nome}
              </div>
              
              <div className="flex justify-between items-center mt-1">
                <div className="text-xs">
                  {new Date(dayCampaigns[0].data_disparo).toLocaleTimeString('pt-BR', {
                hour: '2-digit',
                minute: '2-digit'
              })}
                </div>
                <button onClick={e => {
              e.stopPropagation();
              onEdit(dayCampaigns[0]);
            }} className="text-inherit hover:text-blue-500 transition-colors">
                  <Edit className="h-4 w-4" />
                  <span className="sr-only">Editar</span>
                </button>
              </div>
              
              {dayCampaigns.length > 1 && <div className="text-xs mt-1 font-medium">
                  +{dayCampaigns.length - 1} mais
                </div>}
            </div>
          </div> :
      // Se não houver campanhas, apenas o número do dia é mostrado
      <div className="absolute top-1 right-1 font-medium text-sm z-10">
            {day.getDate()}
          </div>}
      </div>;
  };
  return <div className="space-y-4">
      <Card className="overflow-hidden rounded-md">
        <Calendar mode="single" month={currentDate} onMonthChange={setCurrentDate} selected={undefined} className="w-full" showOutsideDays={true} fixedWeeks={true} ISOWeek={false} formatters={{
        formatDay: date => {
          // Render customized days
          return renderDay(date);
        }
      }} />
      </Card>
      <div className="text-center text-sm text-muted-foreground">
        Arraste e solte as campanhas para reagendá-las
      </div>
    </div>;
};