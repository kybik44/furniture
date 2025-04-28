import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { useTranslation } from 'react-i18next';

const DiscountSection: React.FC = () => {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Subscription logic would go here
    setSubmitted(true);
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
                <form onSubmit={handleSubmit}>
                  <Input
                    type="text"
                    placeholder={t('home.discount.name')}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    fullWidth
                    required
                    className="mb-4"
                  />
                  <Input
                    type="email"
                    placeholder={t('home.discount.email')}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    fullWidth
                    required
                    className="mb-6"
                  />
                  <Button type="submit" variant="primary" fullWidth>
                    {t('home.discount.subscribe')}
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
                <p className="text-sm text-gray-500">
                  {t('home.discount.success.check')}
                </p>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default DiscountSection;