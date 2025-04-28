import React from 'react';
import { changeLanguage, getCurrentLanguage } from '../../lib/helpers';

const LanguageSwitcher: React.FC = () => {
  const currentLanguage = getCurrentLanguage();
  
  const toggleLanguage = () => {
    const newLanguage = currentLanguage === 'ru' ? 'en' : 'ru';
    changeLanguage(newLanguage);
  };
  
  return (
    <button 
      onClick={toggleLanguage}
      className="text-sm py-1 px-2 border border-gray-200 rounded hover:bg-gray-50 transition-colors"
      aria-label={`Switch language to ${currentLanguage === 'ru' ? 'English' : 'Русский'}`}
    >
      {currentLanguage === 'ru' ? 'EN' : 'RU'}
    </button>
  );
};

export default LanguageSwitcher; 