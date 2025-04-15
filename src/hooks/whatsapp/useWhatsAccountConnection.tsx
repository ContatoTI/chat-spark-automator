
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { generateQRCodeData } from "@/lib/api/whatsapp/webhook";
import { toast } from "sonner";

export const useWhatsAccountConnection = () => {
  const [qrCodeData, setQrCodeData] = useState<string | null>(null);
  const [qrCodeDialogOpen, setQrCodeDialogOpen] = useState(false);
  const [currentInstance, setCurrentInstance] = useState<string | null>(null);
  const queryClient = useQueryClient();

  // Connect account mutation
  const connectAccountMutation = useMutation({
    mutationFn: async (params: { id: number, nomeInstancia: string }) => {
      const data = await generateQRCodeData(params.nomeInstancia);
      return { qrCodeData: data, instanceName: params.nomeInstancia };
    },
    onSuccess: (data) => {
      setQrCodeData(data.qrCodeData);
      setCurrentInstance(data.instanceName);
      setQrCodeDialogOpen(true);
    },
    onError: (error) => {
      console.error("Error connecting account:", error);
      toast.error("Erro ao conectar conta", {
        description: error instanceof Error ? error.message : "Unknown error"
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
