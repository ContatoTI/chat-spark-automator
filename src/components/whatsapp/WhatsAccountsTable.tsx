
import React from "react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { WhatsAccount } from "@/lib/api/whatsapp/types";
import { EmptyState } from "./EmptyState";
import { LoadingState } from "./LoadingState";
import { WhatsAccountRow } from "./table/TableRow";

interface WhatsAccountsTableProps {
  accounts: WhatsAccount[];
  isLoading: boolean;
  onDelete: (id: string, nomeInstancia: string) => Promise<void>;
  onConnect: (id: string, nomeInstancia: string, webhookInst: string) => Promise<void>;
  onDisconnect: (id: string, nomeInstancia: string) => Promise<void>;
  onUpdateStatus: (nomeInstancia: string) => Promise<void>;
  isProcessing: { [id: string]: string };
  getStatusInfo: (status: string) => { 
    label: string; 
    color: string; 
    bgColor: string; 
  };
  onWebhookResponse?: (data: any) => void;
}

export function WhatsAccountsTable({ 
  accounts, 
  isLoading, 
  onDelete, 
  onConnect,
  onDisconnect,
  onUpdateStatus,
  isProcessing,
  getStatusInfo,
  onWebhookResponse
}: WhatsAccountsTableProps) {
  if (isLoading) {
    return <LoadingState />;
  }

  if (!accounts || accounts.length === 0) {
    return <EmptyState />;
  }

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
          {accounts.map((account) => (
            <WhatsAccountRow
              key={account.id}
              account={account}
              onDelete={onDelete}
              onConnect={onConnect}
              onDisconnect={onDisconnect}
              onUpdateStatus={onUpdateStatus}
              isProcessing={isProcessing}
              getStatusInfo={getStatusInfo}
              onWebhookResponse={onWebhookResponse}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
