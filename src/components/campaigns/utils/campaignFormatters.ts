
import { Campaign } from "@/lib/api/campaigns/types";

interface CampaignFormData {
  campaignName: string;
  message1: string;
  message2: string | null;
  message3: string | null;
  message4: string | null;
  mediaType: string | null;
  mediaUrl: string | null;
  scheduleDate: Date | undefined;
  scheduleTime: string;
  producao: boolean;
  limiteDisparos: number;
  enviados: number;
  selectedInstance: string | null;
}

export const formatCampaignForUpdate = ({
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
  enviados,
  selectedInstance
}: CampaignFormData): Partial<Campaign> => {
  let dataDisparo: string | null = null;
  
  if (scheduleDate && scheduleTime) {
    const [hours, minutes] = scheduleTime.split(':').map(Number);
    const date = new Date(scheduleDate);
    date.setHours(hours, minutes, 0, 0);
    dataDisparo = date.toISOString();
  }
  
  return {
    nome: campaignName,
    mensagem01: message1,
    mensagem02: message2 || null,
    mensagem03: message3 || null,
    mensagem04: message4 || null,
    tipo_midia: mediaType,
    url_midia: mediaUrl,
    data_disparo: dataDisparo,
    producao,
    limite_disparos: limiteDisparos,
    enviados,
    instancia: selectedInstance  // Using "instancia" instead of "selected_instance"
  };
};
