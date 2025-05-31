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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Check, X } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

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
}

const mockRequests: RentalRequest[] = [
  {
    id: "req-001",
    propertyName: "Modern Family Home in Bahria Town",
    renterName: "Ahmed Khan",
    renterInitials: "AK",
    proposedPrice: 70000,
    duration: 12,
    requestDate: "2023-08-15",
    status: "pending",
    message: "I'm interested in renting this property for my family of 4. We're looking for a long-term arrangement and can move in by the end of the month."
  },
  {
    id: "req-002",
    propertyName: "Cozy 2-Bedroom in DHA",
    renterName: "Fatima Malik",
    renterInitials: "FM",
    proposedPrice: 42000,
    duration: 6,
    requestDate: "2023-08-14",
    status: "pending",
    message: "I would like to rent this property for 6 months. I'm a working professional and need a quiet place close to my office."
  },
  {
    id: "req-003",
    propertyName: "Luxury Apartment in Clifton",
    renterName: "Usman Sheikh",
    renterInitials: "US",
    proposedPrice: 115000,
    duration: 24,
    requestDate: "2023-08-12",
    status: "pending"
  },
  {
    id: "req-004",
    propertyName: "Spacious Villa in Gulberg",
    renterName: "Zara Ahmed",
    renterInitials: "ZA",
    proposedPrice: 140000,
    duration: 12,
    requestDate: "2023-08-10",
    status: "pending",
    message: "Looking for a family home in this area. We are a family of 6 with no pets."
  },
  {
    id: "req-005",
    propertyName: "Modern Apartment in Johar Town",
    renterName: "Bilal Hassan",
    renterInitials: "BH",
    proposedPrice: 55000,
    duration: 6,
    requestDate: "2023-08-08",
    status: "pending"
  }
]

export function PendingRequestsTable() {
  const [requests, setRequests] = useState<RentalRequest[]>(mockRequests)
  const [selectedRequest, setSelectedRequest] = useState<RentalRequest | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [actionType, setActionType] = useState<"approve" | "reject" | null>(null)
  const { toast } = useToast()
  
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
  
  const confirmAction = () => {
    if (!selectedRequest || !actionType) return
    
    // Update the request status
    const updatedRequests = requests.map(req => {
      if (req.id === selectedRequest.id) {
        return { ...req, status: actionType === "approve" ? "approved" : "rejected" as RequestStatus }
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
  }
  
  const formatPrice = (price: number) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
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
                <p className="text-muted-foreground">Email: {selectedRequest.renterName.toLowerCase().replace(' ', '.') + '@example.com'}</p>
                <p className="text-muted-foreground">Phone: +92 300 1234567</p>
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