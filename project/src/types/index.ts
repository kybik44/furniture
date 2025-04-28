export interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  description: string;
  shortDescription: string;
  isBestseller: boolean;
  images: string[];
  materials?: string[];
  dimensions?: {
    width: number;
    height: number;
    depth: number;
  };
}

export interface Category {
  id: number;
  name: string;
  image: string;
  slug: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Review {
  id: number;
  name: string;
  avatar: string;
  text: string;
  rating: number;
}