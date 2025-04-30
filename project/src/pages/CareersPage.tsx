import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Layout from '../components/layout/Layout';
import { useTranslation } from 'react-i18next';
import Button from '../components/ui/Button';
import { useActiveJobListings, useCreateJobApplication } from '../lib/hooks';
import { getLocalizedValue } from '../lib/helpers';
import Input from '../components/ui/Input';
import Modal from '../components/ui/Modal';
import { Loader } from 'lucide-react';

// Интерфейс для формы отклика
interface ApplicationFormData {
  name: string;
  email: string;
  phone: string;
  resume_url: string;
  cover_letter: string;
}

const CareersPage: React.FC = () => {
  const { t } = useTranslation();
  const { data: jobListings, isLoading } = useActiveJobListings();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState<string>('');
  const [formData, setFormData] = useState<ApplicationFormData>({
    name: '',
    email: '',
    phone: '',
    resume_url: '',
    cover_letter: '',
  });
  const [successMessage, setSuccessMessage] = useState('');
  const createApplication = useCreateJobApplication();

  const handleApply = (jobId: string) => {
    setSelectedJobId(jobId);
    setIsModalOpen(true);
    setSuccessMessage('');
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedJobId('');
    // Очищаем форму при закрытии модального окна
    setFormData({
      name: '',
      email: '',
      phone: '',
      resume_url: '',
      cover_letter: '',
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await createApplication.mutateAsync({
        job_listing_id: selectedJobId,
        ...formData
      });
      
      setSuccessMessage(t('careers.application.success', 'Ваше резюме успешно отправлено! Мы свяжемся с вами в ближайшее время.'));
      setFormData({
        name: '',
        email: '',
        phone: '',
        resume_url: '',
        cover_letter: '',
      });
    } catch (error) {
      console.error('Error submitting job application:', error);
    }
  };

  return (
    <Layout>
      {/* Заголовок */}
      <section className="pt-16 md:pt-24">
        <div className="container mx-auto px-4 md:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl mx-auto text-center mb-12"
          >
            <h1 className="text-3xl md:text-4xl font-light mb-6">{t('careers.title')}</h1>
            <p className="text-gray-600 font-light leading-relaxed">
              {t('careers.subtitle')}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Почему стоит работать с нами */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <img
                src="https://images.pexels.com/photos/1109541/pexels-photo-1109541.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                alt="Команда LegnoVivo за работой"
                className="w-full h-auto rounded-lg"
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <h2 className="text-2xl md:text-3xl font-light mb-6">{t('careers.whyJoin.title')}</h2>
              <p className="text-gray-600 font-light mb-4 leading-relaxed">
                {t('careers.whyJoin.text1')}
              </p>
              <p className="text-gray-600 font-light mb-4 leading-relaxed">
                {t('careers.whyJoin.text2')}
              </p>
              <p className="text-gray-600 font-light leading-relaxed">
                {t('careers.whyJoin.text3')}
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Наши преимущества */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="container mx-auto px-4 md:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-2xl md:text-3xl font-light mb-6">{t('careers.benefits.title')}</h2>
            <p className="text-gray-600 font-light max-w-2xl mx-auto">
              {t('careers.benefits.subtitle')}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Преимущество 1 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="bg-white p-8 rounded-lg"
            >
              <h3 className="text-xl font-light mb-4">{t('careers.benefits.benefit1.title')}</h3>
              <p className="text-gray-600 font-light">
                {t('careers.benefits.benefit1.text')}
              </p>
            </motion.div>

            {/* Преимущество 2 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white p-8 rounded-lg"
            >
              <h3 className="text-xl font-light mb-4">{t('careers.benefits.benefit2.title')}</h3>
              <p className="text-gray-600 font-light">
                {t('careers.benefits.benefit2.text')}
              </p>
            </motion.div>

            {/* Преимущество 3 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-white p-8 rounded-lg"
            >
              <h3 className="text-xl font-light mb-4">{t('careers.benefits.benefit3.title')}</h3>
              <p className="text-gray-600 font-light">
                {t('careers.benefits.benefit3.text')}
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Открытые вакансии */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-2xl md:text-3xl font-light mb-6">{t('careers.openings.title')}</h2>
            <p className="text-gray-600 font-light max-w-2xl mx-auto">
              {t('careers.openings.subtitle')}
            </p>
          </motion.div>

          <div className="space-y-6 max-w-3xl mx-auto">
            {isLoading ? (
              <div className="text-center py-12">{t('common.loading')}</div>
            ) : jobListings && jobListings.length > 0 ? (
              jobListings.map((job, index) => (
                <motion.div
                  key={job.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="bg-white p-6 rounded-lg border border-gray-200"
                >
                  <h3 className="text-xl font-light mb-2">{getLocalizedValue(job.title, job.title_ru)}</h3>
                  <p className="text-gray-500 font-light mb-4">{getLocalizedValue(job.type, job.type_ru)}</p>
                  <p className="text-gray-600 font-light mb-4">
                    {getLocalizedValue(job.description, job.description_ru)}
                  </p>
                  <Button onClick={() => handleApply(job.id)}>
                    {t('careers.openings.applyButton')}
                  </Button>
                </motion.div>
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-600 font-light">{t('careers.openings.noOpenings')}</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Модальное окно для отклика на вакансию */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={
          successMessage 
            ? t('careers.application.thankYou', 'Спасибо за отклик!')
            : t('careers.application.title', 'Откликнуться на вакансию')
        }
      >
        {successMessage ? (
          <div className="text-center py-4">
            <p className="text-gray-600 mb-6">{successMessage}</p>
            <Button onClick={handleCloseModal}>
              {t('common.close', 'Закрыть')}
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <Input
              label={t('careers.application.name', 'Ваше имя')}
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              fullWidth
              className="mb-4"
            />
            <Input
              label={t('careers.application.email', 'Email')}
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              fullWidth
              className="mb-4"
            />
            <Input
              label={t('careers.application.phone', 'Телефон')}
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              required
              fullWidth
              className="mb-4"
            />
            <Input
              label={t('careers.application.resumeUrl', 'Ссылка на резюме')}
              type="url"
              name="resume_url"
              placeholder="https://..."
              value={formData.resume_url}
              onChange={handleInputChange}
              required
              fullWidth
              className="mb-4"
            />
            <div className="mb-6">
              <label className="block text-sm font-light text-gray-700 mb-1">
                {t('careers.application.coverLetter', 'Сопроводительное письмо')}
              </label>
              <textarea
                name="cover_letter"
                value={formData.cover_letter}
                onChange={handleInputChange}
                rows={5}
                className="w-full border-b border-gray-300 py-2 px-4 font-light focus:outline-none focus:border-black transition-colors"
              ></textarea>
            </div>
            <div className="flex justify-end space-x-3">
              <Button 
                type="button" 
                variant="outline" 
                onClick={handleCloseModal}
              >
                {t('common.cancel', 'Отмена')}
              </Button>
              <Button 
                type="submit"
                disabled={createApplication.isPending}
              >
                {createApplication.isPending ? (
                  <span className="flex items-center">
                    <Loader size={16} className="animate-spin mr-2" />
                    {t('common.sending', 'Отправка...')}
                  </span>
                ) : (
                  t('careers.application.submit', 'Отправить')
                )}
              </Button>
            </div>
          </form>
        )}
      </Modal>
    </Layout>
  );
};

export default CareersPage; 