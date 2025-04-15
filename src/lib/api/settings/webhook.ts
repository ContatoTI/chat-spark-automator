
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
    // Using fetch with no-cors mode to handle CORS issues
    // This allows the request to be sent but response info will be limited
    const response = await fetch(url, {
      method: 'GET',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    // Since we're using no-cors, we won't get proper status codes
    // But at least we know the request was sent without network errors
    return true;
  } catch (error) {
    console.error('Erro ao testar webhook:', error);
    throw new Error('Não foi possível conectar ao webhook. Verifique a URL e tente novamente.');
  }
};
