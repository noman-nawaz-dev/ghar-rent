import { supabase } from "../supabase.client";
import { Database } from "@/types/supabase";

export type RentalRequestRow = Database['public']['Tables']['rental_requests']['Row'] & { property_title?: string }

export class BuyerDashboardService {

    static async getRentalRequestsByBuyerId(buyerId: string): Promise<{ data:RentalRequestRow[] | null, error: any}>{
        try{
            const {data, error} = await supabase
                .from('rental_requests')
                .select('*, properties(title)')
                .eq('buyer_id', buyerId)
                .order('created_at', { ascending: false });

            const mappedData = data?.map((req: any) => ({
                ...req,
                property_title: req.properties?.title || '',
            })) || null;

            return {data: mappedData, error}
        } catch (error){
            return {data:null, error}
        }
    }
}