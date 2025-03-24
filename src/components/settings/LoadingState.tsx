
import React from "react";
import { Loader2 } from "lucide-react";

export function LoadingState() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Loader2 className="w-8 h-8 animate-spin text-primary" />
      <span className="ml-2 text-muted-foreground">Carregando configurações...</span>
    </div>
  );
}
