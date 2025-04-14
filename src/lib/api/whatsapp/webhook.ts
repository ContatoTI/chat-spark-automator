import { WhatsAppStatusResponse } from "./types";
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
      action: 'generate_qr',
      instance_name: instanceName,
      timestamp: new Date().toISOString()
    });
    
    if (!response.success) {
      console.error('[Webhook] Resposta de erro:', response);
      throw new Error(response.message || 'Falha ao gerar QR code');
    }
    
    if (!response.data?.qrcode) {
      console.error('[Webhook] Resposta sem QR code:', response);
      throw new Error('Resposta do webhook não contém dados do QR code');
    }
    
    console.log('[Webhook] QR code gerado com sucesso');
    return response.data.qrcode;
  } catch (error) {
    console.error('[Webhook] Erro ao gerar QR code:', error);
    throw error;
  }
};

/**
 * Fetch the status of a WhatsApp instance
 */
export const fetchInstanceStatus = async (instanceName: string): Promise<string> => {
  try {
    const settingsResponse = await fetch('/api/settings/get-webhook-url?type=instances');
    let webhookUrl = '';
    
    try {
      const settings = await settingsResponse.json();
      webhookUrl = settings.webhookUrl;
    } catch (error) {
      console.error('Erro ao obter URL do webhook de instâncias:', error);
      // Fallback para URL padrão em caso de falha
      webhookUrl = 'https://dinastia-n8n-webhook.ssdx0m.easypanel.host/webhook/whatsapp';
    }
    
    console.log(`Verificando status para instância: ${instanceName} via webhook: ${webhookUrl}`);
    
    if (!webhookUrl) {
      throw new Error('URL do webhook de instâncias não configurada');
    }
    
    // Chamada ao webhook com a ação de verificar status
    const response = await callWebhook(webhookUrl, {
      action: 'check_status',
      instance_name: instanceName,
    });
    
    if (!response.success) {
      throw new Error(response.message || 'Falha ao verificar status');
    }
    
    // Verificar se a resposta contém dados de status
    if (response.data?.status === undefined) {
      throw new Error('Resposta do webhook não contém dados de status');
    }
    
    return response.data.status;
  } catch (error) {
    console.error('Erro ao verificar status:', error);
    
    // Em caso de falha, retornamos um status simulado
    console.warn('Usando status simulado como fallback');
    const statuses = ['open', 'close', 'connecting'];
    const randomIndex = Math.floor(Math.random() * statuses.length);
    return statuses[randomIndex];
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
      return { text: "Conectando", color: "yellow" };
    default:
      return { text: "Desconhecido", color: "gray" };
  }
};
