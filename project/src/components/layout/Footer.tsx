import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Facebook, Twitter } from 'lucide-react';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { useTranslation } from 'react-i18next';
import { useCategories } from '../../lib/hooks';
import { getLocalizedValue } from '../../lib/helpers';
import { useSubscribe } from '../../lib/hooks';
import { generateDiscountCode } from '../../lib/helpers';
import { sendDiscountCode } from '../../services/emailService';
import { subscriberApi } from '../../lib/api';
import Modal from '../ui/Modal';

const Footer: React.FC = () => {
  const { t } = useTranslation();
  const { data: categories } = useCategories();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [discountCode, setDiscountCode] = useState('');
  
  const subscribe = useSubscribe();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    setLoading(true);
    
    try {
      // Проверка, существует ли уже подписчик с таким email
      const existingSubscriber = await subscriberApi.findByEmail(email);
      
      if (existingSubscriber) {
        // Если подписчик существует, отправляем его существующий код
        await sendDiscountCode(existingSubscriber.name, email, existingSubscriber.discount_code);
        setDiscountCode(existingSubscriber.discount_code);
      } else {
        // Если это новый подписчик, генерируем новый код и сохраняем
        // Для футера имя подписчика берём из первой части email
        const name = email.split('@')[0];
        const newDiscountCode = generateDiscountCode();
        await subscribe.mutateAsync({ name, email, discountCode: newDiscountCode });
        await sendDiscountCode(name, email, newDiscountCode);
        setDiscountCode(newDiscountCode);
      }
      
      setIsSuccessModalOpen(true);
    } catch (err) {
      console.error('Error subscribing:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <footer className="bg-white pt-16 pb-8 border-t border-gray-100">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            <div>
              <Link to="/" className="font-light text-xl tracking-wide mb-6 block">
                LegnoVivo
              </Link>
              <address className="not-italic text-sm text-gray-600 font-light">
                <p>Строителей 22</p>
                <p>Мосты, 220003</p>
                <p className="mt-2">contact@legnovivo.com</p>
                <p>+380971234567</p>
              </address>
            </div>

            <div>
              <h3 className="text-sm mb-4 font-medium">{t('footer.companyTitle')}</h3>
              <ul className="space-y-2 text-sm font-light">
                <li><Link to="/about" className="text-gray-600 hover:text-black transition-colors">{t('footer.aboutLink')}</Link></li>
                <li><Link to="/catalog" className="text-gray-600 hover:text-black transition-colors">{t('footer.catalogLink')}</Link></li>
                <li><Link to="/contact" className="text-gray-600 hover:text-black transition-colors">{t('footer.contactLink')}</Link></li>
                <li><Link to="/careers" className="text-gray-600 hover:text-black transition-colors">{t('footer.careers')}</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="text-sm mb-4 font-medium">{t('footer.servicesTitle')}</h3>
              <ul className="space-y-2 text-sm font-light">
                {categories?.map(category => (
                  <li key={category.id}>
                    <Link 
                      to={`/catalog?category=${category.slug}`} 
                      className="text-gray-600 hover:text-black transition-colors"
                    >
                      {getLocalizedValue(category.name, category.name_ru)}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-sm mb-4 font-medium">{t('footer.newsletterTitle')}</h3>
              <p className="text-sm text-gray-600 font-light mb-4">
                {t('footer.newsletterText')}
              </p>
              <form onSubmit={handleSubmit}>
                <div className="flex">
                  <Input
                    type="email"
                    placeholder={t('footer.newsletterPlaceholder')}
                    className="flex-1 border-r-0"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={loading}
                  />
                  <Button type="submit" variant="primary" size="md" disabled={loading}>
                    {loading ? '...' : t('footer.subscribeButton')}
                  </Button>
                </div>
              </form>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-gray-100">
            <p className="text-xs text-gray-500 font-light">
              {t('footer.copyright')}
            </p>
            <div className="flex space-x-4 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-black transition-colors">
                <Instagram size={18} />
              </a>
              <a href="#" className="text-gray-400 hover:text-black transition-colors">
                <Facebook size={18} />
              </a>
              <a href="#" className="text-gray-400 hover:text-black transition-colors">
                <Twitter size={18} />
              </a>
            </div>
          </div>
        </div>
      </footer>
      
      <Modal
        isOpen={isSuccessModalOpen}
        onClose={() => setIsSuccessModalOpen(false)}
        title={t('home.discount.success.title')}
      >
        <div className="text-center py-4">
          <p className="text-gray-600 mb-6">
            {t('home.discount.success.message')}
          </p>
          <p className="text-sm text-gray-500 mb-6">
            {t('home.discount.success.check')}
          </p>
          
          <div className="bg-gray-50 p-4 mb-6 rounded-md">
            <p className="text-sm text-gray-500 mb-1">{t('Ваш код скидки:')}</p>
            <p className="text-lg font-semibold letter-spacing-2">{discountCode}</p>
          </div>
          
          <Button onClick={() => setIsSuccessModalOpen(false)} variant="primary">
            {t('common.close')}
          </Button>
        </div>
      </Modal>
    </>
  );
};

export default Footer;