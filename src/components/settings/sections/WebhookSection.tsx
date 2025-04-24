
import React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { SettingsFormValues } from "@/lib/validations/settings";
import { TestWebhookButton } from "../TestWebhookButton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Save } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface WebhookSectionProps {
  form: UseFormReturn<SettingsFormValues>;
  onSaveField?: (fieldName: string) => Promise<void>;
  lastUpdatedField?: string | null;
}

export function WebhookSection({ form, onSaveField, lastUpdatedField }: WebhookSectionProps) {
  // Salvar no localStorage quando o webhook for testado com sucesso
  const saveWebhookToLocalStorage = (url: string) => {
    if (url && url.trim() !== '') {
      localStorage.setItem('webhook_disparo', url);
      console.log('[WebhookSection] Webhook principal salvo no localStorage:', url);
    }
  };

  return (
    <div className="space-y-6">
      <Alert variant="default" className="bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800">
        <AlertCircle className="h-4 w-4 text-blue-600 dark:text-blue-400" />
        <AlertTitle>Webhook principal unificado</AlertTitle>
        <AlertDescription className="text-sm mt-1">
          Este webhook é utilizado para todas as funcionalidades do sistema, incluindo:
          <ul className="list-disc ml-5 mt-2 space-y-1">
            <li>Disparos de mensagens</li>
            <li>Gerenciamento de instâncias WhatsApp (conexão, QR code, status)</li>
            <li>Criação e gerenciamento de listas de contatos</li>
            <li>Operações diversas do sistema</li>
          </ul>
        </AlertDescription>
      </Alert>

      <div className="grid grid-cols-1 gap-6">
        <FormField
          control={form.control}
          name="webhook_disparo"
          render={({ field }) => (
            <FormItem className={cn(
              "transition-all duration-300",
              lastUpdatedField === "webhook_disparo" && "bg-green-50 dark:bg-green-950/20 p-2 rounded-md"
            )}>
              <FormLabel>Webhook Principal</FormLabel>
              <div className="flex gap-2">
                <FormControl className="flex-1">
                  <Input 
                    {...field} 
                    placeholder="https://seu-servidor-webhook.com/api/webhook"
                    onChange={(e) => {
                      field.onChange(e);
                      // Imediatamente salvar no localStorage ao digitar
                      saveWebhookToLocalStorage(e.target.value);
                    }}
                  />
                </FormControl>
                <TestWebhookButton 
                  url={field.value} 
                  onSuccessCallback={saveWebhookToLocalStorage}
                />
                {onSaveField && (
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => onSaveField("webhook_disparo")}
                  >
                    <Save className="h-4 w-4" />
                  </Button>
                )}
              </div>
              <FormDescription>
                URL do webhook principal para todas as funcionalidades do sistema
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={form.control}
          name="webhook_get_images"
          render={({ field }) => (
            <FormItem className={cn(
              "transition-all duration-300",
              lastUpdatedField === "webhook_get_images" && "bg-green-50 dark:bg-green-950/20 p-2 rounded-md"
            )}>
              <FormLabel>Webhook Biblioteca de Mídia</FormLabel>
              <div className="flex gap-2">
                <FormControl className="flex-1">
                  <Input {...field} />
                </FormControl>
                <TestWebhookButton url={field.value} />
                {onSaveField && (
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => onSaveField("webhook_get_images")}
                  >
                    <Save className="h-4 w-4" />
                  </Button>
                )}
              </div>
              <FormDescription>
                URL do webhook para buscar arquivos da biblioteca de mídia
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="webhook_up_docs"
          render={({ field }) => (
            <FormItem className={cn(
              "transition-all duration-300",
              lastUpdatedField === "webhook_up_docs" && "bg-green-50 dark:bg-green-950/20 p-2 rounded-md"
            )}>
              <FormLabel>Webhook para Upload</FormLabel>
              <div className="flex gap-2">
                <FormControl className="flex-1">
                  <Input {...field} />
                </FormControl>
                <TestWebhookButton url={field.value} />
                {onSaveField && (
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => onSaveField("webhook_up_docs")}
                  >
                    <Save className="h-4 w-4" />
                  </Button>
                )}
              </div>
              <FormDescription>
                URL do webhook para envio de arquivos da biblioteca de mídia
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}
