
import { useState, useEffect } from "react";
import { Campaign } from "@/lib/api/campaigns";
import { toast } from "sonner";

export const useCampaignForm = (campaign: Campaign | null, open: boolean) => {
  const [activeTab, setActiveTab] = useState<"message" | "settings" | "schedule">("message");
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
  
  // Load campaign data when campaign changes or dialog opens
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
  
  // Reset form when dialog closes
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

  // Calculate status based on the rules provided
  const calculateStatus = (enviados: number, limite: number, dataDisparo: Date | null): string => {
    if (enviados === 0 && dataDisparo) {
      return "agendada";
    } else if (enviados > 0 && enviados < limite) {
      return "em_andamento";
    } else if (enviados >= limite) {
      return "concluida";
    } else {
      return "rascunho";
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

  return {
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
    isValid: Boolean(campaignName.trim() && message1.trim())
  };
};
