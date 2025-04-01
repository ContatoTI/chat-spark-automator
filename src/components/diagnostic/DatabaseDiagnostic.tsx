
import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RefreshCw, Check, X, AlertCircle } from 'lucide-react';
import { verifyDatabaseCompatibility } from '@/lib/checkDatabaseCompatibility';
import { supabase } from '@/lib/supabase';

export const DatabaseDiagnostic = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [supabaseInfo, setSupabaseInfo] = useState({
    url: '',
    version: '',
    connected: false
  });

  const runDiagnostic = async () => {
    setIsLoading(true);
    try {
      const compatibility = await verifyDatabaseCompatibility();
      setResults(compatibility);
      
      // Verificar a URL e status de conexão
      setSupabaseInfo({
        url: supabase.getUrl(),
        version: 'v2',
        connected: Object.values(compatibility.tablesExist).some(value => value)
      });
    } catch (error) {
      console.error("Erro ao executar diagnóstico:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    runDiagnostic();
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Diagnóstico da Base de Dados</CardTitle>
        <CardDescription>
          Verificação da compatibilidade do Supabase com a aplicação
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Status do Supabase</h3>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={runDiagnostic}
              disabled={isLoading}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              {isLoading ? 'Verificando...' : 'Verificar novamente'}
            </Button>
          </div>
          
          <div className="grid gap-4 mb-6">
            <div className="flex items-center justify-between p-3 bg-slate-100 dark:bg-slate-800 rounded-md">
              <span className="font-medium">URL:</span>
              <span>{supabaseInfo.url}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-slate-100 dark:bg-slate-800 rounded-md">
              <span className="font-medium">Versão da API:</span>
              <span>{supabaseInfo.version}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-slate-100 dark:bg-slate-800 rounded-md">
              <span className="font-medium">Status de conexão:</span>
              <div className="flex items-center">
                {supabaseInfo.connected ? (
                  <>
                    <Check className="h-4 w-4 text-green-500 mr-1" />
                    <span className="text-green-500">Conectado</span>
                  </>
                ) : (
                  <>
                    <X className="h-4 w-4 text-red-500 mr-1" />
                    <span className="text-red-500">Desconectado</span>
                  </>
                )}
              </div>
            </div>
          </div>

          {results && (
            <>
              <h3 className="text-lg font-medium mb-3">Tabelas</h3>
              <div className="grid gap-2 mb-6">
                {Object.entries(results.tablesExist).map(([table, exists]) => (
                  <div 
                    key={table} 
                    className="flex items-center justify-between p-2 bg-slate-100 dark:bg-slate-800 rounded-md"
                  >
                    <span>{table}</span>
                    {exists ? (
                      <Check className="h-4 w-4 text-green-500" />
                    ) : (
                      <AlertCircle className="h-4 w-4 text-amber-500" />
                    )}
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
