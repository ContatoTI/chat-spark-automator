
import React, { useState } from 'react';
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
import { Pencil, Trash2, KeyRound, AlertCircle, UserX } from 'lucide-react';
import { UserRoleDialog } from './UserRoleDialog';
import { UserPasswordDialog } from './UserPasswordDialog';
import { UserDeleteDialog } from './UserDeleteDialog';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface UsersTableProps {
  users?: User[];
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
}

export const UsersTable: React.FC<UsersTableProps> = ({ 
  users = [], 
  isLoading, 
  error,
  refetch 
}) => {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [roleDialogOpen, setRoleDialogOpen] = useState(false);
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="flex flex-col items-center gap-2">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="text-sm text-muted-foreground">Carregando usuários...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="flex flex-col items-center gap-2 max-w-md text-center">
          <AlertCircle className="h-8 w-8 text-destructive" />
          <h3 className="font-semibold text-lg">Erro ao carregar usuários</h3>
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

  if (!users || users.length === 0) {
    return (
      <div className="flex justify-center items-center h-64 border rounded-lg bg-muted/10">
        <div className="flex flex-col items-center gap-2 p-6 text-center">
          <UserX className="h-12 w-12 text-muted-foreground mb-2" />
          <h3 className="font-semibold text-lg">Nenhum usuário encontrado</h3>
          <p className="text-sm text-muted-foreground">
            Não há usuários cadastrados na tabela appw_users do Supabase.
            Clique em "Novo Usuário" para adicionar um usuário.
          </p>
        </div>
      </div>
    );
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return "Nunca";
    return format(new Date(dateString), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR });
  };

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Email</TableHead>
              <TableHead>Função</TableHead>
              <TableHead>Criado em</TableHead>
              <TableHead>Último login</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.email}</TableCell>
                <TableCell>
                  <span className={`inline-block px-2 py-1 rounded-full text-xs ${
                    user.role === 'admin' 
                      ? 'bg-blue-100 text-blue-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {user.role === 'admin' ? 'Administrador' : 'Usuário'}
                  </span>
                </TableCell>
                <TableCell>{formatDate(user.created_at)}</TableCell>
                <TableCell>{formatDate(user.last_sign_in_at)}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => {
                        setSelectedUser(user);
                        setRoleDialogOpen(true);
                      }}
                      title="Editar função"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => {
                        setSelectedUser(user);
                        setPasswordDialogOpen(true);
                      }}
                      title="Redefinir senha"
                    >
                      <KeyRound className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => {
                        setSelectedUser(user);
                        setDeleteDialogOpen(true);
                      }}
                      className="text-destructive hover:text-destructive/90 hover:bg-destructive/10"
                      title="Excluir usuário"
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

      {selectedUser && (
        <>
          <UserRoleDialog
            user={selectedUser}
            open={roleDialogOpen}
            onOpenChange={setRoleDialogOpen}
            onSuccess={refetch}
          />
          <UserPasswordDialog
            user={selectedUser}
            open={passwordDialogOpen}
            onOpenChange={setPasswordDialogOpen}
          />
          <UserDeleteDialog
            user={selectedUser}
            open={deleteDialogOpen}
            onOpenChange={setDeleteDialogOpen}
            onSuccess={refetch}
          />
        </>
      )}
    </>
  );
};
