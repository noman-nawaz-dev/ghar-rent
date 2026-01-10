"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  Building, 
  Plus, 
  Users, 
  Clock, 
  CheckCircle, 
  XCircle,
  DollarSign,
  Home,
  Loader2,
} from "lucide-react"
import { PendingRequestsTable } from "@/components/seller/pending-requests"
import { ListedPropertiesTable } from "@/components/seller/listed-properties"
import { useAuth } from "@/hooks/useAuth"
import { RentalRequestService, RentalRequestWithDetails } from "@/lib/database/rental-requests"
import { PropertyService, PropertyRow } from "@/lib/database/properties"
import { ActivityService, ActivityRow } from "@/lib/database/activities"
import { ACTIVITY_CONSTANTS } from "@/lib/constants"
import { useToast } from "@/hooks/use-toast"

interface PendingRequest {
  id: string
  renterName: string
  renterInitials: string
  propertyName: string
  proposedPrice: number
  duration: number
}

export default function SellerDashboard() {
  const [activeTab, setActiveTab] = useState("overview")
  const [pendingRequests, setPendingRequests] = useState<PendingRequest[]>([])
  const [loadingRequests, setLoadingRequests] = useState(true)
  const [properties, setProperties] = useState<PropertyRow[]>([])
  const [loadingProperties, setLoadingProperties] = useState(true)
  const [recentActivities, setRecentActivities] = useState<ActivityRow[]>([])
  const [loadingActivities, setLoadingActivities] = useState(true)
  const { currentUser } = useAuth()
  const { toast } = useToast()

  // Fetch pending rental requests
  useEffect(() => {
    const fetchPendingRequests = async () => {
      if (!currentUser?.id) {
        setLoadingRequests(false)
        return
      }
      
      setLoadingRequests(true)
      try {
        const { data, error } = await RentalRequestService.getRentalRequestsBySellerId(currentUser.id)
        
        if (error) {
          toast({
            title: "Error",
            description: "Failed to fetch rental requests",
            variant: "destructive"
          })
          setLoadingRequests(false)
          return
        }

        if (data) {
          // Filter only pending requests and take the first 3
          const pending = data
            .filter((request: RentalRequestWithDetails) => request.status === 'pending')
            .slice(0, 3)
            .map((request: RentalRequestWithDetails) => ({
              id: request.id,
              renterName: request.buyer_name,
              renterInitials: request.buyer_name.split(' ').map(n => n[0]).join('').toUpperCase(),
              propertyName: request.property_title,
              proposedPrice: request.proposed_price,
              duration: request.duration
            }))
          
          setPendingRequests(pending)
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to fetch rental requests",
          variant: "destructive"
        })
      } finally {
        setLoadingRequests(false)
      }
    }

    fetchPendingRequests()
  }, [currentUser?.id, toast])

  // Fetch properties by seller
  useEffect(() => {
    fetchProperties()
  }, [currentUser?.id, toast])

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

  const fetchProperties = async () => {
    if (!currentUser?.id) {
      setLoadingProperties(false)
      return
    }
    
    setLoadingProperties(true)
    try {
      const { data, error } = await PropertyService.getPropertiesBySeller(currentUser.id)
      
      if (error) {
        toast({
          title: "Error",
          description: "Failed to fetch properties",
          variant: "destructive"
        })
        setLoadingProperties(false)
        return
      }

      if (data) {
        setProperties(data)
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch properties",
        variant: "destructive"
      })
    } finally {
      setLoadingProperties(false)
    }
  }
  
  const statistics = [
    {
      title: "Properties Listed",
      value: properties.length,
      icon: <Building className="h-5 w-5 text-emerald-600" />,
      change: "+2 this month",
      trend: "up"
    },
    {
      title: "Active Rentals",
      value: properties.filter(p => p.status === 'Rented').length,
      icon: <Home className="h-5 w-5 text-emerald-600" />,
      change: "+1 this month",
      trend: "up"
    },
    {
      title: "Pending Requests",
      value: pendingRequests.length,
      icon: <Clock className="h-5 w-5 text-amber-600" />,
      change: pendingRequests.length > 0 ? `${pendingRequests.length} awaiting` : "No pending",
      trend: "neutral"
    },
    {
      title: "Total Earnings",
      value: "Rs. 320,000",
      icon: <DollarSign className="h-5 w-5 text-emerald-600" />,
      change: "+Rs. 80,000 this month",
      trend: "up"
    }
  ]

  return (
    <div className="pt-28 pb-16">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="font-poppins text-2xl md:text-3xl font-bold">Seller Dashboard</h1>
            <p className="text-muted-foreground">Manage your properties and rental requests</p>
          </div>
          <div className="mt-4 md:mt-0">
            <Button asChild className="bg-emerald-600 hover:bg-emerald-700">
              <Link href="/seller/add-property">
                <Plus className="mr-2 h-4 w-4" /> Add New Property
              </Link>
            </Button>
          </div>
        </div>
        
        {/* Dashboard Content */}
        <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-8">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="properties">My Properties</TabsTrigger>
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
            
            {/* Recent Activity and Pending Requests */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
              {/* Recent Activity */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>Your latest activity on the platform</CardDescription>
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
                          : activity.activity_type.includes('request')
                          ? Users
                          : Building
                        
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
              
              {/* Pending Requests Preview */}
              <Card className="lg:col-span-3">
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Pending Rental Requests</CardTitle>
                    <CardDescription>Requests awaiting your approval</CardDescription>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => setActiveTab("requests")}>
                    View All
                  </Button>
                </CardHeader>
                <CardContent>
                  {loadingRequests ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                      <span className="ml-2 text-muted-foreground">Loading requests...</span>
                    </div>
                  ) : pendingRequests.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">No pending rental requests</p>
                    </div>
                  ) : (
                    pendingRequests.map((request) => (
                      <div key={request.id} className="flex items-center justify-between py-3 border-b last:border-b-0">
                        <div className="flex items-center space-x-4">
                          <Avatar>
                            <AvatarFallback>{request.renterInitials}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{request.renterName}</p>
                            <p className="text-sm text-muted-foreground">
                              Requesting: {request.propertyName}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="text-right hidden md:block">
                            <p className="font-medium text-emerald-600">
                              PKR {request.proposedPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {request.duration} months
                            </p>
                          </div>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => setActiveTab("requests")}
                            className="text-emerald-600 hover:text-emerald-700"
                          >
                            View
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="properties">
            <Card>
              <CardHeader>
                <CardTitle>My Properties</CardTitle>
                <CardDescription>Manage your listed properties</CardDescription>
              </CardHeader>
              <CardContent>
                {loadingProperties ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                    <span className="ml-2 text-muted-foreground">Loading properties...</span>
                  </div>
                ) : properties.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground mb-4">You haven't listed any properties yet</p>
                    <Button asChild className="bg-emerald-600 hover:bg-emerald-700">
                      <Link href="/seller/add-property">
                        <Plus className="mr-2 h-4 w-4" /> Add Your First Property
                      </Link>
                    </Button>
                  </div>
                ) : (
                  <ListedPropertiesTable properties={properties} onPropertyDeleted={fetchProperties} />
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="requests">
            <Card>
              <CardHeader>
                <CardTitle>Rental Requests</CardTitle>
                <CardDescription>Review and respond to rental requests for your properties</CardDescription>
              </CardHeader>
              <CardContent>
                <PendingRequestsTable />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}