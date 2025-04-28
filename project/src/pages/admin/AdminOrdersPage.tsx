import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import AdminLayout from '../../components/admin/AdminLayout';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../../lib/supabase';
import { format } from 'date-fns';
import { useUpdateOrder, useDeleteOrder } from '../../lib/hooks';
import { Check, X, Trash, Loader, Edit } from 'lucide-react';
import Button from '../../components/ui/Button';

interface StatusOption {
  value: string;
  label: string;
  color: string;
}

const AdminOrdersPage: React.FC = () => {
  const { t } = useTranslation();
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [editStatusId, setEditStatusId] = useState<string | null>(null);
  const [newStatus, setNewStatus] = useState<string>('');

  const { data: orders, isLoading } = useQuery({
    queryKey: ['admin', 'orders'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    }
  });

  const updateOrder = useUpdateOrder();
  const deleteOrder = useDeleteOrder();

  const statusOptions: StatusOption[] = [
    { value: 'new', label: t('admin.orders.status.new'), color: 'bg-blue-100 text-blue-800' },
    { value: 'processing', label: t('admin.orders.status.processing'), color: 'bg-yellow-100 text-yellow-800' },
    { value: 'completed', label: t('admin.orders.status.completed'), color: 'bg-green-100 text-green-800' },
    { value: 'cancelled', label: t('admin.orders.status.cancelled'), color: 'bg-red-100 text-red-800' }
  ];

  const getStatusColor = (status: string) => {
    const option = statusOptions.find(opt => opt.value === status);
    return option?.color || 'bg-gray-100 text-gray-800';
  };

  const handleUpdateStatus = async (id: string) => {
    try {
      await updateOrder.mutateAsync({
        id,
        data: { status: newStatus }
      });
      setEditStatusId(null);
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  const handleDeleteOrder = async (id: string) => {
    try {
      await deleteOrder.mutateAsync(id);
      setConfirmDelete(null);
    } catch (error) {
      console.error('Error deleting order:', error);
    }
  };

  const startEditStatus = (order: any) => {
    setEditStatusId(order.id);
    setNewStatus(order.status);
  };

  return (
    <AdminLayout>
      <h1 className="text-2xl font-light mb-8">{t('admin.orders.title')}</h1>

      {isLoading ? (
        <div className="text-center py-12">{t('common.loading')}</div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-gray-100">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {orders?.map((order) => (
                <tr key={order.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-light text-gray-900">
                      {order.id.slice(0, 8)}...
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-light text-gray-900">
                      {order.first_name} {order.last_name}
                    </div>
                    <div className="text-sm text-gray-500">{order.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {editStatusId === order.id ? (
                      <div className="flex items-center">
                        <select
                          value={newStatus}
                          onChange={(e) => setNewStatus(e.target.value)}
                          className="mr-2 text-xs p-1 border border-gray-300 rounded"
                        >
                          {statusOptions.map(option => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                        <Button
                          variant="text"
                          className="text-green-600 mr-1"
                          onClick={() => handleUpdateStatus(order.id)}
                          disabled={updateOrder.isPending}
                        >
                          {updateOrder.isPending ? (
                            <Loader size={16} className="animate-spin" />
                          ) : (
                            <Check size={16} />
                          )}
                        </Button>
                        <Button
                          variant="text"
                          onClick={() => setEditStatusId(null)}
                        >
                          <X size={16} />
                        </Button>
                      </div>
                    ) : (
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${getStatusColor(order.status)}`}
                      >
                        {t(`admin.orders.status.${order.status}`)}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">${order.total_amount}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {format(new Date(order.created_at), 'dd.MM.yyyy HH:mm')}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {confirmDelete === order.id ? (
                      <div className="flex items-center">
                        <span className="text-red-600 mr-2">Подтвердить удаление?</span>
                        <Button 
                          variant="text" 
                          className="mr-2 text-red-600" 
                          onClick={() => handleDeleteOrder(order.id)}
                          disabled={deleteOrder.isPending}
                        >
                          {deleteOrder.isPending ? (
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
                        <Button
                          variant="text"
                          className="mr-2"
                          onClick={() => startEditStatus(order)}
                        >
                          <Edit size={16} className="mr-1" />
                          {t('admin.orders.changeStatus')}
                        </Button>
                        <Button
                          variant="text"
                          className="text-red-600"
                          onClick={() => setConfirmDelete(order.id)}
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
    </AdminLayout>
  );
};

export default AdminOrdersPage;