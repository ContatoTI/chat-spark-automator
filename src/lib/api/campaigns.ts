
import { supabase } from "@/lib/supabase";

export interface Campaign {
  id?: number;
  nome: string;
  data: string | null;
  mensagem01: string;
  mensagem02: string | null;
  mensagem03: string | null;
  mensagem04: string | null;
  tipo_midia: string | null;
  url_midia: string | null;
  data_disparo: string | null;
  status: string;
  contacts?: number; // For UI purposes
  delivered?: number; // For UI purposes
  
  // Campos movidos de AppW_Options para AppW_Campanhas
  producao: boolean;
  limite_disparos: number;
  enviados: number;
}

/**
 * Fetches all campaigns from Supabase
 */
export const fetchCampaigns = async (): Promise<Campaign[]> => {
  try {
    const { data, error } = await supabase
      .from('AppW_Campanhas')
      .select('*')
      .order('data', { ascending: false });

    if (error) {
      throw new Error(`Erro ao buscar campanhas: ${error.message}`);
    }

    // Add some UI-specific fields and defaults for new fields if they don't exist
    return (data || []).map(campaign => ({
      ...campaign,
      contacts: Math.floor(Math.random() * 2000) + 100, // Random number for contacts
      delivered: campaign.enviados || (campaign.status === 'completed' 
        ? Math.floor(Math.random() * 1000) + 50
        : campaign.status === 'sending'
          ? Math.floor(Math.random() * 50)
          : 0),
      // Garantir que os novos campos tenham valores padrão se não existirem
      producao: campaign.producao !== undefined ? campaign.producao : false,
      limite_disparos: campaign.limite_disparos || 1000,
      enviados: campaign.enviados || 0
    }));
  } catch (error) {
    console.error('Erro ao buscar campanhas:', error);
    throw error;
  }
};

/**
 * Creates a new campaign in Supabase
 */
export const createCampaign = async (campaign: Campaign): Promise<Campaign> => {
  try {
    const { data, error } = await supabase
      .from('AppW_Campanhas')
      .insert([campaign])
      .select()
      .single();

    if (error) {
      throw new Error(`Erro ao criar campanha: ${error.message}`);
    }

    return data;
  } catch (error) {
    console.error('Erro ao criar campanha:', error);
    throw error;
  }
};

/**
 * Updates an existing campaign in Supabase
 */
export const updateCampaign = async (id: number, campaign: Partial<Campaign>): Promise<Campaign> => {
  try {
    const { data, error } = await supabase
      .from('AppW_Campanhas')
      .update(campaign)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(`Erro ao atualizar campanha: ${error.message}`);
    }

    return data;
  } catch (error) {
    console.error('Erro ao atualizar campanha:', error);
    throw error;
  }
};

/**
 * Deletes a campaign from Supabase
 */
export const deleteCampaign = async (id: number): Promise<void> => {
  try {
    const { error } = await supabase
      .from('AppW_Campanhas')
      .delete()
      .eq('id', id);

    if (error) {
      throw new Error(`Erro ao excluir campanha: ${error.message}`);
    }
  } catch (error) {
    console.error('Erro ao excluir campanha:', error);
    throw error;
  }
};

// Sample campaigns data
const sampleCampaigns: Campaign[] = [
  {
    nome: "Promoção de Verão",
    data: new Date().toISOString(),
    mensagem01: "Olá! Aproveite nossa promoção de verão com 20% de desconto em todos os produtos.",
    mensagem02: "Oferta válida até o final do mês!",
    mensagem03: null,
    mensagem04: null,
    tipo_midia: "image",
    url_midia: "https://example.com/summer-promo.jpg",
    data_disparo: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    status: "completed",
    producao: false,
    limite_disparos: 2000,
    enviados: 1200
  },
  {
    nome: "Lançamento Produto X",
    data: new Date().toISOString(),
    mensagem01: "Estamos lançando nosso novo produto X! Confira as novidades.",
    mensagem02: "Condições especiais para os primeiros compradores.",
    mensagem03: "Garanta o seu com 15% de desconto!",
    mensagem04: null,
    tipo_midia: "video",
    url_midia: "https://example.com/product-x-launch.mp4",
    data_disparo: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    status: "scheduled",
    producao: false,
    limite_disparos: 1500,
    enviados: 0
  },
  {
    nome: "Pesquisa de Satisfação",
    data: new Date().toISOString(),
    mensagem01: "Gostaríamos de saber sua opinião sobre nossos produtos e serviços.",
    mensagem02: "Responda nossa pesquisa e ganhe um cupom de desconto!",
    mensagem03: null,
    mensagem04: null,
    tipo_midia: "link",
    url_midia: "https://example.com/survey",
    data_disparo: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    status: "failed",
    producao: false,
    limite_disparos: 800,
    enviados: 600
  },
  {
    nome: "Atualização do Sistema",
    data: new Date().toISOString(),
    mensagem01: "Informamos que nosso sistema será atualizado no próximo domingo.",
    mensagem02: "O serviço estará indisponível das 2h às 4h da manhã.",
    mensagem03: "Agradecemos sua compreensão.",
    mensagem04: null,
    tipo_midia: null,
    url_midia: null,
    data_disparo: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    status: "completed",
    producao: true,
    limite_disparos: 3000,
    enviados: 2800
  },
  {
    nome: "Convite para Evento",
    data: new Date().toISOString(),
    mensagem01: "Você está convidado para nosso evento anual!",
    mensagem02: "Data: 20 de Dezembro às 19h",
    mensagem03: "Local: Av. Principal, 1000",
    mensagem04: "Confirme sua presença respondendo esta mensagem.",
    tipo_midia: "image",
    url_midia: "https://example.com/event-invite.jpg",
    data_disparo: null,
    status: "draft",
    producao: false,
    limite_disparos: 500,
    enviados: 0
  },
  {
    nome: "Confirmação de Pedido",
    data: new Date().toISOString(),
    mensagem01: "Seu pedido #12345 foi confirmado!",
    mensagem02: "Previsão de entrega: 3 dias úteis",
    mensagem03: "Obrigado por comprar conosco!",
    mensagem04: null,
    tipo_midia: null,
    url_midia: null,
    data_disparo: new Date().toISOString(),
    status: "sending",
    producao: true,
    limite_disparos: 1,
    enviados: 0
  }
];

// Insert sample campaigns if none exist
export const insertSampleCampaigns = async (): Promise<void> => {
  const { data } = await supabase
    .from('AppW_Campanhas')
    .select('*')
    .limit(1);
  
  if (data && data.length > 0) {
    return; // Campaigns already exist
  }
  
  try {
    await supabase.from('AppW_Campanhas').insert(sampleCampaigns);
    console.log('Sample campaigns inserted successfully');
  } catch (error) {
    console.error('Error inserting sample campaigns:', error);
  }
};
