import { supabase } from '@/lib/supabase.client';
import { Database } from '@/types/supabase';
import { ActivityService } from './activities';

type Property = Database['public']['Tables']['properties']['Insert'];
export type PropertyRow = Database['public']['Tables']['properties']['Row'];

export class PropertyService {
  /**
   * Insert a new property
   */
  static async insertProperty(property: Property): Promise<{ data: PropertyRow | null; error: any }> {
    try {
      const { data, error } = await supabase
        .from('properties')
        .insert({
          title: property.title,
          description: property.description,
          price: property.price,
          area: property.area,
          area_unit: property.area_unit,
          bedrooms: property.bedrooms,
          floors: property.floors,
          kitchens: property.kitchens,
          has_lawn: property.has_lawn,
          additional_info: property.additional_info,
          address: property.address,
          city: property.city,
          images: property.images,
          seller_id: property.seller_id,
          seller_phone: property.seller_phone,
          seller_name: property.seller_name,
          listed_date: property.listed_date || new Date().toISOString().split('T')[0],
          status: property.status || 'Available',
          property_type: property.property_type,
          coordinates: property.coordinates || null,
        })
        .select()
        .single();

      // Log activity if property was created successfully
      if (data && !error) {
        await ActivityService.logPropertyListed(
          data.seller_id,
          data.id,
          data.title,
          data.price,
          data.city
        ).catch(err => console.error('Failed to log activity:', err));
      }

      return { data, error };
    } catch (error) {
      return { data: null, error };
    }
  }

  /**
   * Get all available properties
   */
  static async getAvailableProperties(): Promise<{ data: PropertyRow[] | null; error: any }> {
    try {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('status', 'Available')
        .order('created_at', { ascending: false });

      return { data, error };
    } catch (error) {
      return { data: null, error };
    }
  }

  /**
   * Get all properties (for admin)
   */
  static async getAllProperties(): Promise<{ data: PropertyRow[] | null; error: any }> {
    try {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .order('created_at', { ascending: false });

      return { data, error };
    } catch (error) {
      return { data: null, error };
    }
  }

  /**
   * Get properties by seller ID
   */
  static async getPropertiesBySeller(sellerId: string): Promise<{ data: PropertyRow[] | null; error: any }> {
    try {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('seller_id', sellerId)
        .order('created_at', { ascending: false });

      return { data, error };
    } catch (error) {
      return { data: null, error };
    }
  }

  /**
   * Get property by ID
   */
  static async getPropertyById(id: string): Promise<{ data: PropertyRow | null; error: any }> {
    try {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('id', id)
        .single();
      return { data, error };
    } catch (error) {
      return { data: null, error };
    }
  }

  /**
   * Update property
   */
  static async updateProperty(id: string, updates: Partial<Property>): Promise<{ data: PropertyRow | null; error: any }> {
    try {
      // Get old property data to track changes
      const { data: oldProperty } = await supabase
        .from('properties')
        .select('title, price, status, seller_id')
        .eq('id', id)
        .single();

      const { data, error } = await supabase
        .from('properties')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      // Log activity if property was updated successfully and changes were made
      if (data && !error && oldProperty) {
        const changes = {
          title_changed: updates.title !== undefined && oldProperty.title !== updates.title,
          price_changed: updates.price !== undefined && oldProperty.price !== updates.price,
          status_changed: updates.status !== undefined && oldProperty.status !== updates.status,
        };

        // Only log if something significant changed
        if (changes.title_changed || changes.price_changed || changes.status_changed) {
          await ActivityService.logPropertyUpdated(
            data.seller_id,
            data.id,
            data.title,
            changes
          ).catch(err => console.error('Failed to log activity:', err));
        }
      }

      return { data, error };
    } catch (error) {
      return { data: null, error };
    }
  }

  /**
   * Delete property
   */
  static async deleteProperty(id: string): Promise<{ error: any }> {
    try {
      // Get property data before deletion to log activity
      const { data: property } = await supabase
        .from('properties')
        .select('title, city, seller_id')
        .eq('id', id)
        .single();

      const { error } = await supabase
        .from('properties')
        .delete()
        .eq('id', id);

      // Log activity if property was deleted successfully
      if (!error && property) {
        await ActivityService.logPropertyDeleted(
          property.seller_id,
          id,
          property.title,
          property.city
        ).catch(err => console.error('Failed to log activity:', err));
      }

      return { error };
    } catch (error) {
      return { error };
    }
  }

