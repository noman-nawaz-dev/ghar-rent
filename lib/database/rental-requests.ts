import { Database } from "@/types/supabase";
import { supabase } from "../supabase.client";

type RentalRequest = Database['public']['Tables']['rental_requests']['Insert'];
export type RentalRequestRow = Database['public']['Tables']['rental_requests']['Row']

export class RentalRequestService {
    static async createRentalRequest(rentalRequest: RentalRequest): Promise<{ data: RentalRequestRow | null; error: any }> {
        try {
            const { data, error } = await supabase.from('rental_requests').insert(rentalRequest).select().single();
            return { data, error }
        } catch (error) {
            return { data: null, error }
        }
    }
}
