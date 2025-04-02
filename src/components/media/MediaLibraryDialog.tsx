
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { MediaLibrary } from "./MediaLibrary";
import { MediaFile } from "@/lib/api/mediaLibrary";

interface MediaLibraryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (mediaFile: MediaFile) => void;
  currentType: 'image' | 'video' | 'document';
}

export function MediaLibraryDialog({
  open,
  onOpenChange,
  onSelect,
  currentType,
}: MediaLibraryDialogProps) {
  const handleSelect = (mediaFile: MediaFile) => {
    onSelect(mediaFile);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Biblioteca de Mídia</DialogTitle>
        </DialogHeader>
        <MediaLibrary
          onSelect={handleSelect}
          onClose={() => onOpenChange(false)}
          currentType={currentType}
        />
      </DialogContent>
    </Dialog>
  );
}
