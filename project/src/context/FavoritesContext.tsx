import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Product } from '../lib/api';

interface FavoritesContextType {
  favorites: Product[];
  addToFavorites: (product: Product) => void;
  removeFromFavorites: (productId: string) => void;
  isFavorite: (productId: string) => boolean;
  clearFavorites: () => void;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

// Ключ для хранения в localStorage
const FAVORITES_STORAGE_KEY = 'legnovivo_favorites';

export const FavoritesProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [favorites, setFavorites] = useState<Product[]>(() => {
    // Инициализация из localStorage при загрузке
    const savedFavorites = localStorage.getItem(FAVORITES_STORAGE_KEY);
    return savedFavorites ? JSON.parse(savedFavorites) : [];
  });

  // Сохранение в localStorage при изменении избранного
  useEffect(() => {
    localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favorites));
  }, [favorites]);

  const addToFavorites = (product: Product) => {
    if (!isFavorite(product.id)) {
      setFavorites(prev => [...prev, product]);
    }
  };

  const removeFromFavorites = (productId: string) => {
    setFavorites(prev => prev.filter(product => product.id !== productId));
  };

  const isFavorite = (productId: string): boolean => {
    return favorites.some(product => product.id === productId);
  };

  const clearFavorites = () => {
    setFavorites([]);
  };

  return (
    <FavoritesContext.Provider value={{ 
      favorites, 
      addToFavorites, 
      removeFromFavorites, 
      isFavorite,
      clearFavorites
    }}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = (): FavoritesContextType => {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};