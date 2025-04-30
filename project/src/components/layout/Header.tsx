import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ShoppingBag, Search, Heart } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from '../ui/LanguageSwitcher';
import SearchModal from '../ui/SearchModal';

const Header: React.FC = () => {
  const { t } = useTranslation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const { toggleCart, cartCount } = useCart();
  const location = useLocation();

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearchClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsSearchModalOpen(true);
  };

  return (
    <>
      <header 
        className={`fixed top-0 left-0 right-0 z-30 transition-all duration-300 ${
          isScrolled ? 'bg-white shadow-sm' : 'bg-transparent'
        }`}
      >
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <Link to="/" className="font-light text-xl tracking-wide">
              LegnoVivo
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <Link to="/" className="text-sm text-gray-800 hover:text-black transition-colors">
                {t('common.home')}
              </Link>
              <Link to="/catalog" className="text-sm text-gray-800 hover:text-black transition-colors">
                {t('common.catalog')}
              </Link>
              <Link to="/about" className="text-sm text-gray-800 hover:text-black transition-colors">
                {t('common.about')}
              </Link>
              <Link to="/contact" className="text-sm text-gray-800 hover:text-black transition-colors">
                {t('common.contact')}
              </Link>
            </nav>

            {/* Icons */}
            <div className="flex items-center space-x-4">
              <LanguageSwitcher />
              <button 
                onClick={handleSearchClick}
                className="text-gray-700 hover:text-black transition-colors"
                aria-label={t('common.search')}
              >
                <Search size={20} />
              </button>
              <Link to="/favorites" className="text-gray-700 hover:text-black transition-colors">
                <Heart size={20} />
              </Link>
              <button 
                onClick={toggleCart}
                className="text-gray-700 hover:text-black transition-colors relative"
                aria-label={t('common.cart')}
              >
                <ShoppingBag size={20} />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-black text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
                    {cartCount}
                  </span>
                )}
              </button>
              <button
                onClick={() => setIsMenuOpen(true)}
                className="md:hidden text-gray-700 hover:text-black transition-colors"
                aria-label={t('common.menu')}
              >
                <Menu size={24} />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed inset-0 bg-white z-50 md:hidden"
            >
              <div className="flex flex-col h-full">
                <div className="flex justify-between items-center p-4 border-b">
                  <Link to="/" className="font-light text-xl tracking-wide" onClick={() => setIsMenuOpen(false)}>
                    LegnoVivo
                  </Link>
                  <button
                    onClick={() => setIsMenuOpen(false)}
                    className="text-gray-700 hover:text-black transition-colors"
                    aria-label={t('common.close')}
                  >
                    <X size={24} />
                  </button>
                </div>
                <nav className="flex flex-col p-4 space-y-6 mt-8">
                  <div className="flex justify-end mb-4">
                    <LanguageSwitcher />
                  </div>
                  <Link to="/" className="text-gray-800 hover:text-black transition-colors py-2 text-lg">
                    {t('common.home')}
                  </Link>
                  <Link to="/catalog" className="text-gray-800 hover:text-black transition-colors py-2 text-lg">
                    {t('common.catalog')}
                  </Link>
                  <Link to="/about" className="text-gray-800 hover:text-black transition-colors py-2 text-lg">
                    {t('common.about')}
                  </Link>
                  <Link to="/contact" className="text-gray-800 hover:text-black transition-colors py-2 text-lg">
                    {t('common.contact')}
                  </Link>
                </nav>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Search Modal */}
      <SearchModal isOpen={isSearchModalOpen} onClose={() => setIsSearchModalOpen(false)} />
    </>
  );
};

export default Header;