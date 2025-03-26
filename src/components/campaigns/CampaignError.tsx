
import React from "react";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface CampaignErrorProps {
  error: unknown;
  onRefresh: () => void;
}

export const CampaignError: React.FC<CampaignErrorProps> = ({ error, onRefresh }) => {
  // Convert error to a readable message
  const errorMessage = error instanceof Error 
    ? error.message 
    : typeof error === 'object' && error !== null && 'message' in error 
      ? String(error.message) 
      : 'Erro desconhecido';
  
  // Check if it's an RLS policy error
  const isRLSError = typeof errorMessage === 'string' && 
    (errorMessage.includes('row-level security') || 
     errorMessage.includes('violates row-level security policy') ||
     errorMessage.includes('42501'));

  return (
    <div className="flex flex-col gap-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-semibold tracking-tight">Campanhas</h1>
        <Button variant="outline" onClick={onRefresh}>
          <RefreshCw className="mr-2 h-4 w-4" />
          Atualizar
        </Button>
      </div>
      <Alert variant="destructive">
        <AlertTitle className="text-xl font-medium mb-2">Erro ao carregar campanhas</AlertTitle>
        <AlertDescription className="space-y-2">
          <p>{errorMessage}</p>
          {isRLSError && (
            <p className="text-sm text-muted-foreground mt-2">
              Este erro está relacionado às políticas de segurança do Supabase (RLS). 
              Verifique se você está autenticado e tem as permissões necessárias.
            </p>
          )}
        </AlertDescription>
      </Alert>
    </div>
  );
};
