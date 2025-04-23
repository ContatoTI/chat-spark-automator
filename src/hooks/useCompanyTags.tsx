
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
      if (!companyId) return;

      const { data, error } = await supabase
        .from('AppW_Options')
        .select('tags')
        .eq('empresa_id', companyId)
        .single();

      if (error) {
        console.error('Erro ao carregar tags:', error);
        
        // Se o erro for "não encontrado", vamos inicializar com a tag padrão
        if (error.code === 'PGRST116') {
          setTags(['Teste']);
          await updateTags(['Teste']);
        } else {
          toast.error('Erro ao carregar tags');
        }
        return;
      }

      if (data?.tags) {
        // Assegura que as tags são um array, independente do formato
        const parsedTags = Array.isArray(data.tags) ? data.tags : JSON.parse(data.tags);
        
        // Garante que a tag "Teste" sempre esteja presente
        if (!parsedTags.includes('Teste')) {
          parsedTags.push('Teste');
        }
        
        setTags(parsedTags);
      } else {
        // Se não houver tags, inicializa com a tag padrão
        setTags(['Teste']);
        await updateTags(['Teste']);
      }
    } catch (error) {
      console.error('Erro ao processar tags:', error);
      toast.error('Erro ao carregar tags');
    }
  };

  const updateTags = async (newTags: string[]) => {
    if (!companyId) return;

    try {
      // Garante que a tag "Teste" sempre esteja presente
      if (!newTags.includes('Teste')) {
        newTags.push('Teste');
      }

      // Verifica se já existe um registro para esta empresa
      const { data: existingRecord, error: checkError } = await supabase
        .from('AppW_Options')
        .select('id')
        .eq('empresa_id', companyId)
        .single();

      if (checkError && checkError.code !== 'PGRST116') {
        throw checkError;
      }

      if (existingRecord) {
        // Atualiza o registro existente
        const { error } = await supabase
          .from('AppW_Options')
          .update({ tags: newTags })
          .eq('empresa_id', companyId);

        if (error) throw error;
      } else {
        // Cria um novo registro com as tags
        const { error } = await supabase
          .from('AppW_Options')
          .insert({ 
            empresa_id: companyId, 
            tags: newTags,
            ativo: true,
            horario_limite: 17,
            long_wait_min: 50,
            long_wait_max: 240,
            short_wait_min: 5,
            short_wait_max: 10,
            batch_size_min: 5,
            batch_size_max: 10,
            ftp_port: 21
          });

        if (error) throw error;
      }
    } catch (error) {
      console.error('Erro ao atualizar tags:', error);
      throw error;
    }
  };

  const addTag = async (tag: string) => {
    try {
      if (tags.includes(tag.trim())) {
        toast.error('Esta tag já existe');
        return;
      }
      
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
      if (tag === 'Teste') {
        toast.error('A tag Teste não pode ser removida');
        return;
      }
      
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
