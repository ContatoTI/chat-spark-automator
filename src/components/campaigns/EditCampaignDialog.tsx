
import React from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateCampaign, Campaign } from "@/lib/api/campaigns";
import { MessageTab } from "./dialog/MessageTab";
import { SettingsTab } from "./dialog/SettingsTab";
import { ScheduleTab } from "./dialog/ScheduleTab";
import { TabNavigation } from "./dialog/TabNavigation";
import { CampaignDialogFooter } from "./dialog/DialogFooter";
import { useCampaignForm } from "@/hooks/useCampaignForm";

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
  const enviados = campaign?.enviados || 0;
  
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
    handleNext,
    handleBack,
    calculateStatus,
    handleMediaSelection,
    generateTimeOptions,
    isValid
  } = useCampaignForm(campaign, open);
  
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

  if (!campaign) return null;

  const timeOptions = generateTimeOptions();
  
  const handleInvalidTabClick = () => {
    toast.error("Por favor, preencha todos os campos obrigatórios.");
  };

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
          <TabNavigation 
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            isValid={isValid}
            onInvalidTabClick={handleInvalidTabClick}
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
              timeOptions={timeOptions}
            />
          )}
        </div>
        
        <CampaignDialogFooter
          activeTab={activeTab}
          handleNext={handleNext}
          handleBack={handleBack}
          handleSubmit={handleSubmit}
          onClose={() => onOpenChange(false)}
          isSubmitting={updateMutation.isPending}
        />
      </DialogContent>
    </Dialog>
  );
};
