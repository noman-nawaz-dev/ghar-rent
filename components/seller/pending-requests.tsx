"use client"

import { useState, useEffect } from "react"
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Check, X, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/hooks/useAuth"
import { RentalRequestService, RentalRequestWithDetails } from "@/lib/database/rental-requests"

type RequestStatus = "pending" | "approved" | "rejected"

interface RentalRequest {
  id: string
  propertyName: string
  renterName: string
  renterInitials: string
  proposedPrice: number
  duration: number
  requestDate: string
  status: RequestStatus
  message?: string
  buyerEmail?: string
  buyerPhone?: string | null
}

export function PendingRequestsTable() {
  const [requests, setRequests] = useState<RentalRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedRequest, setSelectedRequest] = useState<RentalRequest | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [actionType, setActionType] = useState<"approve" | "reject" | null>(null)
  const { toast } = useToast()
  const { currentUser } = useAuth()

  useEffect(() => {
    const fetchRentalRequests = async () => {
      if (!currentUser?.id) return
      
      setLoading(true)
      try {
        const { data, error } = await RentalRequestService.getRentalRequestsBySellerId(currentUser.id)
        
        if (error) {
          toast({
            title: "Error",
            description: "Failed to fetch rental requests",
            variant: "destructive"
          })
          return
        }

        if (data) {
          const transformedRequests: RentalRequest[] = data.map((request: RentalRequestWithDetails) => ({
            id: request.id,
            propertyName: request.property_title,
            renterName: request.buyer_name,
            renterInitials: request.buyer_name.split(' ').map(n => n[0]).join('').toUpperCase(),
            proposedPrice: request.proposed_price,
            duration: request.duration,
            requestDate: request.created_at,
            status: request.status as RequestStatus,
            message: request.message || undefined,
            buyerEmail: request.buyer_email,
            buyerPhone: request.buyer_phone
          }))
          
          setRequests(transformedRequests)
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to fetch rental requests",
          variant: "destructive"
        })
      } finally {
        setLoading(false)
      }
    }

    fetchRentalRequests()
  }, [currentUser?.id, toast])
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }
  
  const handleAction = (request: RentalRequest, action: "approve" | "reject") => {
    setSelectedRequest(request)
    setActionType(action)
    setDialogOpen(true)
  }
  
  const confirmAction = async () => {
    if (!selectedRequest || !actionType) return
    
    try {
      const status = actionType === "approve" ? "approved" : "rejected"
      const { error } = await RentalRequestService.updateRentalRequestStatus(selectedRequest.id, status)
      
      if (error) {
        toast({
          title: "Error",
          description: "Failed to update request status",
          variant: "destructive"
        })
        return
      }
      
      // Update the request status locally
      const updatedRequests = requests.map(req => {
        if (req.id === selectedRequest.id) {
          return { ...req, status: status as RequestStatus }
        }
        return req
      })
      
      setRequests(updatedRequests)
      setDialogOpen(false)
      
      // Show toast notification
      toast({
        title: actionType === "approve" ? "Request Approved" : "Request Rejected",
        description: `You have ${actionType === "approve" ? "approved" : "rejected"} the rental request from ${selectedRequest.renterName}.`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update request status",
        variant: "destructive"
      })
    }
  }
  
  const formatPrice = (price: number) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        <span className="ml-2 text-muted-foreground">Loading rental requests...</span>
      </div>
    )
  }

  if (requests.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No rental requests found.</p>
      </div>
    )
  }

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Renter</TableHead>
              <TableHead>Property</TableHead>
              <TableHead>Proposed Price</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {requests.map((request) => (
              <TableRow key={request.id}>
                <TableCell>
                  <div className="flex items-center space-x-3">
                    <Avatar>
                      <AvatarFallback>{request.renterInitials}</AvatarFallback>
                    </Avatar>
                    <span className="font-medium">{request.renterName}</span>
                  </div>
                </TableCell>
                <TableCell className="max-w-[200px] truncate">{request.propertyName}</TableCell>
                <TableCell className="font-medium">PKR {formatPrice(request.proposedPrice)}</TableCell>
                <TableCell>{request.duration} months</TableCell>
                <TableCell>{formatDate(request.requestDate)}</TableCell>
                <TableCell>
                  <Badge
                    className={
                      request.status === "approved" ? "bg-emerald-600" : 
                      request.status === "rejected" ? "bg-red-600" : 
                      "bg-amber-600"
                    }
                  >
                    {request.status === "approved" ? "Approved" :
                     request.status === "rejected" ? "Rejected" : 
                     "Pending"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end space-x-1">
                    {request.status === "pending" && (
                      <>
                        <Button 
                          variant="outline" 
                          size="icon" 
                          className="h-8 w-8 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-950"
                          onClick={() => handleAction(request, "approve")}
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="icon" 
                          className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950"
                          onClick={() => handleAction(request, "reject")}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => {
                        setSelectedRequest(request)
                        setDialogOpen(true)
                        setActionType(null)
                      }}
                    >
                      View
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      
      {/* Request Details Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {actionType === "approve" 
                ? "Approve Rental Request" 
                : actionType === "reject" 
                  ? "Reject Rental Request" 
                  : "Rental Request Details"}
            </DialogTitle>
            <DialogDescription>
              {actionType === "approve" 
                ? "Are you sure you want to approve this rental request?" 
                : actionType === "reject" 
                  ? "Are you sure you want to reject this rental request?" 
                  : `Request from ${selectedRequest?.renterName}`}
            </DialogDescription>
          </DialogHeader>
          
          {selectedRequest && (
            <div className="space-y-4">
              <div>
                <h4 className="font-medium">Property</h4>
                <p className="text-muted-foreground">{selectedRequest.propertyName}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium">Proposed Price</h4>
                  <p className="text-emerald-600 font-semibold">
                    PKR {formatPrice(selectedRequest.proposedPrice)}/month
                  </p>
                </div>
                <div>
                  <h4 className="font-medium">Duration</h4>
                  <p className="text-muted-foreground">{selectedRequest.duration} months</p>
                </div>
              </div>
              
              {selectedRequest.message && (
                <div>
                  <h4 className="font-medium">Message from Renter</h4>
                  <p className="text-muted-foreground italic">{selectedRequest.message}</p>
                </div>
              )}
              
              <div>
                <h4 className="font-medium">Contact Information</h4>
                {selectedRequest.buyerEmail && (
                  <p className="text-muted-foreground">Email: {selectedRequest.buyerEmail}</p>
                )}
                {selectedRequest.buyerPhone && (
                  <p className="text-muted-foreground">Phone: {selectedRequest.buyerPhone}</p>
                )}
              </div>
            </div>
          )}
          
          <DialogFooter>
            {actionType ? (
              <>
                <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
                <Button 
                  onClick={confirmAction}
                  className={actionType === "approve" ? "bg-emerald-600 hover:bg-emerald-700" : "bg-red-600 hover:bg-red-700"}
                >
                  {actionType === "approve" ? "Approve" : "Reject"} Request
                </Button>
              </>
            ) : (
              <Button onClick={() => setDialogOpen(false)}>Close</Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}