
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
    console.log(`Iniciando teste de webhook para: ${url}`);
    
    // Test with a properly formatted payload
    const payload = {
      action: "teste",
      timestamp: new Date().toISOString()
    };
    
    // First attempt with POST
    const postResponse = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
    
    console.log(`Teste de webhook enviado com sucesso para: ${url}, status: ${postResponse.status}`);
    
    try {
      const responseData = await postResponse.json();
      console.log('Resposta do servidor:', responseData);
    } catch (e) {
      console.log('Não foi possível ler a resposta como JSON, mas a requisição foi enviada');
    }
    
    return true;
  } catch (error) {
    console.error('Erro detalhado no teste do webhook:', error);
    
    // Try again with GET as fallback
    try {
      console.log(`Tentando teste de webhook com GET como fallback para: ${url}`);
      
      const testUrl = new URL(url);
      testUrl.searchParams.append('action', 'teste');
      testUrl.searchParams.append('timestamp', Date.now().toString());
      
      const getResponse = await fetch(testUrl.toString(), {
        method: 'GET',
      });
      
      console.log(`Teste de webhook GET enviado com sucesso para: ${url}, status: ${getResponse.status}`);
      return true;
    } catch (getError) {
      console.error('Erro detalhado no teste GET do webhook:', getError);
      throw new Error('Não foi possível conectar ao webhook. Verifique a URL, permissões CORS e tente novamente.');
    }
  }
};
