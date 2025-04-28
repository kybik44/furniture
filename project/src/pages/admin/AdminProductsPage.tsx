import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import AdminLayout from '../../components/admin/AdminLayout';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../../lib/supabase';
import Button from '../../components/ui/Button';
import { useCreateProduct, useUpdateProduct, useDeleteProduct, useCategories } from '../../lib/hooks';
import { Pencil, Trash, X, Check, Loader, Plus } from 'lucide-react';
import { Product } from '../../lib/api';
import ImageUploader from '../../components/ui/ImageUploader';

type ProductWithCategory = Product & {
  category: { name: string };
};

interface ProductFormData {
  name: string;
  name_ru: string;
  description: string;
  description_ru: string;
  short_description: string;
  short_description_ru: string;
  price: number;
  category_id: string;
  images: string[];
  materials: string[];
  materials_ru: string[];
  dimensions: {
    width: number;
    height: number;
    depth: number;
  };
  is_bestseller: boolean;
}

const initialFormData: ProductFormData = {
  name: '',
  name_ru: '',
  description: '',
  description_ru: '',
  short_description: '',
  short_description_ru: '',
  price: 0,
  category_id: '',
  images: [''],
  materials: [''],
  materials_ru: [''],
  dimensions: {
    width: 0,
    height: 0,
    depth: 0
  },
  is_bestseller: false
};

