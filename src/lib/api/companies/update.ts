
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
    const { error } = await supabase
      .from('AppW_Options')
      .update({
        ativo: options.ativo,
        url_api: options.url_api,
        apikey: options.apikey,
        webhook_disparo: options.webhook_disparo,
        webhook_contatos: options.webhook_contatos,
        webhook_get_images: options.webhook_get_images,
        webhook_up_docs: options.webhook_up_docs,
        webhook_instancias: options.webhook_instancias,
        ftp_url: options.ftp_url,
        ftp_user: options.ftp_user,
        ftp_port: options.ftp_port,
        ftp_password: options.ftp_password
      })
      .eq('empresa_id', options.empresa_id);
    
    if (error) {
      console.error("Erro ao atualizar configurações da empresa:", error);
      throw new Error(`Falha ao atualizar configurações da empresa: ${error.message}`);
    }
  } catch (error) {
    console.error("Erro ao atualizar configurações da empresa:", error);
    throw error;
  }
};
