
import { User } from "@supabase/supabase-js";
import { supabase } from "./supabase";

export interface UserProfile {
  id: string;
  full_name: string | null;
  role: "admin" | "client";
}

export interface UserPermissions {
  id: string;
  profile_id: string;
  can_manage_users: boolean;
  can_manage_settings: boolean;
  can_view_campaigns: boolean;
}

export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();

  if (error || !data) {
    return null;
  }

  return data as UserProfile;
}

export async function getUserPermissions(userId: string): Promise<UserPermissions | null> {
  const { data, error } = await supabase
    .from("permissions")
    .select("*")
    .eq("profile_id", userId)
    .single();

  if (error || !data) {
    return null;
  }

  return data as UserPermissions;
}

export async function signIn(email: string, password: string) {
  return supabase.auth.signInWithPassword({ email, password });
}

export async function signUp(email: string, password: string, full_name: string) {
  // Usamos signUp sem a necessidade de confirmação de email
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name },
      // Sem redirecionamento, vamos tratar o fluxo no frontend
    }
  });

  // Se o usuário foi criado com sucesso, podemos inserir manualmente o perfil e permissões
  // Isso é necessário apenas se o trigger on_auth_user_created não estiver funcionando no Supabase local
  if (data?.user && !error) {
    try {
      // Verificar se o perfil já existe
      const { data: existingProfile } = await supabase
        .from("profiles")
        .select("id")
        .eq("id", data.user.id)
        .single();

      // Se o perfil não existir, criamos manualmente
      if (!existingProfile) {
        await supabase
          .from("profiles")
          .insert({
            id: data.user.id,
            full_name,
            role: "client"
          });

        // Também criamos as permissões básicas
        await supabase
          .from("permissions")
          .insert({
            profile_id: data.user.id,
            can_manage_users: false,
            can_manage_settings: false,
            can_view_campaigns: true
          });
      }
    } catch (profileError) {
      console.error("Erro ao criar perfil/permissões:", profileError);
      // Não propagamos este erro, pois o usuário já foi criado
    }
  }

  return { data, error };
}

export async function signOut() {
  return supabase.auth.signOut();
}

export async function updateUserProfile(userId: string, profile: Partial<UserProfile>) {
  return supabase
    .from("profiles")
    .update(profile)
    .eq("id", userId);
}

export async function updateUserPermissions(userId: string, permissions: Partial<UserPermissions>) {
  return supabase
    .from("permissions")
    .update(permissions)
    .eq("profile_id", userId);
}

export async function getAllUsers() {
  const { data, error } = await supabase
    .from("profiles")
    .select(`
      *,
      permissions(*)
    `);

  if (error) throw error;
  return data;
}
