import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import ReviewCard from '../ui/ReviewCard';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../../lib/supabase';
import { Review } from '../../lib/api';
import { useTranslation } from 'react-i18next';

const ReviewsSection: React.FC = () => {
  const { t } = useTranslation();
  const scrollRef = useRef<HTMLDivElement>(null);

  const { data: reviews, isLoading } = useQuery({
    queryKey: ['homeReviews'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .eq('is_approved', true)
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) throw error;
      return data as Review[];
    },
  });

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

  if (isLoading || !reviews || reviews.length === 0) {
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
          <h2 className="text-2xl md:text-3xl font-light mb-8 text-center">{t('home.reviews.title')}</h2>
          
          <div className="relative">
            <div
              ref={scrollRef}
              className="flex overflow-x-auto gap-6 pb-8 scrollbar-hide snap-x"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {reviews.map(review => (
                <div key={review.id} className="min-w-[300px] max-w-[300px] snap-start">
                  <ReviewCard review={review} />
                </div>
              ))}
            </div>
            
            <div className="flex justify-center gap-4 mt-8">
              <button
                onClick={() => scroll('left')}
                className="p-2 border border-gray-200 rounded-full"
                aria-label="Previous review"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                onClick={() => scroll('right')}
                className="p-2 border border-gray-200 rounded-full"
                aria-label="Next review"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ReviewsSection;