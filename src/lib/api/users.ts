
import { supabase } from "@/lib/supabase";

export interface User {
  id: string;
  email: string;
  created_at: string;
  role: string;
  company_id?: string;
  last_sign_in_at?: string;
}

// Função para buscar usuários com base na função e empresa do usuário logado
export const fetchUsers = async (currentUser?: User | null, selectedCompanyId?: string | null): Promise<User[]> => {
  console.log("Buscando usuários da tabela appw_users", { 
    currentUserRole: currentUser?.role,
    selectedCompanyId
  });
  
  try {
    let query = supabase.from('appw_users').select('*');
    
    // Aplicar filtros com base na função do usuário
    if (currentUser) {
      // Para usuário master com empresa selecionada
      if (currentUser.role === 'master' && selectedCompanyId) {
        query = query.eq('empresa_id', selectedCompanyId);
      }
      // Admin só vê usuários da mesma empresa (exceto masters)
      else if (currentUser.role === 'admin' && currentUser.company_id) {
        query = query.eq('empresa_id', currentUser.company_id);
      } 
      // Usuário comum não vê outros usuários (retorna lista vazia)
      else if (currentUser.role === 'user') {
        return [];
      }
      // Master sem empresa selecionada vê todos os usuários (sem filtro)
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error("Erro ao buscar usuários:", error);
      throw new Error(`Falha ao buscar usuários: ${error.message}`);
    }
    
    // Se não houver usuários, criar um admin padrão
    if (!data || data.length === 0) {
      console.log("Nenhum usuário encontrado. Criando administrador padrão...");
      
      try {
        const adminId = crypto.randomUUID();
        const defaultAdmin = {
          user_id: adminId,
          email: 'admin@exemplo.com',
          password: 'admin123', // Em produção, isso deveria ser um hash
          role: 'admin',
          created_at: new Date().toISOString()
        };
        
        const { error: insertError } = await supabase
          .from('appw_users')
          .insert([defaultAdmin]);
          
        if (insertError) {
          console.error("Erro ao criar admin padrão:", insertError);
          return [];
        }
        
        return [{
          id: adminId,
          email: 'admin@exemplo.com',
          created_at: defaultAdmin.created_at,
          role: 'admin'
        }];
      } catch (createError) {
        console.error("Erro ao criar usuário admin padrão:", createError);
        return [];
      }
    }
    
    // Transformar os dados para o formato esperado
    const users = data?.map(user => ({
      id: user.user_id || user.id,
      email: user.email || '',
      created_at: user.created_at || new Date().toISOString(),
      role: user.role || 'user',
      company_id: user.empresa_id || undefined,
      last_sign_in_at: user.last_sign_in_at || undefined
    })) || [];
    
    console.log("Usuários processados:", users.length);
    return users;
  } catch (error) {
    console.error("Erro em fetchUsers:", error);
    throw error;
  }
};

// Função para criar usuário na tabela appw_users
export const createUser = async (email: string, password: string, role: string, companyId?: string): Promise<void> => {
  console.log("Criando usuário:", { email, role, companyId });
  
  if (!email || !password) {
    throw new Error("Email e senha são obrigatórios");
  }
  
  try {
    // Verificar se o email já existe na tabela appw_users
    const { data: existingUsers, error: checkError } = await supabase
      .from('appw_users')
      .select('email')
      .eq('email', email)
      .maybeSingle();
    
    if (checkError) {
      console.error("Erro ao verificar email existente:", checkError);
      throw new Error(`Erro ao verificar usuários existentes: ${checkError.message}`);
    }
    
    if (existingUsers) {
      console.error("Email já existe:", email);
      throw new Error(`Este email já está registrado`);
    }
    
    // Gerar um ID único para o usuário
    const userId = crypto.randomUUID();
    
    // Adicionar usuário diretamente à tabela appw_users
    const { error: insertError } = await supabase
      .from('appw_users')
      .insert([{ 
        user_id: userId, 
        email: email,
        password: password, // Nota: em produção, isso deveria ser um hash
        role: role,
        created_at: new Date().toISOString(),
        empresa_id: companyId // Atribuir à empresa fornecida, se houver
      }]);
      
    if (insertError) {
      console.error("Erro ao adicionar usuário:", insertError);
      throw new Error(`Falha ao adicionar usuário ao banco de dados: ${insertError.message}`);
    }
    
    console.log("Usuário criado com sucesso:", userId);
  } catch (error) {
    console.error("Erro ao criar usuário:", error);
    throw error;
  }
};

export const updateUserRole = async (userId: string, role: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('appw_users')
      .update({ role })
      .eq('user_id', userId);
      
    if (error) throw error;
  } catch (error) {
    console.error("Erro atualizando o papel do usuário:", error);
    throw error;
  }
};

export const resetUserPassword = async (userId: string, newPassword: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('appw_users')
      .update({ password: newPassword })
      .eq('user_id', userId);
      
    if (error) throw error;
  } catch (error) {
    console.error("Erro resetando a senha:", error);
    throw error;
  }
};

export const deleteUser = async (userId: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('appw_users')
      .delete()
      .eq('user_id', userId);
      
    if (error) {
      console.error("Erro ao excluir usuário:", error);
      throw error;
    }
  } catch (error) {
    console.error("Erro deletando usuário:", error);
    throw error;
  }
};

export const assignUserToCompany = async (userId: string, companyId: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('appw_users')
      .update({ company_id: companyId })
      .eq('user_id', userId);
      
    if (error) throw error;
  } catch (error) {
    console.error("Erro atribuindo usuário a empresa:", error);
    throw error;
  }
};
