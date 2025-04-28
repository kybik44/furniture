/*
 * Скрипт для создания пользователя с правами администратора через Supabase API
 * 
 * Для использования:
 * 1. Создайте .env файл в корне проекта с переменными 
 *    SUPABASE_URL и SUPABASE_SERVICE_ROLE_KEY
 * 2. Запустите скрипт: node scripts/create-admin.js
 */

require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

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

const askQuestion = (question) => {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer);
    });
  });
};

const createAdmin = async () => {
  try {
    // Запрос данных пользователя
    const email = await askQuestion('Email администратора: ');
    const password = await askQuestion('Пароль администратора: ');
    
    if (!email || !password) {
      console.error('Email и пароль обязательны');
      return;
    }

    // Создание пользователя
    console.log('Создание пользователя...');
    const { data: user, error: userError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { role: 'admin' },
    });

    if (userError) {
      console.error('Ошибка при создании пользователя:', userError.message);
      return;
    }

    console.log('Пользователь успешно создан!');
    console.log('ID пользователя:', user.user.id);
    console.log('Email:', user.user.email);
    console.log('Роль: admin');

    // Проверка наличия функции is_admin 
    console.log('Проверка наличия функции is_admin...');
    const { error: fnCheckError } = await supabase.rpc('is_admin');
    
    if (fnCheckError && fnCheckError.message.includes('function "is_admin" does not exist')) {
      console.log('Функция is_admin не найдена. Создание...');
      
      // Создание функции is_admin
      const { error: fnCreateError } = await supabase.rpc('create_is_admin_function', {
        sql_function: `
          CREATE OR REPLACE FUNCTION is_admin()
          RETURNS BOOLEAN AS $$
          BEGIN
            RETURN (
              (auth.jwt() ->> 'role')::text = 'admin' 
              OR (auth.jwt() -> 'user_metadata' ->> 'role')::text = 'admin'
            );
          END;
          $$ LANGUAGE plpgsql SECURITY DEFINER;
        `
      });
      
      if (fnCreateError) {
        console.error('Ошибка при создании функции is_admin:', fnCreateError.message);
        console.log('Создайте функцию вручную через SQL Editor в Supabase Dashboard:');
        console.log(`
          CREATE OR REPLACE FUNCTION is_admin()
          RETURNS BOOLEAN AS $$
          BEGIN
            RETURN (
              (auth.jwt() ->> 'role')::text = 'admin' 
              OR (auth.jwt() -> 'user_metadata' ->> 'role')::text = 'admin'
            );
          END;
          $$ LANGUAGE plpgsql SECURITY DEFINER;
        `);
      } else {
        console.log('Функция is_admin успешно создана');
      }
    } else {
      console.log('Функция is_admin уже существует');
    }

    console.log('\nТеперь вы можете войти в админ-панель с этими учетными данными.');

  } catch (err) {
    console.error('Произошла ошибка:', err.message);
  } finally {
    rl.close();
  }
};

createAdmin(); 