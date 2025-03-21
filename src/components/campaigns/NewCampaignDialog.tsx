
import React, { useState } from "react";
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
  Send,
  Calendar,
  User,
  Users
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createCampaign, Campaign } from "@/lib/api/campaigns";
import { format } from "date-fns";

interface NewCampaignDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const NewCampaignDialog: React.FC<NewCampaignDialogProps> = ({ 
  open, 
  onOpenChange 
}) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<"message" | "schedule">("message");
  const [campaignName, setCampaignName] = useState("");
  const [messageText, setMessageText] = useState("");
  const [selectedTab, setSelectedTab] = useState<"text" | "media">("text");
  const [mediaType, setMediaType] = useState<string | null>(null);
  const [mediaUrl, setMediaUrl] = useState<string | null>(null);
  const [scheduleDate, setScheduleDate] = useState<string>("");
  
  // Reset form when dialog closes
  React.useEffect(() => {
    if (!open) {
      setCampaignName("");
      setMessageText("");
      setSelectedTab("text");
      setMediaType(null);
      setMediaUrl(null);
      setScheduleDate("");
      setActiveTab("message");
    }
  }, [open]);
  
  // Create campaign mutation
  const createMutation = useMutation({
    mutationFn: (newCampaign: Campaign) => createCampaign(newCampaign),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['campaigns'] });
      toast.success("Campanha criada com sucesso!");
      onOpenChange(false);
    },
    onError: (error) => {
      toast.error(`Erro ao criar campanha: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    },
  });
  
  const handleNext = () => {
    if (!campaignName.trim() || !messageText.trim()) {
      toast.error("Por favor, preencha todos os campos obrigatórios.");
      return;
    }
    setActiveTab("schedule");
  };
  
  const handleSubmit = () => {
    const today = new Date();
    
    const newCampaign: Campaign = {
      nome: campaignName,
      data: today.toISOString(),
      mensagem01: messageText,
      mensagem02: null,
      mensagem03: null,
      mensagem04: null,
      tipo_midia: mediaType,
      url_midia: mediaUrl,
      data_disparo: scheduleDate 
        ? new Date(scheduleDate).toISOString() 
        : today.toISOString(),
      status: scheduleDate ? "scheduled" : "sending",
    };
    
    createMutation.mutate(newCampaign);
  };
  
  const handleMediaSelection = (type: string) => {
    setMediaType(type);
    // For demo purposes, set a placeholder URL
    setMediaUrl(`https://example.com/placeholder-${type}.${type === 'image' ? 'jpg' : type === 'video' ? 'mp4' : 'pdf'}`);
    toast.success(`Mídia do tipo ${type} selecionada`);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Nova Campanha</DialogTitle>
          <DialogDescription>
            Crie uma nova campanha para enviar mensagens para seus contatos.
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
                if (campaignName.trim() && messageText.trim()) {
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
                  <div className="space-y-2">
                    <Label htmlFor="message-text">Mensagem</Label>
                    <Textarea
                      id="message-text"
                      placeholder="Digite sua mensagem aqui..."
                      value={messageText}
                      onChange={(e) => setMessageText(e.target.value)}
                      className="min-h-[150px]"
                    />
                  </div>
                )}
                
                {selectedTab === "media" && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-3 gap-4">
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
                          mediaType === 'link' ? "bg-primary/10 border-primary" : "hover:bg-muted/50"
                        )}
                        onClick={() => handleMediaSelection('link')}
                      >
                        <Link className={cn("h-8 w-8", mediaType === 'link' ? "text-primary" : "text-muted-foreground")} />
                        <span className="text-sm font-medium">Link</span>
                      </div>
                    </div>
                    
                    {mediaType && (
                      <div className="space-y-2 mt-4">
                        <Label htmlFor="message-text">Mensagem (opcional)</Label>
                        <Textarea
                          id="message-text"
                          placeholder="Digite uma mensagem para acompanhar a mídia..."
                          value={messageText}
                          onChange={(e) => setMessageText(e.target.value)}
                          className="min-h-[100px]"
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
          
          {activeTab === "schedule" && (
            <div className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 border rounded-md bg-muted/30">
                  <Users className="h-5 w-5 text-muted-foreground" />
                  <div className="flex-1">
                    <h4 className="font-medium">Selecionar Contatos</h4>
                    <p className="text-sm text-muted-foreground">Escolha os contatos que receberão esta mensagem</p>
                  </div>
                  <Button variant="outline" size="sm">
                    Selecionar
                  </Button>
                </div>
                
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
              </div>
              
              <div className="p-4 border rounded-md bg-amber-50 dark:bg-amber-900/20 text-amber-800 dark:text-amber-300">
                <h4 className="font-medium">Resumo da Campanha</h4>
                <p className="text-sm mt-1">Nome: {campaignName}</p>
                <p className="text-sm mt-1">Tipo: {mediaType ? `Mídia (${mediaType})` : "Texto"}</p>
                <p className="text-sm mt-1">Status: {scheduleDate ? "Agendada" : "Envio imediato"}</p>
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
                disabled={createMutation.isPending}
              >
                {createMutation.isPending ? "Criando..." : "Criar Campanha"}
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
