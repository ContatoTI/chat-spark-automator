
import React from "react";
import { TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Contact } from "@/hooks/useContacts";
import { ContactTableCell } from "./ContactTableCell";
import { ContactActionsCell } from "./ContactActionsCell";

interface ContactsTableBodyProps {
  contacts: Contact[];
  columns: string[];
  isLoading: boolean;
  selectedContacts: number[];
  handleSelectContact: (contactId: number, checked: boolean) => void;
  getTagColor: (tagName: string) => string;
  handleRemoveTag: (contactId: number, tagToRemove: string) => Promise<void>;
  handleEditContact: (contact: Contact) => void;
  handleDeleteContact: (contact: Contact) => void;
}

export const ContactsTableBody: React.FC<ContactsTableBodyProps> = ({
  contacts,
  columns,
  isLoading,
  selectedContacts,
  handleSelectContact,
  getTagColor,
  handleRemoveTag,
  handleEditContact,
  handleDeleteContact
}) => {
  if (isLoading) {
    return (
      <TableBody>
        <TableRow>
          <TableCell colSpan={columns.length + 2} className="h-24 text-center">
            Carregando...
          </TableCell>
        </TableRow>
      </TableBody>
    );
  }

  if (contacts.length === 0) {
    return (
      <TableBody>
        <TableRow>
          <TableCell colSpan={columns.length + 2} className="h-24 text-center">
            Nenhum contato encontrado.
          </TableCell>
        </TableRow>
      </TableBody>
    );
  }

  return (
    <TableBody>
      {contacts.map((contact) => (
        <TableRow key={contact.id}>
          <TableCell>
            <Checkbox 
              checked={selectedContacts.includes(contact.id)}
              onCheckedChange={(checked) => handleSelectContact(contact.id, checked as boolean)}
            />
          </TableCell>
          {columns.map((column) => (
            <ContactTableCell 
              key={`${contact.id}-${column}`}
              column={column}
              value={contact[column]}
              contactId={contact.id}
              getTagColor={getTagColor}
              handleRemoveTag={handleRemoveTag}
            />
          ))}
          <TableCell>
            <ContactActionsCell 
              contact={contact}
              onEdit={handleEditContact}
              onDelete={handleDeleteContact}
            />
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  );
};
