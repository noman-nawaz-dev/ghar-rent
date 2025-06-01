"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Home, Clock, CheckCircle, XCircle, DollarSign, Building, Users } from "lucide-react"
import PropertyCard from "@/components/property/property-card"

// Mock data for statistics
const statistics = [
  {
    title: "Active Rentals",
    value: 2,
    icon: <Home className="h-5 w-5 text-emerald-600" />,
    change: "+1 this month",
    trend: "up"
  },
  {
    title: "Pending Requests",
    value: 1,
    icon: <Clock className="h-5 w-5 text-amber-600" />,
    change: "1 new",
    trend: "neutral"
  },
  {
    title: "Total Spent",
    value: "PKR 180,000",
    icon: <DollarSign className="h-5 w-5 text-emerald-600" />,
    change: "+PKR 60,000 this month",
    trend: "up"
  },
  {
    title: "Properties Viewed",
    value: 12,
    icon: <Building className="h-5 w-5 text-blue-600" />,
    change: "+3 this week",
    trend: "up"
  }
]

// Mock data for rentals
const rentedProperties = [
  {
    id: "prop-003",
    title: "Cozy 2-Bedroom in DHA",
    description: "Well-maintained 2-bedroom house perfect for small families or professionals. Conveniently located near markets, schools, and parks.",
    price: 45000,
    area: 5,
    areaUnit: "Marla" as const,
    bedrooms: 2,
    floors: 1,
    kitchens: 1,
    hasLawn: false,
    additionalInfo: "Nearby schools and parks",
    address: "Phase 2, DHA",
    city: "Islamabad",
    images: [
      "https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
    ],
    sellerPhone: "+92 333 9876543",
    sellerName: "Ali Raza",
    listedDate: "2023-06-25",
    status: "Rented" as const,
    propertyType: "House"
  },
  {
    id: "prop-004",
    title: "Spacious Villa in Gulberg",
    description: "Elegant villa with large reception areas, multiple bedrooms, and a beautiful garden. Ideal for large families or for entertaining guests.",
    price: 150000,
    area: 1,
    areaUnit: "Kanal" as const,
    bedrooms: 5,
    floors: 2,
    kitchens: 2,
    hasLawn: true,
    additionalInfo: "Servant quarter, two lounges, garage",
    address: "Block C, Gulberg III",
    city: "Lahore",
    images: [
      "https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
    ],
    sellerPhone: "+92 300 8765432",
    sellerName: "Malik Fahad",
    listedDate: "2023-07-01",
    status: "Rented" as const,
    propertyType: "Villa"
  }
]

// Mock data for rental requests
const rentalRequests = [
  {
    id: "req-001",
    propertyName: "Modern Family Home in Bahria Town",
    ownerName: "Ali Raza",
    ownerInitials: "AR",
    proposedPrice: 70000,
    duration: 12,
    requestDate: "2023-08-15",
    status: "pending",
    message: "Looking forward to your approval."
  },
  {
    id: "req-002",
    propertyName: "Luxury Apartment in Clifton",
    ownerName: "Nadia Sheikh",
    ownerInitials: "NS",
    proposedPrice: 115000,
    duration: 24,
    requestDate: "2023-08-12",
    status: "approved",
    message: "Excited to move in!"
  }
]

export default function BuyerDashboard() {
  const [activeTab, setActiveTab] = useState("overview")

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
                  <div className="space-y-6">
                    {[1, 2, 3].map((_, index) => (
                      <div key={index} className="flex items-start space-x-4">
                        <div className="bg-muted rounded-full p-2 mt-1">
                          {index === 0 ? (
                            <CheckCircle className="h-4 w-4 text-emerald-600" />
                          ) : index === 1 ? (
                            <Clock className="h-4 w-4 text-amber-600" />
                          ) : (
                            <Home className="h-4 w-4 text-blue-600" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium">
                            {index === 0 
                              ? "Rental request approved" 
                              : index === 1 
                                ? "Rental request pending" 
                                : "New property rented"}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {index === 0 
                              ? "Your request for Modern Family Home was approved" 
                              : index === 1 
                                ? "Waiting for approval on Luxury Apartment in Clifton" 
                                : "You rented Spacious Villa in Gulberg"}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {index === 0 
                              ? "2 hours ago" 
                              : index === 1 
                                ? "Yesterday" 
                                : "3 days ago"}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="rentals">
            <Card>
              <CardHeader>
                <CardTitle>My Rentals</CardTitle>
                <CardDescription>Properties you are currently renting</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {rentedProperties.map((property) => (
                    <PropertyCard key={property.id} property={property} />
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="requests">
            <Card>
              <CardHeader>
                <CardTitle>Rental Requests</CardTitle>
                <CardDescription>Track the status of your rental requests</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border overflow-x-auto">
                  <table className="min-w-full divide-y divide-border">
                    <thead className="bg-muted">
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Property</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Owner</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Proposed Price</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Duration</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Date</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Status</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Message</th>
                      </tr>
                    </thead>
                    <tbody className="bg-background divide-y divide-border">
                      {rentalRequests.map((req) => (
                        <tr key={req.id}>
                          <td className="px-4 py-2 font-medium">{req.propertyName}</td>
                          <td className="px-4 py-2">{req.ownerName}</td>
                          <td className="px-4 py-2">PKR {req.proposedPrice.toLocaleString()}</td>
                          <td className="px-4 py-2">{req.duration} months</td>
                          <td className="px-4 py-2">{new Date(req.requestDate).toLocaleDateString()}</td>
                          <td className="px-4 py-2">
                            <Badge className={
                              req.status === "approved" ? "bg-emerald-600" :
                              req.status === "rejected" ? "bg-red-600" :
                              "bg-amber-600"
                            }>
                              {req.status.charAt(0).toUpperCase() + req.status.slice(1)}
                            </Badge>
                          </td>
                          <td className="px-4 py-2 text-sm text-muted-foreground">{req.message}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
