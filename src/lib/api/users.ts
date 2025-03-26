import { supabase } from "@/lib/supabase";

export interface User {
  id: string;
  email: string;
  created_at: string;
  role: string;
  last_sign_in_at?: string;
}

export const fetchUsers = async (): Promise<User[]> => {
  console.log("Iniciando fetchUsers - buscando usuários do Supabase");
  
  try {
    // Primeiro, obter usuários autenticados
    const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();
    
    if (authError) {
      console.error("Erro ao buscar usuários auth:", authError);
      throw new Error(`Falha ao buscar usuários: ${authError.message}`);
    }
    
    console.log("Usuários auth recuperados:", authUsers?.users?.length || 0);
    
    if (!authUsers?.users?.length) {
      console.log("Nenhum usuário auth encontrado");
      return [];
    }
    
    // Depois obter informações adicionais da tabela personalizada
    const { data: appUsers, error: appError } = await supabase
      .from('appw_users')
      .select('*');
    
    if (appError) {
      console.error("Erro ao buscar appw_users:", appError);
      throw new Error(`Falha ao buscar appw_users: ${appError.message}`);
    }
    
    console.log("Usuários app recuperados:", appUsers?.length || 0);
    
    // Combinar os dados
    const users = authUsers?.users?.map(user => {
      const appUser = appUsers?.find(au => au.user_id === user.id);
      return {
        id: user.id,
        email: user.email || '',
        created_at: user.created_at,
        last_sign_in_at: user.last_sign_in_at,
        role: appUser?.role || 'user'
      };
    }) || [];
    
    console.log("Contagem final de usuários combinados:", users.length);
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
    // Verificar se o usuário já existe
    const { data: existingUsers } = await supabase
      .from('appw_users')
      .select('email')
      .eq('email', email)
      .maybeSingle();
      
    if (existingUsers) {
      console.error("Usuário já existe:", email);
      throw new Error(`Usuário com email ${email} já existe`);
    }
    
    // Criar o usuário na autenticação
    console.log("Criando usuário na autenticação:", email);
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
      
      // Se falharmos ao adicionar o usuário à nossa tabela personalizada, excluir o usuário auth para manter a consistência
      console.log("Tentando limpar usuário auth após falha na inserção");
      const { error: deleteError } = await supabase.auth.admin.deleteUser(data.user.id);
      if (deleteError) {
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
