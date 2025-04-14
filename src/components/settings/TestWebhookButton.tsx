
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { testWebhook } from "@/lib/api/settings";
import { toast } from "sonner";
import { Check, X, Loader2 } from "lucide-react";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger 
} from "@/components/ui/tooltip";

interface TestWebhookButtonProps {
  url: string;
  label?: string;
  onSuccessCallback?: (url: string) => void;
}

export function TestWebhookButton({ url, label = "Testar", onSuccessCallback }: TestWebhookButtonProps) {
  const [isTesting, setIsTesting] = useState(false);
  const [lastTestStatus, setLastTestStatus] = useState<'success' | 'error' | null>(null);

  const handleTest = async () => {
    if (!url || url.trim() === '') {
      toast.error("URL do webhook vazia", {
        description: "Por favor, insira uma URL antes de testar."
      });
      return;
    }

    setIsTesting(true);
    setLastTestStatus(null);

    try {
      await testWebhook(url);
      setLastTestStatus('success');
      toast.success("Webhook testado com sucesso", {
        description: "A conexão com o webhook foi estabelecida com sucesso."
      });
      
      // Chama a função de callback se estiver disponível
      if (onSuccessCallback) {
        onSuccessCallback(url);
      }
    } catch (error) {
      setLastTestStatus('error');
      toast.error("Erro no teste do webhook", {
        description: error instanceof Error ? error.message : "Ocorreu um erro desconhecido ao testar o webhook."
      });
    } finally {
      setIsTesting(false);
      // Reset the status indicator after 5 seconds
      setTimeout(() => setLastTestStatus(null), 5000);
    }
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button 
            type="button"
            variant="outline"
            size="sm"
            onClick={handleTest}
            disabled={isTesting}
            className={
              lastTestStatus === 'success' ? 'border-green-500 text-green-600' :
              lastTestStatus === 'error' ? 'border-red-500 text-red-600' : ''
            }
          >
            {isTesting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Testando...
              </>
            ) : lastTestStatus === 'success' ? (
              <>
                <Check className="h-4 w-4 mr-2" />
                {label}
              </>
            ) : lastTestStatus === 'error' ? (
              <>
                <X className="h-4 w-4 mr-2" />
                {label}
              </>
            ) : (
              <>
                {label}
              </>
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          {isTesting ? "Testando conexão com webhook..." : 
           lastTestStatus === 'success' ? "Webhook testado com sucesso" :
           lastTestStatus === 'error' ? "Falha ao testar webhook" :
           "Testar conexão com este webhook"}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
