
import { supabase } from "@/lib/supabase";

export interface Company {
  id: string;
  name: string;
  created_at: string;
}

// Função para buscar empresas
export const fetchCompanies = async (): Promise<Company[]> => {
  console.log("Buscando empresas");
  
  try {
    const { data, error } = await supabase
      .from('AppW_Options')
      .select('empresa_id, nome_da_empresa, created_at');
    
    if (error) {
      console.error("Erro ao buscar empresas:", error);
      throw new Error(`Falha ao buscar empresas: ${error.message}`);
    }
    
    // Transformar os dados para o formato esperado
    const companies = data?.map(company => ({
      id: company.empresa_id,
      name: company.nome_da_empresa || 'Empresa sem nome',
      created_at: company.created_at || new Date().toISOString()
    })) || [];
    
    console.log("Empresas processadas:", companies.length);
    return companies;
  } catch (error) {
    console.error("Erro em fetchCompanies:", error);
    throw error;
  }
};

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

// Função para atualizar o nome de uma empresa
export const updateCompany = async (id: string, name: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('AppW_Options')
      .update({ nome_da_empresa: name })
      .eq('empresa_id', id);
    
    if (error) {
      console.error("Erro ao atualizar empresa:", error);
      throw new Error(`Falha ao atualizar empresa: ${error.message}`);
    }
  } catch (error) {
    console.error("Erro ao atualizar empresa:", error);
    throw error;
  }
};

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
