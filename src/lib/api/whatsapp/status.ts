
import { WhatsAppStatusResponse } from "./types";
import { callWebhook } from "../webhook-utils";
import { logWebhookResponse } from "./utils";

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
    const webhookUrl = localStorage.getItem('webhook_instancias');
    
    console.log(`Verificando status para instância: ${instanceName} via webhook: ${webhookUrl}`);
    
    if (!webhookUrl) {
      throw new Error('URL do webhook de instâncias não configurada');
    }
    
    // Enviar o nome da instância específica no payload
    const response = await callWebhook(webhookUrl, {
      action: 'status',
      instance_name: instanceName,
      timestamp: new Date().toISOString()
    });
    
    console.log('[Webhook] Resposta para instância específica:', response);
    
    if (!response.success) {
      throw new Error(response.message || 'Falha ao verificar status');
    }
    
    // Se a resposta contiver dados específicos para esta instância
    if (response.data) {
      // Caso seja um objeto com status direto para esta instância
      if (response.data.connectionStatus || response.data.status) {
        return response.data.connectionStatus || response.data.status;
      }
      
      // Caso seja um array, procurar a instância específica
      if (Array.isArray(response.data)) {
        const instance = response.data.find(inst => 
          inst.name === instanceName || inst.instance === instanceName || inst.instanceName === instanceName
        );
        
        if (instance) {
          return instance.connectionStatus || instance.status || instance.state || 'close';
        }
      }
    }
    
    // Como fallback, tentamos buscar o status de todas as instâncias
    const allStatusResponse = await fetchAllInstancesStatus();
    
    // Procurar a instância específica na resposta
    const instance = allStatusResponse.data?.find(inst => inst.name === instanceName);
    if (!instance) {
      console.warn(`Instância '${instanceName}' não encontrada na resposta do webhook`);
      return 'close'; // Fallback para desconectado se não encontrar
    }
    
    // Retorna o status da instância
    console.log(`Status da instância '${instanceName}': ${instance.connectionStatus}`);
    return instance.connectionStatus;
  } catch (error) {
    console.error('Erro ao verificar status:', error);
    return 'close'; // Fallback para desconectado em caso de erro
  }
};
