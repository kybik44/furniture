import React, { useState, useRef, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Upload, Link, X, Loader, Check } from 'lucide-react';
import Button from './Button';
import { useUploadImage } from '../../lib/hooks';

interface ImageUploaderProps {
  value: string;
  onChange: (url: string) => void;
  folder?: 'products' | 'categories';
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ value, onChange, folder = 'products' }) => {
  const { t } = useTranslation();
  const [mode, setMode] = useState<'url' | 'upload'>(value ? 'url' : 'upload');
  const [url, setUrl] = useState(value || '');
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const uploadImage = useUploadImage();
  
  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newUrl = e.target.value;
    setUrl(newUrl);
    onChange(newUrl);
  };
  
  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);
  
  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);
  
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);
  
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      handleUploadFile(file);
    }
  }, []);
  
  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleUploadFile(file);
    }
  };
  
  const handleUploadFile = async (file: File) => {
    try {
      const result = await uploadImage.mutateAsync({ file, folder });
      setUrl(result);
      onChange(result);
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };
  
  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };
  
  const handleClearImage = () => {
    setUrl('');
    onChange('');
  };
  
  const switchToUrlMode = () => {
    setMode('url');
    if (!url) {
      onChange('');
    }
  };
  
  const switchToUploadMode = () => {
    setMode('upload');
    if (!url) {
      onChange('');
    }
  };
  
  return (
    <div className="space-y-4">
      <div className="flex space-x-2">
        <Button
          type="button"
          variant="primary"
          className={mode === 'url' ? '' : 'opacity-50'}
          onClick={switchToUrlMode}
        >
          <Link size={16} className="mr-2" />
          {t('admin.form.useImageUrl')}
        </Button>
        <Button
          type="button"
          variant="primary"
          className={mode === 'upload' ? '' : 'opacity-50'}
          onClick={switchToUploadMode}
        >
          <Upload size={16} className="mr-2" />
          {t('admin.form.useImageUpload')}
        </Button>
      </div>
      
      {mode === 'url' ? (
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            {t('admin.form.imageUrl')}
          </label>
          <input
            type="url"
            value={url}
            onChange={handleUrlChange}
            className="w-full p-2 border border-gray-300 rounded"
            placeholder="https://..."
          />
        </div>
      ) : (
        <div 
          className={`border-2 border-dashed p-6 rounded-lg text-center cursor-pointer ${
            isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
          }`}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={handleUploadClick}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileInputChange}
            className="hidden"
            accept="image/*"
          />
          {uploadImage.isPending ? (
            <div className="flex flex-col items-center py-4">
              <Loader size={32} className="animate-spin text-blue-500 mb-2" />
              <p className="text-sm text-gray-500">{t('admin.form.uploading')}</p>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <Upload size={32} className="text-gray-400 mb-2" />
              <p className="text-sm font-medium text-gray-700 mb-1">{t('admin.form.uploadImage')}</p>
              <p className="text-xs text-gray-500">{t('admin.form.dragAndDrop')}</p>
            </div>
          )}
        </div>
      )}
      
      {url && (
        <div className="relative mt-4 border rounded-lg overflow-hidden">
          <img src={url} alt="Preview" className="w-full object-contain max-h-64" />
          <div className="absolute top-0 right-0 p-2">
            <button
              type="button"
              onClick={handleClearImage}
              className="p-1 bg-white rounded-full shadow hover:bg-gray-100"
            >
              <X size={16} className="text-gray-600" />
            </button>
          </div>
          {uploadImage.isSuccess && (
            <div className="absolute bottom-0 left-0 right-0 bg-green-500 bg-opacity-80 text-white p-2 text-sm flex items-center">
              <Check size={16} className="mr-2" />
              {t('admin.form.uploadSuccess')}
            </div>
          )}
          {uploadImage.isError && (
            <div className="absolute bottom-0 left-0 right-0 bg-red-500 bg-opacity-80 text-white p-2 text-sm flex items-center">
              <X size={16} className="mr-2" />
              {t('admin.form.uploadError')}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ImageUploader; 