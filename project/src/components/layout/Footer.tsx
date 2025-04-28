import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Facebook, Twitter } from 'lucide-react';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { useTranslation } from 'react-i18next';

const Footer: React.FC = () => {
  const { t } = useTranslation();
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Newsletter subscription logic would go here
  };

  return (
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
            <h3 className="text-sm mb-4 font-medium">{t('footer.company')}</h3>
            <ul className="space-y-2 text-sm font-light">
              <li><Link to="/about" className="text-gray-600 hover:text-black transition-colors">{t('common.about')}</Link></li>
              <li><Link to="/contact" className="text-gray-600 hover:text-black transition-colors">{t('common.contact')}</Link></li>
              <li><Link to="/careers" className="text-gray-600 hover:text-black transition-colors">{t('footer.careers')}</Link></li>
              <li><Link to="/showroom" className="text-gray-600 hover:text-black transition-colors">{t('footer.showroom')}</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm mb-4 font-medium">{t('footer.categories')}</h3>
            <ul className="space-y-2 text-sm font-light">
              <li><Link to="/catalog?category=chairs" className="text-gray-600 hover:text-black transition-colors">{t('footer.chairs')}</Link></li>
              <li><Link to="/catalog?category=lamps" className="text-gray-600 hover:text-black transition-colors">{t('footer.lamps')}</Link></li>
              <li><Link to="/catalog?category=beds" className="text-gray-600 hover:text-black transition-colors">{t('footer.beds')}</Link></li>
              <li><Link to="/catalog?category=sofas" className="text-gray-600 hover:text-black transition-colors">{t('footer.sofas')}</Link></li>
              <li><Link to="/catalog?category=tables" className="text-gray-600 hover:text-black transition-colors">{t('footer.tables')}</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm mb-4 font-medium">{t('footer.newsletter')}</h3>
            <p className="text-sm text-gray-600 font-light mb-4">
              {t('footer.newsletterText')}
            </p>
            <form onSubmit={handleSubmit}>
              <div className="flex">
                <Input
                  type="email"
                  placeholder={t('footer.yourEmail')}
                  className="flex-1 border-r-0"
                  required
                />
                <Button type="submit" variant="primary" size="md">
                  {t('footer.subscribe')}
                </Button>
              </div>
            </form>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-gray-100">
          <p className="text-xs text-gray-500 font-light">
            © {new Date().getFullYear()} LegnoVivo. {t('footer.allRightsReserved')}
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
  );
};

export default Footer;