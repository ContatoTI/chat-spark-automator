
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Wifi, WifiOff, QrCode } from "lucide-react";

interface StatusBadgeProps {
  status: string | null | undefined;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  if (!status) return null;
  
  // Normalizar o status para minúsculas para comparação
  const normalizedStatus = status.toLowerCase();
  
  const getStatusIcon = () => {
    switch (normalizedStatus) {
      case "open":
        return <Wifi className="h-4 w-4" />;
      case "close":
        return <WifiOff className="h-4 w-4" />;
      case "connecting":
        return <QrCode className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const getStatusBadgeVariant = () => {
    switch (normalizedStatus) {
      case "open":
        return "success";
      case "close":
        return "destructive";
      case "connecting":
        return "warning";
      default:
        return "secondary";
    }
  };

  const getStatusLabel = () => {
    switch (normalizedStatus) {
      case "open":
        return "Conectado";
      case "close":
        return "Desconectado";
      case "connecting":
        return "QR Code";
      default:
        return status;
    }
  };

  return (
    <Badge 
      variant={getStatusBadgeVariant() as any}
      className="flex items-center gap-1 w-fit"
    >
      {getStatusIcon()}
      <span>{getStatusLabel()}</span>
    </Badge>
  );
}
