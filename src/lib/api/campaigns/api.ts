
import { supabase } from "@/lib/supabase";
import { Campaign } from "./types";
import { User } from "@/lib/api/users";

/**
 * Fetches all campaigns from Supabase
 */
export const fetchCampaigns = async (currentUser?: User | null, selectedCompanyId?: string | null): Promise<Campaign[]> => {
  try {
    console.log("Buscando campanhas com filtros:", { userRole: currentUser?.role, companyId: selectedCompanyId, userCompanyId: currentUser?.company_id });
    
    let query = supabase
      .from('AppW_Campanhas')
      .select('*')
      .order('data', { ascending: false });

    // Filtrar por empresa se for usuário master com empresa selecionada
    if (currentUser?.role === 'master' && selectedCompanyId) {
      query = query.eq('empresa_id', selectedCompanyId);
    } 
    // Filtrar para usuários admin e comuns pela empresa deles
    else if (currentUser?.role !== 'master' && currentUser?.company_id) {
      query = query.eq('empresa_id', currentUser.company_id);
    }

    const { data, error } = await query;

    if (error) {
      throw new Error(`Erro ao buscar campanhas: ${error.message}`);
    }

    console.log(`Campanhas encontradas: ${data?.length || 0}`);

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
      enviados: campaign.enviados || 0,
      empresa_id: campaign.empresa_id || ''
    }));
  } catch (error) {
    console.error('Erro ao buscar campanhas:', error);
    throw error;
  }
};

/**
 * Creates a new campaign in Supabase
 */
export const createCampaign = async (campaign: Campaign, currentUser?: User | null, selectedCompanyId?: string | null): Promise<Campaign> => {
  try {
    // Ensure empresa_id is set correctly based on user role and selected company
    let empresa_id: string;
    
    if (campaign.empresa_id) {
      // Se já tiver o empresa_id, mantém o valor
      empresa_id = campaign.empresa_id;
    } else if (currentUser?.role === 'master' && selectedCompanyId) {
      // Usuário master com empresa selecionada
      empresa_id = selectedCompanyId;
    } else if (currentUser?.company_id) {
      // Usuário comum ou admin usa a empresa associada
      empresa_id = currentUser.company_id;
    } else {
      throw new Error("Empresa não identificada. Selecione uma empresa ou verifique suas permissões.");
    }
    
    const campaignWithCompany = {
      ...campaign,
      empresa_id
    };
    
    console.log("Criando campanha para empresa:", empresa_id);

    const { data, error } = await supabase
      .from('AppW_Campanhas')
      .insert([campaignWithCompany])
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
