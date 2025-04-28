import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useCategories } from '../../lib/hooks';
import CategoryCard from '../ui/CategoryCard';
import Button from '../ui/Button';
import { useTranslation } from 'react-i18next';

const CategoriesSection: React.FC = () => {
  const { t } = useTranslation();
  const { data: categories, isLoading } = useCategories();

  if (isLoading) {
    return (
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-8 text-center">
          <p>{t('common.loading')}</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-2xl md:text-3xl font-light mb-4">{t('home.categories.title')}</h2>
          <p className="text-gray-600 font-light max-w-2xl mx-auto">
            {t('home.categories.subtitle')}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {categories?.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <CategoryCard category={category} />
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center"
        >
          <Link to="/catalog">
            <Button variant="outline">
              {t('home.categories.viewAll')}
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default CategoriesSection;