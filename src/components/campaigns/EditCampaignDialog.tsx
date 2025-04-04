import React from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription
} from "@/components/ui/dialog";
import { Campaign } from "@/lib/api/campaigns";
import { MessageTab } from "./dialog/MessageTab";
import { SettingsTab } from "./dialog/SettingsTab";
import { ScheduleTab } from "./dialog/ScheduleTab";
import { TabNavigation } from "./dialog/TabNavigation";
import { CampaignDialogFooter } from "./dialog/DialogFooter";
import { useCampaignForm } from "@/hooks/useCampaignForm";
import { useEditCampaign } from "@/hooks/useEditCampaign";
import { formatCampaignForUpdate } from "./utils/campaignFormatters";
import { toast } from "sonner";

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
  const { updateMutation, isSubmitting } = useEditCampaign(() => onOpenChange(false));
  
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
  
  const handleSubmit = () => {
    if (!campaign?.id) {
      toast.error("ID da campanha não encontrado");
      return;
    }
    
    const updatedCampaign = formatCampaignForUpdate({
      campaignName,
      message1,
      message2,
      message3,
      message4,
      mediaType,
      mediaUrl,
      scheduleDate,
      scheduleTime,
      producao,
      limiteDisparos,
      enviados: campaign.enviados || 0
    });
    
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
              enviados={campaign.enviados || 0}
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
              enviados={campaign.enviados || 0}
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
          isSubmitting={isSubmitting}
        />
      </DialogContent>
    </Dialog>
  );
};
