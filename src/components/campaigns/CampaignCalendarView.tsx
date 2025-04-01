
import React, { useState } from "react";
import { Campaign } from "@/lib/api/campaigns";
import { Calendar } from "@/components/ui/calendar";
import { Card } from "@/components/ui/card";
import { Edit } from "lucide-react";
import { toast } from "sonner";
import { updateCampaign } from "@/lib/api/campaigns";
import { cn } from "@/lib/utils";
import { useQueryClient } from "@tanstack/react-query";

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
  const queryClient = useQueryClient();

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
  const handleDragStart = (e: React.DragEvent, campaign: Campaign) => {
    e.stopPropagation();
    setDraggingCampaign(campaign);
    
    // Adiciona dados ao evento de drag para identificar a campanha
    if (e.dataTransfer) {
      e.dataTransfer.setData('text/plain', JSON.stringify({ id: campaign.id }));
      e.dataTransfer.effectAllowed = 'move';
    }
  };

  // Função para lidar com o término do arraste
  const handleDragEnd = () => {
    setDraggingCampaign(null);
  };

  // Função para lidar com o soltar em uma data
  const handleDropOnDate = async (e: React.DragEvent, date: Date) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!draggingCampaign || !draggingCampaign.id) return;
    
    try {
      // Criar uma nova data para evitar problemas de referência
      const targetDate = new Date(Date.UTC(
        date.getFullYear(),
        date.getMonth(),
        date.getDate(),
        12, 0, 0
      ));
      
      // Manter a hora original se existir
      if (draggingCampaign.data_disparo) {
        const originalDate = new Date(draggingCampaign.data_disparo);
        targetDate.setUTCHours(originalDate.getUTCHours());
        targetDate.setUTCMinutes(originalDate.getUTCMinutes());
        targetDate.setUTCSeconds(originalDate.getUTCSeconds());
      }
      
      const targetISOString = targetDate.toISOString();
      
      console.log(`Reagendando para a data: ${date.toISOString()} -> ${targetISOString}`);
      
      // Atualizar a data da campanha
      const updatedCampaign = {
        ...draggingCampaign,
        data_disparo: targetISOString
      };

      // Chamar API para atualizar a campanha
      await updateCampaign(draggingCampaign.id, {
        data_disparo: targetISOString
      });

      // Invalidar queries para forçar recarregamento dos dados
      queryClient.invalidateQueries({ queryKey: ['campaigns'] });

      // Mostrar notificação de sucesso
      toast.success(`Campanha "${draggingCampaign.nome}" reagendada para ${targetDate.toLocaleDateString("pt-BR")}`);

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
    
    return (
      <div 
        className="h-full w-full relative"
        onDragOver={e => {
          e.preventDefault();
          e.currentTarget.classList.add('bg-slate-100', 'dark:bg-slate-800/50');
        }} 
        onDragLeave={e => {
          e.preventDefault();
          e.currentTarget.classList.remove('bg-slate-100', 'dark:bg-slate-800/50');
        }} 
        onDrop={e => {
          e.currentTarget.classList.remove('bg-slate-100', 'dark:bg-slate-800/50');
          handleDropOnDate(e, day);
        }}
      >
        {dayCampaigns.length > 0 ? (
          <div 
            className={cn(
              "absolute inset-0 flex flex-col h-full w-full p-1", 
              getCampaignBgColor(dayCampaigns[0].status)
            )}
            draggable={true}
            onDragStart={e => handleDragStart(e, dayCampaigns[0])}
            onDragEnd={handleDragEnd}
          >
            <div className="flex justify-end">
              <div className={cn(
                "w-6 h-6 flex items-center justify-center text-sm font-medium rounded-full", 
                isCurrentDay ? "bg-white/80 text-primary" : "text-inherit"
              )}>
                {day.getDate()}
              </div>
            </div>
            
            <div className="flex-1 flex flex-col justify-between mt-1">
              <div className="font-medium text-sm truncate">
                {dayCampaigns[0].nome}
              </div>
              
              <div className="flex justify-between items-center mt-1">
                <div className="text-xs">
                  {new Date(dayCampaigns[0].data_disparo).toLocaleTimeString('pt-BR', {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </div>
                <button 
                  onClick={e => {
                    e.stopPropagation();
                    onEdit(dayCampaigns[0]);
                  }} 
                  className="text-inherit hover:text-primary transition-colors"
                >
                  <Edit className="h-4 w-4" />
                  <span className="sr-only">Editar</span>
                </button>
              </div>
              
              {dayCampaigns.length > 1 && (
                <div className="text-xs mt-1 font-medium">
                  +{dayCampaigns.length - 1} mais
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="absolute top-1 right-1 font-medium text-sm">
            {day.getDate()}
          </div>
        )}
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
            formatDay: date => {
              // Render customized days
              return renderDay(date);
            }
          }} 
        />
      </Card>
      <div className="text-center text-sm text-muted-foreground">
        Arraste e solte as campanhas para reagendá-las
      </div>
    </div>
  );
};
