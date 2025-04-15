
import { WhatsAppStatusResponse } from "./types";
import { callWebhook } from "../webhook-utils";

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
    
    // Filtrar qualquer item que não tenha name ou connectionStatus definidos
    if (response.data && Array.isArray(response.data)) {
      response.data = response.data.filter(item => item && item.name && item.connectionStatus);
      console.log('[Webhook] Status filtrado:', response.data);
    }
    
    return response;
  } catch (error) {
    console.error('[Webhook] Erro ao verificar status das instâncias:', error);
    throw error;
  }
};

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
