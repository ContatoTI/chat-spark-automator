
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
    
    // First attempt with POST
    const postResponse = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'test',
        instance: 'test_instance',
        timestamp: new Date().toISOString(),
      }),
    });

    // If POST fails, try GET
    if (!postResponse.ok) {
      console.log(`POST falhou (${postResponse.status}), tentando GET`);
      
      const testUrl = new URL(url);
      testUrl.searchParams.append('test', 'true');
      testUrl.searchParams.append('timestamp', Date.now().toString());
      
      const getResponse = await fetch(testUrl.toString(), {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!getResponse.ok) {
        console.error(`GET também falhou: ${getResponse.status} ${getResponse.statusText}`);
        throw new Error(`Erro ao testar webhook: ${getResponse.status} ${getResponse.statusText}`);
      }
    }
    
    console.log(`Teste de webhook concluído com sucesso para: ${url}`);
    return true;
  } catch (error) {
    console.error('Erro detalhado no teste do webhook:', error);
    throw new Error('Não foi possível conectar ao webhook. Verifique a URL, permissões CORS e tente novamente.');
  }
};

