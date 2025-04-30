import { supabase } from './supabase';
import type { Database } from '../types/supabase';

// Типы для работы с API
export type Category = Database['public']['Tables']['categories']['Row'];
export type Product = Database['public']['Tables']['products']['Row'];
export type Order = Database['public']['Tables']['orders']['Row'];
export type OrderItem = Database['public']['Tables']['order_items']['Row'];
export type Review = Database['public']['Tables']['reviews']['Row'];
export type Subscriber = Database['public']['Tables']['subscribers']['Row'];
export type JobListing = Database['public']['Tables']['job_listings']['Row'];
export type JobApplication = Database['public']['Tables']['job_applications']['Row'];

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

// Интерфейс для фильтров продуктов
interface ProductFilters {
  categorySlug?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  materials?: string[];
  sortBy?: 'price-low' | 'price-high' | 'newest' | 'popularity';
  locale?: string;
}

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
  
  // Получение отфильтрованных продуктов через бэкэнд
  getFilteredProducts: async (filters: ProductFilters): Promise<Product[]> => {
    let query = supabase.from('products').select(`
      *,
      categories (
        id,
        name,
        name_ru,
        slug
      )
    `);
    
    // Фильтрация по категории
    if (filters.categorySlug) {
      const { data: category } = await supabase
        .from('categories')
        .select('id')
        .eq('slug', filters.categorySlug)
        .single();
      
      if (category) {
        query = query.eq('category_id', category.id);
      }
    }
    
    // Фильтрация по цене
    if (filters.minPrice !== undefined) {
      query = query.gte('price', filters.minPrice);
    }
    
    if (filters.maxPrice !== undefined) {
      query = query.lte('price', filters.maxPrice);
    }
    
    // Поиск по текстовым полям
    if (filters.search) {
      const searchQuery = filters.search.toLowerCase().trim();
      const locale = filters.locale || 'en';
      
      // Поиск по полям в зависимости от локали
      let nameField = 'name';
      let descField = 'description';
      let shortDescField = 'short_description';
      
      if (locale === 'ru') {
        nameField = 'name_ru';
        descField = 'description_ru';
        shortDescField = 'short_description_ru';
      }
      
      query = query.or(`${nameField}.ilike.%${searchQuery}%,${descField}.ilike.%${searchQuery}%,${shortDescField}.ilike.%${searchQuery}%`);
    }
    
    // Сортировка 
    switch (filters.sortBy) {
      case 'price-low':
        query = query.order('price', { ascending: true });
        break;
      case 'price-high':
        query = query.order('price', { ascending: false });
        break;
      case 'newest':
        query = query.order('created_at', { ascending: false });
        break;
      case 'popularity':
      default:
        // Сначала бестселлеры, потом по имени
        query = query.order('is_bestseller', { ascending: false }).order('name');
        break;
    }
    
    const { data, error } = await query;
    
    if (error) throw error;
    
    // Результаты
    let results = data || [];
    
    // Фильтрация по материалам (постобработка, т.к. это массив)
    if (filters.materials && filters.materials.length > 0) {
      const locale = filters.locale || 'en';
      
      results = results.filter(product => {
        const productMaterials = locale === 'ru' ? product.materials_ru : product.materials;
        return filters.materials?.some(material => 
          productMaterials.some((productMaterial: string) => 
            productMaterial.toLowerCase().includes(material.toLowerCase())
          )
        );
      });
    }
    
    // Дополнительная фильтрация по поисковому запросу для материалов
    if (filters.search) {
      const searchQuery = filters.search.toLowerCase().trim();
      const locale = filters.locale || 'en';
      
      const materialFilteredResults = results.filter(product => {
        const materials = locale === 'ru' ? product.materials_ru : product.materials;
        return materials.some((material: string) => 
          material.toLowerCase().includes(searchQuery)
        );
      });
      
      // Объединить результаты без дубликатов
      results = [...new Map(
        [...results, ...materialFilteredResults].map(item => [item.id, item])
      ).values()];
    }
    
    return results;
  },
  
  search: async (query: string, locale: string = 'en'): Promise<Product[]> => {
    if (!query.trim()) return [];
    
    const searchQuery = query.toLowerCase().trim();
    
    // Поиск по полям в зависимости от локали
    let nameField = 'name';
    let descField = 'description';
    let shortDescField = 'short_description';
    
    if (locale === 'ru') {
      nameField = 'name_ru';
      descField = 'description_ru';
      shortDescField = 'short_description_ru';
    }
    
    // Поиск в Supabase с оператором ilike (case-insensitive LIKE)
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        categories(name, name_ru)
      `)
      .or(`${nameField}.ilike.%${searchQuery}%,${descField}.ilike.%${searchQuery}%,${shortDescField}.ilike.%${searchQuery}%`)
      .order('name');
    
    if (error) throw error;
    
    // Дополнительная фильтрация для поиска по массиву материалов
    const results = data || [];
    
    // Поиск по материалам (которые хранятся в массивах)
    const materialFilteredResults = results.filter(product => {
      const materials = locale === 'ru' ? product.materials_ru : product.materials;
      return materials.some((material: string) => 
        material.toLowerCase().includes(searchQuery)
      );
    });
    
    // Объединить результаты без дубликатов
    const uniqueResults = [...new Map(
      [...results, ...materialFilteredResults].map(item => [item.id, item])
    ).values()];
    
    return uniqueResults;
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
    const { data, error } = await supabase.rpc('create_order', { order_data: order });
    
    if (error) throw error;
    return data || order as Order;
  },
  
  addOrderItems: async (items: Omit<OrderItem, 'id' | 'created_at'>[]): Promise<OrderItem[]> => {
    const { data, error } = await supabase.rpc('add_order_items', { items_data: items });
    
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
  subscribe: async (name: string, email: string, discountCode: string): Promise<Subscriber> => {
    const { data, error } = await supabase
      .from('subscribers')
      .insert({ name, email, discount_code: discountCode })
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
  },
  
  findByEmail: async (email: string): Promise<Subscriber | null> => {
    const { data, error } = await supabase
      .from('subscribers')
      .select('*')
      .eq('email', email)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') { // Ошибка "Результат не содержит строк"
        return null;
      }
      throw error;
    }
    
    return data;
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

// API для вакансий
export const jobListingApi = {
  getAll: async (): Promise<JobListing[]> => {
    const { data, error } = await supabase
      .from('job_listings')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },
  
  getActive: async (): Promise<JobListing[]> => {
    const { data, error } = await supabase
      .from('job_listings')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },

  getById: async (id: string): Promise<JobListing | null> => {
    const { data, error } = await supabase
      .from('job_listings')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  },
  
  create: async (jobListing: Omit<JobListing, 'id' | 'created_at' | 'updated_at'>): Promise<JobListing> => {
    const { data, error } = await supabase
      .from('job_listings')
      .insert(jobListing)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },
  
  update: async (id: string, jobListing: Partial<Omit<JobListing, 'id' | 'created_at'>>): Promise<JobListing> => {
    const { data, error } = await supabase
      .from('job_listings')
      .update({ ...jobListing, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },
  
  delete: async (id: string): Promise<void> => {
    const { error } = await supabase
      .from('job_listings')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }
};

// API для откликов на вакансии
export const jobApplicationApi = {
  getAll: async (): Promise<JobApplication[]> => {
    const { data, error } = await supabase
      .from('job_applications')
      .select(`
        *,
        job_listing:job_listings(title, title_ru)
      `)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },
  
  getByJobListingId: async (jobListingId: string): Promise<JobApplication[]> => {
    const { data, error } = await supabase
      .from('job_applications')
      .select(`
        *,
        job_listing:job_listings(title, title_ru)
      `)
      .eq('job_listing_id', jobListingId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },

  getById: async (id: string): Promise<JobApplication | null> => {
    const { data, error } = await supabase
      .from('job_applications')
      .select(`
        *,
        job_listing:job_listings(title, title_ru)
      `)
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  },
  
  create: async (application: Omit<JobApplication, 'id' | 'created_at' | 'status'>): Promise<JobApplication> => {
    const { data, error } = await supabase
      .from('job_applications')
      .insert({ ...application, status: 'new' })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },
  
  updateStatus: async (id: string, status: 'new' | 'viewed' | 'contacted' | 'rejected'): Promise<JobApplication> => {
    const { data, error } = await supabase
      .from('job_applications')
      .update({ status })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },
  
  delete: async (id: string): Promise<void> => {
    const { error } = await supabase
      .from('job_applications')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }
}; 