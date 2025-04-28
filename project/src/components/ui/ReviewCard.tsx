import React from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import { Review } from '../../lib/api';

interface ReviewCardProps {
  review: Review;
}

const ReviewCard: React.FC<ReviewCardProps> = ({ review }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white p-6 border border-gray-100"
    >
      <div className="flex items-center mb-4">
        <img
          src={review.avatar}
          alt={`${review.name}'s avatar`}
          className="w-10 h-10 rounded-full object-cover mr-3"
        />
        <div>
          <h4 className="font-light">{review.name}</h4>
          <div className="flex mt-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                size={14}
                className={i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}
              />
            ))}
          </div>
        </div>
      </div>
      <p className="text-gray-600 text-sm font-light leading-relaxed">{review.text}</p>
    </motion.div>
  );
};

export default ReviewCard;