
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { MediaLibrary } from "./MediaLibrary";
import { MediaFile, MEDIA_WEBHOOK_URL } from "@/lib/api/mediaLibrary";
import { useEffect, useState } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface MediaLibraryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (mediaFile: MediaFile) => void;
  currentType: 'image' | 'video' | 'document';
}

export function MediaLibraryDialog({
  open,
  onOpenChange,
  onSelect,
  currentType,
}: MediaLibraryDialogProps) {
  const [connectionTest, setConnectionTest] = useState<{ status: 'pending' | 'success' | 'error', message?: string }>({
    status: 'pending'
  });

  useEffect(() => {
    if (open) {
      console.log('[MediaLibraryDialog] Diálogo de mídia aberto');
      checkWebhookConnection();
    }
  }, [open]);

  const checkWebhookConnection = async () => {
    if (!open) return;
    
    setConnectionTest({ status: 'pending' });
    console.log(`[MediaLibraryDialog] Testando conexão com webhook: ${MEDIA_WEBHOOK_URL}`);
    
    try {
      // Tentativa simples de acesso para testar se o webhook está acessível
      const startTime = performance.now();
      const response = await fetch(MEDIA_WEBHOOK_URL, { 
        method: 'HEAD',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      const endTime = performance.now();
      
      if (response.ok) {
        console.log(`[MediaLibraryDialog] Conexão com webhook bem-sucedida em ${Math.round(endTime - startTime)}ms`);
        setConnectionTest({ 
          status: 'success', 
          message: `Conexão estabelecida em ${Math.round(endTime - startTime)}ms` 
        });
      } else {
        console.error(`[MediaLibraryDialog] Webhook respondeu com status: ${response.status}`);
        setConnectionTest({ 
          status: 'error', 
          message: `Servidor respondeu com status ${response.status}` 
        });
      }
    } catch (error) {
      console.error('[MediaLibraryDialog] Erro ao testar conexão com webhook:', error);
      setConnectionTest({ 
        status: 'error', 
        message: error instanceof Error ? error.message : 'Erro desconhecido' 
      });
    }
  };

  const handleSelect = (mediaFile: MediaFile) => {
    onSelect(mediaFile);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Biblioteca de Mídia</DialogTitle>
        </DialogHeader>
        
        {connectionTest.status === 'error' && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <div>
                <strong>Problema de conexão com o webhook:</strong> {connectionTest.message}
              </div>
              <div className="mt-2 text-xs">
                Webhook URL: {MEDIA_WEBHOOK_URL}
                <br />
                Verifique se o servidor está acessível ou se há problemas de CORS.
              </div>
            </AlertDescription>
          </Alert>
        )}
        
        <MediaLibrary
          onSelect={handleSelect}
          onClose={() => onOpenChange(false)}
          currentType={currentType}
        />
      </DialogContent>
    </Dialog>
  );
}
