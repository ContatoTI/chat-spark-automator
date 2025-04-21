
import { WhatsAppStatusResponse } from "./types";
import { callWebhook } from "../webhook-utils";
import { logWebhookResponse } from "./utils";
import { updateWhatsAccountStatus } from "./api";

export const fetchAllInstancesStatus = async (): Promise<WhatsAppStatusResponse> => {
  try {
    const webhookUrl = localStorage.getItem('webhook_disparo');
    
    console.log(`[Webhook] Verificando status de todas as instâncias via webhook: ${webhookUrl}`);
    
    if (!webhookUrl) {
      throw new Error('URL do webhook principal não configurada');
    }
    
    const response = await callWebhook(webhookUrl, {
      action: 'status',
      timestamp: new Date().toISOString()
    });
    
    console.log('[Webhook] Resposta bruta do webhook:', response);
    
    // Garantir que temos um formato consistente para o retorno
    const statusResponse: WhatsAppStatusResponse = {
      success: response.success === false ? false : true,
      message: response.message || '',
      data: []
    };
    
    // Processar dados dependendo do formato retornado
    if (response.success !== false) {
      // Se a resposta é um array diretamente (como mostrado no exemplo)
      if (Array.isArray(response)) {
        statusResponse.data = response.map(item => ({
          name: item.name || item.instance || item.instanceName || '',
          connectionStatus: item.connectionStatus || item.status || item.state || 'unknown'
        }));
      } 
      // Se os dados já estiverem no formato esperado (array no campo data)
      else if (response.data && Array.isArray(response.data)) {
        statusResponse.data = response.data.map(item => ({
          name: item.name || item.instance || item.instanceName || '',
          connectionStatus: item.connectionStatus || item.status || item.state || 'unknown'
        }));
      } 
      // Se a própria resposta for um objeto (mas não tem o campo success)
      else if (typeof response === 'object' && response !== null) {
        // Tentar encontrar qualquer campo que seja um array
        const arrayFields = Object.keys(response).filter(key => 
          Array.isArray(response[key])
        );
        
        if (arrayFields.length > 0) {
          statusResponse.data = response[arrayFields[0]].map(item => ({
            name: item.name || item.instance || item.instanceName || '',
            connectionStatus: item.connectionStatus || item.status || item.state || 'unknown'
          }));
        }
      }
    }
    
    console.log('[Webhook] Status de todas as instâncias processado:', statusResponse);
    
    // Filtrar qualquer item que não tenha name ou connectionStatus definidos
    if (statusResponse.data && Array.isArray(statusResponse.data)) {
      statusResponse.data = statusResponse.data.filter(item => 
        item && (item.name || item.connectionStatus)
      );
      console.log('[Webhook] Status filtrado:', statusResponse.data);
    }
    
    // Log the final response for debugging
    logWebhookResponse('Status final', statusResponse);
    
    // Atualizar o status no banco de dados para cada instância encontrada
    if (statusResponse.data && statusResponse.data.length > 0) {
      await Promise.all(statusResponse.data.map(async (instance) => {
        if (instance.name && instance.connectionStatus) {
          console.log(`[DB] Atualizando status da instância ${instance.name} para ${instance.connectionStatus}`);
          
          try {
            await updateWhatsAccountStatus(instance.name, instance.connectionStatus);
            console.log(`[DB] Status de ${instance.name} atualizado com sucesso para ${instance.connectionStatus}`);
          } catch (error) {
            console.error(`[DB] Erro ao atualizar status para ${instance.name}:`, error);
          }
        }
      }));
    }
    
    return statusResponse;
  } catch (error) {
    console.error('[Webhook] Erro ao verificar status das instâncias:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Erro desconhecido',
      data: []
    };
  }
};

export const fetchInstanceStatus = async (instanceName: string): Promise<string> => {
  try {
    const webhookUrl = localStorage.getItem('webhook_disparo');
    
    console.log(`Verificando status para instância: ${instanceName} via webhook: ${webhookUrl}`);
    
    if (!webhookUrl) {
      throw new Error('URL do webhook principal não configurada');
    }
    
    const response = await callWebhook(webhookUrl, {
      action: 'status',
      instance_name: instanceName,
      timestamp: new Date().toISOString()
    });
    
    console.log('[Webhook] Resposta bruta:', response);

    // Processar a resposta no formato específico [{ name: string, connectionStatus: string }]
    let instanceStatus = 'close'; // Default status
    
    if (Array.isArray(response)) {
      const instance = response[0]; // Pegamos o primeiro item do array
      if (instance && instance.connectionStatus) {
        instanceStatus = instance.connectionStatus;
      }
    } else if (Array.isArray(response.data)) {
      const instance = response.data[0]; // Se a resposta estiver dentro de data
      if (instance && instance.connectionStatus) {
        instanceStatus = instance.connectionStatus;
      }
    }

    console.log(`[Webhook] Status encontrado para instância ${instanceName}: ${instanceStatus}`);

    // Atualizar o status no banco
    await updateWhatsAccountStatus(instanceName, instanceStatus);
    
    return instanceStatus;
  } catch (error) {
    console.error('[Webhook] Erro ao verificar status:', error);
    return 'close';
  }
};
