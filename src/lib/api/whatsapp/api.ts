
import { supabase } from "@/lib/supabase";
import { WhatsAccount } from "./types";

const TABLE_NAME = "AppW_Instancias";

/**
 * Get all WhatsApp accounts
 */
export const getWhatsAccounts = async (): Promise<WhatsAccount[]> => {
  console.log("Buscando contas de WhatsApp da tabela:", TABLE_NAME);
  
  const { data, error } = await supabase
    .from(TABLE_NAME)
    .select("*");

  console.log("Resposta do Supabase:", { data, error });

  if (error) {
    console.error("Error fetching WhatsApp accounts:", error);
    throw new Error(error.message);
  }

  // Se data for null, retornamos um array vazio
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
  const empresa_id = "falcontruck";

  console.log("Criando conta com os dados:", { ...account, empresa_id });

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
  console.log("Excluindo conta com ID:", id);
  
  const { error } = await supabase
    .from(TABLE_NAME)
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Error deleting WhatsApp account:", error);
    throw new Error(error.message);
  }
};