const AdminProductsPage: React.FC = () => {
  const { t } = useTranslation();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formData, setFormData] = useState<ProductFormData>(initialFormData);
  const [editId, setEditId] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const { data: products, isLoading } = useQuery({
    queryKey: ['admin', 'products'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          category:categories(name)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as ProductWithCategory[];
    }
  });

  const { data: categories } = useCategories();
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();
  const deleteProduct = useDeleteProduct();

  const handleOpenForm = (product?: ProductWithCategory) => {
    if (product) {
      setFormData({
        name: product.name,
        name_ru: product.name_ru,
        description: product.description,
        description_ru: product.description_ru,
        short_description: product.short_description,
        short_description_ru: product.short_description_ru,
        price: product.price,
        category_id: product.category_id,
        images: product.images,
        materials: product.materials,
        materials_ru: product.materials_ru,
        dimensions: product.dimensions as { width: number; height: number; depth: number },
        is_bestseller: product.is_bestseller
      });
      setEditId(product.id);
    } else {
      setFormData(initialFormData);
      setEditId(null);
    }
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setFormData(initialFormData);
    setEditId(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else if (name === 'price') {
      setFormData(prev => ({ ...prev, [name]: parseFloat(value) || 0 }));
    } else if (name.startsWith('dimensions.')) {
      const dimensionKey = name.split('.')[1] as 'width' | 'height' | 'depth';
      setFormData(prev => ({
        ...prev,
        dimensions: {
          ...prev.dimensions,
          [dimensionKey]: parseFloat(value) || 0
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };
  
  const handleImageChange = (index: number, url: string) => {
    setFormData(prev => {
      const newImages = [...prev.images];
      newImages[index] = url;
      return { ...prev, images: newImages };
    });
  };
  
  const handleAddImage = () => {
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, '']
    }));
  };
  
  const handleRemoveImage = (index: number) => {
    setFormData(prev => {
      const newImages = [...prev.images];
      newImages.splice(index, 1);
      return { ...prev, images: newImages.length ? newImages : [''] };
    });
  };
  
  const handleArrayInputChange = (index: number, field: keyof Pick<ProductFormData, 'materials' | 'materials_ru'>, value: string) => {
    setFormData(prev => {
      const newArray = [...prev[field]];
      newArray[index] = value;
      return { ...prev, [field]: newArray };
    });
  };
  
  const handleAddArrayItem = (field: keyof Pick<ProductFormData, 'materials' | 'materials_ru'>) => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], '']
    }));
  };
  
  const handleRemoveArrayItem = (index: number, field: keyof Pick<ProductFormData, 'materials' | 'materials_ru'>) => {
    setFormData(prev => {
      const newArray = [...prev[field]];
      newArray.splice(index, 1);
      return { ...prev, [field]: newArray.length ? newArray : [''] };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Filter out empty strings from arrays
    const cleanedData = {
      ...formData,
      images: formData.images.filter(img => img.trim() !== ''),
      materials: formData.materials.filter(mat => mat.trim() !== ''),
      materials_ru: formData.materials_ru.filter(mat => mat.trim() !== ''),
    };
    
    try {
      if (editId) {
        await updateProduct.mutateAsync({
          id: editId,
          data: cleanedData
        });
      } else {
        await createProduct.mutateAsync(cleanedData);
      }
      handleCloseForm();
    } catch (error) {
      console.error('Error saving product:', error);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    try {
      await deleteProduct.mutateAsync(id);
      setConfirmDelete(null);
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  const isSubmitting = createProduct.isPending || updateProduct.isPending;
  const isDeleting = deleteProduct.isPending;

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-light">{t('admin.products.title')}</h1>
        <Button onClick={() => handleOpenForm()}>{t('admin.products.add')}</Button>
      </div>

      {isLoading ? (
        <div className="text-center py-12">{t('common.loading')}</div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-gray-100">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Image
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {products?.map((product) => (
                <tr key={product.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="h-12 w-12 object-cover rounded"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-light text-gray-900">{product.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{product.category.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">${product.price}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {confirmDelete === product.id ? (
                      <div className="flex items-center">
                        <span className="text-red-600 mr-2">Подтвердить удаление?</span>
                        <Button 
                          variant="text" 
                          className="mr-2 text-red-600" 
                          onClick={() => handleDeleteProduct(product.id)}
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
                          onClick={() => handleOpenForm(product)}
                        >
                          <Pencil size={16} className="mr-1" /> {t('admin.products.edit')}
                        </Button>
                        <Button 
                          variant="text" 
                          className="text-red-600"
                          onClick={() => setConfirmDelete(product.id)}
                        >
                          <Trash size={16} className="mr-1" /> {t('admin.products.delete')}
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
          <div className="bg-white p-6 rounded-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-light">
                {editId ? t('admin.products.edit') : t('admin.products.add')}
              </h2>
              <Button variant="text" onClick={handleCloseForm}>
                <X size={20} />
              </Button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
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
                    {t('admin.form.category')}
                  </label>
                  <select
                    name="category_id"
                    value={formData.category_id}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded"
                    required
                  >
                    <option value="">-- {t('admin.form.selectCategory')} --</option>
                    {categories?.map(category => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('admin.form.price')}
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded"
                    min="0"
                    step="0.01"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('admin.form.shortDescription')}
                  </label>
                  <textarea
                    name="short_description"
                    value={formData.short_description}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded"
                    rows={2}
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('admin.form.shortDescription_ru')}
                  </label>
                  <textarea
                    name="short_description_ru"
                    value={formData.short_description_ru}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded"
                    rows={2}
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('admin.form.description')}
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded"
                    rows={4}
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('admin.form.description_ru')}
                  </label>
                  <textarea
                    name="description_ru"
                    value={formData.description_ru}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded"
                    rows={4}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('admin.form.dimensions')}
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">
                        {t('admin.form.width')}
                      </label>
                      <input
                        type="number"
                        name="dimensions.width"
                        value={formData.dimensions.width}
                        onChange={handleInputChange}
                        className="w-full p-2 border border-gray-300 rounded"
                        min="0"
                        step="0.1"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">
                        {t('admin.form.height')}
                      </label>
                      <input
                        type="number"
                        name="dimensions.height"
                        value={formData.dimensions.height}
                        onChange={handleInputChange}
                        className="w-full p-2 border border-gray-300 rounded"
                        min="0"
                        step="0.1"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">
                        {t('admin.form.depth')}
                      </label>
                      <input
                        type="number"
                        name="dimensions.depth"
                        value={formData.dimensions.depth}
                        onChange={handleInputChange}
                        className="w-full p-2 border border-gray-300 rounded"
                        min="0"
                        step="0.1"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      name="is_bestseller"
                      checked={formData.is_bestseller}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-blue-600"
                    />
                    <span className="text-sm font-medium text-gray-700">
                      {t('admin.form.isBestseller')}
                    </span>
                  </label>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    {t('admin.form.images')}
                  </label>
                  {formData.images.map((imageUrl, index) => (
                    <div key={index} className="mb-6 pb-6 border-b border-gray-200">
                      <div className="flex justify-between items-center mb-3">
                        <h4 className="text-sm font-medium">
                          {t('admin.form.images')} #{index + 1}
                        </h4>
                        {formData.images.length > 1 && (
                          <Button
                            type="button"
                            variant="text"
                            className="text-red-600"
                            onClick={() => handleRemoveImage(index)}
                          >
                            <X size={16} className="mr-1" />
                            {t('common.delete')}
                          </Button>
                        )}
                      </div>
                      <ImageUploader
                        value={imageUrl}
                        onChange={(url) => handleImageChange(index, url)}
                      />
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    className="mt-2"
                    onClick={handleAddImage}
                  >
                    <Plus size={16} className="mr-2" />
                    {t('admin.form.addImage')}
                  </Button>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('admin.form.materials')}
                  </label>
                  {formData.materials.map((material, index) => (
                    <div key={index} className="flex items-center mb-2">
                      <input
                        type="text"
                        value={material}
                        onChange={(e) => handleArrayInputChange(index, 'materials', e.target.value)}
                        className="flex-1 p-2 border border-gray-300 rounded mr-2"
                      />
                      <Button
                        type="button"
                        variant="text"
                        className="text-red-600"
                        onClick={() => handleRemoveArrayItem(index, 'materials')}
                      >
                        <X size={16} />
                      </Button>
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    className="mt-2"
                    onClick={() => handleAddArrayItem('materials')}
                  >
                    <Plus size={16} className="mr-2" />
                    {t('admin.form.addMaterial')}
                  </Button>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('admin.form.materials_ru')}
                  </label>
                  {formData.materials_ru.map((material, index) => (
                    <div key={index} className="flex items-center mb-2">
                      <input
                        type="text"
                        value={material}
                        onChange={(e) => handleArrayInputChange(index, 'materials_ru', e.target.value)}
                        className="flex-1 p-2 border border-gray-300 rounded mr-2"
                      />
                      <Button
                        type="button"
                        variant="text"
                        className="text-red-600"
                        onClick={() => handleRemoveArrayItem(index, 'materials_ru')}
                      >
                        <X size={16} />
                      </Button>
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    className="mt-2"
                    onClick={() => handleAddArrayItem('materials_ru')}
                  >
                    <Plus size={16} className="mr-2" />
                    {t('admin.form.addMaterial')}
                  </Button>
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
                  disabled={isSubmitting}
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

export default AdminProductsPage;