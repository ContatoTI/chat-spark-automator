
import React, { useEffect, useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { Contact } from "@/hooks/useContacts";

// Define dynamic form schema based on available columns
const createFormSchema = (hasNomeReal: boolean) => {
  const baseSchema = {
    Nome: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
    Numero: z.string().min(8, "Número deve ter pelo menos 8 caracteres"),
    tag: z.array(z.string()).optional()
  };
  
  // Only add Nome_Real to schema if the column exists
  if (hasNomeReal) {
    return z.object({
      ...baseSchema,
      Nome_Real: z.string().optional(),
    });
  }
  
  return z.object(baseSchema);
};

interface ContactFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
  contact?: Contact;
  companyId: string | null;
  isLoading?: boolean;
}

export function ContactFormDialog({
  open,
  onOpenChange,
  onSuccess,
  contact,
  companyId,
  isLoading = false
}: ContactFormDialogProps) {
  const isEditing = !!contact;
  const [hasNomeRealColumn, setHasNomeRealColumn] = useState(true);
  const [checkingSchema, setCheckingSchema] = useState(true);
  
  // Create form with dynamic schema
  const form = useForm<any>({
    resolver: zodResolver(createFormSchema(hasNomeRealColumn)),
    defaultValues: {
      Nome: "",
      Numero: "",
      Nome_Real: "",
      tag: []
    }
  });
  
  // Check if Nome_Real column exists
  useEffect(() => {
    if (companyId && open) {
      setCheckingSchema(true);
      
      // Check if the column exists by trying to get information about the table
      const checkColumnExists = async () => {
        try {
          const { data, error } = await supabase
            .rpc('check_column_exists', { 
              table_name: `appw_lista_${companyId}`, 
              column_name: 'Nome_Real' 
            });
            
          if (error) {
            console.log("Error checking column:", error);
            // If we can't check, assume the column doesn't exist
            setHasNomeRealColumn(false);
          } else {
            const exists = data === true;
            setHasNomeRealColumn(exists);
            console.log(`Column Nome_Real exists: ${exists}`);
          }
        } catch (e) {
          console.error("Failed to check column existence:", e);
          // Fall back to simpler check
          fallbackColumnCheck();
        } finally {
          setCheckingSchema(false);
        }
      };
      
      // Fallback check by attempting a simple query
      const fallbackColumnCheck = async () => {
        try {
          // Try to select the column to see if it exists
          const { error } = await supabase
            .from(`appw_lista_${companyId}`)
            .select('Nome_Real')
            .limit(1);
            
          // If there's an error that mentions the column doesn't exist
          setHasNomeRealColumn(!error || !error.message.includes("Nome_Real"));
          console.log("Fallback check result:", !error || !error.message.includes("Nome_Real"));
        } catch (e) {
          console.error("Fallback check failed:", e);
          // Default to not including the column to be safe
          setHasNomeRealColumn(false);
        } finally {
          setCheckingSchema(false);
        }
      };
      
      checkColumnExists();
    }
  }, [companyId, open]);
  
  // Update form when contact or hasNomeRealColumn changes
  useEffect(() => {
    if (contact && !checkingSchema) {
      let tags = [];
      if (contact.tag) {
        tags = Array.isArray(contact.tag) ? contact.tag : JSON.parse(contact.tag);
      }
      
      const formValues: any = {
        Nome: contact.Nome || "",
        Numero: contact.Numero || "",
        tag: tags
      };
      
      // Only include Nome_Real if the column exists
      if (hasNomeRealColumn) {
        formValues.Nome_Real = contact.Nome_Real || "";
      }
      
      form.reset(formValues);
    } else if (!contact && !checkingSchema) {
      const formValues: any = {
        Nome: "",
        Numero: "",
        tag: []
      };
      
      if (hasNomeRealColumn) {
        formValues.Nome_Real = "";
      }
      
      form.reset(formValues);
    }
  }, [contact, form, hasNomeRealColumn, checkingSchema]);

  const onSubmit = async (values: any) => {
    if (!companyId) {
      toast.error("Empresa não identificada");
      return;
    }

    try {
      // Prepare contact data based on available columns
      const contactData: any = {
        Nome: values.Nome,
        Numero: values.Numero,
        tag: values.tag || []
      };
      
      // Only include Nome_Real if the column exists
      if (hasNomeRealColumn) {
        contactData.Nome_Real = values.Nome_Real || null;
      }
      
      if (isEditing && contact) {
        // Update existing contact
        const { error } = await supabase
          .from(`appw_lista_${companyId}`)
          .update(contactData)
          .eq("id", contact.id);

        if (error) throw error;
        toast.success("Contato atualizado com sucesso");
      } else {
        // Add new contact
        // Always include Enviado field for new contacts
        contactData.Enviado = false;
        
        const { error } = await supabase
          .from(`appw_lista_${companyId}`)
          .insert(contactData);

        if (error) throw error;
        toast.success("Contato adicionado com sucesso");
      }

      // Reset form and close dialog
      form.reset();
      onOpenChange(false);
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error("Erro ao salvar contato:", error);
      toast.error("Erro ao salvar contato", {
        description: error instanceof Error ? error.message : "Erro desconhecido"
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Editar Contato" : "Novo Contato"}</DialogTitle>
        </DialogHeader>
        
        {checkingSchema ? (
          <div className="py-8 flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2">Verificando estrutura da tabela...</span>
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="Nome"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome</FormLabel>
                    <FormControl>
                      <Input placeholder="Nome do contato" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="Numero"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Número</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Número de telefone" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {hasNomeRealColumn && (
                <FormField
                  control={form.control}
                  name="Nome_Real"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome Real (opcional)</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Nome real do contato" 
                          {...field} 
                          value={field.value || ""} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              
              <DialogFooter>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => onOpenChange(false)}
                >
                  Cancelar
                </Button>
                <Button 
                  type="submit" 
                  disabled={isLoading || form.formState.isSubmitting}
                >
                  {(isLoading || form.formState.isSubmitting) && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  {isEditing ? "Atualizar" : "Adicionar"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
}
