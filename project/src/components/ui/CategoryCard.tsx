import React from 'react';
import { motion } from 'framer-motion';
import { Category } from '../../lib/api';
import { Link } from 'react-router-dom';
import { getLocalizedValue } from '../../lib/helpers';

interface CategoryCardProps {
  category: Category;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ category }) => {
  const localizedName = getLocalizedValue(category.name, category.name_ru);
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative group overflow-hidden"
    >
      <Link to={`/catalog?category=${category.slug}`} className="block">
        <div className="relative aspect-square overflow-hidden">
          <img
            src={category.image}
            alt={localizedName}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-30 transition-opacity flex items-center justify-center">
            <h3 className="text-white text-xl font-light tracking-wide uppercase">
              {localizedName}
            </h3>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default CategoryCard;