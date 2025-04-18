
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
    
    // Try POST request first
    try {
      console.log('[Webhook] Tentando requisição POST');
      const postResponse = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      
      console.log('[Webhook] Status da resposta POST:', postResponse.status);
      
      // If POST works, return success
      if (postResponse.ok) {
        const endTime = performance.now();
        console.log(`[Webhook] Requisição POST bem-sucedida em ${(endTime - startTime).toFixed(2)}ms`);
        
        try {
          const responseJson = await postResponse.json();
          console.log('[Webhook] Resposta JSON (POST):', JSON.stringify(responseJson));
          
          // Direct array response (common for status endpoints)
          if (Array.isArray(responseJson)) {
            console.log('[Webhook] Resposta é um array direto');
            return { 
              success: true, 
              data: responseJson
            };
          }
          
          return { 
            success: true, 
            data: responseJson,
            message: "Operação realizada com sucesso"
          };
        } catch (e) {
          // If can't parse as JSON, return text
          const text = await postResponse.text();
          console.log('[Webhook] Resposta TEXT:', text);
          
          // Try to parse text as JSON (sometimes API returns JSON but with wrong Content-Type)
          try {
            if (text.trim().startsWith('[') || text.trim().startsWith('{')) {
              const jsonData = JSON.parse(text);
              console.log('[Webhook] Resposta TEXT parsed as JSON:', jsonData);
              
              // Handle direct array response
              if (Array.isArray(jsonData)) {
                return { success: true, data: jsonData };
              }
              
              return { success: true, data: jsonData };
            }
          } catch (parseError) {
            console.log('[Webhook] Não foi possível fazer parse da resposta como JSON:', parseError);
          }
          
          return { 
            success: true, 
            message: text || "Operação realizada com sucesso" 
          };
        }
      }
      
      // If it's a 404 "not registered for POST" error, try GET
      if (postResponse.status === 404) {
        console.log('[Webhook] Requisição POST falhou com 404, tentando requisição GET');
        
        // Build URL with query parameters
        const queryParams = new URLSearchParams();
        Object.entries(payload).forEach(([key, value]) => {
          queryParams.append(key, String(value));
        });
        
        const getUrl = `${url}?${queryParams.toString()}`;
        console.log('[Webhook] Tentando requisição GET para:', getUrl);
        
        const getResponse = await fetch(getUrl, {
          method: 'GET',
        });
        
        console.log('[Webhook] Status da resposta GET:', getResponse.status);
        
        if (getResponse.ok) {
          const endTime = performance.now();
          console.log(`[Webhook] Requisição GET bem-sucedida em ${(endTime - startTime).toFixed(2)}ms`);
          
          try {
            const responseJson = await getResponse.json();
            console.log('[Webhook] Resposta JSON (GET):', JSON.stringify(responseJson));
            
            // Direct array response
            if (Array.isArray(responseJson)) {
              return { success: true, data: responseJson };
            }
            
            return { 
              success: true, 
              data: responseJson,
              message: "Operação realizada com sucesso"
            };
          } catch (e) {
            // If can't parse as JSON, return text
            const text = await getResponse.text();
            console.log('[Webhook] Resposta TEXT (GET):', text);
            
            // Try to parse text as JSON
            try {
              if (text.trim().startsWith('[') || text.trim().startsWith('{')) {
                const jsonData = JSON.parse(text);
                console.log('[Webhook] Resposta TEXT (GET) parsed as JSON:', jsonData);
                
                // Handle direct array response
                if (Array.isArray(jsonData)) {
                  return { success: true, data: jsonData };
                }
                
                return { success: true, data: jsonData };
              }
            } catch (parseError) {
              console.log('[Webhook] Não foi possível fazer parse da resposta GET como JSON:', parseError);
            }
            
            return { 
              success: true, 
              message: text || "Operação realizada com sucesso" 
            };
          }
        } else {
          throw new Error(`Erro ao chamar webhook via GET: ${getResponse.status}`);
        }
      } else {
        throw new Error(`Erro ao chamar webhook via POST: ${postResponse.status}`);
      }
    } catch (err) {
      console.error('[Webhook] Erro ao chamar webhook:', err);
      throw err;
    }
  } catch (error) {
    console.error('[Webhook] Erro ao processar requisição webhook:', error);
    return { 
      success: false, 
      message: error instanceof Error ? error.message : "Erro desconhecido ao chamar webhook" 
    };
  }
};
