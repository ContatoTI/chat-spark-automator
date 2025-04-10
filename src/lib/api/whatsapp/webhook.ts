
import { supabase } from "@/lib/supabase";

/**
 * Gets the webhook URL for WhatsApp instances from the settings table
 * This is now the only webhook used for all WhatsApp instance operations
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

/**
 * Maps status code to readable status text
 * @param statusCode - The status code from the API
 * @returns Readable status text
 */
export const mapStatusToText = (statusCode: string | null): { 
  text: string; 
  color: "green" | "red" | "yellow" | "gray";
} => {
  if (!statusCode) {
    return { text: "Desconhecido", color: "gray" };
  }

  switch (statusCode.toLowerCase()) {
    case "connected":
      return { text: "Conectado", color: "green" };
    case "disconnected":
      return { text: "Desconectado", color: "red" };
    case "connecting":
      return { text: "Conectando", color: "yellow" };
    case "qrcode":
      return { text: "Aguardando QR Code", color: "yellow" };
    default:
      return { text: statusCode, color: "gray" };
  }
};
