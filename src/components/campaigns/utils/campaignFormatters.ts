
import { Campaign } from "@/lib/api/campaigns";

interface CampaignFormData {
  campaignName: string;
  message1: string;
  message2: string;
  message3: string;
  message4: string;
  mediaType: string | null;
  mediaUrl: string;
  scheduleDate: Date | undefined;
  scheduleTime: string;
  producao: boolean;
  limiteDisparos: number;
  enviados: number;
}

export const formatCampaignForUpdate = (formData: CampaignFormData): Partial<Campaign> => {
  // Format date as YYYY-MM-DD string without timezone conversion
  let formattedDate = null;
  if (formData.scheduleDate && formData.scheduleTime) {
    // Get year, month, day parts from the date
    const year = formData.scheduleDate.getFullYear();
    const month = String(formData.scheduleDate.getMonth() + 1).padStart(2, '0');
    const day = String(formData.scheduleDate.getDate()).padStart(2, '0');
    
    // Create formatted date string in YYYY-MM-DD format
    formattedDate = `${year}-${month}-${day} ${formData.scheduleTime}:00`;
    console.log("Data formatada sem timezone:", formattedDate);
  }
  
  const status = calculateStatus(formData.enviados, formData.limiteDisparos, formData.scheduleDate);
  
  return {
    nome: formData.campaignName,
    mensagem01: formData.message1,
    mensagem02: formData.message2 || null,
    mensagem03: formData.message3 || null,
    mensagem04: formData.message4 || null,
    tipo_midia: formData.mediaType,
    url_midia: formData.mediaUrl || null,
    data_disparo: formattedDate, // Store as string without timezone information
    status: status,
    producao: formData.producao,
    limite_disparos: formData.limiteDisparos
  };
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
