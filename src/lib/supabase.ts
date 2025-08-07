import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'http://localhost:54321'
const supabaseKey = process.env.SUPABASE_ANON_KEY || 'dummy-key-for-build'

// Only throw errors at runtime, not during build
if (typeof window !== 'undefined' && (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_ANON_KEY)) {
  console.warn('Missing Supabase environment variables. Please check your .env file.')
}

export const supabase = createClient(supabaseUrl, supabaseKey)

// Database Types for better TypeScript support
export interface Database {
  public: {
    Tables: {
      customers: {
        Row: {
          id: string
          name: string
          phone: string
          email: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          phone: string
          email?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          phone?: string
          email?: string | null
          created_at?: string
        }
      }
      orders: {
        Row: {
          id: string
          customer_id: string
          total: number
          status: 'pending' | 'preparing' | 'ready' | 'completed'
          created_at: string
          estimated_ready: string | null
          completed_at: string | null
        }
        Insert: {
          id?: string
          customer_id: string
          total: number
          status?: 'pending' | 'preparing' | 'ready' | 'completed'
          created_at?: string
          estimated_ready?: string | null
          completed_at?: string | null
        }
        Update: {
          id?: string
          customer_id?: string
          total?: number
          status?: 'pending' | 'preparing' | 'ready' | 'completed'
          created_at?: string
          estimated_ready?: string | null
          completed_at?: string | null
        }
      }
      order_items: {
        Row: {
          id: string
          order_id: string
          item_name: string
          price: number
          quantity: number
          created_at: string
        }
        Insert: {
          id?: string
          order_id: string
          item_name: string
          price: number
          quantity: number
          created_at?: string
        }
        Update: {
          id?: string
          order_id?: string
          item_name?: string
          price?: number
          quantity?: number
          created_at?: string
        }
      }
      business_hours: {
        Row: {
          day_of_week: number
          open_time: string | null
          close_time: string | null
          is_closed: boolean
          is_holiday: boolean
          holiday_name: string | null
        }
        Insert: {
          day_of_week: number
          open_time?: string | null
          close_time?: string | null
          is_closed?: boolean
          is_holiday?: boolean
          holiday_name?: string | null
        }
        Update: {
          day_of_week?: number
          open_time?: string | null
          close_time?: string | null
          is_closed?: boolean
          is_holiday?: boolean
          holiday_name?: string | null
        }
      }
      restaurant_status: {
        Row: {
          id: string
          is_temporarily_closed: boolean
          closure_reason: string | null
          last_updated: string
        }
        Insert: {
          id?: string
          is_temporarily_closed?: boolean
          closure_reason?: string | null
          last_updated?: string
        }
        Update: {
          id?: string
          is_temporarily_closed?: boolean
          closure_reason?: string | null
          last_updated?: string
        }
      }
      menu_items: {
        Row: {
          id: string
          is_available: boolean
          is_out_of_stock: boolean
          last_updated: string
        }
        Insert: {
          id: string
          is_available?: boolean
          is_out_of_stock?: boolean
          last_updated?: string
        }
        Update: {
          id?: string
          is_available?: boolean
          is_out_of_stock?: boolean
          last_updated?: string
        }
      }
    }
  }
}

export type SupabaseClient = typeof supabase