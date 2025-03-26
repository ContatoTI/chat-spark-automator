
import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";

interface UserPermissions {
  can_manage_users: boolean;
  can_manage_settings: boolean;
  can_view_campaigns: boolean;
}

interface User {
  id: string;
  full_name: string;
  email: string;
  role: "admin" | "client";
  permissions: UserPermissions[];
}

interface UserTableProps {
  users: User[];
  isLoading: boolean;
  onRoleChange: (userId: string, role: "admin" | "client") => void;
  onPermissionChange: (userId: string, field: keyof UserPermissions, value: boolean) => void;
  isUpdating: boolean;
}

export const UserTable = ({ 
  users, 
  isLoading, 
  onRoleChange, 
  onPermissionChange,
  isUpdating 
}: UserTableProps) => {
  if (isLoading) {
    return (
      <div className="text-center py-10">
        <p>Carregando usuários...</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Função</TableHead>
            <TableHead>Gerenciar Usuários</TableHead>
            <TableHead>Gerenciar Configurações</TableHead>
            <TableHead>Ver Campanhas</TableHead>
            <TableHead>Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users?.map((user: User) => (
            <TableRow key={user.id}>
              <TableCell className="font-medium">{user.full_name}</TableCell>
              <TableCell>{user.email || "-"}</TableCell>
              <TableCell>
                <Badge variant={user.role === 'admin' ? 'default' : 'outline'}>
                  {user.role === 'admin' ? 'Administrador' : 'Cliente'}
                </Badge>
              </TableCell>
              <TableCell>
                <Switch 
                  checked={user.permissions?.[0]?.can_manage_users || false}
                  onCheckedChange={(checked) => 
                    onPermissionChange(user.id, "can_manage_users", checked)
                  }
                  disabled={isUpdating}
                />
              </TableCell>
              <TableCell>
                <Switch 
                  checked={user.permissions?.[0]?.can_manage_settings || false}
                  onCheckedChange={(checked) => 
                    onPermissionChange(user.id, "can_manage_settings", checked)
                  }
                  disabled={isUpdating}
                />
              </TableCell>
              <TableCell>
                <Switch 
                  checked={user.permissions?.[0]?.can_view_campaigns || false}
                  onCheckedChange={(checked) => 
                    onPermissionChange(user.id, "can_view_campaigns", checked)
                  }
                  disabled={isUpdating}
                />
              </TableCell>
              <TableCell>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => 
                    onRoleChange(user.id, user.role === 'admin' ? 'client' : 'admin')
                  }
                  disabled={isUpdating}
                >
                  {user.role === 'admin' ? 'Rebaixar' : 'Promover'}
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
