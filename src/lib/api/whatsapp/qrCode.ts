
import { WhatsAppQRCodeResponse } from "./types";
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