  /**
   * Search properties with filters
   */
  static async searchProperties(filters: {
    search_term?: string;
    city_filter?: string;
    min_price?: number;
    max_price?: number;
    property_type_filter?: string;
    min_bedrooms?: number;
    has_lawn_filter?: boolean;
  }): Promise<{ data: PropertyRow[] | null; error: any }> {
    try {
      let query = supabase
        .from('properties')
        .select('*')
        .eq('status', 'Available');

      if (filters.city_filter) {
        query = query.ilike('city', `%${filters.city_filter}%`);
      }

      if (filters.min_price) {
        query = query.gte('price', filters.min_price);
      }

      if (filters.max_price) {
        query = query.lte('price', filters.max_price);
      }

      if (filters.property_type_filter) {
        query = query.ilike('property_type', `%${filters.property_type_filter}%`);
      }

      if (filters.min_bedrooms) {
        query = query.gte('bedrooms', filters.min_bedrooms);
      }

      if (filters.has_lawn_filter !== undefined) {
        query = query.eq('has_lawn', filters.has_lawn_filter);
      }

      if (filters.search_term) {
        query = query.or(`title.ilike.%${filters.search_term}%,description.ilike.%${filters.search_term}%,address.ilike.%${filters.search_term}%,city.ilike.%${filters.search_term}%`);
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      return { data, error };
    } catch (error) {
      return { data: null, error };
    }
  }

  /**
   * Get filtered, sorted, and paginated properties
   */
  static async getFilteredProperties({
    filters = {},
    sort = 'newest',
    page = 1,
    pageSize = 8,
  }: {
    filters?: {
      search_term?: string;
      city_filter?: string;
      min_price?: number;
      max_price?: number;
      property_type_filter?: string;
      min_bedrooms?: number;
      has_lawn_filter?: boolean;
    };
    sort?: 'newest' | 'price-low' | 'price-high' | 'area-high';
    page?: number;
    pageSize?: number;
  }) {
    try {
      let query = supabase
        .from('properties')
        .select('*', { count: 'exact' })
        .in('status', ['Available', 'Pending']);

      if (filters?.city_filter) {
        query = query.ilike('city', `%${filters.city_filter}%`);
      }
      if (filters?.min_price !== undefined) {
        query = query.gte('price', filters.min_price);
      }
      if (filters?.max_price !== undefined) {
        query = query.lte('price', filters.max_price);
      }
      if (filters?.property_type_filter) {
        query = query.ilike('property_type', `%${filters.property_type_filter}%`);
      }
      if (filters?.min_bedrooms !== undefined) {
        query = query.gte('bedrooms', filters.min_bedrooms);
      }
      if (filters?.has_lawn_filter !== undefined) {
        query = query.eq('has_lawn', filters.has_lawn_filter);
      }
      if (filters?.search_term) {
        query = query.or(`title.ilike.%${filters.search_term}%,description.ilike.%${filters.search_term}%,address.ilike.%${filters.search_term}%,city.ilike.%${filters.search_term}%`);
      }

      // Sorting
      switch (sort) {
        case 'price-low':
          query = query.order('price', { ascending: true });
          break;
        case 'price-high':
          query = query.order('price', { ascending: false });
          break;
        case 'area-high':
          query = query.order('area', { ascending: false });
          break;
        default:
          query = query.order('created_at', { ascending: false });
      }

      // Pagination
      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;
      query = query.range(from, to);

      const { data, error, count } = await query;
      return { data, error, total: count || 0 };
    } catch (error) {
      return { data: null, error, total: 0 };
    }
  }

  /**
   * Get total count of properties
   */
  static async getTotalPropertiesCount(): Promise<{ count: number; error: any }> {
    try {
      const { count, error } = await supabase
        .from('properties')
        .select('*', { count: 'exact', head: true });

      return { count: count || 0, error };
    } catch (error) {
      return { count: 0, error };
    }
  }
} 