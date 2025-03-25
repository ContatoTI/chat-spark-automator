
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
  return supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name },
      emailRedirectTo: `${window.location.origin}/login`
    }
  });
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
