"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, ChevronRight, Bed, Home, Phone, MapPin, ArrowUpRight, ChefHat, Trees } from "lucide-react"
import { cn } from "@/lib/utils"
import type { PropertyRow } from "@/lib/database/properties"
interface PropertyCardProps {
  property: PropertyRow;
}

export default function PropertyCard({ property }: PropertyCardProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isHovered, setIsHovered] = useState(false)
  
  const nextImage = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setCurrentImageIndex((prevIndex) => 
      prevIndex + 1 >= property.images.length ? 0 : prevIndex + 1
    )
  }
  
  const prevImage = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setCurrentImageIndex((prevIndex) => 
      prevIndex - 1 < 0 ? property.images.length - 1 : prevIndex - 1
    )
  }
  
  const formatPrice = (price: number) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  console.log(property)
  return (
    <Link href={`/property/${property.id}`}>
      <Card 
        className={cn(
          "group overflow-hidden border border-border transition-all duration-300 bg-white dark:bg-zinc-900 shadow-lg hover:shadow-2xl hover:-translate-y-1 scale-[1.01]",
          isHovered ? "border-emerald-200 dark:border-emerald-900" : ""
        )}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Property Image */}
        <div className="relative h-52 w-full overflow-hidden">
          <div 
            className="absolute inset-0 bg-cover bg-center transition-transform duration-500"
            style={{ 
              backgroundImage: `url(${property.images[currentImageIndex]})`,
              transform: isHovered ? 'scale(1.05)' : 'scale(1)'
            }}
          />
          
          {/* Image Navigation Buttons */}
          {property.images.length > 1 && (
            <>
              <button 
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white rounded-full p-1 transition-opacity opacity-0 group-hover:opacity-100"
                onClick={prevImage}
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button 
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white rounded-full p-1 transition-opacity opacity-0 group-hover:opacity-100"
                onClick={nextImage}
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </>
          )}
          
          {/* Property Status */}
          <div className="absolute top-3 left-3">
            <Badge 
              className={cn(
                property.status === 'Available' ? 'bg-emerald-600' : 
                property.status === 'Pending' ? 'bg-amber-600' : 'bg-blue-600'
              )}
            >
              {property.status}
            </Badge>
          </div>
          
          {/* Property Type */}
          <div className="absolute top-3 right-3">
            <Badge variant="outline" className="bg-black/60 text-white border-none">
              {property.property_type}
            </Badge>
          </div>
          
          {/* Image Count */}
          {property.images.length > 1 && (
            <div className="absolute bottom-3 right-3">
              <Badge variant="outline" className="bg-black/60 text-white border-none">
                {currentImageIndex + 1}/{property.images.length}
              </Badge>
            </div>
          )}
        </div>
        
        <CardContent className="p-4">
          <h3 className="font-semibold text-lg mb-1 line-clamp-1">{property.title}</h3>
          <div className="flex items-center text-muted-foreground mb-3">
            <MapPin className="h-3.5 w-3.5 mr-1" />
            <span className="text-sm">{property.address}, {property.city}</span>
          </div>
          <p className="text-muted-foreground mb-4 text-sm line-clamp-2">{property.description}</p>
          
          <div className="flex justify-between items-center">
            <div className="flex space-x-4">
              <div className="flex items-center">
                <Bed className="h-4 w-4 mr-1 text-muted-foreground" />
                <span className="text-sm">{property.bedrooms}</span>
              </div>
              <div className="flex items-center">
                <Home className="h-4 w-4 mr-1 text-muted-foreground" />
                <span className="text-sm">{property.floors}F</span>
              </div>
              <div className="flex items-center">
                <ChefHat className="h-4 w-4 mr-1 text-muted-foreground" />
                <span className="text-sm">{property.kitchens}</span>
              </div>
              {property.has_lawn && (
                <div className="flex items-center">
                  <Trees className="h-4 w-4 mr-1 text-emerald-600" />
                </div>
              )}
            </div>
          </div>
          
          <div className="mt-3 text-sm">
            <span className="font-medium">{property.area} {property.area_unit}</span>
          </div>
        </CardContent>
        
        <CardFooter className="p-4 pt-0 flex items-center justify-between mt-4">
          <div>
            <p className="font-semibold text-emerald-600">
              PKR {formatPrice(property.price)}<span className="text-muted-foreground font-normal text-sm">/month</span>
            </p>
            <div className="flex items-center text-muted-foreground text-xs mt-1">
              <Phone className="h-3 w-3 mr-1" />
              {property.seller_phone}
            </div>
          </div>
          <Button 
            size="sm"
            className="bg-emerald-600 hover:bg-emerald-700"
          >
            View Details <ArrowUpRight className="ml-1 h-3 w-3" />
          </Button>
        </CardFooter>
      </Card>
    </Link>
  )
}