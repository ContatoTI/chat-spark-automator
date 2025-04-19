
import { WhatsAppStatusResponse } from "./types";
import { callWebhook } from "../webhook-utils";
import { logWebhookResponse } from "./utils";
import { supabase } from "@/lib/supabase";

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
    
    // Atualizar o status no banco de dados para cada instância encontrada
    if (statusResponse.data && statusResponse.data.length > 0) {
      await Promise.all(statusResponse.data.map(async (instance) => {
        if (instance.name && instance.connectionStatus) {
          console.log(`[DB] Atualizando status da instância ${instance.name} para ${instance.connectionStatus}`);
          
          const { error } = await supabase
            .from('AppW_Instancias')
            .update({ status: instance.connectionStatus })
            .eq('nome_instancia', instance.name);
            
          if (error) {
            console.error(`[DB] Erro ao atualizar status para ${instance.name}:`, error);
          } else {
            console.log(`[DB] Status de ${instance.name} atualizado com sucesso para ${instance.connectionStatus}`);
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
    
    // Extrair o status da instância da resposta
    let instanceStatus = 'close'; // Default status
    
    // Verificar diferentes formatos de resposta
    if (Array.isArray(response.data)) {
      const instance = response.data.find(
        inst => inst.name === instanceName || inst.instance === instanceName || inst.instanceName === instanceName
      );
      
      if (instance) {
        instanceStatus = instance.connectionStatus || instance.status || instance.state || 'close';
      }
    } else if (response.data && typeof response.data === 'object') {
      // Caso seja um objeto com status direto
      instanceStatus = response.data.connectionStatus || response.data.status || response.data.state || 'close';
    }

    console.log(`[Webhook] Status encontrado para instância ${instanceName}: ${instanceStatus}`);

    // Atualizar o status na tabela AppW_Instancias
    const { error } = await supabase
      .from('AppW_Instancias')
      .update({ status: instanceStatus })
      .eq('nome_instancia', instanceName);

    if (error) {
      console.error('[DB] Erro ao atualizar status na tabela:', error);
    } else {
      console.log(`[DB] Status da instância ${instanceName} atualizado para: ${instanceStatus}`);
    }
    
    return instanceStatus;
    
  } catch (error) {
    console.error('[Webhook] Erro ao verificar status:', error);
    return 'close'; // Fallback para desconectado em caso de erro
  }
};
