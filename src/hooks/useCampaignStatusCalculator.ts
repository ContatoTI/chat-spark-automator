
import { Campaign } from "@/lib/api/campaigns";

// Tipo para status da campanha baseado nas regras definidas
export type CampaignStatus = 'rascunho' | 'agendada' | 'em_andamento' | 'concluida';

export const useCampaignStatusCalculator = () => {
  /**
   * Calcula o status da campanha baseado nas regras:
   * - Se não tiver disparado para ninguém, mas estiver com data marcada = Agendada
   * - Se já tiver disparado para pelo menos uma pessoa = Em andamento
   * - Se já tiver atingido o total de contatos = Concluída
   */
  const calculateStatus = (enviados: number = 0, limite: number = 0, dataDisparo: string | null | Date): CampaignStatus => {
    // Se já atingiu o limite de disparos, está concluída
    if (enviados >= limite && limite > 0) {
      return 'concluida';
    }
    
    // Se já enviou para pelo menos uma pessoa, está em andamento
    if (enviados > 0) {
      return 'em_andamento';
    }
    
    // Se tem data marcada, está agendada
    if (dataDisparo) {
      return 'agendada';
    }
    
    // Caso contrário, é rascunho
    return 'rascunho';
  };

  /**
   * Atualiza o status de uma campanha
   */
  const updateCampaignStatus = (campaign: Campaign): Campaign => {
    const status = calculateStatus(
      campaign.enviados, 
      campaign.limite_disparos, 
      campaign.data_disparo
    );
    
    return {
      ...campaign,
      status
    };
  };

  /**
   * Atualiza o status de múltiplas campanhas
   */
  const updateCampaignsStatus = (campaigns: Campaign[]): Campaign[] => {
    return campaigns.map(updateCampaignStatus);
  };

  return {
    calculateStatus,
    updateCampaignStatus,
    updateCampaignsStatus
  };
};

export default useCampaignStatusCalculator;
