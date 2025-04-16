
import { supabase } from "@/lib/supabase";

// Função para criar uma nova empresa
export const createCompany = async (name: string, customId?: string): Promise<string> => {
  try {
    // Usar o ID personalizado ou gerar um novo se não for fornecido
    const companyId = customId || crypto.randomUUID();
    
    // Verificar se o ID já existe
    if (customId) {
      const { data, error: checkError } = await supabase
        .from('AppW_Options')
        .select('empresa_id')
        .eq('empresa_id', customId)
        .maybeSingle();
      
      if (checkError) {
        console.error("Erro ao verificar ID existente:", checkError);
        throw new Error(`Erro ao verificar ID existente: ${checkError.message}`);
      }
      
      if (data) {
        throw new Error(`ID de empresa já existente. Por favor, escolha outro ID.`);
      }
    }
    
    // Adicionar empresa à tabela AppW_Options
    const { error } = await supabase
      .from('AppW_Options')
      .insert([{
        empresa_id: companyId,
        nome_da_empresa: name,
        created_at: new Date().toISOString(),
        ativo: true
      }]);
    
    if (error) {
      console.error("Erro ao criar empresa:", error);
      throw new Error(`Falha ao criar empresa: ${error.message}`);
    }
    
    return companyId;
  } catch (error) {
    console.error("Erro ao criar empresa:", error);
    throw error;
  }
};
