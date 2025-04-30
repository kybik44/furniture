import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useSearchParams } from 'react-router-dom';
import { Search as SearchIcon, X, AlertCircle } from 'lucide-react';
import Layout from '../components/layout/Layout';
import ProductCard from '../components/ui/ProductCard';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { useSearchProducts } from '../lib/hooks';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

// Ключ для хранения истории поиска в localStorage
const SEARCH_HISTORY_KEY = 'legnovivo_search_history';

const SearchPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const queryParam = searchParams.get('q') || '';
  
  const [searchQuery, setSearchQuery] = useState(queryParam);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  
  // Текущая локаль для поиска
  const locale = i18n.language;
  
  // Получаем результаты поиска
  const { data: searchResults, isLoading } = useSearchProducts(queryParam, locale);
  
  // Загрузка истории поиска из localStorage
  useEffect(() => {
    const savedHistory = localStorage.getItem(SEARCH_HISTORY_KEY);
    if (savedHistory) {
      setRecentSearches(JSON.parse(savedHistory));
    }
  }, []);
  
  // Обновление параметров URL при отправке формы
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (searchQuery.trim()) {
      // Обновляем URL с параметром поиска
      setSearchParams({ q: searchQuery.trim() });
      
      // Добавляем запрос в историю поиска
      if (!recentSearches.includes(searchQuery.trim())) {
        const updatedHistory = [searchQuery, ...recentSearches].slice(0, 5); // Сохраняем только 5 последних запросов
        setRecentSearches(updatedHistory);
        localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(updatedHistory));
      }
    }
  };
  
  // Обработка клика по истории поиска
  const handleHistoryClick = (query: string) => {
    setSearchQuery(query);
    setSearchParams({ q: query });
  };
  
  // Очистка истории поиска
  const clearSearchHistory = () => {
    setRecentSearches([]);
    localStorage.removeItem(SEARCH_HISTORY_KEY);
  };

  return (
    <Layout>
      <section className="pt-16 md:pt-24 bg-gray-50">
        <div className="container mx-auto px-4 md:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl mx-auto text-center mb-8"
          >
            <h1 className="text-3xl md:text-4xl font-light mb-6">{t('search.title')}</h1>
          </motion.div>
          
          {/* Форма поиска */}
          <div className="max-w-2xl mx-auto">
            <form onSubmit={handleSubmit} className="flex w-full mb-8">
              <div className="relative flex-grow">
                <Input
                  type="text"
                  placeholder={t('search.placeholder')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  fullWidth
                  className="pr-10"
                />
                {searchQuery && (
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    onClick={() => setSearchQuery('')}
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
              <Button type="submit" className="ml-2 px-6 flex-shrink-0 flex items-center">
                <SearchIcon size={16} className="mr-2" />
                {t('search.button')}
              </Button>
            </form>
            
            {/* История поиска */}
            {recentSearches.length > 0 && !queryParam && (
              <div className="mb-8">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-sm font-medium text-gray-500">{t('search.recentSearches')}</h3>
                  <button
                    onClick={clearSearchHistory}
                    className="text-xs text-gray-500 hover:text-gray-700"
                  >
                    {t('search.clearHistory')}
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {recentSearches.map((query, index) => (
                    <button
                      key={index}
                      onClick={() => handleHistoryClick(query)}
                      className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-sm rounded-full"
                    >
                      {query}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Результаты поиска */}
      {queryParam && (
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4 md:px-8">
            {isLoading ? (
              <div className="text-center py-8">
                <p>{t('common.loading')}</p>
              </div>
            ) : searchResults && searchResults.length > 0 ? (
              <>
                <h2 className="text-2xl font-light mb-8 text-center">
                  {t('search.results')}
                </h2>
                <p className="text-center text-gray-600 mb-12">
                  {t('search.found', { count: searchResults.length })}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  {searchResults.map((product, index) => (
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
              </>
            ) : (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12"
              >
                <AlertCircle size={48} className="mx-auto text-gray-300 mb-4" />
                <h2 className="text-xl font-light mb-4">{t('search.noResults')}</h2>
                <p className="text-gray-600 font-light mb-8 max-w-md mx-auto">
                  {t('search.suggestion')}
                </p>
                <Link to="/catalog">
                  <Button>
                    {t('search.viewCatalog')}
                  </Button>
                </Link>
              </motion.div>
            )}
          </div>
        </section>
      )}
    </Layout>
  );
};

export default SearchPage; 