"use client"

import { useState } from "react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { CheckCircle, MoreVertical, UserX, UserCheck, ShieldAlert } from "lucide-react"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"

interface User {
  id: string;
  name: string;
  email: string;
  initials: string;
  role: "buyer" | "seller" | "admin";
  status: "active" | "inactive" | "suspended";
  joinDate: string;
  properties?: number;
}

// Mock user data
const mockUsers: User[] = [
  {
    id: "user-001",
    name: "Ahmed Khan",
    email: "ahmed.khan@example.com",
    initials: "AK",
    role: "buyer",
    status: "active",
    joinDate: "2023-01-15",
  },
  {
    id: "user-002",
    name: "Fatima Aziz",
    email: "fatima.aziz@example.com",
    initials: "FA",
    role: "buyer",
    status: "active",
    joinDate: "2023-02-21",
  },
  {
    id: "user-003",
    name: "Usman Malik",
    email: "usman.malik@example.com",
    initials: "UM",
    role: "seller",
    status: "active",
    joinDate: "2023-03-10",
    properties: 5,
  },
  {
    id: "user-004",
    name: "Zainab Mahmood",
    email: "zainab.m@example.com",
    initials: "ZM",
    role: "seller",
    status: "inactive",
    joinDate: "2023-04-05",
    properties: 2,
  },
  {
    id: "user-005",
    name: "Bilal Hassan",
    email: "bilal.h@example.com",
    initials: "BH",
    role: "buyer",
    status: "suspended",
    joinDate: "2023-05-12",
  },
  {
    id: "user-006",
    name: "Saad Ahmed",
    email: "saad.ahmed@example.com",
    initials: "SA",
    role: "admin",
    status: "active",
    joinDate: "2022-11-15",
  },
]

export function AdminUsersTable() {
  const [users, setUsers] = useState<User[]>(mockUsers)
  const [searchTerm, setSearchTerm] = useState("")
  const { toast } = useToast()
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }
  
  const handleStatusChange = (userId: string, newStatus: "active" | "inactive" | "suspended") => {
    const updatedUsers = users.map(user => {
      if (user.id === userId) {
        return { ...user, status: newStatus }
      }
      return user
    })
    
    setUsers(updatedUsers)
    
    const user = users.find(u => u.id === userId)
    
    toast({
      title: "User Status Updated",
      description: `${user?.name}'s account is now ${newStatus}.`,
    })
  }
  
  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-poppins font-semibold">User Management</h2>
        <div className="w-1/3">
          <Input
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
        </div>
      </div>
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Join Date</TableHead>
              <TableHead>Properties</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  <div className="flex items-center space-x-3">
                    <Avatar>
                      <AvatarFallback>{user.initials}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{user.name}</div>
                      <div className="text-sm text-muted-foreground">{user.email}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={
                      user.role === "admin" 
                        ? "bg-purple-100 text-purple-800 dark:bg-purple-950/50 dark:text-purple-300 border-purple-200 dark:border-purple-900" 
                        : user.role === "seller" 
                          ? "bg-blue-100 text-blue-800 dark:bg-blue-950/50 dark:text-blue-300 border-blue-200 dark:border-blue-900"
                          : "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300 border-emerald-200 dark:border-emerald-900"
                    }
                  >
                    {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={
                      user.status === "active" 
                        ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300 border-emerald-200 dark:border-emerald-900" 
                        : user.status === "inactive" 
                          ? "bg-amber-100 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300 border-amber-200 dark:border-amber-900"
                          : "bg-red-100 text-red-800 dark:bg-red-950/50 dark:text-red-300 border-red-200 dark:border-red-900"
                    }
                  >
                    {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                  </Badge>
                </TableCell>
                <TableCell>{formatDate(user.joinDate)}</TableCell>
                <TableCell>
                  {user.role === "seller" ? (user.properties || 0) : "-"}
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => toast({ title: "View Profile", description: "Viewing user profile" })}>
                        <CheckCircle className="mr-2 h-4 w-4" />
                        <span>View Profile</span>
                      </DropdownMenuItem>
                      
                      <DropdownMenuSeparator />
                      
                      {user.status !== "active" && (
                        <DropdownMenuItem onClick={() => handleStatusChange(user.id, "active")}>
                          <UserCheck className="mr-2 h-4 w-4 text-emerald-600" />
                          <span className="text-emerald-600">Set as Active</span>
                        </DropdownMenuItem>
                      )}
                      
                      {user.status !== "inactive" && (
                        <DropdownMenuItem onClick={() => handleStatusChange(user.id, "inactive")}>
                          <UserX className="mr-2 h-4 w-4 text-amber-600" />
                          <span className="text-amber-600">Set as Inactive</span>
                        </DropdownMenuItem>
                      )}
                      
                      {user.status !== "suspended" && (
                        <DropdownMenuItem onClick={() => handleStatusChange(user.id, "suspended")}>
                          <ShieldAlert className="mr-2 h-4 w-4 text-red-600" />
                          <span className="text-red-600">Suspend User</span>
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}