"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Home, Clock, CheckCircle, XCircle, DollarSign, Building, Users, Eye, Loader2 } from "lucide-react"
import { RentalRequestService, RentalRequestRow } from "@/lib/database/rental-requests"
import { PropertyService, PropertyRow } from "@/lib/database/properties"
import { ActivityService, ActivityRow } from "@/lib/database/activities"
import { ACTIVITY_CONSTANTS } from "@/lib/constants"
import { useAuth } from "@/hooks/useAuth"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import PropertyCard from "@/components/property/property-card"

export default function BuyerDashboard() {
  const [activeTab, setActiveTab] = useState("overview")
  const [rentalRequests, setRentalRequests] = useState<(RentalRequestRow & { property_title?: string })[] | null>(null)
  const [approvedRentals, setApprovedRentals] = useState<PropertyRow[]>([])
  const [recentActivities, setRecentActivities] = useState<ActivityRow[]>([])
  const [loading, setLoading] = useState(false)
  const [rentalsLoading, setRentalsLoading] = useState(false)
  const [loadingActivities, setLoadingActivities] = useState(true)
  const { currentUser } = useAuth()
  const { toast } = useToast()
  const router = useRouter()

  const fetchRentalRequests = useCallback(async (showToast = false) => {
    if (!currentUser?.id) return;
    
    const isInitialLoad = !rentalRequests;
    if (isInitialLoad) {
      setLoading(true)
    }
    
    try {
      const { data, error } = await RentalRequestService.getRentalRequestsByBuyerId(currentUser.id)
      
      if (error) {
        console.error('Error fetching rental requests:', error)
        if (showToast) {
          toast({
            title: "Error",
            description: "Failed to fetch rental requests. Please try again.",
            variant: "destructive"
          })
        }
        setRentalRequests([])
      } else {
        setRentalRequests(data || [])
        if (showToast) {
          toast({
            title: "Success",
            description: "Rental requests updated successfully.",
          })
        }
      }
    } catch (error) {
      console.error('Unexpected error:', error)
      if (showToast) {
        toast({
          title: "Error",
          description: "An unexpected error occurred.",
          variant: "destructive"
        })
      }
      setRentalRequests([])
    } finally {
      setLoading(false)
    }
  }, [currentUser?.id, rentalRequests, toast])

  useEffect(() => {
    fetchRentalRequests()
  }, [currentUser?.id])

  // Fetch approved rentals (properties for approved rental requests)
  const fetchApprovedRentals = useCallback(async () => {
    if (!currentUser?.id) return;
    
    setRentalsLoading(true)
    
    try {
      const { data: requests, error: requestsError } = await RentalRequestService.getRentalRequestsByBuyerId(currentUser.id)
      
      if (requestsError) {
        console.error('Error fetching rental requests:', requestsError)
        setApprovedRentals([])
        return
      }
      
      // Filter for approved requests
      const approvedRequests = requests?.filter(req => req.status === 'approved') || []
      
      // Fetch full property details for each approved request
      const propertyPromises = approvedRequests.map(req => 
        PropertyService.getPropertyById(req.property_id)
      )
      
      const propertyResults = await Promise.all(propertyPromises)
      const properties = propertyResults
        .map(result => result.data)
        .filter((prop): prop is PropertyRow => prop !== null)
      
      setApprovedRentals(properties)
    } catch (error) {
      console.error('Unexpected error:', error)
      setApprovedRentals([])
    } finally {
      setRentalsLoading(false)
    }
  }, [currentUser?.id])

  useEffect(() => {
    if (activeTab === 'rentals') {
      fetchApprovedRentals()
    }
  }, [activeTab, fetchApprovedRentals])

  // Fetch recent activities
  useEffect(() => {
    const fetchActivities = async () => {
      if (!currentUser?.id) {
        setLoadingActivities(false)
        return
      }

      setLoadingActivities(true)
      try {
        const { data, error } = await ActivityService.getRecentActivities(
          currentUser.id, 
          ACTIVITY_CONSTANTS.RECENT_ACTIVITIES_DISPLAY_COUNT
        )
        
        if (error) {
          console.error('Error fetching activities:', error)
          setRecentActivities([])
        } else {
          setRecentActivities(data || [])
        }
      } catch (error) {
        console.error('Unexpected error fetching activities:', error)
        setRecentActivities([])
      } finally {
        setLoadingActivities(false)
      }
    }

    fetchActivities()
  }, [currentUser?.id])

  // Calculate dynamic statistics from rental requests
  const statistics = useMemo(() => {
    if (!rentalRequests) {
      return [
        {
          title: "Approved Requests",
          value: 0,
          icon: <CheckCircle className="h-5 w-5 text-emerald-600" />,
          change: "Loading...",
          trend: "neutral" as const
        },
        {
          title: "Pending Requests",
          value: 0,
          icon: <Clock className="h-5 w-5 text-amber-600" />,
          change: "Loading...",
          trend: "neutral" as const
        },
        {
          title: "Total Requests",
          value: 0,
          icon: <Building className="h-5 w-5 text-blue-600" />,
          change: "Loading...",
          trend: "neutral" as const
        },
        {
          title: "Rejected Requests",
          value: 0,
          icon: <XCircle className="h-5 w-5 text-red-600" />,
          change: "Loading...",
          trend: "neutral" as const
        }
      ];
    }

    const approved = rentalRequests.filter(r => r.status === 'approved').length;
    const pending = rentalRequests.filter(r => r.status === 'pending').length;
    const rejected = rentalRequests.filter(r => r.status === 'rejected').length;
    const total = rentalRequests.length;

    return [
      {
        title: "Approved Requests",
        value: approved,
        icon: <CheckCircle className="h-5 w-5 text-emerald-600" />,
        change: approved > 0 ? `${approved} ${approved === 1 ? 'property' : 'properties'}` : "No approvals yet",
        trend: approved > 0 ? "up" as const : "neutral" as const
      },
      {
        title: "Pending Requests",
        value: pending,
        icon: <Clock className="h-5 w-5 text-amber-600" />,
        change: pending > 0 ? "Awaiting response" : "No pending",
        trend: "neutral" as const
      },
      {
        title: "Total Requests",
        value: total,
        icon: <Building className="h-5 w-5 text-blue-600" />,
        change: total > 0 ? "All requests" : "No requests yet",
        trend: total > 0 ? "up" as const : "neutral" as const
      },
      {
        title: "Rejected Requests",
        value: rejected,
        icon: <XCircle className="h-5 w-5 text-red-600" />,
        change: rejected > 0 ? `${rejected} ${rejected === 1 ? 'rejection' : 'rejections'}` : "No rejections",
        trend: rejected > 0 ? "down" as const : "neutral" as const
      }
    ];
  }, [rentalRequests]);

  return (
    <div className="pt-28 pb-16">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="font-poppins text-2xl md:text-3xl font-bold">Buyer Dashboard</h1>
            <p className="text-muted-foreground">Track your rental journey and manage your requests</p>
          </div>
        </div>

        {/* Dashboard Content */}
        <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-8">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="rentals">My Rentals</TabsTrigger>
            <TabsTrigger value="requests">Rental Requests</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {statistics.map((stat, index) => (
                <Card key={index}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="bg-muted rounded-full p-2">
                        {stat.icon}
                      </div>
                      <Badge 
                        variant="outline"
                        className={
                          stat.trend === "up" 
                            ? "text-emerald-600 bg-emerald-50 dark:bg-emerald-950/50 border-emerald-200 dark:border-emerald-900" 
                            : stat.trend === "down" 
                              ? "text-red-600 bg-red-50 dark:bg-red-950/50 border-red-200 dark:border-red-900" 
                              : "text-amber-600 bg-amber-50 dark:bg-amber-950/50 border-amber-200 dark:border-amber-900"
                        }
                      >
                        {stat.change}
                      </Badge>
                    </div>
                    <div className="mt-4">
                      <p className="text-muted-foreground text-sm">{stat.title}</p>
                      <h3 className="text-2xl font-bold mt-1">{stat.value}</h3>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>Your latest actions on the platform</CardDescription>
                </CardHeader>
                <CardContent>
                  {loadingActivities ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                      <span className="ml-2 text-muted-foreground">Loading activities...</span>
                    </div>
                  ) : recentActivities.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">No recent activity</p>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {recentActivities.map((activity) => {
                        const iconColor = ActivityService.getActivityColor(activity.activity_type)
                        const IconComponent = activity.activity_type.includes('approved') 
                          ? CheckCircle 
                          : activity.activity_type.includes('rejected')
                          ? XCircle
                          : activity.activity_type.includes('pending') || activity.activity_type.includes('created')
                          ? Clock
                          : Home
                        
                        return (
                          <div key={activity.id} className="flex items-start space-x-4">
                            <div className="bg-muted rounded-full p-2 mt-1">
                              <IconComponent className={`h-4 w-4 ${iconColor}`} />
                            </div>
                            <div className="flex-1">
                              <p className="font-medium">{activity.title}</p>
                              <p className="text-sm text-muted-foreground">{activity.description}</p>
                              <p className="text-xs text-muted-foreground mt-1">
                                {ActivityService.formatRelativeTime(activity.created_at)}
                              </p>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="rentals">
            <Card>
              <CardHeader>
                <CardTitle>My Rentals</CardTitle>
                <CardDescription>Properties with approved rental requests</CardDescription>
              </CardHeader>
              <CardContent>
                {rentalsLoading ? (
                  <div className="py-8 text-center text-muted-foreground">Loading your rentals...</div>
                ) : approvedRentals.length === 0 ? (
                  <div className="py-8 text-center text-muted-foreground">
                    <Home className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                    <p className="text-lg font-medium mb-2">No approved rentals yet</p>
                    <p className="text-sm">Your approved rental requests will appear here.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {approvedRentals.map((property) => (
                      <PropertyCard key={property.id} property={property} />
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="requests">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Rental Requests</CardTitle>
                    <CardDescription>Track the status of your rental requests</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="py-8 text-center text-muted-foreground">Loading rental requests...</div>
                ) : !rentalRequests || rentalRequests.length === 0 ? (
                  <div className="py-8 text-center text-muted-foreground">
                    <Clock className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                    <p className="text-lg font-medium mb-2">No rental requests yet</p>
                    <p className="text-sm">Your rental requests will appear here once you submit them.</p>
                  </div>
                ) : (
                  <div className="rounded-md border overflow-x-auto">
                    <table className="min-w-full divide-y divide-border">
                      <thead className="bg-muted">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Property</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Proposed Price</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Duration</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Date</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Status</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Message</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="bg-background divide-y divide-border">
                        {rentalRequests.map((req) => (
                          <tr key={req.id} className="hover:bg-muted/50 transition-colors">
                            <td className="px-4 py-3">
                              <div className="font-medium">{req.property_title || 'Property'}</div>
                            </td>
                            <td className="px-4 py-3 font-medium">PKR {req.proposed_price.toLocaleString()}</td>
                            <td className="px-4 py-3">{req.duration} {req.duration === 1 ? 'month' : 'months'}</td>
                            <td className="px-4 py-3 text-sm">
                              {new Date(req.created_at).toLocaleDateString('en-US', { 
                                year: 'numeric', 
                                month: 'short', 
                                day: 'numeric' 
                              })}
                            </td>
                            <td className="px-4 py-3">
                              <Badge 
                                variant="outline"
                                className={
                                  req.status === "approved" 
                                    ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-400" 
                                    : req.status === "rejected" 
                                      ? "bg-red-50 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-400" 
                                      : "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-400"
                                }
                              >
                                {req.status === "approved" && <CheckCircle className="h-3 w-3 mr-1" />}
                                {req.status === "rejected" && <XCircle className="h-3 w-3 mr-1" />}
                                {req.status === "pending" && <Clock className="h-3 w-3 mr-1" />}
                                {req.status.charAt(0).toUpperCase() + req.status.slice(1)}
                              </Badge>
                            </td>
                            <td className="px-4 py-3 text-sm text-muted-foreground max-w-xs truncate">
                              {req.message || <span className="text-muted-foreground/50">No message</span>}
                            </td>
                            <td className="px-4 py-3">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => router.push(`/property/${req.property_id}`)}
                                className="whitespace-nowrap"
                              >
                                <Eye className="h-4 w-4 mr-1" />
                                View
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
