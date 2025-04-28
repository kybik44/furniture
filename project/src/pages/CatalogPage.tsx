import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import Layout from '../components/layout/Layout';
import ProductCard from '../components/ui/ProductCard';
import { useProducts, useCategories } from '../lib/hooks';
import { Product } from '../lib/api';
import { ChevronDown, SlidersHorizontal } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { getLocalizedValue } from '../lib/helpers';

const CatalogPage: React.FC = () => {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryParam = searchParams.get('category');
  const searchParam = searchParams.get('search');
  
  const { data: products, isLoading: isLoadingProducts } = useProducts();
  const { data: categories, isLoading: isLoadingCategories } = useCategories();
  
  // Отладочная информация
  useEffect(() => {
    if (products) {
      console.log('Загружено товаров с сервера:', products.length);
      console.log('Товары:', products);
    }
  }, [products]);
  
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 50000]);
  const [sortOption, setSortOption] = useState('popularity');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  
  // Filter products based on params
  useEffect(() => {
    if (!products) return;
    
    let filtered = [...products];
    
    // Filter by category
    if (categoryParam) {
      const categoryId = categories?.find(c => c.slug === categoryParam)?.id;
      if (categoryId) {
        filtered = filtered.filter(product => product.category_id === categoryId);
      }
    }
    
    // Filter by search term
    if (searchParam) {
      const searchLower = searchParam.toLowerCase();
      filtered = filtered.filter(product => 
        product.name.toLowerCase().includes(searchLower) || 
        product.description.toLowerCase().includes(searchLower)
      );
    }
    
    // Filter by price range
    filtered = filtered.filter(product => 
      product.price >= priceRange[0] && product.price <= priceRange[1]
    );
    
    // Sort products
    switch (sortOption) {
      case 'price-low':
        filtered.sort((a, b) => Number(a.price) - Number(b.price));
        break;
      case 'price-high':
        filtered.sort((a, b) => Number(b.price) - Number(a.price));
        break;
      case 'newest':
        filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        break;
      case 'popularity':
      default:
        filtered.sort((a, b) => (b.is_bestseller ? 1 : 0) - (a.is_bestseller ? 1 : 0));
        break;
    }
    
    console.log('Отфильтрованных товаров:', filtered.length);
    setFilteredProducts(filtered);
  }, [products, categories, categoryParam, searchParam, priceRange, sortOption]);
  
  const handleCategoryClick = (slug: string) => {
    setSearchParams(params => {
      if (slug === 'all') {
        params.delete('category');
      } else {
        params.set('category', slug);
      }
      return params;
    });
  };
  
  const handlePriceChange = (event: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const value = parseInt(event.target.value);
    setPriceRange(current => {
      const newRange = [...current] as [number, number];
      newRange[index] = value;
      return newRange;
    });
  };
  
  const handleSortChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSortOption(event.target.value);
  };

  if (isLoadingProducts || isLoadingCategories) {
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

  return (
    <Layout>
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-8">
          <h1 className="text-3xl md:text-4xl font-light mb-8 text-center">{t('catalog.title')}</h1>
          
          {/* Mobile Filter Toggle */}
          <div className="md:hidden mb-6">
            <button
              onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
              className="w-full py-3 px-4 border border-gray-200 flex items-center justify-between"
            >
              <span className="flex items-center">
                <SlidersHorizontal size={16} className="mr-2" />
                {t('catalog.filters.title')}
              </span>
              <ChevronDown
                size={16}
                className={`transform transition-transform ${isMobileFilterOpen ? 'rotate-180' : ''}`}
              />
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Sidebar Filters - Desktop and Mobile (when open) */}
            <div className={`
              ${isMobileFilterOpen ? 'block' : 'hidden'} md:block
              bg-white md:bg-transparent p-4 md:p-0
              fixed md:static inset-0 top-auto z-30 md:z-auto
              h-auto max-h-[70vh] md:max-h-none overflow-auto md:overflow-visible
            `}>
              <div className="mb-8">
                <h3 className="text-sm font-medium mb-4">{t('catalog.filters.categories')}</h3>
                <ul className="space-y-2">
                  <li>
                    <button
                      onClick={() => handleCategoryClick('all')}
                      className={`text-sm font-light ${!categoryParam ? 'text-black' : 'text-gray-500 hover:text-black'}`}
                    >
                      {t('catalog.filters.all')}
                    </button>
                  </li>
                  {categories?.map(category => (
                    <li key={category.id}>
                      <button
                        onClick={() => handleCategoryClick(category.slug)}
                        className={`text-sm font-light ${categoryParam === category.slug ? 'text-black' : 'text-gray-500 hover:text-black'}`}
                      >
                        {getLocalizedValue(category.name, category.name_ru)}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="mb-8">
                <h3 className="text-sm font-medium mb-4">{t('catalog.filters.priceRange')}</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">${priceRange[0]}</span>
                    <span className="text-sm text-gray-500">${priceRange[1]}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="50000"
                    value={priceRange[0]}
                    onChange={(e) => handlePriceChange(e, 0)}
                    className="w-full"
                  />
                  <input
                    type="range"
                    min="0"
                    max="50000"
                    value={priceRange[1]}
                    onChange={(e) => handlePriceChange(e, 1)}
                    className="w-full"
                  />
                </div>
              </div>
            </div>
            
            {/* Product Grid */}
            <div className="md:col-span-3">
              <div className="flex justify-between items-center mb-6">
                <p className="text-sm text-gray-500">{t('catalog.productsCount', { count: filteredProducts.length })}</p>
                <div className="flex items-center">
                  <label htmlFor="sort" className="text-sm text-gray-500 mr-2">{t('catalog.sort.title')}</label>
                  <select
                    id="sort"
                    value={sortOption}
                    onChange={handleSortChange}
                    className="text-sm border-b border-gray-200 py-1 pl-2 pr-8 bg-transparent"
                  >
                    <option value="popularity">{t('catalog.sort.popularity')}</option>
                    <option value="price-low">{t('catalog.sort.priceLow')}</option>
                    <option value="price-high">{t('catalog.sort.priceHigh')}</option>
                    <option value="newest">{t('catalog.sort.newest')}</option>
                  </select>
                </div>
              </div>
              
              {filteredProducts.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500">{t('catalog.noProducts')}</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredProducts.map((product, index) => (
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                      <ProductCard product={product} />
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default CatalogPage;