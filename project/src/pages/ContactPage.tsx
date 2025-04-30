import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Phone, Mail, MapPin, Clock, AlertTriangle } from 'lucide-react';
import Layout from '../components/layout/Layout';
import ContactForm from '../components/contact/ContactForm';
import { useTranslation } from 'react-i18next';

// Типы для Яндекс карт
interface YMapOptions {
  center: [number, number];
  zoom: number;
  controls: string[];
}

interface PlacemarkProperties {
  hintContent: string;
  balloonContent: string;
}

interface PlacemarkOptions {
  iconLayout: string;
  iconImageHref: string;
  iconImageSize: [number, number];
  iconImageOffset: [number, number];
}

const ContactPage: React.FC = () => {
  const { t } = useTranslation();
  const [mapLoaded, setMapLoaded] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);

  useEffect(() => {
    // Загружаем Яндекс Карты
    const script = document.createElement('script');
    script.src = 'https://api-maps.yandex.ru/2.1/?apikey=085aba78-7559-4ba1-8e11-d62b333333df&lang=ru_RU';
    script.async = true;
    script.onload = () => initMap();
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const initMap = () => {
    if (window.ymaps) {
      window.ymaps.ready(() => {
        const myMap = new window.ymaps.Map('map', {
          center: [53.902735, 27.555696], // Координаты центра Москвы
          zoom: 15,
          controls: ['zoomControl']
        });

        const myPlacemark = new window.ymaps.Placemark(
          [53.902735, 27.555696],
          {
            hintContent: 'LegnoVivo',
            balloonContent: 'Мебельный магазин LegnoVivo'
          },
          {
            iconLayout: 'default#image',
            iconImageHref: '/marker.svg',
            iconImageSize: [32, 32],
            iconImageOffset: [-16, -32]
          }
        );

        myMap.geoObjects.add(myPlacemark);
        setMapLoaded(true);
      });
    }
  };

  const handleContactSuccess = () => {
    setFormSubmitted(true);
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

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
            <h1 className="text-3xl md:text-4xl font-light mb-6">{t('contact.title')}</h1>
            <p className="text-gray-600 font-light leading-relaxed">
              {t('contact.subtitle')}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Информация о контактах и карта */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Контактная информация */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="space-y-10"
            >
              <div className="bg-white p-8 border border-gray-100 shadow-sm">
                <h2 className="text-2xl font-light mb-8">{t('contact.info.title')}</h2>
                
                <div className="space-y-6">
                  <div className="flex items-start">
                    <div className="bg-black text-white p-2 rounded mr-4">
                      <MapPin size={20} />
                    </div>
                    <div>
                      <h3 className="font-medium mb-1">{t('contact.info.address.title')}</h3>
                      <p className="text-gray-600 font-light">
                        {t('contact.info.address.line1')}
                      </p>
                      <p className="text-gray-600 font-light">
                        {t('contact.info.address.line2')}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="bg-black text-white p-2 rounded mr-4">
                      <Phone size={20} />
                    </div>
                    <div>
                      <h3 className="font-medium mb-1">{t('contact.info.phone.title')}</h3>
                      <p className="text-gray-600 font-light">
                        <a href="tel:+380971234567" className="hover:text-black transition-colors">
                          +380 97 123 45 67
                        </a>
                      </p>
                      <p className="text-gray-600 font-light">
                        <a href="tel:+380971234568" className="hover:text-black transition-colors">
                          +380 97 123 45 68
                        </a>
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="bg-black text-white p-2 rounded mr-4">
                      <Mail size={20} />
                    </div>
                    <div>
                      <h3 className="font-medium mb-1">{t('contact.info.email.title')}</h3>
                      <p className="text-gray-600 font-light">
                        <a href="mailto:contact@legnovivo.com" className="hover:text-black transition-colors">
                          contact@legnovivo.com
                        </a>
                      </p>
                      <p className="text-gray-600 font-light">
                        <a href="mailto:info@legnovivo.com" className="hover:text-black transition-colors">
                          info@legnovivo.com
                        </a>
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="bg-black text-white p-2 rounded mr-4">
                      <Clock size={20} />
                    </div>
                    <div>
                      <h3 className="font-medium mb-1">{t('contact.info.hours.title')}</h3>
                      <p className="text-gray-600 font-light">{t('contact.info.hours.weekdays')}</p>
                      <p className="text-gray-600 font-light">{t('contact.info.hours.weekend')}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Предупреждение */}
              <div className="bg-amber-50 border border-amber-200 p-6 rounded-md">
                <div className="flex items-start">
                  <AlertTriangle size={24} className="text-amber-500 mr-4 mt-1" />
                  <div>
                    <h3 className="font-medium mb-2 text-amber-800">{t('contact.alert.title')}</h3>
                    <p className="text-amber-700 font-light">
                      {t('contact.alert.text')}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
            
            {/* Карта и форма */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="space-y-10"
            >
              {/* Карта */}
              <div 
                id="map" 
                className="w-full h-[300px] bg-gray-200 relative overflow-hidden"
                style={{ filter: 'grayscale(0.8)' }}
              >
                {!mapLoaded && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <p className="text-gray-500">{t('contact.map.loading')}</p>
                  </div>
                )}
              </div>
              
              {/* Форма */}
              <div className="bg-white p-8 border border-gray-100 shadow-sm">
                {formSubmitted ? (
                  <div className="text-center py-8">
                    <h3 className="text-xl font-light mb-4">{t('contact.form.success.title')}</h3>
                    <p className="text-gray-600 font-light mb-2">
                      {t('contact.form.success.message')}
                    </p>
                  </div>
                ) : (
                  <>
                    <h2 className="text-2xl font-light mb-8">{t('contact.form.title')}</h2>
                    <ContactForm onSuccess={handleContactSuccess} />
                  </>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

// Добавляем определение типа для window с ymaps
declare global {
  interface Window {
    ymaps: {
      ready: (callback: () => void) => void;
      Map: new (element: string, options: YMapOptions) => {
        geoObjects: {
          add: (geoObject: unknown) => void;
        };
      };
      Placemark: new (
        coordinates: [number, number], 
        properties: PlacemarkProperties, 
        options: PlacemarkOptions
      ) => unknown;
    };
  }
}

export default ContactPage; 