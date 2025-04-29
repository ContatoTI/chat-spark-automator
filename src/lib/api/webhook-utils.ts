
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
    console.log(`[Webhook] Chamando webhook: ${url} com payload:`, payload);
    const startTime = performance.now();
    
    // Try POST request first with no-cors mode
    try {
      console.log('[Webhook] Tentando requisição POST');
      const postResponse = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      
      const endTime = performance.now();
      console.log(`[Webhook] Requisição POST enviada em ${(endTime - startTime).toFixed(2)}ms`);
      
      // Attempt to parse the response
      try {
        const responseData = await postResponse.json();
        console.log('[Webhook] Resposta do servidor:', responseData);
        return { 
          success: true,
          data: responseData
        };
      } catch (parseErr) {
        // If we can't parse the response JSON, return success with the status
        console.log('[Webhook] Não foi possível analisar a resposta JSON, mas a requisição foi enviada');
        return { 
          success: postResponse.ok, 
          message: `Requisição enviada com status: ${postResponse.status}`
        };
      }
    } catch (err) {
      console.error('[Webhook] Erro ao enviar requisição POST:', err);
      
      // Se POST falhar, tente GET
      console.log('[Webhook] Tentando requisição GET como fallback');
      
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
        });
        
        const endTime = performance.now();
        console.log(`[Webhook] Requisição GET enviada em ${(endTime - startTime).toFixed(2)}ms`);
        
        try {
          const responseData = await getResponse.json();
          console.log('[Webhook] Resposta do servidor (GET):', responseData);
          return { 
            success: true,
            data: responseData
          };
        } catch (parseErr) {
          return { 
            success: getResponse.ok, 
            message: `Requisição GET enviada com status: ${getResponse.status}`
          };
        }
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

/**
 * Helper function to check if a column exists in a table
 * @param supabaseClient The Supabase client
 * @param tableName The table name
 * @param columnName The column name to check
 * @returns A promise that resolves to true if the column exists, false otherwise
 */
export const checkColumnExists = async (
  supabaseClient: any,
  tableName: string,
  columnName: string
): Promise<boolean> => {
  try {
    // Attempt to select just this column to see if it exists
    const { error } = await supabaseClient
      .from(tableName)
      .select(columnName)
      .limit(1);
      
    // If there's no error, the column exists
    return !error;
  } catch (error) {
    console.error(`Error checking if column ${columnName} exists in ${tableName}:`, error);
    return false;
  }
};
