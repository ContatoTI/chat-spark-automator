
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { callWebhook } from "@/lib/api/webhook-utils";
import { toast } from "sonner";
import { WhatsAPIResponse } from "@/lib/api/whatsapp/types";

export const useWhatsAccountConnection = () => {
  const [qrCodeData, setQrCodeData] = useState<string | null>(null);
  const [qrCodeDialogOpen, setQrCodeDialogOpen] = useState(false);
  const [currentInstance, setCurrentInstance] = useState<string | null>(null);
  const queryClient = useQueryClient();

  // Connect account mutation
  const connectAccountMutation = useMutation({
    mutationFn: async (params: { id: number, nomeInstancia: string, webhookUrl: string }) => {
      console.log(`[WebhookConnection] Conectando instância: ${params.nomeInstancia} via ${params.webhookUrl}`);
      
      if (!params.webhookUrl) {
        throw new Error('URL do webhook não configurada');
      }
      
      const response = await callWebhook(params.webhookUrl, {
        action: 'connect',
        instance_name: params.nomeInstancia,
        timestamp: new Date().toISOString()
      }) as WhatsAPIResponse;

      console.log('[WebhookConnection] Resposta do webhook:', response);

      // Verificar se há dados do QR code
      if (response.success && Array.isArray(response.data) && response.data.length > 0) {
        const qrData = response.data[0]?.data?.base64;
        if (!qrData) {
          throw new Error('Resposta do webhook não contém dados do QR code');
        }
        return { qrCodeData: qrData, instanceName: params.nomeInstancia };
      }

      throw new Error('Resposta do webhook não contém dados do QR code');
    },
    onSuccess: (data) => {
      console.log('[WebhookConnection] QR code gerado com sucesso');
      setQrCodeData(data.qrCodeData);
      setCurrentInstance(data.instanceName);
      setQrCodeDialogOpen(true);
    },
    onError: (error) => {
      console.error("Error connecting account:", error);
      toast.error("Erro ao conectar conta", {
        description: error instanceof Error ? error.message : "Erro desconhecido"
      });
    }
  });

  const closeQrCodeDialog = () => {
    setQrCodeDialogOpen(false);
    setQrCodeData(null);
    setCurrentInstance(null);
  };

  return {
    qrCodeData,
    qrCodeDialogOpen,
    currentInstance,
    closeQrCodeDialog,
    connectAccount: connectAccountMutation.mutate,
    isConnecting: connectAccountMutation.isPending
  };
};
