
import React from "react";
import { Button } from "@/components/ui/button";
import { Loader2, Save } from "lucide-react";

interface SaveButtonProps {
  isPending: boolean;
}

export function SaveButton({ isPending }: SaveButtonProps) {
  return (
    <div className="flex justify-end">
      <Button 
        type="submit" 
        disabled={isPending}
        className="w-full sm:w-auto"
      >
        {isPending && (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        )}
        {!isPending && (
          <Save className="mr-2 h-4 w-4" />
        )}
        Salvar Configurações
      </Button>
    </div>
  );
}
