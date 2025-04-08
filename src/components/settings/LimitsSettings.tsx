import React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { UseFormReturn } from "react-hook-form";
import { SettingsFormValues } from "@/lib/validations/settings";

interface LimitsSettingsProps {
  form: UseFormReturn<SettingsFormValues>;
}

export function LimitsSettings({ form }: LimitsSettingsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Limites de Disparo</CardTitle>
        <CardDescription>
          Configure os limites para o envio de mensagens
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 gap-6">
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
  );
}
