
import { supabase } from "@/lib/supabase";

// Função para atribuir um usuário a uma empresa
export const assignUserToCompany = async (userId: string, companyId: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('appw_users')
      .update({ empresa_id: companyId })
      .eq('user_id', userId);
    
    if (error) {
      console.error("Erro ao atribuir usuário à empresa:", error);
      throw new Error(`Falha ao atribuir usuário à empresa: ${error.message}`);
    }
  } catch (error) {
    console.error("Erro ao atribuir usuário à empresa:", error);
    throw error;
  }
};
