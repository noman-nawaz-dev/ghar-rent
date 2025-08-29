"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import PropertyGallery from "@/components/property/property-gallery"
import PropertyFeatures from "@/components/property/property-features"
import { ArrowLeft, MapPin, Calendar, Phone, Mail, Edit, Trash2, X, Check } from "lucide-react"
import { PropertyService, PropertyRow } from "@/lib/database/properties"
import RentRequestForm from "@/components/property/rent-request-form"
import PageNotFound from "@/components/ui/page-not-found"
import { useAuth } from "@/hooks/useAuth"
import { RentalRequestRow, RentalRequestService } from "@/lib/database/rental-requests"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast";
import { PostgrestError } from "@supabase/supabase-js";
import { PropertyMap } from "@/components/property/property-map";

export default function PropertyDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [property, setProperty] = useState<PropertyRow | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [fetchingRentalRequest, setFetchingRentalRequest] = useState<boolean>(false);
  const [existingRentalRequest, setExistingRentalRequest] = useState<RentalRequestRow | null>(null);
  const [isEditingRequest, setIsEditingRequest] = useState(false);
  const [editFormData, setEditFormData] = useState({
    proposed_price: 0,
    message: "",
    duration: 0,
  });
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const { currentUser } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    async function fetchProperty() {
      setLoading(true);
      const { data, error } = await PropertyService.getPropertyById(id);
      if (error || !data) {
        setNotFound(true);
      } else {
        setProperty(data);
      }
      setLoading(false);
    }

    async function fetchRentalRequest() {
      if (!currentUser) return;
      setFetchingRentalRequest(true);
      const { data } = await RentalRequestService.getRentalRequestByUserAndProperty(currentUser.id, id);
      if (data) {
        setExistingRentalRequest(data);
        setEditFormData({
          proposed_price: data.proposed_price,
          message: data.message || "",
          duration: data.duration,
        });
      }
      setFetchingRentalRequest(false);
    }

    if (id) fetchProperty();
    if (currentUser && id) fetchRentalRequest();
  }, [id, currentUser]);

  const formatPrice = (price: number) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const handleEditRequest = () => {
    setIsEditingRequest(true);
  }

  const handleCancelEdit = () => {
    setIsEditingRequest(false);
    if (existingRentalRequest) {
      setEditFormData({
        proposed_price: existingRentalRequest.proposed_price,
        message: existingRentalRequest.message || "",
        duration: existingRentalRequest.duration,
      });
    }
  }

  const handleUpdateRequest = async () => {
    if (!existingRentalRequest) return;
    setIsUpdating(true);
    const { error } = await RentalRequestService.updateRentalRequest(
      existingRentalRequest.id,
      editFormData
    );

    if (error) {
      console.error("Error updating rental request:", error);
      toast({
        title: "Error updating rental request",
        description: (error as PostgrestError | Error).message || "Something went wrong while updating rental request",
        variant: "destructive",
      });
    } else {
      setExistingRentalRequest({ ...existingRentalRequest, ...editFormData });
      setIsEditingRequest(false);
      toast({
        title: "Request updated",
        description: "Your rental request for this property is updated successfully",
      });
    }
    setIsUpdating(false);
  }

  const handleDeleteRequest = async () => {
    if (!existingRentalRequest) return;

    setIsDeleting(true);
    const { error } = await RentalRequestService.deleteRentalRequest(existingRentalRequest.id);

    if (error) {
      console.error("Error deleting rental request:", error);
      toast({
        title: "Error deleting rental request",
        description: (error as PostgrestError | Error).message || "Something went wrong while deleting rental request",
        variant: "destructive",
      });
    } else {
      setExistingRentalRequest(null);
      toast({
        title: "Request deleted",
        description: "Your rental request for this property is deleted successfully",
      });
    }
    setIsDeleting(false);
  }

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'approved':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  }

  if (loading) {
    return <div className="pt-28 pb-16 text-center">Loading...</div>;
  }

  if (notFound || !property) {
    return <PageNotFound message="Property not found" />;
  }

  return (
    <div className="pt-28 pb-16">
      <div className="container mx-auto px-4">
        {/* Back button and Property Title */}
        <div className="mb-6">
          <Link href="/home">
            <Button variant="ghost" size="sm" className="mb-3">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to listings
            </Button>
          </Link>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="font-poppins text-2xl md:text-3xl font-bold">{property.title}</h1>
              <div className="flex items-center text-muted-foreground mt-1">
                <MapPin className="h-4 w-4 mr-1" />
                <span>{property.address}, {property.city}</span>
              </div>
            </div>
            <div className="mt-3 md:mt-0 flex items-center">
              <Badge
                className={
                  property.status === 'Available' ? 'bg-emerald-600 mr-3' :
                    property.status === 'Pending' ? 'bg-amber-600 mr-3' : 'bg-blue-600 mr-3'
                }
              >
                {property.status}
              </Badge>
              <span className="text-xl font-bold text-emerald-600">
                PKR {formatPrice(property.price)}<span className="text-sm text-muted-foreground font-normal">/month</span>
              </span>
            </div>
          </div>
        </div>

        {/* Property Gallery */}
        <PropertyGallery images={property.images} />

        {/* Main Content */}
        <div className="mt-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Property Details */}
          <div className="col-span-2 space-y-8">
            {/* Property Description */}
            <div>
              <h2 className="font-poppins text-xl font-semibold mb-4">Property Details</h2>
              <p className="text-muted-foreground">{property.description}</p>
              {property.additional_info && (
                <div className="mt-4">
                  <h3 className="font-medium mb-2">Additional Information</h3>
                  <p className="text-muted-foreground">{property.additional_info}</p>
                </div>
              )}
            </div>

            <Separator />

            {/* Property Features */}
            <PropertyFeatures
              bedrooms={property.bedrooms}
              floors={property.floors}
              kitchens={property.kitchens}
              area={property.area}
              areaUnit={property.area_unit}
              propertyType={property.property_type}
              hasLawn={property.has_lawn}
            />

            <Separator />

            {/* Location Information */}
            <div>
              <h2 className="font-poppins text-xl font-semibold mb-4">Location</h2>
              {property.coordinates && property.coordinates.latitude && property.coordinates.longitude ? (
                <PropertyMap
                  coordinates={property.coordinates}
                  address={`${property.address}, ${property.city}`}
                  propertyTitle={property.title}
                  price={property.price}
                />
              ) : (
                <div className="aspect-video bg-muted rounded-lg flex items-center justify-center border border-border">
                  <div className="text-center">
                    <MapPin className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-muted-foreground">Location coordinates not available</p>
                  </div>
                </div>
              )}
              <p className="mt-3 text-muted-foreground">{property.address}, {property.city}</p>
            </div>
          </div>

          {/* Right Column - Contact and Request Form */}
          <div>
            <div className="bg-card border p-6 rounded-lg sticky top-28">
              {/* Seller Information */}
              <div className="mb-6">
                <h3 className="font-medium mb-3">Listed by</h3>
                <div className="flex items-center mb-3">
                  <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mr-3">
                    <span className="text-xl font-semibold text-muted-foreground">
                      {property.seller_name?.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium">{property.seller_name}</p>
                    <p className="text-sm text-muted-foreground">Property Owner</p>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center">
                    <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>{property.seller_phone}</span>
                  </div>
                  <div className="flex items-center">
                    <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>{property.seller_name?.toLowerCase().replace(' ', '.')}@example.com</span>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>Listed on {formatDate(property.listed_date)}</span>
                  </div>
                </div>
              </div>

              {currentUser?.role !== 'seller' && (
                <>
                  <Separator className="my-4" />

                  {fetchingRentalRequest ? (
                    <div className="text-center py-4">
                      <span className="text-muted-foreground">Loading request...</span>
                    </div>
                  ) : existingRentalRequest ? (
                    <Card>
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg">Your Rental Request</CardTitle>
                          <Badge className={getStatusColor(existingRentalRequest.status)}>
                            {existingRentalRequest.status}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {!isEditingRequest ? (
                          <>
                            <div>
                              <label className="text-sm font-medium text-muted-foreground">Proposed Price</label>
                              <p className="text-lg font-semibold text-emerald-600">
                                PKR {formatPrice(existingRentalRequest.proposed_price || 0)}/month
                              </p>
                            </div>

                            {existingRentalRequest.duration && (
                              <div>
                                <label className="text-sm font-medium text-muted-foreground">Duration</label>
                                <p>{existingRentalRequest.duration} months</p>
                              </div>
                            )}

                            {existingRentalRequest.message && (
                              <div>
                                <label className="text-sm font-medium text-muted-foreground">Message</label>
                                <p className="text-sm">{existingRentalRequest.message}</p>
                              </div>
                            )}

                            <div>
                              <label className="text-sm font-medium text-muted-foreground">Submitted</label>
                              <p className="text-sm">{formatDate(existingRentalRequest.created_at)}</p>
                            </div>

                            <div className="flex gap-2 pt-2">
                              <Button
                                onClick={handleEditRequest}
                                variant="outline"
                                size="sm"
                                className="flex-1"
                              >
                                <Edit className="h-4 w-4" />
                                Edit
                              </Button>
                              <Button
                                onClick={handleDeleteRequest}
                                variant="destructive"
                                size="sm"
                                disabled={isDeleting}
                                className="flex-1"
                              >
                                <Trash2 className="h-4 w-4" />
                                {isDeleting ? 'Deleting...' : 'Delete'}
                              </Button>
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="space-y-4">
                              <div>
                                <label className="text-sm font-medium">Proposed Price (PKR/month)</label>
                                <Input
                                  type="number"
                                  value={editFormData.proposed_price}
                                  onChange={(e) => setEditFormData(prev => ({
                                    ...prev,
                                    proposed_price: parseInt(e.target.value) || 0
                                  }))}
                                  placeholder="Enter your proposed price"
                                  className="mt-1"
                                />
                              </div>

                              <div>
                                <label className="text-sm font-medium">Duration</label>
                                <Input
                                  type="number"
                                  value={editFormData.duration}
                                  onChange={(e) => setEditFormData(prev => ({
                                    ...prev,
                                    duration: Number(e.target.value)
                                  }))}
                                  className="mt-1"
                                />
                              </div>

                              <div>
                                <label className="text-sm font-medium">Message</label>
                                <Textarea
                                  value={editFormData.message}
                                  onChange={(e) => setEditFormData(prev => ({
                                    ...prev,
                                    message: e.target.value
                                  }))}
                                  placeholder="Add a personal message..."
                                  className="mt-1 min-h-[80px]"
                                />
                              </div>
                            </div>

                            <div className="flex gap-2 pt-2">
                              <Button
                                onClick={handleUpdateRequest}
                                size="sm"
                                disabled={isUpdating}
                                className="flex-1"
                              >
                                <Check className="h-4 w-4 mr-2" />
                                {isUpdating ? 'Updating...' : 'Update'}
                              </Button>
                              <Button
                                onClick={handleCancelEdit}
                                variant="outline"
                                size="sm"
                                className="flex-1"
                              >
                                <X className="h-4 w-4 mr-2" />
                                Cancel
                              </Button>
                            </div>
                          </>
                        )}
                      </CardContent>
                    </Card>
                  ) : (
                    <RentRequestForm price={property.price} propertyId={property.id} setExistingRentalRequest={setExistingRentalRequest} />
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
