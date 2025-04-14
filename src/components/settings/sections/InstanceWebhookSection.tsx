
import React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { SettingsFormValues } from "@/lib/validations/settings";
import { TestWebhookButton } from "../TestWebhookButton";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface InstanceWebhookSectionProps {
  form: UseFormReturn<SettingsFormValues>;
}

export function InstanceWebhookSection({ form }: InstanceWebhookSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Webhook de Instâncias</CardTitle>
        <CardDescription>
          Configure o webhook para gerenciamento de instâncias do WhatsApp
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Alert variant="info" className="bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800">
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
                  <Input {...field} placeholder="https://seu-servidor-webhook.com/whatsapp/instancias" />
                </FormControl>
                <TestWebhookButton url={field.value} />
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
