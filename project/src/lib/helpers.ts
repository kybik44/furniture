import i18n from '../i18n';

/**
 * Возвращает локализованное значение поля в зависимости от текущего языка
 * @param base Базовое значение (английское)
 * @param localized Локализованное значение (русское)
 * @returns Возвращает локализованное значение в зависимости от текущего языка
 */
export const getLocalizedValue = (base: string, localized?: string): string => {
  const currentLanguage = i18n.language;
  
  if (currentLanguage === 'ru' && localized) {
    return localized;
  }
  
  return base;
};

/**
 * Изменяет текущий язык приложения
 * @param language Код языка ('ru' или 'en')
 */
export const changeLanguage = (language: 'ru' | 'en') => {
  i18n.changeLanguage(language);
  
  // Сохраняем выбранный язык в localStorage
  localStorage.setItem('i18nextLng', language);
};

/**
 * Получает текущий язык интерфейса
 * @returns Код текущего языка ('ru' или 'en')
 */
export const getCurrentLanguage = (): 'ru' | 'en' => {
  return i18n.language as 'ru' | 'en';
}; 