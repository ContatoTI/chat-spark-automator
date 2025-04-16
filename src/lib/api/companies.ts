import { supabase } from "@/lib/supabase";
import { DisparoOptions } from "@/lib/api/settings";

export interface Company {
  id: string;
  name: string;
  created_at: string;
}

// Função para buscar empresas
export const fetchCompanies = async (empresa_id?: string): Promise<Company[]> => {
  console.log("Buscando empresas", empresa_id ? `para empresa ${empresa_id}` : 'todas');
  
  // Se não houver empresa_id, retorna lista vazia
  if (!empresa_id) {
    console.log("Nenhuma empresa selecionada, retornando lista vazia");
    return [];
  }
  
  try {
    const start = performance.now();
    
    // Query base com filtro por empresa_id
    const query = supabase
      .from('AppW_Options')
      .select('empresa_id, nome_da_empresa, created_at')
      .eq('empresa_id', empresa_id)
      .limit(100)
      .order('created_at', { ascending: false });
    
    const { data, error } = await query;
    
    if (error) {
      console.error("Erro ao buscar empresas:", error);
      throw new Error(`Falha ao buscar empresas: ${error.message}`);
    }
    
    if (!data || data.length === 0) {
      console.log("Nenhuma empresa encontrada");
      return [];
    }
    
    // Remover duplicatas usando Map para melhor performance
    const uniqueCompanies = new Map<string, Company>();
    
    data.forEach(company => {
      if (company.empresa_id && !uniqueCompanies.has(company.empresa_id)) {
        uniqueCompanies.set(company.empresa_id, {
          id: company.empresa_id,
          name: company.nome_da_empresa || 'Empresa sem nome',
          created_at: company.created_at || new Date().toISOString()
        });
      }
    });
    
    const companies = Array.from(uniqueCompanies.values());
    
    const end = performance.now();
    console.log(`Empresas processadas: ${companies.length} em ${(end - start).toFixed(2)}ms`);
    
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

// Função para atualizar as configurações de uma empresa específica
export const updateCompanySettings = async (options: DisparoOptions): Promise<void> => {
  try {
    const { error } = await supabase
      .from('AppW_Options')
      .update({
        ativo: options.ativo,
        url_api: options.url_api,
        apikey: options.apikey,
        webhook_disparo: options.webhook_disparo,
        webhook_contatos: options.webhook_contatos,
        webhook_get_images: options.webhook_get_images,
        webhook_up_docs: options.webhook_up_docs,
        webhook_instancias: options.webhook_instancias,
        ftp_url: options.ftp_url,
        ftp_user: options.ftp_user,
        ftp_port: options.ftp_port,
        ftp_password: options.ftp_password
      })
      .eq('empresa_id', options.empresa_id);
    
    if (error) {
      console.error("Erro ao atualizar configurações da empresa:", error);
      throw new Error(`Falha ao atualizar configurações da empresa: ${error.message}`);
    }
  } catch (error) {
    console.error("Erro ao atualizar configurações da empresa:", error);
    throw error;
  }
};
