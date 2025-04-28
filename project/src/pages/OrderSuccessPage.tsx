import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import Layout from '../components/layout/Layout';
import Button from '../components/ui/Button';
import { CheckCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const OrderSuccessPage: React.FC = () => {
  const { t } = useTranslation();
  const location = useLocation();
  
  // Получаем id заказа из состояния навигации или генерируем префикс для отображения
  const orderId = location.state?.orderId || '';
  const orderNumber = orderId ? `LV-${orderId.substring(0, 8)}` : `LV-${Math.floor(100000 + Math.random() * 900000)}`;
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <Layout>
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="py-16 md:py-24"
      >
        <div className="container mx-auto px-4 md:px-8 max-w-2xl text-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-green-500 mb-6 flex justify-center"
          >
            <CheckCircle size={80} />
          </motion.div>
          
          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-3xl md:text-4xl font-light mb-4"
          >
            {t('orderSuccess.title')}
          </motion.h1>
          
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-gray-600 mb-8"
          >
            {t('orderSuccess.subtitle')}
          </motion.p>
          
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="bg-gray-50 p-8 mb-8"
          >
            <h2 className="text-xl font-light mb-4">{t('orderSuccess.orderInfo.title')}</h2>
            <p className="text-gray-600 mb-2">{t('orderSuccess.orderInfo.number')}: <span className="font-medium">{orderNumber}</span></p>
            <p className="text-gray-600">{t('orderSuccess.orderInfo.shipping')}</p>
          </motion.div>
          
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link to="/">
              <Button variant="outline">
                {t('orderSuccess.actions.home')}
              </Button>
            </Link>
            <Link to="/catalog">
              <Button>
                {t('orderSuccess.actions.continue')}
              </Button>
            </Link>
          </motion.div>
        </div>
      </motion.section>
    </Layout>
  );
};

export default OrderSuccessPage;