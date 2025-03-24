
import React from "react";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

interface ErrorStateProps {
  error: unknown;
  onRetry: () => void;
}

export function ErrorState({ error, onRetry }: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
      <Alert variant="destructive" className="mb-4">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Erro</AlertTitle>
        <AlertDescription>
          {error instanceof Error ? error.message : "Não foi possível carregar as configurações. Tente novamente mais tarde."}
        </AlertDescription>
      </Alert>
      <Button onClick={onRetry}>
        Tentar novamente
      </Button>
    </div>
  );
}
