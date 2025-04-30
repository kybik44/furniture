# LegnoVivo - Магазин мебели

## Настройка и запуск проекта

### Предварительные требования
- Node.js 18+ и npm/yarn/pnpm
- Аккаунт Supabase с созданным проектом
- Supabase CLI для деплоя Edge Functions

### Шаг 1: Установка зависимостей
```bash
# С использованием npm
npm install

# С использованием yarn
yarn

# С использованием pnpm
pnpm install
```

### Шаг 2: Настройка переменных окружения
Создайте файл `.env.local` в корне проекта со следующим содержимым:
```
VITE_SUPABASE_URL=https://your-project-url.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

Замените значения на соответствующие вашему проекту Supabase:
- `VITE_SUPABASE_URL`: URL вашего проекта Supabase
- `VITE_SUPABASE_ANON_KEY`: Анонимный ключ вашего проекта Supabase

Их можно найти в настройках проекта Supabase: Project Settings > API > URL и Project API keys.

### Шаг 3: Настройка базы данных
1. В Supabase Dashboard перейдите в раздел SQL Editor
2. Выполните SQL-скрипт из файла `supabase/migrations/20250428114457_small_desert.sql`

### Шаг 4: Настройка Edge Function для отправки email
1. Установите Supabase CLI, если еще не установлен:
```bash
npm install -g supabase
```

2. Войдите в свой аккаунт Supabase:
```bash
supabase login
```

3. Привяжите проект к вашему проекту Supabase:
```bash
supabase link --project-ref your-project-ref
```

4. Деплой Edge Function для отправки email:
```bash
supabase functions deploy send-email
```

5. Настройте переменные окружения для Edge Function:
```bash
supabase secrets set SMTP_HOST=your-smtp-host
supabase secrets set SMTP_PORT=465
supabase secrets set SMTP_USERNAME=your-smtp-username
supabase secrets set SMTP_PASSWORD=your-smtp-password
supabase secrets set EMAIL_FROM=your-email@example.com
```

Замените значения на соответствующие вашему SMTP серверу.

### Шаг 5: Запуск проекта
```bash
# С использованием npm
npm run dev

# С использованием yarn
yarn dev

# С использованием pnpm
pnpm dev
```

После запуска, приложение будет доступно по адресу: http://localhost:5173/

## Структура проекта
- `/src` - исходный код приложения
  - `/components` - React компоненты
  - `/context` - React контексты
  - `/lib` - вспомогательные функции и хуки
  - `/pages` - страницы приложения
  - `/types` - TypeScript типы
  - `/i18n` - локализация
  - `/data` - статические данные
  - `/services` - сервисы приложения
- `/supabase` - миграции и настройки Supabase
  - `/functions` - Edge Functions для Supabase

## Лавандовая Пустыня

### Применение миграций

Для применения миграций к базе данных Supabase, следуйте этим шагам:

1. Убедитесь, что у вас установлен Supabase CLI:
```bash
npm install -g supabase
```

2. Войдите в свой аккаунт Supabase:
```bash
supabase login
```

3. Привяжите проект к вашему проекту Supabase:
```bash
supabase link --project-ref your-project-ref
```

4. Примените миграции:
```bash
supabase db push
```

### Обновление политик безопасности

Если у вас возникла ошибка 401 Unauthorized при создании заказов, выполните миграцию, которая исправляет политики безопасности для таблицы orders:

1. Привяжите проект, если еще не сделали:
```bash
supabase link --project-ref your-project-ref
```

2. Применить последнюю миграцию:
```bash
supabase db push
```

Или вы можете выполнить SQL-запрос напрямую через SQL-редактор в панели управления Supabase:

```sql
-- Удаляем существующую политику для INSERT в таблицу orders
DROP POLICY IF EXISTS "Orders can be created by anyone" ON orders;

-- Создаем новую политику, которая явно разрешает анонимным пользователям создавать заказы
CREATE POLICY "Orders can be created by anyone" ON orders
  FOR INSERT WITH CHECK (true);
``` 