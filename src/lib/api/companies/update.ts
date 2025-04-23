
import { supabase } from "@/lib/supabase";
import { DisparoOptions } from "@/lib/api/settings";

// Função para atualizar o nome de uma empresa
export const updateCompany = async (id: string, name: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('AppW_Options')
      .update({ nome_da_empresa: name })
      .eq('empresa_id', id);
    
    if (error) {
      console.error("Erro ao atualizar empresa:", error);
      throw new Error(`Falha ao atualizar empresa: ${error.message}`);
    }
  } catch (error) {
    console.error("Erro ao atualizar empresa:", error);
    throw error;
  }
};

// Função para atualizar as configurações de uma empresa específica
export const updateCompanySettings = async (options: DisparoOptions): Promise<void> => {
  try {
    console.log("Atualizando configurações da empresa:", options);
    
    // Remove undefined values to prevent overriding with null in database
    const settingsToUpdate = Object.fromEntries(
      Object.entries(options).filter(([_, value]) => value !== undefined)
    );
    
    // Ensure empresa_id is included in the query condition
    const empresaId = options.empresa_id;
    
    // Log the final data being sent to the database
    console.log("Dados a serem enviados:", settingsToUpdate);
    
    const { error } = await supabase
      .from('AppW_Options')
      .update(settingsToUpdate)
      .eq('empresa_id', empresaId);
    
    if (error) {
      console.error("Erro ao atualizar configurações da empresa:", error);
      throw new Error(`Falha ao atualizar configurações da empresa: ${error.message}`);
    }
    
    console.log("Configurações atualizadas com sucesso");
  } catch (error) {
    console.error("Erro ao atualizar configurações da empresa:", error);
    throw error;
  }
};
