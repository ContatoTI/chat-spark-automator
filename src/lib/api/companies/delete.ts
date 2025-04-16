
import { supabase } from "@/lib/supabase";

// Função para excluir uma empresa
export const deleteCompany = async (id: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('AppW_Options')
      .delete()
      .eq('empresa_id', id);
    
    if (error) {
      console.error("Erro ao excluir empresa:", error);
      throw new Error(`Falha ao excluir empresa: ${error.message}`);
    }
  } catch (error) {
    console.error("Erro ao excluir empresa:", error);
    throw error;
  }
};
