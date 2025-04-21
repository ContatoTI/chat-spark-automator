
import React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { SettingsFormValues } from "@/lib/validations/settings";
import { TestWebhookButton } from "../TestWebhookButton";

interface WebhookSectionProps {
  form: UseFormReturn<SettingsFormValues>;
}

export function WebhookSection({ form }: WebhookSectionProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={form.control}
          name="webhook_disparo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Webhook Principal</FormLabel>
              <div className="flex gap-2">
                <FormControl className="flex-1">
                  <Input {...field} />
                </FormControl>
                <TestWebhookButton url={field.value} />
              </div>
              <FormDescription>
                URL do webhook principal para disparos e outras funcionalidades
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
            <FormItem>
              <FormLabel>Webhook Biblioteca de Mídia</FormLabel>
              <div className="flex gap-2">
                <FormControl className="flex-1">
                  <Input {...field} />
                </FormControl>
                <TestWebhookButton url={field.value} />
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
            <FormItem>
              <FormLabel>Webhook para Upload</FormLabel>
              <div className="flex gap-2">
                <FormControl className="flex-1">
                  <Input {...field} />
                </FormControl>
                <TestWebhookButton url={field.value} />
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
