
import React, { useEffect } from "react";
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { UseFormReturn } from "react-hook-form";
import { DisparoOptions } from "@/lib/api/settings";

interface GeneralSettingsProps {
  form: UseFormReturn<DisparoOptions>;
}

export function GeneralSettings({ form }: GeneralSettingsProps) {
  // Log the API key value for debugging
  useEffect(() => {
    const apiKeyValue = form.getValues().apikey;
    console.log("API Key no formulário:", apiKeyValue);
  }, [form]);
  
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
                  <Input {...field} value={field.value || ''} />
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
            name="urlAPI"
            render={({ field }) => (
              <FormItem>
                <FormLabel>URL da API</FormLabel>
                <FormControl>
                  <Input {...field} value={field.value || ''} />
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
                  <Input 
                    {...field} 
                    type="password" 
                    value={field.value || ''} 
                  />
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
                <FormControl>
                  <Input {...field} value={field.value || ''} />
                </FormControl>
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
                <FormControl>
                  <Input {...field} value={field.value || ''} />
                </FormControl>
                <FormDescription>
                  URL do webhook para sincronização de contatos
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          <FormField
            control={form.control}
            name="Ativo"
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
          
          <FormField
            control={form.control}
            name="Producao"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Modo Produção</FormLabel>
                  <FormDescription>
                    Ativa o modo de produção
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
