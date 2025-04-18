
import { useState } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogDescription
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";

interface NewInstanceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: { nome_instancia: string }) => Promise<void>;
}

export function NewInstanceDialog({ open, onOpenChange, onSubmit }: NewInstanceDialogProps) {
  const [instanceName, setInstanceName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { selectedCompany } = useAuth();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!instanceName.trim()) return;
    
    setIsSubmitting(true);
    try {
      await onSubmit({ nome_instancia: instanceName });
      setInstanceName("");
      onOpenChange(false);
    } catch (error) {
      console.error("Error creating instance:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Nova Instância WhatsApp</DialogTitle>
          <DialogDescription>
            Crie uma nova instância do WhatsApp para esta empresa.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="instance-name">Nome da Instância</Label>
              <Input
                id="instance-name"
                value={instanceName}
                onChange={(e) => setInstanceName(e.target.value)}
                placeholder="Digite o nome da instância"
                required
              />
            </div>
            {selectedCompany && (
              <div className="text-sm text-muted-foreground">
                Esta instância será associada à empresa: {selectedCompany}
              </div>
            )}
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting || !instanceName.trim()}>
              {isSubmitting ? "Criando..." : "Criar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
