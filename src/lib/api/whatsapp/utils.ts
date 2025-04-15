
export const isInstanceConnected = (status: string | null | undefined): boolean => {
  return status === 'open';
};

export const mapStatusToText = (status: string | null | undefined): { 
  text: string; 
  color: "green" | "red" | "yellow" | "gray"; 
} => {
  if (!status) {
    return { text: "Desconhecido", color: "gray" };
  }
  
  switch (status.toLowerCase()) {
    case "open":
      return { text: "Conectado", color: "green" };
    case "close":
      return { text: "Desconectado", color: "red" };
    case "connecting":
      return { text: "QR Code", color: "yellow" };
    default:
      return { text: "Desconhecido", color: "gray" };
  }
};
