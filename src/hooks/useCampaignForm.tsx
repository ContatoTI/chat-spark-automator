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
  const [mediaType, setMediaType] = useState<string | null>("text");
  const [mediaUrl, setMediaUrl] = useState<string>("");
  const [scheduleDate, setScheduleDate] = useState<Date | undefined>(undefined);
  const [scheduleTime, setScheduleTime] = useState<string>("");
  
  const [producao, setProducao] = useState(false);
  const [limiteDisparos, setLimiteDisparos] = useState(1000);
  const [selectedInstance, setSelectedInstance] = useState<string | null>(null);
  
  useEffect(() => {
    if (campaign && open) {
      setCampaignName(campaign.nome);
      setMessage1(campaign.mensagem01);
      setMessage2(campaign.mensagem02 || "");
      setMessage3(campaign.mensagem03 || "");
      setMessage4(campaign.mensagem04 || "");
      setMediaType(campaign.tipo_midia || "text");
      setMediaUrl(campaign.url_midia || "");
      
      if (campaign.data_disparo) {
        console.log("Data original no Supabase:", campaign.data_disparo);

        let dateParts;
        
        if (campaign.data_disparo.includes('T')) {
          const isoDate = new Date(campaign.data_disparo);
          const year = isoDate.getFullYear();
          const month = isoDate.getMonth();
          const day = isoDate.getDate();
          
          const localDate = new Date(year, month, day);
          setScheduleDate(localDate);
          
          const hours = isoDate.getHours();
          const minutes = isoDate.getMinutes() >= 30 ? "30" : "00";
          setScheduleTime(`${hours.toString().padStart(2, '0')}:${minutes}`);
        } 
        else if (campaign.data_disparo.includes(' ')) {
          dateParts = campaign.data_disparo.split(' ');
          const [datePart, timePart] = dateParts;
          
          const [year, month, day] = datePart.split('-').map(Number);
          setScheduleDate(new Date(year, month - 1, day));
          
          const timeComponents = timePart.split(':');
          setScheduleTime(`${timeComponents[0]}:${timeComponents[1]}`);
        } 
        else {
          dateParts = campaign.data_disparo.split('-');
          if (dateParts.length === 3) {
            const [year, month, day] = dateParts.map(Number);
            setScheduleDate(new Date(year, month - 1, day));
            setScheduleTime("09:00");
          }
        }
        
        console.log("Data convertida para exibição:", scheduleDate);
      } else {
        setScheduleDate(undefined);
        setScheduleTime("");
      }
      
      setActiveTab("message");
      
      setSelectedInstance(campaign.instancia);
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
      setSelectedInstance(null);
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
    selectedInstance,
    setSelectedInstance,
    isValid: Boolean(campaignName.trim() && message1.trim())
  };
};
