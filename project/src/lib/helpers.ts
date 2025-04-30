import i18n from 'i18next';

/**
 * Возвращает локализованное значение поля в зависимости от текущего языка
 * @param base Базовое значение (английское)
 * @param localized Локализованное значение (русское)
 * @returns Возвращает локализованное значение в зависимости от текущего языка
 */
export const getLocalizedValue = (base: string, localized?: string): string => {
  const currentLanguage = getCurrentLanguage();
  
  if (currentLanguage === 'ru' && localized) {
    return localized;
  }
  
  return base;
};

/**
 * Изменяет текущий язык приложения
 * @param language Код языка ('ru' или 'en')
 */
export const changeLanguage = (language: 'ru' | 'en'): void => {
  i18n.changeLanguage(language);
  
  // Сохраняем выбранный язык в localStorage
  localStorage.setItem('i18nextLng', language);
};

/**
 * Получает текущий язык интерфейса
 * @returns Код текущего языка ('ru' или 'en')
 */
export const getCurrentLanguage = (): 'ru' | 'en' => {
  return (i18n.language || 'ru').split('-')[0] as 'ru' | 'en';
};

/**
 * Генерирует уникальный код скидки
 * @param prefix Префикс для кода скидки
 * @returns Строка в формате PREFIX-XXXX-XXXX
 */
export const generateDiscountCode = (prefix: string = 'LV'): string => {
  const characters = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Исключены похожие символы: O/0, 1/I
  let firstPart = '';
  let secondPart = '';
  
  // Генерация двух групп по 4 символа
  for (let i = 0; i < 4; i++) {
    firstPart += characters.charAt(Math.floor(Math.random() * characters.length));
    secondPart += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  
  // Возврат кода в формате PREFIX-XXXX-XXXX
  return `${prefix}-${firstPart}-${secondPart}`;
}; 