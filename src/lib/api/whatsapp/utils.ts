// Função para mapear status para informações legíveis
export const mapStatusToText = (status: string) => {
  const lowerStatus = (status || '').toLowerCase();
  
  if (['connected', 'open', 'opened'].includes(lowerStatus)) {
    return { text: 'Conectado', color: 'green' };
  } else if (['connecting', 'loading', 'starting'].includes(lowerStatus)) {
    return { text: 'Conectando', color: 'yellow' };
  } else if (['disconnected', 'close', 'closed', 'inactive'].includes(lowerStatus)) {
    return { text: 'Desconectado', color: 'red' };
  } else {
    return { text: status || 'Desconhecido', color: 'gray' };
  }
};

// Verificar se a instância está conectada
export const isInstanceConnected = (status: string | null | undefined): boolean => {
  if (!status) return false;
  
  const normalizedStatus = status.toLowerCase();
  return normalizedStatus === "open" || normalizedStatus === "connected";
};

// Add additional utilities to help with debugging
export const logWebhookResponse = (description: string, data: any) => {
  console.log(`[Webhook] ${description}:`, JSON.stringify(data, null, 2));
  
  // Log adicional para debugging específico de instâncias
  if (data && data.data && Array.isArray(data.data)) {
    console.log(`[Webhook] Instâncias encontradas (${data.data.length}):`, 
      data.data.map(inst => ({
        name: inst.name || inst.instance || inst.instanceName || '',
        status: inst.connectionStatus || inst.status || inst.state || 'unknown'
      }))
    );
  }
};
