
import { WhatsAppStatusResponse } from "./types";

/**
 * Generate QR code data for connecting a WhatsApp instance
 */
export const generateQRCodeData = async (instanceName: string): Promise<string> => {
  // In a real implementation, this would call an API endpoint
  // For now, we'll simulate the response
  console.log(`Generating QR code for instance: ${instanceName}`);
  
  // Simulated delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Return a placeholder QR code data URL
  return "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQAAAAEACAYAAABccqhmAAAEsElEQVR4nO3VMQ0AMAzAsPIn3QHsd0qyEeTYO7M7A5J+twOALwMASQYAkgwAJBkASDIAkGQAIMkAQJIBgCQDAEkGAJIMACSdB0xR4HfxegAAAABJRU5ErkJggg==";
};

/**
 * Fetch the status of a WhatsApp instance
 */
export const fetchInstanceStatus = async (instanceName: string): Promise<string> => {
  // In a real implementation, this would call an API endpoint
  // For now, we'll simulate the response
  console.log(`Fetching status for instance: ${instanceName}`);
  
  // Simulated delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Randomly return one of the possible statuses
  const statuses = ['open', 'close', 'connecting'];
  const randomIndex = Math.floor(Math.random() * statuses.length);
  return statuses[randomIndex];
};

/**
 * Check if an instance is connected based on its status
 */
export const isInstanceConnected = (status: string | null | undefined): boolean => {
  return status === 'open';
};

/**
 * Map a status string to text and color information
 */
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
      return { text: "Conectando", color: "yellow" };
    default:
      return { text: "Desconhecido", color: "gray" };
  }
};
