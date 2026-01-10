import { Database } from "@/types/supabase";
import { supabase } from "../supabase.client";
import { PostgrestError } from "@supabase/supabase-js";
import { ActivityService } from "./activities";

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
            
            // Log activity if request was created successfully
            if (data && !error) {
                // Get property details
                const { data: property } = await supabase
                    .from('properties')
                    .select('title, seller_id')
                    .eq('id', data.property_id)
                    .single();

                if (property) {
                    // Log for buyer
                    await ActivityService.logRentalRequestCreatedBuyer(
                        data.buyer_id,
                        data.id,
                        data.property_id,
                        property.title,
                        data.proposed_price,
                        data.duration
                    ).catch(err => console.error('Failed to log buyer activity:', err));

                    // Log for seller
                    await ActivityService.logRentalRequestCreatedSeller(
                        property.seller_id,
                        data.id,
                        data.property_id,
                        property.title,
                        data.buyer_id,
                        data.proposed_price,
                        data.duration
                    ).catch(err => console.error('Failed to log seller activity:', err));
                }
            }

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

            // Log activity if status was updated successfully
            if (data && !error) {
                // Get property details and buyer info
                const { data: property } = await supabase
                    .from('properties')
                    .select('title, seller_id')
                    .eq('id', data.property_id)
                    .single();

                if (property) {
                    if (status === 'approved') {
                        // Log approval for buyer
                        await ActivityService.logRentalRequestApprovedBuyer(
                            data.buyer_id,
                            data.id,
                            data.property_id,
                            property.title,
                            data.proposed_price
                        ).catch(err => console.error('Failed to log buyer activity:', err));

                        // Log approval for seller
                        await ActivityService.logRentalRequestApprovedSeller(
                            property.seller_id,
                            data.id,
                            data.property_id,
                            property.title,
                            data.buyer_id
                        ).catch(err => console.error('Failed to log seller activity:', err));
                    } else if (status === 'rejected') {
                        // Log rejection for buyer
                        await ActivityService.logRentalRequestRejectedBuyer(
                            data.buyer_id,
                            data.id,
                            data.property_id,
                            property.title
                        ).catch(err => console.error('Failed to log buyer activity:', err));

                        // Log rejection for seller
                        await ActivityService.logRentalRequestRejectedSeller(
                            property.seller_id,
                            data.id,
                            data.property_id,
                            property.title,
                            data.buyer_id
                        ).catch(err => console.error('Failed to log seller activity:', err));
                    }
                }
            }

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
            // Get old rental request data before update
            const { data: oldRequest } = await supabase
                .from("rental_requests")
                .select('*, properties!rental_requests_property_id_fkey (title)')
                .eq("id", id)
                .single();

            const { data, error } = await supabase
                .from("rental_requests")
                .update(payload)
                .eq("id", id)
                .select()
                .single();

            // Log activity if request was updated successfully (but not status changes, they have their own logging)
            if (data && !error && oldRequest && !payload.status) {
                const property = (oldRequest as any).properties;
                const propertyTitle = property?.title || 'Unknown Property';
                
                await ActivityService.createActivity({
                    user_id: data.buyer_id,
                    activity_type: 'rental_request_created', // Using created type for updates
                    title: 'Rental request updated',
                    description: `You updated your request for ${propertyTitle}`,
                    metadata: {
                        request_id: data.id,
                        property_id: data.property_id,
                        property_title: propertyTitle,
                        proposed_price: data.proposed_price,
                        duration: data.duration,
                        updated: true,
                    },
                    related_entity_id: data.id,
                    related_entity_type: 'rental_request',
                }).catch(err => console.error('Failed to log activity:', err));
            }

            return { data, error };
        } catch (error) {
            return { data: null, error };
        }
    }

    static async deleteRentalRequest(id: string): Promise<{ error: PostgrestError | unknown | null }> {
        try {
            // Get rental request data before deletion to log activity
            const { data: request } = await supabase
                .from("rental_requests")
                .select('buyer_id, property_id, properties!rental_requests_property_id_fkey (title)')
                .eq("id", id)
                .single();

            const { error } = await supabase
                .from("rental_requests")
                .delete()
                .eq("id", id);

            // Log activity if request was deleted successfully
            if (!error && request) {
                const property = (request as any).properties;
                const propertyTitle = property?.title || 'Unknown Property';
                
                await ActivityService.logRentalRequestCancelled(
                    request.buyer_id,
                    id,
                    request.property_id,
                    propertyTitle
                ).catch(err => console.error('Failed to log activity:', err));
            }

            return { error };
        } catch (error) {
            return { error };
        }
    }

    static async getRentalRequestsByBuyerId(buyerId: string): Promise<{ data: (RentalRequestRow & { property_title?: string })[] | null; error: any }> {
        try {
            const { data, error } = await supabase
                .from('rental_requests')
                .select(`
                    *,
                    properties!rental_requests_property_id_fkey (
                        title,
                        price,
                        city,
                        address,
                        property_type
                    )
                `)
                .eq('buyer_id', buyerId)
                .order('created_at', { ascending: false });

            if (error) {
                return { data: null, error };
            }

            const mappedData = data?.map((req: any) => ({
                ...req,
                property_title: req.properties?.title || '',
                property_price: req.properties?.price || 0,
                property_city: req.properties?.city || '',
                property_address: req.properties?.address || '',
                property_type: req.properties?.property_type || '',
            })) || [];

            return { data: mappedData, error: null };
        } catch (error) {
            return { data: null, error };
        }
    }
}
