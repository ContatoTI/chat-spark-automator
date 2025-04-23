import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useCampaignForm } from "@/hooks/useCampaignForm";
import { Campaign, createCampaign } from "@/lib/api/campaigns";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { TabNavigation } from "@/components/campaigns/dialog/TabNavigation";
import { MessageTab } from "@/components/campaigns/dialog/MessageTab";
import { SettingsTab } from "@/components/campaigns/dialog/SettingsTab";
import { ScheduleTab } from "@/components/campaigns/dialog/ScheduleTab";
import { CampaignDialogFooter } from "@/components/campaigns/dialog/DialogFooter";
import { useAuth } from "@/contexts/AuthContext";

interface NewCampaignDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const NewCampaignDialog: React.FC<NewCampaignDialogProps> = ({
  open,
  onOpenChange
}) => {
  const queryClient = useQueryClient();
  const { user, selectedCompany } = useAuth();
  
  const {
    activeTab,
    setActiveTab,
    campaignName,
    setCampaignName,
    message1,
    setMessage1,
    message2,
    setMessage2,
    message3,
    setMessage3,
    message4,
    setMessage4,
    mediaType,
    setMediaType,
    mediaUrl,
    setMediaUrl,
    scheduleDate,
    setScheduleDate,
    scheduleTime,
    setScheduleTime,
    producao,
    setProducao,
    limiteDisparos,
    setLimiteDisparos,
    selectedInstance,
    setSelectedInstance,
    handleNext,
    handleBack,
    handleMediaSelection,
    generateTimeOptions,
    isValid
  } = useCampaignForm(null, open);
  
  const [enviados, setEnviados] = React.useState(0);

  const createMutation = useMutation({
    mutationFn: (newCampaign: Campaign) => createCampaign(newCampaign),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['campaigns']
      });
      toast.success("Campanha criada com sucesso!");
      onOpenChange(false);
    },
    onError: error => {
      toast.error(`Erro ao criar campanha: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    }
  });

  const handleSubmit = () => {
    const scheduleDateObj = scheduleDate ? new Date(scheduleDate) : null;
    
    if (scheduleTime && scheduleDateObj) {
      const [hours, minutes] = scheduleTime.split(':').map(Number);
      scheduleDateObj.setHours(hours, minutes, 0, 0);
    }

    const today = new Date();
    
    const empresa_id = user?.role === 'master' && selectedCompany 
      ? selectedCompany 
      : user?.company_id;

    if (!empresa_id) {
      toast.error("Erro ao criar campanha: empresa não identificada");
      return;
    }

    const newCampaign: Campaign = {
      nome: campaignName,
      data: today.toISOString(),
      mensagem01: message1,
      mensagem02: message2 || null,
      mensagem03: message3 || null,
      mensagem04: message4 || null,
      tipo_midia: mediaType,
      url_midia: mediaUrl || null,
      data_disparo: scheduleDateObj ? scheduleDateObj.toISOString() : null,
      status: scheduleDateObj ? "scheduled" : "draft",
      producao: producao,
      limite_disparos: limiteDisparos,
      enviados: enviados,
      empresa_id: empresa_id,
      instancia: selectedInstance
    };
    
    createMutation.mutate(newCampaign);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[900px]">
        <DialogHeader>
          <DialogTitle>Nova Campanha</DialogTitle>
          <DialogDescription>
            Crie uma nova campanha para enviar mensagens para seus contatos.
          </DialogDescription>
        </DialogHeader>
        
        <div className="mt-4">
          <TabNavigation 
            activeTab={activeTab} 
            setActiveTab={setActiveTab} 
            isValid={isValid}
            onInvalidTabClick={() => toast.error("Por favor, preencha todos os campos obrigatórios.")}
          />
          
          {activeTab === "message" && (
            <MessageTab 
              campaignName={campaignName}
              setCampaignName={setCampaignName}
              message1={message1}
              setMessage1={setMessage1}
              message2={message2}
              setMessage2={setMessage2}
              message3={message3}
              setMessage3={setMessage3}
              message4={message4}
              setMessage4={setMessage4}
              mediaType={mediaType}
              setMediaType={setMediaType}
              mediaUrl={mediaUrl}
              setMediaUrl={setMediaUrl}
              handleMediaSelection={handleMediaSelection}
            />
          )}
          
          {activeTab === "settings" && (
            <SettingsTab 
              limiteDisparos={limiteDisparos}
              setLimiteDisparos={setLimiteDisparos}
              enviados={enviados}
              producao={producao}
              setProducao={setProducao}
              selectedInstance={selectedInstance}
              setSelectedInstance={setSelectedInstance}
            />
          )}
          
          {activeTab === "schedule" && (
            <ScheduleTab 
              campaignName={campaignName}
              mediaType={mediaType}
              scheduleDate={scheduleDate}
              setScheduleDate={setScheduleDate}
              scheduleTime={scheduleTime}
              setScheduleTime={setScheduleTime}
              enviados={enviados}
              limiteDisparos={limiteDisparos}
              producao={producao}
              timeOptions={generateTimeOptions()}
            />
          )}
        </div>
        
        <CampaignDialogFooter 
          activeTab={activeTab}
          handleNext={handleNext}
          handleBack={handleBack}
          handleSubmit={handleSubmit}
          onClose={() => onOpenChange(false)}
          isSubmitting={createMutation.isPending}
        />
      </DialogContent>
    </Dialog>
  );
};
