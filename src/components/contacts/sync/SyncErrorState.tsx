
import React from "react";
import { XCircle } from "lucide-react";

export const SyncErrorState: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-4">
      <div className="rounded-full bg-red-100 dark:bg-red-900/20 p-4">
        <XCircle className="h-8 w-8 text-red-600 dark:text-red-400" />
      </div>
      <div className="text-center">
        <p className="font-medium">Erro na sincronização</p>
        <p className="text-sm text-muted-foreground mt-1">
          Ocorreu um erro ao sincronizar seus contatos. Por favor, tente novamente.
        </p>
      </div>
    </div>
  );
};
