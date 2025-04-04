
import React from "react";
import { Button } from "@/components/ui/button";

interface MediaLibraryFooterProps {
  onClose: () => void;
}

export function MediaLibraryFooter({ onClose }: MediaLibraryFooterProps) {
  return (
    <div className="flex justify-end pt-4 border-t">
      <Button variant="outline" onClick={onClose} className="mr-2">
        Cancelar
      </Button>
    </div>
  );
}
