
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
import { 
  Image as ImageIcon, 
  File, 
  Link, 
  Video,
  Send,
  Calendar
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateCampaign, Campaign } from "@/lib/api/campaigns";

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
  const [activeTab, setActiveTab] = useState<"message" | "schedule">("message");
  const [campaignName, setCampaignName] = useState("");
  const [message1, setMessage1] = useState("");
  const [message2, setMessage2] = useState("");
  const [message3, setMessage3] = useState("");
  const [message4, setMessage4] = useState("");
  const [selectedTab, setSelectedTab] = useState<"text" | "media">("text");
  const [mediaType, setMediaType] = useState<string | null>(null);
  const [mediaUrl, setMediaUrl] = useState<string>("");
  const [scheduleDate, setScheduleDate] = useState<string>("");
  
  // Initialize form with campaign data when dialog opens
  useEffect(() => {
    if (campaign && open) {
      setCampaignName(campaign.nome);
      setMessage1(campaign.mensagem01);
      setMessage2(campaign.mensagem02 || "");
      setMessage3(campaign.mensagem03 || "");
      setMessage4(campaign.mensagem04 || "");
      setSelectedTab(campaign.tipo_midia ? "media" : "text");
      setMediaType(campaign.tipo_midia);
      setMediaUrl(campaign.url_midia || "");
      setScheduleDate(campaign.data_disparo ? new Date(campaign.data_disparo).toISOString().slice(0, 16) : "");
      setActiveTab("message");
    }
  }, [campaign, open]);
  
  // Reset form when dialog closes
  useEffect(() => {
    if (!open) {
      setCampaignName("");
      setMessage1("");
      setMessage2("");
      setMessage3("");
      setMessage4("");
      setSelectedTab("text");
      setMediaType(null);
      setMediaUrl("");
      setScheduleDate("");
      setActiveTab("message");
    }
  }, [open]);
  
  // Update campaign mutation
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
    
    if (selectedTab === "media" && mediaType && !mediaUrl.trim()) {
      toast.error("Por favor, adicione a URL da mídia.");
      return;
    }
    
    setActiveTab("schedule");
  };
  
  const handleSubmit = () => {
    if (!campaign?.id) {
      toast.error("ID da campanha não encontrado");
      return;
    }
    
    const updatedCampaign: Partial<Campaign> = {
      nome: campaignName,
      mensagem01: message1,
      mensagem02: message2 || null,
      mensagem03: message3 || null,
      mensagem04: message4 || null,
      tipo_midia: mediaType,
      url_midia: mediaUrl || null,
      data_disparo: scheduleDate ? new Date(scheduleDate).toISOString() : null,
      status: scheduleDate ? "scheduled" : campaign.status === "draft" ? "draft" : "sending",
    };
    
    updateMutation.mutate({ id: campaign.id, updatedCampaign });
  };
  
  const handleMediaSelection = (type: string) => {
    setMediaType(type);
    if (!mediaUrl) {
      setMediaUrl("");
    }
  };

  if (!campaign) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
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
                activeTab === "schedule"
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              )}
              onClick={() => {
                if (campaignName.trim() && message1.trim()) {
                  if (selectedTab === "media" && mediaType && !mediaUrl.trim()) {
                    toast.error("Por favor, adicione a URL da mídia.");
                    return;
                  }
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
                <div className="flex gap-2 border-b">
                  <button
                    className={cn(
                      "flex items-center gap-2 px-3 py-2 text-sm font-medium",
                      "border-b-2 transition-colors",
                      selectedTab === "text"
                        ? "border-primary text-primary"
                        : "border-transparent text-muted-foreground hover:text-foreground"
                    )}
                    onClick={() => setSelectedTab("text")}
                  >
                    Texto
                  </button>
                  <button
                    className={cn(
                      "flex items-center gap-2 px-3 py-2 text-sm font-medium",
                      "border-b-2 transition-colors",
                      selectedTab === "media"
                        ? "border-primary text-primary"
                        : "border-transparent text-muted-foreground hover:text-foreground"
                    )}
                    onClick={() => setSelectedTab("media")}
                  >
                    Mídia
                  </button>
                </div>
                
                {selectedTab === "text" && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="message-text-1">Mensagem 1 (Principal)</Label>
                      <Textarea
                        id="message-text-1"
                        placeholder="Digite sua mensagem principal aqui..."
                        value={message1}
                        onChange={(e) => setMessage1(e.target.value)}
                        className="min-h-[80px]"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="message-text-2">Mensagem 2 (Opcional)</Label>
                      <Textarea
                        id="message-text-2"
                        placeholder="Digite sua mensagem secundária aqui..."
                        value={message2}
                        onChange={(e) => setMessage2(e.target.value)}
                        className="min-h-[80px]"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="message-text-3">Mensagem 3 (Opcional)</Label>
                      <Textarea
                        id="message-text-3"
                        placeholder="Digite sua mensagem adicional aqui..."
                        value={message3}
                        onChange={(e) => setMessage3(e.target.value)}
                        className="min-h-[80px]"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="message-text-4">Mensagem 4 (Opcional)</Label>
                      <Textarea
                        id="message-text-4"
                        placeholder="Digite sua mensagem final aqui..."
                        value={message4}
                        onChange={(e) => setMessage4(e.target.value)}
                        className="min-h-[80px]"
                      />
                    </div>
                  </div>
                )}
                
                {selectedTab === "media" && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-4 gap-4">
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
                    
                    {mediaType && (
                      <>
                        <div className="space-y-2">
                          <Label htmlFor="media-url">URL da Mídia</Label>
                          <Input
                            id="media-url"
                            placeholder={`Adicione a URL da ${mediaType === 'image' ? 'imagem' : mediaType === 'video' ? 'vídeo' : mediaType === 'document' ? 'documento' : 'link'}`}
                            value={mediaUrl}
                            onChange={(e) => setMediaUrl(e.target.value)}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="message-text-1">Mensagem 1 (Principal)</Label>
                          <Textarea
                            id="message-text-1"
                            placeholder="Digite sua mensagem principal aqui..."
                            value={message1}
                            onChange={(e) => setMessage1(e.target.value)}
                            className="min-h-[80px]"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="message-text-2">Mensagem 2 (Opcional)</Label>
                          <Textarea
                            id="message-text-2"
                            placeholder="Digite sua mensagem secundária aqui..."
                            value={message2}
                            onChange={(e) => setMessage2(e.target.value)}
                            className="min-h-[80px]"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="message-text-3">Mensagem 3 (Opcional)</Label>
                          <Textarea
                            id="message-text-3"
                            placeholder="Digite sua mensagem adicional aqui..."
                            value={message3}
                            onChange={(e) => setMessage3(e.target.value)}
                            className="min-h-[80px]"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="message-text-4">Mensagem 4 (Opcional)</Label>
                          <Textarea
                            id="message-text-4"
                            placeholder="Digite sua mensagem final aqui..."
                            value={message4}
                            onChange={(e) => setMessage4(e.target.value)}
                            className="min-h-[80px]"
                          />
                        </div>
                      </>
                    )}
                  </div>
                )}
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
                <Input
                  type="datetime-local"
                  className="w-auto"
                  value={scheduleDate}
                  onChange={(e) => setScheduleDate(e.target.value)}
                />
              </div>
              
              <div className="p-4 border rounded-md bg-amber-50 dark:bg-amber-900/20 text-amber-800 dark:text-amber-300">
                <h4 className="font-medium">Resumo da Campanha</h4>
                <p className="text-sm mt-1">Nome: {campaignName}</p>
                <p className="text-sm mt-1">Tipo: {mediaType ? `Mídia (${mediaType})` : "Texto"}</p>
                <p className="text-sm mt-1">Status: {scheduleDate ? "Agendada" : 
                  campaign.status === "draft" ? "Rascunho" : "Envio imediato"}</p>
                {scheduleDate && (
                  <p className="text-sm mt-1">
                    Data de envio: {new Date(scheduleDate).toLocaleString("pt-BR")}
                  </p>
                )}
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
          
          {activeTab === "schedule" && (
            <>
              <Button variant="outline" onClick={() => setActiveTab("message")}>
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
