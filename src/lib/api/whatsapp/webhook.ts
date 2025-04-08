
import { supabase } from "@/lib/supabase";

/**
 * Obtém a URL do webhook para instâncias da tabela de configurações
 */
export const getWebhookInstanciasUrl = async (): Promise<string | null> => {
  try {
    const { data, error } = await supabase
      .from('AppW_Options')
      .select('webhook_instancias')
      .limit(1)
      .single();

    if (error) {
      console.error("Erro ao buscar webhook de instâncias:", error);
      return null;
    }

    return data?.webhook_instancias || null;
  } catch (error) {
    console.error("Erro ao buscar webhook de instâncias:", error);
    return null;
  }
};

/**
 * Chama o webhook de instâncias com os dados da nova conta
 */
export const callInstanceWebhook = async (nomeInstancia: string): Promise<{ success: boolean; message?: string }> => {
  try {
    const webhookUrl = await getWebhookInstanciasUrl();
    
    if (!webhookUrl) {
      console.error("URL do webhook de instâncias não configurada");
      return { 
        success: false, 
        message: "URL do webhook de instâncias não configurada" 
      };
    }

    console.log(`Chamando webhook de instâncias: ${webhookUrl} com nome: ${nomeInstancia}`);

    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        nome_instancia: nomeInstancia,
        acao: 'criar'
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Erro ao chamar webhook: ${response.status} ${errorText}`);
      return { 
        success: false, 
        message: `Erro ao criar instância: ${response.status} ${errorText}` 
      };
    }

    let data;
    try {
      data = await response.json();
    } catch (e) {
      // Se não conseguir parsear como JSON, considera resposta como texto
      const text = await response.text();
      return { success: true, message: text || "Instância criada com sucesso" };
    }

    return { 
      success: true, 
      message: data.message || "Instância criada com sucesso" 
    };
  } catch (error) {
    console.error("Erro ao chamar webhook de instâncias:", error);
    return { 
      success: false, 
      message: error instanceof Error ? error.message : "Erro desconhecido ao chamar webhook" 
    };
  }
};
