
import { supabase } from "@/lib/supabase";
import { WhatsAppStatusResponse } from "./types";

/**
 * Gets the webhook URL for WhatsApp instances from the settings table
 * This is now the only webhook used for all WhatsApp instance operations
 */
export const getWebhookInstanciasUrl = async (): Promise<string | null> => {
  try {
    console.log("Fetching webhook_instancias URL from AppW_Options");
    const { data, error } = await supabase
      .from('AppW_Options')
      .select('webhook_instancias')
      .limit(1)
      .single();

    if (error) {
      console.error("Erro ao buscar webhook de instâncias:", error);
      return null;
    }

    console.log("Retrieved webhook_instancias value:", data?.webhook_instancias);
    return data?.webhook_instancias || null;
  } catch (error) {
    console.error("Erro ao buscar webhook de instâncias:", error);
    return null;
  }
};

/**
 * Generate QR code data for a WhatsApp instance by calling the webhook
 */
export const generateQRCodeData = async (instanceName: string): Promise<string | null> => {
  try {
    const webhookUrl = await getWebhookInstanciasUrl();
    
    if (!webhookUrl) {
      console.error("Webhook URL para instâncias não configurado");
      throw new Error("Webhook URL para instâncias não configurado");
    }
    
    // Adiciona o nome da instância como parâmetro de consulta
    const url = new URL(webhookUrl);
    url.searchParams.append('instance', instanceName);
    url.searchParams.append('action', 'qrcode');
    
    console.log(`Chamando webhook para gerar QR code para instância: ${instanceName}`);
    const response = await fetch(url.toString());
    
    if (!response.ok) {
      throw new Error(`Erro ao gerar QR code: ${response.statusText}`);
    }
    
    const responseData = await response.json();
    return extractQrCodeFromResponse(responseData);
  } catch (error) {
    console.error("Erro ao gerar QR code:", error);
    throw error;
  }
};

/**
 * Fetch the status of a WhatsApp instance by calling the webhook
 */
export const fetchInstanceStatus = async (instanceName: string): Promise<string | null> => {
  try {
    const webhookUrl = await getWebhookInstanciasUrl();
    
    if (!webhookUrl) {
      console.error("Webhook URL para instâncias não configurado");
      throw new Error("Webhook URL para instâncias não configurado");
    }
    
    // Adiciona o nome da instância como parâmetro de consulta
    const url = new URL(webhookUrl);
    url.searchParams.append('instance', instanceName);
    url.searchParams.append('action', 'status');
    
    console.log(`Chamando webhook para verificar status da instância: ${instanceName}`);
    const response = await fetch(url.toString());
    
    if (!response.ok) {
      throw new Error(`Erro ao verificar status: ${response.statusText}`);
    }
    
    const responseData = await response.json();
    
    // Process the status response
    const statusList = processStatusResponse(responseData);
    if (statusList.length > 0) {
      const instanceStatus = statusList.find(item => item.name === instanceName);
      return instanceStatus?.connectionStatus || null;
    }
    
    return null;
  } catch (error) {
    console.error("Erro ao verificar status da instância:", error);
    throw error;
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
 * Maps connection status to readable status text
 * @param connectionStatus - The status from the API
 * @returns Readable status text and color
 */
export const mapStatusToText = (connectionStatus: string | null): { 
  text: string; 
  color: "green" | "red" | "yellow" | "gray";
} => {
  if (!connectionStatus) {
    return { text: "Desconhecido", color: "gray" };
  }

  switch (connectionStatus.toLowerCase()) {
    case "open":
      return { text: "Conectado", color: "green" };
    case "close":
      return { text: "Desconectado", color: "red" };
    case "connecting":
      return { text: "Aguardando QR Code", color: "yellow" };
    default:
      return { text: connectionStatus, color: "gray" };
  }
};

/**
 * Processes the status response from webhook
 * @param responseData - Status response data from webhook
 * @returns Array of status objects with name and connectionStatus
 */
export const processStatusResponse = (responseData: any): WhatsAppStatusResponse[] => {
  if (!responseData) return [];
  
  try {
    // Log the response for debugging
    console.log("Processing status response:", responseData);
    
    if (Array.isArray(responseData)) {
      return responseData.map(item => ({
        name: item.name,
        connectionStatus: item.connectionStatus
      }));
    }
    
    return [];
  } catch (error) {
    console.error("Erro ao processar resposta de status:", error);
    return [];
  }
};

/**
 * Checks if the instance status indicates it's connected
 * @param status - The connection status
 * @returns True if connected, false otherwise
 */
export const isInstanceConnected = (status: string | null): boolean => {
  if (!status) return false;
  return status.toLowerCase() === 'open';
};
