
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { testWebhook } from "@/lib/api/settings";
import { toast } from "sonner";
import { Check, X, Loader2 } from "lucide-react";

interface TestWebhookButtonProps {
  url: string;
  label?: string;
}

export function TestWebhookButton({ url, label = "Testar" }: TestWebhookButtonProps) {
  const [isTesting, setIsTesting] = useState(false);

  const handleTest = async () => {
    if (!url || url.trim() === '') {
      toast.error("URL do webhook vazia", {
        description: "Por favor, insira uma URL antes de testar."
      });
      return;
    }

    setIsTesting(true);

    try {
      await testWebhook(url);
      toast.success("Webhook testado com sucesso", {
        description: "A conexão com o webhook foi estabelecida com sucesso."
      });
    } catch (error) {
      toast.error("Erro no teste do webhook", {
        description: error instanceof Error ? error.message : "Ocorreu um erro desconhecido ao testar o webhook."
      });
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <Button 
      type="button"
      variant="outline"
      size="sm"
      onClick={handleTest}
      disabled={isTesting}
    >
      {isTesting ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin mr-2" />
          Testando...
        </>
      ) : (
        <>
          {label}
        </>
      )}
    </Button>
  );
}
