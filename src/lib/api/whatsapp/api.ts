
import { supabase } from "@/lib/supabase";
import { WhatsAccount } from "./types";

const TABLE_NAME = "AppW_Instancias";

/**
 * Get all WhatsApp accounts
 */
export const getWhatsAccounts = async (): Promise<WhatsAccount[]> => {
  const { data, error } = await supabase
    .from(TABLE_NAME)
    .select("*");

  if (error) {
    console.error("Error fetching WhatsApp accounts:", error);
    throw new Error(error.message);
  }

  return data || [];
};

/**
 * Create a new WhatsApp account
 */
export const createWhatsAccount = async (
  account: { nome_instancia: string }
): Promise<WhatsAccount> => {
  // In a real app, we'd get the empresa_id from the authenticated user
  // For now, we'll use a default value
  const empresa_id = "empresa1";

  const { data, error } = await supabase
    .from(TABLE_NAME)
    .insert({ ...account, empresa_id })
    .select()
    .single();

  if (error) {
    console.error("Error creating WhatsApp account:", error);
    throw new Error(error.message);
  }

  return data;
};

/**
 * Delete a WhatsApp account
 */
export const deleteWhatsAccount = async (id: number): Promise<void> => {
  const { error } = await supabase
    .from(TABLE_NAME)
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Error deleting WhatsApp account:", error);
    throw new Error(error.message);
  }
};
