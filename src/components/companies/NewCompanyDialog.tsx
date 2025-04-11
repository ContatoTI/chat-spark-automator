
import React, { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createCompany } from "@/lib/api/companies";
import { toast } from "sonner";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

interface NewCompanyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCompanyCreated: () => void;
}

const formSchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  id: z.string().min(3, "ID deve ter pelo menos 3 caracteres")
    .refine(val => /^[a-z0-9]+$/.test(val), {
      message: "ID deve conter apenas letras minúsculas e números, sem espaços"
    })
});

export const NewCompanyDialog: React.FC<NewCompanyDialogProps> = ({ 
  open, 
  onOpenChange,
  onCompanyCreated 
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      id: ''
    }
  });

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    try {
      await createCompany(values.name, values.id);
      toast.success('Empresa criada com sucesso');
      onCompanyCreated();
      onOpenChange(false);
      form.reset();
    } catch (error) {
      console.error('Erro ao criar empresa:', error);
      toast.error('Erro ao criar empresa', { 
        description: error instanceof Error ? error.message : 'Tente novamente mais tarde'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(open) => {
      if (!open) form.reset();
      onOpenChange(open);
    }}>
      <DialogContent className="sm:max-w-[425px]">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)}>
            <DialogHeader>
              <DialogTitle>Nova Empresa</DialogTitle>
              <DialogDescription>
                Adicione uma nova empresa ao sistema.
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome da Empresa</FormLabel>
                    <FormControl>
                      <Input placeholder="Nome da empresa" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>ID da Empresa</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="id-da-empresa" 
                        {...field} 
                        onChange={(e) => {
                          // Convert to lowercase
                          field.onChange(e.target.value.toLowerCase());
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                    <p className="text-xs text-muted-foreground mt-1">
                      Apenas letras minúsculas e números, sem espaços
                    </p>
                  </FormItem>
                )}
              />
            </div>
            
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <span className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-current border-t-transparent"></span>
                    Salvando...
                  </>
                ) : 'Criar Empresa'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
