# LegnoVivo - Магазин мебели

## Настройка и запуск проекта

### Предварительные требования
- Node.js 18+ и npm/yarn/pnpm
- Аккаунт Supabase с созданным проектом

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

### Шаг 4: Запуск проекта
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
- `/supabase` - миграции и настройки Supabase 