
import { useState, useRef } from "react";
import { toast } from "sonner";
import { uploadFile } from "@/lib/api/mediaLibrary";

export function useMediaUpload(activeTab: 'image' | 'video' | 'document', onUploadSuccess: () => void) {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (activeTab === 'image' && !file.type.startsWith('image/')) {
      toast.error("O arquivo selecionado não é uma imagem.");
      return;
    } else if (activeTab === 'video' && !file.type.startsWith('video/')) {
      toast.error("O arquivo selecionado não é um vídeo.");
      return;
    } else if (activeTab === 'document' && 
        !['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          'text/plain'].includes(file.type)) {
      toast.error("O arquivo selecionado não é um documento válido.");
      return;
    }
    
    setIsUploading(true);
    try {
      uploadFile(file, activeTab).then(uploadedFile => {
        if (uploadedFile) {
          // After successful upload, refresh the file list
          onUploadSuccess();
          toast.success("Arquivo enviado com sucesso!");
        }
        setIsUploading(false);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      }).catch(err => {
        console.error('[MediaLibrary] Erro no upload:', err);
        toast.error("Erro ao fazer upload do arquivo.");
        setIsUploading(false);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      });
    } catch (err) {
      console.error('[MediaLibrary] Erro no upload:', err);
      toast.error("Erro ao fazer upload do arquivo.");
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };
  
  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };
  
  return {
    isUploading,
    fileInputRef,
    handleFileUpload,
    triggerFileInput
  };
}
