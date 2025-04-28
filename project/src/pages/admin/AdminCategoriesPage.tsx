import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import AdminLayout from '../../components/admin/AdminLayout';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../../lib/supabase';
import Button from '../../components/ui/Button';
import { useCreateCategory, useUpdateCategory, useDeleteCategory, useUploadImage } from '../../lib/hooks';
import { Pencil, Trash, X, Check, Loader, Upload, Link as LinkIcon } from 'lucide-react';
import { Category } from '../../lib/api';

interface CategoryFormData {
  name: string;
  name_ru: string;
  slug: string;
  image: string;
}

const initialFormData: CategoryFormData = {
  name: '',
  name_ru: '',
  slug: '',
  image: '',
};

const AdminCategoriesPage: React.FC = () => {
  const { t } = useTranslation();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formData, setFormData] = useState<CategoryFormData>(initialFormData);
  const [editId, setEditId] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [useImageUpload, setUseImageUpload] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const { data: categories, isLoading } = useQuery({
    queryKey: ['admin', 'categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    }
  });

  const createCategory = useCreateCategory();
  const updateCategory = useUpdateCategory();
  const deleteCategory = useDeleteCategory();
  const uploadImage = useUploadImage();

  const handleOpenForm = (category?: Category) => {
    if (category) {
      setFormData({
        name: category.name,
        name_ru: category.name_ru,
        slug: category.slug,
        image: category.image,
      });
      setEditId(category.id);
    } else {
      setFormData(initialFormData);
      setEditId(null);
    }
    setIsFormOpen(true);
    setUseImageUpload(false);
    setSelectedFile(null);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setFormData(initialFormData);
    setEditId(null);
    setUseImageUpload(false);
    setSelectedFile(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      let imageUrl = formData.image;

      // Если выбран файл для загрузки, сначала загружаем его
      if (useImageUpload && selectedFile) {
        const result = await uploadImage.mutateAsync({
          file: selectedFile,
          folder: 'categories'
        });
        imageUrl = result;
      }

      // Обновляем данные с учетом загруженного изображения (если есть)
      const updatedData = {
        ...formData,
        image: imageUrl
      };

      if (editId) {
        await updateCategory.mutateAsync({
          id: editId,
          data: updatedData
        });
      } else {
        await createCategory.mutateAsync(updatedData);
      }
      handleCloseForm();
    } catch (error) {
      console.error('Ошибка при сохранении категории:', error);
    }
  };

  const handleDeleteCategory = async (id: string) => {
    try {
      await deleteCategory.mutateAsync(id);
      setConfirmDelete(null);
    } catch (error) {
      console.error('Ошибка при удалении категории:', error);
    }
  };

  const isSubmitting = createCategory.isPending || updateCategory.isPending || uploadImage.isPending;
  const isDeleting = deleteCategory.isPending;

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-light">{t('admin.categories.title')}</h1>
        <Button onClick={() => handleOpenForm()}>{t('admin.categories.add')}</Button>
      </div>

      {isLoading ? (
        <div className="text-center py-12">{t('common.loading')}</div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-gray-100">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Изображение
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Название
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Слаг
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Действия
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {categories?.map((category) => (
                <tr key={category.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <img
                      src={category.image}
                      alt={category.name}
                      className="h-12 w-12 object-cover rounded"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-light text-gray-900">{category.name}</div>
                    <div className="text-sm text-gray-500">{category.name_ru}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{category.slug}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {confirmDelete === category.id ? (
                      <div className="flex items-center">
                        <span className="text-red-600 mr-2">Подтвердить удаление?</span>
                        <Button 
                          variant="text" 
                          className="mr-2 text-red-600" 
                          onClick={() => handleDeleteCategory(category.id)}
                          disabled={isDeleting}
                        >
                          {isDeleting ? <Loader size={16} className="animate-spin" /> : <Check size={16} />}
                        </Button>
                        <Button 
                          variant="text" 
                          onClick={() => setConfirmDelete(null)}
                        >
                          <X size={16} />
                        </Button>
                      </div>
                    ) : (
                      <>
                        <Button 
                          variant="text" 
                          className="mr-2"
                          onClick={() => handleOpenForm(category)}
                        >
                          <Pencil size={16} className="mr-1" /> {t('admin.categories.edit')}
                        </Button>
                        <Button 
                          variant="text" 
                          className="text-red-600"
                          onClick={() => setConfirmDelete(category.id)}
                        >
                          <Trash size={16} className="mr-1" /> {t('admin.categories.delete')}
                        </Button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {isFormOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-light">
                {editId ? t('admin.categories.edit') : t('admin.categories.add')}
              </h2>
              <Button variant="text" onClick={handleCloseForm}>
                <X size={20} />
              </Button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('admin.form.name')}
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('admin.form.name_ru')}
                  </label>
                  <input
                    type="text"
                    name="name_ru"
                    value={formData.name_ru}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('admin.form.slug')}
                  </label>
                  <input
                    type="text"
                    name="slug"
                    value={formData.slug}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded"
                    required
                  />
                </div>

                <div>
                  <div className="mb-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t('admin.form.image')}
                    </label>
                    
                    <div className="flex space-x-2 mb-2">
                      <Button 
                        type="button" 
                        variant={useImageUpload ? "outline" : "primary"}
                        size="sm"
                        className="text-xs"
                        onClick={() => setUseImageUpload(false)}
                      >
                        <LinkIcon size={14} className="mr-1" />
                        {t('admin.form.useImageUrl')}
                      </Button>
                      <Button 
                        type="button" 
                        variant={useImageUpload ? "primary" : "outline"}
                        size="sm"
                        className="text-xs"
                        onClick={() => setUseImageUpload(true)}
                      >
                        <Upload size={14} className="mr-1" />
                        {t('admin.form.useImageUpload')}
                      </Button>
                    </div>
                  </div>
                  
                  {useImageUpload ? (
                    <div className="border-2 border-dashed border-gray-300 rounded-md p-4 text-center">
                      <input
                        type="file"
                        id="file-upload"
                        className="hidden"
                        accept="image/*"
                        onChange={handleFileChange}
                      />
                      <label 
                        htmlFor="file-upload"
                        className="cursor-pointer block"
                      >
                        {selectedFile ? (
                          <div className="flex flex-col items-center">
                            <img 
                              src={URL.createObjectURL(selectedFile)} 
                              alt="Preview" 
                              className="h-32 w-32 object-cover mb-2 rounded" 
                            />
                            <span className="text-sm text-gray-500">
                              {selectedFile.name}
                            </span>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center">
                            <Upload className="h-10 w-10 text-gray-400 mb-2" />
                            <span className="text-sm text-gray-500">
                              {t('admin.form.dragAndDrop')}
                            </span>
                          </div>
                        )}
                      </label>
                    </div>
                  ) : (
                    <input
                      type="url"
                      name="image"
                      value={formData.image}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded"
                      required={!useImageUpload}
                    />
                  )}
                  
                  {formData.image && !useImageUpload && (
                    <div className="mt-2">
                      <img 
                        src={formData.image} 
                        alt="Preview" 
                        className="h-32 w-32 object-cover rounded" 
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-end">
                <Button 
                  type="button" 
                  variant="outline" 
                  className="mr-2"
                  onClick={handleCloseForm}
                >
                  {t('common.cancel')}
                </Button>
                <Button 
                  type="submit"
                  disabled={isSubmitting || (useImageUpload && !selectedFile && !formData.image)}
                >
                  {isSubmitting ? (
                    <Loader size={16} className="animate-spin mr-2" />
                  ) : null}
                  {t('common.save')}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminCategoriesPage;