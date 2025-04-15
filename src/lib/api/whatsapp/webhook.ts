
import { WhatsAppStatusResponse, WhatsAppQRCodeResponse } from "./types";
import { callWebhook } from "../webhook-utils";

export const generateQRCodeData = async (instanceName: string): Promise<string> => {
  try {
    const webhookUrl = localStorage.getItem('webhook_instancias');
    
    console.log(`[Webhook] Gerando QR code para instância: ${instanceName}`);
    console.log(`[Webhook] URL configurada: ${webhookUrl}`);
    
    if (!webhookUrl) {
      throw new Error('URL do webhook de instâncias não configurada. Configure nas Configurações > Webhooks.');
    }
    
    const response = await callWebhook(webhookUrl, {
      action: 'connect',
      instance_name: instanceName,
      timestamp: new Date().toISOString()
    }) as WhatsAppQRCodeResponse;
    
    if (!response.success) {
      console.error('[Webhook] Resposta de erro:', response);
      throw new Error(response.message || 'Falha ao gerar QR code');
    }
    
    console.log('[Webhook] Resposta completa do QR code:', response);
    
    // Extract the base64 QR code data from the response
    // The data could be in different formats depending on the webhook implementation
    if (response.data?.base64) {
      console.log('[Webhook] QR code encontrado no campo data.base64');
      return response.data.base64;
    } 
    
    if (response.data?.qrcode) {
      console.log('[Webhook] QR code encontrado no campo data.qrcode');
      return response.data.qrcode;
    }
    
    console.error('[Webhook] Não foi possível encontrar dados do QR code na resposta:', response);
    throw new Error('Resposta do webhook não contém dados do QR code');
  } catch (error) {
    console.error('[Webhook] Erro ao gerar QR code:', error);
    throw error;
  }
};

/**
 * Fetch the status of all WhatsApp instances in a single request
 */
export const fetchAllInstancesStatus = async (): Promise<WhatsAppStatusResponse> => {
  try {
    const webhookUrl = localStorage.getItem('webhook_instancias');
    
    console.log(`[Webhook] Verificando status de todas as instâncias via webhook: ${webhookUrl}`);
    
    if (!webhookUrl) {
      throw new Error('URL do webhook de instâncias não configurada');
    }
    
    const response = await callWebhook(webhookUrl, {
      action: 'status',
      timestamp: new Date().toISOString()
    }) as WhatsAppStatusResponse;
    
    if (!response.success) {
      throw new Error(response.message || 'Falha ao verificar status das instâncias');
    }
    
    console.log('[Webhook] Status de todas as instâncias recebido:', response.data);
    return response;
  } catch (error) {
    console.error('[Webhook] Erro ao verificar status das instâncias:', error);
    throw error;
  }
};

/**
 * Fetch the status of a specific WhatsApp instance
 * @deprecated Use fetchAllInstancesStatus instead
 */
export const fetchInstanceStatus = async (instanceName: string): Promise<string> => {
  try {
    const webhookUrl = localStorage.getItem('webhook_instancias');
    
    console.log(`Verificando status para instância: ${instanceName} via webhook: ${webhookUrl}`);
    
    if (!webhookUrl) {
      throw new Error('URL do webhook de instâncias não configurada');
    }
    
    const response = await callWebhook(webhookUrl, {
      action: 'status',
      instance_name: instanceName,
    }) as WhatsAppStatusResponse;
    
    if (!response.success) {
      throw new Error(response.message || 'Falha ao verificar status');
    }
    
    // Procurar a instância específica na resposta
    const instance = response.data?.find(inst => inst.name === instanceName);
    if (!instance) {
      throw new Error('Instância não encontrada na resposta');
    }
    
    // Retorna o status da instância
    return instance.connectionStatus;
  } catch (error) {
    console.error('Erro ao verificar status:', error);
    return 'close'; // Fallback para desconectado em caso de erro
  }
};

/**
 * Disconnect a WhatsApp instance
 */
export const disconnectInstance = async (instanceName: string): Promise<boolean> => {
  try {
    const webhookUrl = localStorage.getItem('webhook_instancias');
    
    console.log(`[Webhook] Desconectando instância: ${instanceName}`);
    
    if (!webhookUrl) {
      throw new Error('URL do webhook de instâncias não configurada');
    }
    
    const response = await callWebhook(webhookUrl, {
      action: 'disconnect',
      instance_name: instanceName,
      timestamp: new Date().toISOString()
    });
    
    if (!response.success) {
      throw new Error(response.message || 'Falha ao desconectar instância');
    }
    
    return true;
  } catch (error) {
    console.error('[Webhook] Erro ao desconectar instância:', error);
    throw error;
  }
};

/**
 * Delete a WhatsApp instance
 */
export const deleteInstance = async (instanceName: string): Promise<boolean> => {
  try {
    const webhookUrl = localStorage.getItem('webhook_instancias');
    
    console.log(`[Webhook] Excluindo instância: ${instanceName}`);
    
    if (!webhookUrl) {
      throw new Error('URL do webhook de instâncias não configurada');
    }
    
    const response = await callWebhook(webhookUrl, {
      action: 'delete',
      instance_name: instanceName,
      timestamp: new Date().toISOString()
    });
    
    if (!response.success) {
      throw new Error(response.message || 'Falha ao excluir instância');
    }
    
    return true;
  } catch (error) {
    console.error('[Webhook] Erro ao excluir instância:', error);
    throw error;
  }
};

/**
 * Create a new WhatsApp instance
 */
export const createInstance = async (instanceName: string, companyId: string): Promise<boolean> => {
  try {
    const webhookUrl = localStorage.getItem('webhook_instancias');
    
    console.log(`[Webhook] Criando nova instância: ${instanceName} para empresa: ${companyId}`);
    
    if (!webhookUrl) {
      throw new Error('URL do webhook de instâncias não configurada');
    }
    
    const response = await callWebhook(webhookUrl, {
      action: 'new',
      instance_name: instanceName,
      company_id: companyId,
      timestamp: new Date().toISOString()
    });
    
    if (!response.success) {
      throw new Error(response.message || 'Falha ao criar instância');
    }
    
    return true;
  } catch (error) {
    console.error('[Webhook] Erro ao criar instância:', error);
    throw error;
  }
};

/**
 * Check if an instance is connected based on its status
 */
export const isInstanceConnected = (status: string | null | undefined): boolean => {
  return status === 'open';
};

/**
 * Map a status string to text and color information
 */
export const mapStatusToText = (status: string | null | undefined): { 
  text: string; 
  color: "green" | "red" | "yellow" | "gray"; 
} => {
  if (!status) {
    return { text: "Desconhecido", color: "gray" };
  }
  
  switch (status.toLowerCase()) {
    case "open":
      return { text: "Conectado", color: "green" };
    case "close":
      return { text: "Desconectado", color: "red" };
    case "connecting":
      return { text: "QR Code", color: "yellow" };
    default:
      return { text: "Desconhecido", color: "gray" };
  }
};
