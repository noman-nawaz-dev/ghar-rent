"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import PropertyCard from "@/components/property/property-card"
import { Search, MapPin, ChevronLeft, ChevronRight } from "lucide-react"
import { PropertyService } from "@/lib/database/properties"
import type { PropertyRow } from "@/lib/database/properties"

export default function HomePage() {
  const [properties, setProperties] = useState<PropertyRow[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  // Filters & pagination state
  const [location, setLocation] = useState("")
  const [propertyType, setPropertyType] = useState("")
  const [areaUnit, setAreaUnit] = useState("")
  const [priceRange, setPriceRange] = useState("")
  const [sort, setSort] = useState("newest")
  const [page, setPage] = useState(1)
  const pageSize = 8

  // Parse price range
  const getPriceBounds = () => {
    if (!priceRange) return {}
    if (priceRange === "200001+") return { min_price: 200001 }
    const [min, max] = priceRange.split("-").map(Number)
    return { min_price: min, max_price: max }
  }

  // Fetch properties using PropertyService.getFilteredProperties
  const fetchProperties = async () => {
    setLoading(true)
    setError("")
    try {
      const filters: any = {
        search_term: location || undefined,
        property_type_filter: propertyType || undefined,
        // areaUnit can be added if needed
        ...getPriceBounds(),
        // Add more filters as needed
      }
      const { data, error, total } = await PropertyService.getFilteredProperties({
        filters,
        sort: sort as any,
        page,
        pageSize,
      })
      if (error) throw error
      setProperties(data || [])
      setTotal(total)
    } catch (err) {
      setError("Failed to load properties.")
      setProperties([])
      setTotal(0)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProperties()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location, propertyType, areaUnit, priceRange, sort, page])

  // Pagination logic
  const totalPages = Math.ceil(total / pageSize)

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
                value={location}
                onChange={e => setLocation(e.target.value)}
              />
            </div>
            <div>
              <Select value={propertyType} onValueChange={setPropertyType}>
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
              <Select value={areaUnit} onValueChange={setAreaUnit}>
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
                <Select value={priceRange} onValueChange={setPriceRange}>
                  <SelectTrigger className="mb-1">
                    <SelectValue placeholder="Select Price Range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="20000-40000">PKR 20,000 - 40,000</SelectItem>
                    <SelectItem value="40001-80000">PKR 40,001 - 80,000</SelectItem>
                    <SelectItem value="80001-120000">PKR 80,001 - 120,000</SelectItem>
                    <SelectItem value="120001-200000">PKR 120,001 - 200,000</SelectItem>
                    <SelectItem value="200001+">PKR 200,001+</SelectItem>
                  </SelectContent>
                </Select>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>PKR 20,000</span>
                  <span>PKR 200,000+</span>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-4 flex justify-center">
            <Button
              className="bg-emerald-600 hover:bg-emerald-700 text-white w-full md:w-auto"
              onClick={() => { setPage(1); fetchProperties() }}
              disabled={loading}
            >
              <Search className="mr-2 h-4 w-4" /> Search Properties
            </Button>
          </div>
        </div>
        
        {/* Properties Grid */}
        <div>
          <div className="flex justify-between items-center mb-8">
            <h2 className="font-poppins text-2xl font-bold">Available Properties</h2>
            <div className="flex gap-2">
              <Select value={sort} onValueChange={v => setSort(v as string)}>
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
          
          {loading ? (
            <div className="text-center py-12">Loading properties...</div>
          ) : error ? (
            <div className="text-center text-red-500 py-12">{error}</div>
          ) : properties.length === 0 ? (
            <div className="text-center py-12">No properties found.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">
              {properties.map((property: PropertyRow) => (
                <PropertyCard 
                  key={property.id}
                  property={property}
                />
              ))}
            </div>
          )}
          
          {/* Pagination */}
          <div className="mt-12 flex justify-center">
            <nav className="flex items-center gap-1">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setPage(page - 1)}
                disabled={page === 1 || loading}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              {[...Array(totalPages)].map((_, idx) => (
                <Button
                  key={idx + 1}
                  variant="outline"
                  size="sm"
                  className={page === idx + 1 ? "bg-primary text-primary-foreground" : ""}
                  onClick={() => setPage(idx + 1)}
                  disabled={loading}
                >
                  {idx + 1}
                </Button>
              ))}
              <Button
                variant="outline"
                size="icon"
                onClick={() => setPage(page + 1)}
                disabled={page === totalPages || loading}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </nav>
          </div>
        </div>
      </div>
    </div>
  )
}