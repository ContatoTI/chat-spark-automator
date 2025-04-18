
import { supabase } from "@/lib/supabase";
import { DisparoOptions, DEFAULT_OPTIONS } from "@/lib/api/settings";

export const fetchCompanySettings = async (companyId: string): Promise<DisparoOptions> => {
  try {
    console.log(`Buscando configurações para empresa ${companyId}`);
    
    const { data, error } = await supabase
      .from('AppW_Options')
      .select('*')
      .eq('empresa_id', companyId)
      .single();
    
    if (error) {
      console.error("Erro ao buscar configurações da empresa:", error);
      throw new Error(`Falha ao buscar configurações da empresa: ${error.message}`);
    }
    
    if (!data) {
      console.log(`Nenhuma configuração encontrada para empresa ${companyId}, criando nova...`);
      const newSettings: DisparoOptions = {
        ...DEFAULT_OPTIONS,
        empresa_id: companyId,
        ativo: true,
        horario_limite: 17,
        long_wait_min: 50,
        long_wait_max: 240,
        short_wait_min: 5,
        short_wait_max: 10,
        batch_size_min: 5,
        batch_size_max: 10,
        ftp_port: 21,
      } as DisparoOptions;

      const { error: insertError } = await supabase
        .from('AppW_Options')
        .insert(newSettings);

      if (insertError) {
        throw new Error(`Erro ao criar configurações padrão: ${insertError.message}`);
      }

      return newSettings;
    }
    
    return {
      ...DEFAULT_OPTIONS,
      ...data,
      empresa_id: companyId
    } as DisparoOptions;
  } catch (error) {
    console.error("Erro ao buscar configurações da empresa:", error);
    throw error;
  }
};
