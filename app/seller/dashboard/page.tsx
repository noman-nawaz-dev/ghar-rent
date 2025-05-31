"use client"

import { useState } from "react"
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
  CalendarDays
} from "lucide-react"
import { propertyData } from "@/lib/data/properties"
import { PendingRequestsTable } from "@/components/seller/pending-requests"
import { ListedPropertiesTable } from "@/components/seller/listed-properties"

export default function SellerDashboard() {
  const [activeTab, setActiveTab] = useState("overview")
  
  const statistics = [
    {
      title: "Properties Listed",
      value: 6,
      icon: <Building className="h-5 w-5 text-emerald-600" />,
      change: "+2 this month",
      trend: "up"
    },
    {
      title: "Active Rentals",
      value: 4,
      icon: <Home className="h-5 w-5 text-emerald-600" />,
      change: "+1 this month",
      trend: "up"
    },
    {
      title: "Pending Requests",
      value: 3,
      icon: <Clock className="h-5 w-5 text-amber-600" />,
      change: "2 new today",
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
                  <div className="space-y-6">
                    {[1, 2, 3].map((_, index) => (
                      <div key={index} className="flex items-start space-x-4">
                        <div className="bg-muted rounded-full p-2 mt-1">
                          {index === 0 ? (
                            <CheckCircle className="h-4 w-4 text-emerald-600" />
                          ) : index === 1 ? (
                            <Users className="h-4 w-4 text-blue-600" />
                          ) : (
                            <Building className="h-4 w-4 text-emerald-600" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium">
                            {index === 0 
                              ? "Rental request approved" 
                              : index === 1 
                                ? "New rental request received" 
                                : "New property listed"}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {index === 0 
                              ? "You approved a rental request for Modern Family Home" 
                              : index === 1 
                                ? "Ahmed Khan requested to rent Cozy 2-Bedroom in DHA" 
                                : "You listed Spacious Villa in Gulberg"}
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
                  {[1, 2, 3].map((_, index) => (
                    <div key={index} className="flex items-center justify-between py-3 border-b last:border-b-0">
                      <div className="flex items-center space-x-4">
                        <Avatar>
                          <AvatarFallback>{["AK", "FM", "US"][index]}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{["Ahmed Khan", "Fatima Malik", "Usman Sheikh"][index]}</p>
                          <p className="text-sm text-muted-foreground">
                            Requesting: {["Modern Family Home", "Cozy 2-Bedroom", "Luxury Apartment"][index]}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="text-right hidden md:block">
                          <p className="font-medium text-emerald-600">
                            PKR {[70000, 42000, 115000][index].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {[12, 6, 24][index]} months
                          </p>
                        </div>
                        <div className="flex space-x-1">
                          <Button variant="outline" size="icon" className="h-8 w-8 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-950">
                            <CheckCircle className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="icon" className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950">
                            <XCircle className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
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
                <ListedPropertiesTable properties={propertyData} />
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