
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
    console.error("Error fetching user profile:", error);
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
    console.error("Error fetching user permissions:", error);
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
  try {
    // First, create the user in the auth system
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
      // Then create the profile
      await supabase
        .from("profiles")
        .insert({
          id: data.user.id,
          full_name,
          role
        });

      // And finally create permissions
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
  } catch (err) {
    console.error("Error in createUserByAdmin:", err);
    return { data: null, error: err };
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
  try {
    const { data, error } = await supabase
      .from("profiles")
      .select(`
        *,
        permissions(*)
      `);

    if (error) throw error;
    return data;
  } catch (err) {
    console.error("Error fetching all users:", err);
    throw err;
  }
}

export async function initializeDefaultUsers() {
  try {
    // Check if there are any existing users
    const { data: existingUsers, error: checkError } = await supabase
      .from("profiles")
      .select("id")
      .limit(1);
      
    if (checkError) {
      console.error("Error checking for existing users:", checkError);
      return;
    }

    // If no users exist, create default ones
    if (!existingUsers || existingUsers.length === 0) {
      console.log("No existing users found, creating defaults");
      
      try {
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
      } catch (createError) {
        console.error("Error creating default users:", createError);
      }
    } else {
      console.log("Users already exist, skipping default creation");
    }
  } catch (error) {
    console.error("Erro ao inicializar usuários padrão:", error);
  }
}
