
import React, { useState } from "react";
import { Campaign } from "@/lib/api/campaigns";
import { Calendar } from "@/components/ui/calendar";
import { Card } from "@/components/ui/card";
import { Edit } from "lucide-react";
import { toast } from "sonner";
import { updateCampaign } from "@/lib/api/campaigns";
import { cn } from "@/lib/utils";
import { useQueryClient } from "@tanstack/react-query";
import { ptBR } from "date-fns/locale";

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

  // Parse date string without timezone conversion
  const parseLocalDate = (dateString: string | null): Date | null => {
    if (!dateString) return null;
    
    // Format: YYYY-MM-DD or YYYY-MM-DD HH:MM:SS
    if (dateString.includes(' ')) {
      // Has date and time
      const [datePart] = dateString.split(' ');
      const [year, month, day] = datePart.split('-').map(Number);
      return new Date(year, month - 1, day, 0, 0, 0);
    } else if (dateString.includes('T')) {
      // ISO format
      const [datePart] = dateString.split('T');
      const [year, month, day] = datePart.split('-').map(Number);
      return new Date(year, month - 1, day, 0, 0, 0);
    } else {
      // Simple date
      const [year, month, day] = dateString.split('-').map(Number);
      return new Date(year, month - 1, day, 0, 0, 0);
    }
  };

  // Agrupa campanhas por data
  const campaignsByDate = campaigns.reduce<Record<string, Campaign[]>>((acc, campaign) => {
    if (campaign.data_disparo) {
      const date = parseLocalDate(campaign.data_disparo);
      if (date) {
        const dateStr = date.toDateString();
        if (!acc[dateStr]) {
          acc[dateStr] = [];
        }
        acc[dateStr].push(campaign);
      }
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
      // Format the date as YYYY-MM-DD
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      
      // Preserve original time if exists
      let timeString = "12:00:00";
      if (draggingCampaign.data_disparo) {
        if (draggingCampaign.data_disparo.includes(' ')) {
          // Has time part
          const [_, timePart] = draggingCampaign.data_disparo.split(' ');
          if (timePart) {
            timeString = timePart;
          }
        }
      }
      
      // Format as YYYY-MM-DD HH:MM:SS
      const targetDateString = `${year}-${month}-${day} ${timeString}`;
      
      console.log(`Reagendando para a data: ${targetDateString}`);
      
      // Atualizar a data da campanha
      const updatedCampaign = {
        ...draggingCampaign,
        data_disparo: targetDateString
      };

      // Chamar API para atualizar a campanha
      await updateCampaign(draggingCampaign.id, {
        data_disparo: targetDateString
      });

      // Invalidar queries para forçar recarregamento dos dados
      queryClient.invalidateQueries({ queryKey: ['campaigns'] });

      // Mostrar notificação de sucesso
      toast.success(`Campanha "${draggingCampaign.nome}" reagendada para ${day}/${month}/${year}`);

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

  // Format time without timezone conversion
  const formatLocalTime = (dateString: string | null): string => {
    if (!dateString) return "";
    
    if (dateString.includes(' ')) {
      const [_, timePart] = dateString.split(' ');
      if (timePart) {
        const [hours, minutes] = timePart.split(':');
        return `${hours}:${minutes}`;
      }
    } else if (dateString.includes('T')) {
      const [_, timePart] = dateString.split('T');
      if (timePart) {
        const [hours, minutes] = timePart.split(':');
        return `${hours}:${minutes}`;
      }
    }
    
    return "12:00";
  };

  // Custom day renderer for Calendar
  const renderDay = (day: Date) => {
    const dateStr = day.toDateString();
    const dayCampaigns = campaignsByDate[dateStr] || [];
    const isCurrentDay = isToday(day);
    
    return (
      <div 
        className="h-32 w-full relative border border-border"
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
              "absolute inset-0 flex flex-col h-full w-full p-2", 
              getCampaignBgColor(dayCampaigns[0].status)
            )}
            draggable={true}
            onDragStart={e => handleDragStart(e, dayCampaigns[0])}
            onDragEnd={handleDragEnd}
          >
            <div className="flex justify-end">
              <div className={cn(
                "w-8 h-8 flex items-center justify-center text-base font-medium rounded-full", 
                isCurrentDay ? "bg-white/80 text-primary" : "text-inherit"
              )}>
                {day.getDate()}
              </div>
            </div>
            
            <div className="flex-1 flex flex-col justify-between mt-2">
              <div className="font-medium text-base truncate">
                {dayCampaigns[0].nome}
              </div>
              
              <div className="flex justify-between items-center mt-2">
                <div className="text-sm">
                  {formatLocalTime(dayCampaigns[0].data_disparo)}
                </div>
                <button 
                  onClick={e => {
                    e.stopPropagation();
                    onEdit(dayCampaigns[0]);
                  }} 
                  className="text-inherit hover:text-primary transition-colors"
                >
                  <Edit className="h-5 w-5" />
                  <span className="sr-only">Editar</span>
                </button>
              </div>
              
              {dayCampaigns.length > 1 && (
                <div className="text-sm mt-2 font-medium">
                  +{dayCampaigns.length - 1} mais
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="absolute top-2 right-2 font-medium text-base">
            {day.getDate()}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <Card className="overflow-hidden rounded-md p-0">
        <Calendar 
          mode="single" 
          month={currentDate} 
          onMonthChange={setCurrentDate} 
          selected={undefined} 
          className="w-full p-0" 
          showOutsideDays={true} 
          fixedWeeks={true} 
          ISOWeek={false}
          locale={ptBR}
          classNames={{
            months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
            month: "space-y-4 w-full",
            caption: "flex justify-center pt-4 relative items-center px-12 pb-4",
            caption_label: "text-lg font-medium",
            nav: "flex items-center",
            nav_button: cn(
              buttonVariants({ variant: "outline" }),
              "h-9 w-9 bg-transparent p-0 opacity-50 hover:opacity-100"
            ),
            nav_button_previous: "absolute left-2",
            nav_button_next: "absolute right-2",
            table: "w-full border-collapse space-y-1",
            head_row: "flex w-full",
            head_cell: "text-muted-foreground rounded-md w-full font-normal text-base py-4",
            row: "flex w-full mt-2 gap-1",
            cell: "text-center text-base relative p-0 hover:bg-muted/50 rounded-md focus-within:relative focus-within:z-20 w-full",
            day: "w-full h-full",
            day_range_end: "day-range-end",
            day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
            day_today: "bg-accent text-accent-foreground",
            day_outside: "text-muted-foreground opacity-50",
            day_disabled: "text-muted-foreground opacity-50",
            day_range_middle: "aria-selected:bg-accent aria-selected:text-accent-foreground",
            day_hidden: "invisible",
          }}
          formatters={{
            formatDay: date => {
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
