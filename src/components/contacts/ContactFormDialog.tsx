
import React, { useEffect } from "react";
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

const formSchema = z.object({
  Nome: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  Numero: z.string().min(8, "Número deve ter pelo menos 8 caracteres"),
  Nome_Real: z.string().optional(),
  tag: z.array(z.string()).optional()
});

type FormValues = z.infer<typeof formSchema>;

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
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      Nome: "",
      Numero: "",
      Nome_Real: "",
      tag: []
    }
  });
  
  useEffect(() => {
    if (contact) {
      let tags = [];
      if (contact.tag) {
        tags = Array.isArray(contact.tag) ? contact.tag : JSON.parse(contact.tag);
      }
      
      form.reset({
        Nome: contact.Nome || "",
        Numero: contact.Numero || "",
        Nome_Real: contact.Nome_Real || "",
        tag: tags
      });
    } else {
      form.reset({
        Nome: "",
        Numero: "",
        Nome_Real: "",
        tag: []
      });
    }
  }, [contact, form]);

  const onSubmit = async (values: FormValues) => {
    if (!companyId) {
      toast.error("Empresa não identificada");
      return;
    }

    try {
      if (isEditing && contact) {
        // Update existing contact
        const { error } = await supabase
          .from(`appw_lista_${companyId}`)
          .update({
            Nome: values.Nome,
            Numero: values.Numero,
            Nome_Real: values.Nome_Real || null,
            tag: values.tag || []
          })
          .eq("id", contact.id);

        if (error) throw error;
        toast.success("Contato atualizado com sucesso");
      } else {
        // Add new contact
        const { error } = await supabase
          .from(`appw_lista_${companyId}`)
          .insert({
            Nome: values.Nome,
            Numero: values.Numero,
            Nome_Real: values.Nome_Real || null,
            Enviado: false,
            tag: values.tag || []
          });

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
      </DialogContent>
    </Dialog>
  );
}
