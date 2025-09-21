"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
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
import { Edit, MoreVertical, Trash2, Eye } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Property } from "@/lib/data/properties"

interface ListedPropertiesTableProps {
  properties: Property[];
}

export function ListedPropertiesTable({ properties }: ListedPropertiesTableProps) {
  const [listedProperties, setListedProperties] = useState<Property[]>(properties)
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
  
  const handleDeleteProperty = (id: string) => {
    setPropertyToDelete(id)
  }
  
  const confirmDelete = () => {
    if (propertyToDelete) {
      const updatedProperties = listedProperties.filter(
        property => property.id !== propertyToDelete
      )
      
      setListedProperties(updatedProperties)
      setPropertyToDelete(null)
      
      toast({
        title: "Property Deleted",
        description: "The property has been successfully removed from your listings.",
      })
    }
  }
  
  const cancelDelete = () => {
    setPropertyToDelete(null)
  }

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Property</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Area</TableHead>
              <TableHead>Listed Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {listedProperties.map((property) => (
              <TableRow key={property.id}>
                <TableCell className="font-medium max-w-[200px] truncate">
                  <div className="flex items-center">
                    <div 
                      className="w-10 h-10 rounded mr-3 bg-cover bg-center" 
                      style={{ backgroundImage: `url(${property.images[0]})` }}
                    />
                    <span>{property.title}</span>
                  </div>
                </TableCell>
                <TableCell>PKR {formatPrice(property.price)}</TableCell>
                <TableCell>{property.area} {property.areaUnit}</TableCell>
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
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Link href={`/property/${property.id}`}>
                          <Eye className="mr-2 h-4 w-4" />
                          <span>View Property</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href={`/seller/edit-property/${property.id}`}>
                          <Edit className="mr-2 h-4 w-4" />
                          <span>Edit Property</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="text-red-600 focus:text-red-600"
                        onClick={() => handleDeleteProperty(property.id)}
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
              This action cannot be undone. This will permanently remove the property from your listings.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={cancelDelete}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}