export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      categories: {
        Row: {
          id: string
          name: string
          name_ru: string
          slug: string
          image: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          name_ru: string
          slug: string
          image: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          name_ru?: string
          slug?: string
          image?: string
          created_at?: string
          updated_at?: string
        }
      }
      products: {
        Row: {
          id: string
          name: string
          name_ru: string
          description: string
          description_ru: string
          short_description: string
          short_description_ru: string
          price: number
          category_id: string
          images: string[]
          materials: string[]
          materials_ru: string[]
          dimensions: Json
          is_bestseller: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          name_ru: string
          description: string
          description_ru: string
          short_description: string
          short_description_ru: string
          price: number
          category_id: string
          images: string[]
          materials: string[]
          materials_ru: string[]
          dimensions: Json
          is_bestseller?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          name_ru?: string
          description?: string
          description_ru?: string
          short_description?: string
          short_description_ru?: string
          price?: number
          category_id?: string
          images?: string[]
          materials?: string[]
          materials_ru?: string[]
          dimensions?: Json
          is_bestseller?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      orders: {
        Row: {
          id: string
          user_id: string | null
          status: string
          first_name: string
          last_name: string
          email: string
          phone: string
          address: string
          city: string
          postal_code: string
          country: string
          notes: string | null
          total_amount: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          status: string
          first_name: string
          last_name: string
          email: string
          phone: string
          address: string
          city: string
          postal_code: string
          country: string
          notes?: string | null
          total_amount: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          status?: string
          first_name?: string
          last_name?: string
          email?: string
          phone?: string
          address?: string
          city?: string
          postal_code?: string
          country?: string
          notes?: string | null
          total_amount?: number
          created_at?: string
          updated_at?: string
        }
      }
      order_items: {
        Row: {
          id: string
          order_id: string
          product_id: string | null
          quantity: number
          price: number
          created_at: string
        }
        Insert: {
          id?: string
          order_id: string
          product_id?: string | null
          quantity: number
          price: number
          created_at?: string
        }
        Update: {
          id?: string
          order_id?: string
          product_id?: string | null
          quantity?: number
          price?: number
          created_at?: string
        }
      }
      reviews: {
        Row: {
          id: string
          product_id: string
          name: string
          avatar: string
          text: string
          text_ru: string
          rating: number
          is_approved: boolean
          created_at: string
        }
        Insert: {
          id?: string
          product_id: string
          name: string
          avatar: string
          text: string
          text_ru: string
          rating: number
          is_approved?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          product_id?: string
          name?: string
          avatar?: string
          text?: string
          text_ru?: string
          rating?: number
          is_approved?: boolean
          created_at?: string
        }
      }
      subscribers: {
        Row: {
          id: string
          email: string
          name: string
          discount_code: string
          created_at: string
        }
        Insert: {
          id?: string
          email: string
          name: string
          discount_code: string
          created_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string
          discount_code?: string
          created_at?: string
        }
      }
      job_listings: {
        Row: {
          id: string
          title: string
          title_ru: string
          type: string
          type_ru: string
          description: string
          description_ru: string
          location: string
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          title_ru: string
          type: string
          type_ru: string
          description: string
          description_ru: string
          location: string
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          title_ru?: string
          type?: string
          type_ru?: string
          description?: string
          description_ru?: string
          location?: string
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      job_applications: {
        Row: {
          id: string
          job_listing_id: string
          name: string
          email: string
          phone: string
          resume_url: string
          cover_letter: string | null
          status: string
          created_at: string
        }
        Insert: {
          id?: string
          job_listing_id: string
          name: string
          email: string
          phone: string
          resume_url: string
          cover_letter?: string | null
          status?: string
          created_at?: string
        }
        Update: {
          id?: string
          job_listing_id?: string
          name?: string
          email?: string
          phone?: string
          resume_url?: string
          cover_letter?: string | null
          status?: string
          created_at?: string
        }
      }
    }
  }
} 