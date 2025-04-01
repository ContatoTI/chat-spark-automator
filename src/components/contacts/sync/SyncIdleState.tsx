
import React from "react";
import { RefreshCw } from "lucide-react";

export const SyncIdleState: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-6">
      <div className="rounded-full bg-primary/10 p-4">
        <RefreshCw className="h-8 w-8 text-primary" />
      </div>
      <p className="text-center text-sm text-muted-foreground">
        Clique em sincronizar para importar seus contatos do Google Contacts para a plataforma.
      </p>
    </div>
  );
};
