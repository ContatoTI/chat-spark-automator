
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Tag } from "lucide-react";

interface Tag {
  name: string;
  color?: string;
}

interface ContactsTableToolbarProps {
  selectedContacts: number[];
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onApplyTag: (tagName: string) => Promise<void>;
  tags: Tag[];
}

export const ContactsTableToolbar: React.FC<ContactsTableToolbarProps> = ({
  selectedContacts,
  searchTerm,
  onSearchChange,
  onApplyTag,
  tags
}) => {
  return (
    <>
      {selectedContacts.length > 0 && (
        <div className="p-2 border-b bg-muted/50 flex items-center gap-2">
          <span className="text-sm text-muted-foreground">
            {selectedContacts.length} contatos selecionados
          </span>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Tag className="h-4 w-4 mr-2" />
                Aplicar Tag
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {tags.map((tag) => (
                <DropdownMenuItem key={tag.name} onClick={() => onApplyTag(tag.name)}>
                  {tag.name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}
      
      <div className="p-2 border-b bg-muted/20">
        <Input
          placeholder="Buscar contatos..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="max-w-sm"
        />
      </div>
    </>
  );
};
