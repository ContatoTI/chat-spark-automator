
import React, { useEffect, useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Loader2, Save, AlertCircle } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { DisparoOptions, fetchDisparoOptions, updateDisparoOptions } from "@/lib/api/settings";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { settingsSchema } from "@/lib/validations/settings";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const Settings = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { 
    data: settings, 
    isLoading, 
    error 
  } = useQuery({
    queryKey: ['disparo-options'],
    queryFn: fetchDisparoOptions,
  });

  const form = useForm({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      instancia: "",
      ativo: true,
      producao: true,
      limite_disparos: 1000,
      enviados: 0,
      horario_limite: 17,
      long_wait_min: 50,
      long_wait_max: 240,
      shortWaitMin: 5,
      shortWaitMax: 10,
      batchSizeMin: 5,
      batchSizeMax: 10,
      urlAPI: "",
    },
  });

  // Update form when settings are loaded
  useEffect(() => {
    if (settings) {
      form.reset(settings);
    }
  }, [settings, form]);

  const updateSettingsMutation = useMutation({
    mutationFn: updateDisparoOptions,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['disparo-options'] });
      toast({
        title: "Configurações atualizadas",
        description: "As configurações foram salvas com sucesso.",
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Erro ao atualizar configurações",
        description: error instanceof Error ? error.message : "Ocorreu um erro desconhecido",
      });
    },
  });

  const onSubmit = (values: DisparoOptions) => {
    updateSettingsMutation.mutate(values);
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <span className="ml-2 text-muted-foreground">Carregando configurações...</span>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Erro</AlertTitle>
            <AlertDescription>
              {error instanceof Error ? error.message : "Não foi possível carregar as configurações. Tente novamente mais tarde."}
            </AlertDescription>
          </Alert>
          <Button onClick={() => queryClient.invalidateQueries({ queryKey: ['disparo-options'] })}>
            Tentar novamente
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="flex flex-col gap-8">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Configurações</h1>
          <p className="text-muted-foreground mt-1">
            Gerencie as configurações da sua aplicação de disparo de mensagens
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
                    name="urlAPI"
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
                  
                  <FormField
                    control={form.control}
                    name="producao"
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

            <Card>
              <CardHeader>
                <CardTitle>Limites de Disparo</CardTitle>
                <CardDescription>
                  Configure os limites para o envio de mensagens
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                  <FormField
                    control={form.control}
                    name="limite_disparos"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Limite de Disparos</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} onChange={e => field.onChange(Number(e.target.value))} />
                        </FormControl>
                        <FormDescription>
                          Número máximo de mensagens
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="enviados"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Enviados</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} onChange={e => field.onChange(Number(e.target.value))} />
                        </FormControl>
                        <FormDescription>
                          Quantidade já enviada
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="horario_limite"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Horário Limite</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} onChange={e => field.onChange(Number(e.target.value))} />
                        </FormControl>
                        <FormDescription>
                          Hora limite para envios (0-23)
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Configurações de Intervalo</CardTitle>
                <CardDescription>
                  Configurações dos intervalos de tempo entre os envios
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                  <FormField
                    control={form.control}
                    name="long_wait_min"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Espera longa (mín)</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} onChange={e => field.onChange(Number(e.target.value))} />
                        </FormControl>
                        <FormDescription>
                          Em segundos
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="long_wait_max"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Espera longa (máx)</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} onChange={e => field.onChange(Number(e.target.value))} />
                        </FormControl>
                        <FormDescription>
                          Em segundos
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="shortWaitMin"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Espera curta (mín)</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} onChange={e => field.onChange(Number(e.target.value))} />
                        </FormControl>
                        <FormDescription>
                          Em segundos
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="shortWaitMax"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Espera curta (máx)</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} onChange={e => field.onChange(Number(e.target.value))} />
                        </FormControl>
                        <FormDescription>
                          Em segundos
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Configurações de Lote</CardTitle>
                <CardDescription>
                  Configurações de tamanho dos lotes de mensagens
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="batchSizeMin"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tamanho do lote (mín)</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} onChange={e => field.onChange(Number(e.target.value))} />
                        </FormControl>
                        <FormDescription>
                          Mínimo de mensagens por lote
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="batchSizeMax"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tamanho do lote (máx)</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} onChange={e => field.onChange(Number(e.target.value))} />
                        </FormControl>
                        <FormDescription>
                          Máximo de mensagens por lote
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end">
              <Button 
                type="submit" 
                disabled={updateSettingsMutation.isPending}
                className="w-full sm:w-auto"
              >
                {updateSettingsMutation.isPending && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {!updateSettingsMutation.isPending && (
                  <Save className="mr-2 h-4 w-4" />
                )}
                Salvar Configurações
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </Layout>
  );
};

export default Settings;
