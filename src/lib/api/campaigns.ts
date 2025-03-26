
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
}

/**
 * Verifica se a tabela AppW_Campanhas existe e cria amostra se não houver dados
 */
const ensureCampaignsTable = async (): Promise<boolean> => {
  try {
    // Verificar se existem campanhas na tabela
    const { count, error } = await supabase
      .from('AppW_Campanhas')
      .select('*', { count: 'exact', head: true });
    
    if (error) {
      console.error('Erro ao verificar tabela de campanhas:', error);
      return false;
    }
    
    // Se não houver campanhas, insere amostras
    if (count === 0) {
      await insertSampleCampaigns();
    }
    
    return true;
  } catch (error) {
    console.error('Erro ao verificar tabela de campanhas:', error);
    return false;
  }
};

/**
 * Fetches all campaigns from Supabase
 */
export const fetchCampaigns = async (): Promise<Campaign[]> => {
  try {
    // Garantir que a tabela existe e tem dados
    await ensureCampaignsTable();
    
    const { data, error } = await supabase
      .from('AppW_Campanhas')
      .select('*')
      .order('data', { ascending: false });

    if (error) {
      console.error('Erro detalhado ao buscar campanhas:', error);
      throw new Error(`Erro ao buscar campanhas: ${error.message}`);
    }

    console.log('Campanhas carregadas:', data?.length || 0);
    
    // Add some UI-specific fields
    return (data || []).map(campaign => ({
      ...campaign,
      contacts: Math.floor(Math.random() * 2000) + 100, // Random number for contacts
      delivered: campaign.status === 'completed' 
        ? Math.floor(Math.random() * 1000) + 50
        : campaign.status === 'sending'
          ? Math.floor(Math.random() * 50)
          : 0
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
    status: "completed"
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
    status: "scheduled"
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
    status: "failed"
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
    status: "completed"
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
    status: "draft"
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
    status: "sending"
  }
];

// Insert sample campaigns if none exist
export const insertSampleCampaigns = async (): Promise<void> => {
  try {
    const { data } = await supabase
      .from('AppW_Campanhas')
      .select('*')
      .limit(1);
    
    if (data && data.length > 0) {
      console.log('Campanhas já existem, pulando inserção');
      return; // Campaigns already exist
    }
    
    console.log('Inserindo campanhas de exemplo...');
    const { error } = await supabase.from('AppW_Campanhas').insert(sampleCampaigns);
    
    if (error) {
      console.error('Erro ao inserir campanhas de exemplo:', error);
      return;
    }
    
    console.log('Campanhas de exemplo inseridas com sucesso');
  } catch (error) {
    console.error('Erro ao inserir campanhas de exemplo:', error);
  }
};
