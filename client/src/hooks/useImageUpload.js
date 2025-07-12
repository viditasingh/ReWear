import { useState, useCallback } from 'react';
import { useUploadImagesMutation } from '../store/api/itemsApi';
import { validateImageFile, validateMultipleFiles } from '../utils/validators';
import { showToast } from '../components/ui/Toast';

export const useImageUpload = (options = {}) => {
  const {
    maxFiles = 5,
    maxSize = 5 * 1024 * 1024, // 5MB
    allowedTypes = ['image/jpeg', 'image/png', 'image/webp'],
    onSuccess,
    onError,
  } = options;

  const [uploadImages, { isLoading }] = useUploadImagesMutation();
  const [uploadedImages, setUploadedImages] = useState([]);
  const [uploadProgress, setUploadProgress] = useState(0);

  const validateFiles = useCallback((files) => {
    const fileArray = Array.isArray(files) ? files : [files];
    
    if (fileArray.length > maxFiles) {
      return { isValid: false, error: `Maximum ${maxFiles} files allowed` };
    }

    for (const file of fileArray) {
      if (!allowedTypes.includes(file.type)) {
        return { 
          isValid: false, 
          error: `Invalid file type. Only ${allowedTypes.join(', ')} are allowed` 
        };
      }

      if (file.size > maxSize) {
        return { 
          isValid: false, 
          error: `File size too large. Maximum size is ${Math.round(maxSize / (1024 * 1024))}MB` 
        };
      }
    }

    return { isValid: true, error: null };
  }, [maxFiles, maxSize, allowedTypes]);

  const uploadFiles = useCallback(async (files) => {
    const validation = validateFiles(files);
    if (!validation.isValid) {
      showToast.error(validation.error);
      if (onError) onError(validation.error);
      return;
    }

    try {
      const formData = new FormData();
      const fileArray = Array.isArray(files) ? files : [files];
      
      fileArray.forEach((file, index) => {
        formData.append('images', file);
      });

      const result = await uploadImages(formData).unwrap();
      
      setUploadedImages(prev => [...prev, ...result.images]);
      setUploadProgress(100);
      
      showToast.success('Images uploaded successfully!');
      if (onSuccess) onSuccess(result.images);
      
      return result.images;
    } catch (error) {
      const errorMessage = error.data?.message || 'Upload failed';
      showToast.error(errorMessage);
      if (onError) onError(errorMessage);
    }
  }, [uploadImages, validateFiles, onSuccess, onError]);

  const removeImage = useCallback((index) => {
    setUploadedImages(prev => prev.filter((_, i) => i !== index));
  }, []);

  const clearImages = useCallback(() => {
    setUploadedImages([]);
    setUploadProgress(0);
  }, []);

  const getPreviewUrl = useCallback((file) => {
    if (file instanceof File) {
      return URL.createObjectURL(file);
    }
    return file;
  }, []);

  return {
    uploadFiles,
    uploadedImages,
    isLoading,
    uploadProgress,
    removeImage,
    clearImages,
    getPreviewUrl,
    validateFiles,
  };
};
