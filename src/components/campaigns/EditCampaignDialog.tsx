
import React, { useState, useEffect } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter,
  DialogDescription
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { 
  Image as ImageIcon, 
  File, 
  Link, 
  Video,
  Send,
  Calendar,
  Settings,
  Users,
  Type
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateCampaign, Campaign } from "@/lib/api/campaigns";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { format } from "date-fns";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface EditCampaignDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  campaign: Campaign | null;
}

export const EditCampaignDialog: React.FC<EditCampaignDialogProps> = ({ 
  open, 
  onOpenChange,
  campaign
}) => {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<"message" | "schedule" | "settings">("message");
  const [campaignName, setCampaignName] = useState("");
  const [message1, setMessage1] = useState("");
  const [message2, setMessage2] = useState("");
  const [message3, setMessage3] = useState("");
  const [message4, setMessage4] = useState("");
  const [mediaType, setMediaType] = useState<string | null>(null);
  const [mediaUrl, setMediaUrl] = useState<string>("");
  const [scheduleDate, setScheduleDate] = useState<Date | undefined>(undefined);
  const [scheduleTime, setScheduleTime] = useState<string>("");
  
  const [producao, setProducao] = useState(false);
  const [limiteDisparos, setLimiteDisparos] = useState(1000);
  const enviados = campaign?.enviados || 0;
  
  useEffect(() => {
    if (campaign && open) {
      setCampaignName(campaign.nome);
      setMessage1(campaign.mensagem01);
      setMessage2(campaign.mensagem02 || "");
      setMessage3(campaign.mensagem03 || "");
      setMessage4(campaign.mensagem04 || "");
      setMediaType(campaign.tipo_midia);
      setMediaUrl(campaign.url_midia || "");
      
      // Set date and time separately if data_disparo exists
      if (campaign.data_disparo) {
        const date = new Date(campaign.data_disparo);
        setScheduleDate(date);
        
        // Format time as HH:MM with 30-minute intervals
        const hours = date.getHours();
        const minutes = date.getMinutes() >= 30 ? "30" : "00";
        setScheduleTime(`${hours.toString().padStart(2, '0')}:${minutes}`);
      } else {
        setScheduleDate(undefined);
        setScheduleTime("");
      }
      
      setActiveTab("message");
      
      setProducao(campaign.producao !== undefined ? campaign.producao : false);
      setLimiteDisparos(campaign.limite_disparos || 1000);
    }
  }, [campaign, open]);
  
  useEffect(() => {
    if (!open) {
      setCampaignName("");
      setMessage1("");
      setMessage2("");
      setMessage3("");
      setMessage4("");
      setMediaType(null);
      setMediaUrl("");
      setScheduleDate(undefined);
      setScheduleTime("");
      setActiveTab("message");
      setProducao(false);
      setLimiteDisparos(1000);
    }
  }, [open]);
  
  const updateMutation = useMutation({
    mutationFn: ({ id, updatedCampaign }: { id: number, updatedCampaign: Partial<Campaign> }) => 
      updateCampaign(id, updatedCampaign),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['campaigns'] });
      toast.success("Campanha atualizada com sucesso!");
      onOpenChange(false);
    },
    onError: (error) => {
      toast.error(`Erro ao atualizar campanha: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    },
  });
  
  const handleNext = () => {
    if (!campaignName.trim() || !message1.trim()) {
      toast.error("Por favor, preencha todos os campos obrigatórios.");
      return;
    }
    
    if (activeTab === "message") {
      setActiveTab("settings");
    } else if (activeTab === "settings") {
      setActiveTab("schedule");
    }
  };
  
  const handleBack = () => {
    if (activeTab === "schedule") {
      setActiveTab("settings");
    } else if (activeTab === "settings") {
      setActiveTab("message");
    }
  };
  
  const handleSubmit = () => {
    if (!campaign?.id) {
      toast.error("ID da campanha não encontrado");
      return;
    }
    
    // Combine date and time for data_disparo
    let finalDateTime = null;
    if (scheduleDate && scheduleTime) {
      const [hours, minutes] = scheduleTime.split(':').map(Number);
      finalDateTime = new Date(scheduleDate);
      finalDateTime.setHours(hours, minutes, 0, 0);
    }
    
    const updatedCampaign: Partial<Campaign> = {
      nome: campaignName,
      mensagem01: message1,
      mensagem02: message2 || null,
      mensagem03: message3 || null,
      mensagem04: message4 || null,
      tipo_midia: mediaType,
      url_midia: mediaUrl || null,
      data_disparo: finalDateTime ? finalDateTime.toISOString() : null,
      status: calculateStatus(enviados, limiteDisparos, finalDateTime),
      producao: producao,
      limite_disparos: limiteDisparos
    };
    
    updateMutation.mutate({ id: campaign.id, updatedCampaign });
  };
  
  // Calculate status based on the rules provided
  const calculateStatus = (enviados: number, limite: number, dataDisparo: Date | null): string => {
    if (enviados === 0 && dataDisparo) {
      return "scheduled";
    } else if (enviados > 0 && enviados < limite) {
      return "sending";
    } else if (enviados >= limite) {
      return "completed";
    } else {
      return "draft";
    }
  };
  
  const handleMediaSelection = (type: string) => {
    setMediaType(type);
    if (type !== 'text' && !mediaUrl) {
      setMediaUrl("");
    }
  };
  
  // Generate time options in 30-minute intervals
  const generateTimeOptions = (): { value: string, label: string }[] => {
    const options = [];
    
    for (let hour = 0; hour < 24; hour++) {
      for (let minute of [0, 30]) {
        const hourString = hour.toString().padStart(2, '0');
        const minuteString = minute.toString().padStart(2, '0');
        const value = `${hourString}:${minuteString}`;
        const label = `${hourString}:${minuteString}`;
        
        options.push({
          value,
          label
        });
      }
    }
    
    return options;
  };

  if (!campaign) return null;

  const timeOptions = generateTimeOptions();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[900px]">
        <DialogHeader>
          <DialogTitle>Editar Campanha</DialogTitle>
          <DialogDescription>
            Atualize os detalhes da campanha "{campaign.nome}".
          </DialogDescription>
        </DialogHeader>
        
        <div className="mt-4">
          <div className="flex border-b mb-6">
            <button
              className={cn(
                "flex items-center gap-2 px-4 py-2 font-medium",
                "border-b-2 transition-colors",
                activeTab === "message"
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              )}
              onClick={() => setActiveTab("message")}
            >
              <Send className="h-4 w-4" />
              Mensagem
            </button>
            <button
              className={cn(
                "flex items-center gap-2 px-4 py-2 font-medium",
                "border-b-2 transition-colors",
                activeTab === "settings"
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              )}
              onClick={() => {
                if (campaignName.trim() && message1.trim()) {
                  setActiveTab("settings");
                } else {
                  toast.error("Por favor, preencha todos os campos obrigatórios.");
                }
              }}
            >
              <Settings className="h-4 w-4" />
              Configurações
            </button>
            <button
              className={cn(
                "flex items-center gap-2 px-4 py-2 font-medium",
                "border-b-2 transition-colors",
                activeTab === "schedule"
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              )}
              onClick={() => {
                if (campaignName.trim() && message1.trim()) {
                  setActiveTab("schedule");
                } else {
                  toast.error("Por favor, preencha todos os campos obrigatórios.");
                }
              }}
            >
              <Calendar className="h-4 w-4" />
              Agendamento
            </button>
          </div>
          
          {activeTab === "message" && (
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="campaign-name">Nome da Campanha</Label>
                <Input
                  id="campaign-name"
                  placeholder="Ex: Promoção de Verão"
                  value={campaignName}
                  onChange={(e) => setCampaignName(e.target.value)}
                />
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-5 gap-4">
                  <div 
                    className={cn(
                      "flex flex-col items-center justify-center gap-2 p-4 border border-dashed rounded-md cursor-pointer transition-colors",
                      mediaType === 'text' ? "bg-primary/10 border-primary" : "hover:bg-muted/50"
                    )}
                    onClick={() => handleMediaSelection('text')}
                  >
                    <Type className={cn("h-8 w-8", mediaType === 'text' ? "text-primary" : "text-muted-foreground")} />
                    <span className="text-sm font-medium">Texto</span>
                  </div>
                  <div 
                    className={cn(
                      "flex flex-col items-center justify-center gap-2 p-4 border border-dashed rounded-md cursor-pointer transition-colors",
                      mediaType === 'image' ? "bg-primary/10 border-primary" : "hover:bg-muted/50"
                    )}
                    onClick={() => handleMediaSelection('image')}
                  >
                    <ImageIcon className={cn("h-8 w-8", mediaType === 'image' ? "text-primary" : "text-muted-foreground")} />
                    <span className="text-sm font-medium">Imagem</span>
                  </div>
                  <div 
                    className={cn(
                      "flex flex-col items-center justify-center gap-2 p-4 border border-dashed rounded-md cursor-pointer transition-colors",
                      mediaType === 'document' ? "bg-primary/10 border-primary" : "hover:bg-muted/50"
                    )}
                    onClick={() => handleMediaSelection('document')}
                  >
                    <File className={cn("h-8 w-8", mediaType === 'document' ? "text-primary" : "text-muted-foreground")} />
                    <span className="text-sm font-medium">Documento</span>
                  </div>
                  <div 
                    className={cn(
                      "flex flex-col items-center justify-center gap-2 p-4 border border-dashed rounded-md cursor-pointer transition-colors",
                      mediaType === 'video' ? "bg-primary/10 border-primary" : "hover:bg-muted/50"
                    )}
                    onClick={() => handleMediaSelection('video')}
                  >
                    <Video className={cn("h-8 w-8", mediaType === 'video' ? "text-primary" : "text-muted-foreground")} />
                    <span className="text-sm font-medium">Vídeo</span>
                  </div>
                  <div 
                    className={cn(
                      "flex flex-col items-center justify-center gap-2 p-4 border border-dashed rounded-md cursor-pointer transition-colors",
                      mediaType === 'link' ? "bg-primary/10 border-primary" : "hover:bg-muted/50"
                    )}
                    onClick={() => handleMediaSelection('link')}
                  >
                    <Link className={cn("h-8 w-8", mediaType === 'link' ? "text-primary" : "text-muted-foreground")} />
                    <span className="text-sm font-medium">Link</span>
                  </div>
                </div>
                
                {mediaType && mediaType !== 'text' && (
                  <div className="space-y-2">
                    <Label htmlFor="media-url">URL da Mídia {mediaType !== 'link' && "(Opcional)"}</Label>
                    <Input
                      id="media-url"
                      placeholder={`Adicione a URL da ${mediaType === 'image' ? 'imagem' : mediaType === 'video' ? 'vídeo' : mediaType === 'document' ? 'documento' : 'link'}`}
                      value={mediaUrl}
                      onChange={(e) => setMediaUrl(e.target.value)}
                    />
                  </div>
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="message-text-1">Mensagem 1 (Principal)</Label>
                    <Textarea
                      id="message-text-1"
                      placeholder="Digite sua mensagem principal aqui..."
                      value={message1}
                      onChange={(e) => setMessage1(e.target.value)}
                      className="min-h-[120px]"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="message-text-2">Mensagem 2 (Opcional)</Label>
                    <Textarea
                      id="message-text-2"
                      placeholder="Digite sua mensagem secundária aqui..."
                      value={message2}
                      onChange={(e) => setMessage2(e.target.value)}
                      className="min-h-[120px]"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="message-text-3">Mensagem 3 (Opcional)</Label>
                    <Textarea
                      id="message-text-3"
                      placeholder="Digite sua mensagem adicional aqui..."
                      value={message3}
                      onChange={(e) => setMessage3(e.target.value)}
                      className="min-h-[120px]"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="message-text-4">Mensagem 4 (Opcional)</Label>
                    <Textarea
                      id="message-text-4"
                      placeholder="Digite sua mensagem final aqui..."
                      value={message4}
                      onChange={(e) => setMessage4(e.target.value)}
                      className="min-h-[120px]"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === "settings" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="limite-disparos">Limite de Disparos</Label>
                  <Input
                    id="limite-disparos"
                    type="number"
                    value={limiteDisparos}
                    onChange={(e) => setLimiteDisparos(Number(e.target.value))}
                  />
                  <p className="text-sm text-muted-foreground">
                    Número máximo de mensagens a serem enviadas
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-muted-foreground" />
                  <span>Mensagens enviadas até o momento: <strong>{enviados}</strong></span>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="producao">Produção</Label>
                  <Switch 
                    id="producao" 
                    checked={producao} 
                    onCheckedChange={setProducao} 
                  />
                </div>
                <p className="text-sm text-muted-foreground">
                  Ative para enviar em ambiente de produção
                </p>
              </div>
            </div>
          )}
          
          {activeTab === "schedule" && (
            <div className="space-y-6">
              <div className="flex items-center gap-4 p-4 border rounded-md bg-muted/30">
                <Calendar className="h-5 w-5 text-muted-foreground" />
                <div className="flex-1">
                  <h4 className="font-medium">Agendar Envio</h4>
                  <p className="text-sm text-muted-foreground">Defina uma data e horário para envio automático</p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <div className="grid w-full max-w-sm items-center gap-1.5">
                    <Label htmlFor="schedule-time">Horário</Label>
                    <Select
                      value={scheduleTime}
                      onValueChange={setScheduleTime}
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Selecione o horário" />
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
                  
                  <div className="grid w-full max-w-sm items-center gap-1.5">
                    <Label htmlFor="schedule-date">Data</Label>
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
                          <Calendar className="mr-2 h-4 w-4" />
                          {scheduleDate ? format(scheduleDate, "dd/MM/yyyy") : <span>Escolha uma data</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <CalendarComponent
                          mode="single"
                          selected={scheduleDate}
                          onSelect={setScheduleDate}
                          initialFocus
                          disabled={(date) => date < new Date()}
                          className="p-3 pointer-events-auto"
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
                        Data de envio: {format(scheduleDate, "dd/MM/yyyy")} às {scheduleTime}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        
        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          
          {activeTab === "message" && (
            <Button onClick={handleNext} className="bg-primary">
              Próximo
            </Button>
          )}
          
          {activeTab === "settings" && (
            <>
              <Button variant="outline" onClick={handleBack}>
                Voltar
              </Button>
              <Button onClick={handleNext} className="bg-primary">
                Próximo
              </Button>
            </>
          )}
          
          {activeTab === "schedule" && (
            <>
              <Button variant="outline" onClick={handleBack}>
                Voltar
              </Button>
              <Button 
                onClick={handleSubmit} 
                className="bg-primary"
                disabled={updateMutation.isPending}
              >
                {updateMutation.isPending ? "Atualizando..." : "Atualizar Campanha"}
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
