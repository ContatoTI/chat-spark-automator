
import React, { useState } from "react";
import { Campaign } from "@/lib/api/campaigns";
import { 
  Calendar,
  CalendarCell,
  CalendarCellProps,
  CalendarControls,
  CalendarGrid,
  CalendarHeader,
  CalendarHeading,
  CalendarMonthValue,
  CalendarValue,
} from "@/components/ui/calendar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CampaignStatusBadge } from "./CampaignStatusBadge";
import { Edit, Trash2, Send, Copy } from "lucide-react";
import { addMonths } from "date-fns";
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

  // Renderiza uma célula do calendário com as campanhas do dia
  const renderCampaignCell = (props: CalendarCellProps) => {
    const { date } = props;
    const dateStr = date.toDateString();
    const dayCampaigns = campaignsByDate[dateStr] || [];

    return (
      <CalendarCell {...props}>
        <div className="w-full h-full">
          <div className="p-0.5">{date.getDate()}</div>
          <div className="mt-1 max-h-20 overflow-y-auto">
            {dayCampaigns.slice(0, 3).map((campaign) => (
              <div 
                key={campaign.id}
                className="text-xs bg-slate-100 dark:bg-slate-800 p-1 mb-1 rounded cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-700 truncate"
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(campaign);
                }}
              >
                <div className="font-medium truncate">{campaign.nome}</div>
              </div>
            ))}
            {dayCampaigns.length > 3 && (
              <div className="text-xs text-center text-muted-foreground mt-1">
                +{dayCampaigns.length - 3} mais
              </div>
            )}
          </div>
        </div>
      </CalendarCell>
    );
  };

  // Renderiza a lista de campanhas para o mês atual
  const renderMonthCampaigns = () => {
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    
    const monthCampaigns = campaigns.filter(campaign => {
      if (!campaign.data_disparo) return false;
      const campaignDate = new Date(campaign.data_disparo);
      return campaignDate.getMonth() === currentMonth && 
             campaignDate.getFullYear() === currentYear;
    });

    if (monthCampaigns.length === 0) {
      return (
        <Card className="mt-4">
          <CardContent className="p-6 text-center text-muted-foreground">
            Nenhuma campanha agendada para este mês
          </CardContent>
        </Card>
      );
    }

    return (
      <div className="mt-4 space-y-2">
        <h3 className="text-lg font-medium">Campanhas do mês</h3>
        <div className="grid gap-2">
          {monthCampaigns.map(campaign => (
            <Card key={campaign.id} className="overflow-hidden">
              <CardContent className="p-3">
                <div className="flex justify-between items-center gap-2">
                  <div>
                    <div className="font-medium">{campaign.nome}</div>
                    <div className="text-sm flex items-center mt-1">
                      <CampaignStatusBadge status={campaign.status} />
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="h-8 w-8 p-0"
                      onClick={() => onEdit(campaign)}
                    >
                      <Edit className="h-4 w-4" />
                      <span className="sr-only">Editar</span>
                    </Button>
                    
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="h-8 w-8 p-0"
                      onClick={() => onDuplicate(campaign)}
                    >
                      <Copy className="h-4 w-4" />
                      <span className="sr-only">Duplicar</span>
                    </Button>
                    
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          className="h-8 w-8 p-0 text-green-600"
                        >
                          <Send className="h-4 w-4" />
                          <span className="sr-only">Enviar agora</span>
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
                          <AlertDialogAction onClick={() => onSendNow(campaign)}>
                            Enviar
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                    
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          className="h-8 w-8 p-0 text-red-600"
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
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <Calendar
        mode="single"
        month={currentDate}
        onMonthChange={setCurrentDate}
        selected={undefined}
        className="border rounded-md"
        components={{
          Cell: renderCampaignCell
        }}
      />
      {renderMonthCampaigns()}
    </div>
  );
};
