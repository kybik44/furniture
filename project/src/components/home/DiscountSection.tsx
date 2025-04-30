import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { useTranslation } from 'react-i18next';
import { useSubscribe } from '../../lib/hooks';
import { generateDiscountCode } from '../../lib/helpers';
import { sendDiscountCode } from '../../services/emailService';
import { subscriberApi } from '../../lib/api';
import { Loader } from 'lucide-react';

const DiscountSection: React.FC = () => {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [discountCode, setDiscountCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const subscribe = useSubscribe();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      // Проверка, существует ли уже подписчик с таким email
      const existingSubscriber = await subscriberApi.findByEmail(email);
      
      if (existingSubscriber) {
        // Если подписчик существует, отправляем его существующий код
        await sendDiscountCode(name, email, existingSubscriber.discount_code);
        setDiscountCode(existingSubscriber.discount_code);
      } else {
        // Если это новый подписчик, генерируем новый код и сохраняем
        const newDiscountCode = generateDiscountCode();
        await subscribe.mutateAsync({ name, email, discountCode: newDiscountCode });
        await sendDiscountCode(name, email, newDiscountCode);
        setDiscountCode(newDiscountCode);
      }
      
      setSubmitted(true);
    } catch (err) {
      console.error('Error subscribing:', err);
      setError(t('common.error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-16 md:py-24 bg-gray-50">
      <div className="container mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="h-full"
          >
            <img
              src="https://images.pexels.com/photos/4050318/pexels-photo-4050318.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
              alt="Elegant living room furniture"
              className="w-full h-full object-cover"
            />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="bg-white p-8 md:p-12"
          >
            {!submitted ? (
              <>
                <h2 className="text-2xl md:text-3xl font-light mb-6">{t('home.discount.title')}</h2>
                <p className="text-gray-600 font-light mb-8">
                  {t('home.discount.subtitle')}
                </p>
                {error && (
                  <div className="bg-red-50 p-4 mb-4 text-red-600 text-sm">
                    {error}
                  </div>
                )}
                <form onSubmit={handleSubmit}>
                  <Input
                    type="text"
                    placeholder={t('home.discount.name')}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    fullWidth
                    required
                    className="mb-4"
                    disabled={loading}
                  />
                  <Input
                    type="email"
                    placeholder={t('home.discount.email')}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    fullWidth
                    required
                    className="mb-6"
                    disabled={loading}
                  />
                  <Button type="submit" variant="primary" fullWidth disabled={loading}>
                    {loading ? (
                      <span className="flex items-center justify-center">
                        <Loader size={16} className="animate-spin mr-2" />
                        {t('common.loading')}
                      </span>
                    ) : (
                      t('home.discount.subscribe')
                    )}
                  </Button>
                </form>
              </>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-8"
              >
                <h2 className="text-2xl md:text-3xl font-light mb-6">{t('home.discount.success.title')}</h2>
                <p className="text-gray-600 font-light mb-4">
                  {t('home.discount.success.message')}
                </p>
                <p className="text-sm text-gray-500 mb-6">
                  {t('home.discount.success.check')}
                </p>
                
                <div className="bg-gray-50 p-4 mb-4 rounded-md">
                  <p className="text-sm text-gray-500 mb-1">{t('Ваш код скидки:')}</p>
                  <p className="text-lg font-semibold letter-spacing-2">{discountCode}</p>
                </div>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default DiscountSection;