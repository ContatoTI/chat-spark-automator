
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

const TAG_COLORS = [
  'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
  'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
  'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
  'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
  'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
  'bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300',
  'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300',
];

interface TagWithColor {
  name: string;
  color: string;
}

export const useCompanyTags = (companyId: string | null) => {
  const [tags, setTags] = useState<TagWithColor[]>([{ name: 'Teste', color: TAG_COLORS[0] }]);

  useEffect(() => {
    if (companyId) {
      loadCompanyTags();
    }
  }, [companyId]);

  const loadCompanyTags = async () => {
    try {
      if (!companyId) return;

      const { data, error } = await supabase
        .from('AppW_Options')
        .select('tags')
        .eq('empresa_id', companyId)
        .single();

      if (error) {
        console.error('Erro ao carregar tags:', error);
        
        if (error.code === 'PGRST116') {
          setTags([{ name: 'Teste', color: TAG_COLORS[0] }]);
          await updateTags([{ name: 'Teste', color: TAG_COLORS[0] }]);
        } else {
          toast.error('Erro ao carregar tags');
        }
        return;
      }

      if (data?.tags) {
        const parsedTags = Array.isArray(data.tags) 
          ? data.tags 
          : JSON.parse(data.tags);
        
        // Convert old format to new format with colors if needed
        const tagsWithColors = parsedTags.map((tag: string | TagWithColor, index: number) => {
          if (typeof tag === 'string') {
            return {
              name: tag,
              color: TAG_COLORS[index % TAG_COLORS.length]
            };
          }
          return tag;
        });
        
        // Ensure "Teste" tag is present
        if (!tagsWithColors.some(tag => tag.name === 'Teste')) {
          tagsWithColors.push({ name: 'Teste', color: TAG_COLORS[0] });
        }
        
        setTags(tagsWithColors);
      } else {
        setTags([{ name: 'Teste', color: TAG_COLORS[0] }]);
        await updateTags([{ name: 'Teste', color: TAG_COLORS[0] }]);
      }
    } catch (error) {
      console.error('Erro ao processar tags:', error);
      toast.error('Erro ao carregar tags');
    }
  };

  const updateTags = async (newTags: TagWithColor[]) => {
    if (!companyId) return;

    try {
      const { data: existingRecord, error: checkError } = await supabase
        .from('AppW_Options')
        .select('id')
        .eq('empresa_id', companyId)
        .single();

      if (checkError && checkError.code !== 'PGRST116') {
        throw checkError;
      }

      const { error } = await supabase
        .from('AppW_Options')
        .update({ tags: newTags })
        .eq('empresa_id', companyId);

      if (error) throw error;
    } catch (error) {
      console.error('Erro ao atualizar tags:', error);
      throw error;
    }
  };

  const addTag = async (tagName: string) => {
    try {
      if (tags.some(tag => tag.name === tagName.trim())) {
        toast.error('Esta tag já existe');
        return;
      }
      
      const newTag = {
        name: tagName,
        color: TAG_COLORS[tags.length % TAG_COLORS.length]
      };
      
      const newTags = [...tags, newTag];
      setTags(newTags);
      await updateTags(newTags);
      toast.success('Tag adicionada com sucesso');
    } catch (error) {
      toast.error('Erro ao adicionar tag');
    }
  };

  const removeTag = async (tagName: string) => {
    try {
      if (tagName === 'Teste') {
        toast.error('A tag Teste não pode ser removida');
        return;
      }
      
      const newTags = tags.filter(tag => tag.name !== tagName);
      setTags(newTags);
      await updateTags(newTags);
      toast.success('Tag removida com sucesso');
    } catch (error) {
      toast.error('Erro ao remover tag');
    }
  };

  return { tags, addTag, removeTag };
};
