// Прямой скрипт для установки роли администратора
// Запуск: node scripts/set-admin.js [email] [service_role_key]

import { createClient } from '@supabase/supabase-js';

// Получение параметров из командной строки
const email = process.argv[2];
const serviceRoleKey = process.argv[3];
const supabaseUrl = 'https://rleynbzojbylvxrnbxxv.supabase.co';

// Проверка параметров
if (!email || !serviceRoleKey) {
  console.error('Ошибка: Не указаны email или ключ');
  console.log('Использование: node scripts/set-admin.js [email] [service_role_key]');
  process.exit(1);
}

// Создание клиента
const supabase = createClient(supabaseUrl, serviceRoleKey);

async function setAdmin() {
  try {
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

    console.log('✓ Роль пользователя успешно обновлена до администратора!');
    console.log('ID пользователя:', updatedUser.user.id);
    console.log('Email:', updatedUser.user.email);
    console.log('Метаданные:', JSON.stringify(updatedUser.user.user_metadata, null, 2));
    
    console.log('\nТеперь войдите в админ-панель снова, чтобы активировать новую роль');
    console.log('После изменения нужно выйти и войти заново для получения нового токена');

  } catch (err) {
    console.error('Произошла ошибка:', err.message);
  }
}

setAdmin(); 