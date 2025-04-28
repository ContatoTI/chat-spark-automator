
import React from "react";
import { TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Contact } from "@/hooks/useContacts";
import { ContactTagCell } from "./ContactTagCell";

interface ContactTableCellProps {
  column: string;
  value: any;
  contactId: number;
  getTagColor: (tagName: string) => string;
  handleRemoveTag: (contactId: number, tagToRemove: string) => Promise<void>;
}

export const ContactTableCell: React.FC<ContactTableCellProps> = ({ 
  column, 
  value, 
  contactId,
  getTagColor,
  handleRemoveTag
}) => {
  if (value === null || value === undefined) {
    return (
      <TableCell>
        <span className="text-muted-foreground">-</span>
      </TableCell>
    );
  }

  if (column === "Enviado") {
    return (
      <TableCell>
        {value === true ? (
          <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
            Sim
          </Badge>
        ) : (
          <Badge variant="outline" className="text-muted-foreground">
            Não
          </Badge>
        )}
      </TableCell>
    );
  }

  if (column === "Invalido" && value) {
    return (
      <TableCell>
        <Badge className="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300">
          {value}
        </Badge>
      </TableCell>
    );
  }

  if (column === "tag" && value) {
    const tags = Array.isArray(value) ? value : JSON.parse(value);
    return (
      <TableCell>
        <ContactTagCell 
          tags={tags} 
          contactId={contactId} 
          tagColor={getTagColor} 
          onRemoveTag={handleRemoveTag} 
        />
      </TableCell>
    );
  }

  return <TableCell>{String(value)}</TableCell>;
};
