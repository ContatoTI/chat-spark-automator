
import React from "react";
import { TableCell, TableRow } from "@/components/ui/table";
import { WhatsAccount } from "@/lib/api/whatsapp/types";
import { StatusBadge } from "./StatusBadge";
import { ActionButtons } from "./ActionButtons";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

interface WhatsAccountRowProps {
  account: WhatsAccount;
  onDelete: (id: number, nomeInstancia: string) => Promise<void>;
  onConnect: (id: number, nomeInstancia: string, webhookInst: string) => Promise<void>;
  onDisconnect: (id: number, nomeInstancia: string) => Promise<void>;
  onUpdateStatus: (nomeInstancia: string) => Promise<void>;
  isProcessing: { [id: number]: string };
  getStatusInfo?: (status: string) => { 
    label: string; 
    color: string; 
    bgColor: string; 
  };
  onWebhookResponse?: (data: any) => void;
}

export function WhatsAccountRow({
  account,
  onDelete,
  onConnect,
  onDisconnect,
  onUpdateStatus,
  isProcessing,
  getStatusInfo,
  onWebhookResponse
}: WhatsAccountRowProps) {
  // Handler para atualizar o status com prevenção de múltiplos cliques
  const handleStatusUpdate = async () => {
    console.log("Atualizando status para:", account.nome_instancia);
    await onUpdateStatus(account.nome_instancia);
  };

  return (
    <TableRow>
      <TableCell>{account.id}</TableCell>
      <TableCell className="font-medium">{account.nome_instancia}</TableCell>
      <TableCell>{account.empresa_id}</TableCell>
      <TableCell className="flex items-center gap-2">
        <StatusBadge status={account.status} />
        <Button
          variant="ghost"
          size="icon"
          onClick={handleStatusUpdate}
          className="h-8 w-8"
          title="Atualizar status"
        >
          <RefreshCw className="h-4 w-4" />
        </Button>
      </TableCell>
      <TableCell>
        <ActionButtons
          account={account}
          onDelete={onDelete}
          onConnect={onConnect}
          onDisconnect={onDisconnect}
          isProcessing={isProcessing}
          onWebhookResponse={onWebhookResponse}
        />
      </TableCell>
    </TableRow>
  );
}
