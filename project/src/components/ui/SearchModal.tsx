import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search as SearchIcon, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import Input from './Input';
import { Product } from '../../lib/api';
import { useSearchProducts } from '../../lib/hooks';
import { getLocalizedValue } from '../../lib/helpers';

// Ключ для хранения истории поиска в localStorage
const SEARCH_HISTORY_KEY = 'legnovivo_search_history';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose }) => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Текущая локаль для поиска
  const locale = i18n.language;
  
  // Получаем результаты поиска
  const { data: searchResults, isLoading } = useSearchProducts(searchQuery, locale);
  
  // Фокус на поле ввода при открытии
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);
  
  // Загрузка истории поиска из localStorage
  useEffect(() => {
    const savedHistory = localStorage.getItem(SEARCH_HISTORY_KEY);
    if (savedHistory) {
      setRecentSearches(JSON.parse(savedHistory));
    }
  }, []);
  
  // Обработка нажатия Escape для закрытия модального окна
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    
    window.addEventListener('keydown', handleEsc);
    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, [onClose]);
  
  // Обработка отправки формы и навигация на страницу поиска
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (searchQuery.trim()) {
      // Добавляем запрос в историю поиска
      if (!recentSearches.includes(searchQuery.trim())) {
        const updatedHistory = [searchQuery, ...recentSearches].slice(0, 5); // Сохраняем только 5 последних запросов
        setRecentSearches(updatedHistory);
        localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(updatedHistory));
      }
      
      // Закрываем модалку и переходим на страницу поиска
      onClose();
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };
  
  // Обработка клика по истории поиска
  const handleHistoryClick = (query: string) => {
    setSearchQuery(query);
  };
  
  // Обработка клика по результату поиска
  const handleResultClick = (product: Product) => {
    onClose();
    navigate(`/product/${product.id}`);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black bg-opacity-40"
            onClick={onClose}
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ type: 'spring', damping: 25 }}
            className="relative w-full max-w-2xl mx-auto mt-16 bg-white shadow-xl"
          >
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-light">{t('search.title')}</h2>
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-black transition-colors"
                >
                  <X size={24} />
                </button>
              </div>
              
              {/* Форма поиска */}
              <form onSubmit={handleSubmit} className="flex w-full mb-6">
                <div className="relative flex-grow">
                  <Input
                    ref={inputRef}
                    type="text"
                    placeholder={t('search.placeholder')}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    fullWidth
                    autoFocus
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
                <button
                  type="submit"
                  className="ml-2 px-5 py-2 bg-black text-white hover:bg-gray-800 flex items-center justify-center"
                >
                  <SearchIcon size={16} className="mr-2" />
                  {t('search.button')}
                </button>
              </form>
              
              {/* Результаты поиска или история */}
              <div className="max-h-[60vh] overflow-y-auto">
                {searchQuery ? (
                  <div>
                    {isLoading ? (
                      <div className="py-8 text-center">
                        <p>{t('common.loading')}</p>
                      </div>
                    ) : searchResults && searchResults.length > 0 ? (
                      <div className="space-y-4">
                        <p className="text-sm text-gray-500 mb-4">
                          {t('search.found', { count: searchResults.length })}
                        </p>
                        {searchResults.slice(0, 5).map((product) => (
                          <div
                            key={product.id}
                            className="flex items-center p-3 hover:bg-gray-50 cursor-pointer transition-colors"
                            onClick={() => handleResultClick(product)}
                          >
                            <div className="w-16 h-16 flex-shrink-0 bg-gray-100">
                              {product.images && product.images[0] && (
                                <img
                                  src={product.images[0]}
                                  alt={getLocalizedValue(product.name, product.name_ru)}
                                  className="w-full h-full object-cover"
                                />
                              )}
                            </div>
                            <div className="ml-4">
                              <h3 className="text-sm font-medium">
                                {getLocalizedValue(product.name, product.name_ru)}
                              </h3>
                              <p className="text-sm text-gray-500">${product.price}</p>
                            </div>
                          </div>
                        ))}
                        {searchResults.length > 5 && (
                          <div className="text-center py-2">
                            <button
                              className="text-sm text-gray-500 hover:text-black"
                              onClick={() => {
                                onClose();
                                navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
                              }}
                            >
                              {t('search.viewCatalog')}
                            </button>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="py-8 text-center">
                        <p className="text-gray-500">{t('search.noResults')}</p>
                        <p className="text-sm text-gray-500 mt-2">{t('search.suggestion')}</p>
                      </div>
                    )}
                  </div>
                ) : (
                  recentSearches.length > 0 && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-2">{t('search.recentSearches')}</h3>
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
                  )
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default SearchModal; 