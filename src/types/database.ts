// Database types for Supabase schema
// These types match the database schema created in database/schema.sql

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          email?: string
          updated_at?: string
        }
      }
      user_profiles: {
        Row: {
          id: string
          user_id: string
          first_name: string
          last_name: string
          phone?: string
          bio?: string
          profile_image_url: string
          location?: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          first_name: string
          last_name: string
          phone?: string
          bio?: string
          profile_image_url?: string
          location?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          first_name?: string
          last_name?: string
          phone?: string
          bio?: string
          profile_image_url?: string
          location?: string
          updated_at?: string
        }
      }
      business_links: {
        Row: {
          id: string
          user_id: string
          platform: string
          url: string
          display_name?: string
          description?: string
          icon_url?: string
          is_active: boolean
          sort_order: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          platform: string
          url: string
          display_name?: string
          description?: string
          icon_url?: string
          is_active?: boolean
          sort_order?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          platform?: string
          url?: string
          display_name?: string
          description?: string
          icon_url?: string
          is_active?: boolean
          sort_order?: number
          updated_at?: string
        }
      }
      social_links: {
        Row: {
          id: string
          user_id: string
          platform: string
          url: string
          icon_url?: string
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          platform: string
          url: string
          icon_url?: string
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          platform?: string
          url?: string
          icon_url?: string
          is_active?: boolean
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      handle_new_user: () => void
      update_updated_at_column: () => void
    }
    Enums: {
      [_ in never]: never
    }
  }
}

// Type aliases for commonly used types
export type User = Database['public']['Tables']['users']['Row']
export type UserProfile = Database['public']['Tables']['user_profiles']['Row']
export type BusinessLink = Database['public']['Tables']['business_links']['Row']
export type SocialLink = Database['public']['Tables']['social_links']['Row']

export type UserProfileInsert = Database['public']['Tables']['user_profiles']['Insert']
export type UserProfileUpdate = Database['public']['Tables']['user_profiles']['Update']
export type BusinessLinkInsert = Database['public']['Tables']['business_links']['Insert']
export type BusinessLinkUpdate = Database['public']['Tables']['business_links']['Update']

// Extended types for application use
export interface UserWithProfile extends User {
  profile: UserProfile | null
  business_links: BusinessLink[]
  social_links: SocialLink[]
}

export interface Platform {
  id: string
  name: string
  icon: string
  color?: string
}

export const BUSINESS_PLATFORMS: Platform[] = [
  { id: 'meta_business', name: 'Meta Business', icon: '/icons/facebook.png', color: '#1877F2' },
  { id: 'whatsapp', name: 'WhatsApp Group', icon: '/icons/whatsappi.png', color: '#25D366' }
]

export const SOCIAL_PLATFORMS: Platform[] = [
  { id: 'facebook', name: 'Facebook', icon: '/icons/facebook.png', color: '#1877F2' },
  { id: 'twitter', name: 'Twitter/X', icon: '/icons/twitter.png', color: '#000000' },
  { id: 'instagram', name: 'Instagram', icon: '/icons/instagram.png', color: '#E4405F' }
]
