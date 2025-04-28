import React from 'react';
import { useTranslation } from 'react-i18next';
import AdminLayout from '../../components/admin/AdminLayout';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../../lib/supabase';
import { Package, ShoppingCart, MessageSquare, Users } from 'lucide-react';

const AdminDashboardPage: React.FC = () => {
  const { t } = useTranslation();

  const { data: stats } = useQuery({
    queryKey: ['admin', 'stats'],
    queryFn: async () => {
      const [products, orders, reviews, subscribers] = await Promise.all([
        supabase.from('products').select('id', { count: 'exact' }),
        supabase.from('orders').select('id', { count: 'exact' }),
        supabase.from('reviews').select('id', { count: 'exact' }),
        supabase.from('subscribers').select('id', { count: 'exact' })
      ]);

      return {
        products: products.count || 0,
        orders: orders.count || 0,
        reviews: reviews.count || 0,
        subscribers: subscribers.count || 0
      };
    }
  });

  const cards = [
    {
      title: t('admin.dashboard.products'),
      count: stats?.products || 0,
      icon: Package,
      link: '/admin/products'
    },
    {
      title: t('admin.dashboard.orders'),
      count: stats?.orders || 0,
      icon: ShoppingCart,
      link: '/admin/orders'
    },
    {
      title: t('admin.dashboard.reviews'),
      count: stats?.reviews || 0,
      icon: MessageSquare,
      link: '/admin/reviews'
    },
    {
      title: t('admin.dashboard.subscribers'),
      count: stats?.subscribers || 0,
      icon: Users,
      link: '/admin/subscribers'
    }
  ];

  return (
    <AdminLayout>
      <h1 className="text-2xl font-light mb-8">{t('admin.dashboard.title')}</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.title}
              className="bg-white p-6 rounded-lg shadow-sm border border-gray-100"
            >
              <div className="flex items-center justify-between mb-4">
                <Icon size={24} className="text-gray-400" />
                <span className="text-2xl font-light">{card.count}</span>
              </div>
              <h3 className="text-gray-600 font-light">{card.title}</h3>
            </div>
          );
        })}
      </div>
    </AdminLayout>
  );
};

export default AdminDashboardPage;