
import { supabase } from "@/lib/supabase";
import { WhatsAccount } from "./types";
import { AuthUser } from "@/contexts/AuthContext";

export const getWhatsAccounts = async (
  user: AuthUser | null, 
  selectedCompany: string | null
): Promise<WhatsAccount[]> => {
  try {
    console.log("Buscando contas de WhatsApp da tabela: AppW_Instancias");
    
    let query = supabase
      .from("AppW_Instancias")
      .select("*");
    
    if (selectedCompany && user?.role !== 'master') {
      query = query.eq('empresa_id', selectedCompany);
    }
    
    const { data, error } = await query;
    
    console.log("Resposta do Supabase:", { data, error });
    
    if (error) {
      console.error("Erro ao buscar contas de WhatsApp:", error);
      throw error;
    }
    
    return data || [];
  } catch (error) {
    console.error("Erro ao buscar contas de WhatsApp:", error);
    throw error;
  }
};

export const createWhatsAccount = async (
  data: { nome_instancia: string },
  companyId: string
): Promise<WhatsAccount> => {
  try {
    console.log(`Criando nova conta de WhatsApp para empresa ${companyId}:`, data);
    
    const { data: newAccount, error } = await supabase
      .from('AppW_Instancias')
      .insert([
        { 
          nome_instancia: data.nome_instancia, 
          empresa_id: companyId,
          status: 'close' // Estado inicial
        }
      ])
      .select()
      .single();
    
    if (error) {
      console.error("Erro ao criar conta de WhatsApp:", error);
      throw error;
    }
    
    console.log("Conta criada com sucesso:", newAccount);
    
    return newAccount;
  } catch (error) {
    console.error("Erro ao criar conta de WhatsApp:", error);
    throw error;
  }
};

export const deleteWhatsAccount = async (id: number): Promise<void> => {
  try {
    console.log(`Deletando conta de WhatsApp com ID ${id}`);
    
    const { error } = await supabase
      .from('AppW_Instancias')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error("Erro ao deletar conta de WhatsApp:", error);
      throw error;
    }
    
    console.log(`Conta com ID ${id} deletada com sucesso`);
  } catch (error) {
    console.error("Erro ao deletar conta de WhatsApp:", error);
    throw error;
  }
};

export const updateWhatsAccountStatus = async (instanceName: string, status: string): Promise<void> => {
  try {
    console.log(`Atualizando status da instância ${instanceName} para ${status}`);
    
    const { error } = await supabase
      .from('AppW_Instancias')
      .update({ status })
      .eq('nome_instancia', instanceName);
    
    if (error) {
      console.error("Erro ao atualizar status:", error);
      throw error;
    }
    
    console.log(`Status da instância ${instanceName} atualizado para ${status}`);
  } catch (error) {
    console.error("Erro ao atualizar status:", error);
    throw error;
  }
};
