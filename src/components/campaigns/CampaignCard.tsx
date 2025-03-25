
import React from "react";
import { Campaign } from "@/lib/api/campaigns";
import { CampaignStatusBadge } from "./CampaignStatusBadge";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Edit, Send, MoreHorizontal, Copy, Trash2 } from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface CampaignCardProps {
  campaign: Campaign;
  onEdit: (campaign: Campaign) => void;
  onDelete: (id: number) => void;
  onSendNow: (campaign: Campaign) => void;
  isSending: boolean;
}

export const CampaignCard: React.FC<CampaignCardProps> = ({
  campaign,
  onEdit,
  onDelete,
  onSendNow,
  isSending
}) => {
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("pt-BR");
  };

  const getMessagePreview = (message: string) => {
    if (!message) return "";
    return message.length > 80 ? `${message.substring(0, 80)}...` : message;
  };

  return (
    <Card className="card-hover">
      <div className="flex flex-col md:flex-row">
        <div className="flex-1">
          <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
            <div>
              <CardTitle className="text-xl">{campaign.nome}</CardTitle>
              <div className="mt-2">
                <CampaignStatusBadge status={campaign.status} />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-1">Mensagem:</h4>
                <p className="text-base">
                  {getMessagePreview(campaign.mensagem01)}
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-1">Data:</h4>
                  <p className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    {formatDate(campaign.data_disparo)}
                  </p>
                </div>
                
                {campaign.tipo_midia && (
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-1">Tipo de mídia:</h4>
                    <p className="capitalize">{campaign.tipo_midia}</p>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </div>
        
        <CardFooter className="flex-col gap-3 justify-center p-6 border-t md:border-t-0 md:border-l">
          <Button 
            variant="outline" 
            className="w-full"
            onClick={() => onEdit(campaign)}
          >
            <Edit className="mr-2 h-4 w-4" />
            Editar
          </Button>
          
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="outline"
                className="w-full border-green-500 hover:bg-green-50 text-green-600"
                disabled={isSending}
              >
                {isSending ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-600 mr-2"></div>
                    Enviando...
                  </div>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    Enviar Agora
                  </>
                )}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Confirmar envio</AlertDialogTitle>
                <AlertDialogDescription>
                  Deseja realmente disparar a campanha "{campaign.nome}" agora?
                  Esta ação não pode ser desfeita.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction onClick={() => onSendNow(campaign)}>
                  Enviar
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-full">
                <MoreHorizontal className="mr-2 h-4 w-4" />
                Ações
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              <DropdownMenuLabel>Opções</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Copy className="mr-2 h-4 w-4" />
                Duplicar
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                className="text-red-600"
                onClick={() => campaign.id && onDelete(campaign.id)}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Excluir
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardFooter>
      </div>
    </Card>
  );
};
