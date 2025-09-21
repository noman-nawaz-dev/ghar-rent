"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Building, 
  Users, 
  DollarSign,
  BarChart4,
  TrendingUp,
  ListFilter
} from "lucide-react"
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts"
import { AdminUsersTable } from "@/components/admin/users-table"
import { AdminPropertiesTable } from "@/components/admin/properties-table"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Mock data for dashboard
const propertyStats = [
  { month: 'Jan', properties: 10, rented: 7, revenue: 525000 },
  { month: 'Feb', properties: 12, rented: 8, revenue: 620000 },
  { month: 'Mar', properties: 15, rented: 11, revenue: 780000 },
  { month: 'Apr', properties: 18, rented: 14, revenue: 950000 },
  { month: 'May', properties: 20, rented: 15, revenue: 1125000 },
  { month: 'Jun', properties: 22, rented: 17, revenue: 1275000 },
]

const userDistribution = [
  { name: 'Sellers', value: 35 },
  { name: 'Buyers', value: 65 },
]

const COLORS = ['#10B981', '#3B82F6', '#F59E0B', '#EF4444']

const cityDistribution = [
  { name: 'Lahore', value: 40 },
  { name: 'Karachi', value: 30 },
  { name: 'Islamabad', value: 15 },
  { name: 'Others', value: 15 },
]

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState("overview")
  const [timeFilter, setTimeFilter] = useState("6months")
  
  const statistics = [
    {
      title: "Total Properties",
      value: "245",
      change: "+18% from last month",
      trend: "up",
      icon: <Building className="h-5 w-5 text-emerald-600" />
    },
    {
      title: "Total Users",
      value: "1,234",
      change: "+12% from last month",
      trend: "up",
      icon: <Users className="h-5 w-5 text-blue-600" />
    },
    {
      title: "Revenue Generated",
      value: "PKR 5.2M",
      change: "+8% from last month",
      trend: "up",
      icon: <DollarSign className="h-5 w-5 text-emerald-600" />
    },
    {
      title: "Conversion Rate",
      value: "68%",
      change: "+5% from last month",
      trend: "up",
      icon: <TrendingUp className="h-5 w-5 text-emerald-600" />
    },
  ]

  return (
    <div className="pt-28 pb-16">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="font-poppins text-2xl md:text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-muted-foreground">Monitor platform performance and user statistics</p>
          </div>
          <div className="flex items-center space-x-3 mt-4 md:mt-0">
            <Select defaultValue={timeFilter} onValueChange={setTimeFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select time range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="30days">Last 30 Days</SelectItem>
                <SelectItem value="6months">Last 6 Months</SelectItem>
                <SelectItem value="1year">Last Year</SelectItem>
                <SelectItem value="alltime">All Time</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {/* Dashboard Content */}
        <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-8">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="properties">Properties</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview">
            {/* Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {statistics.map((stat, index) => (
                <Card key={index}>
                  <CardContent className="p-6">
                    <div className="flex justify-between">
                      <div className="bg-muted rounded-full p-2">
                        {stat.icon}
                      </div>
                      <span className={`text-xs ${
                        stat.trend === "up" ? "text-emerald-600" : "text-red-600"
                      }`}>
                        {stat.change}
                      </span>
                    </div>
                    <h3 className="text-2xl font-bold mt-4">{stat.value}</h3>
                    <p className="text-muted-foreground text-sm">{stat.title}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            {/* Charts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {/* Property Listings & Rentals */}
              <Card>
                <CardHeader>
                  <CardTitle>Property Activity</CardTitle>
                  <CardDescription>Number of properties listed vs. rented</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={propertyStats}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="properties" name="Listed" fill="hsl(var(--chart-2))" />
                        <Bar dataKey="rented" name="Rented" fill="hsl(var(--chart-1))" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              {/* Revenue Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>Revenue Trends</CardTitle>
                  <CardDescription>Platform revenue over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={propertyStats}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip 
                          formatter={(value: number) => [`PKR ${value.toLocaleString()}`, 'Revenue']}
                        />
                        <Legend />
                        <Line
                          type="monotone"
                          dataKey="revenue"
                          stroke="hsl(var(--chart-1))"
                          activeDot={{ r: 8 }}
                          strokeWidth={2}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* User Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle>User Distribution</CardTitle>
                  <CardDescription>Breakdown of user types</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={userDistribution}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {userDistribution.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              {/* City Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle>Property Distribution by City</CardTitle>
                  <CardDescription>Geographic breakdown of property listings</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={cityDistribution}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {cityDistribution.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="properties">
            <AdminPropertiesTable />
          </TabsContent>
          
          <TabsContent value="users">
            <AdminUsersTable />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}