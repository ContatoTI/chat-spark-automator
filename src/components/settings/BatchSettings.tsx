
import React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { UseFormReturn } from "react-hook-form";
import { DisparoOptions } from "@/lib/api/settings";

interface BatchSettingsProps {
  form: UseFormReturn<DisparoOptions>;
}

export function BatchSettings({ form }: BatchSettingsProps) {
  return (
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
            name="BatchSizeMim"
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
            name="BatchSizeMax"
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
  );
}
