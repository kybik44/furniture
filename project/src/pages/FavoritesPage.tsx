import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, Trash, AlertCircle } from 'lucide-react';
import Layout from '../components/layout/Layout';
import { useFavorites } from '../context/FavoritesContext';
import { useCart } from '../context/CartContext';
import Button from '../components/ui/Button';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getLocalizedValue } from '../lib/helpers';

const FavoritesPage: React.FC = () => {
  const { t } = useTranslation();
  const { favorites, removeFromFavorites } = useFavorites();
  const { addToCart } = useCart();

  const handleAddToCart = (productId: string) => {
    const product = favorites.find(item => item.id === productId);
    if (product) {
      addToCart(product);
    }
  };

  return (
    <Layout>
      <section className="pt-16 md:pt-24 bg-gray-50">
        <div className="container mx-auto px-4 md:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl mx-auto text-center mb-12"
          >
            <h1 className="text-3xl md:text-4xl font-light mb-6">{t('favorites.title')}</h1>
            <p className="text-gray-600 font-light leading-relaxed">
              {t('favorites.subtitle')}
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-8">
          {favorites.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <AlertCircle size={48} className="mx-auto text-gray-300 mb-4" />
              <h2 className="text-xl font-light mb-4">{t('favorites.empty.title')}</h2>
              <p className="text-gray-600 font-light mb-8">
                {t('favorites.empty.message')}
              </p>
              <Link to="/catalog">
                <Button className="mx-auto">
                  {t('favorites.empty.button')}
                </Button>
              </Link>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {favorites.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-white border border-gray-100 overflow-hidden"
                >
                  <Link to={`/product/${product.id}`} className="block relative">
                    <img
                      src={product.images[0]}
                      alt={getLocalizedValue(product.name, product.name_ru)}
                      className="w-full h-64 object-cover transition-transform duration-500 hover:scale-105"
                    />
                    <div className="absolute top-4 right-4">
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          removeFromFavorites(product.id);
                        }}
                        className="bg-white p-2 rounded-full text-gray-400 hover:text-red-500 transition-colors"
                        aria-label={t('favorites.remove')}
                      >
                        <Trash size={18} />
                      </button>
                    </div>
                  </Link>
                  <div className="p-6">
                    <Link to={`/product/${product.id}`} className="block">
                      <h3 className="font-light text-lg mb-2">
                        {getLocalizedValue(product.name, product.name_ru)}
                      </h3>
                      <p className="text-gray-500 font-light mb-4">${product.price}</p>
                    </Link>
                    <Button
                      onClick={() => handleAddToCart(product.id)}
                      variant="primary"
                      fullWidth
                      className="flex items-center justify-center"
                    >
                      <ShoppingBag size={16} className="mr-2" />
                      {t('product.addToCart')}
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default FavoritesPage; 