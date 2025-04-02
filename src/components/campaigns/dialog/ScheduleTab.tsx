
import React from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Calendar as CalendarIcon, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface ScheduleTabProps {
  campaignName: string;
  mediaType: string | null;
  scheduleDate: Date | undefined;
  setScheduleDate: (date: Date | undefined) => void;
  scheduleTime: string;
  setScheduleTime: (time: string) => void;
  enviados: number;
  limiteDisparos: number;
  producao: boolean;
  timeOptions: { value: string; label: string }[];
}

export const ScheduleTab: React.FC<ScheduleTabProps> = ({
  campaignName,
  mediaType,
  scheduleDate,
  setScheduleDate,
  scheduleTime,
  setScheduleTime,
  enviados,
  limiteDisparos,
  producao,
  timeOptions,
}) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 p-4 border rounded-md bg-muted/30">
        <CalendarIcon className="h-5 w-5 text-muted-foreground" />
        <div className="flex-1">
          <h4 className="font-medium">Agendar Envio</h4>
          <p className="text-sm text-muted-foreground">Defina uma data e horário para envio automático</p>
        </div>
        <div className="flex flex-col items-end gap-2">
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="schedule-time" className="text-sm">Horário</Label>
            <div className="flex items-center">
              <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
              <Select
                value={scheduleTime}
                onValueChange={setScheduleTime}
              >
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Selecionar horário" />
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
          
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="schedule-date" className="text-sm">Data</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="schedule-date"
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !scheduleDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {scheduleDate ? format(scheduleDate, "dd/MM/yyyy", { locale: ptBR }) : <span>Escolha uma data</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={scheduleDate}
                  onSelect={setScheduleDate}
                  initialFocus
                  disabled={(date) => date < new Date()}
                  className="p-3 pointer-events-auto"
                  locale={ptBR}
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </div>
      
      <div className="flex p-4 border rounded-md bg-amber-50 dark:bg-amber-900/20 text-amber-800 dark:text-amber-300">
        <div className="flex-1 space-y-1">
          <h4 className="font-medium">Resumo da Campanha</h4>
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            <p className="text-sm">Nome: {campaignName}</p>
            <p className="text-sm">Tipo: {mediaType ? `${mediaType === 'text' ? 'Texto' : mediaType === 'image' ? 'Imagem' : mediaType === 'document' ? 'Documento' : mediaType === 'video' ? 'Vídeo' : 'Link'}` : "Não definido"}</p>
            <p className="text-sm">Status: {
              enviados === 0 && (scheduleDate && scheduleTime) ? "Agendada" : 
              (enviados > 0 && enviados < limiteDisparos) ? "Em andamento" : 
              enviados >= limiteDisparos ? "Concluída" :
              "Rascunho"
            }</p>
            <p className="text-sm">Produção: {producao ? "Sim" : "Não"}</p>
            <p className="text-sm">Limite: {limiteDisparos}</p>
            <p className="text-sm">Enviados: {enviados}</p>
            {scheduleDate && scheduleTime && (
              <p className="text-sm">
                Data de envio: {format(scheduleDate, "dd/MM/yyyy", { locale: ptBR })} às {scheduleTime}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
