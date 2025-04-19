
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Wifi, WifiOff, QrCode } from "lucide-react";

interface StatusBadgeProps {
  status: string | null | undefined;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  if (!status) return null;
  
  const getStatusIcon = () => {
    switch (status.toLowerCase()) {
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
    switch (status.toLowerCase()) {
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

  return (
    <Badge 
      variant={getStatusBadgeVariant() as any}
      className="flex items-center gap-1 w-fit"
    >
      {getStatusIcon()}
      <span>{status}</span>
    </Badge>
  );
}
