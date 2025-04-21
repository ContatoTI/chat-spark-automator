
import React from "react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Contact } from "@/hooks/useContacts";
import { Badge } from "@/components/ui/badge";

interface ContactsTableProps {
  contacts: Contact[];
  isLoading: boolean;
}

export const ContactsTable: React.FC<ContactsTableProps> = ({ 
  contacts, 
  isLoading 
}) => {
  if (contacts.length === 0 && !isLoading) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Nenhum contato encontrado.</p>
      </div>
    );
  }

  // Get all unique column names from contacts
  const getColumns = () => {
    const allColumns = new Set<string>();
    contacts.forEach(contact => {
      Object.keys(contact).forEach(key => {
        allColumns.add(key);
      });
    });
    
    // Order known columns first
    const orderedColumns: string[] = [];
    const knownColumns = ["id", "Nome", "Numero", "Enviado", "Nome_Real", "Invalido"];
    
    knownColumns.forEach(col => {
      if (allColumns.has(col)) {
        orderedColumns.push(col);
        allColumns.delete(col);
      }
    });
    
    // Add remaining columns
    return [...orderedColumns, ...Array.from(allColumns)];
  };

  // Format cell value based on type
  const formatCellValue = (value: any, column: string) => {
    if (value === null || value === undefined) {
      return <span className="text-muted-foreground">-</span>;
    }

    if (column === "Enviado") {
      return value === true ? (
        <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
          Sim
        </Badge>
      ) : (
        <Badge variant="outline" className="text-muted-foreground">
          Não
        </Badge>
      );
    }

    if (column === "Invalido" && value) {
      return (
        <Badge className="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300">
          {value}
        </Badge>
      );
    }

    return String(value);
  };

  const columns = getColumns();

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((column) => (
              <TableHead key={column}>
                {column}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                Carregando...
              </TableCell>
            </TableRow>
          ) : (
            contacts.map((contact) => (
              <TableRow key={contact.id}>
                {columns.map((column) => (
                  <TableCell key={`${contact.id}-${column}`}>
                    {formatCellValue(contact[column], column)}
                  </TableCell>
                ))}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};
