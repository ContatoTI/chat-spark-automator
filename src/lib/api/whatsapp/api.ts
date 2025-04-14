
import { supabase } from "@/lib/supabase";
import { WhatsAccount } from "./types";
import { User } from "@/lib/api/users";

const TABLE_NAME = "AppW_Instancias";

/**
 * Get all WhatsApp accounts
 */
export const getWhatsAccounts = async (currentUser?: User | null, selectedCompanyId?: string | null): Promise<WhatsAccount[]> => {
  console.log("Buscando contas de WhatsApp da tabela:", TABLE_NAME);
  
  let query = supabase.from(TABLE_NAME).select("*");

  // Filtrar por empresa se for usuário master com empresa selecionada
  if (currentUser?.role === 'master' && selectedCompanyId) {
    query = query.eq('empresa_id', selectedCompanyId);
  } 
  // Filtrar para usuários admin e comuns pela empresa deles
  else if (currentUser?.role !== 'master' && currentUser?.company_id) {
    query = query.eq('empresa_id', currentUser.company_id);
  }

  const { data, error } = await query;

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
  account: { nome_instancia: string },
  currentUser?: User | null,
  selectedCompanyId?: string | null
): Promise<WhatsAccount> => {
  // Determinar o empresa_id com base no usuário logado e empresa selecionada
  let empresa_id;
  
  if (currentUser?.role === 'master' && selectedCompanyId) {
    empresa_id = selectedCompanyId;
  } else if (currentUser?.company_id) {
    empresa_id = currentUser.company_id;
  } else {
    empresa_id = "default";
  }

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
