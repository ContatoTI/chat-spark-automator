
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
 * Obtém a URL do webhook para deletar instâncias da tabela de configurações
 */
export const getWebhookDeleteInstanciaUrl = async (): Promise<string | null> => {
  try {
    const { data, error } = await supabase
      .from('AppW_Options')
      .select('webhook_del_instancia')
      .limit(1)
      .single();

    if (error) {
      console.error("Erro ao buscar webhook de exclusão de instâncias:", error);
      return null;
    }

    return data?.webhook_del_instancia || null;
  } catch (error) {
    console.error("Erro ao buscar webhook de exclusão de instâncias:", error);
    return null;
  }
};

/**
 * Obtém a URL do webhook para conectar instâncias da tabela de configurações
 */
export const getWebhookConnectInstanciaUrl = async (): Promise<string | null> => {
  try {
    const { data, error } = await supabase
      .from('AppW_Options')
      .select('webhook_on_qr_instancia')
      .limit(1)
      .single();

    if (error) {
      console.error("Erro ao buscar webhook de conexão de instâncias:", error);
      return null;
    }

    return data?.webhook_on_qr_instancia || null;
  } catch (error) {
    console.error("Erro ao buscar webhook de conexão de instâncias:", error);
    return null;
  }
};

/**
 * Obtém a URL do webhook para desconectar instâncias da tabela de configurações
 */
export const getWebhookDisconnectInstanciaUrl = async (): Promise<string | null> => {
  try {
    const { data, error } = await supabase
      .from('AppW_Options')
      .select('webhook_off_instancia')
      .limit(1)
      .single();

    if (error) {
      console.error("Erro ao buscar webhook de desconexão de instâncias:", error);
      return null;
    }

    return data?.webhook_off_instancia || null;
  } catch (error) {
    console.error("Erro ao buscar webhook de desconexão de instâncias:", error);
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

/**
 * Chama o webhook para excluir instância
 */
export const callDeleteInstanceWebhook = async (nomeInstancia: string): Promise<{ success: boolean; message?: string }> => {
  try {
    const webhookUrl = await getWebhookDeleteInstanciaUrl();
    
    if (!webhookUrl) {
      console.error("URL do webhook de exclusão de instâncias não configurada");
      return { 
        success: false, 
        message: "URL do webhook de exclusão de instâncias não configurada" 
      };
    }

    console.log(`Chamando webhook de exclusão de instâncias: ${webhookUrl} com nome: ${nomeInstancia}`);

    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        nome_instancia: nomeInstancia,
        acao: 'excluir'
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Erro ao chamar webhook: ${response.status} ${errorText}`);
      return { 
        success: false, 
        message: `Erro ao excluir instância: ${response.status} ${errorText}` 
      };
    }

    let data;
    try {
      data = await response.json();
    } catch (e) {
      // Se não conseguir parsear como JSON, considera resposta como texto
      const text = await response.text();
      return { success: true, message: text || "Instância excluída com sucesso" };
    }

    return { 
      success: true, 
      message: data.message || "Instância excluída com sucesso" 
    };
  } catch (error) {
    console.error("Erro ao chamar webhook de exclusão de instâncias:", error);
    return { 
      success: false, 
      message: error instanceof Error ? error.message : "Erro desconhecido ao chamar webhook" 
    };
  }
};

/**
 * Chama o webhook para conectar instância
 */
export const callConnectInstanceWebhook = async (nomeInstancia: string): Promise<{ 
  success: boolean; 
  message?: string;
  qrCode?: string;
}> => {
  try {
    const webhookUrl = await getWebhookConnectInstanciaUrl();
    
    if (!webhookUrl) {
      console.error("URL do webhook de conexão de instâncias não configurada");
      return { 
        success: false, 
        message: "URL do webhook de conexão de instâncias não configurada" 
      };
    }

    console.log(`Chamando webhook de conexão de instâncias: ${webhookUrl} com nome: ${nomeInstancia}`);

    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        nome_instancia: nomeInstancia,
        acao: 'conectar'
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Erro ao chamar webhook: ${response.status} ${errorText}`);
      return { 
        success: false, 
        message: `Erro ao conectar instância: ${response.status} ${errorText}` 
      };
    }

    let data;
    try {
      data = await response.json();
      console.log("Resposta do webhook de conexão:", data);
      
      // Verifica se a resposta contém um QR code (base64 ou código)
      if (data.success && data.data) {
        const qrCode = data.data.base64 || data.data.code || null;
        if (qrCode) {
          return { 
            success: true, 
            message: data.message || "QR Code gerado com sucesso",
            qrCode: qrCode
          };
        }
      }
      
      return { 
        success: true, 
        message: data.message || "Instância conectada com sucesso" 
      };
    } catch (e) {
      // Se não conseguir parsear como JSON, considera resposta como texto
      const text = await response.text();
      return { success: true, message: text || "Instância conectada com sucesso" };
    }
  } catch (error) {
    console.error("Erro ao chamar webhook de conexão de instâncias:", error);
    return { 
      success: false, 
      message: error instanceof Error ? error.message : "Erro desconhecido ao chamar webhook" 
    };
  }
};

/**
 * Chama o webhook para desconectar instância
 */
export const callDisconnectInstanceWebhook = async (nomeInstancia: string): Promise<{ success: boolean; message?: string }> => {
  try {
    const webhookUrl = await getWebhookDisconnectInstanciaUrl();
    
    if (!webhookUrl) {
      console.error("URL do webhook de desconexão de instâncias não configurada");
      return { 
        success: false, 
        message: "URL do webhook de desconexão de instâncias não configurada" 
      };
    }

    console.log(`Chamando webhook de desconexão de instâncias: ${webhookUrl} com nome: ${nomeInstancia}`);

    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        nome_instancia: nomeInstancia,
        acao: 'desconectar'
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Erro ao chamar webhook: ${response.status} ${errorText}`);
      return { 
        success: false, 
        message: `Erro ao desconectar instância: ${response.status} ${errorText}` 
      };
    }

    let data;
    try {
      data = await response.json();
    } catch (e) {
      // Se não conseguir parsear como JSON, considera resposta como texto
      const text = await response.text();
      return { success: true, message: text || "Instância desconectada com sucesso" };
    }

    return { 
      success: true, 
      message: data.message || "Instância desconectada com sucesso" 
    };
  } catch (error) {
    console.error("Erro ao chamar webhook de desconexão de instâncias:", error);
    return { 
      success: false, 
      message: error instanceof Error ? error.message : "Erro desconhecido ao chamar webhook" 
    };
  }
};
