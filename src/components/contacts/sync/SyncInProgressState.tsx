
import React from "react";
import { RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";

interface SyncInProgressStateProps {
  progress: number;
}

export const SyncInProgressState: React.FC<SyncInProgressStateProps> = ({ progress }) => {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-center">
        <RefreshCw className={cn("h-8 w-8 text-primary", "animate-spin")} />
      </div>
      <div className="space-y-2">
        <Progress value={progress} className="h-2" />
        <p className="text-center text-sm text-muted-foreground">
          Sincronizando contatos... {Math.round(progress)}%
        </p>
      </div>
    </div>
  );
};
