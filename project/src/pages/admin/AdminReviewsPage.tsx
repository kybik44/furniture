import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import AdminLayout from '../../components/admin/AdminLayout';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../../lib/supabase';
import Button from '../../components/ui/Button';
import { format } from 'date-fns';
import { useApproveReview, useRejectReview, useDeleteReview, useUpdateReview, useCreateReview, useProducts } from '../../lib/hooks';
import { Check, X, Trash, Loader, Pencil } from 'lucide-react';
import { Review } from '../../lib/api';
import ImageUploader from '../../components/ui/ImageUploader';

type ReviewWithProduct = Review & {
  product: { name: string };
};

interface ReviewFormData {
  product_id: string;
  name: string;
  avatar: string;
  text: string;
  text_ru: string;
  rating: number;
  is_approved: boolean;
}

const initialFormData: ReviewFormData = {
  product_id: '',
  name: '',
  avatar: '',
  text: '',
  text_ru: '',
  rating: 5,
  is_approved: false
};

const AdminReviewsPage: React.FC = () => {
  const { t } = useTranslation();
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formData, setFormData] = useState<ReviewFormData>(initialFormData);
  const [editId, setEditId] = useState<string | null>(null);

  const { data: reviews, isLoading } = useQuery({
    queryKey: ['admin', 'reviews'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('reviews')
        .select(`
          *,
          product:products(name)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as ReviewWithProduct[];
    }
  });

  const { data: products } = useProducts();
  const approveReview = useApproveReview();
  const rejectReview = useRejectReview();
  const deleteReview = useDeleteReview();
  const updateReview = useUpdateReview();
  const createReview = useCreateReview();

  const handleApproveReview = async (id: string) => {
    try {
      await approveReview.mutateAsync(id);
    } catch (error) {
      console.error('Error approving review:', error);
    }
  };

  const handleRejectReview = async (id: string) => {
    try {
      await rejectReview.mutateAsync(id);
    } catch (error) {
      console.error('Error rejecting review:', error);
    }
  };

  const handleDeleteReview = async (id: string) => {
    try {
      await deleteReview.mutateAsync(id);
      setConfirmDelete(null);
    } catch (error) {
      console.error('Error deleting review:', error);
    }
  };

  const handleOpenForm = (review?: ReviewWithProduct) => {
    if (review) {
      setFormData({
        product_id: review.product_id,
        name: review.name,
        avatar: review.avatar,
        text: review.text,
        text_ru: review.text_ru,
        rating: review.rating,
        is_approved: review.is_approved
      });
      setEditId(review.id);
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
    } else if (name === 'rating') {
      setFormData(prev => ({ ...prev, [name]: parseInt(value) || 5 }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editId) {
        await updateReview.mutateAsync({
          id: editId,
          data: formData
        });
      } else {
        await createReview.mutateAsync(formData);
      }
      handleCloseForm();
    } catch (error) {
      console.error('Error saving review:', error);
    }
  };

  const isSubmitting = createReview.isPending || updateReview.isPending;
  const isDeleting = deleteReview.isPending;

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-light mb-8">{t('admin.reviews.title')}</h1>
        <Button onClick={() => handleOpenForm()}>{t('admin.reviews.add')}</Button>
      </div>

      {isLoading ? (
        <div className="text-center py-12">{t('common.loading')}</div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-gray-100">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rating
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Text
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {reviews?.map((review) => (
                <tr key={review.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <img
                        src={review.avatar}
                        alt={review.name}
                        className="h-8 w-8 rounded-full mr-3"
                      />
                      <div className="text-sm font-light text-gray-900">{review.name}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{review.product.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{review.rating}/5</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-500 max-w-xs truncate">{review.text}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {format(new Date(review.created_at), 'dd.MM.yyyy')}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2 py-1 text-xs rounded-full ${
                      review.is_approved 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {review.is_approved 
                        ? t('admin.reviews.approved') 
                        : t('admin.reviews.pending')
                      }
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {confirmDelete === review.id ? (
                      <div className="flex items-center">
                        <span className="text-red-600 mr-2">Подтвердить удаление?</span>
                        <Button 
                          variant="text" 
                          className="mr-2 text-red-600" 
                          onClick={() => handleDeleteReview(review.id)}
                          disabled={isDeleting}
                        >
                          {isDeleting ? (
                            <Loader size={16} className="animate-spin" />
                          ) : (
                            <Check size={16} />
                          )}
                        </Button>
                        <Button 
                          variant="text" 
                          onClick={() => setConfirmDelete(null)}
                        >
                          <X size={16} />
                        </Button>
                      </div>
                    ) : (
                      <div className="flex">
                        {!review.is_approved ? (
                          <Button 
                            variant="text" 
                            className="text-green-600 mr-2"
                            onClick={() => handleApproveReview(review.id)}
                            disabled={approveReview.isPending}
                          >
                            {approveReview.isPending ? (
                              <Loader size={16} className="animate-spin mr-1" />
                            ) : (
                              <Check size={16} className="mr-1" />
                            )}
                            {t('admin.reviews.approve')}
                          </Button>
                        ) : (
                          <Button 
                            variant="text" 
                            className="text-yellow-600 mr-2"
                            onClick={() => handleRejectReview(review.id)}
                            disabled={rejectReview.isPending}
                          >
                            {rejectReview.isPending ? (
                              <Loader size={16} className="animate-spin mr-1" />
                            ) : (
                              <X size={16} className="mr-1" />
                            )}
                            {t('admin.reviews.reject')}
                          </Button>
                        )}
                        <Button 
                          variant="text" 
                          className="mr-2"
                          onClick={() => handleOpenForm(review)}
                        >
                          <Pencil size={16} className="mr-1" />
                          {t('admin.reviews.edit')}
                        </Button>
                        <Button 
                          variant="text" 
                          className="text-red-600"
                          onClick={() => setConfirmDelete(review.id)}
                        >
                          <Trash size={16} className="mr-1" />
                          {t('admin.common.delete')}
                        </Button>
                      </div>
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
          <div className="bg-white p-6 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-light">
                {editId ? t('admin.reviews.edit') : t('admin.reviews.add')}
              </h2>
              <Button variant="text" onClick={handleCloseForm}>
                <X size={20} />
              </Button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('admin.form.product')}
                  </label>
                  <select
                    name="product_id"
                    value={formData.product_id}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded"
                    required
                  >
                    <option value="">-- {t('admin.form.selectProduct')} --</option>
                    {products?.map(product => (
                      <option key={product.id} value={product.id}>
                        {product.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('admin.form.rating')}
                  </label>
                  <select
                    name="rating"
                    value={formData.rating}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded"
                    required
                  >
                    <option value="1">1 - {t('admin.reviews.rating.poor')}</option>
                    <option value="2">2 - {t('admin.reviews.rating.fair')}</option>
                    <option value="3">3 - {t('admin.reviews.rating.average')}</option>
                    <option value="4">4 - {t('admin.reviews.rating.good')}</option>
                    <option value="5">5 - {t('admin.reviews.rating.excellent')}</option>
                  </select>
                </div>

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
                    {t('admin.form.avatar')}
                  </label>
                  <ImageUploader
                    value={formData.avatar}
                    onChange={(url) => setFormData(prev => ({ ...prev, avatar: url }))}
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('admin.form.text')}
                  </label>
                  <textarea
                    name="text"
                    value={formData.text}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded"
                    rows={4}
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('admin.form.text_ru')}
                  </label>
                  <textarea
                    name="text_ru"
                    value={formData.text_ru}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded"
                    rows={4}
                    required
                  />
                </div>

                <div>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      name="is_approved"
                      checked={formData.is_approved}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-blue-600"
                    />
                    <span className="text-sm font-medium text-gray-700">
                      {t('admin.form.isApproved')}
                    </span>
                  </label>
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

export default AdminReviewsPage;