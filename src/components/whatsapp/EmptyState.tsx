
import React from "react";
import { MessageSquare } from "lucide-react";

export function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center border rounded-lg bg-background">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
        <MessageSquare className="h-10 w-10 text-muted-foreground" />
      </div>
      <h3 className="mt-4 text-lg font-semibold">Nenhuma conta encontrada</h3>
      <p className="mt-2 text-sm text-muted-foreground max-w-md">
        Você ainda não possui contas de WhatsApp cadastradas. Clique em "Nova Conta" para começar.
      </p>
    </div>
  );
}
