import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import PropertyGallery from "@/components/property/property-gallery"
import PropertyFeatures from "@/components/property/property-features"
import { ArrowLeft, MapPin, Calendar, Phone, Mail } from "lucide-react"
import { propertyData } from "@/lib/data/properties"
import RentRequestForm from "@/components/property/rent-request-form"
import PageNotFound from "@/components/ui/page-not-found"

export default function PropertyDetailPage({ params }: { params: { id: string } }) {
  const property = propertyData.find(p => p.id === params.id)
  
  if (!property) {
    return <PageNotFound message="Property not found" />
  }
  
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
            </div>
            
            <Separator />
            
            {/* Property Features */}
            <PropertyFeatures 
              bedrooms={property.bedrooms}
              bathrooms={property.bathrooms}
              area={property.area}
              areaUnit={property.areaUnit}
              propertyType={property.propertyType}
            />
            
            <Separator />
            
            {/* Location Information */}
            <div>
              <h2 className="font-poppins text-xl font-semibold mb-4">Location</h2>
              <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                <p className="text-muted-foreground">Interactive map would be displayed here</p>
              </div>
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
                      {property.sellerName.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium">{property.sellerName}</p>
                    <p className="text-sm text-muted-foreground">Property Owner</p>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center">
                    <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>{property.sellerPhone}</span>
                  </div>
                  <div className="flex items-center">
                    <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>{property.sellerName.toLowerCase().replace(' ', '.')}@example.com</span>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>Listed on {formatDate(property.listedDate)}</span>
                  </div>
                </div>
              </div>
              
              <Separator className="my-4" />
              
              {/* Request to Rent Form */}
              <RentRequestForm propertyId={property.id} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export async function generateStaticParams() {
  // Import or access your property data here
  // If propertyData is not available here, import it from "@/lib/data/properties"
  return propertyData.map((property) => ({
    id: property.id,
  }));
}