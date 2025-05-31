import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import PropertyCard from "@/components/property/property-card"
import { Search, MapPin, ChevronLeft, ChevronRight } from "lucide-react"
import { propertyData } from "@/lib/data/properties"

export default function HomePage() {
  return (
    <div className="pt-28 pb-16">
      <div className="container mx-auto px-4">
        {/* Hero Section */}
        <div className="mb-12 text-center">
          <h1 className="font-poppins text-3xl md:text-4xl font-bold mb-4">
            Find Your Perfect Rental Home
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Browse through our extensive collection of rental properties across Pakistan
          </p>
        </div>
        
        {/* Search & Filter */}
        <div className="bg-card border rounded-xl p-6 mb-12 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            <div className="relative">
              <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input 
                type="text" 
                placeholder="Location" 
                className="pl-10" 
              />
            </div>
            <div>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Property Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="house">House</SelectItem>
                  <SelectItem value="apartment">Apartment</SelectItem>
                  <SelectItem value="villa">Villa</SelectItem>
                  <SelectItem value="portion">Portion</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Size (Marla)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5 Marla</SelectItem>
                  <SelectItem value="10">10 Marla</SelectItem>
                  <SelectItem value="15">15 Marla</SelectItem>
                  <SelectItem value="20">20 Marla</SelectItem>
                  <SelectItem value="1k">1 Kanal</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="col-span-1 md:col-span-2">
              <div className="flex flex-col">
                <span className="text-sm text-muted-foreground mb-2">Price Range (PKR)</span>
                <Slider 
                  defaultValue={[20000, 80000]} 
                  max={200000} 
                  step={5000}
                  className="mb-1" 
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>PKR 20,000</span>
                  <span>PKR 200,000</span>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-4 flex justify-center">
            <Button className="bg-emerald-600 hover:bg-emerald-700 text-white w-full md:w-auto">
              <Search className="mr-2 h-4 w-4" /> Search Properties
            </Button>
          </div>
        </div>
        
        {/* Properties Grid */}
        <div>
          <div className="flex justify-between items-center mb-8">
            <h2 className="font-poppins text-2xl font-bold">Available Properties</h2>
            <div className="flex gap-2">
              <Select defaultValue="newest">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="area-high">Area: Largest First</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {propertyData.map((property) => (
              <PropertyCard 
                key={property.id}
                property={property}
              />
            ))}
          </div>
          
          {/* Pagination */}
          <div className="mt-12 flex justify-center">
            <nav className="flex items-center gap-1">
              <Button variant="outline" size="icon" disabled>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" className="bg-primary text-primary-foreground">1</Button>
              <Button variant="outline" size="sm">2</Button>
              <Button variant="outline" size="sm">3</Button>
              <Button variant="outline" size="sm">4</Button>
              <Button variant="outline" size="sm">5</Button>
              <Button variant="outline" size="icon">
                <ChevronRight className="h-4 w-4" />
              </Button>
            </nav>
          </div>
        </div>
      </div>
    </div>
  )
}