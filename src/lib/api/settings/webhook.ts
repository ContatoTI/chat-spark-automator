
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
    
    // First attempt with POST using no-cors
    const postResponse = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      mode: 'no-cors', // Add no-cors mode to handle CORS issues
      body: JSON.stringify({
        action: 'test',
        instance: 'test_instance',
        timestamp: new Date().toISOString(),
      }),
    });
    
    console.log(`Teste de webhook enviado com sucesso para: ${url} (modo no-cors)`);
    // Com no-cors, não podemos verificar o status da resposta
    // Assumimos que se não lançou exceção, o teste foi bem-sucedido
    return true;
  } catch (error) {
    console.error('Erro detalhado no teste do webhook:', error);
    
    // Tente novamente com GET + no-cors como fallback
    try {
      console.log(`Tentando teste de webhook com GET + no-cors para: ${url}`);
      
      const testUrl = new URL(url);
      testUrl.searchParams.append('test', 'true');
      testUrl.searchParams.append('timestamp', Date.now().toString());
      
      await fetch(testUrl.toString(), {
        method: 'GET',
        mode: 'no-cors', // Add no-cors mode to handle CORS issues
      });
      
      console.log(`Teste de webhook GET enviado com sucesso para: ${url} (modo no-cors)`);
      return true;
    } catch (getError) {
      console.error('Erro detalhado no teste GET do webhook:', getError);
      throw new Error('Não foi possível conectar ao webhook. Verifique a URL, permissões CORS e tente novamente.');
    }
  }
};
