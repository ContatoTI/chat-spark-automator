
import React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { UseFormReturn } from "react-hook-form";
import { DisparoOptions } from "@/lib/api/settings";
import { FolderCheck, Lock } from "lucide-react";

interface FtpSettingsProps {
  form: UseFormReturn<DisparoOptions>;
}

export function FtpSettings({ form }: FtpSettingsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FolderCheck className="h-5 w-5" />
          Configurações FTP
        </CardTitle>
        <CardDescription>
          Configure a conexão FTP para a biblioteca de mídia
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="ftp_url"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Servidor FTP</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Ex: ftp.exemplo.com.br" />
                </FormControl>
                <FormDescription>
                  Endereço do servidor FTP
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="ftp_port"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Porta FTP</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                    placeholder="21"
                  />
                </FormControl>
                <FormDescription>
                  Porta de conexão do servidor FTP (geralmente 21)
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="ftp_user"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Usuário FTP</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Ex: usuario@exemplo.com.br" />
                </FormControl>
                <FormDescription>
                  Nome de usuário para autenticação no FTP
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="ftp_password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-1">
                  <Lock className="h-4 w-4" />
                  Senha FTP
                </FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    {...field}
                    placeholder="••••••••••••"
                  />
                </FormControl>
                <FormDescription>
                  Senha para autenticação no FTP
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
