import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

const AdminLoginPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { signIn, user, isAdmin } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const from = (location.state as any)?.from?.pathname || '/admin';
  const locationError = (location.state as any)?.error;

  useEffect(() => {
    // Если пользователь залогинен и имеет права администратора, перенаправляем на админ-панель
    if (user && isAdmin) {
      navigate('/admin', { replace: true });
    }
    
    // Если передана ошибка через state, отображаем её
    if (locationError) {
      setError(locationError);
    }
  }, [user, isAdmin, navigate, locationError]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await signIn(email, password);
      // Редирект будет выполнен через useEffect, когда обновится состояние user и isAdmin
    } catch (err: any) {
      console.error("Ошибка входа:", err.message);
      setError(t('admin.login.error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-light text-gray-900">
            {t('admin.login.title')}
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="text-red-500 text-sm text-center">{error}</div>
          )}
          <div className="space-y-4">
            <Input
              label={t('admin.login.email')}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              fullWidth
            />
            <Input
              label={t('admin.login.password')}
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              fullWidth
            />
          </div>
          <Button
            type="submit"
            fullWidth
            disabled={loading}
          >
            {loading ? t('common.loading') : t('admin.login.submit')}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default AdminLoginPage;