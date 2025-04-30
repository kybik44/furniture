import React from 'react';
import { motion } from 'framer-motion';
import Layout from '../components/layout/Layout';
import { useTranslation } from 'react-i18next';

const AboutPage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <Layout>
      {/* Заголовок */}
      <section className="pt-16 md:pt-24 bg-gray-50">
        <div className="container mx-auto px-4 md:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl mx-auto text-center mb-12"
          >
            <h1 className="text-3xl md:text-4xl font-light mb-6">{t('about.title')}</h1>
            <p className="text-gray-600 font-light leading-relaxed">
              {t('about.subtitle')}
            </p>
          </motion.div>
        </div>
      </section>

      {/* О нашей компании */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <img
                src="https://images.pexels.com/photos/4050299/pexels-photo-4050299.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                alt="Мастерская LegnoVivo"
                className="w-full h-auto rounded-lg"
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <h2 className="text-2xl md:text-3xl font-light mb-6">{t('about.ourStory.title')}</h2>
              <p className="text-gray-600 font-light mb-4 leading-relaxed">
                {t('about.ourStory.text1')}
              </p>
              <p className="text-gray-600 font-light mb-4 leading-relaxed">
                {t('about.ourStory.text2')}
              </p>
              <p className="text-gray-600 font-light leading-relaxed">
                {t('about.ourStory.text3')}
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Наши ценности */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="container mx-auto px-4 md:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-2xl md:text-3xl font-light mb-6">{t('about.values.title')}</h2>
            <p className="text-gray-600 font-light max-w-2xl mx-auto">
              {t('about.values.subtitle')}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Ценность 1 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="bg-white p-8 rounded-lg"
            >
              <h3 className="text-xl font-light mb-4">{t('about.values.quality.title')}</h3>
              <p className="text-gray-600 font-light">
                {t('about.values.quality.text')}
              </p>
            </motion.div>

            {/* Ценность 2 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white p-8 rounded-lg"
            >
              <h3 className="text-xl font-light mb-4">{t('about.values.sustainability.title')}</h3>
              <p className="text-gray-600 font-light">
                {t('about.values.sustainability.text')}
              </p>
            </motion.div>

            {/* Ценность 3 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-white p-8 rounded-lg"
            >
              <h3 className="text-xl font-light mb-4">{t('about.values.design.title')}</h3>
              <p className="text-gray-600 font-light">
                {t('about.values.design.text')}
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Наша команда */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-2xl md:text-3xl font-light mb-6">{t('about.team.title')}</h2>
            <p className="text-gray-600 font-light max-w-2xl mx-auto">
              {t('about.team.subtitle')}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Член команды 1 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-center"
            >
              <img
                src="https://images.pexels.com/photos/8090137/pexels-photo-8090137.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                alt="Дмитрий Иванов"
                className="w-32 h-32 mx-auto rounded-full object-cover mb-6"
              />
              <h3 className="text-xl font-light mb-2">{t('about.team.member1.name')}</h3>
              <p className="text-gray-500 font-light mb-4">{t('about.team.member1.position')}</p>
              <p className="text-gray-600 font-light">
                {t('about.team.member1.bio')}
              </p>
            </motion.div>

            {/* Член команды 2 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-center"
            >
              <img
                src="https://images.pexels.com/photos/3771807/pexels-photo-3771807.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                alt="Анна Сергеева"
                className="w-32 h-32 mx-auto rounded-full object-cover mb-6"
              />
              <h3 className="text-xl font-light mb-2">{t('about.team.member2.name')}</h3>
              <p className="text-gray-500 font-light mb-4">{t('about.team.member2.position')}</p>
              <p className="text-gray-600 font-light">
                {t('about.team.member2.bio')}
              </p>
            </motion.div>

            {/* Член команды 3 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-center sm:col-span-2 lg:col-span-1 mx-auto max-w-sm"
            >
              <img
                src="https://images.pexels.com/photos/8090138/pexels-photo-8090138.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                alt="Михаил Петров"
                className="w-32 h-32 mx-auto rounded-full object-cover mb-6"
              />
              <h3 className="text-xl font-light mb-2">{t('about.team.member3.name')}</h3>
              <p className="text-gray-500 font-light mb-4">{t('about.team.member3.position')}</p>
              <p className="text-gray-600 font-light">
                {t('about.team.member3.bio')}
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Мастерская */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="order-2 md:order-1"
            >
              <h2 className="text-2xl md:text-3xl font-light mb-6">{t('about.workshop.title')}</h2>
              <p className="text-gray-600 font-light mb-4 leading-relaxed">
                {t('about.workshop.text1')}
              </p>
              <p className="text-gray-600 font-light leading-relaxed">
                {t('about.workshop.text2')}
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="order-1 md:order-2"
            >
              <img
                src="https://images.pexels.com/photos/5976503/pexels-photo-5976503.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                alt="Мастерская LegnoVivo"
                className="w-full h-auto rounded-lg"
              />
            </motion.div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default AboutPage; 