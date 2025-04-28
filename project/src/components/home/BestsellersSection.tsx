import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import ProductCard from '../ui/ProductCard';
import { useTranslation } from 'react-i18next';
import { useBestsellers } from '../../lib/hooks';

const BestsellersSection: React.FC = () => {
  const { t } = useTranslation();
  const { data: bestsellers, isLoading } = useBestsellers();
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { current } = scrollRef;
      const scrollAmount = current.clientWidth * 0.8;
      
      if (direction === 'left') {
        current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
      } else {
        current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      }
    }
  };

  if (isLoading) {
    return (
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-8">
          <h2 className="text-2xl md:text-3xl font-light mb-8 text-center">{t('home.bestsellers.title')}</h2>
          <div className="text-center">{t('common.loading')}</div>
        </div>
      </section>
    );
  }

  if (!bestsellers || bestsellers.length === 0) {
    return null;
  }

  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-2xl md:text-3xl font-light mb-8 text-center">{t('home.bestsellers.title')}</h2>
          
          <div className="relative">
            <div
              ref={scrollRef}
              className="flex overflow-x-auto gap-6 pb-8 scrollbar-hide snap-x"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {bestsellers.map(product => (
                <div key={product.id} className="min-w-[280px] max-w-[280px] snap-start">
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
            
            <button
              onClick={() => scroll('left')}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-white p-2 rounded-full shadow-md hidden md:block"
              aria-label="Scroll left"
            >
              <ChevronLeft size={20} />
            </button>
            
            <button
              onClick={() => scroll('right')}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-white p-2 rounded-full shadow-md hidden md:block"
              aria-label="Scroll right"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default BestsellersSection;