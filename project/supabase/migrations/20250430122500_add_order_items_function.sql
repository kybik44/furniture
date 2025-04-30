-- Функция для добавления элементов заказа через RPC вызов
CREATE OR REPLACE FUNCTION add_order_items(items_data json)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  created_items jsonb;
BEGIN
  -- Вставляем элементы заказа в таблицу order_items
  WITH inserted_items AS (
    INSERT INTO order_items (
      order_id,
      product_id,
      quantity,
      price
    )
    SELECT 
      (item->>'order_id')::uuid,
      (item->>'product_id')::uuid,
      (item->>'quantity')::integer,
      (item->>'price')::numeric
    FROM json_array_elements(items_data) AS item
    RETURNING id, order_id, product_id, quantity, price, created_at
  )
  SELECT json_agg(row_to_json(i)) FROM inserted_items i INTO created_items;
  
  -- Если нет элементов, возвращаем пустой массив
  IF created_items IS NULL THEN
    created_items := '[]'::jsonb;
  END IF;
  
  -- Возвращаем созданные элементы заказа
  RETURN created_items;
END;
$$;

-- Добавляем комментарий к функции
COMMENT ON FUNCTION add_order_items IS 'Добавляет элементы заказа с правами SECURITY DEFINER, что позволяет обойти RLS';

-- Разрешаем анонимным и авторизованным пользователям выполнять эту функцию
GRANT EXECUTE ON FUNCTION add_order_items TO anon, authenticated, service_role;

-- Создадим RLS политики для таблицы order_items
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- Политика для вставки
CREATE POLICY "Enable insert for authenticated and anon users" ON public.order_items
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Политика для чтения
CREATE POLICY "Enable read access for users based on order user_id" ON public.order_items
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = order_items.order_id
      AND (orders.user_id = auth.uid() OR is_admin())
    )
  );

-- Политика для сервисной роли
CREATE POLICY "Service role can do all on order_items" ON public.order_items
  TO service_role
  USING (true)
  WITH CHECK (true); 