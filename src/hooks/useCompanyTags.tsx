
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

export const useCompanyTags = (companyId: string | null) => {
  const [tags, setTags] = useState<string[]>(['Teste']);

  useEffect(() => {
    if (companyId) {
      loadCompanyTags();
    }
  }, [companyId]);

  const loadCompanyTags = async () => {
    try {
      const { data: settings, error } = await supabase
        .from('AppW_Settings')
        .select('tags')
        .eq('empresa_id', companyId)
        .single();

      if (error) throw error;

      if (settings?.tags) {
        setTags(Array.isArray(settings.tags) ? settings.tags : JSON.parse(settings.tags));
      } else {
        // Se não houver tags, inicializa com a tag padrão
        setTags(['Teste']);
        await updateTags(['Teste']);
      }
    } catch (error) {
      console.error('Erro ao carregar tags:', error);
      toast.error('Erro ao carregar tags');
    }
  };

  const updateTags = async (newTags: string[]) => {
    if (!companyId) return;

    try {
      const { error } = await supabase
        .from('AppW_Settings')
        .update({ tags: newTags })
        .eq('empresa_id', companyId);

      if (error) throw error;
    } catch (error) {
      console.error('Erro ao atualizar tags:', error);
      throw error;
    }
  };

  const addTag = async (tag: string) => {
    try {
      const newTags = [...tags, tag];
      setTags(newTags);
      await updateTags(newTags);
      toast.success('Tag adicionada com sucesso');
    } catch (error) {
      toast.error('Erro ao adicionar tag');
    }
  };

  const removeTag = async (tag: string) => {
    try {
      const newTags = tags.filter(t => t !== tag);
      setTags(newTags);
      await updateTags(newTags);
      toast.success('Tag removida com sucesso');
    } catch (error) {
      toast.error('Erro ao remover tag');
    }
  };

  return { tags, addTag, removeTag };
};
