-- Сначала удалим существующую политику
DROP POLICY IF EXISTS "Allow insert on orders" ON public.orders;

-- Включим RLS для таблицы orders, если это еще не сделано
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Создадим новую политику с явной проверкой для вставки
CREATE POLICY "Enable insert for authenticated and anon users" ON public.orders
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Создадим политику для чтения записей
CREATE POLICY "Enable read access for authenticated users" ON public.orders
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id OR is_admin());

-- Создадим политику для чтения записей администраторами
CREATE POLICY "Enable admin read access for all orders" ON public.orders
  FOR SELECT
  TO authenticated
  USING (is_admin());

-- Создадим политику для обновления записей
CREATE POLICY "Enable update for users based on user_id" ON public.orders
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id OR is_admin())
  WITH CHECK (auth.uid() = user_id OR is_admin());

-- Создадим политику для удаления записей
CREATE POLICY "Enable delete for users based on user_id" ON public.orders
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id OR is_admin());

-- Разрешим сервисной роли все операции
CREATE POLICY "Service role can do all" ON public.orders
  TO service_role
  USING (true)
  WITH CHECK (true); 