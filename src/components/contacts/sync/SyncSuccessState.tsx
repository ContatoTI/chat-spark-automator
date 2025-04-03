
import React from "react";
import { CheckCircle2 } from "lucide-react";

interface SyncSuccessStateProps {
  message?: string;
}

export const SyncSuccessState: React.FC<SyncSuccessStateProps> = ({ message }) => {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-4">
      <div className="rounded-full bg-green-100 dark:bg-green-900/20 p-4">
        <CheckCircle2 className="h-8 w-8 text-green-600 dark:text-green-400" />
      </div>
      <div className="text-center">
        <p className="font-medium">{message || "Sincronização concluída!"}</p>
      </div>
    </div>
  );
};
