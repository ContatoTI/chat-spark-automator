
import React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { UseFormReturn } from "react-hook-form";
import { SettingsFormValues } from "@/lib/validations/settings";
import { Database, Save } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface FtpSettingsProps {
  form: UseFormReturn<SettingsFormValues>;
  onSaveField?: (fieldName: string) => Promise<void>;
  lastUpdatedField?: string | null;
}

export function FtpSettings({ form, onSaveField, lastUpdatedField }: FtpSettingsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5" />
          Configurações FTP
        </CardTitle>
        <CardDescription>
          Configure as credenciais para acesso ao servidor FTP
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="ftp_url"
            render={({ field }) => (
              <FormItem className={cn(
                "transition-all duration-300",
                lastUpdatedField === "ftp_url" && "bg-green-50 dark:bg-green-950/20 p-2 rounded-md"
              )}>
                <FormLabel>URL do Servidor FTP</FormLabel>
                <div className="flex gap-2">
                  <FormControl>
                    <Input {...field} placeholder="ftp.example.com" />
                  </FormControl>
                  {onSaveField && (
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => onSaveField("ftp_url")}
                    >
                      <Save className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                <FormDescription>
                  URL do servidor FTP para armazenamento de arquivos
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="ftp_port"
            render={({ field }) => (
              <FormItem className={cn(
                "transition-all duration-300",
                lastUpdatedField === "ftp_port" && "bg-green-50 dark:bg-green-950/20 p-2 rounded-md"
              )}>
                <FormLabel>Porta FTP</FormLabel>
                <div className="flex gap-2">
                  <FormControl>
                    <Input 
                      {...field} 
                      type="number" 
                      placeholder="21"
                      onChange={e => field.onChange(Number(e.target.value) || 21)}
                    />
                  </FormControl>
                  {onSaveField && (
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => onSaveField("ftp_port")}
                    >
                      <Save className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                <FormDescription>
                  Porta de conexão FTP (padrão: 21)
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="ftp_user"
            render={({ field }) => (
              <FormItem className={cn(
                "transition-all duration-300",
                lastUpdatedField === "ftp_user" && "bg-green-50 dark:bg-green-950/20 p-2 rounded-md"
              )}>
                <FormLabel>Usuário FTP</FormLabel>
                <div className="flex gap-2">
                  <FormControl>
                    <Input {...field} placeholder="username" />
                  </FormControl>
                  {onSaveField && (
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => onSaveField("ftp_user")}
                    >
                      <Save className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                <FormDescription>
                  Nome de usuário para autenticação FTP
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="ftp_password"
            render={({ field }) => (
              <FormItem className={cn(
                "transition-all duration-300",
                lastUpdatedField === "ftp_password" && "bg-green-50 dark:bg-green-950/20 p-2 rounded-md"
              )}>
                <FormLabel>Senha FTP</FormLabel>
                <div className="flex gap-2">
                  <FormControl>
                    <Input {...field} type="password" placeholder="••••••••" />
                  </FormControl>
                  {onSaveField && (
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => onSaveField("ftp_password")}
                    >
                      <Save className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                <FormDescription>
                  Senha para autenticação FTP
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
