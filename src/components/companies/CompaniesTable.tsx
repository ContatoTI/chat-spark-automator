
import React, { useState } from 'react';
import { Company } from '@/lib/api/companies';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Pencil, Trash2, AlertCircle, Building } from 'lucide-react';
import { EditCompanyDialog } from './EditCompanyDialog';
import { DeleteCompanyDialog } from './DeleteCompanyDialog';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface CompaniesTableProps {
  companies?: Company[];
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
}

export const CompaniesTable: React.FC<CompaniesTableProps> = ({ 
  companies = [], 
  isLoading, 
  error,
  refetch 
}) => {
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="flex flex-col items-center gap-2">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="text-sm text-muted-foreground">Carregando empresas...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="flex flex-col items-center gap-2 max-w-md text-center">
          <AlertCircle className="h-8 w-8 text-destructive" />
          <h3 className="font-semibold text-lg">Erro ao carregar empresas</h3>
          <p className="text-sm text-muted-foreground">
            {error.message}
          </p>
          <Button onClick={refetch} variant="outline" size="sm" className="mt-2">
            Tentar novamente
          </Button>
        </div>
      </div>
    );
  }

  if (!companies || companies.length === 0) {
    return (
      <div className="flex justify-center items-center h-64 border rounded-lg bg-muted/10">
        <div className="flex flex-col items-center gap-2 p-6 text-center">
          <Building className="h-12 w-12 text-muted-foreground mb-2" />
          <h3 className="font-semibold text-lg">Nenhuma empresa encontrada</h3>
          <p className="text-sm text-muted-foreground">
            Não há empresas cadastradas no sistema.
            Clique em "Nova Empresa" para adicionar uma empresa.
          </p>
        </div>
      </div>
    );
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    return format(new Date(dateString), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR });
  };

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>ID</TableHead>
              <TableHead>Criada em</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {companies.map((company) => (
              <TableRow key={company.id}>
                <TableCell className="font-medium">{company.name}</TableCell>
                <TableCell className="text-muted-foreground text-sm">{company.id}</TableCell>
                <TableCell>{formatDate(company.created_at)}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => {
                        setSelectedCompany(company);
                        setEditDialogOpen(true);
                      }}
                      title="Editar empresa"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => {
                        setSelectedCompany(company);
                        setDeleteDialogOpen(true);
                      }}
                      className="text-destructive hover:text-destructive/90 hover:bg-destructive/10"
                      title="Excluir empresa"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {selectedCompany && (
        <>
          <EditCompanyDialog
            company={selectedCompany}
            open={editDialogOpen}
            onOpenChange={setEditDialogOpen}
            onSuccess={refetch}
          />
          <DeleteCompanyDialog
            company={selectedCompany}
            open={deleteDialogOpen}
            onOpenChange={setDeleteDialogOpen}
            onSuccess={refetch}
          />
        </>
      )}
    </>
  );
};
