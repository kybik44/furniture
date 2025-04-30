import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import Layout from '../components/layout/Layout';
import ProductCard from '../components/ui/ProductCard';
import { useCategories } from '../lib/hooks';
import { productApi } from '../lib/api';
import { ChevronDown, SlidersHorizontal, Search } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { getLocalizedValue } from '../lib/helpers';
import Input from '../components/ui/Input';
import { useQuery } from '@tanstack/react-query';

const CatalogPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryParam = searchParams.get('category');
  const searchParam = searchParams.get('search');
  
  const { data: categories, isLoading: isLoadingCategories } = useCategories();
  
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 50000]);
  const [sortOption, setSortOption] = useState('popularity');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [searchValue, setSearchValue] = useState(searchParam || '');
  const [materials, setMaterials] = useState<string[]>([]);
  
  // Хук для получения отфильтрованных продуктов
  const { data: filteredProducts, isLoading: isLoadingProducts } = useQuery({
    queryKey: ['products', 'filtered', categoryParam, searchParam, priceRange, sortOption, materials, i18n.language],
    queryFn: () => productApi.getFilteredProducts({
      categorySlug: categoryParam || undefined,
      search: searchParam || undefined,
      minPrice: priceRange[0],
      maxPrice: priceRange[1],
      sortBy: sortOption as 'price-low' | 'price-high' | 'newest' | 'popularity',
      materials: materials.length > 0 ? materials : undefined,
      locale: i18n.language
    }),
  });
  
  // Отладочная информация
  useEffect(() => {
    if (filteredProducts) {
      console.log('Отфильтрованных товаров:', filteredProducts.length);
    }
  }, [filteredProducts]);
  
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
  
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchParams(params => {
      if (!searchValue.trim()) {
        params.delete('search');
      } else {
        params.set('search', searchValue.trim());
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
  
  const handleMaterialToggle = (material: string) => {
    setMaterials(current => {
      if (current.includes(material)) {
        return current.filter(m => m !== material);
      } else {
        return [...current, material];
      }
    });
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

  // Собираем уникальные материалы из всех продуктов
  const allMaterials = filteredProducts ? 
    [...new Set(filteredProducts.flatMap(product => 
      i18n.language === 'ru' ? product.materials_ru : product.materials
    ))].sort() : [];

  return (
    <Layout>
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-8">
          <h1 className="text-3xl md:text-4xl font-light mb-8 text-center">{t('catalog.title')}</h1>
          
          {/* Search bar */}
          <div className="max-w-xl mx-auto mb-10">
            <form onSubmit={handleSearchSubmit} className="flex w-full">
              <div className="relative flex-grow">
                <Input
                  type="text"
                  placeholder={t('search.placeholder')}
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  fullWidth
                  className="pr-10"
                />
              </div>
              <button
                type="submit"
                className="ml-2 px-5 py-2 bg-black text-white hover:bg-gray-800 flex items-center justify-center"
              >
                <Search size={16} className="mr-2" />
                {t('search.button')}
              </button>
            </form>
          </div>
          
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
              
              {/* Добавляем фильтр по материалам */}
              {allMaterials.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-sm font-medium mb-4">{t('catalog.filters.materials')}</h3>
                  <div className="space-y-2">
                    {allMaterials.map(material => (
                      <div key={material} className="flex items-center">
                        <input
                          type="checkbox"
                          id={`material-${material}`}
                          checked={materials.includes(material)}
                          onChange={() => handleMaterialToggle(material)}
                          className="mr-2"
                        />
                        <label htmlFor={`material-${material}`} className="text-sm font-light text-gray-700">
                          {material}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            {/* Product Grid */}
            <div className="md:col-span-3">
              <div className="flex justify-between items-center mb-6">
                <p className="text-sm text-gray-500">{t('catalog.productsCount', { count: filteredProducts?.length || 0 })}</p>
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
              
              {filteredProducts?.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500">{t('catalog.noProducts')}</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredProducts?.map((product, index) => (
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