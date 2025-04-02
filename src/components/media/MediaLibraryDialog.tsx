import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { MediaLibrary } from "./MediaLibrary";
import { MediaFile, fetchMediaWebhookUrl } from "@/lib/api/mediaLibrary";
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
  const [webhookUrl, setWebhookUrl] = useState<string | null>(null);
  const [isChecking, setIsChecking] = useState(false);

  useEffect(() => {
    if (open) {
      setIsChecking(true);
      fetchMediaWebhookUrl().then(url => {
        setWebhookUrl(url);
        console.log("Webhook URL loaded:", url);
        setIsChecking(false);
      }).catch(error => {
        console.error("Error loading webhook URL:", error);
        setWebhookUrl(null);
        setIsChecking(false);
      });
    }
  }, [open]);

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
        
        {!isChecking && webhookUrl === null && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Webhook para biblioteca de mídia não configurado. Por favor, configure-o nas configurações do sistema.
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
