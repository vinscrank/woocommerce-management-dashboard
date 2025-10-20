import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import axiosInstance from 'src/utils/axios';
import { API_BASE_PREFIX } from 'src/utils/const';
import { Media } from 'src/types/File';
import { useWorkspace } from 'src/context/WorkspaceContext';

interface UseUploadFilesOptions {
  onSuccess?: (uploadedFiles: Media[]) => void;
  onError?: (error: any) => void;
}

export function useUploadFiles(options?: UseUploadFilesOptions) {
  const [isUploading, setIsUploading] = useState(false);
  const queryClient = useQueryClient();
  const { ecommerceId } = useWorkspace();
  
  const uploadFiles = async (files: File[]): Promise<Media[]> => {
   
    setIsUploading(true);
    try {
      // WordPress API accetta un solo file per volta, quindi facciamo upload multipli in parallelo
      const uploadPromises = files.map(async (file) => {
        const formData = new FormData();
        formData.append('file', file);

        const response = await axiosInstance.post<{ success: boolean; data: Media }>(
          API_BASE_PREFIX + '/' + ecommerceId + '/media',
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          }
        );

        // L'API ritorna { success: true, data: Media }
        // Quindi accediamo a response.data.data per ottenere l'oggetto Media con sourceUrl
        return response.data.data;
      });

      const uploadedFiles = await Promise.all(uploadPromises);

      // Invalida tutte le query dei files (con qualsiasi paginazione)
      await queryClient.invalidateQueries({ queryKey: ['files'] });

      options?.onSuccess?.(uploadedFiles);

      return uploadedFiles;
    } catch (error) {
      console.error('Errore durante il caricamento:', error);
      options?.onError?.(error);
      throw error;
    } finally {
      setIsUploading(false);
    }
  };

  return {
    uploadFiles,
    isUploading,
  };
}

