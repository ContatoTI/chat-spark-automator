
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { callWebhook } from "@/lib/api/webhook-utils";
import { toast } from "sonner";

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
      });

      console.log('[WebhookConnection] Resposta do webhook:', response);

      // Extract QR code from Evolution API response
      if (response.success && Array.isArray(response.data) && response.data.length > 0) {
        const qrData = response.data[0]?.data?.base64;
        if (!qrData) {
          throw new Error('Resposta do webhook não contém dados do QR code');
        }
        return { qrCodeData: qrData, instanceName: params.nomeInstancia };
      } else if (response.success && response.data?.base64) {
        // Handle response format where data is an object, not an array
        return { qrCodeData: response.data.base64, instanceName: params.nomeInstancia };
      }

      throw new Error('Resposta do webhook inválida ou não contém QR code');
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
