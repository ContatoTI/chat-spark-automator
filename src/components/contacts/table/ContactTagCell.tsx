
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Tag, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ContactTagCellProps {
  tags: string[];
  contactId: number;
  tagColor: (tagName: string) => string;
  onRemoveTag: (contactId: number, tag: string) => void;
}

export const ContactTagCell: React.FC<ContactTagCellProps> = ({
  tags,
  contactId,
  tagColor,
  onRemoveTag
}) => {
  return (
    <div className="flex flex-wrap gap-1">
      {tags.map((tag: string, index: number) => (
        <Badge 
          key={`${tag}-${index}`}
          variant="outline" 
          className={cn("flex items-center gap-1", tagColor(tag))}
        >
          <Tag className="h-3 w-3" />
          {tag}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onRemoveTag(contactId, tag);
            }}
            className="ml-1 hover:bg-red-100 rounded-full p-0.5"
          >
            <X className="h-3 w-3" />
          </button>
        </Badge>
      ))}
    </div>
  );
};
