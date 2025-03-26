
import { supabase } from "@/lib/supabase";

export interface User {
  id: string;
  email: string;
  created_at: string;
  role: string;
  last_sign_in_at?: string;
}

export const fetchUsers = async (): Promise<User[]> => {
  console.log("Iniciando fetchUsers - buscando usuários reais do Supabase");
  
  try {
    // Buscar diretamente da tabela appw_users
    const { data, error } = await supabase
      .from('appw_users')
      .select('*');
    
    if (error) {
      console.error("Erro ao buscar appw_users:", error);
      throw new Error(`Falha ao buscar usuários: ${error.message}`);
    }
    
    console.log("Usuários recuperados da tabela appw_users:", data?.length || 0);
    console.log("Dados brutos:", JSON.stringify(data));
    
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

export const createUser = async (email: string, password: string, role: string): Promise<void> => {
  console.log("Criando usuário:", { email, role });
  
  if (!email || !password) {
    console.error("Email ou senha não fornecidos");
    throw new Error("Email e senha são obrigatórios");
  }
  
  try {
    // Verificar primeiro se o usuário existe no Auth do Supabase
    console.log("Verificando se o email existe no Auth:", email);
    const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();
    
    if (authError) {
      console.error("Erro ao listar usuários auth:", authError);
      throw new Error(`Erro ao verificar usuários existentes: ${authError.message}`);
    }
    
    // Verificar se o email já existe na lista de usuários Auth
    // Corrigindo o erro de tipo usando uma verificação explícita de tipo
    const emailExists = authUsers?.users?.some((user: any) => user?.email === email) || false;
    
    if (emailExists) {
      console.error("Email já existe no Auth do Supabase:", email);
      throw new Error(`Este email já está registrado no Auth do Supabase`);
    }
    
    // Criar o usuário na autenticação
    console.log("Criando usuário no Auth:", email);
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Pular confirmação de email
    });
    
    if (error) {
      console.error("Erro ao criar usuário auth:", error);
      throw error;
    }
    
    if (!data || !data.user) {
      console.error("Nenhum dado de usuário retornado da criação auth");
      throw new Error("Falha ao criar usuário: Nenhum dado retornado");
    }
    
    console.log("Usuário auth criado com sucesso:", data.user.id);
    
    // Adicionar o usuário à nossa tabela personalizada
    console.log("Adicionando usuário à tabela appw_users:", data.user.id);
    const { error: insertError } = await supabase
      .from('appw_users')
      .insert([{ 
        user_id: data.user.id, 
        email: email, 
        role: role 
      }]);
      
    if (insertError) {
      console.error("Erro ao adicionar usuário a appw_users:", insertError);
      
      // Tente excluir o usuário do Auth para manter consistência
      try {
        console.log("Tentando limpar usuário auth após falha na inserção");
        await supabase.auth.admin.deleteUser(data.user.id);
      } catch (deleteError) {
        console.error("Erro ao excluir usuário auth durante limpeza:", deleteError);
      }
      
      throw new Error(`Falha ao adicionar usuário ao banco de dados: ${insertError.message}`);
    }
    
    console.log("Usuário criado e adicionado com sucesso a appw_users");
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
    const { error } = await supabase.auth.admin.updateUserById(
      userId,
      { password: newPassword }
    );
    
    if (error) throw error;
  } catch (error) {
    console.error("Erro resetando a senha:", error);
    throw error;
  }
};

export const deleteUser = async (userId: string): Promise<void> => {
  try {
    // Delete from auth
    const { error: authError } = await supabase.auth.admin.deleteUser(userId);
    
    if (authError) throw authError;
    
    // Delete from custom table
    const { error: appError } = await supabase
      .from('appw_users')
      .delete()
      .eq('user_id', userId);
      
    if (appError) throw appError;
  } catch (error) {
    console.error("Erro deletando usuário:", error);
    throw error;
  }
};
