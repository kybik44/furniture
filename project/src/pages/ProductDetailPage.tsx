import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Layout from '../components/layout/Layout';
import Button from '../components/ui/Button';
import { Heart, ChevronRight, ChevronLeft, Ruler, Info, Package } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useFavorites } from '../context/FavoritesContext';
import ProductCard from '../components/ui/ProductCard';
import { useTranslation } from 'react-i18next';
import { useProduct, useProducts } from '../lib/hooks';
import { getLocalizedValue } from '../lib/helpers';
import { Product } from '../lib/api';

// Тип для размеров товара
interface Dimensions {
  width: number;
  height: number;
  depth: number;
}

const ProductDetailPage: React.FC = () => {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const { data: product, isLoading } = useProduct(id || '');
  
  const { addToCart } = useCart();
  const { isFavorite, addToFavorites, removeFromFavorites } = useFavorites();
  const favorite = product ? isFavorite(product.id) : false;
  
  const [quantity, setQuantity] = useState(1);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [similarProducts, setSimilarProducts] = useState<Product[]>([]);
  
  // Загружаем товары той же категории для блока "Похожие товары"
  const { data: allProducts } = useProducts();
  
  useEffect(() => {
    if (product && allProducts) {
      // Получаем похожие товары из той же категории
      const similar = allProducts
        .filter(p => p.category_id === product.category_id && p.id !== product.id)
        .slice(0, 3);
      setSimilarProducts(similar);
      
      // Сбрасываем состояние при изменении товара
      setCurrentImageIndex(0);
      setQuantity(1);
    }
    
    // Прокручиваем страницу вверх при смене товара
    window.scrollTo(0, 0);
  }, [product, allProducts]);
  
  if (isLoading) {
    return (
      <Layout>
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4 md:px-8 text-center">
            <p>{t('common.loading')}</p>
          </div>
        </section>
      </Layout>
    );
  }
  
  if (!product) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-light mb-4">{t('product.notFound')}</h1>
          <p className="text-gray-600 mb-8">{t('product.notFoundMessage')}</p>
          <Link to="/catalog">
            <Button variant="outline">{t('common.catalog')}</Button>
          </Link>
        </div>
      </Layout>
    );
  }
  
  const localizedName = getLocalizedValue(product.name, product.name_ru);
  const localizedShortDescription = getLocalizedValue(product.short_description, product.short_description_ru);
  const localizedDescription = getLocalizedValue(product.description, product.description_ru);
  const localizedMaterials = product.materials_ru && product.materials_ru.length > 0 && 
    product.materials.length === product.materials_ru.length
    ? getLocalizedValue(product.materials.join(', '), product.materials_ru.join(', '))
    : product.materials.join(', ');
  
  // Проверяем и приводим dimensions к нужному типу
  const dimensions = product.dimensions as Dimensions | null;
  const hasDimensions = dimensions !== null && 
    typeof dimensions === 'object' &&
    'width' in dimensions &&
    'height' in dimensions &&
    'depth' in dimensions;
  
  const handlePrevImage = () => {
    setCurrentImageIndex(prev => 
      prev === 0 ? product.images.length - 1 : prev - 1
    );
  };
  
  const handleNextImage = () => {
    setCurrentImageIndex(prev => 
      prev === product.images.length - 1 ? 0 : prev + 1
    );
  };
  
  const handleQuantityChange = (delta: number) => {
    setQuantity(prev => Math.max(1, prev + delta));
  };
  
  const handleAddToCart = () => {
    addToCart(product, quantity);
  };
  
  const handleFavoriteToggle = () => {
    if (favorite) {
      removeFromFavorites(product.id);
    } else {
      addToFavorites(product);
    }
  };

  return (
    <Layout>
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-8">
          <div className="mb-8">
            <nav className="text-sm font-light">
              <Link to="/" className="text-gray-500 hover:text-black">{t('common.home')}</Link>
              <span className="mx-2 text-gray-400">/</span>
              <Link to="/catalog" className="text-gray-500 hover:text-black">{t('common.catalog')}</Link>
              <span className="mx-2 text-gray-400">/</span>
              <span className="text-gray-800">{localizedName}</span>
            </nav>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
            {/* Product Images */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <div className="relative aspect-square bg-gray-50">
                <img
                  src={product.images[currentImageIndex]}
                  alt={localizedName}
                  className="w-full h-full object-cover"
                />
                
                {product.images.length > 1 && (
                  <>
                    <button
                      onClick={handlePrevImage}
                      className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white rounded-full shadow"
                      aria-label="Previous image"
                    >
                      <ChevronLeft size={20} />
                    </button>
                    <button
                      onClick={handleNextImage}
                      className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white rounded-full shadow"
                      aria-label="Next image"
                    >
                      <ChevronRight size={20} />
                    </button>
                  </>
                )}
              </div>
              
              {product.images.length > 1 && (
                <div className="flex gap-4 mt-4">
                  {product.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`w-20 h-20 border-2 ${
                        index === currentImageIndex ? 'border-black' : 'border-transparent'
                      }`}
                    >
                      <img
                        src={image}
                        alt={`${localizedName} - view ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </motion.div>
            
            {/* Product Info */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-3xl font-light mb-2">{localizedName}</h1>
              <p className="text-2xl text-gray-800 mb-6">${product.price}</p>
              
              <p className="text-gray-600 font-light mb-8 leading-relaxed">
                {localizedShortDescription}
              </p>
              
              <div className="mb-8">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="flex border border-gray-200">
                    <button
                      onClick={() => handleQuantityChange(-1)}
                      className="px-3 py-2 border-r border-gray-200"
                      aria-label="Decrease quantity"
                    >
                      -
                    </button>
                    <span className="px-6 py-2 flex items-center justify-center min-w-12">
                      {quantity}
                    </span>
                    <button
                      onClick={() => handleQuantityChange(1)}
                      className="px-3 py-2 border-l border-gray-200"
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                  </div>
                  
                  <button
                    onClick={handleFavoriteToggle}
                    className={`p-3 border ${
                      favorite 
                        ? 'border-red-100 bg-red-50 text-red-500' 
                        : 'border-gray-200 text-gray-400 hover:text-gray-600'
                    }`}
                    aria-label={favorite ? t('product.removeFromFavorites') : t('product.addToFavorites')}
                  >
                    <Heart size={20} fill={favorite ? 'currentColor' : 'none'} />
                  </button>
                </div>
                
                <Button onClick={handleAddToCart} fullWidth className="mb-4">
                  {t('product.addToCart')}
                </Button>
              </div>
              
              <div className="border-t border-gray-100 pt-6 space-y-4">
                {hasDimensions && dimensions && (
                  <div className="flex items-start">
                    <Ruler size={20} className="mr-3 text-gray-400 mt-1" />
                    <div>
                      <h3 className="text-sm font-medium">{t('product.dimensions')}</h3>
                      <p className="text-sm text-gray-600 font-light">
                        W: {dimensions.width}см × H: {dimensions.height}см × D: {dimensions.depth}см
                      </p>
                    </div>
                  </div>
                )}
                
                {product.materials && product.materials.length > 0 && (
                  <div className="flex items-start">
                    <Package size={20} className="mr-3 text-gray-400 mt-1" />
                    <div>
                      <h3 className="text-sm font-medium">{t('product.materials')}</h3>
                      <p className="text-sm text-gray-600 font-light">
                        {localizedMaterials}
                      </p>
                    </div>
                  </div>
                )}
                
                <div className="flex items-start">
                  <Info size={20} className="mr-3 text-gray-400 mt-1" />
                  <div>
                    <h3 className="text-sm font-medium">{t('product.details')}</h3>
                    <p className="text-sm text-gray-600 font-light leading-relaxed">
                      {localizedDescription}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
          
          {/* Similar Products */}
          {similarProducts.length > 0 && (
            <div className="border-t border-gray-100 pt-12">
              <h2 className="text-2xl font-light mb-8">{t('product.similarProducts')}</h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {similarProducts.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default ProductDetailPage;