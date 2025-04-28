
import React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { Contact } from "@/hooks/useContacts";

interface DeleteContactDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  contact: Contact | null;
  companyId: string | null;
  onSuccess?: () => void;
}

export function DeleteContactDialog({
  open,
  onOpenChange,
  contact,
  companyId,
  onSuccess
}: DeleteContactDialogProps) {
  const [isDeleting, setIsDeleting] = React.useState(false);

  const handleDelete = async () => {
    if (!contact || !companyId) {
      onOpenChange(false);
      return;
    }

    setIsDeleting(true);
    try {
      const { error } = await supabase
        .from(`appw_lista_${companyId}`)
        .delete()
        .eq("id", contact.id);

      if (error) throw error;

      toast.success("Contato excluído com sucesso");
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error("Erro ao excluir contato:", error);
      toast.error("Erro ao excluir contato", {
        description: error instanceof Error ? error.message : "Erro desconhecido"
      });
    } finally {
      setIsDeleting(false);
      onOpenChange(false);
    }
  };

  if (!contact) return null;

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Excluir Contato</AlertDialogTitle>
          <AlertDialogDescription>
            Tem certeza que deseja excluir o contato "{contact?.Nome}"? Esta ação não pode ser desfeita.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Cancelar</AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button 
              variant="destructive" 
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Excluindo...
                </>
              ) : (
                "Excluir"
              )}
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
