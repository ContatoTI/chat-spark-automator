
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

interface NewCampaignDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const NewCampaignDialog: React.FC<NewCampaignDialogProps> = ({ 
  open, 
  onOpenChange 
}) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"message" | "schedule">("message");
  const [campaignName, setCampaignName] = useState("");
  const [messageText, setMessageText] = useState("");
  const [selectedTab, setSelectedTab] = useState<"text" | "media">("text");
  
  const handleNext = () => {
    if (!campaignName.trim() || !messageText.trim()) {
      toast.error("Por favor, preencha todos os campos obrigatórios.");
      return;
    }
    setActiveTab("schedule");
  };
  
  const handleSubmit = () => {
    toast.success("Campanha criada com sucesso!");
    onOpenChange(false);
    navigate("/campaigns");
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
                  <div className="grid grid-cols-3 gap-4">
                    <div className="flex flex-col items-center justify-center gap-2 p-4 border border-dashed rounded-md hover:bg-muted/50 cursor-pointer transition-colors">
                      <ImageIcon className="h-8 w-8 text-muted-foreground" />
                      <span className="text-sm font-medium">Imagem</span>
                    </div>
                    <div className="flex flex-col items-center justify-center gap-2 p-4 border border-dashed rounded-md hover:bg-muted/50 cursor-pointer transition-colors">
                      <File className="h-8 w-8 text-muted-foreground" />
                      <span className="text-sm font-medium">Documento</span>
                    </div>
                    <div className="flex flex-col items-center justify-center gap-2 p-4 border border-dashed rounded-md hover:bg-muted/50 cursor-pointer transition-colors">
                      <Link className="h-8 w-8 text-muted-foreground" />
                      <span className="text-sm font-medium">Link</span>
                    </div>
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
                  <Button variant="outline" size="sm">
                    Agendar
                  </Button>
                </div>
              </div>
              
              <div className="p-4 border rounded-md bg-amber-50 dark:bg-amber-900/20 text-amber-800 dark:text-amber-300">
                <h4 className="font-medium">Resumo da Campanha</h4>
                <p className="text-sm mt-1">Nome: {campaignName}</p>
                <p className="text-sm mt-1">Tipo: Texto</p>
                <p className="text-sm mt-1">Status: Rascunho</p>
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
              <Button onClick={handleSubmit} className="bg-primary">
                Criar Campanha
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
