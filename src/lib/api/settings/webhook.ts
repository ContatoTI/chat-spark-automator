
/**
 * Utility functions for testing webhooks
 */

/**
 * Tests if a webhook URL is accessible
 * @param url The webhook URL to test
 * @returns A promise that resolves to true if the webhook is accessible
 */
export const testWebhook = async (url: string): Promise<boolean> => {
  if (!url || url.trim() === '') {
    throw new Error('URL inválida: o webhook URL não pode estar vazio');
  }

  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    throw new Error('URL inválida: o webhook URL deve começar com http:// ou https://');
  }

  try {
    // Primeiro, tentamos com um método POST para teste
    console.log(`Testando webhook: ${url}`);
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ test: true, message: "Testando webhook" }),
    });
    
    // Se o POST não funcionar (erro de CORS), tentamos com um método GET
    if (!response.ok) {
      console.log(`POST não funcionou, tentando com GET: ${url}`);
      
      // Adicionamos parâmetros de teste à URL para GET
      const testUrl = url.includes('?') 
        ? `${url}&test=true&timestamp=${Date.now()}` 
        : `${url}?test=true&timestamp=${Date.now()}`;
      
      const getResponse = await fetch(testUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!getResponse.ok) {
        throw new Error(`Erro ao testar webhook: ${getResponse.status} ${getResponse.statusText}`);
      }
    }
    
    console.log(`Teste de webhook concluído com sucesso para: ${url}`);
    return true;
  } catch (error) {
    console.error('Erro ao testar webhook:', error);
    throw new Error('Não foi possível conectar ao webhook. Verifique a URL e tente novamente.');
  }
};
