-- Функция для создания заказа через RPC вызов
CREATE OR REPLACE FUNCTION create_order(order_data json)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  created_order jsonb;
  inserted_id uuid;
  inserted_created_at timestamptz;
BEGIN
  -- Вставляем заказ в таблицу orders
  INSERT INTO orders (
    user_id,
    status,
    first_name,
    last_name,
    email,
    phone,
    address,
    city,
    postal_code,
    country,
    notes,
    total_amount
  )
  VALUES (
    (order_data->>'user_id')::uuid,
    order_data->>'status',
    order_data->>'first_name',
    order_data->>'last_name',
    order_data->>'email',
    order_data->>'phone',
    order_data->>'address',
    order_data->>'city',
    order_data->>'postal_code',
    order_data->>'country',
    order_data->>'notes',
    (order_data->>'total_amount')::numeric
  )
  RETURNING id, created_at INTO inserted_id, inserted_created_at;
  
  -- Создаем объект jsonb с данными созданного заказа
  created_order := jsonb_build_object(
    'id', inserted_id,
    'user_id', (order_data->>'user_id')::uuid,
    'status', order_data->>'status',
    'first_name', order_data->>'first_name',
    'last_name', order_data->>'last_name',
    'email', order_data->>'email',
    'phone', order_data->>'phone',
    'address', order_data->>'address',
    'city', order_data->>'city',
    'postal_code', order_data->>'postal_code',
    'country', order_data->>'country',
    'notes', order_data->>'notes',
    'total_amount', (order_data->>'total_amount')::numeric,
    'created_at', inserted_created_at,
    'updated_at', inserted_created_at
  );
  
  -- Возвращаем созданный заказ
  RETURN created_order;
END;
$$;

-- Добавляем комментарий к функции
COMMENT ON FUNCTION create_order IS 'Создает новый заказ с правами SECURITY DEFINER, что позволяет обойти RLS';

-- Разрешаем анонимным и авторизованным пользователям выполнять эту функцию
GRANT EXECUTE ON FUNCTION create_order TO anon, authenticated, service_role; 