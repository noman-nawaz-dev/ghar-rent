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
      users: {
        Row: {
          id: string
          name: string
          email: string
          phone: string | null
          role: 'seller' | 'buyer' | 'admin'
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          email: string
          phone?: string | null
          role?: 'seller' | 'buyer' | 'admin'
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string
          phone?: string | null
          role?: 'seller' | 'buyer' | 'admin'
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "users_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      properties: {
        Row: {
          id: string
          title: string
          description: string
          price: number
          area: number
          area_unit: 'Marla' | 'Kanal'
          bedrooms: number
          floors: number
          kitchens: number
          has_lawn: boolean
          additional_info: string | null
          address: string
          city: string
          images: string[]
          seller_id: string
          seller_phone: string
          seller_name: string
          listed_date: string
          status: 'Available' | 'Pending' | 'Rented'
          property_type: string
          coordinates: { latitude: number; longitude: number } | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description: string
          price: number
          area: number
          area_unit: 'Marla' | 'Kanal'
          bedrooms: number
          floors: number
          kitchens: number
          has_lawn: boolean
          additional_info?: string | null
          address: string
          city: string
          images: string[]
          seller_id: string
          seller_phone: string
          seller_name: string
          listed_date?: string
          status?: 'Available' | 'Pending' | 'Rented'
          property_type: string
          coordinates?: { latitude: number; longitude: number } | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string
          price?: number
          area?: number
          area_unit?: 'Marla' | 'Kanal'
          bedrooms?: number
          floors?: number
          kitchens?: number
          has_lawn?: boolean
          additional_info?: string | null
          address?: string
          city?: string
          images?: string[]
          seller_id?: string
          seller_phone?: string
          seller_name?: string
          listed_date?: string
          status?: 'Available' | 'Pending' | 'Rented'
          property_type?: string
          coordinates?: { latitude: number; longitude: number } | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "properties_seller_id_fkey"
            columns: ["seller_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      rental_requests: {
        Row: {
          id: string
          property_id: string
          buyer_id: string
          proposed_price: number
          duration: number
          message: string | null
          status: 'pending' | 'approved' | 'rejected'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          property_id: string
          buyer_id: string
          proposed_price: number
          duration: number
          message?: string | null
          status?: 'pending' | 'approved' | 'rejected'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          property_id?: string
          buyer_id?: string
          proposed_price?: number
          duration?: number
          message?: string | null
          status?: 'pending' | 'approved' | 'rejected'
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "rental_requests_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "rental_requests_buyer_id_fkey"
            columns: ["buyer_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      activities: {
        Row: {
          id: string
          user_id: string
          activity_type: 'property_listed' | 'property_updated' | 'property_deleted' | 'rental_request_created' | 'rental_request_approved' | 'rental_request_rejected' | 'rental_request_cancelled' | 'profile_updated'
          title: string
          description: string
          metadata: Json
          related_entity_id: string | null
          related_entity_type: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          activity_type: 'property_listed' | 'property_updated' | 'property_deleted' | 'rental_request_created' | 'rental_request_approved' | 'rental_request_rejected' | 'rental_request_cancelled' | 'profile_updated'
          title: string
          description: string
          metadata?: Json
          related_entity_id?: string | null
          related_entity_type?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          activity_type?: 'property_listed' | 'property_updated' | 'property_deleted' | 'rental_request_created' | 'rental_request_approved' | 'rental_request_rejected' | 'rental_request_cancelled' | 'profile_updated'
          title?: string
          description?: string
          metadata?: Json
          related_entity_id?: string | null
          related_entity_type?: string | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "activities_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {}
    Functions: {}
    Enums: {
      user_role: 'seller' | 'buyer' | 'admin'
      property_status: 'Available' | 'Pending' | 'Rented'
      request_status: 'pending' | 'approved' | 'rejected'
      area_unit: 'Marla' | 'Kanal'
      activity_type: 'property_listed' | 'property_updated' | 'property_deleted' | 'rental_request_created' | 'rental_request_approved' | 'rental_request_rejected' | 'rental_request_cancelled' | 'profile_updated'
    }
    CompositeTypes: {}
  }
}
