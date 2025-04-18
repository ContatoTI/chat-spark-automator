
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
              isProcessing={isProcessing}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
