
import React, { useState } from 'react';
import { useCompanyTags } from '@/hooks/useCompanyTags';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tag, Plus, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

interface ContactTagsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  companyId: string | null;
}

export const ContactTagsDialog = ({ isOpen, onClose, companyId }: ContactTagsDialogProps) => {
  const [newTag, setNewTag] = useState('');
  const { tags, addTag, removeTag } = useCompanyTags(companyId);

  const handleAddTag = () => {
    if (!newTag.trim()) {
      toast.error('Digite um nome para a tag');
      return;
    }

    if (tags.includes(newTag.trim())) {
      toast.error('Esta tag já existe');
      return;
    }

    addTag(newTag.trim());
    setNewTag('');
  };

  const handleRemoveTag = (tag: string) => {
    if (tag === 'Teste') {
      toast.error('A tag Teste não pode ser removida');
      return;
    }
    removeTag(tag);
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Gerenciar Tags</DialogTitle>
        </DialogHeader>
        
        <div className="flex flex-col gap-4">
          <div className="flex gap-2">
            <Input
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              placeholder="Nova tag..."
              className="flex-1"
            />
            <Button onClick={handleAddTag} size="sm">
              <Plus className="h-4 w-4" />
              Adicionar
            </Button>
          </div>

          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <Badge key={tag} variant="outline" className="flex items-center gap-1">
                <Tag className="h-3 w-3" />
                {tag}
                {tag !== 'Teste' && (
                  <button
                    onClick={() => handleRemoveTag(tag)}
                    className="ml-1 rounded-full hover:bg-destructive/20"
                  >
                    <X className="h-3 w-3" />
                  </button>
                )}
              </Badge>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
