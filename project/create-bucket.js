/*
 * Скрипт для создания бакета в Supabase Storage
 * 
 * Для использования:
 * 1. Убедитесь, что в .env файле есть переменные SUPABASE_URL и SUPABASE_SERVICE_ROLE_KEY
 * 2. Запустите скрипт: node create-bucket.js
 */

import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

// Используем переменные окружения из .env
const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Ошибка: Не найдены переменные окружения SUPABASE_URL и SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function createBucket(bucketName) {
  console.log(`Создание бакета '${bucketName}'...`);
  
  try {
    const { data, error } = await supabase.storage.createBucket(bucketName, {
      public: true,
      allowedMimeTypes: ['image/*'],
      fileSizeLimit: 1024 * 1024 * 5, // 5MB
    });
    
    if (error) {
      throw error;
    }
    
    console.log(`Бакет '${bucketName}' успешно создан!`);
    return data;
  } catch (error) {
    console.error('Ошибка при создании бакета:', error.message);
    if (error.message.includes('already exists')) {
      console.log('Бакет уже существует. Попытка обновления настроек...');
      
      try {
        const { data, error: updateError } = await supabase.storage.updateBucket(bucketName, {
          public: true,
          allowedMimeTypes: ['image/*'],
          fileSizeLimit: 1024 * 1024 * 5, // 5MB
        });
        
        if (updateError) throw updateError;
        
        console.log(`Настройки бакета '${bucketName}' обновлены!`);
        return data;
      } catch (updateError) {
        console.error('Ошибка при обновлении бакета:', updateError.message);
      }
    }
  }
}

async function main() {
  try {
    // Создаем бакеты для продуктов и категорий
    await createBucket('images');
    await createBucket('products');
    await createBucket('categories');
    
    console.log('Все бакеты успешно созданы или обновлены!');
  } catch (error) {
    console.error('Произошла ошибка:', error.message);
  }
}

main(); 