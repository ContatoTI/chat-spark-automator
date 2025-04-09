
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
    console.log(`Chamando webhook: ${url}`);
    
    // Try POST request first
    try {
      console.log('Tentando requisição POST');
      const postResponse = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      
      console.log('Status da resposta POST:', postResponse.status);
      
      // If POST works, return success
      if (postResponse.ok) {
        console.log('Requisição POST bem-sucedida');
        
        try {
          const responseJson = await postResponse.json();
          return { 
            success: true, 
            data: responseJson,
            message: "Operação realizada com sucesso"
          };
        } catch (e) {
          // If can't parse as JSON, return text
          const text = await postResponse.text();
          return { 
            success: true, 
            message: text || "Operação realizada com sucesso" 
          };
        }
      }
      
      // If it's a 404 "not registered for POST" error, try GET
      if (postResponse.status === 404) {
        console.log('Requisição POST falhou com 404, tentando requisição GET');
        
        // Build URL with query parameters
        const queryParams = new URLSearchParams();
        Object.entries(payload).forEach(([key, value]) => {
          queryParams.append(key, String(value));
        });
        
        const getUrl = `${url}?${queryParams.toString()}`;
        console.log('Tentando requisição GET para:', getUrl);
        
        const getResponse = await fetch(getUrl, {
          method: 'GET',
        });
        
        console.log('Status da resposta GET:', getResponse.status);
        
        if (getResponse.ok) {
          console.log('Requisição GET bem-sucedida');
          try {
            const responseJson = await getResponse.json();
            return { 
              success: true, 
              data: responseJson,
              message: "Operação realizada com sucesso"
            };
          } catch (e) {
            // If can't parse as JSON, return text
            const text = await getResponse.text();
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
      console.error('Erro ao chamar webhook:', err);
      throw err;
    }
  } catch (error) {
    console.error('Erro ao processar requisição webhook:', error);
    return { 
      success: false, 
      message: error instanceof Error ? error.message : "Erro desconhecido ao chamar webhook" 
    };
  }
};
