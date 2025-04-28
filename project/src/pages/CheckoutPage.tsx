import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Layout from '../components/layout/Layout';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { useCart } from '../context/CartContext';
import { ChevronLeft, AlertTriangle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useCreateOrder } from '../lib/hooks';
import { useAuth } from '../context/AuthContext';

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
  notes: string;
}

const CheckoutPage: React.FC = () => {
  const { t } = useTranslation();
  const { cartItems, cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const createOrder = useCreateOrder();
  
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    country: '',
    notes: ''
  });
  
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  
  if (cartItems.length === 0) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-light mb-4">{t('cart.empty.title')}</h1>
          <p className="text-gray-600 mb-8">{t('cart.empty.subtitle')}</p>
          <Link to="/catalog">
            <Button variant="outline">{t('cart.empty.action')}</Button>
          </Link>
        </div>
      </Layout>
    );
  }
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when typing
    if (errors[name as keyof FormData]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };
  
  const validate = () => {
    const newErrors: Partial<Record<keyof FormData, string>> = {};
    
    if (!formData.firstName) newErrors.firstName = 'First name is required';
    if (!formData.lastName) newErrors.lastName = 'Last name is required';
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!formData.phone) newErrors.phone = 'Phone number is required';
    if (!formData.address) newErrors.address = 'Address is required';
    if (!formData.city) newErrors.city = 'City is required';
    if (!formData.postalCode) newErrors.postalCode = 'Postal code is required';
    if (!formData.country) newErrors.country = 'Country is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);
    
    if (validate()) {
      setIsLoading(true);
      
      try {
        // Подготавливаем данные для заказа
        const orderData = {
          user_id: user?.id || null,
          status: 'new',
          first_name: formData.firstName,
          last_name: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          postal_code: formData.postalCode,
          country: formData.country,
          notes: formData.notes || null,
          total_amount: cartTotal
        };
        
        // Подготавливаем элементы заказа
        const orderItems = cartItems.map(item => ({
          product_id: item.product.id,
          quantity: item.quantity,
          price: Number(item.product.price)
        }));
        
        // Отправляем запрос на создание заказа
        const createdOrder = await createOrder.mutateAsync({ orderData, items: orderItems });
        
        // Очищаем корзину после успешного создания заказа
        clearCart();
        
        // Перенаправляем на страницу успешного оформления заказа с ID заказа
        navigate('/checkout/success', { state: { orderId: createdOrder.id } });
      } catch (error) {
        console.error('Ошибка при создании заказа:', error);
        setServerError('Произошла ошибка при оформлении заказа. Пожалуйста, попробуйте снова.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <Layout>
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-8">
          <Link to="/catalog" className="inline-flex items-center text-gray-600 hover:text-black mb-8">
            <ChevronLeft size={16} className="mr-1" />
            {t('checkout.continueShopping')}
          </Link>
          
          <h1 className="text-3xl font-light mb-12">{t('checkout.title')}</h1>
          
          {serverError && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6 flex items-center">
              <AlertTriangle size={18} className="mr-2" />
              {serverError}
            </div>
          )}
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-7"
            >
              <h2 className="text-xl font-light mb-6">{t('checkout.shippingInfo')}</h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label={t('checkout.form.firstName')}
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    error={errors.firstName}
                    fullWidth
                  />
                  <Input
                    label={t('checkout.form.lastName')}
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    error={errors.lastName}
                    fullWidth
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label={t('checkout.form.email')}
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    error={errors.email}
                    fullWidth
                  />
                  <Input
                    label={t('checkout.form.phone')}
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    error={errors.phone}
                    fullWidth
                  />
                </div>
                
                <Input
                  label={t('checkout.form.address')}
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  error={errors.address}
                  fullWidth
                />
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Input
                    label={t('checkout.form.city')}
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    error={errors.city}
                    fullWidth
                  />
                  <Input
                    label={t('checkout.form.postalCode')}
                    name="postalCode"
                    value={formData.postalCode}
                    onChange={handleChange}
                    error={errors.postalCode}
                    fullWidth
                  />
                  <Input
                    label={t('checkout.form.country')}
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    error={errors.country}
                    fullWidth
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-light text-gray-700 mb-1">
                    {t('checkout.form.notes')}
                  </label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    rows={4}
                    className="w-full border-b border-gray-300 py-2 px-4 font-light
                      focus:outline-none focus:border-black
                      transition-colors bg-transparent"
                  ></textarea>
                </div>
                
                <div className="pt-4 lg:hidden">
                  <h3 className="text-lg font-light mb-4">{t('checkout.orderSummary')}</h3>
                  
                  <div className="space-y-4 mb-6">
                    {cartItems.map(item => (
                      <div key={item.product.id} className="flex items-center justify-between">
                        <div className="flex items-center">
                          <img
                            src={item.product.images[0]}
                            alt={item.product.name}
                            className="w-16 h-16 object-cover mr-3"
                          />
                          <div>
                            <p className="font-light">{item.product.name}</p>
                            <p className="text-gray-500 text-sm">Qty: {item.quantity}</p>
                          </div>
                        </div>
                        <p className="font-light">${item.product.price * item.quantity}</p>
                      </div>
                    ))}
                  </div>
                  
                  <div className="border-t border-gray-100 pt-4 mb-6">
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-600">{t('cart.subtotal')}</span>
                      <span>${cartTotal}</span>
                    </div>
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-600">{t('cart.shipping')}</span>
                      <span>Free</span>
                    </div>
                    <div className="flex justify-between font-medium">
                      <span>{t('cart.total')}</span>
                      <span>${cartTotal}</span>
                    </div>
                  </div>
                </div>
                
                <Button
                  type="submit"
                  fullWidth
                  disabled={isLoading || createOrder.isPending}
                >
                  {isLoading || createOrder.isPending ? t('checkout.processing') : t('checkout.completeOrder')}
                </Button>
              </form>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="lg:col-span-5 hidden lg:block"
            >
              <div className="bg-gray-50 p-6">
                <h2 className="text-xl font-light mb-6">{t('checkout.orderSummary')}</h2>
                
                <div className="space-y-4 mb-6">
                  {cartItems.map(item => (
                    <div key={item.product.id} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <img
                          src={item.product.images[0]}
                          alt={item.product.name}
                          className="w-16 h-16 object-cover mr-3"
                        />
                        <div>
                          <p className="font-light">{item.product.name}</p>
                          <p className="text-gray-500 text-sm">Qty: {item.quantity}</p>
                        </div>
                      </div>
                      <p className="font-light">${item.product.price * item.quantity}</p>
                    </div>
                  ))}
                </div>
                
                <div className="border-t border-gray-100 pt-4">
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600">{t('cart.subtotal')}</span>
                    <span>${cartTotal}</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600">{t('cart.shipping')}</span>
                    <span>Free</span>
                  </div>
                  <div className="flex justify-between font-medium mt-4">
                    <span>{t('cart.total')}</span>
                    <span>${cartTotal}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default CheckoutPage;