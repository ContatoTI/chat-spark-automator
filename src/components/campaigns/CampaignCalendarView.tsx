
import React, { useState } from "react";
import { Campaign } from "@/lib/api/campaigns";
import { Calendar } from "@/components/ui/calendar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
import { supabase } from "@/lib/supabase";
import { updateCampaign } from "@/lib/api/campaigns";

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

  // Custom day renderer for Calendar
  const renderDay = (day: Date) => {
    const dateStr = day.toDateString();
    const dayCampaigns = campaignsByDate[dateStr] || [];
    
    return (
      <div 
        className="relative min-h-24 border-t p-1 hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors"
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
        <div className="absolute top-1 left-1 font-medium text-muted-foreground text-sm">
          {day.getDate()}
        </div>
        <div className="pt-5 max-h-40 overflow-y-auto space-y-1">
          {dayCampaigns.map((campaign) => (
            <div 
              key={campaign.id}
              className="text-xs bg-white dark:bg-slate-800 shadow-sm p-1.5 rounded cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
              onClick={(e) => e.stopPropagation()}
              draggable
              onDragStart={() => handleDragStart(campaign)}
              onDragEnd={handleDragEnd}
            >
              <div className="font-medium truncate mb-1">{campaign.nome}</div>
              <div className="flex items-center justify-between gap-1">
                <CampaignStatusBadge status={campaign.status} />
                <div className="flex gap-1">
                  <button 
                    onClick={(e) => { e.stopPropagation(); onEdit(campaign); }}
                    className="text-slate-500 hover:text-blue-500 transition-colors p-0.5"
                  >
                    <Edit className="h-3 w-3" />
                    <span className="sr-only">Editar</span>
                  </button>
                  <button 
                    onClick={(e) => { e.stopPropagation(); onDuplicate(campaign); }}
                    className="text-slate-500 hover:text-blue-500 transition-colors p-0.5"
                  >
                    <Copy className="h-3 w-3" />
                    <span className="sr-only">Duplicar</span>
                  </button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <button className="text-slate-500 hover:text-green-500 transition-colors p-0.5">
                        <Send className="h-3 w-3" />
                        <span className="sr-only">Enviar agora</span>
                      </button>
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
                        <AlertDialogAction onClick={() => onSendNow(campaign)}>
                          Enviar
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <button className="text-slate-500 hover:text-red-500 transition-colors p-0.5">
                        <Trash2 className="h-3 w-3" />
                        <span className="sr-only">Excluir</span>
                      </button>
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
                          onClick={() => campaign.id && onDelete(campaign.id)}
                          className="bg-red-500 hover:bg-red-600"
                        >
                          Excluir
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
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
