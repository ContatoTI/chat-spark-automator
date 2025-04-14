
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { QrCode } from "lucide-react";

interface QRCodeDialogProps {
  isOpen: boolean;
  onClose: () => void;
  instanceName: string;
  qrCodeData?: string;
}

export function QRCodeDialog({ isOpen, onClose, instanceName, qrCodeData }: QRCodeDialogProps) {
  // Function to determine if the string is a valid base64 format
  const isBase64 = (str: string) => {
    try {
      // Regular expression to check for valid base64 characters
      const regex = /^[A-Za-z0-9+/=]+$/;
      return regex.test(str) && str.length % 4 === 0;
    } catch (err) {
      return false;
    }
  };

  // Function to format the QR code data properly
  const formatQRCodeData = (data: string) => {
    if (!data) return '';
    
    // If it's already a complete data URL, return as is
    if (data.startsWith('data:')) {
      return data;
    }
    
    // If it's a base64 string, convert to data URL
    if (isBase64(data)) {
      return `data:image/png;base64,${data}`;
    }
    
    return data;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Conectar "{instanceName}"</DialogTitle>
          <DialogDescription>
            Escaneie o QR Code abaixo com seu WhatsApp para conectar esta instância
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex flex-col items-center justify-center p-4">
          {qrCodeData ? (
            <div className="flex flex-col items-center space-y-4">
              <img 
                src={formatQRCodeData(qrCodeData)} 
                alt="QR Code para conectar WhatsApp" 
                className="max-w-full h-auto border rounded-md"
              />
              <p className="text-sm text-center text-muted-foreground">
                Abra o WhatsApp no seu celular, toque em Menu ou Configurações e selecione Aparelhos Conectados.
                Aponte seu celular para esta tela para capturar o código.
              </p>
            </div>
          ) : (
            <div className="flex flex-col items-center space-y-4 p-10">
              <QrCode className="h-16 w-16 animate-pulse text-muted-foreground" />
              <p className="text-sm text-center text-muted-foreground">
                Carregando QR Code...
              </p>
            </div>
          )}
        </div>
        
        <div className="flex justify-center mt-4">
          <Button variant="outline" onClick={onClose}>
            Fechar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
