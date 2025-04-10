
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
import { Trash2, Plug, PlugZap, Loader2, WifiOff, Wifi, Clock } from "lucide-react";
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

interface WhatsAccountsTableProps {
  accounts: WhatsAccount[];
  isLoading: boolean;
  onDelete: (id: number, nomeInstancia: string) => Promise<void>;
  onConnect: (id: number, nomeInstancia: string) => Promise<void>;
  onDisconnect: (id: number, nomeInstancia: string) => Promise<void>;
  isProcessing: {[id: number]: string};
  getStatusInfo: (status: string | null) => { text: string; color: "green" | "red" | "yellow" | "gray" };
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
      case "connected":
        return <Wifi className="h-4 w-4 text-green-500" />;
      case "disconnected":
        return <WifiOff className="h-4 w-4 text-red-500" />;
      case "connecting":
      case "qrcode":
        return <Clock className="h-4 w-4 text-yellow-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusBadgeVariant = (color: "green" | "red" | "yellow" | "gray") => {
    switch (color) {
      case "green": return "success";
      case "red": return "destructive";
      case "yellow": return "warning";
      case "gray": default: return "secondary";
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
            const statusInfo = getStatusInfo(account.status || null);
            const badgeVariant = getStatusBadgeVariant(statusInfo.color);
            
            return (
              <TableRow key={account.id}>
                <TableCell>{account.id}</TableCell>
                <TableCell className="font-medium">{account.nome_instancia}</TableCell>
                <TableCell>{account.empresa_id}</TableCell>
                <TableCell>
                  <Badge variant={badgeVariant as any} className="flex items-center gap-1 w-fit">
                    {getStatusIcon(account.status || null)}
                    <span>{statusInfo.text}</span>
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
                            className="text-blue-600" 
                            onClick={() => onConnect(account.id, account.nome_instancia)}
                            disabled={!!isProcessing[account.id]}
                          >
                            {isProcessing[account.id] === 'connecting' ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <PlugZap className="h-4 w-4" />
                            )}
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Conectar instância</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button 
                            variant="outline" 
                            size="icon" 
                            className="text-orange-600" 
                            onClick={() => onDisconnect(account.id, account.nome_instancia)}
                            disabled={!!isProcessing[account.id]}
                          >
                            {isProcessing[account.id] === 'disconnecting' ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Plug className="h-4 w-4" />
                            )}
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Desconectar instância</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="text-destructive hover:text-destructive"
                          disabled={!!isProcessing[account.id]}
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
