
import React from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalendarIcon, X } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";

interface ScheduleTabProps {
  campaignName: string;
  scheduleDate: Date | undefined;
  setScheduleDate: (date: Date | undefined) => void;
  scheduleTime: string;
  setScheduleTime: (time: string) => void;
  timeOptions: { value: string, label: string }[];
  mediaType: string | null;
  enviados: number;
  limiteDisparos: number;
  producao: boolean;
}

export const ScheduleTab = ({ 
  scheduleDate,
  setScheduleDate,
  scheduleTime,
  setScheduleTime,
  timeOptions,
  campaignName,
  mediaType,
  enviados,
  limiteDisparos,
  producao
}: ScheduleTabProps) => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-4">
        <h3 className="text-lg font-semibold">Agendar Envio</h3>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Data</Label>
            <div className="relative">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !scheduleDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {scheduleDate ? format(scheduleDate, "PPP", { locale: ptBR }) : "Selecione uma data"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={scheduleDate}
                    onSelect={setScheduleDate}
                    initialFocus
                    disabled={(date) => date < new Date()}
                  />
                </PopoverContent>
              </Popover>
              
              {scheduleDate && (
                <Button 
                  size="icon" 
                  variant="ghost" 
                  className="absolute right-0 top-0 h-full rounded-l-none"
                  onClick={() => setScheduleDate(undefined)}
                >
                  <X className="h-4 w-4" />
                  <span className="sr-only">Limpar data</span>
                </Button>
              )}
            </div>
          </div>
          
          <div>
            <Label>Horário</Label>
            <Select
              value={scheduleTime}
              onValueChange={setScheduleTime}
              disabled={!scheduleDate}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione um horário" />
              </SelectTrigger>
              <SelectContent>
                {timeOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
      
      <div>
        <h3 className="text-lg font-semibold">Resumo da Campanha</h3>
        <div className="space-y-2">
          <p><strong>Nome:</strong> {campaignName}</p>
          <p><strong>Tipo de mídia:</strong> {mediaType || 'Texto'}</p>
          <p><strong>Data Agendada:</strong> {scheduleDate ? format(scheduleDate, "PPP", { locale: ptBR }) : 'Não agendada'}</p>
          <p><strong>Horário Agendado:</strong> {scheduleTime && scheduleDate ? scheduleTime : 'Não agendado'}</p>
          <p><strong>Enviados:</strong> {enviados}</p>
          <p><strong>Limite de Disparos:</strong> {limiteDisparos}</p>
          <p><strong>Produção:</strong> {producao ? 'Sim' : 'Não'}</p>
        </div>
      </div>
    </div>
  );
};
