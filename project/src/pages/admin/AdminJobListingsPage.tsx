import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import AdminLayout from '../../components/admin/AdminLayout';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { format } from 'date-fns';
import { useJobListings, useCreateJobListing, useUpdateJobListing, useDeleteJobListing, useJobApplicationsByJobListing, useUpdateJobApplicationStatus, useDeleteJobApplication } from '../../lib/hooks';
import { JobListing } from '../../lib/api';
import { Check, X, Trash, Edit, Loader, Plus, Users, Mail, Download, Eye } from 'lucide-react';

interface JobFormData {
  title: string;
  title_ru: string;
  type: string;
  type_ru: string;
  description: string;
  description_ru: string;
  location: string;
  is_active: boolean;
}

const AdminJobListingsPage: React.FC = () => {
  const { t } = useTranslation();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isApplicationsModalOpen, setIsApplicationsModalOpen] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [confirmDeleteApplication, setConfirmDeleteApplication] = useState<string | null>(null);
  const [formData, setFormData] = useState<JobFormData>({
    title: '',
    title_ru: '',
    type: '',
    type_ru: '',
    description: '',
    description_ru: '',
    location: '',
    is_active: true
  });
  const [editId, setEditId] = useState<string | null>(null);

  const { data: jobListings, isLoading } = useJobListings();
  const { data: applications, isLoading: isLoadingApplications } = useJobApplicationsByJobListing(
    selectedJobId || ''
  );
  const createJobListing = useCreateJobListing();
  const updateJobListing = useUpdateJobListing();
  const deleteJobListing = useDeleteJobListing();
  const updateApplicationStatus = useUpdateJobApplicationStatus();
  const deleteApplication = useDeleteJobApplication();

  const handleOpenForm = (job?: JobListing) => {
    if (job) {
      setFormData({
        title: job.title,
        title_ru: job.title_ru,
        type: job.type,
        type_ru: job.type_ru,
        description: job.description,
        description_ru: job.description_ru,
        location: job.location,
        is_active: job.is_active
      });
      setEditId(job.id);
    } else {
      setFormData({
        title: '',
        title_ru: '',
        type: '',
        type_ru: '',
        description: '',
        description_ru: '',
        location: '',
        is_active: true
      });
      setEditId(null);
    }
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditId(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editId) {
        await updateJobListing.mutateAsync({
          id: editId,
          data: formData
        });
      } else {
        await createJobListing.mutateAsync(formData);
      }
      handleCloseForm();
    } catch (error) {
      console.error('Error saving job listing:', error);
    }
  };

  const handleDeleteJobListing = async (id: string) => {
    try {
      await deleteJobListing.mutateAsync(id);
      setConfirmDelete(null);
    } catch (error) {
      console.error('Error deleting job listing:', error);
    }
  };

  const handleViewApplications = (jobId: string) => {
    setSelectedJobId(jobId);
    setIsApplicationsModalOpen(true);
  };

  const handleCloseApplicationsModal = () => {
    setIsApplicationsModalOpen(false);
    setSelectedJobId(null);
    setConfirmDeleteApplication(null);
  };

  const handleUpdateApplicationStatus = async (id: string, status: 'new' | 'viewed' | 'contacted' | 'rejected') => {
    try {
      await updateApplicationStatus.mutateAsync({ id, status });
    } catch (error) {
      console.error('Error updating application status:', error);
    }
  };

  const handleDeleteApplication = async (id: string) => {
    try {
      await deleteApplication.mutateAsync(id);
      setConfirmDeleteApplication(null);
    } catch (error) {
      console.error('Error deleting application:', error);
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'new': return t('admin.applications.statusNew', 'Новый');
      case 'viewed': return t('admin.applications.statusViewed', 'Просмотрено');
      case 'contacted': return t('admin.applications.statusContacted', 'Связались');
      case 'rejected': return t('admin.applications.statusRejected', 'Отказ');
      default: return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-800';
      case 'viewed': return 'bg-yellow-100 text-yellow-800';
      case 'contacted': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-light">{t('admin.jobListings.title', 'Вакансии')}</h1>
        <Button onClick={() => handleOpenForm()}>
          <Plus size={16} className="mr-2" />
          {t('admin.jobListings.addNew', 'Добавить вакансию')}
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
                  {t('admin.jobListings.title', 'Название')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('admin.jobListings.type', 'Тип')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('admin.jobListings.location', 'Место работы')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('admin.jobListings.status', 'Статус')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('admin.jobListings.created', 'Дата создания')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('admin.common.actions', 'Действия')}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {jobListings?.map((job) => (
                <tr key={job.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-light text-gray-900">{job.title}</div>
                    <div className="text-sm text-gray-500">{job.title_ru}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{job.type}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{job.location}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      job.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {job.is_active 
                        ? t('admin.jobListings.active', 'Активна') 
                        : t('admin.jobListings.inactive', 'Не активна')}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {format(new Date(job.created_at), 'dd.MM.yyyy')}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex space-x-2">
                      <Button 
                        variant="text" 
                        className="text-blue-600 flex items-center"
                        onClick={() => handleViewApplications(job.id)}
                      >
                        <Users size={16} className="mr-1" />
                        {t('admin.applications.viewApplications', 'Отклики')}
                      </Button>
                      
                      <Button 
                        variant="text" 
                        className="text-blue-600"
                        onClick={() => handleOpenForm(job)}
                      >
                        <Edit size={16} className="mr-1" />
                        {t('admin.common.edit', 'Редактировать')}
                      </Button>
                      
                      {confirmDelete === job.id ? (
                        <div className="flex items-center">
                          <span className="text-red-600 mr-2">Подтвердить удаление?</span>
                          <Button 
                            variant="text" 
                            className="mr-2 text-red-600" 
                            onClick={() => handleDeleteJobListing(job.id)}
                            disabled={deleteJobListing.isPending}
                          >
                            {deleteJobListing.isPending ? (
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
                          onClick={() => setConfirmDelete(job.id)}
                        >
                          <Trash size={16} className="mr-1" />
                          {t('admin.common.delete', 'Удалить')}
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {isFormOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-light mb-6">
              {editId ? t('admin.jobListings.edit', 'Редактировать вакансию') : t('admin.jobListings.create', 'Создать вакансию')}
            </h2>
            
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <Input
                  label={t('admin.jobListings.titleEn', 'Название (EN)')}
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  fullWidth
                />
                <Input
                  label={t('admin.jobListings.titleRu', 'Название (RU)')}
                  name="title_ru"
                  value={formData.title_ru}
                  onChange={handleInputChange}
                  required
                  fullWidth
                />
                <Input
                  label={t('admin.jobListings.typeEn', 'Тип (EN)')}
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  required
                  fullWidth
                />
                <Input
                  label={t('admin.jobListings.typeRu', 'Тип (RU)')}
                  name="type_ru"
                  value={formData.type_ru}
                  onChange={handleInputChange}
                  required
                  fullWidth
                />
                <Input
                  label={t('admin.jobListings.location', 'Место работы')}
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  required
                  fullWidth
                />
                <div className="flex items-center space-x-2 mt-8">
                  <input
                    type="checkbox"
                    id="is_active"
                    name="is_active"
                    checked={formData.is_active}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-black focus:ring-black border-gray-300 rounded"
                  />
                  <label htmlFor="is_active" className="text-sm font-light text-gray-700">
                    {t('admin.jobListings.isActive', 'Активная вакансия')}
                  </label>
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-light text-gray-700 mb-1">
                  {t('admin.jobListings.descriptionEn', 'Описание (EN)')}
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={5}
                  className="w-full border-b border-gray-300 py-2 px-4 font-light focus:outline-none focus:border-black transition-colors"
                  required
                ></textarea>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-light text-gray-700 mb-1">
                  {t('admin.jobListings.descriptionRu', 'Описание (RU)')}
                </label>
                <textarea
                  name="description_ru"
                  value={formData.description_ru}
                  onChange={handleInputChange}
                  rows={5}
                  className="w-full border-b border-gray-300 py-2 px-4 font-light focus:outline-none focus:border-black transition-colors"
                  required
                ></textarea>
              </div>

              <div className="flex justify-end space-x-3">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={handleCloseForm}
                >
                  {t('common.cancel', 'Отмена')}
                </Button>
                <Button 
                  type="submit"
                  disabled={createJobListing.isPending || updateJobListing.isPending}
                >
                  {(createJobListing.isPending || updateJobListing.isPending) ? (
                    <span className="flex items-center">
                      <Loader size={16} className="animate-spin mr-2" />
                      {t('common.saving', 'Сохранение...')}
                    </span>
                  ) : (
                    t('common.save', 'Сохранить')
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isApplicationsModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-full max-w-5xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-light">
                {t('admin.applications.title', 'Отклики на вакансию')}
              </h2>
              <Button 
                variant="text" 
                onClick={handleCloseApplicationsModal}
              >
                <X size={20} />
              </Button>
            </div>
            
            {isLoadingApplications ? (
              <div className="text-center py-12">
                <Loader size={24} className="animate-spin mx-auto" />
                <p className="mt-2">{t('common.loading')}</p>
              </div>
            ) : applications && applications.length > 0 ? (
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('admin.applications.name', 'Имя')}
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('admin.applications.contacts', 'Контакты')}
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('admin.applications.resume', 'Резюме')}
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('admin.applications.date', 'Дата')}
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('admin.applications.status', 'Статус')}
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('admin.common.actions', 'Действия')}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {applications.map((application) => (
                    <tr key={application.id}>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="text-sm font-light text-gray-900">{application.name}</div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="text-sm text-gray-900">{application.email}</div>
                        <div className="text-sm text-gray-500">{application.phone}</div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center">
                          <a 
                            href={application.resume_url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex items-center text-blue-600 hover:underline text-sm"
                          >
                            <Download size={14} className="mr-1" />
                            {t('admin.applications.downloadResume', 'Скачать')}
                          </a>
                          {application.cover_letter && (
                            <button
                              onClick={() => alert(application.cover_letter)}
                              className="ml-3 flex items-center text-blue-600 hover:underline text-sm"
                            >
                              <Eye size={14} className="mr-1" />
                              {t('admin.applications.viewCoverLetter', 'Письмо')}
                            </button>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {format(new Date(application.created_at), 'dd.MM.yyyy')}
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(application.status)}`}>
                          {getStatusLabel(application.status)}
                        </span>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="flex flex-col space-y-2">
                          <div className="flex space-x-2">
                            <select
                              value={application.status}
                              onChange={(e) => handleUpdateApplicationStatus(application.id, e.target.value as 'new' | 'viewed' | 'contacted' | 'rejected')}
                              className="text-sm border-gray-300 rounded"
                            >
                              <option value="new">{t('admin.applications.statusNew', 'Новый')}</option>
                              <option value="viewed">{t('admin.applications.statusViewed', 'Просмотрено')}</option>
                              <option value="contacted">{t('admin.applications.statusContacted', 'Связались')}</option>
                              <option value="rejected">{t('admin.applications.statusRejected', 'Отказ')}</option>
                            </select>
                            
                            <a
                              href={`mailto:${application.email}`}
                              className="flex items-center text-blue-600 hover:text-blue-800 text-sm bg-blue-50 px-2 py-1 rounded"
                            >
                              <Mail size={14} className="mr-1" />
                              {t('admin.applications.contact', 'Связаться')}
                            </a>
                          </div>
                          
                          {confirmDeleteApplication === application.id ? (
                            <div className="flex items-center">
                              <Button 
                                variant="text" 
                                className="mr-2 text-red-600" 
                                onClick={() => handleDeleteApplication(application.id)}
                                disabled={deleteApplication.isPending}
                              >
                                {deleteApplication.isPending ? (
                                  <Loader size={16} className="animate-spin" />
                                ) : (
                                  <Check size={16} />
                                )}
                              </Button>
                              <Button 
                                variant="text" 
                                onClick={() => setConfirmDeleteApplication(null)}
                              >
                                <X size={16} />
                              </Button>
                            </div>
                          ) : (
                            <Button
                              variant="text"
                              className="text-red-600 text-sm justify-start"
                              onClick={() => setConfirmDeleteApplication(application.id)}
                            >
                              <Trash size={14} className="mr-1" />
                              {t('admin.common.delete', 'Удалить')}
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-600">
                  {t('admin.applications.noApplications', 'На эту вакансию еще нет откликов')}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminJobListingsPage; 