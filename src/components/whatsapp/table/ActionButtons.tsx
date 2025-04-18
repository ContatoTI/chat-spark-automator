
import React from "react";
import { Button } from "@/components/ui/button";
import { Trash2, Wifi, WifiOff } from "lucide-react";
import { WhatsAccount } from "@/lib/api/whatsapp/types";
import { isInstanceConnected } from "@/lib/api/whatsapp/utils";
import { toast } from "sonner";

interface ActionButtonsProps {
  account: WhatsAccount;
  onDelete: (id: number, nomeInstancia: string) => Promise<void>;
  onConnect: (id: number, nomeInstancia: string, webhookInst: string) => Promise<void>;
  onDisconnect: (id: number, nomeInstancia: string) => Promise<void>;
  isProcessing: { [id: number]: string };
  onWebhookResponse?: (data: any) => void;
}

export const ActionButtons = ({
  account,
  onDelete,
  onConnect,
  onDisconnect,
  isProcessing,
  onWebhookResponse
}: ActionButtonsProps) => {
  const isConnected = isInstanceConnected(account.status);
  const processing = isProcessing[account.id];
  const webhookUrl = localStorage.getItem('webhook_instancias') || '';

  const handleActionClick = async (action: 'connect' | 'disconnect' | 'delete') => {
    try {
      let result;
      
      if (action === 'connect') {
        result = await onConnect(account.id, account.nome_instancia, webhookUrl);
      } else if (action === 'disconnect') {
        result = await onDisconnect(account.id, account.nome_instancia);
      } else if (action === 'delete') {
        result = await onDelete(account.id, account.nome_instancia);
      }
      
      // Log the webhook response if the callback is provided
      if (onWebhookResponse && result) {
        onWebhookResponse({
          action,
          instance: account.nome_instancia,
          result,
          timestamp: new Date().toISOString()
        });
      }
      
    } catch (error) {
      console.error(`Error during ${action}:`, error);
      toast.error(`Erro ao ${action === 'connect' ? 'conectar' : 
                           action === 'disconnect' ? 'desconectar' : 
                           'excluir'} instância`);
      
      // Also log errors
      if (onWebhookResponse) {
        onWebhookResponse({
          action,
          instance: account.nome_instancia,
          error: error instanceof Error ? error.message : 'Unknown error',
          timestamp: new Date().toISOString()
        });
      }
    }
  };

  return (
    <div className="flex justify-end gap-2">
      {!isConnected && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleActionClick('connect')}
          disabled={!!processing || !webhookUrl}
          className="h-8 w-8 p-0"
          title={webhookUrl ? "Conectar" : "Configure o webhook primeiro"}
        >
          <Wifi className="h-4 w-4" />
        </Button>
      )}
      
      {isConnected && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleActionClick('disconnect')}
          disabled={!!processing}
          className="h-8 w-8 p-0"
          title="Desconectar"
        >
          <WifiOff className="h-4 w-4" />
        </Button>
      )}
      
      <Button
        variant="outline"
        size="sm"
        onClick={() => handleActionClick('delete')}
        disabled={!!processing || isConnected}
        className="h-8 w-8 p-0 text-destructive hover:text-destructive-foreground hover:bg-destructive"
        title={isConnected ? "Desconecte primeiro" : "Excluir"}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
};
