
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
    
    // Format date as YYYY-MM-DD string without timezone conversion
    let formattedDate = null;
    if (scheduleDate && scheduleTime) {
      // Get year, month, day parts from the date
      const year = scheduleDate.getFullYear();
      const month = String(scheduleDate.getMonth() + 1).padStart(2, '0');
      const day = String(scheduleDate.getDate()).padStart(2, '0');
      
      // Create formatted date string in YYYY-MM-DD format
      formattedDate = `${year}-${month}-${day} ${scheduleTime}:00`;
      console.log("Data formatada sem timezone:", formattedDate);
    }
    
    const status = calculateStatus(enviados, limiteDisparos, scheduleDate);
    
    const updatedCampaign: Partial<Campaign> = {
      nome: campaignName,
      mensagem01: message1,
      mensagem02: message2 || null,
      mensagem03: message3 || null,
      mensagem04: message4 || null,
      tipo_midia: mediaType,
      url_midia: mediaUrl || null,
      data_disparo: formattedDate, // Store as string without timezone information
      status: status,
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
