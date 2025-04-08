
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormField, FormItem, FormControl, FormMessage } from "@/components/ui/form";

const formSchema = z.object({
  nome_instancia: z.string().min(3, {
    message: "O nome da instância deve ter pelo menos 3 caracteres"
  })
});

type FormValues = z.infer<typeof formSchema>;

interface WhatsAccountsHeaderProps {
  onCreate: (data: { nome_instancia: string }) => Promise<void>;
  isCreating: boolean;
}

export function WhatsAccountsHeader({ onCreate, isCreating }: WhatsAccountsHeaderProps) {
  const [open, setOpen] = useState(false);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nome_instancia: ""
    }
  });

  const handleSubmit = async (data: FormValues) => {
    try {
      // Since FormValues now guarantees nome_instancia is a string (not optional),
      // this will always pass the correct type to onCreate
      await onCreate(data);
      setOpen(false);
      form.reset();
    } catch (error) {
      console.error("Erro ao criar conta:", error);
    }
  };

  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Contas WhatsApp</h1>
        <p className="text-muted-foreground mt-1">
          Gerencie suas contas de WhatsApp para disparos
        </p>
      </div>
      <Button 
        className="w-full md:w-auto" 
        onClick={() => setOpen(true)}
      >
        <PlusCircle className="mr-2 h-4 w-4" />
        Nova Conta
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nova Conta WhatsApp</DialogTitle>
            <DialogDescription>
              Adicione uma nova conta de WhatsApp para disparos
            </DialogDescription>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="nome_instancia"
                render={({ field }) => (
                  <FormItem>
                    <Label htmlFor="nome_instancia">Nome da Instância</Label>
                    <FormControl>
                      <Input 
                        id="nome_instancia" 
                        placeholder="Ex: Marketing, Vendas, Suporte" 
                        {...field} 
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
                  onClick={() => setOpen(false)}
                >
                  Cancelar
                </Button>
                <Button type="submit" disabled={isCreating}>
                  {isCreating ? "Criando..." : "Criar Conta"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
