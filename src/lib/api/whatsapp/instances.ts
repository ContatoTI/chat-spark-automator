
import { callWebhook } from "../webhook-utils";

export const disconnectInstance = async (instanceName: string): Promise<boolean> => {
  try {
    const webhookUrl = localStorage.getItem('webhook_disparo');
    
    console.log(`[Webhook] Desconectando instância: ${instanceName}`);
    
    if (!webhookUrl) {
      throw new Error('URL do webhook principal não configurada');
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

export const deleteInstance = async (instanceName: string): Promise<boolean> => {
  try {
    const webhookUrl = localStorage.getItem('webhook_disparo');
    
    console.log(`[Webhook] Excluindo instância: ${instanceName}`);
    
    if (!webhookUrl) {
      throw new Error('URL do webhook principal não configurada');
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

export const createInstance = async (instanceName: string, companyId: string): Promise<boolean> => {
  try {
    const webhookUrl = localStorage.getItem('webhook_disparo');
    
    console.log(`[Webhook] Criando nova instância: ${instanceName} para empresa: ${companyId}`);
    
    if (!webhookUrl) {
      throw new Error('URL do webhook principal não configurada');
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
