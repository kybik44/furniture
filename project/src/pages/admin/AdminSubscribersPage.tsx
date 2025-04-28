import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import AdminLayout from '../../components/admin/AdminLayout';
import Button from '../../components/ui/Button';
import { format } from 'date-fns';
import { useSubscribers, useDeleteSubscriber } from '../../lib/hooks';
import { Check, X, Trash, Loader, Download } from 'lucide-react';

const AdminSubscribersPage: React.FC = () => {
  const { t } = useTranslation();
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const { data: subscribers, isLoading } = useSubscribers();
  const deleteSubscriber = useDeleteSubscriber();

  const handleDeleteSubscriber = async (id: string) => {
    try {
      await deleteSubscriber.mutateAsync(id);
      setConfirmDelete(null);
    } catch (error) {
      console.error('Error deleting subscriber:', error);
    }
  };

  const handleExportCSV = () => {
    if (!subscribers || subscribers.length === 0) return;

    // Подготовка данных для CSV
    const csvContent = [
      // Заголовки
      ['Name', 'Email', 'Signup Date'].join(','),
      // Данные
      ...subscribers.map(subscriber => [
        subscriber.name,
        subscriber.email,
        format(new Date(subscriber.created_at), 'dd.MM.yyyy')
      ].join(','))
    ].join('\n');

    // Создание ссылки для скачивания
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `subscribers_${format(new Date(), 'yyyyMMdd')}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-light">{t('admin.subscribers.title')}</h1>
        <Button onClick={handleExportCSV}>
          <Download size={16} className="mr-2" />
          {t('admin.subscribers.export')}
        </Button>
      </div>

      {isLoading ? (
        <div className="text-center py-12">{t('common.loading')}</div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-gray-100">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
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
              {subscribers?.map((subscriber) => (
                <tr key={subscriber.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-light text-gray-900">{subscriber.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{subscriber.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {format(new Date(subscriber.created_at), 'dd.MM.yyyy')}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {confirmDelete === subscriber.id ? (
                      <div className="flex items-center">
                        <span className="text-red-600 mr-2">Подтвердить удаление?</span>
                        <Button 
                          variant="text" 
                          className="mr-2 text-red-600" 
                          onClick={() => handleDeleteSubscriber(subscriber.id)}
                          disabled={deleteSubscriber.isPending}
                        >
                          {deleteSubscriber.isPending ? (
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
                      <Button
                        variant="text"
                        className="text-red-600"
                        onClick={() => setConfirmDelete(subscriber.id)}
                      >
                        <Trash size={16} className="mr-1" />
                        {t('admin.common.delete')}
                      </Button>
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

export default AdminSubscribersPage;