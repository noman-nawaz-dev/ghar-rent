import { supabase } from "@/lib/supabase.client"
import { ACTIVITY_CONSTANTS } from "@/lib/constants"

export type ActivityType =
  | 'property_listed'
  | 'property_updated'
  | 'property_deleted'
  | 'rental_request_created'
  | 'rental_request_approved'
  | 'rental_request_rejected'
  | 'rental_request_cancelled'
  | 'profile_updated'

export interface ActivityRow {
  id: string
  user_id: string
  activity_type: ActivityType
  title: string
  description: string
  metadata: Record<string, any>
  related_entity_id: string | null
  related_entity_type: string | null
  created_at: string
}

export interface CreateActivityParams {
  user_id: string
  activity_type: ActivityType
  title: string
  description: string
  metadata?: Record<string, any>
  related_entity_id?: string | null
  related_entity_type?: string | null
}

export class ActivityService {
  /**
   * Get recent activities for a user (limited to specified count)
   */
  static async getRecentActivities(userId: string, limit: number = 3) {
    try {
      const { data, error } = await supabase
        .from('activities')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit)

      if (error) {
        console.error('Error fetching activities:', error)
        return { data: null, error }
      }

      return { data: data as ActivityRow[], error: null }
    } catch (error) {
      console.error('Unexpected error fetching activities:', error)
      return { data: null, error }
    }
  }

  /**
   * Get all activities for a user with pagination
   */
  static async getActivitiesByUserId(
    userId: string,
    page: number = 1,
    pageSize: number = 10
  ) {
    try {
      const from = (page - 1) * pageSize
      const to = from + pageSize - 1

      const { data, error, count } = await supabase
        .from('activities')
        .select('*', { count: 'exact' })
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .range(from, to)

      if (error) {
        console.error('Error fetching activities:', error)
        return { data: null, error, count: 0 }
      }

      return { data: data as ActivityRow[], error: null, count: count || 0 }
    } catch (error) {
      console.error('Unexpected error fetching activities:', error)
      return { data: null, error, count: 0 }
    }
  }

  /**
   * Get activities by type for a user
   */
  static async getActivitiesByType(userId: string, activityType: ActivityType) {
    try {
      const { data, error } = await supabase
        .from('activities')
        .select('*')
        .eq('user_id', userId)
        .eq('activity_type', activityType)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching activities by type:', error)
        return { data: null, error }
      }

      return { data: data as ActivityRow[], error: null }
    } catch (error) {
      console.error('Unexpected error fetching activities by type:', error)
      return { data: null, error }
    }
  }

  /**
   * Create a new activity (manual logging)
   */
  static async createActivity(params: CreateActivityParams) {
    try {
      const { data, error } = await supabase
        .from('activities')
        .insert({
          user_id: params.user_id,
          activity_type: params.activity_type,
          title: params.title,
          description: params.description,
          metadata: params.metadata || {},
          related_entity_id: params.related_entity_id || null,
          related_entity_type: params.related_entity_type || null,
        })
        .select()
        .single()

      if (error) {
        console.error('Error creating activity:', error)
        return { data: null, error }
      }

      // Cleanup old activities (keep only last 10)
      await this.deleteOldActivities(params.user_id, ACTIVITY_CONSTANTS.MAX_ACTIVITIES_PER_USER)

      return { data: data as ActivityRow, error: null }
    } catch (error) {
      console.error('Unexpected error creating activity:', error)
      return { data: null, error }
    }
  }

  /**
   * Helper: Log property listing activity
   */
  static async logPropertyListed(
    sellerId: string,
    propertyId: string,
    propertyTitle: string,
    price: number,
    city: string
  ) {
    return this.createActivity({
      user_id: sellerId,
      activity_type: 'property_listed',
      title: 'New property listed',
      description: `You listed ${propertyTitle}`,
      metadata: {
        property_id: propertyId,
        property_title: propertyTitle,
        price,
        city,
      },
      related_entity_id: propertyId,
      related_entity_type: 'property',
    })
  }

  /**
   * Helper: Log property update activity
   */
  static async logPropertyUpdated(
    sellerId: string,
    propertyId: string,
    propertyTitle: string,
    changes: Record<string, boolean>
  ) {
    return this.createActivity({
      user_id: sellerId,
      activity_type: 'property_updated',
      title: 'Property updated',
      description: `You updated ${propertyTitle}`,
      metadata: {
        property_id: propertyId,
        property_title: propertyTitle,
        changes,
      },
      related_entity_id: propertyId,
      related_entity_type: 'property',
    })
  }

  /**
   * Helper: Log property deletion activity
   */
  static async logPropertyDeleted(
    sellerId: string,
    propertyId: string,
    propertyTitle: string,
    city: string
  ) {
    return this.createActivity({
      user_id: sellerId,
      activity_type: 'property_deleted',
      title: 'Property deleted',
      description: `You deleted ${propertyTitle}`,
      metadata: {
        property_id: propertyId,
        property_title: propertyTitle,
        city,
      },
      related_entity_id: propertyId,
      related_entity_type: 'property',
    })
  }

  /**
   * Helper: Log profile update activity
   */
  static async logProfileUpdated(
    userId: string,
    changes: string[]
  ) {
    return this.createActivity({
      user_id: userId,
      activity_type: 'profile_updated',
      title: 'Profile updated',
      description: `You updated your profile`,
      metadata: {
        changes,
      },
      related_entity_id: userId,
      related_entity_type: 'user',
    })
  }

  /**
   * Helper: Log rental request created (for buyer)
   */
  static async logRentalRequestCreatedBuyer(
    buyerId: string,
    requestId: string,
    propertyId: string,
    propertyTitle: string,
    proposedPrice: number,
    duration: number
  ) {
    return this.createActivity({
      user_id: buyerId,
      activity_type: 'rental_request_created',
      title: 'Rental request submitted',
      description: `You requested to rent ${propertyTitle}`,
      metadata: {
        request_id: requestId,
        property_id: propertyId,
        property_title: propertyTitle,
        proposed_price: proposedPrice,
        duration,
      },
      related_entity_id: requestId,
      related_entity_type: 'rental_request',
    })
  }

  /**
   * Helper: Log rental request created (for seller)
   */
  static async logRentalRequestCreatedSeller(
    sellerId: string,
    requestId: string,
    propertyId: string,
    propertyTitle: string,
    buyerId: string,
    proposedPrice: number,
    duration: number
  ) {
    return this.createActivity({
      user_id: sellerId,
      activity_type: 'rental_request_created',
      title: 'New rental request received',
      description: `New request for ${propertyTitle}`,
      metadata: {
        request_id: requestId,
        property_id: propertyId,
        property_title: propertyTitle,
        buyer_id: buyerId,
        proposed_price: proposedPrice,
        duration,
      },
      related_entity_id: requestId,
      related_entity_type: 'rental_request',
    })
  }

  /**
   * Helper: Log rental request approved (for buyer)
   */
  static async logRentalRequestApprovedBuyer(
    buyerId: string,
    requestId: string,
    propertyId: string,
    propertyTitle: string,
    proposedPrice: number
  ) {
    return this.createActivity({
      user_id: buyerId,
      activity_type: 'rental_request_approved',
      title: 'Rental request approved',
      description: `Your request for ${propertyTitle} was approved`,
      metadata: {
        request_id: requestId,
        property_id: propertyId,
        property_title: propertyTitle,
        proposed_price: proposedPrice,
      },
      related_entity_id: requestId,
      related_entity_type: 'rental_request',
    })
  }

  /**
   * Helper: Log rental request approved (for seller)
   */
  static async logRentalRequestApprovedSeller(
    sellerId: string,
    requestId: string,
    propertyId: string,
    propertyTitle: string,
    buyerId: string
  ) {
    return this.createActivity({
      user_id: sellerId,
      activity_type: 'rental_request_approved',
      title: 'Rental request approved',
      description: `You approved a request for ${propertyTitle}`,
      metadata: {
        request_id: requestId,
        property_id: propertyId,
        property_title: propertyTitle,
        buyer_id: buyerId,
      },
      related_entity_id: requestId,
      related_entity_type: 'rental_request',
    })
  }

  /**
   * Helper: Log rental request rejected (for buyer)
   */
  static async logRentalRequestRejectedBuyer(
    buyerId: string,
    requestId: string,
    propertyId: string,
    propertyTitle: string
  ) {
    return this.createActivity({
      user_id: buyerId,
      activity_type: 'rental_request_rejected',
      title: 'Rental request rejected',
      description: `Your request for ${propertyTitle} was rejected`,
      metadata: {
        request_id: requestId,
        property_id: propertyId,
        property_title: propertyTitle,
      },
      related_entity_id: requestId,
      related_entity_type: 'rental_request',
    })
  }

  /**
   * Helper: Log rental request rejected (for seller)
   */
  static async logRentalRequestRejectedSeller(
    sellerId: string,
    requestId: string,
    propertyId: string,
    propertyTitle: string,
    buyerId: string
  ) {
    return this.createActivity({
      user_id: sellerId,
      activity_type: 'rental_request_rejected',
      title: 'Rental request rejected',
      description: `You rejected a request for ${propertyTitle}`,
      metadata: {
        request_id: requestId,
        property_id: propertyId,
        property_title: propertyTitle,
        buyer_id: buyerId,
      },
      related_entity_id: requestId,
      related_entity_type: 'rental_request',
    })
  }

  /**
   * Helper: Log rental request cancelled (for buyer)
   */
  static async logRentalRequestCancelled(
    buyerId: string,
    requestId: string,
    propertyId: string,
    propertyTitle: string
  ) {
    return this.createActivity({
      user_id: buyerId,
      activity_type: 'rental_request_cancelled',
      title: 'Rental request cancelled',
      description: `You cancelled your request for ${propertyTitle}`,
      metadata: {
        request_id: requestId,
        property_id: propertyId,
        property_title: propertyTitle,
      },
      related_entity_id: requestId,
      related_entity_type: 'rental_request',
    })
  }

  /**
   * Delete old activities for a user (cleanup)
   */
  static async deleteOldActivities(userId: string, keepCount: number = 50) {
    try {
      // Get activities to keep
      const { data: activitiesToKeep } = await supabase
        .from('activities')
        .select('id')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(keepCount)

      if (!activitiesToKeep || activitiesToKeep.length === 0) {
        return { data: null, error: null }
      }

      const keepIds = activitiesToKeep.map(a => a.id)

      // Delete activities not in the keep list
      const { error } = await supabase
        .from('activities')
        .delete()
        .eq('user_id', userId)
        .not('id', 'in', `(${keepIds.join(',')})`)

      if (error) {
        console.error('Error deleting old activities:', error)
        return { data: null, error }
      }

      return { data: true, error: null }
    } catch (error) {
      console.error('Unexpected error deleting old activities:', error)
      return { data: null, error }
    }
  }

  /**
   * Get activity statistics for a user
   */
  static async getActivityStats(userId: string) {
    try {
      const { data, error } = await supabase
        .from('activities')
        .select('activity_type')
        .eq('user_id', userId)

      if (error) {
        console.error('Error fetching activity stats:', error)
        return { data: null, error }
      }

      // Count activities by type
      const stats = data.reduce((acc, activity) => {
        acc[activity.activity_type] = (acc[activity.activity_type] || 0) + 1
        return acc
      }, {} as Record<string, number>)

      return { data: stats, error: null }
    } catch (error) {
      console.error('Unexpected error fetching activity stats:', error)
      return { data: null, error }
    }
  }

  /**
   * Get the icon component name for an activity type
   */
  static getActivityIcon(activityType: ActivityType): string {
    const iconMap: Record<ActivityType, string> = {
      property_listed: 'Building',
      property_updated: 'Building',
      property_deleted: 'Building',
      rental_request_created: 'Users',
      rental_request_approved: 'CheckCircle',
      rental_request_rejected: 'XCircle',
      rental_request_cancelled: 'XCircle',
      profile_updated: 'User',
    }
    return iconMap[activityType] || 'Activity'
  }

  /**
   * Get the color class for an activity type
   */
  static getActivityColor(activityType: ActivityType): string {
    const colorMap: Record<ActivityType, string> = {
      property_listed: 'text-emerald-600',
      property_updated: 'text-blue-600',
      property_deleted: 'text-red-600',
      rental_request_created: 'text-blue-600',
      rental_request_approved: 'text-emerald-600',
      rental_request_rejected: 'text-red-600',
      rental_request_cancelled: 'text-amber-600',
      profile_updated: 'text-blue-600',
    }
    return colorMap[activityType] || 'text-gray-600'
  }

  /**
   * Format relative time (e.g., "2 hours ago", "Yesterday")
   */
  static formatRelativeTime(dateString: string): string {
    const date = new Date(dateString)
    const now = new Date()
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

    if (diffInSeconds < 60) {
      return 'Just now'
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60)
      return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ago`
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600)
      return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`
    } else if (diffInSeconds < 172800) {
      return 'Yesterday'
    } else if (diffInSeconds < 604800) {
      const days = Math.floor(diffInSeconds / 86400)
      return `${days} days ago`
    } else {
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
      })
    }
  }
}
