
import React from "react";
import { TableCell, TableRow } from "@/components/ui/table";
import { WhatsAccount } from "@/lib/api/whatsapp/types";
import { StatusBadge } from "./StatusBadge";
import { ActionButtons } from "./ActionButtons";

interface WhatsAccountRowProps {
  account: WhatsAccount;
  onDelete: (id: number, nomeInstancia: string) => Promise<void>;
  onConnect: (id: number, nomeInstancia: string, webhookInst: string) => Promise<void>;
  onDisconnect: (id: number, nomeInstancia: string) => Promise<void>;
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
  isProcessing,
  getStatusInfo,
  onWebhookResponse
}: WhatsAccountRowProps) {
  return (
    <TableRow>
      <TableCell>{account.id}</TableCell>
      <TableCell className="font-medium">{account.nome_instancia}</TableCell>
      <TableCell>{account.empresa_id}</TableCell>
      <TableCell>
        <StatusBadge status={account.status} />
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
