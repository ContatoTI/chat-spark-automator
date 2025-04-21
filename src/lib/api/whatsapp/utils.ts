// Função para mapear status para informações legíveis
export const mapStatusToText = (status: string | null | undefined) => {
  if (!status) {
    return { text: "Desconhecido", color: "gray" };
  }
  
  // Normalizar o status para minúsculas para comparação
  const normalizedStatus = status.toLowerCase();
  
  // Mapear status para texto e cor
  if (normalizedStatus === "connecting") {
    return { text: "QR Code", color: "yellow" };
  }
  
  if (normalizedStatus === "close") {
    return { text: "Desconectado", color: "red" };
  }
  
  if (normalizedStatus === "open") {
    return { text: "Conectado", color: "green" };
  }
  
  return { text: status, color: "gray" };
};

// Verificar se a instância está conectada
export const isInstanceConnected = (status: string | null | undefined): boolean => {
  if (!status) return false;
  
  const normalizedStatus = status.toLowerCase();
  return normalizedStatus === "open" || normalizedStatus === "connected";
};

// Add additional utilities to help with debugging
export const logWebhookResponse = (action: string, response: any) => {
  console.log(`[Webhook] ${action} response:`, response);
  return response;
};
