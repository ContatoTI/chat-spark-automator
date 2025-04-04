
import React from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface MediaLibraryErrorProps {
  error: string | null;
  webhookUrl: string;
}

export function MediaLibraryError({ error, webhookUrl }: MediaLibraryErrorProps) {
  if (!error) return null;
  
  return (
    <Alert variant="destructive" className="mb-4">
      <AlertCircle className="h-4 w-4" />
      <AlertDescription>
        {error}
        <div className="mt-2 text-xs">
          <strong>Detalhes técnicos:</strong> Falha na comunicação com o servidor.
          <br />
          URL: {webhookUrl}
        </div>
      </AlertDescription>
    </Alert>
  );
}
