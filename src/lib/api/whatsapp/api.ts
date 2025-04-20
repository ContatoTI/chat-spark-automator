
import { supabase } from "@/lib/supabase";
import { WhatsAccount } from "./types";
import { User } from "@/lib/api/users";

export const getWhatsAccounts = async (
  user: User | null, 
  selectedCompany: string | null
): Promise<WhatsAccount[]> => {
  try {
    console.log("Buscando contas de WhatsApp da tabela: AppW_Instancias");
    console.log("Usuário:", user?.role, "Empresa selecionada:", selectedCompany);
    
    let query = supabase
      .from("AppW_Instancias")
      .select("*");
    
    // Se tiver uma empresa selecionada E não for usuário master, filtra pela empresa
    if (selectedCompany && user?.role !== 'master') {
      console.log("Filtrando pela empresa:", selectedCompany);
      query = query.eq('empresa_id', selectedCompany);
    } else if (user?.company_id && user?.role !== 'master') {
      // Se não tiver empresa selecionada mas o usuário tem uma empresa associada e não é master
      console.log("Filtrando pela empresa do usuário:", user.company_id);
      query = query.eq('empresa_id', user.company_id);
    } else if (selectedCompany && user?.role === 'master') {
      // Se for master E tiver empresa selecionada, filtra pela empresa selecionada
      console.log("Master com empresa selecionada:", selectedCompany);
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
  data: { nome_instancia: string; empresa_id?: string }, 
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
  console.log(`[DB] Atualizando status da instância ${instanceName} para ${status}`);
  
  try {
    const { data, error } = await supabase
      .from('AppW_Instancias')
      .update({ status })
      .eq('nome_instancia', instanceName)
      .select();
    
    if (error) {
      console.error("[DB] Erro ao atualizar status:", error);
      throw error;
    }
    
    // Log mais detalhado do resultado
    if (data && data.length > 0) {
      console.log(`[DB] Status atualizado com sucesso para instância ${instanceName}:`, data[0]);
    } else {
      console.warn(`[DB] Nenhum registro atualizado para instância ${instanceName}`);
    }
  } catch (error) {
    console.error("[DB] Erro ao atualizar status:", error);
    throw error;
  }
};
