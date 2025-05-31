"use client"

import { useState } from "react"
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Eye, MoreVertical, CheckCircle, ShieldAlert, Trash2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { propertyData } from "@/lib/data/properties"

export function AdminPropertiesTable() {
  const [properties, setProperties] = useState(propertyData)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [propertyToDelete, setPropertyToDelete] = useState<string | null>(null)
  const { toast } = useToast()
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }
  
  const formatPrice = (price: number) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
  
  const handleStatusChange = (propertyId: string, newStatus: "Available" | "Pending" | "Rented") => {
    const updatedProperties = properties.map(property => {
      if (property.id === propertyId) {
        return { ...property, status: newStatus }
      }
      return property
    })
    
    setProperties(updatedProperties)
    
    toast({
      title: "Property Status Updated",
      description: `The property status has been updated to ${newStatus}.`,
    })
  }
  
  const handleDeleteProperty = (id: string) => {
    setPropertyToDelete(id)
  }
  
  const confirmDelete = () => {
    if (propertyToDelete) {
      const updatedProperties = properties.filter(
        property => property.id !== propertyToDelete
      )
      
      setProperties(updatedProperties)
      setPropertyToDelete(null)
      
      toast({
        title: "Property Deleted",
        description: "The property has been successfully removed from the platform.",
      })
    }
  }
  
  const filteredProperties = properties
    .filter(property => 
      (property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
       property.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
       property.city.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (statusFilter === "all" || property.status === statusFilter)
    )

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center flex-wrap gap-4">
        <h2 className="text-xl font-poppins font-semibold">Property Management</h2>
        <div className="flex gap-3 flex-wrap">
          <Select 
            defaultValue="all" 
            onValueChange={setStatusFilter}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Properties</SelectItem>
              <SelectItem value="Available">Available</SelectItem>
              <SelectItem value="Pending">Pending</SelectItem>
              <SelectItem value="Rented">Rented</SelectItem>
            </SelectContent>
          </Select>
          
          <Input
            placeholder="Search properties..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-xs"
          />
        </div>
      </div>
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Property</TableHead>
              <TableHead>Owner</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>City</TableHead>
              <TableHead>Listed Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProperties.map((property) => (
              <TableRow key={property.id}>
                <TableCell className="font-medium">
                  <div className="flex items-center">
                    <div 
                      className="w-10 h-10 rounded mr-3 bg-cover bg-center" 
                      style={{ backgroundImage: `url(${property.images[0]})` }}
                    />
                    <span className="max-w-[150px] truncate">{property.title}</span>
                  </div>
                </TableCell>
                <TableCell>{property.sellerName}</TableCell>
                <TableCell>PKR {formatPrice(property.price)}</TableCell>
                <TableCell>{property.city}</TableCell>
                <TableCell>{formatDate(property.listedDate)}</TableCell>
                <TableCell>
                  <Badge
                    className={
                      property.status === 'Available' ? 'bg-emerald-600' : 
                      property.status === 'Pending' ? 'bg-amber-600' : 'bg-blue-600'
                    }
                  >
                    {property.status}
                  </Badge>
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
                      <DropdownMenuItem onClick={() => toast({ title: "View Property", description: "Viewing property details" })}>
                        <Eye className="mr-2 h-4 w-4" />
                        <span>View Property</span>
                      </DropdownMenuItem>
                      
                      <DropdownMenuSeparator />
                      
                      {property.status !== "Available" && (
                        <DropdownMenuItem onClick={() => handleStatusChange(property.id, "Available")}>
                          <CheckCircle className="mr-2 h-4 w-4 text-emerald-600" />
                          <span className="text-emerald-600">Set as Available</span>
                        </DropdownMenuItem>
                      )}
                      
                      {property.status !== "Pending" && (
                        <DropdownMenuItem onClick={() => handleStatusChange(property.id, "Pending")}>
                          <ShieldAlert className="mr-2 h-4 w-4 text-amber-600" />
                          <span className="text-amber-600">Set as Pending</span>
                        </DropdownMenuItem>
                      )}
                      
                      {property.status !== "Rented" && (
                        <DropdownMenuItem onClick={() => handleStatusChange(property.id, "Rented")}>
                          <CheckCircle className="mr-2 h-4 w-4 text-blue-600" />
                          <span className="text-blue-600">Set as Rented</span>
                        </DropdownMenuItem>
                      )}
                      
                      <DropdownMenuSeparator />
                      
                      <DropdownMenuItem 
                        onClick={() => handleDeleteProperty(property.id)}
                        className="text-red-600"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        <span>Delete Property</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!propertyToDelete} onOpenChange={() => setPropertyToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently remove the property from the platform.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}