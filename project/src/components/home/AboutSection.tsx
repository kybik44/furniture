import React from 'react';
import { motion } from 'framer-motion';
import Button from '../ui/Button';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const AboutSection: React.FC = () => {
  const { t } = useTranslation();
  
  return (
    <section className="py-16 md:py-24 bg-gray-50">
      <div className="container mx-auto px-4 md:px-8">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center"
        >
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h2 className="text-2xl md:text-3xl font-light mb-6">{t('home.about.title')}</h2>
            <p className="text-gray-600 font-light mb-4 leading-relaxed">
              {t('home.about.description1')}
            </p>
            <p className="text-gray-600 font-light mb-6 leading-relaxed">
              {t('home.about.description2')}
            </p>
            <Link to="/about">
              <Button variant="outline">
                {t('home.about.readMore')}
              </Button>
            </Link>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="grid grid-cols-2 gap-4"
          >
            <div className="aspect-square overflow-hidden">
              <img
                src="https://rleynbzojbylvxrnbxxv.supabase.co/storage/v1/object/sign/photo/photo_2020-09-11_23-45-11.jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6InN0b3JhZ2UtdXJsLXNpZ25pbmcta2V5X2ZmN2QxOTA3LTYzNzItNDY4Ny1hM2M2LTMxMWYwZjc4NjRiYSJ9.eyJ1cmwiOiJwaG90by9waG90b18yMDIwLTA5LTExXzIzLTQ1LTExLmpwZyIsImlhdCI6MTc0NTg1NDgwMCwiZXhwIjoxNzc3MzkwODAwfQ.oi1U8dCOKVmdXsS_FxcsNCWW9qZkil2mQvFdZ-df1Io"
                alt="Minimalist furniture craftsmanship"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="aspect-square overflow-hidden">
              <img
                src="https://rleynbzojbylvxrnbxxv.supabase.co/storage/v1/object/sign/photo/photo_2025-04-28_14-17-30.jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6InN0b3JhZ2UtdXJsLXNpZ25pbmcta2V5X2ZmN2QxOTA3LTYzNzItNDY4Ny1hM2M2LTMxMWYwZjc4NjRiYSJ9.eyJ1cmwiOiJwaG90by9waG90b18yMDI1LTA0LTI4XzE0LTE3LTMwLmpwZyIsImlhdCI6MTc0NTg1NDU1MywiZXhwIjoxNzc3MzkwNTUzfQ.w3bDD_QpPKfiEcey8xBy8ClsFF7MqbqVupyFPcGUcF4"
                alt="Modern furniture details"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="aspect-square overflow-hidden col-span-2">
              <img
                src="https://rleynbzojbylvxrnbxxv.supabase.co/storage/v1/object/sign/photo/photo_2025-04-28_14-17-30.jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6InN0b3JhZ2UtdXJsLXNpZ25pbmcta2V5X2ZmN2QxOTA3LTYzNzItNDY4Ny1hM2M2LTMxMWYwZjc4NjRiYSJ9.eyJ1cmwiOiJwaG90by9waG90b18yMDI1LTA0LTI4XzE0LTE3LTMwLmpwZyIsImlhdCI6MTc0NTg1NDU1MywiZXhwIjoxNzc3MzkwNTUzfQ.w3bDD_QpPKfiEcey8xBy8ClsFF7MqbqVupyFPcGUcF4"
                alt="Clean minimalist design"
                className="w-full h-full object-cover"
              />
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default AboutSection;