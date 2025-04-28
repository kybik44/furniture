-- Функция для проверки, является ли текущий пользователь администратором
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
DECLARE
  _role text;
  _user_role text;
BEGIN
  -- Получаем роль из JWT 
  _role := auth.jwt() ->> 'role';
  
  -- Получаем роль из метаданных пользователя
  _user_role := auth.jwt() -> 'user_metadata' ->> 'role';
  
  -- Выводим информацию для диагностики
  RAISE LOG 'JWT role: %, user_metadata.role: %', _role, _user_role;
  
  RETURN (
    _role = 'admin' OR
    _user_role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION is_admin IS 'Проверяет, имеет ли текущий пользователь роль администратора';

-- Разрешаем анонимным пользователям выполнять эту функцию
GRANT EXECUTE ON FUNCTION is_admin TO anon;
GRANT EXECUTE ON FUNCTION is_admin TO authenticated;
GRANT EXECUTE ON FUNCTION is_admin TO service_role; 