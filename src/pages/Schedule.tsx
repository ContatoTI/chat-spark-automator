
import React, { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar as CalendarIcon, Clock, Calendar as CalendarFull, PlusCircle, Users, MessageSquare, CheckCircle, MoreHorizontal } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { NewCampaignDialog } from "@/components/campaigns/NewCampaignDialog";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ScheduledCampaign {
  id: string;
  name: string;
  date: Date;
  time: string;
  contacts: number;
  message: string;
}

// Mock data for scheduled campaigns
const mockScheduledCampaigns: ScheduledCampaign[] = [
  {
    id: "1",
    name: "Lançamento Produto X",
    date: new Date(2023, 7, 1),
    time: "09:00",
    contacts: 1024,
    message: "Conheça nosso novo produto X! Acesse o link para mais informações...",
  },
  {
    id: "2",
    name: "Convite para Evento",
    date: new Date(2023, 7, 20),
    time: "15:30",
    contacts: 350,
    message: "Convite especial para nosso evento anual! Confirme sua presença...",
  },
  {
    id: "3",
    name: "Lembrete de Pagamento",
    date: new Date(2023, 7, 10),
    time: "10:00",
    contacts: 178,
    message: "Lembrete: seu pagamento vence amanhã. Evite juros pagando em dia!",
  },
  {
    id: "4",
    name: "Aviso de Manutenção",
    date: new Date(2023, 7, 15),
    time: "18:00",
    contacts: 2500,
    message: "Nosso sistema passará por manutenção neste fim de semana...",
  },
];

const Schedule = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [newCampaignDialogOpen, setNewCampaignDialogOpen] = useState(false);
  
  // Filter campaigns by selected date
  const campaignsForSelectedDate = mockScheduledCampaigns.filter(
    (campaign) => date && 
    campaign.date.getDate() === date.getDate() &&
    campaign.date.getMonth() === date.getMonth() &&
    campaign.date.getFullYear() === date.getFullYear()
  );
  
  // Highlight dates with campaigns
  const datesWithCampaigns = mockScheduledCampaigns.map((campaign) => campaign.date);

  return (
    <Layout>
      <div className="flex flex-col gap-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">Agendamentos</h1>
            <p className="text-muted-foreground mt-1">
              Gerencie suas campanhas agendadas
            </p>
          </div>
          <Button 
            className="w-full sm:w-auto bg-primary"
            onClick={() => setNewCampaignDialogOpen(true)}
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Nova Campanha
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CalendarFull className="h-5 w-5 text-primary" />
                  Calendário
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  className="rounded-md border"
                  modifiers={{
                    campaign: datesWithCampaigns,
                  }}
                  modifiersStyles={{
                    campaign: { 
                      fontWeight: 'bold',
                      backgroundColor: 'rgba(37, 211, 102, 0.1)',
                      borderRadius: '0.25rem'
                    }
                  }}
                />
              </CardContent>
              <CardFooter>
                <div className="w-full flex items-center justify-between text-sm px-2">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-sm bg-primary/20"></div>
                    <span className="text-muted-foreground">Com campanhas</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-sm bg-primary"></div>
                    <span className="text-muted-foreground">Selecionado</span>
                  </div>
                </div>
              </CardFooter>
            </Card>
          </div>
          
          <div className="lg:col-span-2">
            <Card>
              <CardHeader className="border-b">
                <CardTitle className="flex items-center gap-2">
                  {date && (
                    <div className="flex items-center">
                      <CalendarIcon className="mr-2 h-5 w-5 text-primary" />
                      Campanhas para {format(date, "dd/MM/yyyy")}
                    </div>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                {campaignsForSelectedDate.length > 0 ? (
                  <div className="divide-y">
                    {campaignsForSelectedDate.map((campaign) => (
                      <div key={campaign.id} className="p-4 hover:bg-muted/30 transition-colors">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="font-medium">{campaign.name}</h3>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                              <Clock className="h-4 w-4" />
                              <span>{campaign.time}</span>
                              <span className="mx-1">•</span>
                              <Users className="h-4 w-4" />
                              <span>{campaign.contacts} contatos</span>
                            </div>
                          </div>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Abrir menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Opções</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem>
                                <MessageSquare className="mr-2 h-4 w-4" />
                                Enviar Agora
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Clock className="mr-2 h-4 w-4" />
                                Reagendar
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-red-600">
                                Cancelar Agendamento
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                        <p className="text-sm text-muted-foreground border-l-2 border-primary/40 pl-2 my-2">
                          {campaign.message}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                    <div className="bg-muted/30 rounded-full p-3 mb-4">
                      <Clock className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-medium mb-1">Nenhuma campanha agendada</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Não há campanhas agendadas para esta data.
                    </p>
                    <Button 
                      variant="outline" 
                      onClick={() => setNewCampaignDialogOpen(true)}
                    >
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Agendar Nova Campanha
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      
      <NewCampaignDialog 
        open={newCampaignDialogOpen} 
        onOpenChange={setNewCampaignDialogOpen} 
      />
    </Layout>
  );
};

export default Schedule;
