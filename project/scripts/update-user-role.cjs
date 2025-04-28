/*
 * Скрипт для обновления роли пользователя до администратора
 * 
 * Для использования:
 * 1. Создайте .env файл в корне проекта с переменными 
 *    SUPABASE_URL и SUPABASE_SERVICE_ROLE_KEY
 * 2. Запустите скрипт: node scripts/update-user-role.js [email]
 */

require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

// Проверка окружения
if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
  console.error('Ошибка: Не найдены переменные окружения SUPABASE_URL или SUPABASE_SERVICE_ROLE_KEY');
  console.log('Создайте файл .env в корне проекта и добавьте необходимые переменные');
  process.exit(1);
}

// Создание клиента с правами сервиса (для админских операций)
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const updateUserRole = async () => {
  try {
    // Получаем email из аргументов командной строки или запрашиваем его
    const email = process.argv[2];
    
    if (!email) {
      console.error('Ошибка: Email пользователя не указан');
      console.log('Использование: node scripts/update-user-role.js [email]');
      process.exit(1);
    }

    // Находим пользователя по email
    console.log(`Поиск пользователя с email: ${email}`);
    const { data: users, error: findError } = await supabase.auth.admin.listUsers();
    
    if (findError) {
      console.error('Ошибка при поиске пользователей:', findError.message);
      return;
    }

    const user = users.users.find(u => u.email === email);
    
    if (!user) {
      console.error(`Пользователь с email ${email} не найден`);
      return;
    }

    console.log(`Найден пользователь: ${user.id}`);
    
    // Обновляем метаданные пользователя с ролью admin
    console.log('Обновление роли пользователя до администратора...');
    
    // Получаем существующие метаданные
    const currentMetadata = user.user_metadata || {};
    
    // Обновляем метаданные
    const { data: updatedUser, error: updateError } = await supabase.auth.admin.updateUserById(
      user.id,
      { 
        user_metadata: { 
          ...currentMetadata,
          role: 'admin'
        }
      }
    );

    if (updateError) {
      console.error('Ошибка при обновлении роли пользователя:', updateError.message);
      return;
    }

    console.log('Роль пользователя успешно обновлена!');
    console.log('ID пользователя:', updatedUser.user.id);
    console.log('Email:', updatedUser.user.email);
    console.log('Метаданные:', JSON.stringify(updatedUser.user.user_metadata, null, 2));

    // Проверяем работу функции is_admin
    console.log('\nПроверка функции is_admin...');
    
    // Для проверки функции is_admin нужно войти как обновленный пользователь
    console.log('\nТеперь войдите в админ-панель снова, чтобы активировать новую роль.');
    console.log('После обновления метаданных нужно получить новый токен аутентификации.');

  } catch (err) {
    console.error('Произошла ошибка:', err.message);
  }
};

updateUserRole(); 