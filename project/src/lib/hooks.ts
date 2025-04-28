import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { categoryApi, productApi, reviewApi, subscriberApi, orderApi, storageApi } from './api';
import type { Category, Product, Review, Order, Subscriber, OrderItem } from './api';

// Хуки для категорий
export const useCategories = () => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: () => categoryApi.getAll(),
  });
};

export const useCategory = (slug: string) => {
  return useQuery({
    queryKey: ['category', slug],
    queryFn: () => categoryApi.getBySlug(slug),
    enabled: !!slug,
  });
};

export const useCreateCategory = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (newCategory: Omit<Category, 'id' | 'created_at' | 'updated_at'>) => 
      categoryApi.create(newCategory),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'categories'] });
    },
  });
};

export const useUpdateCategory = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string, data: Partial<Omit<Category, 'id' | 'created_at'>> }) => 
      categoryApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'categories'] });
    },
  });
};

export const useDeleteCategory = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => categoryApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'categories'] });
    },
  });
};

// Хуки для продуктов
export const useProducts = () => {
  return useQuery({
    queryKey: ['products'],
    queryFn: () => productApi.getAll(),
  });
};

export const useProduct = (id: string) => {
  return useQuery({
    queryKey: ['product', id],
    queryFn: () => productApi.getById(id),
    enabled: !!id,
  });
};

export const useCategoryProducts = (slug: string) => {
  return useQuery({
    queryKey: ['products', 'category', slug],
    queryFn: () => productApi.getByCategorySlug(slug),
    enabled: !!slug,
  });
};

export const useBestsellers = () => {
  return useQuery({
    queryKey: ['products', 'bestsellers'],
    queryFn: () => productApi.getBestsellers(),
  });
};

export const useCreateProduct = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (newProduct: Omit<Product, 'id' | 'created_at' | 'updated_at'>) => 
      productApi.create(newProduct),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'products'] });
    },
  });
};

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string, data: Partial<Omit<Product, 'id' | 'created_at'>> }) => 
      productApi.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['product', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'products'] });
    },
  });
};

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => productApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'products'] });
    },
  });
};

// Хуки для работы с файлами
export const useUploadImage = () => {
  return useMutation({
    mutationFn: ({ file, folder }: { file: File, folder?: 'products' | 'categories' }) => 
      storageApi.uploadImage(file, folder),
  });
};

export const useDeleteImage = () => {
  return useMutation({
    mutationFn: (url: string) => storageApi.deleteImage(url),
  });
};

// Хуки для отзывов
export const useProductReviews = (productId: string) => {
  return useQuery({
    queryKey: ['reviews', productId],
    queryFn: () => reviewApi.getProductReviews(productId),
    enabled: !!productId,
  });
}; 

export const useReviews = () => {
  return useQuery({
    queryKey: ['admin', 'reviews'],
    queryFn: () => reviewApi.getAll(),
  });
};

export const useReview = (id: string) => {
  return useQuery({
    queryKey: ['review', id],
    queryFn: () => reviewApi.getById(id),
    enabled: !!id,
  });
};

export const useCreateReview = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (newReview: Omit<Review, 'id' | 'created_at' | 'is_approved'>) => 
      reviewApi.addReview(newReview),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'reviews'] });
      queryClient.invalidateQueries({ queryKey: ['homeReviews'] });
    },
  });
};

export const useUpdateReview = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string, data: Partial<Omit<Review, 'id' | 'created_at'>> }) => 
      reviewApi.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'reviews'] });
      queryClient.invalidateQueries({ queryKey: ['review', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['homeReviews'] });
    },
  });
};

export const useApproveReview = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => reviewApi.approveReview(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'reviews'] });
    },
  });
};

export const useRejectReview = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => reviewApi.rejectReview(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'reviews'] });
    },
  });
};

export const useDeleteReview = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => reviewApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'reviews'] });
    },
  });
};

// Хуки для заказов
export const useCreateOrder = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ 
      orderData, 
      items 
    }: { 
      orderData: Omit<Order, 'id' | 'created_at' | 'updated_at'>;
      items: Omit<OrderItem, 'id' | 'created_at' | 'order_id'>[];
    }) => {
      // Создаем новый заказ
      const createdOrder = await orderApi.create(orderData);
      
      // Добавляем элементы заказа
      const orderItems = items.map(item => ({
        ...item,
        order_id: createdOrder.id
      }));
      
      await orderApi.addOrderItems(orderItems);
      
      return createdOrder;
    },
    onSuccess: () => {
      // После успешного создания заказа, инвалидируем связанные запросы
      queryClient.invalidateQueries({ queryKey: ['admin', 'orders'] });
    },
  });
};

export const useUpdateOrder = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string, data: Partial<Omit<Order, 'id' | 'created_at'>> }) => 
      orderApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'orders'] });
    },
  });
};

export const useDeleteOrder = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => orderApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'orders'] });
    },
  });
};

// Хуки для подписчиков
export const useSubscribers = () => {
  return useQuery({
    queryKey: ['admin', 'subscribers'],
    queryFn: () => subscriberApi.getAll(),
  });
};

export const useDeleteSubscriber = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => subscriberApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'subscribers'] });
    },
  });
}; 