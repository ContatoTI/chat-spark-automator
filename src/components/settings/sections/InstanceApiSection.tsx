
import React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { SettingsFormValues } from "@/lib/validations/settings";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";

interface InstanceApiSectionProps {
  form: UseFormReturn<SettingsFormValues>;
  onSaveField?: (fieldName: string) => Promise<void>;
  lastUpdatedField?: string | null;
}

export function InstanceApiSection({ form, onSaveField, lastUpdatedField }: InstanceApiSectionProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-md font-medium">API e Instância</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={form.control}
          name="url_api"
          render={({ field }) => (
            <FormItem className={cn(
              "transition-all duration-300",
              lastUpdatedField === "url_api" && "bg-green-50 dark:bg-green-950/20 p-2 rounded-md"
            )}>
              <FormLabel>URL da API</FormLabel>
              <div className="flex gap-2">
                <FormControl>
                  <Input {...field} placeholder="https://api.example.com" />
                </FormControl>
                {onSaveField && (
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => onSaveField("url_api")}
                  >
                    <Save className="h-4 w-4" />
                  </Button>
                )}
              </div>
              <FormDescription>
                URL base da API para integração
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="apikey"
          render={({ field }) => (
            <FormItem className={cn(
              "transition-all duration-300",
              lastUpdatedField === "apikey" && "bg-green-50 dark:bg-green-950/20 p-2 rounded-md"
            )}>
              <FormLabel>Chave de API</FormLabel>
              <div className="flex gap-2">
                <FormControl>
                  <Input {...field} placeholder="Sua chave de API" />
                </FormControl>
                {onSaveField && (
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => onSaveField("apikey")}
                  >
                    <Save className="h-4 w-4" />
                  </Button>
                )}
              </div>
              <FormDescription>
                Chave de autenticação para a API
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}
