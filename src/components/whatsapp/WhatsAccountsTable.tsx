
import React from "react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Trash2, Plug, PlugZap, Loader2, QrCode, WifiOff, Wifi } from "lucide-react";
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
import { WhatsAccount } from "@/lib/api/whatsapp/types";
import { EmptyState } from "@/components/whatsapp/EmptyState";
import { LoadingState } from "@/components/whatsapp/LoadingState";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { isInstanceConnected } from "@/lib/api/whatsapp/utils";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

interface WhatsAccountsTableProps {
  accounts: WhatsAccount[];
  isLoading: boolean;
  onDelete: (id: number, nomeInstancia: string) => Promise<void>;
  onConnect: (id: number, nomeInstancia: string, webhookInst: string) => Promise<void>;
  onDisconnect: (id: number, nomeInstancia: string) => Promise<void>;
  isProcessing: { [id: number]: string };
  getStatusInfo: (status: string) => { 
    label: string; 
    color: string; 
    bgColor: string; 
  };
}

export function WhatsAccountsTable({ 
  accounts, 
  isLoading, 
  onDelete, 
  onConnect,
  onDisconnect,
  isProcessing,
  getStatusInfo
}: WhatsAccountsTableProps) {
  if (isLoading) {
    return <LoadingState />;
  }

  if (!accounts || accounts.length === 0) {
    return <EmptyState />;
  }

  const getStatusIcon = (status: string | null | undefined) => {
    if (!status) return null;
    
    const normalizedStatus = status.toLowerCase();
    
    switch (normalizedStatus) {
      case "open":
        return <Wifi className="h-4 w-4" />;
      case "close":
        return <WifiOff className="h-4 w-4" />;
      case "connecting":
        return <QrCode className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const getStatusBadgeVariant = (status: string | null | undefined) => {
    if (!status) return "secondary";
    
    const normalizedStatus = status.toLowerCase();
    
    switch (normalizedStatus) {
      case "open":
        return "success";
      case "close":
        return "destructive";
      case "connecting":
        return "warning";
      default:
        return "secondary";
    }
  };

  const getStatusLabel = (status: string | null | undefined) => {
    if (!status) return "Desconhecido";
    
    const normalizedStatus = status.toLowerCase();
    
    switch (normalizedStatus) {
      case "open":
        return "Conectado";
      case "close":
        return "Desconectado";
      case "connecting":
        return "QR Code";
      default:
        return status;
    }
  };

  const handleConnectionToggle = (account: WhatsAccount) => {
    const connected = isInstanceConnected(account.status);
    if (connected) {
      return onDisconnect(account.id, account.nome_instancia);
    } else {
      // Get webhook URL from localStorage instead of account.webhook_inst
      const webhookUrl = localStorage.getItem('webhook_instancias');
      
      if (!webhookUrl) {
        toast.error("URL do webhook não configurada para esta instância");
        return Promise.resolve();
      }
      
      return onConnect(account.id, account.nome_instancia, webhookUrl);
    }
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Nome da Instância</TableHead>
            <TableHead>Empresa ID</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="w-[180px] text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {accounts.map((account) => {
            const isConnected = isInstanceConnected(account.status);
            const isProcessingInstance = !!isProcessing[account.id];
            const connectionAction = isConnected ? 'disconnecting' : 'connecting';
            const badgeVariant = getStatusBadgeVariant(account.status);
            
            return (
              <TableRow key={account.id}>
                <TableCell>{account.id}</TableCell>
                <TableCell className="font-medium">{account.nome_instancia}</TableCell>
                <TableCell>{account.empresa_id}</TableCell>
                <TableCell>
                  <Badge 
                    variant={badgeVariant as any} 
                    className="flex items-center gap-1 w-fit"
                  >
                    {getStatusIcon(account.status)}
                    <span>{getStatusLabel(account.status)}</span>
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex justify-end gap-2">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button 
                            variant="outline" 
                            size="icon" 
                            className={isConnected ? "text-orange-600" : "text-blue-600"} 
                            onClick={() => handleConnectionToggle(account)}
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
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
