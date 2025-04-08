import React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { UseFormReturn } from "react-hook-form";
import { SettingsFormValues } from "@/lib/validations/settings";

interface IntervalSettingsProps {
  form: UseFormReturn<SettingsFormValues>;
}

export function IntervalSettings({ form }: IntervalSettingsProps) {
  return (
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
            name="ShortWaitMin"
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
            name="ShortWaitMax"
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
  );
}
