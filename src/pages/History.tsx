
import React, { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, FileDown, Calendar, Clock, Users, MessageSquare, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Progress } from "@/components/ui/progress";

interface HistoryItem {
  id: string;
  campaignName: string;
  date: string;
  time: string;
  contacts: number;
  delivered: number;
  read: number;
  failed: number;
}

// Mock data for history
const mockHistoryData: HistoryItem[] = [
  {
    id: "1",
    campaignName: "Promoção de Verão",
    date: "2023-07-15",
    time: "09:30",
    contacts: 578,
    delivered: 562,
    read: 489,
    failed: 16,
  },
  {
    id: "2",
    campaignName: "Atualização do Sistema",
    date: "2023-07-10",
    time: "14:15",
    contacts: 1890,
    delivered: 1852,
    read: 1453,
    failed: 38,
  },
  {
    id: "3",
    campaignName: "Pesquisa de Satisfação",
    date: "2023-06-25",
    time: "11:45",
    contacts: 245,
    delivered: 132,
    read: 98,
    failed: 113,
  },
  {
    id: "4",
    campaignName: "Oferta Black Friday",
    date: "2023-05-20",
    time: "08:00",
    contacts: 3250,
    delivered: 3180,
    read: 2890,
    failed: 70,
  },
  {
    id: "5",
    campaignName: "Aviso de Manutenção",
    date: "2023-05-05",
    time: "16:30",
    contacts: 1750,
    delivered: 1728,
    read: 1542,
    failed: 22,
  },
];

const History = () => {
  const [searchQuery, setSearchQuery] = useState("");
  
  const filteredHistory = searchQuery
    ? mockHistoryData.filter(item => 
        item.campaignName.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : mockHistoryData;

  return (
    <Layout>
      <div className="flex flex-col gap-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">Histórico</h1>
            <p className="text-muted-foreground mt-1">
              Histórico completo de campanhas enviadas
            </p>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <FileDown className="mr-2 h-4 w-4" />
                Exportar
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Formato</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                Excel (.xlsx)
              </DropdownMenuItem>
              <DropdownMenuItem>
                CSV (.csv)
              </DropdownMenuItem>
              <DropdownMenuItem>
                PDF (.pdf)
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="glass-panel px-4 py-3">
          <div className="flex flex-col md:flex-row gap-4 w-full items-center">
            <div className="relative w-full md:max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar no histórico..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex-1 hidden md:flex justify-end">
              <p className="text-sm text-muted-foreground">
                Mostrando {filteredHistory.length} de {mockHistoryData.length} registros
              </p>
            </div>
          </div>
        </div>

        <div className="glass-panel overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-muted/40">
                  <th className="text-left text-xs font-medium text-muted-foreground px-6 py-3">CAMPANHA</th>
                  <th className="text-left text-xs font-medium text-muted-foreground px-6 py-3">DATA</th>
                  <th className="text-left text-xs font-medium text-muted-foreground px-6 py-3">CONTATOS</th>
                  <th className="text-left text-xs font-medium text-muted-foreground px-6 py-3">ENTREGUES</th>
                  <th className="text-left text-xs font-medium text-muted-foreground px-6 py-3">LIDAS</th>
                  <th className="text-left text-xs font-medium text-muted-foreground px-6 py-3">FALHAS</th>
                  <th className="text-left text-xs font-medium text-muted-foreground px-6 py-3">STATUS</th>
                </tr>
              </thead>
              <tbody>
                {filteredHistory.map((item) => {
                  const deliveryRate = Math.round((item.delivered / item.contacts) * 100);
                  const readRate = Math.round((item.read / item.contacts) * 100);
                  const failureRate = Math.round((item.failed / item.contacts) * 100);
                  
                  return (
                    <tr 
                      key={item.id} 
                      className="border-b hover:bg-muted/20 transition-colors"
                    >
                      <td className="px-6 py-4 font-medium">{item.campaignName}</td>
                      <td className="px-6 py-4 text-muted-foreground">
                        <div className="flex flex-col">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3.5 w-3.5" />
                            <span>{new Date(item.date).toLocaleDateString("pt-BR")}</span>
                          </div>
                          <div className="flex items-center gap-1 mt-1">
                            <Clock className="h-3.5 w-3.5" />
                            <span>{item.time}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          <span>{item.contacts}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <MessageSquare className="h-4 w-4 text-green-500" />
                            <span>{item.delivered} ({deliveryRate}%)</span>
                          </div>
                          <Progress value={deliveryRate} className="h-1.5 bg-muted" />
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-blue-500" />
                            <span>{item.read} ({readRate}%)</span>
                          </div>
                          <Progress value={readRate} className="h-1.5 bg-muted" />
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <XCircle className="h-4 w-4 text-red-500" />
                            <span>{item.failed} ({failureRate}%)</span>
                          </div>
                          <Progress value={failureRate} className="h-1.5 bg-muted" />
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {failureRate > 40 ? (
                          <div className="flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300">
                            <AlertCircle className="h-3.5 w-3.5" />
                            <span>Falhou</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
                            <CheckCircle className="h-3.5 w-3.5" />
                            <span>Concluída</span>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {filteredHistory.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
              <div className="bg-muted/30 rounded-full p-3 mb-4">
                <MessageSquare className="h-6 w-6 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium mb-1">Nenhum resultado encontrado</h3>
              <p className="text-sm text-muted-foreground">
                Nenhuma campanha corresponde à sua pesquisa. Tente outros termos.
              </p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default History;
