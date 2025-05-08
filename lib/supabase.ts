import { createClient } from "@supabase/supabase-js"

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          business_name?: string
          whatsapp_number?: string
          bio?: string
          created_at: string
          updated_at: string
          onboarding: boolean
        }
        Insert: {
          id: string
          email: string
          business_name?: string
          whatsapp_number?: string
          bio?: string
          created_at?: string
          updated_at?: string
          onboarding?: boolean
        }
        Update: {
          id?: string
          email?: string
          business_name?: string
          whatsapp_number?: string
          bio?: string
          created_at?: string
          updated_at?: string
          onboarding?: boolean
        }
      }
    }
  }
}

// Create a single supabase client for interacting with your database
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)
