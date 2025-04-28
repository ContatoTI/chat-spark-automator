
import React from "react";
import { TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowUp, ArrowDown } from "lucide-react";

interface SortConfig {
  column: string | null;
  direction: 'asc' | 'desc';
}

interface ContactsTableHeaderProps {
  columns: string[];
  sortConfig: SortConfig;
  onSort: (column: string) => void;
  onSelectAll: (checked: boolean) => void;
  allSelected: boolean;
  hasContacts: boolean;
}

export const ContactsTableHeader: React.FC<ContactsTableHeaderProps> = ({
  columns,
  sortConfig,
  onSort,
  onSelectAll,
  allSelected,
  hasContacts
}) => {
  return (
    <TableHeader>
      <TableRow>
        <TableHead className="w-[50px]">
          <Checkbox 
            onCheckedChange={onSelectAll}
            checked={allSelected && hasContacts}
          />
        </TableHead>
        {columns.map((column) => (
          <TableHead 
            key={column}
            className="cursor-pointer hover:bg-muted/50"
            onClick={() => onSort(column)}
          >
            <div className="flex items-center gap-2">
              {column}
              {sortConfig.column === column && (
                sortConfig.direction === 'asc' ? 
                  <ArrowUp className="h-4 w-4" /> : 
                  <ArrowDown className="h-4 w-4" />
              )}
            </div>
          </TableHead>
        ))}
        <TableHead className="w-[80px]">Ações</TableHead>
      </TableRow>
    </TableHeader>
  );
};
