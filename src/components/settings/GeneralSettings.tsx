
import React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { UseFormReturn } from "react-hook-form";
import { SettingsFormValues } from "@/lib/validations/settings";
import { TestWebhookButton } from "./TestWebhookButton";

interface GeneralSettingsProps {
  form: UseFormReturn<SettingsFormValues>;
}

export function GeneralSettings({ form }: GeneralSettingsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Configurações Gerais</CardTitle>
        <CardDescription>
          Configurações gerais para o sistema de disparo de mensagens
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="instancia"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Instância</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormDescription>
                  Nome da instância do WhatsApp
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="url_api"
            render={({ field }) => (
              <FormItem>
                <FormLabel>URL da API</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormDescription>
                  URL da API Evolution
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="apikey"
            render={({ field }) => (
              <FormItem>
                <FormLabel>API Key</FormLabel>
                <FormControl>
                  <Input {...field} type="password" />
                </FormControl>
                <FormDescription>
                  Chave de API para autenticação
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="webhook_disparo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Webhook Disparo</FormLabel>
                <div className="flex gap-2">
                  <FormControl className="flex-1">
                    <Input {...field} />
                  </FormControl>
                  <TestWebhookButton url={field.value} />
                </div>
                <FormDescription>
                  URL do webhook para campanhas de disparo
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="webhook_contatos"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Webhook Contatos</FormLabel>
                <div className="flex gap-2">
                  <FormControl className="flex-1">
                    <Input {...field} />
                  </FormControl>
                  <TestWebhookButton url={field.value} />
                </div>
                <FormDescription>
                  URL do webhook para sincronização de contatos
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
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="webhook_instancias"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Webhook para Criar Instâncias</FormLabel>
                <div className="flex gap-2">
                  <FormControl className="flex-1">
                    <Input {...field} />
                  </FormControl>
                  <TestWebhookButton url={field.value} />
                </div>
                <FormDescription>
                  URL do webhook para criação de instâncias de WhatsApp
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="webhook_del_instancia"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Webhook para Excluir Instâncias</FormLabel>
                <div className="flex gap-2">
                  <FormControl className="flex-1">
                    <Input {...field} />
                  </FormControl>
                  <TestWebhookButton url={field.value} />
                </div>
                <FormDescription>
                  URL do webhook para exclusão de instâncias de WhatsApp
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="webhook_on_qr_instancia"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Webhook para Conectar Instâncias</FormLabel>
                <div className="flex gap-2">
                  <FormControl className="flex-1">
                    <Input {...field} />
                  </FormControl>
                  <TestWebhookButton url={field.value} />
                </div>
                <FormDescription>
                  URL do webhook para conectar instâncias via QR Code
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="webhook_off_instancia"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Webhook para Desconectar Instâncias</FormLabel>
                <div className="flex gap-2">
                  <FormControl className="flex-1">
                    <Input {...field} />
                  </FormControl>
                  <TestWebhookButton url={field.value} />
                </div>
                <FormDescription>
                  URL do webhook para desconectar instâncias de WhatsApp
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          <FormField
            control={form.control}
            name="ativo"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Sistema Ativo</FormLabel>
                  <FormDescription>
                    Ativa ou desativa o sistema de disparo
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
      </CardContent>
    </Card>
  );
}
