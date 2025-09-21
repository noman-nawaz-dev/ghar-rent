import { Database } from "@/types/supabase";
import { supabase } from "../supabase.client";
import { PostgrestError } from "@supabase/supabase-js";

type RentalRequest = Database['public']['Tables']['rental_requests']['Insert'];
export type RentalRequestRow = Database['public']['Tables']['rental_requests']['Row']

export type RentalRequestWithDetails = {
    id: string
    property_id: string
    buyer_id: string
    proposed_price: number
    duration: number
    message: string | null
    status: 'pending' | 'approved' | 'rejected'
    created_at: string
    updated_at: string
    buyer_name: string
    buyer_email: string
    buyer_phone: string | null
    property_title: string
}

export class RentalRequestService {
    static async createRentalRequest(rentalRequest: RentalRequest): Promise<{ data: RentalRequestRow | null; error: any }> {
        try {
            const { data, error } = await supabase.from('rental_requests').insert(rentalRequest).select().single();
            return { data, error }
        } catch (error) {
            return { data: null, error }
        }
    }

    static async getRentalRequestsBySellerId(sellerId: string): Promise<{ data: RentalRequestWithDetails[] | null; error: any }> {
        try {
            const { data, error } = await supabase
                .from('rental_requests')
                .select(`
                    *,
                    properties!rental_requests_property_id_fkey (
                        title
                    ),
                    users!rental_requests_buyer_id_fkey (
                        name,
                        email,
                        phone
                    )
                `)
                .eq('properties.seller_id', sellerId)
                .order('created_at', { ascending: false });

            if (error) {
                return { data: null, error };
            }

            const transformedData: RentalRequestWithDetails[] = data?.map((item: any) => ({
                id: item.id,
                property_id: item.property_id,
                buyer_id: item.buyer_id,
                proposed_price: item.proposed_price,
                duration: item.duration,
                message: item.message,
                status: item.status,
                created_at: item.created_at,
                updated_at: item.updated_at,
                buyer_name: item.users?.name || '',
                buyer_email: item.users?.email || '',
                buyer_phone: item.users?.phone || null,
                property_title: item.properties?.title || ''
            })) || [];

            return { data: transformedData, error: null };
        } catch (error) {
            return { data: null, error };
        }
    }

    static async updateRentalRequestStatus(requestId: string, status: 'approved' | 'rejected'): Promise<{ data: RentalRequestRow | null; error: any }> {
        try {
            const { data, error } = await supabase
                .from('rental_requests')
                .update({
                    status,
                    updated_at: new Date().toISOString()
                })
                .eq('id', requestId)
                .select()
                .single();

            return { data, error };
        } catch (error) {
            return { data: null, error };
        }
    }

    static async getRentalRequestByUserAndProperty(userId: string, propertyId: string): Promise<{ data: RentalRequestRow | null; error: PostgrestError | unknown | null }> {
        try {
            const { data, error } = await supabase
                .from("rental_requests")
                .select("*")
                .eq("buyer_id", userId)
                .eq("property_id", propertyId)
                .single();
            return { data, error };
        } catch (error) {
            return { data: null, error };
        }
    }

    static async updateRentalRequest(id: string, payload: Partial<RentalRequestRow>): Promise<{ data: RentalRequestRow | null; error: PostgrestError | unknown | null }> {
        try {
            const { data, error } = await supabase
                .from("rental_requests")
                .update(payload)
                .eq("id", id);
            return { data, error };
        } catch (error) {
            return { data: null, error };
        }
    }

    static async deleteRentalRequest(id: string): Promise<{ error: PostgrestError | unknown | null }> {
        try {
            const { error } = await supabase
                .from("rental_requests")
                .delete()
                .eq("id", id);
            return { error };
        } catch (error) {
            return { error };
        }
    }
}
