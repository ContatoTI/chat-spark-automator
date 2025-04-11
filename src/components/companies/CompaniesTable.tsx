
import React, { useState } from 'react';
import { Company } from '@/lib/api/companies';
import { User } from '@/lib/api/users';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Pencil, Trash2, AlertCircle, Building, ChevronDown, ChevronUp, Users, Settings, FolderCheck } from 'lucide-react';
import { EditCompanyDialog } from './EditCompanyDialog';
import { DeleteCompanyDialog } from './DeleteCompanyDialog';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Card, CardContent } from '@/components/ui/card';
import { useUsers } from '@/hooks/useUsers';
import { CompanySettingsForm } from './CompanySettingsForm';
import { useAuth } from '@/contexts/AuthContext';

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
  const [expandedCompany, setExpandedCompany] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'users' | 'settings'>('users');
  const { users, isLoading: usersLoading } = useUsers();
  const { isMaster } = useAuth();

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

  // Filtrar usuários por empresa
  const getUsersByCompany = (companyId: string): User[] => {
    return users.filter(user => user.company_id === companyId);
  };

  const toggleExpand = (companyId: string) => {
    if (expandedCompany === companyId) {
      setExpandedCompany(null);
    } else {
      setExpandedCompany(companyId);
      setActiveTab('users');
    }
  };

  return (
    <>
      <div className="space-y-4">
        {companies.map((company) => (
          <Card key={company.id} className="overflow-hidden">
            <div className="flex justify-between items-center p-4 hover:bg-muted/20 cursor-pointer" onClick={() => toggleExpand(company.id)}>
              <div className="flex items-center gap-3">
                <Building className="h-5 w-5 text-primary" />
                <div>
                  <h3 className="text-lg font-medium">{company.name}</h3>
                  <p className="text-sm text-muted-foreground">ID: {company.id}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <p className="text-sm text-muted-foreground mr-2">Criada em: {formatDate(company.created_at)}</p>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={(e) => {
                    e.stopPropagation();
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
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedCompany(company);
                    setDeleteDialogOpen(true);
                  }}
                  className="text-destructive hover:text-destructive/90 hover:bg-destructive/10"
                  title="Excluir empresa"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
                {expandedCompany === company.id ? (
                  <ChevronUp className="h-5 w-5" />
                ) : (
                  <ChevronDown className="h-5 w-5" />
                )}
              </div>
            </div>
            
            {expandedCompany === company.id && (
              <CardContent className="pt-4 pb-4 border-t">
                {/* Tabs para usuários e configurações */}
                {isMaster && (
                  <div className="mb-4 border-b">
                    <div className="flex space-x-4">
                      <button
                        className={`pb-2 px-1 ${activeTab === 'users' 
                          ? 'border-b-2 border-primary font-medium text-primary' 
                          : 'text-muted-foreground'}`}
                        onClick={() => setActiveTab('users')}
                      >
                        <span className="flex items-center gap-2">
                          <Users className="h-4 w-4" />
                          Usuários
                        </span>
                      </button>
                      <button
                        className={`pb-2 px-1 ${activeTab === 'settings' 
                          ? 'border-b-2 border-primary font-medium text-primary' 
                          : 'text-muted-foreground'}`}
                        onClick={() => setActiveTab('settings')}
                      >
                        <span className="flex items-center gap-2">
                          <Settings className="h-4 w-4" />
                          Configurações
                        </span>
                      </button>
                    </div>
                  </div>
                )}

                {/* Conteúdo baseado na aba ativa */}
                {(activeTab === 'users' || !isMaster) && (
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Users className="h-4 w-4" />
                        <h4 className="font-medium">Usuários desta empresa</h4>
                      </div>
                      
                      {usersLoading ? (
                        <div className="text-center py-4">
                          <div className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
                          <p className="text-sm text-muted-foreground mt-2">Carregando usuários...</p>
                        </div>
                      ) : (
                        <div className="rounded-md border overflow-hidden">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Email</TableHead>
                                <TableHead>Função</TableHead>
                                <TableHead>Criado em</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {getUsersByCompany(company.id).length > 0 ? (
                                getUsersByCompany(company.id).map((user) => (
                                  <TableRow key={user.id}>
                                    <TableCell className="font-medium">{user.email}</TableCell>
                                    <TableCell>
                                      <span className={`inline-block px-2 py-1 rounded-full text-xs ${
                                        user.role === 'master' 
                                          ? 'bg-purple-100 text-purple-800' 
                                          : user.role === 'admin'
                                            ? 'bg-blue-100 text-blue-800'
                                            : 'bg-gray-100 text-gray-800'
                                      }`}>
                                        {user.role === 'master' 
                                          ? 'Master' 
                                          : user.role === 'admin' 
                                            ? 'Administrador' 
                                            : 'Usuário'}
                                      </span>
                                    </TableCell>
                                    <TableCell>{formatDate(user.created_at)}</TableCell>
                                  </TableRow>
                                ))
                              ) : (
                                <TableRow>
                                  <TableCell colSpan={3} className="text-center py-4 text-muted-foreground">
                                    Nenhum usuário associado a esta empresa
                                  </TableCell>
                                </TableRow>
                              )}
                            </TableBody>
                          </Table>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {activeTab === 'settings' && isMaster && (
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center gap-2 mb-4">
                        <Settings className="h-4 w-4" />
                        <h4 className="font-medium">Configurações da empresa</h4>
                      </div>
                      
                      <CompanySettingsForm companyId={company.id} />
                    </div>
                  </div>
                )}
              </CardContent>
            )}
          </Card>
        ))}
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
