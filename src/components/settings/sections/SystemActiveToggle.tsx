
import React from "react";
import { Switch } from "@/components/ui/switch";
import { FormField, FormItem, FormLabel, FormDescription, FormControl, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Save, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface SystemActiveToggleProps {
  form: any;
  onSaveField?: (fieldName: string) => Promise<void>;
  lastUpdatedField?: string | null;
}

export function SystemActiveToggle({ form, onSaveField, lastUpdatedField }: SystemActiveToggleProps) {
  // Get the current value of "ativo" from the form
  const isActive = form.watch("ativo");

  return (
    <Card className={cn(
      "border transition-all duration-300",
      lastUpdatedField === "ativo" && "bg-green-50 dark:bg-green-950/20",
      isActive 
        ? "border-green-200 dark:border-green-800" 
        : "border-red-200 dark:border-red-800"
    )}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <FormField
              control={form.control}
              name="ativo"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between space-y-0">
                  <div className="space-y-1">
                    <FormLabel>Sistema Ativo</FormLabel>
                    <FormDescription>
                      Ative ou desative o sistema de disparos
                    </FormDescription>
                    <FormMessage />
                  </div>
                  <div className="flex items-center space-x-2">
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    {onSaveField && (
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => onSaveField("ativo")}
                      >
                        <Save className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </FormItem>
              )}
            />
          </div>

          <Badge 
            variant="outline" 
            className={cn(
              "ml-3",
              isActive 
                ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" 
                : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
            )}
          >
            {isActive ? (
              <Check className="h-3 w-3 mr-1" />
            ) : (
              <X className="h-3 w-3 mr-1" />
            )}
            {isActive ? "Ativo" : "Inativo"}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}
