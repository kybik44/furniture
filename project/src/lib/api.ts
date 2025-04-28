import { supabase } from './supabase';
import type { Database } from '../types/supabase';

// Типы для работы с API
export type Category = Database['public']['Tables']['categories']['Row'];
export type Product = Database['public']['Tables']['products']['Row'];
export type Order = Database['public']['Tables']['orders']['Row'];
export type OrderItem = Database['public']['Tables']['order_items']['Row'];
export type Review = Database['public']['Tables']['reviews']['Row'];
export type Subscriber = Database['public']['Tables']['subscribers']['Row'];

// API для категорий
export const categoryApi = {
  getAll: async (): Promise<Category[]> => {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name');
    
    if (error) throw error;
    return data || [];
  },
  
  getBySlug: async (slug: string): Promise<Category | null> => {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('slug', slug)
      .single();
    
    if (error) throw error;
    return data;
  },
  
  create: async (category: Omit<Category, 'id' | 'created_at' | 'updated_at'>): Promise<Category> => {
    const { data, error } = await supabase
      .from('categories')
      .insert(category)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },
  
  update: async (id: string, category: Partial<Omit<Category, 'id' | 'created_at'>>): Promise<Category> => {
    const { data, error } = await supabase
      .from('categories')
      .update({ ...category, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },
  
  delete: async (id: string): Promise<void> => {
    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }
};

// API для продуктов
export const productApi = {
  getAll: async (): Promise<Product[]> => {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('name');
    
    if (error) throw error;
    return data || [];
  },
  
  getById: async (id: string): Promise<Product | null> => {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  },
  
  getByCategorySlug: async (slug: string): Promise<Product[]> => {
    const { data: category } = await supabase
      .from('categories')
      .select('id')
      .eq('slug', slug)
      .single();
    
    if (!category) return [];
    
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('category_id', category.id)
      .order('name');
    
    if (error) throw error;
    return data || [];
  },
  
  getBestsellers: async (): Promise<Product[]> => {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('is_bestseller', true)
      .order('name');
    
    if (error) throw error;
    return data || [];
  },
  
  create: async (product: Omit<Product, 'id' | 'created_at' | 'updated_at'>): Promise<Product> => {
    const { data, error } = await supabase
      .from('products')
      .insert(product)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },
  
  update: async (id: string, product: Partial<Omit<Product, 'id' | 'created_at'>>): Promise<Product> => {
    const { data, error } = await supabase
      .from('products')
      .update({ ...product, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },
  
  delete: async (id: string): Promise<void> => {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }
};

// API для заказов
export const orderApi = {
  create: async (order: Omit<Order, 'id' | 'created_at' | 'updated_at'>): Promise<Order> => {
    const { data, error } = await supabase
      .from('orders')
      .insert(order)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },
  
  addOrderItems: async (items: Omit<OrderItem, 'id' | 'created_at'>[]): Promise<OrderItem[]> => {
    const { data, error } = await supabase
      .from('order_items')
      .insert(items)
      .select();
    
    if (error) throw error;
    return data || [];
  },
  
  getUserOrders: async (userId: string): Promise<Order[]> => {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },
  
  update: async (id: string, orderData: Partial<Omit<Order, 'id' | 'created_at'>>): Promise<Order> => {
    const { data, error } = await supabase
      .from('orders')
      .update({ ...orderData, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },
  
  delete: async (id: string): Promise<void> => {
    const { error } = await supabase
      .from('orders')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }
};

// API для отзывов
export const reviewApi = {
  getProductReviews: async (productId: string): Promise<Review[]> => {
    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .eq('product_id', productId)
      .eq('is_approved', true)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },
  
  getAll: async (): Promise<Review[]> => {
    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },
  
  getById: async (id: string): Promise<Review | null> => {
    const { data, error } = await supabase
      .from('reviews')
      .select(`
        *,
        product:products(name)
      `)
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  },
  
  addReview: async (review: Omit<Review, 'id' | 'created_at' | 'is_approved'>): Promise<Review> => {
    const { data, error } = await supabase
      .from('reviews')
      .insert({ ...review, is_approved: false })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },
  
  update: async (id: string, review: Partial<Omit<Review, 'id' | 'created_at'>>): Promise<Review> => {
    const { data, error } = await supabase
      .from('reviews')
      .update(review)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },
  
  approveReview: async (id: string): Promise<Review> => {
    const { data, error } = await supabase
      .from('reviews')
      .update({ is_approved: true })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },
  
  rejectReview: async (id: string): Promise<Review> => {
    const { data, error } = await supabase
      .from('reviews')
      .update({ is_approved: false })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },
  
  delete: async (id: string): Promise<void> => {
    const { error } = await supabase
      .from('reviews')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }
};

// API для подписчиков
export const subscriberApi = {
  subscribe: async (name: string, email: string): Promise<Subscriber> => {
    const { data, error } = await supabase
      .from('subscribers')
      .insert({ name, email })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },
  
  getAll: async (): Promise<Subscriber[]> => {
    const { data, error } = await supabase
      .from('subscribers')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },
  
  delete: async (id: string): Promise<void> => {
    const { error } = await supabase
      .from('subscribers')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }
};

// API для работы с файлами
export const storageApi = {
  uploadImage: async (file: File, folder: 'products' | 'categories' = 'products'): Promise<string> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${crypto.randomUUID()}.${fileExt}`;
    const filePath = `${folder}/${fileName}`;
    
    const { error } = await supabase.storage
      .from('images')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });
    
    if (error) throw error;
    
    const { data } = supabase.storage
      .from('images')
      .getPublicUrl(filePath);
      
    return data.publicUrl;
  },
  
  deleteImage: async (url: string): Promise<void> => {
    try {
      // Извлекаем путь к файлу из URL
      const urlObj = new URL(url);
      const pathParts = urlObj.pathname.split('/');
      const bucketName = pathParts[1]; // обычно 'images'
      const filePath = pathParts.slice(2).join('/');
      
      if (bucketName !== 'images') {
        throw new Error('Невозможно удалить изображение: неверный формат URL');
      }
      
      const { error } = await supabase.storage
        .from('images')
        .remove([filePath]);
      
      if (error) throw error;
    } catch (error) {
      console.error('Ошибка при удалении изображения:', error);
      throw error;
    }
  }
}; 