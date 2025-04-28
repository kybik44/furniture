import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { LayoutDashboard, Package, Cat as Categories, ShoppingCart, MessageSquare, Users, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const { signOut } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/admin/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const menuItems = [
    {
      path: '/admin',
      label: t('admin.dashboard.title'),
      icon: LayoutDashboard
    },
    {
      path: '/admin/orders',
      label: t('admin.orders.title'),
      icon: ShoppingCart
    },
    {
      path: '/admin/products',
      label: t('admin.products.title'),
      icon: Package
    },
    {
      path: '/admin/categories',
      label: t('admin.categories.title'),
      icon: Categories
    },
    {
      path: '/admin/reviews',
      label: t('admin.reviews.title'),
      icon: MessageSquare
    },
    {
      path: '/admin/subscribers',
      label: t('admin.subscribers.title'),
      icon: Users
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <Link to="/admin" className="flex items-center">
                <span className="text-xl font-light">LegnoVivo Admin</span>
              </Link>
            </div>
            <div className="flex items-center">
              <button
                onClick={handleSignOut}
                className="flex items-center text-gray-500 hover:text-gray-700"
              >
                <LogOut size={20} className="mr-2" />
                <span>Выйти</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-white h-[calc(100vh-4rem)] border-r border-gray-200">
          <nav className="mt-5 px-2">
            <div className="space-y-1">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`
                      group flex items-center px-2 py-2 text-sm font-light rounded-md
                      ${isActive 
                        ? 'bg-gray-100 text-gray-900' 
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}
                    `}
                  >
                    <Icon
                      size={20}
                      className={`
                        mr-3 flex-shrink-0
                        ${isActive ? 'text-gray-500' : 'text-gray-400 group-hover:text-gray-500'}
                      `}
                    />
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8">
          {children}
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;