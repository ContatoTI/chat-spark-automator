
import React from "react";
import { Button } from "@/components/ui/button";
import { Loader2, Save } from "lucide-react";

interface SaveButtonProps {
  isPending?: boolean;
  isSaving?: boolean;
}

export function SaveButton({ isPending, isSaving }: SaveButtonProps) {
  const isLoading = isPending || isSaving || false;
  
  return (
    <div className="flex justify-end">
      <Button 
        type="submit" 
        disabled={isLoading}
        className="w-full sm:w-auto"
      >
        {isLoading && (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        )}
        {!isLoading && (
          <Save className="mr-2 h-4 w-4" />
        )}
        Salvar Configurações
      </Button>
    </div>
  );
}
