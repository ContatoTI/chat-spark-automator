
import { supabase } from "@/lib/supabase";
import { DisparoOptions } from "@/lib/api/settings";

// Função para buscar as configurações de uma empresa específica
export const fetchCompanySettings = async (companyId: string): Promise<DisparoOptions> => {
  try {
    const { data, error } = await supabase
      .from('AppW_Options')
      .select('*')
      .eq('empresa_id', companyId)
      .single();
    
    if (error) {
      console.error("Erro ao buscar configurações da empresa:", error);
      throw new Error(`Falha ao buscar configurações da empresa: ${error.message}`);
    }
    
    return data as DisparoOptions;
  } catch (error) {
    console.error("Erro ao buscar configurações da empresa:", error);
    throw error;
  }
};
