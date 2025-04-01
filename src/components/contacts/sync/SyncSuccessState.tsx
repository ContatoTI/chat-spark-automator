
import React from "react";
import { CheckCircle2 } from "lucide-react";

export const SyncSuccessState: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-4">
      <div className="rounded-full bg-green-100 dark:bg-green-900/20 p-4">
        <CheckCircle2 className="h-8 w-8 text-green-600 dark:text-green-400" />
      </div>
      <div className="text-center">
        <p className="font-medium">Sincronização concluída!</p>
        <p className="text-sm text-muted-foreground mt-1">
          Sincronização em andamento, atualize a página daqui alguns instantes
        </p>
      </div>
    </div>
  );
};
