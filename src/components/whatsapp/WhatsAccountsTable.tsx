
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
import { Trash2, Plug, PlugZap, Loader2, Wifi, WifiOff, Clock } from "lucide-react";
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
import { Badge } from "@/components/ui/badge";
import { isInstanceConnected } from "@/lib/api/whatsapp/webhook";

interface WhatsAccountsTableProps {
  accounts: WhatsAccount[];
  isLoading: boolean;
  onDelete: (id: number, nomeInstancia: string) => Promise<void>;
  onConnect: (id: number, nomeInstancia: string) => Promise<void>;
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

  const getStatusIcon = (status: string | null) => {
    if (!status) return <Clock className="h-4 w-4" />;
    
    switch (status.toLowerCase()) {
      case "open":
        return <Wifi className="h-4 w-4 text-green-500" />;
      case "close":
        return <WifiOff className="h-4 w-4 text-red-500" />;
      case "connecting":
        return <Clock className="h-4 w-4 text-yellow-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusBadgeVariant = (color: string) => {
    if (color.includes("green")) return "success";
    if (color.includes("red")) return "destructive";
    if (color.includes("yellow")) return "warning";
    return "secondary";
  };

  const handleConnectionToggle = (account: WhatsAccount) => {
    const connected = isInstanceConnected(account.status);
    if (connected) {
      return onDisconnect(account.id, account.nome_instancia);
    } else {
      return onConnect(account.id, account.nome_instancia);
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
            const statusInfo = getStatusInfo(account.status || "");
            const badgeVariant = getStatusBadgeVariant(statusInfo.color);
            const isConnected = isInstanceConnected(account.status);
            const isProcessingInstance = !!isProcessing[account.id];
            const connectionAction = isConnected ? 'disconnecting' : 'connecting';
            
            return (
              <TableRow key={account.id}>
                <TableCell>{account.id}</TableCell>
                <TableCell className="font-medium">{account.nome_instancia}</TableCell>
                <TableCell>{account.empresa_id}</TableCell>
                <TableCell>
                  <Badge variant={badgeVariant as any} className="flex items-center gap-1 w-fit">
                    {getStatusIcon(account.status || null)}
                    <span>{statusInfo.label}</span>
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
