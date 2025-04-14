
import React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { SettingsFormValues } from "@/lib/validations/settings";
import { TestWebhookButton } from "../TestWebhookButton";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, Webhook } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface InstanceWebhookSectionProps {
  form: UseFormReturn<SettingsFormValues>;
}

export function InstanceWebhookSection({ form }: InstanceWebhookSectionProps) {
  // Quando o webhook for testado com sucesso, salve no localStorage
  const saveWebhookToLocalStorage = (url: string) => {
    if (url && url.trim() !== '') {
      localStorage.setItem('webhook_instancias', url);
      console.log('Webhook de instâncias salvo no localStorage:', url);
    }
  };

  // Pegar o valor atual do form
  const currentWebhookUrl = form.watch('webhook_instancias');
  
  // Salvar no localStorage sempre que o valor mudar
  React.useEffect(() => {
    saveWebhookToLocalStorage(currentWebhookUrl);
  }, [currentWebhookUrl]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Webhook className="h-5 w-5" />
          Webhook de Instâncias
        </CardTitle>
        <CardDescription>
          Configure o webhook para gerenciamento de instâncias do WhatsApp
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Alert variant="default" className="bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800">
          <AlertCircle className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          <AlertTitle>Sobre os webhooks de instâncias</AlertTitle>
          <AlertDescription className="text-sm mt-1">
            Este webhook é essencial para o funcionamento das instâncias de WhatsApp.
            Ele deve apontar para um endpoint que suporte operações de conexão, status e gestão de instâncias.
          </AlertDescription>
        </Alert>

        <FormField
          control={form.control}
          name="webhook_instancias"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Webhook de Instâncias WhatsApp</FormLabel>
              <div className="flex gap-2">
                <FormControl className="flex-1">
                  <Input 
                    {...field} 
                    placeholder="https://seu-servidor-webhook.com/whatsapp/instancias"
                    onChange={(e) => {
                      field.onChange(e);
                      // Imediatamente salvar no localStorage ao digitar
                      saveWebhookToLocalStorage(e.target.value);
                    }}
                  />
                </FormControl>
                <TestWebhookButton 
                  url={field.value} 
                  onSuccessCallback={() => saveWebhookToLocalStorage(field.value)}
                />
              </div>
              <FormDescription>
                URL do webhook para gerenciar instâncias de WhatsApp (conexão, status, QR code)
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  );
}
