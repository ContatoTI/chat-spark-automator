
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { PlusCircle, Loader, RefreshCw } from "lucide-react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormField, FormItem, FormControl, FormMessage } from "@/components/ui/form";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, CheckCircle } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

// Define the schema to ensure nome_instancia is required
const formSchema = z.object({
  nome_instancia: z.string().min(3, {
    message: "O nome da instância deve ter pelo menos 3 caracteres"
  })
});

// Define the type from the schema
type FormValues = z.infer<typeof formSchema>;

interface WhatsAccountsHeaderProps {
  onCreate: (data: { nome_instancia: string }) => Promise<void>;
  onRefreshStatus: () => Promise<void>;
  isCreating: boolean;
  isRefreshing: boolean;
}

export function WhatsAccountsHeader({ 
  onCreate, 
  onRefreshStatus, 
  isCreating, 
  isRefreshing 
}: WhatsAccountsHeaderProps) {
  const [open, setOpen] = useState(false);
  const [webhookStatus, setWebhookStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [webhookMessage, setWebhookMessage] = useState('');
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nome_instancia: ""
    }
  });

  const handleSubmit = async (data: FormValues) => {
    try {
      setWebhookStatus('idle');
      setWebhookMessage('');
      
      // Here we ensure data has a required nome_instancia field
      await onCreate({
        nome_instancia: data.nome_instancia
      });
      
      setWebhookStatus('success');
      setWebhookMessage('Instância criada com sucesso!');
      
      // Não fechamos o diálogo automaticamente para que o usuário veja a mensagem de sucesso
    } catch (error) {
      console.error("Erro ao criar conta:", error);
      setWebhookStatus('error');
      setWebhookMessage(error instanceof Error ? error.message : 'Erro desconhecido ao criar instância');
    }
  };

  const handleCloseDialog = () => {
    setOpen(false);
    setWebhookStatus('idle');
    setWebhookMessage('');
    form.reset();
  };

  const handleRefreshStatus = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    try {
      await onRefreshStatus();
    } catch (error) {
      console.error("Erro ao atualizar status:", error);
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
      
      <div className="flex gap-2 w-full md:w-auto">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="outline" 
                onClick={handleRefreshStatus} 
                disabled={isRefreshing}
                className="flex-1 md:flex-none"
              >
                {isRefreshing ? (
                  <Loader className="h-4 w-4 animate-spin" />
                ) : (
                  <RefreshCw className="h-4 w-4" />
                )}
                <span className="ml-2 md:inline">Atualizar Status</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Atualizar status de todas as instâncias</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <Button 
          className="flex-1 md:flex-none" 
          onClick={() => setOpen(true)}
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Nova Conta
        </Button>
      </div>

      <Dialog open={open} onOpenChange={handleCloseDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nova Conta WhatsApp</DialogTitle>
            <DialogDescription>
              Adicione uma nova conta de WhatsApp para disparos
            </DialogDescription>
          </DialogHeader>
          
          {webhookStatus === 'success' && (
            <Alert className="bg-green-50 border-green-500 text-green-800 mb-4">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertTitle>Sucesso!</AlertTitle>
              <AlertDescription>{webhookMessage}</AlertDescription>
            </Alert>
          )}
          
          {webhookStatus === 'error' && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Erro!</AlertTitle>
              <AlertDescription>{webhookMessage}</AlertDescription>
            </Alert>
          )}
          
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
                        disabled={isCreating}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                {webhookStatus === 'success' ? (
                  <Button type="button" onClick={handleCloseDialog}>
                    Fechar
                  </Button>
                ) : (
                  <>
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={handleCloseDialog}
                      disabled={isCreating}
                    >
                      Cancelar
                    </Button>
                    <Button type="submit" disabled={isCreating}>
                      {isCreating ? (
                        <>
                          <Loader className="mr-2 h-4 w-4 animate-spin" />
                          Criando...
                        </>
                      ) : "Criar Conta"}
                    </Button>
                  </>
                )}
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
