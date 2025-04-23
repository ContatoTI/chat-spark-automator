
import { Campaign } from "@/lib/api/campaigns";

interface CampaignUpdateParams {
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
}: CampaignUpdateParams): Partial<Campaign> => {
  return {
    nome: campaignName,
    mensagem01: message1,
    mensagem02: message2 || null,
    mensagem03: message3 || null,
    mensagem04: message4 || null,
    tipo_midia: mediaType,
    url_midia: mediaUrl || null,
    data_disparo: scheduleDate ? new Date(scheduleDate.setHours(
      parseInt(scheduleTime.split(':')[0]),
      parseInt(scheduleTime.split(':')[1])
    )).toISOString() : null,
    producao,
    limite_disparos: limiteDisparos,
    enviados,
    selected_instance: selectedInstance,
    status: enviados > 0 ? 'em_andamento' : scheduleDate ? 'agendada' : 'rascunho'
  };
};
