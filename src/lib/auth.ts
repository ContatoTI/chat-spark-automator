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

export async function createUserByAdmin(email: string, password: string, full_name: string, role: "admin" | "client" = "client", permissions = {
  can_manage_users: false,
  can_manage_settings: false,
  can_view_campaigns: true
}) {
  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { full_name }
  });

  if (error || !data.user) {
    console.error("Erro ao criar usuário:", error);
    return { data, error };
  }

  try {
    await supabase
      .from("profiles")
      .insert({
        id: data.user.id,
        full_name,
        role
      });

    await supabase
      .from("permissions")
      .insert({
        profile_id: data.user.id,
        ...permissions
      });

    return { data, error: null };
  } catch (profileError) {
    console.error("Erro ao criar perfil/permissões:", profileError);
    return { data, error: profileError };
  }
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

export async function initializeDefaultUsers() {
  try {
    const { data: existingUsers } = await supabase
      .from("profiles")
      .select("id")
      .limit(1);

    if (!existingUsers || existingUsers.length === 0) {
      await createUserByAdmin("admin@falcontruck.com.br", "123456", "Admin", "admin", {
        can_manage_users: true,
        can_manage_settings: true,
        can_view_campaigns: true
      });

      await createUserByAdmin("user@falcontruck.com.br", "123456", "User", "client", {
        can_manage_users: false,
        can_manage_settings: false,
        can_view_campaigns: true
      });

      console.log("Usuários padrão criados com sucesso");
    }
  } catch (error) {
    console.error("Erro ao inicializar usuários padrão:", error);
  }
}
