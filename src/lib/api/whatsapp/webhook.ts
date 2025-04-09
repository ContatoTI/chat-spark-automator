
import { supabase } from "@/lib/supabase";

/**
 * Gets the webhook URL for instances from the settings table
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
 * Gets the webhook URL for deleting instances from the settings table
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
 * Gets the webhook URL for connecting instances from the settings table
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
 * Gets the webhook URL for disconnecting instances from the settings table
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
 * Extracts QR code data from webhook response
 * @param responseData - Webhook response data
 * @returns The QR code string if found, null otherwise
 */
export const extractQrCodeFromResponse = (responseData: any): string | null => {
  if (!responseData) return null;
  
  try {
    // Handle array response format
    if (Array.isArray(responseData) && responseData.length > 0) {
      const firstItem = responseData[0];
      
      if (firstItem.success && firstItem.data) {
        return firstItem.data.base64 || firstItem.data.code || null;
      }
    } 
    // Handle direct object response format
    else if (responseData.success && responseData.data) {
      return responseData.data.base64 || responseData.data.code || null;
    }
    // Handle direct code string
    else if (typeof responseData === 'string' && 
             (responseData.startsWith('data:image') || 
              responseData.includes('base64'))) {
      return responseData;
    }
    
    return null;
  } catch (error) {
    console.error("Erro ao extrair QR code da resposta:", error);
    return null;
  }
};
