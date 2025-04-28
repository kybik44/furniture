import React from 'react';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import { Product } from '../../lib/api';
import { Link } from 'react-router-dom';
import { useFavorites } from '../../context/FavoritesContext';
import { useCart } from '../../context/CartContext';
import { getLocalizedValue } from '../../lib/helpers';
import { useTranslation } from 'react-i18next';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { t } = useTranslation();
  const { addToCart } = useCart();
  const { isFavorite, addToFavorites, removeFromFavorites } = useFavorites();
  const favorite = isFavorite(product.id);
  const localizedName = getLocalizedValue(product.name, product.name_ru);

  const handleFavoriteToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (favorite) {
      removeFromFavorites(product.id);
    } else {
      addToFavorites(product);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="group relative"
    >
      <Link to={`/product/${product.id}`} className="block">
        <div className="relative overflow-hidden">
          <img
            src={product.images[0]}
            alt={localizedName}
            className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <button
            onClick={handleFavoriteToggle}
            className={`absolute top-4 right-4 p-2 rounded-full ${
              favorite ? 'bg-red-50 text-red-500' : 'bg-white text-gray-400 hover:text-gray-600'
            } transition-colors`}
            aria-label={favorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            <Heart size={18} fill={favorite ? 'currentColor' : 'none'} />
          </button>
        </div>
        <div className="mt-3">
          <h3 className="font-light text-sm">{localizedName}</h3>
          <p className="text-gray-500 font-light mt-1">${product.price}</p>
        </div>
      </Link>
      <button
        onClick={() => addToCart(product)}
        className="mt-2 w-full py-2 bg-transparent border border-black text-black hover:bg-black hover:text-white transition-colors text-sm font-light"
      >
        {t('product.addToCart')}
      </button>
    </motion.div>
  );
};

export default ProductCard;