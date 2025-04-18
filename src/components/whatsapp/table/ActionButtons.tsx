
import React from "react";
import { Button } from "@/components/ui/button";
import { Loader2, Plug, PlugZap, Trash2 } from "lucide-react";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { isInstanceConnected } from "@/lib/api/whatsapp/utils";
import { WhatsAccount } from "@/lib/api/whatsapp/types";

interface ActionButtonsProps {
  account: WhatsAccount;
  onDelete: (id: number, nomeInstancia: string) => Promise<void>;
  onConnect: (id: number, nomeInstancia: string, webhookInst: string) => Promise<void>;
  onDisconnect: (id: number, nomeInstancia: string) => Promise<void>;
  isProcessing: { [id: number]: string };
}

export function ActionButtons({ 
  account, 
  onDelete, 
  onConnect, 
  onDisconnect, 
  isProcessing 
}: ActionButtonsProps) {
  const isConnected = isInstanceConnected(account.status);
  const isProcessingInstance = !!isProcessing[account.id];
  const connectionAction = isConnected ? 'disconnecting' : 'connecting';

  const handleConnectionToggle = () => {
    if (isConnected) {
      return onDisconnect(account.id, account.nome_instancia);
    } else {
      const webhookUrl = localStorage.getItem('webhook_instancias');
      
      if (!webhookUrl) {
        toast.error("URL do webhook não configurada para esta instância");
        return Promise.resolve();
      }
      
      return onConnect(account.id, account.nome_instancia, webhookUrl);
    }
  };

  return (
    <div className="flex justify-end gap-2">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="outline" 
              size="icon" 
              className={isConnected ? "text-orange-600" : "text-blue-600"} 
              onClick={handleConnectionToggle}
              disabled={isProcessingInstance}
            >
              {isProcessing[account.id] === connectionAction ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : isConnected ? (
                <Plug className="h-4 w-4" />
              ) : (
                <PlugZap className="h-4 w-4" />
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{isConnected ? "Desconectar instância" : "Conectar instância"}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-destructive hover:text-destructive"
            disabled={isProcessingInstance}
          >
            {isProcessing[account.id] === 'deleting' ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Trash2 className="h-4 w-4" />
            )}
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir Conta</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir a conta "{account.nome_instancia}"?
              Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => onDelete(account.id, account.nome_instancia)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
