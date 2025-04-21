
/**
 * Utility functions for making webhook API calls
 */

/**
 * Makes a webhook call with fallback from POST to GET if needed
 * @param url The webhook URL to call
 * @param payload The payload to send
 * @returns A promise with the result
 */
export const callWebhook = async (
  url: string, 
  payload: Record<string, any>
): Promise<{ success: boolean; data?: any; message?: string }> => {
  if (!url || url.trim() === '') {
    console.error('URL do webhook vazia');
    return { 
      success: false, 
      message: "URL do webhook não configurada" 
    };
  }

  try {
    console.log(`[Webhook] Chamando webhook: ${url} com payload:`, JSON.stringify(payload));
    const startTime = performance.now();
    
    // Try POST request first with no-cors mode
    try {
      console.log('[Webhook] Tentando requisição POST com mode: no-cors');
      const postResponse = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        mode: 'no-cors', // Adiciona mode no-cors para evitar problemas de CORS
        body: JSON.stringify(payload),
      });
      
      const endTime = performance.now();
      console.log(`[Webhook] Requisição POST enviada em ${(endTime - startTime).toFixed(2)}ms`);
      
      // Com mode: no-cors, não podemos ler a resposta, então assumimos sucesso se não houver erro
      console.log('[Webhook] Requisição POST bem-sucedida (assumindo sucesso com no-cors)');
      return { 
        success: true, 
        message: "Requisição enviada com sucesso (não podemos verificar a resposta devido ao modo no-cors)" 
      };
    } catch (err) {
      console.error('[Webhook] Erro ao enviar requisição POST:', err);
      
      // Se POST falhar, tente GET
      console.log('[Webhook] Tentando requisição GET com mode: no-cors');
      
      // Build URL with query parameters
      const queryParams = new URLSearchParams();
      Object.entries(payload).forEach(([key, value]) => {
        queryParams.append(key, String(value));
      });
      
      const getUrl = `${url}?${queryParams.toString()}`;
      console.log('[Webhook] Tentando requisição GET para:', getUrl);
      
      try {
        const getResponse = await fetch(getUrl, {
          method: 'GET',
          mode: 'no-cors', // Adiciona mode no-cors para evitar problemas de CORS
        });
        
        const endTime = performance.now();
        console.log(`[Webhook] Requisição GET enviada em ${(endTime - startTime).toFixed(2)}ms`);
        
        // Com mode: no-cors, não podemos ler a resposta, então assumimos sucesso se não houver erro
        console.log('[Webhook] Requisição GET bem-sucedida (assumindo sucesso com no-cors)');
        return { 
          success: true, 
          message: "Requisição enviada com sucesso (não podemos verificar a resposta devido ao modo no-cors)" 
        };
      } catch (getErr) {
        console.error('[Webhook] Erro também ao tentar requisição GET:', getErr);
        throw getErr;
      }
    }
  } catch (error) {
    console.error('[Webhook] Erro ao processar requisição webhook:', error);
    return { 
      success: false, 
      message: error instanceof Error ? error.message : "Erro desconhecido ao chamar webhook" 
    };
  }
};
