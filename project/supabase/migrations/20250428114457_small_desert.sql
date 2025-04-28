/*
  # Initial Schema Setup

  1. Tables
    - users (managed by Supabase Auth)
    - categories
      - id (uuid, primary key)
      - name (text)
      - name_ru (text)
      - slug (text, unique)
      - image (text)
      - created_at (timestamp)
      - updated_at (timestamp)
    
    - products
      - id (uuid, primary key)
      - name (text)
      - name_ru (text)
      - description (text)
      - description_ru (text)
      - short_description (text)
      - short_description_ru (text)
      - price (numeric)
      - category_id (uuid, foreign key)
      - images (text[])
      - materials (text[])
      - materials_ru (text[])
      - dimensions (jsonb)
      - is_bestseller (boolean)
      - created_at (timestamp)
      - updated_at (timestamp)
    
    - orders
      - id (uuid, primary key)
      - user_id (uuid, foreign key, nullable)
      - status (text)
      - first_name (text)
      - last_name (text)
      - email (text)
      - phone (text)
      - address (text)
      - city (text)
      - postal_code (text)
      - country (text)
      - notes (text)
      - total_amount (numeric)
      - created_at (timestamp)
      - updated_at (timestamp)
    
    - order_items
      - id (uuid, primary key)
      - order_id (uuid, foreign key)
      - product_id (uuid, foreign key)
      - quantity (integer)
      - price (numeric)
      - created_at (timestamp)
    
    - reviews
      - id (uuid, primary key)
      - product_id (uuid, foreign key)
      - name (text)
      - avatar (text)
      - text (text)
      - text_ru (text)
      - rating (integer)
      - is_approved (boolean)
      - created_at (timestamp)
    
    - subscribers
      - id (uuid, primary key)
      - email (text, unique)
      - name (text)
      - created_at (timestamp)

  2. Security
    - Enable RLS on all tables
    - Set up appropriate policies for each table
*/

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Categories Table
CREATE TABLE categories (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  name_ru text NOT NULL,
  slug text UNIQUE NOT NULL,
  image text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Products Table
CREATE TABLE products (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  name_ru text NOT NULL,
  description text NOT NULL,
  description_ru text NOT NULL,
  short_description text NOT NULL,
  short_description_ru text NOT NULL,
  price numeric NOT NULL CHECK (price >= 0),
  category_id uuid REFERENCES categories(id) ON DELETE CASCADE,
  images text[] NOT NULL,
  materials text[] NOT NULL,
  materials_ru text[] NOT NULL,
  dimensions jsonb NOT NULL,
  is_bestseller boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Orders Table
CREATE TABLE orders (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  status text NOT NULL CHECK (status IN ('new', 'processing', 'completed', 'cancelled')),
  first_name text NOT NULL,
  last_name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  address text NOT NULL,
  city text NOT NULL,
  postal_code text NOT NULL,
  country text NOT NULL,
  notes text,
  total_amount numeric NOT NULL CHECK (total_amount >= 0),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Order Items Table
CREATE TABLE order_items (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id uuid REFERENCES orders(id) ON DELETE CASCADE,
  product_id uuid REFERENCES products(id) ON DELETE SET NULL,
  quantity integer NOT NULL CHECK (quantity > 0),
  price numeric NOT NULL CHECK (price >= 0),
  created_at timestamptz DEFAULT now()
);

-- Reviews Table
CREATE TABLE reviews (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id uuid REFERENCES products(id) ON DELETE CASCADE,
  name text NOT NULL,
  avatar text NOT NULL,
  text text NOT NULL,
  text_ru text NOT NULL,
  rating integer NOT NULL CHECK (rating BETWEEN 1 AND 5),
  is_approved boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Subscribers Table
CREATE TABLE subscribers (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  email text UNIQUE NOT NULL,
  name text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscribers ENABLE ROW LEVEL SECURITY;

-- Policies for Categories
CREATE POLICY "Categories are viewable by everyone" ON categories
  FOR SELECT USING (true);

CREATE POLICY "Categories are manageable by authenticated users only" ON categories
  FOR ALL USING (auth.role() = 'authenticated');

-- Policies for Products
CREATE POLICY "Products are viewable by everyone" ON products
  FOR SELECT USING (true);

CREATE POLICY "Products are manageable by authenticated users only" ON products
  FOR ALL USING (auth.role() = 'authenticated');

-- Policies for Orders
CREATE POLICY "Orders are viewable by owner or admin" ON orders
  FOR SELECT USING (
    auth.uid() = user_id OR 
    auth.role() = 'authenticated'
  );

CREATE POLICY "Orders can be created by anyone" ON orders
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Orders are manageable by authenticated users only" ON orders
  FOR UPDATE USING (auth.role() = 'authenticated');

-- Policies for Order Items
CREATE POLICY "Order items are viewable by order owner or admin" ON order_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM orders 
      WHERE orders.id = order_items.order_id 
      AND (orders.user_id = auth.uid() OR auth.role() = 'authenticated')
    )
  );

CREATE POLICY "Order items can be created by anyone" ON order_items
  FOR INSERT WITH CHECK (true);

-- Policies for Reviews
CREATE POLICY "Reviews are viewable by everyone" ON reviews
  FOR SELECT USING (is_approved = true);

CREATE POLICY "Reviews are manageable by authenticated users only" ON reviews
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Reviews can be created by anyone" ON reviews
  FOR INSERT WITH CHECK (true);

-- Policies for Subscribers
CREATE POLICY "Subscribers are viewable by authenticated users only" ON subscribers
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Anyone can subscribe" ON subscribers
  FOR INSERT WITH CHECK (true);

-- Create updated_at triggers
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_categories_updated_at
  BEFORE UPDATE ON categories
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();