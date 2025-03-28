
import { supabase } from "@/lib/supabase";

export interface User {
  id: string;
  email: string;
  created_at: string;
  role: string;
  last_sign_in_at?: string;
}

// Função simplificada para buscar usuários apenas da tabela appw_users
export const fetchUsers = async (): Promise<User[]> => {
  console.log("Buscando usuários da tabela appw_users");
  
  try {
    const { data, error } = await supabase
      .from('appw_users')
      .select('*');
    
    if (error) {
      console.error("Erro ao buscar usuários:", error);
      throw new Error(`Falha ao buscar usuários: ${error.message}`);
    }
    
    // Transformar os dados para o formato esperado
    const users = data?.map(user => ({
      id: user.user_id || user.id,
      email: user.email || '',
      created_at: user.created_at || new Date().toISOString(),
      role: user.role || 'user',
      last_sign_in_at: user.last_sign_in_at || undefined
    })) || [];
    
    console.log("Usuários processados:", users.length);
    return users;
  } catch (error) {
    console.error("Erro em fetchUsers:", error);
    throw error;
  }
};

// Função simplificada para criar usuário apenas na tabela appw_users
export const createUser = async (email: string, password: string, role: string): Promise<void> => {
  console.log("Criando usuário:", { email, role });
  
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
        created_at: new Date().toISOString()
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
